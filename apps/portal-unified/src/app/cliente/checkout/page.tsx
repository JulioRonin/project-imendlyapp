"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { ArrowLeft, ArrowRight, Check, Loader2, MapPin, ShieldCheck } from 'lucide-react';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { apiPost } from '@/lib/api';
import { PLAN, quote, isTier, formatMxn, type Quote } from '@/lib/pricing';
import { LEGAL_LINKS } from '@/lib/legal';
import { RequireSession } from '@/components/auth/RequireSession';
import { PriceBreakdown } from '@/components/payments/PriceBreakdown';
import { StripePay, type PayResult } from '@/components/payments/StripePay';

const CUSTOM = 'Personalizado o Explica tu necesidad';

/** "05:00 p.m." → "17:00" */
function to24h(label: string | null) {
  if (!label) return null;
  const m = label.replace(/\./g, '').toLowerCase().match(/(\d{1,2}):(\d{2})\s*(am|pm)?/);
  if (!m) return null;
  let h = Number(m[1]);
  if (m[3] === 'pm' && h < 12) h += 12;
  if (m[3] === 'am' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${m[2]}`;
}

function CheckoutPage() {
  const router = useRouter();
  const params = useSearchParams();
  const providerId = params.get('providerId');
  const date = params.get('date');
  const time = params.get('time');

  // Servicios elegidos en el perfil. El total de la URL se ignora: el precio
  // lo calcula el servidor con los precios publicados del profesional.
  const { services, customText } = useMemo(() => {
    const raw = (params.get('services') || '').split(',').map(s => s.trim()).filter(Boolean);
    const custom = raw.find(s => s.startsWith('(Custom:'));
    return {
      services: raw.filter(s => !s.startsWith('(Custom:')),
      customText: custom ? custom.replace(/^\(Custom:\s*/, '').replace(/\)$/, '') : '',
    };
  }, [params]);

  const [provider, setProvider] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [addressId, setAddressId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<{ orderId: string; clientSecret: string; quote: Quote } | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (providerId) {
        const { data } = await supabase
          .from('providers')
          .select('id, tier, categories, users(full_name, avatar_url), provider_services(name, price)')
          .eq('id', providerId)
          .single();
        if (data) setProvider(data);
      }
      if (user) {
        const { data: addr } = await supabase.from('user_addresses').select('*').eq('user_id', user.id);
        setAddresses(addr || []);
        if (addr?.length) setAddressId(addr[0].id);
      }
      setLoading(false);
    })();
  }, [providerId]);

  // Vista previa con los precios publicados (el servidor recalcula al reservar)
  const preview = useMemo(() => {
    if (!provider) return null;
    const prices = (provider.provider_services || []).filter((s: any) => services.includes(s.name));
    const subtotal = prices.reduce((a: number, s: any) => a + Number(s.price), 0) + (services.includes(CUSTOM) ? PLAN.customRequestFee : 0);
    return { lines: prices as { name: string; price: number }[], q: quote(subtotal, isTier(provider.tier) ? provider.tier : 'verificado', 100) };
  }, [provider, services]);

  const startPayment = async () => {
    setCreating(true);
    setError(null);
    try {
      const hhmm = to24h(time);
      const scheduledAt = date && hhmm ? new Date(`${date}T${hhmm}:00`).toISOString() : undefined;
      const res = await apiPost<{ orderId: string; clientSecret: string; quote: Quote }>('/api/reservas', {
        providerId, services, customText, scheduledAt, addressId,
      });
      setPayment(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  };

  const done = (r: PayResult) => router.push(`/cliente/ordenes/${payment!.orderId}?pago=${r}`);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-linen text-muted"><Loader2 className="animate-spin" /></div>;
  }

  if (!provider || !preview || services.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linen">
        <div className="text-center px-8">
          <h1 className="text-[22px] font-semibold tracking-tight text-ink mb-3">Servicio no encontrado</h1>
          <p className="text-[14px] font-medium text-muted mb-8 max-w-xs mx-auto">El enlace es inválido o el profesional ya no está disponible.</p>
          <button onClick={() => router.push('/cliente')} className="h-14 px-8 rounded-full bg-primary text-ink text-[13px] font-bold v2-press">Ir al inicio</button>
        </div>
      </div>
    );
  }

  const q = payment?.quote ?? preview.q;
  const name = provider.users?.full_name || 'Profesional';

  return (
    <main className="min-h-screen bg-linen pb-12">
      <header className="v3-blur-in sticky top-0 z-50 bg-linen/85 backdrop-blur-xl">
        <div className="max-w-md mx-auto px-6 py-5 flex items-center gap-4">
          <button
            onClick={() => (payment ? router.push(`/cliente/ordenes/${payment.orderId}`) : router.back())}
            aria-label="Volver"
            className="w-12 h-12 shrink-0 rounded-full bg-cream v2-shadow-soft flex items-center justify-center text-ink v2-press"
          >
            <ArrowLeft size={19} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep">{payment ? 'Paso 2 de 2' : 'Paso 1 de 2'}</p>
            <h1 className="text-[22px] font-semibold tracking-tight text-ink leading-tight">{payment ? 'Pago seguro' : 'Revisa tu reserva'}</h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 mt-2 space-y-5">
        <section className="v2-rise v2-d1 bg-cream rounded-[2.25rem] v2-shadow-soft p-6">
          <div className="flex items-center gap-3.5 mb-5">
            <Avatar src={provider.users?.avatar_url} name={name} size="md" />
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold tracking-tight text-ink truncate">{name}</h3>
              <p className="text-[12px] font-medium text-muted">
                {provider.categories?.[0] || 'Servicio'}
                {date ? ` · ${new Date(`${date}T12:00:00`).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })}` : ''}
                {time ? ` · ${time}` : ''}
              </p>
            </div>
          </div>
          <div className="space-y-2 pb-4 mb-4 border-b border-line">
            {preview.lines.map(l => (
              <div key={l.name} className="flex justify-between gap-4 text-[13px]">
                <span className="font-medium text-muted truncate">{l.name}</span>
                <span className="font-semibold text-ink tabular-nums">{formatMxn(Number(l.price))}</span>
              </div>
            ))}
            {services.includes(CUSTOM) && (
              <div className="flex justify-between gap-4 text-[13px]">
                <span className="font-medium text-muted truncate">Visita de cotización</span>
                <span className="font-semibold text-ink tabular-nums">{formatMxn(PLAN.customRequestFee)}</span>
              </div>
            )}
          </div>
          <PriceBreakdown subtotal={q.subtotal} clientFee={q.clientFee} total={q.total} />
        </section>

        {!payment && addresses.length > 0 && (
          <section className="v2-rise v2-d2 bg-cream rounded-[2.25rem] v2-shadow-soft p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-3">Dirección del servicio</p>
            <div className="space-y-2">
              {addresses.map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAddressId(a.id)}
                  className={`w-full p-4 rounded-[1.25rem] flex items-center gap-3 text-left v2-press ${addressId === a.id ? 'bg-primary-light ring-2 ring-primary' : 'bg-sand'}`}
                >
                  <MapPin size={16} className="shrink-0 text-primary-deep" />
                  <span className="flex-1 min-w-0 text-[13.5px] font-semibold text-ink truncate">{a.street}, {a.city}</span>
                  {addressId === a.id && <Check size={15} className="shrink-0" />}
                </button>
              ))}
            </div>
          </section>
        )}

        {payment ? (
          <section className="v2-rise bg-cream rounded-[2.25rem] v2-shadow-soft p-6">
            <StripePay
              clientSecret={payment.clientSecret}
              amount={payment.quote.total}
              returnUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/cliente/ordenes/${payment.orderId}?pago=processing`}
              onDone={done}
            />
          </section>
        ) : (
          <>
            <div className="rounded-[1.75rem] bg-primary-light p-5 flex items-start gap-4">
              <span className="w-11 h-11 shrink-0 rounded-[1rem] bg-cream text-primary-deep flex items-center justify-center"><ShieldCheck size={20} /></span>
              <p className="text-[12.5px] font-medium text-ink/80 leading-relaxed">
                <strong className="font-semibold text-ink">Tu pago queda protegido.</strong> El profesional lo recibe {PLAN.holdHours} h después de que
                confirmes que el trabajo quedó bien. Si cancela o no se presenta, te devolvemos todo.
              </p>
            </div>
            {error && <p className="p-4 rounded-[1.25rem] bg-rose/15 text-error text-[13px] font-semibold text-center">{error}</p>}
            <button
              onClick={startPayment}
              disabled={creating}
              className="w-full h-14 rounded-full bg-primary text-ink text-[13px] font-bold flex items-center justify-center gap-2 v2-press hover:bg-primary-dark disabled:opacity-60"
            >
              {creating ? <Loader2 size={16} className="animate-spin" /> : <>Continuar al pago <ArrowRight size={16} /></>}
            </button>
            <p className="text-center text-[11.5px] font-medium text-faint leading-relaxed">
              Al continuar aceptas los <Link href={LEGAL_LINKS.terminos} className="underline text-ink">Términos</Link> y la{' '}
              <Link href={LEGAL_LINKS.garantia} className="underline text-ink">Garantía I mendly</Link>.
            </p>
          </>
        )}
      </div>
    </main>
  );
}

// useSearchParams requiere un límite de Suspense para el prerender de producción
export default function CheckoutPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-linen" />}>
      <RequireSession
        title="Casi listo para solicitar"
        text="Crea tu cuenta para continuar: así tu pago queda protegido por la Garantía I mendly."
        showNav={false}
      >
        <CheckoutPage />
      </RequireSession>
    </Suspense>
  );
}
