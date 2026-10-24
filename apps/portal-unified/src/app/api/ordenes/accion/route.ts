import { handle, readJson, requireCaller, HttpError } from '@/lib/server/http';
import { supabaseAdmin } from '@/lib/server/supabaseAdmin';
import { loadOrder, refundOrder, releaseAdvance, cancelOpenPayment } from '@/lib/server/money';
import { pricingColumns } from '@/lib/server/quotes';
import { PLAN, quote, isTier, formatMxn } from '@/lib/pricing';

type Action = 'aceptar' | 'rechazar' | 'iniciar' | 'terminar' | 'confirmar' | 'cancelar' | 'reportar' | 'cotizar' | 'aprobar' | 'pedir_otro_precio';

const hoursFromNow = (h: number) => new Date(Date.now() + h * 3600_000).toISOString();

/**
 * Máquina de estados de la orden. Es el ÚNICO camino para cambiar el estado:
 * la base de datos rechaza cambios de estado que no vengan del servidor.
 *
 *   pending ─aceptar─▶ scheduled ─iniciar─▶ in_progress ─terminar─▶ completed ─confirmar─▶ (pago 24 h después)
 */
export const POST = handle(async (request) => {
  const caller = await requireCaller(request);
  const { orderId, action, note, amount, depositPercent } = await readJson<{
    orderId: string; action: Action; note?: string; amount?: number; depositPercent?: number;
  }>(request);
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
      if (order.price_status !== 'final') throw new HttpError(409, 'El cliente aún no aprueba el precio final.');
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

    // ── Precio final después de la visita ──────────────────
    case 'cotizar': {
      if (!isProvider) break;
      if (order.status !== 'scheduled' || !['pending_quote', 'quoted'].includes(order.price_status)) {
        throw new HttpError(409, 'Esta orden ya tiene precio final.');
      }
      const { data: paid } = await db.from('payments').select('status')
        .eq('order_id', order.id).eq('kind', 'deposit').in('status', ['processing', 'succeeded']).maybeSingle();
      if (paid) throw new HttpError(409, 'El cliente ya está pagando esta cotización; ya no se puede cambiar.');

      const price = Math.round(Number(amount) * 100) / 100;
      if (!(price >= PLAN.minChargeMxn)) throw new HttpError(400, 'Escribe un precio válido.');
      const pct = Math.round(Number(depositPercent) || 0);
      if (pct < 0 || pct > PLAN.maxDepositPercent) throw new HttpError(400, `El anticipo va de 0 a ${PLAN.maxDepositPercent}%.`);
      const overRange = order.quote_max != null && price > Number(order.quote_max);
      const why = String(note || '').trim().slice(0, 600);
      if (overRange && why.length < 15) {
        throw new HttpError(400, `El precio supera el máximo acordado (${formatMxn(Number(order.quote_max))}). Explica al cliente por qué.`);
      }

      const { data: prov } = await db.from('providers').select('tier').eq('id', order.provider_id).single();
      const q = quote(price, isTier(prov?.tier) ? prov!.tier : 'verificado', pct);
      const needsDeposit = q.deposit >= PLAN.minChargeMxn;
      const columns = pricingColumns(needsDeposit ? q : { ...q, deposit: 0, balance: q.total, advance: 0, depositPercent: 0 });

      // Un cobro abierto de una cotización anterior ya no vale
      await cancelOpenPayment(order.id, 'deposit');
      await db.from('order_quotes').update({ status: 'superseded', decided_at: new Date().toISOString() })
        .eq('order_id', order.id).eq('status', 'sent');
      const { error: qErr } = await db.from('order_quotes').insert({
        order_id: order.id, provider_id: order.provider_id, amount: price, deposit_percent: needsDeposit ? pct : 0,
        note: why || null, over_range: overRange,
      });
      if (qErr) throw new Error(qErr.message);
      await update({ ...columns, price_status: 'quoted', payment_status: needsDeposit ? 'pending' : 'awaiting_approval' });
      return Response.json({ priceStatus: 'quoted', total: q.total });
    }

    case 'aprobar': {
      // Solo para cotizaciones sin anticipo: con anticipo, pagarlo es la aprobación
      if (!isClient) break;
      if (order.price_status !== 'quoted') throw new HttpError(409, 'No hay un precio por aprobar.');
      if (Number(order.deposit_amount) > 0) throw new HttpError(409, 'Aprueba el precio pagando el anticipo.');
      await db.from('order_quotes').update({ status: 'accepted', decided_at: new Date().toISOString() })
        .eq('order_id', order.id).eq('status', 'sent');
      await update({ price_status: 'final', payment_status: 'due_on_delivery' });
      return Response.json({ priceStatus: 'final' });
    }

    case 'pedir_otro_precio': {
      if (!isClient) break;
      if (order.price_status !== 'quoted') throw new HttpError(409, 'No hay un precio por revisar.');
      const why = String(note || '').trim().slice(0, 600);
      if (why.length < 5) throw new HttpError(400, 'Dile al profesional qué esperabas.');
      await cancelOpenPayment(order.id, 'deposit');
      await db.from('order_quotes').update({ status: 'rejected', client_note: why, decided_at: new Date().toISOString() })
        .eq('order_id', order.id).eq('status', 'sent');
      await update({ price_status: 'pending_quote', payment_status: 'awaiting_quote' });
      return Response.json({ priceStatus: 'pending_quote' });
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
