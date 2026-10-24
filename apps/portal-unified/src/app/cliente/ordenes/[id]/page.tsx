"use client";

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { ArrowLeft, MapPin, MessageCircle, XCircle, ShieldCheck, Smartphone, Loader2, CircleCheck, Clock, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect , Suspense} from 'react';
import { supabase } from '../../../../lib/supabase';
import { ClientNav } from '@/components/client/ClientNav';
import { Reveal } from '@/components/client/ui';
import { RequireSession } from '@/components/auth/RequireSession';
import { apiPost } from '@/lib/api';
import { PLAN, formatMxn } from '@/lib/pricing';
import { LEGAL_LINKS } from '@/lib/legal';
import { PriceBreakdown } from '@/components/payments/PriceBreakdown';
import { StripePay } from '@/components/payments/StripePay';

/** ¿Qué le toca pagar al cliente ahora? */
function paymentDue(o: any): { kind: 'full' | 'deposit' | 'balance'; amount: number } | null {
  if (o.status === 'cancelled') return null;
  if (o.origin === 'booking' && o.payment_status === 'pending') return { kind: 'full', amount: Number(o.total_amount) };
  if (o.origin === 'project' && Number(o.deposit_amount) > 0 && o.payment_status === 'pending') return { kind: 'deposit', amount: Number(o.deposit_amount) };
  if (o.status === 'completed' && !o.confirmed_at && Number(o.balance_amount) > 0 && o.payment_status !== 'paid') return { kind: 'balance', amount: Number(o.balance_amount) };
  return null;
}

/** Etiqueta honesta del estado del dinero (nunca "Pagado" si no lo está). */
function paymentLabel(o: any): { label: string; cls: string } {
  if (Number(o.refunded_amount) > 0 || o.payment_status === 'refunded') return { label: 'Reembolsado', cls: 'bg-sand text-muted' };
  if (o.status === 'cancelled') return { label: 'Cancelado', cls: 'bg-rose/20 text-rose' };
  if (o.payment_status === 'paid') return { label: 'Pagado', cls: 'bg-mint-light text-mint-deep' };
  if (o.payment_status === 'deposit_paid') return { label: 'Anticipo pagado', cls: 'bg-mint-light text-mint-deep' };
  if (o.payment_status === 'due_on_delivery') return { label: 'Pagas al terminar', cls: 'bg-primary-light text-primary-deep' };
  if (o.payment_status === 'not_required') return { label: 'Sin costo', cls: 'bg-sand text-muted' };
  if (o.price_status === 'pending_quote') return { label: 'Por cotizar', cls: 'bg-sand text-muted' };
  if (o.price_status === 'quoted') return { label: 'Precio por aprobar', cls: 'bg-primary text-ink' };
  return { label: 'Pago pendiente', cls: 'bg-primary text-ink' };
}

const CANCEL_REASONS = [
  "Encontré otro profesional",
  "El precio es muy alto",
  "Cambio de planes / Ya no lo necesito",
  "El profesional no responde",
  "Error en la solicitud"
];

const STAGES = [
  { id: 'solicitado', label: 'Solicitado', description: 'Esperando que el proveedor acepte el requerimiento.', active: true, done: true },
  { id: 'confirmado', label: 'Confirmado', description: 'El profesional ha aceptado tu servicio y está agendado.', active: true, done: false },
  { id: 'en-camino', label: 'En curso', description: 'El profesional está trabajando en tu servicio.', active: false, done: false },
  { id: 'finalizado', label: 'Finalizado', description: 'Servicio completado. Liberación de fondos pendiente.', active: false, done: false },
];

