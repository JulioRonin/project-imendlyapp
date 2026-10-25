import { handle, readJson, requireCaller, HttpError } from '@/lib/server/http';
import { loadOrder, paymentIntentFor, type PaymentKind } from '@/lib/server/money';

/** Devuelve el client_secret del pago que le toca al cliente en este momento. */
export const POST = handle(async (request) => {
  const caller = await requireCaller(request);
  const { orderId } = await readJson<{ orderId: string }>(request);
  const order = await loadOrder(orderId);
  if (order.client_id !== caller.id) throw new HttpError(403, 'Esta orden no es tuya.');
  if (order.status === 'cancelled') throw new HttpError(409, 'Esta orden está cancelada.');

  let kind: PaymentKind;
  if (order.origin === 'booking') kind = 'full';
  else if (Number(order.deposit_amount) > 0 && order.payment_status === 'pending') kind = 'deposit';
  else if (Number(order.balance_amount) > 0 && order.status === 'completed' && !order.confirmed_at) kind = 'balance';
  else throw new HttpError(409, order.status === 'completed' ? 'Esta orden ya está pagada.' : 'El saldo se paga cuando el profesional marque el trabajo como terminado.');

  const { clientSecret, amount } = await paymentIntentFor(order, kind);
  return Response.json({ clientSecret, amount, kind });
});
