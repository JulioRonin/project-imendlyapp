import { handle, readJson, requireCaller, HttpError } from '@/lib/server/http';
import { supabaseAdmin } from '@/lib/server/supabaseAdmin';
import { displayId } from '@/lib/server/ids';
import { PLAN, quote, isTier } from '@/lib/pricing';
import { pricingColumns } from '@/lib/server/quotes';

/**
 * El cliente acepta una oferta del tablero. Se crea la orden con el precio
 * de la oferta congelado; el anticipo se paga en el siguiente paso.
 */
export const POST = handle(async (request) => {
  const caller = await requireCaller(request);
  const { offerId } = await readJson<{ offerId: string }>(request);
  if (!offerId) throw new HttpError(400, 'Falta la oferta.');

  const db = supabaseAdmin();
  const { data: offer } = await db.from('project_offers')
    .select('id, project_id, provider_id, offer_type, amount, amount_max, deposit_percent, status').eq('id', offerId).single();
  if (!offer) throw new HttpError(404, 'No encontramos la oferta.');

  const { data: project } = await db.from('projects')
    .select('id, client_id, title, category, status').eq('id', offer.project_id).single();
  if (!project || project.client_id !== caller.id) throw new HttpError(403, 'Este proyecto no es tuyo.');
  if (project.status !== 'open') throw new HttpError(409, 'Este proyecto ya no recibe ofertas.');
  if (offer.status !== 'active') throw new HttpError(409, 'Esta oferta ya no está disponible.');

  const { data: provider } = await db.from('providers').select('tier, account_status').eq('id', offer.provider_id).single();
  if (provider?.account_status !== 'active') throw new HttpError(409, 'Este profesional no está disponible por ahora.');

  // Visita de valoración u oferta con rango: el precio final se define después
  // de visitar. Aceptar no cobra nada; el profesional enviará su cotización.
  const isVisit = offer.offer_type === 'visit';
  const isRange = !isVisit && offer.amount_max != null && Number(offer.amount_max) > Number(offer.amount);
  const tier = isTier(provider?.tier) ? provider!.tier : 'verificado';

  let row: Record<string, unknown>;
  let needsDeposit = false;
  if (isVisit || isRange) {
    row = {
      service_requested: `${isVisit ? 'Visita de valoración · ' : ''}${project.category}: ${project.title}`,
      status: 'scheduled',              // la visita queda acordada
      payment_status: 'awaiting_quote',
      price_status: 'pending_quote',
      quote_min: isRange ? Number(offer.amount) : null,
      quote_max: isRange ? Number(offer.amount_max) : null,
      total_amount: 0,
      pricing_tier: tier,
    };
  } else {
    const subtotal = Number(offer.amount);
    if (!(subtotal >= PLAN.minChargeMxn)) throw new HttpError(400, 'La oferta no tiene un monto válido.');
    const depositPercent = Math.min(Number(offer.deposit_percent) || 0, PLAN.maxDepositPercent);
    const q = quote(subtotal, tier, depositPercent);
    needsDeposit = q.deposit >= PLAN.minChargeMxn;
    row = {
      service_requested: `${project.category}: ${project.title}`,
      status: needsDeposit ? 'pending' : 'scheduled',
      payment_status: needsDeposit ? 'pending' : 'due_on_delivery',
      ...pricingColumns(needsDeposit ? q : { ...q, deposit: 0, balance: q.total, advance: 0, depositPercent: 0 }),
    };
  }

  const { data: order, error } = await db.from('orders').insert({
    display_id: displayId('ORD'),
    client_id: caller.id,
    provider_id: offer.provider_id,
    origin: 'project',
    offer_id: offer.id,
    ...row,
  }).select('id').single();
  if (error || !order) throw new Error(`No se pudo crear la orden: ${error?.message}`);

  await db.from('project_offers').update({ status: 'accepted' }).eq('id', offer.id);
  await db.from('project_offers').update({ status: 'declined' })
    .eq('project_id', project.id).neq('id', offer.id).eq('status', 'active');
  await db.from('projects').update({ status: 'assigned', accepted_offer_id: offer.id, order_id: order.id }).eq('id', project.id);

  return Response.json({ orderId: order.id, needsDeposit, needsQuote: isVisit || isRange });
});
