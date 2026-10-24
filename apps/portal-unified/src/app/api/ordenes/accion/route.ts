import { handle, readJson, requireCaller, HttpError } from '@/lib/server/http';
import { supabaseAdmin } from '@/lib/server/supabaseAdmin';
import { loadOrder, refundOrder, releaseAdvance } from '@/lib/server/money';
import { PLAN } from '@/lib/pricing';

type Action = 'aceptar' | 'rechazar' | 'iniciar' | 'terminar' | 'confirmar' | 'cancelar' | 'reportar';

const hoursFromNow = (h: number) => new Date(Date.now() + h * 3600_000).toISOString();

/**
 * Máquina de estados de la orden. Es el ÚNICO camino para cambiar el estado:
 * la base de datos rechaza cambios de estado que no vengan del servidor.
 *
 *   pending ─aceptar─▶ scheduled ─iniciar─▶ in_progress ─terminar─▶ completed ─confirmar─▶ (pago 24 h después)
 */
export const POST = handle(async (request) => {
  const caller = await requireCaller(request);
  const { orderId, action, note } = await readJson<{ orderId: string; action: Action; note?: string }>(request);
  const order = await loadOrder(orderId);
  const db = supabaseAdmin();

  const isProvider = order.provider_id === caller.id;
  const isClient = order.client_id === caller.id;
  if (!isProvider && !isClient) throw new HttpError(403, 'Esta orden no es tuya.');

  const notStarted = order.status === 'pending' || order.status === 'scheduled';
  const depositOk = Number(order.deposit_amount) === 0 || ['deposit_paid', 'paid'].includes(order.payment_status);
  const update = (patch: Record<string, unknown>) => db.from('orders').update(patch).eq('id', order.id);

  switch (action) {
    case 'aceptar': {
      if (!isProvider) break;
      if (order.status !== 'pending') throw new HttpError(409, 'Esta orden ya fue atendida.');
      if (order.origin === 'booking' && order.payment_status !== 'paid') throw new HttpError(409, 'El cliente aún no completa su pago.');
      if (order.origin === 'project' && !depositOk) throw new HttpError(409, 'El cliente aún no paga el anticipo.');
      await update({ status: 'scheduled' });
      return Response.json({ status: 'scheduled' });
    }

    case 'rechazar':
    case 'cancelar': {
      if (!notStarted) throw new HttpError(409, 'El trabajo ya inició: para cancelarlo, repórtalo y el equipo de I mendly te ayudará.');
      const who = isProvider ? 'profesional' : 'cliente';
      const result = await refundOrder(order, `Cancelada por el ${who}${note ? `: ${String(note).slice(0, 200)}` : ''}`);
      await update({ status: 'cancelled', payment_status: result.refunded && Number(order.paid_amount) > 0 ? 'refunded' : order.payment_status });
      // Si venía del tablero, el proyecto vuelve a recibir ofertas
      if (order.origin === 'project') {
        if (order.offer_id) await db.from('project_offers').update({ status: 'withdrawn' }).eq('id', order.offer_id);
        await db.from('projects').update({ status: 'open', accepted_offer_id: null, order_id: null }).eq('order_id', order.id);
      }
      return Response.json({ status: 'cancelled', refunded: result.refunded });
    }

    case 'iniciar': {
      if (!isProvider) break;
      if (order.status !== 'scheduled') throw new HttpError(409, 'Primero acepta la orden.');
      if (!depositOk) throw new HttpError(409, 'Espera a que el cliente pague el anticipo antes de iniciar.');
      await update({ status: 'in_progress', started_at: new Date().toISOString() });
      // Adelanto para materiales: si falla (p. ej. falta la cuenta de Stripe), el cron lo reintenta
      const advance = Number(order.advance_amount) > 0 ? await releaseAdvance(order.id).catch(() => ({ skipped: 'Se reintentará' })) : null;
      return Response.json({ status: 'in_progress', advance });
    }

    case 'terminar': {
      if (!isProvider) break;
      if (order.status !== 'in_progress') throw new HttpError(409, 'Inicia el trabajo antes de marcarlo como terminado.');
      await update({ status: 'completed', delivered_at: new Date().toISOString() });
      return Response.json({ status: 'completed' });
    }

    case 'confirmar': {
      if (!isClient) break;
      if (order.status !== 'completed') throw new HttpError(409, 'El profesional aún no marca el trabajo como terminado.');
      if (order.confirmed_at) return Response.json({ status: 'completed', confirmed: true });
      if (Number(order.balance_amount) > 0 && order.payment_status !== 'paid') {
        throw new HttpError(409, 'Paga el saldo para confirmar la entrega.');
      }
      await update({ confirmed_at: new Date().toISOString(), release_at: hoursFromNow(PLAN.holdHours) });
      return Response.json({ status: 'completed', confirmed: true });
    }

    case 'reportar': {
      if (!isClient) break;
      const since = order.delivered_at ?? order.started_at;
      if (!since) throw new HttpError(409, 'Puedes reportar un problema en cuanto el trabajo inicie.');
      if (Date.now() - new Date(since).getTime() > PLAN.claimDays * 86400_000) {
        throw new HttpError(409, `El plazo para reportar es de ${PLAN.claimDays} días naturales después de la entrega.`);
      }
      const text = String(note || '').trim().slice(0, 1000);
      if (text.length < 10) throw new HttpError(400, 'Cuéntanos qué pasó (mínimo 10 caracteres).');
      await update({ payout_hold: true, needs_review: `Reclamo del cliente: ${text}` });
      return Response.json({ reported: true });
    }
  }
  throw new HttpError(403, 'No puedes hacer esta acción en esta orden.');
});
