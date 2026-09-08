"use client";

import { useParams, useRouter } from 'next/navigation';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { ArrowLeft, MapPin, MessageCircle, XCircle, ShieldCheck, Smartphone, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect , Suspense} from 'react';
import { supabase } from '../../../../lib/supabase';
import { ClientNav } from '@/components/client/ClientNav';
import { Reveal } from '@/components/client/ui';

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
  { id: 'en-camino', label: 'En Camino', description: 'El profesional está dirigiéndose a tu ubicación.', active: false, done: false },
  { id: 'finalizado', label: 'Finalizado', description: 'Servicio completado. Liberación de fondos pendiente.', active: false, done: false },
];

/** Pill semántica de estado (status en minúsculas de la BD). */
const statusPill = (status: string) => {
  if (status === 'completed' || status === 'paid') return { label: 'Completado', cls: 'bg-[#F6E6DD] text-[#2A9460]' };
  if (status === 'cancelled') return { label: 'Cancelado', cls: 'bg-red-50 text-red-600' };
  if (status === 'pending') return { label: 'Pendiente', cls: 'bg-amber-50 text-amber-700' };
  if (status === 'scheduled') return { label: 'Agendado', cls: 'bg-[#F6E6DD] text-[#2A9460]' };
  if (status === 'in_progress') return { label: 'En progreso', cls: 'bg-[#F6E6DD] text-[#2A9460]' };
  return { label: status, cls: 'bg-[#F6E6DD] text-[#2A9460]' };
};

