import 'server-only';
import type Stripe from 'stripe';
import { PLAN } from '@/lib/pricing';
import { stripe, cents, HttpError } from './stripe';
import { supabaseAdmin } from './supabaseAdmin';

// ═════════════════════════════════════════════════════════════
// Ciclo del dinero de una orden. Solo se llama desde rutas del servidor.
//
//   cobro al cliente ─▶ saldo de la plataforma ─▶ transferencia al profesional
//
// Cada transferencia se liga al cobro que la financia (source_transaction) y
// usa una llave de idempotencia por orden y tipo: aunque el cron o el webhook
// corran dos veces, Stripe no paga dos veces.
// ═════════════════════════════════════════════════════════════

export type PaymentKind = 'deposit' | 'balance' | 'full';

const db = () => supabaseAdmin();

/** supabase-js no lanza excepciones: si una escritura falla, aquí sí. Así el webhook responde 500 y Stripe reintenta. */
function must<T extends { error: { message: string } | null }>(res: T): T {
  if (res.error) throw new Error(`Base de datos: ${res.error.message}`);
  return res;
}
const nowIso = () => new Date().toISOString();
const addHours = (h: number) => new Date(Date.now() + h * 3600_000).toISOString();

export async function loadOrder(orderId: string) {
  const { data, error } = await db().from('orders').select('*').eq('id', orderId).maybeSingle();
  if (error) throw new Error(`Base de datos: ${error.message}`);
  if (!data) throw new HttpError(404, 'No encontramos esta orden.');
  return data;
}

/** Cliente de Stripe por usuario: necesario para transferencias SPEI y para guardar métodos. */
async function stripeCustomerFor(userId: string): Promise<string> {
  const { data: row } = must(await db().from('billing_customers').select('stripe_customer_id').eq('user_id', userId).maybeSingle());
  if (row?.stripe_customer_id) return row.stripe_customer_id;

  const { data: user } = await db().from('users').select('email, full_name, phone').eq('id', userId).single();
  const customer = await stripe().customers.create(
    { email: user?.email ?? undefined, name: user?.full_name ?? undefined, phone: user?.phone ?? undefined, metadata: { user_id: userId } },
    { idempotencyKey: `customer-${userId}` },
  );
  must(await db().from('billing_customers').upsert({ user_id: userId, stripe_customer_id: customer.id }));
  return customer.id;
}

/**
 * Devuelve el client_secret para que el cliente pague una parte de la orden.
 * Reutiliza el PaymentIntent si ya existe y sigue pendiente.
 */
export async function paymentIntentFor(order: any, kind: PaymentKind) {
  const amount = kind === 'balance' ? Number(order.balance_amount) : Number(order.deposit_amount);
  if (!(amount >= PLAN.minChargeMxn)) throw new HttpError(400, 'No hay nada por pagar en este paso.');

  const { data: existing } = must(await db().from('payments').select('*').eq('order_id', order.id).eq('kind', kind).maybeSingle());
  if (existing?.status === 'succeeded' || existing?.status === 'processing') {
    throw new HttpError(409, existing.status === 'succeeded' ? 'Este pago ya se realizó.' : 'Tu pago se está procesando.');
  }
  if (existing?.stripe_payment_intent_id) {
    const pi = await stripe().paymentIntents.retrieve(existing.stripe_payment_intent_id);
    if (pi.status !== 'canceled' && pi.status !== 'succeeded' && pi.amount === cents(amount)) {
      return { clientSecret: pi.client_secret!, amount };
    }
  }

  const customer = await stripeCustomerFor(order.client_id);
  const label = kind === 'deposit' ? 'Anticipo' : kind === 'balance' ? 'Saldo' : 'Pago';
  const pi = await stripe().paymentIntents.create(
    {
      amount: cents(amount),
      currency: 'mxn',
      customer,
      automatic_payment_methods: { enabled: true }, // tarjeta, OXXO y SPEI según lo activado en el Dashboard
      description: `${label} · ${order.display_id} · ${order.service_requested}`.slice(0, 350),
      transfer_group: order.id,
      metadata: { order_id: order.id, kind, display_id: order.display_id },
    },
    { idempotencyKey: `pi-${order.id}-${kind}-${cents(amount)}-${existing?.stripe_payment_intent_id ?? 'new'}` },
  );

  must(await db().from('payments').upsert(
    { order_id: order.id, kind, amount, stripe_payment_intent_id: pi.id, status: 'requires_payment' },
    { onConflict: 'order_id,kind' },
  ));
  return { clientSecret: pi.client_secret!, amount };
}