/** Pill semántica de estado (status en minúsculas de la BD). */
const statusPill = (status: string) => {
  if (status === 'completed' || status === 'paid') return { label: 'Completado', cls: 'bg-mint-light text-mint-deep' };
  if (status === 'cancelled') return { label: 'Cancelado', cls: 'bg-rose/15 text-error' };
  if (status === 'pending') return { label: 'Pendiente', cls: 'bg-primary-light text-warning' };
  if (status === 'scheduled') return { label: 'Agendado', cls: 'bg-mint-light text-mint-deep' };
  if (status === 'in_progress') return { label: 'En progreso', cls: 'bg-mint-light text-mint-deep' };
  return { label: status, cls: 'bg-mint-light text-mint-deep' };
};

function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const search = useSearchParams();
  const payFlag = search.get('pago');

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [pay, setPay] = useState<{ clientSecret: string; amount: number; kind: string } | null>(null);
  const [notice, setNotice] = useState<string | null>(
    payFlag === 'succeeded' ? 'Pago recibido. Estamos actualizando tu orden.' :
    payFlag === 'processing' ? 'Tu pago se está procesando. Si pagaste en OXXO o por SPEI, se confirmará en cuanto llegue el dinero.' : null,
  );
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [lastQuote, setLastQuote] = useState<any>(null);
  const [askOpen, setAskOpen] = useState(false);
  const [askText, setAskText] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, providers!inner(*, users(*))')
          .eq('id', orderId)
          .single();

        if (error) throw error;
        setOrder(data);
        const { data: q } = await supabase.from('order_quotes').select('*')
          .eq('order_id', orderId).order('created_at', { ascending: false }).limit(1).maybeSingle();
        setLastQuote(q);
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId, reloadKey]);

  // Tras pagar, el webhook de Stripe actualiza la orden en segundos
  useEffect(() => {
    if (!payFlag) return;
    const t = setTimeout(() => setReloadKey(k => k + 1), 3500);
    return () => clearTimeout(t);
  }, [payFlag]);

  const act = async (action: string, note?: string) => {
    setBusy(action);
    setActionError(null);
    try {
      await apiPost('/api/ordenes/accion', { orderId, action, note });
      setReloadKey(k => k + 1);
      return true;
    } catch (e: any) {
      setActionError(e.message);
      return false;
    } finally {
      setBusy(null);
    }
  };

  const startPayment = async () => {
    setBusy('pagar');
    setActionError(null);
    try {
      setPay(await apiPost('/api/ordenes/pagar', { orderId }));
    } catch (e: any) {
      setActionError(e.message);
    } finally {
      setBusy(null);
    }
  };

  const handleCancel = async () => {
    if (!selectedReason) return;
    setCancelling(true);
    const ok = await act('cancelar', selectedReason);
    setCancelling(false);
    if (ok) setIsCancelModalOpen(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-linen flex items-center justify-center">
      <Loader2 size={40} className="text-primary-deep animate-spin" />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-linen flex flex-col items-center justify-center px-8 text-center">
      <span className="w-20 h-20 rounded-[1.5rem] bg-primary-light text-primary-deep flex items-center justify-center mb-6">
        <XCircle size={32} strokeWidth={1.8} />
      </span>
      <h2 className="text-[19px] font-semibold tracking-tight text-ink mb-2">Orden no encontrada</h2>
      <p className="text-[14px] font-medium text-muted mb-8">El enlace es inválido o la orden ya no existe.</p>
      <Link
        href="/cliente"
        className="h-14 px-8 inline-flex items-center rounded-full bg-primary text-ink text-[13px] font-bold v2-press hover:bg-primary-dark transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );

  const provider = order.providers;
  const providerUser = provider.users;
  const serviceName = order.service_requested;
  const total = formatMxn(Number(order.total_amount));
  const due = paymentDue(order);
  const payPill = paymentLabel(order);
  const canCancel = order.status === 'pending' || order.status === 'scheduled';
  const releaseDate = order.release_at ? new Date(order.release_at).toLocaleString('es-MX', { weekday: 'long', hour: '2-digit', minute: '2-digit' }) : null;

  const getStages = (status: string) => [
    { id: 'solicitado', label: 'Solicitado', description: 'Esperando que el proveedor acepte el requerimiento.', active: status === 'pending', done: ['scheduled', 'in_progress', 'completed'].includes(status) || status === 'pending' },
    { id: 'confirmado', label: 'Confirmado', description: 'El profesional ha aceptado tu servicio y está agendado.', active: status === 'scheduled', done: ['in_progress', 'completed'].includes(status) },
    { id: 'en-camino', label: 'En Camino', description: 'El profesional está dirigiéndose a tu ubicación.', active: status === 'in_progress', done: status === 'completed' },
    { id: 'finalizado', label: 'Finalizado', description: order.confirmed_at ? 'Confirmaste la entrega. El profesional recibe su pago 24 h después.' : 'El profesional terminó. Revisa el trabajo y confirma la entrega.', active: status === 'completed' && !order.confirmed_at, done: status === 'completed' && !!order.confirmed_at },
  ];

  const stages = getStages(order.status);
  const pill = statusPill(order.status);

  return (
    <main className="min-h-screen bg-linen pb-36">
      {/* ── Header interno v2 ── */}
      <header className="v3-blur-in sticky top-0 z-50 bg-linen/85 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link
            href="/cliente"
            aria-label="Volver al inicio"
            className="w-12 h-12 shrink-0 rounded-full bg-cream v2-shadow-soft flex items-center justify-center text-ink v2-press"
          >
            <ArrowLeft size={19} />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep tabular-nums">
              Orden · {order.display_id}
            </p>
            <h1 className="text-[22px] font-semibold tracking-tight text-ink leading-tight truncate">
              Seguimiento de orden
            </h1>
          </div>
          <span className={`shrink-0 inline-flex items-center h-9 px-4 rounded-full text-[11px] font-bold ${pill.cls}`}>
            {pill.label}
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 mt-2 space-y-6">
        {/* ── Monto — tarjeta ink con glow ── */}
        <section className="v2-rise v2-d1 relative overflow-hidden rounded-[2.25rem] v3-night-grad text-on-dark p-8 md:p-10 v2-shadow-float">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="relative flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-3">
                Monto del servicio
              </p>
              <p className="text-[44px] md:text-[52px] font-bold tracking-tight leading-none tabular-nums">
                {order.price_status === 'pending_quote'
                  ? (order.quote_min != null ? `${formatMxn(Number(order.quote_min))}–${formatMxn(Number(order.quote_max))}` : 'Por cotizar')
                  : total}
              </p>
              <p className="text-[13px] font-medium text-on-dark/50 mt-3">{serviceName}</p>
            </div>
            <span className={`shrink-0 inline-flex items-center h-9 px-4 rounded-full text-[11px] font-bold ${payPill.cls}`}>
              {payPill.label}
            </span>
          </div>
        </section>

        {notice && (
          <div className="p-4 rounded-[1.5rem] bg-mint-light text-mint-deep text-[13px] font-semibold flex items-start gap-2.5">
            <Clock size={16} className="shrink-0 mt-0.5" /> {notice}
            <button onClick={() => setNotice(null)} className="ml-auto text-[12px] underline">Ocultar</button>
          </div>
        )}

        {/* ── Tu pago ── */}
        <section className="v2-rise v2-d2 bg-cream rounded-[2.25rem] p-7 md:p-9 v2-shadow-soft">
          <h2 className="text-xl font-semibold tracking-tight text-ink mb-6">Tu pago</h2>
          {order.price_status === 'pending_quote' && (
            <div className="mb-6 p-5 rounded-[1.5rem] bg-primary-light">
              <p className="text-[14px] font-semibold text-ink">Esperando el precio final</p>
              <p className="mt-1 text-[13px] font-medium text-ink/75">
                {order.quote_min != null
                  ? `Después de la visita, el profesional te enviará el precio final. Acordaron un rango de ${formatMxn(Number(order.quote_min))} a ${formatMxn(Number(order.quote_max))}.`
                  : 'Después de la visita de valoración, el profesional te enviará el precio final.'}
                {' '}No pagas nada hasta que lo apruebes.
              </p>
              {lastQuote?.status === 'rejected' && (
                <p className="mt-2 text-[12.5px] font-medium text-muted">Pediste otro precio: “{lastQuote.client_note}”.</p>
              )}
            </div>
          )}

          {order.price_status === 'quoted' && lastQuote && (
            <div className="mb-6 p-5 rounded-[1.5rem] bg-sand space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep">Precio final propuesto</p>
              {lastQuote.over_range && (
                <p className="p-3 rounded-[1rem] bg-rose/15 text-error text-[12.5px] font-semibold">
                  Supera el máximo que acordaron ({formatMxn(Number(order.quote_max))}). Revisa la explicación antes de aprobar.
                </p>
              )}
              {lastQuote.note && <p className="text-[13.5px] font-medium text-ink/80">“{lastQuote.note}”</p>}
              <p className="text-[12.5px] font-medium text-muted">
                {Number(order.deposit_amount) > 0
                  ? 'Si estás de acuerdo, apruébalo pagando el anticipo. Si no, pide otro precio o cancela sin costo.'
                  : 'Si estás de acuerdo, apruébalo. Pagas al terminar el trabajo.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                {Number(order.deposit_amount) === 0 && (
                  <button onClick={() => act('aprobar')} disabled={busy !== null} className="h-12 px-6 rounded-full bg-ink text-white text-[13px] font-bold v2-press disabled:opacity-60">
                    {busy === 'aprobar' ? 'Aprobando…' : 'Aprobar precio'}
                  </button>
                )}
                <button onClick={() => setAskOpen(v => !v)} className="h-12 px-6 rounded-full bg-cream border border-line text-ink text-[13px] font-semibold v2-press">
                  Pedir otro precio
                </button>
              </div>
              {askOpen && (
                <div className="space-y-2">
                  <textarea
                    value={askText} onChange={e => setAskText(e.target.value)} rows={3}
                    placeholder="Ej. Esperaba que quedara dentro del rango que acordamos…"
                    className="w-full bg-cream rounded-[1.1rem] px-4 py-3 text-[13.5px] font-medium text-ink outline-none focus:ring-2 focus:ring-lavender/60 resize-none"
                  />
                  <button
                    disabled={askText.trim().length < 5 || busy !== null}
                    onClick={async () => { if (await act('pedir_otro_precio', askText)) { setAskOpen(false); setAskText(''); } }}
                    className="h-11 px-5 rounded-full bg-ink text-white text-[12.5px] font-bold v2-press disabled:opacity-40"
                  >
                    Enviar al profesional
                  </button>
                </div>
              )}
            </div>
          )}

          {order.price_status === 'pending_quote' ? null : order.subtotal != null ? (
            <PriceBreakdown
              subtotal={Number(order.subtotal)} clientFee={Number(order.client_fee)} total={Number(order.total_amount)}
              deposit={Number(order.deposit_amount)} balance={Number(order.balance_amount)} depositPercent={order.deposit_percent}
            />
          ) : (
            <p className="text-[14px] font-medium text-muted">Total: <span className="font-semibold text-ink">{total}</span></p>
          )}

          <div className="mt-6 space-y-3">
            {due && !pay && (
              <button
                onClick={startPayment}
                disabled={busy !== null}
                className="w-full h-14 rounded-full bg-ink text-white text-[13px] font-bold flex items-center justify-center gap-2 v2-press disabled:opacity-60"
              >
                {busy === 'pagar' ? <Loader2 size={16} className="animate-spin" /> : <>
                  {due.kind === 'deposit' ? (order.price_status === 'quoted' ? 'Aprobar y pagar anticipo' : 'Pagar anticipo') : due.kind === 'balance' ? 'Pagar saldo y confirmar entrega' : 'Completar pago'} · {formatMxn(due.amount)}
                </>}
              </button>
            )}
            {pay && (
              <StripePay
                clientSecret={pay.clientSecret}
                amount={pay.amount}
                returnUrl={`${window.location.origin}/cliente/ordenes/${orderId}?pago=processing`}
                onDone={(r) => { setPay(null); setNotice(r === 'succeeded' ? 'Pago recibido. Estamos actualizando tu orden.' : 'Tu pago se está procesando.'); setTimeout(() => setReloadKey(k => k + 1), 3500); }}
              />
            )}
            {order.status === 'completed' && !order.confirmed_at && !due && (
              <button
                onClick={() => act('confirmar')}
                disabled={busy !== null}
                className="w-full h-14 rounded-full bg-primary text-ink text-[13px] font-bold flex items-center justify-center gap-2 v2-press disabled:opacity-60"
              >
                {busy === 'confirmar' ? <Loader2 size={16} className="animate-spin" /> : <><CircleCheck size={16} /> El trabajo quedó bien, confirmar entrega</>}
              </button>
            )}
            {order.confirmed_at && (
              <p className="p-4 rounded-[1.25rem] bg-mint-light text-mint-deep text-[13px] font-semibold">
                Confirmaste la entrega. {releaseDate ? `El profesional recibe su pago a partir del ${releaseDate}.` : ''}
              </p>
            )}
            {(order.started_at || order.delivered_at) && order.status !== 'cancelled' && (
              <button onClick={() => setReportOpen(true)} className="w-full h-12 rounded-full text-[13px] font-semibold text-muted hover:text-ink flex items-center justify-center gap-2">
                <TriangleAlert size={15} /> Reportar un problema
              </button>
            )}
            {actionError && <p className="p-4 rounded-[1.25rem] bg-rose/15 text-error text-[13px] font-semibold text-center">{actionError}</p>}
            <p className="text-[11.5px] font-medium text-faint text-center">
              Tienes {PLAN.claimDays} días después de la entrega para reportar un problema. <Link href={LEGAL_LINKS.garantia} className="underline">Así funciona la garantía</Link>.
            </p>
          </div>
        </section>

        {/* ── Etapas del servicio — timeline vertical ── */}
        <section className="v2-rise v2-d2 bg-cream rounded-[2.25rem] p-7 md:p-9 v2-shadow-soft">
          <h2 className="text-xl font-semibold tracking-tight text-ink mb-8">Etapas del servicio</h2>

          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-line" />

            <div className="space-y-3">
              {stages.map((stage) => (
                <div
                  key={stage.id}
                  className={`relative flex gap-5 items-start ${order.status === 'cancelled' ? 'opacity-40 grayscale' : ''}`}
                >
                  {/* Dot */}
                  <span className="relative z-10 mt-4 w-4 h-4 shrink-0 flex items-center justify-center">
                    {stage.done ? (
                      <span className="w-4 h-4 rounded-full bg-primary" />
                    ) : stage.active ? (
                      <>
                        <span className="absolute w-4 h-4 rounded-full bg-primary/30 animate-ping" />
                        <span className="w-4 h-4 rounded-full bg-cream border-2 border-primary" />
                      </>
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-cream border-2 border-faint/40" />
                    )}
                  </span>

                  {/* Tarjeta de etapa */}
                  <div className={`flex-1 rounded-[1.25rem] p-4 transition-colors ${stage.active && !stage.done ? 'bg-primary-light' : stage.done ? 'bg-sand' : ''}`}>
                    <div className="flex items-center gap-2.5 mb-1">
                      <h4 className={`text-[14.5px] font-semibold tracking-tight ${stage.active || stage.done ? 'text-ink' : 'text-faint'}`}>
                        {stage.label}
                      </h4>
                      {stage.active && !stage.done && (
                        <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-primary text-ink text-[10px] font-bold">
                          Actual
                        </span>
                      )}
                    </div>
                    <p className={`text-[13px] font-medium leading-relaxed max-w-md ${stage.active || stage.done ? 'text-muted' : 'text-faint'}`}>
                      {stage.description}
                    </p>
                  </div>
                </div>
              ))}

              {order.status === 'cancelled' && (
                <div className="relative flex gap-5 items-start">
                  <span className="relative z-10 mt-4 w-4 h-4 shrink-0 flex items-center justify-center">
                    <span className="w-4 h-4 rounded-full bg-rose/150" />
                  </span>
                  <div className="flex-1 rounded-[1.25rem] p-4 bg-rose/15">
                    <h4 className="text-[14.5px] font-semibold tracking-tight text-error mb-1">Servicio cancelado</h4>
                    <p className="text-[13px] font-medium leading-relaxed text-error/80">
                      Esta orden se canceló.{Number(order.refunded_amount) > 0 ? ` Te devolvimos ${formatMxn(Number(order.refunded_amount))}.` : Number(order.paid_amount) > 0 ? ' Tu reembolso está en proceso.' : ''}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* ── Tu profesional ── */}
          <Reveal>
            <section className="bg-cream rounded-[2.25rem] p-7 md:p-8 v2-shadow-soft space-y-7 h-full">
              <div className="flex items-center gap-5">
                <Avatar
                  src={providerUser.avatar_url}
                  name={providerUser.full_name}
                  className="w-20 h-20 text-xl ring-4 ring-primary-light"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep mb-1">Tu profesional</p>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-[19px] font-semibold tracking-tight text-ink truncate">
                      {providerUser.full_name}
                    </h3>
                    {provider.is_top && (
                      <span className="w-6 h-6 shrink-0 bg-ink rounded-full flex items-center justify-center text-[10px] text-on-dark font-bold italic">
                        M
                      </span>
                    )}
                  </div>
                  {provider.is_verified && (
                    <span className="mt-2 inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-mint-light text-mint-deep text-[11px] font-bold">
                      <ShieldCheck size={13} /> Verificado
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="h-14 rounded-full bg-primary text-ink text-[13px] font-bold flex items-center justify-center gap-2.5 v2-press hover:bg-primary-dark transition-colors">
                  <MessageCircle size={16} /> Abrir chat
                </button>
                <button className="h-14 rounded-full bg-cream border border-line text-ink text-[13px] font-semibold flex items-center justify-center gap-2.5 v2-press hover:bg-sand transition-colors">
                  <Smartphone size={16} /> Llamar
                </button>
              </div>

              {canCancel && (
                <button
                  onClick={() => setIsCancelModalOpen(true)}
                  className="w-full h-12 rounded-full text-error hover:bg-rose/15 text-[13px] font-semibold flex items-center justify-center gap-2 v2-press transition-colors"
                >
                  <XCircle size={16} /> Cancelar servicio
                </button>
              )}
            </section>
          </Reveal>

          {/* ── Detalles del servicio ── */}
          <Reveal delay={90}>
            <section className="bg-cream rounded-[2.25rem] p-7 md:p-8 v2-shadow-soft h-full">
              <h2 className="text-xl font-semibold tracking-tight text-ink mb-7">Detalles del servicio</h2>

              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-faint mb-1.5">
                    Servicio contratado
                  </p>
                  <p className="text-[15px] font-semibold text-ink">{serviceName}</p>
                </div>

                <div className="pt-5 border-t border-line">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-faint mb-1.5">
                    Ubicación
                  </p>
                  <p className="text-[15px] font-semibold text-ink flex items-center gap-2">
                    <MapPin size={15} className="shrink-0 text-primary-deep" /> {order.address}
                  </p>
                </div>

                <div className="pt-5 border-t border-line flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-faint mb-1.5">
                      Pagado hasta ahora
                    </p>
                    <p className="text-[28px] font-bold tracking-tight text-ink tabular-nums">{formatMxn(Number(order.paid_amount || 0))}</p>
                  </div>
                  <span className={`inline-flex items-center h-8 px-3.5 rounded-full text-[11px] font-bold ${payPill.cls}`}>
                    {payPill.label}
                  </span>
                </div>
              </div>
            </section>
          </Reveal>
        </div>
      </div>

      {/* ── Modal de cancelación ── */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-ink/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="v2-scale max-w-md w-full bg-cream rounded-[2.25rem] p-8 v2-shadow-float">
            <h3 className="text-[22px] font-semibold tracking-tight text-ink mb-2">Cancelar servicio</h3>
            <p className="text-[13.5px] font-medium text-muted leading-relaxed mb-7">
              Como el trabajo no ha iniciado, te devolvemos todo lo que pagaste al mismo medio de pago. Dinos la razón para mejorar.
            </p>

            <div className="space-y-2 mb-8">
              {CANCEL_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className={`w-full px-4 py-3.5 rounded-[1.25rem] text-left flex items-center gap-3.5 v2-press transition-colors ${
                    selectedReason === reason ? 'bg-primary-light' : 'bg-sand hover:bg-sand'
                  }`}
                >
                  <span className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedReason === reason ? 'border-primary' : 'border-faint/40'
                  }`}>
                    {selectedReason === reason && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </span>
                  <span className={`text-[13.5px] font-semibold ${selectedReason === reason ? 'text-ink' : 'text-muted'}`}>
                    {reason}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="flex-1 h-14 rounded-full bg-cream border border-line text-ink text-[13px] font-semibold v2-press hover:bg-sand transition-colors"
              >
                Volver
              </button>
              <button
                disabled={!selectedReason || cancelling}
                onClick={handleCancel}
                className="flex-1 h-14 rounded-full bg-error text-on-dark text-[13px] font-bold v2-press transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                {cancelling ? 'Cancelando…' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {reportOpen && (
        <div className="fixed inset-0 bg-ink/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="v2-scale max-w-md w-full bg-cream rounded-[2.25rem] p-8 v2-shadow-float">
            <h3 className="text-[22px] font-semibold tracking-tight text-ink mb-2">Reportar un problema</h3>
            <p className="text-[13.5px] font-medium text-muted leading-relaxed mb-5">
              Congelamos el pago al profesional mientras nuestro equipo revisa. Describe qué pasó; después te pediremos fotos.
            </p>
            <textarea
              value={reportText}
              onChange={e => setReportText(e.target.value)}
              rows={4}
              placeholder="Ej. La fuga volvió a salir al día siguiente…"
              className="w-full bg-sand rounded-[1.25rem] px-5 py-4 text-[14px] font-medium text-ink outline-none focus:ring-2 focus:ring-lavender/60 resize-none"
            />
            {actionError && <p className="mt-3 text-[12.5px] font-semibold text-error">{actionError}</p>}
            <div className="mt-6 flex gap-3">
              <button onClick={() => setReportOpen(false)} className="flex-1 h-14 rounded-full bg-cream border border-line text-ink text-[13px] font-semibold v2-press">Volver</button>
              <button
                disabled={reportText.trim().length < 10 || busy !== null}
                onClick={async () => { if (await act('reportar', reportText)) { setReportOpen(false); setNotice('Recibimos tu reporte. El pago al profesional queda congelado mientras lo revisamos.'); } }}
                className="flex-1 h-14 rounded-full bg-ink text-white text-[13px] font-bold v2-press disabled:opacity-40"
              >
                {busy === 'reportar' ? 'Enviando…' : 'Enviar reporte'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ClientNav />
    </main>
  );
}

// useSearchParams requiere un límite de Suspense para el prerender de producción
export default function OrderDetailsPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-linen" />}>
      <RequireSession
        title="Detalle de tu orden"
        text="Inicia sesión para ver el seguimiento de tu servicio."
        showNav={true}
      >
        <OrderDetailsPage />
      </RequireSession>
    </Suspense>
  );
}
