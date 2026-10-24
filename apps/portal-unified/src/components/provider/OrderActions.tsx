"use client";

import { useState } from 'react';
import { CircleCheck, Clock, Hammer, Loader2, PackageCheck, Snowflake, Wallet } from 'lucide-react';
import { apiPost } from '@/lib/api';
import { PLAN, formatMxn } from '@/lib/pricing';

const EYEBROW = 'text-[10px] font-bold uppercase tracking-[0.18em]';

/**
 * Acciones del profesional sobre una orden y lo que va a cobrar.
 * Todas pasan por el servidor (/api/ordenes/accion): la base de datos no
 * acepta cambios de estado desde el navegador.
 */
export function OrderActions({ order, onChanged }: { order: any; onChanged: (patch: Record<string, unknown>) => void }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const run = async (action: string, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(action);
    setError(null);
    setInfo(null);
    try {
      const res = await apiPost<{ status?: string; advance?: { released?: number; skipped?: string } | null }>('/api/ordenes/accion', { orderId: order.id, action });
      if (res.status) onChanged({ status: res.status });
      if (res.advance && 'released' in res.advance && res.advance.released) setInfo(`Te enviamos ${formatMxn(res.advance.released)} de adelanto para materiales.`);
      else if (res.advance?.skipped) setInfo(`Adelanto pendiente: ${res.advance.skipped}.`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  };

  const net = Number(order.provider_net || 0);
  const fee = Number(order.commission || 0) + Number(order.commission_tax || 0);
  const advance = Number(order.advance_amount || 0);
  const depositPending = order.origin === 'project' && Number(order.deposit_amount) > 0 && order.payment_status === 'pending';
  const bookingUnpaid = order.origin === 'booking' && order.payment_status !== 'paid';

  const Btn = ({ action, label, tone = 'primary', confirmText }: { action: string; label: string; tone?: 'primary' | 'ghost' | 'danger'; confirmText?: string }) => (
    <button
      type="button"
      onClick={() => run(action, confirmText)}
      disabled={busy !== null}
      className={`h-14 px-7 rounded-full text-[13px] font-bold flex items-center justify-center gap-2 v2-press disabled:opacity-60 ${
        tone === 'primary' ? 'bg-primary text-ink hover:bg-primary-dark shadow-lg shadow-primary/25' :
        tone === 'danger' ? 'text-error hover:bg-rose/15' : 'bg-white/10 text-white hover:bg-white/15'
      }`}
    >
      {busy === action ? <Loader2 size={16} className="animate-spin" /> : label}
    </button>
  );

  return (
    <div className="space-y-4">
      {order.subtotal != null && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-linen rounded-[1.5rem] p-4">
            <p className={`${EYEBROW} text-muted`}>Precio</p>
            <p className="mt-1 text-[17px] font-semibold text-ink tabular-nums">{formatMxn(Number(order.subtotal))}</p>
          </div>
          <div className="bg-linen rounded-[1.5rem] p-4">
            <p className={`${EYEBROW} text-muted`}>Comisión + IVA</p>
            <p className="mt-1 text-[17px] font-semibold text-ink tabular-nums">−{formatMxn(fee)}</p>
          </div>
          <div className="bg-mint-light rounded-[1.5rem] p-4">
            <p className={`${EYEBROW} text-mint-deep`}>Recibes</p>
            <p className="mt-1 text-[17px] font-semibold text-ink tabular-nums">{formatMxn(net)}</p>
          </div>
        </div>
      )}

      {order.payout_hold && (
        <p className="p-4 rounded-[1.5rem] bg-lavender-light text-ink text-[13px] font-semibold flex items-start gap-2.5">
          <Snowflake size={16} className="shrink-0 mt-0.5" /> Pago congelado mientras el equipo revisa un reporte. Te contactaremos.
        </p>
      )}

      {order.status === 'pending' && (
        <div className="relative overflow-hidden bg-ink rounded-[2rem] p-7 text-white">
          <p className={`${EYEBROW} text-primary`}>Requiere tu confirmación</p>
          {bookingUnpaid || depositPending ? (
            <p className="mt-2 text-[14px] font-medium text-white/70">
              <Clock size={14} className="inline mr-1.5 -mt-0.5" />
              Esperando el pago del cliente. Podrás aceptar en cuanto se confirme.
            </p>
          ) : (
            <>
              <h4 className="mt-2 text-[21px] font-semibold tracking-tight">El cliente ya pagó. ¿Aceptas el trabajo?</h4>
              <p className="mt-2 text-[13.5px] font-medium text-white/60">Revisa fecha y dirección. Si rechazas, le devolvemos todo al cliente.</p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Btn action="aceptar" label="Aceptar servicio" />
                <Btn action="rechazar" label="No puedo tomarlo" tone="ghost" confirmText="¿Rechazar este trabajo? Se reembolsará al cliente." />
              </div>
            </>
          )}
        </div>
      )}

      {order.status === 'scheduled' && (
        <div className="bg-linen rounded-[1.75rem] p-6">
          <span className="w-12 h-12 rounded-[1rem] bg-primary-light text-primary-deep flex items-center justify-center mb-4"><Hammer size={19} /></span>
          <h4 className="text-[16px] font-semibold tracking-tight text-ink">Cuando llegues, inicia el trabajo</h4>
          <p className="mt-1.5 text-[13px] font-medium text-muted mb-5">
            {advance > 0
              ? `Al iniciar te enviamos ${formatMxn(advance)} de adelanto para materiales. El resto, ${PLAN.holdHours} h después de que el cliente confirme.`
              : `Recibes tu pago ${PLAN.holdHours} h después de que el cliente confirme la entrega.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Btn action="iniciar" label="Iniciar trabajo" />
            <Btn action="cancelar" label="Cancelar" tone="danger" confirmText="¿Cancelar este trabajo? Se reembolsará al cliente y cuenta como falta." />
          </div>
        </div>
      )}

      {order.status === 'in_progress' && (
        <div className="bg-linen rounded-[1.75rem] p-6">
          <span className="w-12 h-12 rounded-[1rem] bg-primary-light text-primary-deep flex items-center justify-center mb-4"><PackageCheck size={19} /></span>
          <h4 className="text-[16px] font-semibold tracking-tight text-ink">¿Terminaste?</h4>
          <p className="mt-1.5 text-[13px] font-medium text-muted mb-5">
            Le pediremos al cliente que revise y confirme{Number(order.balance_amount) > 0 ? ' pagando el saldo' : ''}.
          </p>
          <Btn action="terminar" label="Marcar como terminado" />
        </div>
      )}

      {order.status === 'completed' && (
        <div className="bg-sage-light rounded-[1.75rem] p-6 flex items-center gap-4">
          <span className="w-12 h-12 shrink-0 rounded-[1rem] bg-white text-sage flex items-center justify-center">
            {Number(order.released_amount) >= net && net > 0 ? <Wallet size={20} /> : <CircleCheck size={20} />}
          </span>
          <div>
            {Number(order.released_amount) >= net && net > 0 ? (
              <p className="text-[15px] font-semibold text-ink">Pagado: {formatMxn(net)} enviados a tu cuenta de Stripe</p>
            ) : order.confirmed_at ? (
              <p className="text-[15px] font-semibold text-ink">
                El cliente confirmó. Recibes {formatMxn(net - Number(order.released_amount || 0))} a partir del{' '}
                {new Date(order.release_at).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' })}.
              </p>
            ) : (
              <p className="text-[15px] font-semibold text-ink">Esperando que el cliente confirme la entrega.</p>
            )}
            <p className="text-[12.5px] font-medium text-muted mt-0.5">Los pagos llegan a la cuenta que configuraste en Pagos.</p>
          </div>
        </div>
      )}

      {info && <p className="p-4 rounded-[1.25rem] bg-mint-light text-mint-deep text-[13px] font-semibold">{info}</p>}
      {error && <p className="p-4 rounded-[1.25rem] bg-rose/15 text-error text-[13px] font-semibold">{error}</p>}
    </div>
  );
}