/** Webhook: un pago se completó (tarjeta al instante; OXXO/SPEI cuando llega el dinero). */
export async function onPaymentSucceeded(pi: Stripe.PaymentIntent) {
  const { data: payment } = must(await db().from('payments').select('*').eq('stripe_payment_intent_id', pi.id).maybeSingle());
  if (!payment || payment.status === 'succeeded') return;

  const chargeId = typeof pi.latest_charge === 'string' ? pi.latest_charge : pi.latest_charge?.id ?? null;
  let method: string | null = null;
  if (chargeId) {
    try { method = (await stripe().charges.retrieve(chargeId)).payment_method_details?.type ?? null; } catch { /* solo informativo */ }
  }
  must(await db().from('payments').update({ status: 'succeeded', stripe_charge_id: chargeId, method }).eq('id', payment.id));

  const order = await loadOrder(payment.order_id);
  const patch: Record<string, unknown> = { paid_amount: Number(order.paid_amount) + Number(payment.amount) };

  if (payment.kind === 'deposit') {
    patch.payment_status = 'deposit_paid';
    if (order.status === 'pending' && order.origin === 'project') patch.status = 'scheduled';
  } else if (payment.kind === 'full') {
    patch.payment_status = 'paid';
  } else {
    // Pagar el saldo ES confirmar la entrega: arranca la retención de 24 h
    patch.payment_status = 'paid';
    patch.confirmed_at = nowIso();
    patch.release_at = addHours(PLAN.holdHours);
  }
  must(await db().from('orders').update(patch).eq('id', order.id));
}

export async function onPaymentStatus(pi: Stripe.PaymentIntent, status: 'processing' | 'failed' | 'canceled') {
  must(await db().from('payments').update({ status }).eq('stripe_payment_intent_id', pi.id).neq('status', 'succeeded'));
}

/** Webhook: reembolso total o parcial hecho (desde la app o desde el Dashboard). */
export async function onChargeRefunded(charge: Stripe.Charge) {
  const piId = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id;
  if (!piId) return;
  const { data: payment } = must(await db().from('payments').select('*').eq('stripe_payment_intent_id', piId).maybeSingle());
  if (!payment) return;
  const refunded = charge.amount_refunded / 100;
  const delta = refunded - Number(payment.refunded_amount);
  must(await db().from('payments').update({
    refunded_amount: refunded,
    status: charge.refunded ? 'refunded' : 'partially_refunded',
  }).eq('id', payment.id));
  if (delta > 0) {
    const order = await loadOrder(payment.order_id);
    must(await db().from('orders').update({ refunded_amount: Number(order.refunded_amount) + delta }).eq('id', order.id));
  }
}

/** Webhook: contracargo. Se congela todo pago pendiente al profesional. */
export async function onDispute(dispute: Stripe.Dispute) {
  const piId = typeof dispute.payment_intent === 'string' ? dispute.payment_intent : dispute.payment_intent?.id;
  if (!piId) return;
  const { data: payment } = must(await db().from('payments').select('id, order_id').eq('stripe_payment_intent_id', piId).maybeSingle());
  if (!payment) return;
  must(await db().from('payments').update({ status: 'disputed' }).eq('id', payment.id));
  must(await db().from('orders').update({ payout_hold: true, needs_review: 'Contracargo abierto en Stripe' }).eq('id', payment.order_id));
}

/** Webhook: el profesional terminó (o cambió) su registro en Stripe. */
export async function syncAccount(account: Stripe.Account) {
  must(await db().from('providers').update({
    stripe_details_submitted: !!account.details_submitted,
    stripe_payouts_enabled: !!account.payouts_enabled,
  }).eq('stripe_account_id', account.id));
}

// ── Transferencias al profesional ───────────────────────────

type ReleaseResult = { released: number } | { skipped: string };

