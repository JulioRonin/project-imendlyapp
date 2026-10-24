import { handle, readJson, requireCaller, HttpError } from '@/lib/server/http';
import { supabaseAdmin } from '@/lib/server/supabaseAdmin';
import { displayId } from '@/lib/server/ids';
import { PLAN, quote, isTier } from '@/lib/pricing';

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
    .select('id, project_id, provider_id, offer_type, amount, deposit_percent, status').eq('id', offerId).single();
  if (!offer) throw new HttpError(404, 'No encontramos la oferta.');

  const { data: project } = await db.from('projects')
    .select('id, client_id, title, category, status').eq('id', offer.project_id).single();
  if (!project || project.client_id !== caller.id) throw new HttpError(403, 'Este proyecto no es tuyo.');
  if (project.status !== 'open') throw new HttpError(409, 'Este proyecto ya no recibe ofertas.');
  if (offer.status !== 'active') throw new HttpError(409, 'Esta oferta ya no está disponible.');

  const { data: provider } = await db.from('providers').select('tier, account_status').eq('id', offer.provider_id).single();
  if (provider?.account_status !== 'active') throw new HttpError(409, 'Este profesional no está disponible por ahora.');

  const isVisit = offer.offer_type === 'visit';
  const subtotal = isVisit ? 0 : Number(offer.amount);
  if (!isVisit && !(subtotal >= PLAN.minChargeMxn)) throw new HttpError(400, 'La oferta no tiene un monto válido.');
  const depositPercent = Math.min(Number(offer.deposit_percent) || 0, PLAN.maxDepositPercent);
  const q = quote(subtotal, isTier(provider?.tier) ? provider!.tier : 'verificado', depositPercent);
  const needsDeposit = q.deposit >= PLAN.minChargeMxn;

  const { data: order, error } = await db.from('orders').insert({
    display_id: displayId('ORD'),
    client_id: caller.id,
    provider_id: offer.provider_id,
    service_requested: isVisit ? `Visita de valoración · ${project.category}: ${project.title}` : `${project.category}: ${project.title}`,
    status: needsDeposit ? 'pending' : 'scheduled',
    payment_status: needsDeposit ? 'pending' : (q.total > 0 ? 'due_on_delivery' : 'not_required'),
    origin: 'project',
    offer_id: offer.id,
    pricing_version: q.version,
    pricing_tier: q.tier,
    total_amount: q.total,
    subtotal: q.subtotal,
    client_fee: q.clientFee,
    commission: q.commission,
    commission_tax: q.commissionTax,
    provider_net: q.providerNet,
    deposit_percent: needsDeposit ? q.depositPercent : 0,
    deposit_amount: needsDeposit ? q.deposit : 0,
    balance_amount: needsDeposit ? q.balance : q.total,
    advance_amount: needsDeposit ? q.advance : 0,
    guarantee_contribution: q.guaranteeContribution,
  }).select('id').single();
  if (error || !order) throw new Error(`No se pudo crear la orden: ${error?.message}`);

  await db.from('project_offers').update({ status: 'accepted' }).eq('id', offer.id);
  await db.from('project_offers').update({ status: 'declined' })
    .eq('project_id', project.id).neq('id', offer.id).eq('status', 'active');
  await db.from('projects').update({ status: 'assigned', accepted_offer_id: offer.id, order_id: order.id }).eq('id', project.id);

  return Response.json({ orderId: order.id, needsDeposit });
});
