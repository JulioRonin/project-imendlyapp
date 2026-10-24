"use client";

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowUpRight, Banknote, CircleCheck, Clock, Hourglass, Loader2, ShieldCheck, Snowflake } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { apiPost } from '@/lib/api';
import { PLAN, TIER_LABEL, formatMxn, pct, isTier } from '@/lib/pricing';

const EYEBROW = 'text-[10px] font-bold uppercase tracking-[0.18em]';

type Connect = { connected: boolean; detailsSubmitted?: boolean; payoutsEnabled?: boolean; dashboardUrl?: string | null };

function PagosPage() {
  const search = useSearchParams();
  const [connect, setConnect] = useState<Connect | null>(null);
  const [tier, setTier] = useState<string>('verificado');
  const [payouts, setPayouts] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [{ data: prov }, { data: pays }, { data: open }] = await Promise.all([
      supabase.from('providers').select('tier').eq('id', user.id).single(),
      supabase.from('payouts').select('id, kind, amount, created_at, orders(display_id, service_requested)').eq('provider_id', user.id).order('created_at', { ascending: false }).limit(50),
      supabase.from('orders').select('id, display_id, service_requested, status, provider_net, released_amount, confirmed_at, release_at, payout_hold')
        .eq('provider_id', user.id).neq('status', 'cancelled').not('provider_net', 'is', null),
    ]);
    if (prov?.tier) setTier(prov.tier);
    setPayouts(pays || []);
    setPending((open || []).filter(o => Number(o.provider_net) - Number(o.released_amount) > 0.009));
    try { setConnect(await apiPost<Connect>('/api/connect/panel', {})); } catch (e: any) { setError(e.message); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startOnboarding = async () => {
    setBusy(true);
    setError(null);
    try {
      const { url } = await apiPost<{ url: string }>('/api/connect/onboarding', {});
      window.location.href = url;
    } catch (e: any) {
      setError(e.message);
      setBusy(false);
    }
  };

  const received = payouts.reduce((a, p) => a + Number(p.amount), 0);
  const toRelease = pending.reduce((a, o) => a + Number(o.provider_net) - Number(o.released_amount), 0);
  const t = isTier(tier) ? tier : 'verificado';
  const ready = connect?.connected && connect.detailsSubmitted && connect.payoutsEnabled;

  return (
    <div className="flex-1 bg-linen min-h-screen">
      <main className="max-w-5xl mx-auto px-6 md:px-12 pt-10 pb-24">
        <p className={`${EYEBROW} text-primary-deep`}>Tus pagos</p>
        <h1 className="mt-2 text-[34px] md:text-[44px] font-semibold tracking-tight leading-[1.02] text-ink">Lo que ganas, claro y a tiempo</h1>

        {search.get('stripe') === 'listo' && (
          <p className="mt-6 p-4 rounded-[1.5rem] bg-mint-light text-mint-deep text-[13px] font-semibold">
            Listo. Stripe está validando tus datos; en cuanto termine, tus pagos se activan solos.
          </p>
        )}

        {/* Cuenta de cobro */}
        <section className="mt-8 relative overflow-hidden bg-ink rounded-[2.25rem] p-7 md:p-9 text-white">
          <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="relative">
            <p className={`${EYEBROW} text-primary`}>Cuenta de cobro</p>
            {loading ? (
              <Loader2 className="mt-4 animate-spin text-white/60" />
            ) : ready ? (
              <>
                <h2 className="mt-2 text-[24px] font-semibold tracking-tight flex items-center gap-2"><CircleCheck size={22} className="text-mint" /> Pagos activos</h2>
                <p className="mt-2 text-[14px] font-medium text-white/65 max-w-lg">
                  Tu dinero llega a tu cuenta bancaria a través de Stripe. Ahí puedes cambiar tu CLABE y ver cada depósito.
                </p>
                {connect?.dashboardUrl && (
                  <a href={connect.dashboardUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex h-12 px-6 rounded-full bg-white/10 hover:bg-white/15 text-[13px] font-bold items-center gap-2 v2-press">
                    Abrir mi panel de Stripe <ArrowUpRight size={15} />
                  </a>
                )}
              </>
            ) : (
              <>
                <h2 className="mt-2 text-[24px] font-semibold tracking-tight">
                  {connect?.detailsSubmitted ? 'Stripe está revisando tus datos' : 'Configura dónde recibir tus pagos'}
                </h2>
                <p className="mt-2 text-[14px] font-medium text-white/65 max-w-lg">
                  Stripe, nuestro procesador de pagos, te pedirá tu identificación, RFC y la CLABE donde quieres recibir tu dinero.
                  I mendly no ve ni guarda tus datos bancarios. Sin este paso no podemos enviarte pagos.
                </p>
                <button
                  onClick={startOnboarding}
                  disabled={busy}
                  className="mt-6 h-14 px-7 rounded-full bg-primary text-ink text-[13px] font-bold inline-flex items-center gap-2 v2-press disabled:opacity-60"
                >
                  {busy ? <Loader2 size={16} className="animate-spin" /> : <>{connect?.connected ? 'Continuar mi registro' : 'Configurar con Stripe'} <ArrowUpRight size={16} /></>}
                </button>
              </>
            )}
            {error && <p className="mt-4 text-[13px] font-semibold text-rose">{error}</p>}
          </div>
        </section>

        {/* Resumen */}
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-cream rounded-[1.75rem] p-6 v2-shadow-soft">
            <Banknote size={20} className="text-mint-deep" />
            <p className={`${EYEBROW} text-muted mt-4`}>Recibido</p>
            <p className="mt-1 text-[28px] font-semibold tracking-tight text-ink tabular-nums">{formatMxn(received)}</p>
          </div>
          <div className="bg-cream rounded-[1.75rem] p-6 v2-shadow-soft">
            <Hourglass size={20} className="text-primary-deep" />
            <p className={`${EYEBROW} text-muted mt-4`}>Por liberar</p>
            <p className="mt-1 text-[28px] font-semibold tracking-tight text-ink tabular-nums">{formatMxn(toRelease)}</p>
          </div>
          <div className="bg-cream rounded-[1.75rem] p-6 v2-shadow-soft">
            <ShieldCheck size={20} className="text-primary-deep" />
            <p className={`${EYEBROW} text-muted mt-4`}>Tu nivel</p>
            <p className="mt-1 text-[28px] font-semibold tracking-tight text-ink">{TIER_LABEL[t]}</p>
            <p className="text-[12px] font-medium text-muted">Comisión {pct(PLAN.commission[t])} + IVA · tope {formatMxn(PLAN.commissionCap)}</p>
          </div>
        </section>

        {/* Por liberar */}
        {pending.length > 0 && (
          <section className="mt-8">
            <h3 className="text-[19px] font-semibold tracking-tight text-ink mb-4">Pagos en camino</h3>
            <div className="bg-cream rounded-[2rem] v2-shadow-soft divide-y divide-line">
              {pending.map(o => {
                const left = Number(o.provider_net) - Number(o.released_amount);
                const when = o.payout_hold ? 'Congelado por un reporte en revisión'
                  : o.confirmed_at ? `Se libera a partir del ${new Date(o.release_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}`
                  : o.status === 'completed' ? 'Esperando que el cliente confirme'
                  : 'Al terminar y confirmar el trabajo';
                return (
                  <div key={o.id} className="p-5 flex items-center gap-4">
                    <span className="w-11 h-11 shrink-0 rounded-[1rem] bg-primary-light text-primary-deep flex items-center justify-center">
                      {o.payout_hold ? <Snowflake size={17} /> : <Clock size={17} />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-ink truncate">{o.service_requested}</p>
                      <p className="text-[12px] font-medium text-muted">{o.display_id} · {when}</p>
                    </div>
                    <p className="text-[16px] font-semibold text-ink tabular-nums">{formatMxn(left)}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Historial */}
        <section className="mt-8">
          <h3 className="text-[19px] font-semibold tracking-tight text-ink mb-4">Pagos recibidos</h3>
          {payouts.length === 0 ? (
            <p className="bg-cream rounded-[2rem] v2-shadow-soft p-8 text-center text-[14px] font-medium text-muted">
              Aún no hay pagos. Aparecerán aquí en cuanto completes tu primer trabajo.
            </p>
          ) : (
            <div className="bg-cream rounded-[2rem] v2-shadow-soft divide-y divide-line">
              {payouts.map(p => (
                <div key={p.id} className="p-5 flex items-center gap-4">
                  <span className="w-11 h-11 shrink-0 rounded-[1rem] bg-mint-light text-mint-deep flex items-center justify-center"><Banknote size={17} /></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-ink truncate">{p.orders?.service_requested || 'Servicio'}</p>
                    <p className="text-[12px] font-medium text-muted">
                      {p.kind === 'advance' ? 'Adelanto para materiales' : 'Pago final'} · {p.orders?.display_id} · {new Date(p.created_at).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                  <p className="text-[16px] font-semibold text-mint-deep tabular-nums">+{formatMxn(Number(p.amount))}</p>
                </div>
              ))}
            </div>
          )}
          <p className="mt-4 text-[12px] font-medium text-faint">
            Los pagos se envían a tu saldo de Stripe y de ahí a tu banco según el calendario de depósitos de tu cuenta.
          </p>
        </section>
      </main>
    </div>
  );
}

export default function PagosPageWrapper() {
  return (
    <Suspense fallback={<div className="flex-1 bg-linen min-h-screen" />}>
      <PagosPage />
    </Suspense>
  );
}
