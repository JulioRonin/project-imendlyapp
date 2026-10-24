import type Stripe from 'stripe';
import { stripe } from '@/lib/server/stripe';
import { supabaseAdmin } from '@/lib/server/supabaseAdmin';
import { onChargeRefunded, onDispute, onPaymentStatus, onPaymentSucceeded, syncAccount } from '@/lib/server/money';

/**
 * Webhook de Stripe. Es la única fuente de verdad sobre si un pago se hizo:
 * la app nunca marca nada como pagado por su cuenta.
 * Eventos a suscribir en el Dashboard: payment_intent.succeeded,
 * payment_intent.processing, payment_intent.payment_failed,
 * payment_intent.canceled, charge.refunded, charge.dispute.created,
 * account.updated (este último en "eventos de cuentas conectadas").
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get('stripe-signature');
  if (!secret || !signature) return new Response('Webhook no configurado', { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return new Response('Firma inválida', { status: 400 });
  }

  const db = supabaseAdmin();
  const { data: seen, error: seenError } = await db.from('stripe_events').select('id').eq('id', event.id).maybeSingle();
  if (seenError) return new Response('Base de datos no disponible', { status: 500 }); // Stripe reintenta
  if (seen) return Response.json({ received: true, duplicate: true });

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': await onPaymentSucceeded(event.data.object); break;
      case 'payment_intent.processing': await onPaymentStatus(event.data.object, 'processing'); break;
      case 'payment_intent.payment_failed': await onPaymentStatus(event.data.object, 'failed'); break;
      case 'payment_intent.canceled': await onPaymentStatus(event.data.object, 'canceled'); break;
      case 'charge.refunded': await onChargeRefunded(event.data.object); break;
      case 'charge.dispute.created': await onDispute(event.data.object); break;
      case 'account.updated': await syncAccount(event.data.object); break;
      default: break;
    }
  } catch (err) {
    console.error('[stripe webhook]', event.type, err);
    return new Response('Error procesando el evento', { status: 500 }); // Stripe reintenta
  }

  // Los manejadores son idempotentes: si este registro falla, reprocesar es seguro
  const { error: logError } = await db.from('stripe_events').insert({ id: event.id, type: event.type });
  if (logError && logError.code !== '23505') console.error('[stripe webhook] no se registró el evento', event.id, logError.message);
  return Response.json({ received: true });
}