async function transfer(order: any, kind: 'advance' | 'final', amount: number, sourceKind: PaymentKind): Promise<ReleaseResult> {
  if (amount <= 0) return { skipped: 'Sin monto por liberar' };

  const { data: done } = must(await db().from('payouts').select('id').eq('order_id', order.id).eq('kind', kind).maybeSingle());
  if (done) return { skipped: 'Ya liberado' };

  const { data: provider } = await db().from('providers')
    .select('stripe_account_id, stripe_payouts_enabled').eq('id', order.provider_id).single();
  if (!provider?.stripe_account_id || !provider.stripe_payouts_enabled) {
    must(await db().from('orders').update({ needs_review: 'El profesional no ha terminado su registro de cobros en Stripe' }).eq('id', order.id));
    return { skipped: 'Profesional sin cuenta de cobro activa' };
  }

  const { data: source } = await db().from('payments').select('stripe_charge_id, status')
    .eq('order_id', order.id).eq('kind', sourceKind).maybeSingle();
  if (source?.status !== 'succeeded' || !source.stripe_charge_id) return { skipped: 'El cobro que financia este pago no se ha completado' };

  const t = await stripe().transfers.create(
    {
      amount: cents(amount),
      currency: 'mxn',
      destination: provider.stripe_account_id,
      source_transaction: source.stripe_charge_id, // se libera aunque el cobro aún no esté disponible
      transfer_group: order.id,
      description: `${kind === 'advance' ? 'Adelanto' : 'Pago'} · ${order.display_id}`,
      metadata: { order_id: order.id, kind },
    },
    { idempotencyKey: `payout-${order.id}-${kind}` },
  );

  must(await db().from('payouts').insert({ order_id: order.id, provider_id: order.provider_id, kind, amount, stripe_transfer_id: t.id }));
  must(await db().from('orders').update({
    released_amount: Number(order.released_amount) + amount,
    needs_review: null,
  }).eq('id', order.id));
  return { released: amount };
}

/** Al iniciar el trabajo: adelanto para materiales (parte del anticipo). */
export async function releaseAdvance(orderId: string): Promise<ReleaseResult> {
  const order = await loadOrder(orderId);
  if (order.payout_hold) return { skipped: 'Pago retenido por revisión' };
  return transfer(order, 'advance', Number(order.advance_amount), 'deposit');
}

/** 24 h después de la confirmación: el resto de lo que le toca al profesional. */
export async function releaseFinal(orderId: string): Promise<ReleaseResult> {
  const order = await loadOrder(orderId);
  if (order.payout_hold) return { skipped: 'Pago retenido por revisión' };
  if (!order.confirmed_at || !order.release_at || new Date(order.release_at) > new Date()) return { skipped: 'Aún en periodo de retención' };
  const { data: advance } = must(await db().from('payouts').select('amount').eq('order_id', order.id).eq('kind', 'advance').maybeSingle());
  const remaining = Math.round((Number(order.provider_net) - Number(advance?.amount ?? 0)) * 100) / 100;
  return transfer(order, 'final', remaining, Number(order.balance_amount) > 0 ? 'balance' : 'full');
}

/**
 * Cancelación antes de iniciar: devuelve todo lo cobrado. Si ya se liberó
 * dinero al profesional, no se reembolsa en automático: lo revisa el equipo.
 */
export async function refundOrder(order: any, reason: string) {
  const { count } = must(await db().from('payouts').select('id', { count: 'exact', head: true }).eq('order_id', order.id));
  if ((count ?? 0) > 0) {
    must(await db().from('orders').update({ payout_hold: true, needs_review: `Cancelación con pagos ya liberados: ${reason}` }).eq('id', order.id));
    return { refunded: false };
  }
  const { data: payments } = must(await db().from('payments').select('*').eq('order_id', order.id));
  for (const p of payments ?? []) {
    if (p.status === 'succeeded' && p.stripe_payment_intent_id) {
      await stripe().refunds.create(
        { payment_intent: p.stripe_payment_intent_id, metadata: { order_id: order.id, reason } },
        { idempotencyKey: `refund-${p.id}` },
      );
    } else if (p.stripe_payment_intent_id && (p.status === 'requires_payment' || p.status === 'processing')) {
      try { await stripe().paymentIntents.cancel(p.stripe_payment_intent_id); } catch { /* OXXO ya emitido, etc. */ }
    }
  }
  return { refunded: true };
}