function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

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
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  const handleCancel = async () => {
    if (!selectedReason) return alert("Por favor selecciona una razón");
    setCancelling(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          cancellation_reason: selectedReason
        })
        .eq('id', orderId);

      if (error) throw error;
      setOrder({ ...order, status: 'cancelled' });
      setIsCancelModalOpen(false);
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert("Error al cancelar la orden");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F4F0E8] flex items-center justify-center">
      <Loader2 size={40} className="text-primary animate-spin" />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-[#F4F0E8] flex flex-col items-center justify-center px-8 text-center">
      <span className="w-20 h-20 rounded-[1.5rem] bg-[#F6E6DD] text-primary flex items-center justify-center mb-6">
        <XCircle size={32} strokeWidth={1.8} />
      </span>
      <h2 className="text-[19px] font-semibold tracking-tight text-[#1F1C18] mb-2">Orden no encontrada</h2>
      <p className="text-[14px] font-medium text-[#7B7267] mb-8">El enlace es inválido o la orden ya no existe.</p>
      <Link
        href="/cliente"
        className="h-14 px-8 inline-flex items-center rounded-full bg-primary text-white text-[13px] font-bold shadow-lg shadow-primary/25 v2-press hover:bg-primary-dark transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );

  const provider = order.providers;
  const providerUser = provider.users;
  const serviceName = order.service_requested;
  const total = `$${order.total_amount.toLocaleString('es-MX')}`;

  const getStages = (status: string) => [
    { id: 'solicitado', label: 'Solicitado', description: 'Esperando que el proveedor acepte el requerimiento.', active: status === 'pending', done: ['scheduled', 'in_progress', 'completed'].includes(status) || status === 'pending' },
    { id: 'confirmado', label: 'Confirmado', description: 'El profesional ha aceptado tu servicio y está agendado.', active: status === 'scheduled', done: ['in_progress', 'completed'].includes(status) },
    { id: 'en-camino', label: 'En Camino', description: 'El profesional está dirigiéndose a tu ubicación.', active: status === 'in_progress', done: status === 'completed' },
    { id: 'finalizado', label: 'Finalizado', description: 'Servicio completado. Liberación de fondos pendiente.', active: false, done: status === 'completed' },
  ];

  const stages = getStages(order.status);
  const pill = statusPill(order.status);

  return (
    <main className="min-h-screen bg-[#F4F0E8] pb-36">
      {/* ── Header interno v2 ── */}
      <header className="v2-rise sticky top-0 z-50 bg-[#F4F0E8]/85 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link
            href="/cliente"
            aria-label="Volver al inicio"
            className="w-12 h-12 shrink-0 rounded-full bg-white v2-shadow-soft flex items-center justify-center text-[#1F1C18] v2-press"
          >
            <ArrowLeft size={19} />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary tabular-nums">
              Orden · {order.display_id}
            </p>
            <h1 className="text-[22px] font-semibold tracking-tight text-[#1F1C18] leading-tight truncate">
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
        <section className="v2-rise v2-d1 relative overflow-hidden rounded-[2.25rem] bg-[#1F1C18] text-white p-8 md:p-10 v2-shadow-float">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
          <div className="relative flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-3">
                Monto del servicio
              </p>
              <p className="text-[44px] md:text-[52px] font-bold tracking-tight leading-none tabular-nums">
                {total}
              </p>
              <p className="text-[13px] font-medium text-white/50 mt-3">{serviceName}</p>
            </div>
            <span className={`shrink-0 inline-flex items-center h-9 px-4 rounded-full text-[11px] font-bold ${order.status === 'cancelled' ? 'bg-red-500/15 text-red-300' : 'bg-primary/15 text-primary'}`}>
              {order.status === 'cancelled' ? 'Cancelado' : 'Pagado'}
            </span>
          </div>
        </section>

        {/* ── Etapas del servicio — timeline vertical ── */}
        <section className="v2-rise v2-d2 bg-white rounded-[2.25rem] p-7 md:p-9 v2-shadow-soft">
          <h2 className="text-xl font-semibold tracking-tight text-[#1F1C18] mb-8">Etapas del servicio</h2>

          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-black/[0.06]" />

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
                        <span className="w-4 h-4 rounded-full bg-white border-2 border-primary" />
                      </>
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-white border-2 border-black/[0.08]" />
                    )}
                  </span>

                  {/* Tarjeta de etapa */}
                  <div className={`flex-1 rounded-[1.25rem] p-4 transition-colors ${stage.active && !stage.done ? 'bg-[#F6E6DD]' : stage.done ? 'bg-[#FBF8F2]' : ''}`}>
                    <div className="flex items-center gap-2.5 mb-1">
                      <h4 className={`text-[14.5px] font-semibold tracking-tight ${stage.active || stage.done ? 'text-[#1F1C18]' : 'text-[#ADA398]'}`}>
                        {stage.label}
                      </h4>
                      {stage.active && !stage.done && (
                        <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-primary text-white text-[10px] font-bold">
                          Actual
                        </span>
                      )}
                    </div>
                    <p className={`text-[13px] font-medium leading-relaxed max-w-md ${stage.active || stage.done ? 'text-[#7B7267]' : 'text-[#ADA398]'}`}>
                      {stage.description}
                    </p>
                  </div>
                </div>
              ))}

              {order.status === 'cancelled' && (
                <div className="relative flex gap-5 items-start">
                  <span className="relative z-10 mt-4 w-4 h-4 shrink-0 flex items-center justify-center">
                    <span className="w-4 h-4 rounded-full bg-red-500" />
                  </span>
                  <div className="flex-1 rounded-[1.25rem] p-4 bg-red-50">
                    <h4 className="text-[14.5px] font-semibold tracking-tight text-red-600 mb-1">Servicio cancelado</h4>
                    <p className="text-[13px] font-medium leading-relaxed text-red-500/80">
                      Esta orden ha sido cancelada por el cliente.
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
            <section className="bg-white rounded-[2.25rem] p-7 md:p-8 v2-shadow-soft space-y-7 h-full">
              <div className="flex items-center gap-5">
                <Avatar
                  src={providerUser.avatar_url}
                  name={providerUser.full_name}
                  className="w-20 h-20 text-xl ring-4 ring-[#F6E6DD]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-1">Tu profesional</p>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-[19px] font-semibold tracking-tight text-[#1F1C18] truncate">
                      {providerUser.full_name}
                    </h3>
                    {provider.is_top && (
                      <span className="w-6 h-6 shrink-0 bg-[#1F1C18] rounded-full flex items-center justify-center text-[10px] text-white font-bold italic">
                        M
                      </span>
                    )}
                  </div>
                  {provider.is_verified && (
                    <span className="mt-2 inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-[#F6E6DD] text-[#2A9460] text-[11px] font-bold">
                      <ShieldCheck size={13} /> Verificado
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="h-14 rounded-full bg-primary text-white text-[13px] font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-primary/25 v2-press hover:bg-primary-dark transition-colors">
                  <MessageCircle size={16} /> Abrir chat
                </button>
                <button className="h-14 rounded-full bg-white border border-black/[0.06] text-[#1F1C18] text-[13px] font-semibold flex items-center justify-center gap-2.5 v2-press hover:bg-[#FBF8F2] transition-colors">
                  <Smartphone size={16} /> Llamar
                </button>
              </div>

              {order.status !== 'cancelled' && order.status !== 'completed' && (
                <button
                  onClick={() => setIsCancelModalOpen(true)}
                  className="w-full h-12 rounded-full text-red-500 hover:bg-red-50 text-[13px] font-semibold flex items-center justify-center gap-2 v2-press transition-colors"
                >
                  <XCircle size={16} /> Cancelar servicio
                </button>
              )}
            </section>
          </Reveal>

          {/* ── Detalles del servicio ── */}
          <Reveal delay={90}>
            <section className="bg-white rounded-[2.25rem] p-7 md:p-8 v2-shadow-soft h-full">
              <h2 className="text-xl font-semibold tracking-tight text-[#1F1C18] mb-7">Detalles del servicio</h2>

              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ADA398] mb-1.5">
                    Servicio contratado
                  </p>
                  <p className="text-[15px] font-semibold text-[#1F1C18]">{serviceName}</p>
                </div>

                <div className="pt-5 border-t border-black/[0.06]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ADA398] mb-1.5">
                    Ubicación
                  </p>
                  <p className="text-[15px] font-semibold text-[#1F1C18] flex items-center gap-2">
                    <MapPin size={15} className="shrink-0 text-primary" /> {order.address}
                  </p>
                </div>

                <div className="pt-5 border-t border-black/[0.06] flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ADA398] mb-1.5">
                      Monto pagado
                    </p>
                    <p className="text-[28px] font-bold tracking-tight text-[#1F1C18] tabular-nums">{total}</p>
                  </div>
                  <span className={`inline-flex items-center h-8 px-3.5 rounded-full text-[11px] font-bold ${order.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-[#F6E6DD] text-[#2A9460]'}`}>
                    {order.status === 'cancelled' ? 'Cancelado' : 'Pagado'}
                  </span>
                </div>
              </div>
            </section>
          </Reveal>
        </div>
      </div>

      {/* ── Modal de cancelación ── */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-[#1F1C18]/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="v2-scale max-w-md w-full bg-white rounded-[2.25rem] p-8 v2-shadow-float">
            <h3 className="text-[22px] font-semibold tracking-tight text-[#1F1C18] mb-2">Cancelar servicio</h3>
            <p className="text-[13.5px] font-medium text-[#7B7267] leading-relaxed mb-7">
              Lamentamos que quieras cancelar. Por favor dinos la razón para mejorar nuestro servicio.
            </p>

            <div className="space-y-2 mb-8">
              {CANCEL_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className={`w-full px-4 py-3.5 rounded-[1.25rem] text-left flex items-center gap-3.5 v2-press transition-colors ${
                    selectedReason === reason ? 'bg-[#F6E6DD]' : 'bg-[#FBF8F2] hover:bg-[#F4F0E8]'
                  }`}
                >
                  <span className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedReason === reason ? 'border-primary' : 'border-black/[0.12]'
                  }`}>
                    {selectedReason === reason && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </span>
                  <span className={`text-[13.5px] font-semibold ${selectedReason === reason ? 'text-[#1F1C18]' : 'text-[#7B7267]'}`}>
                    {reason}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="flex-1 h-14 rounded-full bg-white border border-black/[0.06] text-[#1F1C18] text-[13px] font-semibold v2-press hover:bg-[#FBF8F2] transition-colors"
              >
                Volver
              </button>
              <button
                disabled={!selectedReason || cancelling}
                onClick={handleCancel}
                className="flex-1 h-14 rounded-full bg-[#DC2626] text-white text-[13px] font-bold shadow-lg shadow-red-200 v2-press hover:bg-red-700 transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                {cancelling ? 'Cancelando…' : 'Confirmar'}
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
    <Suspense fallback={<div className="min-h-screen bg-[#F4F0E8]" />}>
      <OrderDetailsPage />
    </Suspense>
  );
}
