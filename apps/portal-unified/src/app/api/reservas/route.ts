import { handle, readJson, requireCaller, HttpError } from '@/lib/server/http';
import { supabaseAdmin } from '@/lib/server/supabaseAdmin';
import { paymentIntentFor } from '@/lib/server/money';
import { displayId } from '@/lib/server/ids';
import { PLAN, quote, isTier } from '@/lib/pricing';

const CUSTOM = 'Personalizado o Explica tu necesidad';

type Body = {
  providerId: string;
  services: string[];
  customText?: string;
  scheduledAt?: string;   // ISO
  addressId?: string;
};

/**
 * Reserva directa desde el perfil de un profesional. El precio se calcula
 * AQUÍ con los precios publicados del profesional: lo que mande el navegador
 * como total se ignora. Se cobra completo por adelantado y se retiene.
 */
export const POST = handle(async (request) => {
  const caller = await requireCaller(request);
  if (caller.role !== 'client') throw new HttpError(403, 'Solo las cuentas de cliente pueden reservar.');
  const body = await readJson<Body>(request);
  if (!body.providerId || !Array.isArray(body.services) || body.services.length === 0) {
    throw new HttpError(400, 'Elige al menos un servicio.');
  }
  if (body.providerId === caller.id) throw new HttpError(400, 'No puedes reservarte a ti mismo.');

  const db = supabaseAdmin();
  const { data: provider } = await db.from('providers')
    .select('id, tier, account_status, is_verified').eq('id', body.providerId).single();
  if (!provider || provider.account_status !== 'active' || !provider.is_verified) {
    throw new HttpError(400, 'Este profesional no está disponible por ahora.');
  }

  const names = [...new Set(body.services.filter(s => typeof s === 'string' && s !== CUSTOM))];
  const { data: catalog } = names.length
    ? await db.from('provider_services').select('name, price').eq('provider_id', provider.id).in('name', names)
    : { data: [] as { name: string; price: number }[] };
  if ((catalog?.length ?? 0) !== names.length) throw new HttpError(400, 'Alguno de los servicios ya no está disponible. Recarga la página.');

  const wantsCustom = body.services.includes(CUSTOM);
  const customText = (body.customText || '').trim().slice(0, 500);
  if (wantsCustom && customText.length < 5) throw new HttpError(400, 'Describe lo que necesitas.');

  const subtotal = (catalog ?? []).reduce((acc, s) => acc + Number(s.price), 0) + (wantsCustom ? PLAN.customRequestFee : 0);
  const tier = isTier(provider.tier) ? provider.tier : 'verificado';
  const q = quote(subtotal, tier, 100);

  let address = 'Dirección pendiente';
  if (body.addressId) {
    const { data: addr } = await db.from('user_addresses').select('street, city, user_id').eq('id', body.addressId).single();
    if (!addr || addr.user_id !== caller.id) throw new HttpError(400, 'Elige una de tus direcciones.');
    address = `${addr.street}, ${addr.city}`;
  }

  const scheduled = body.scheduledAt && !isNaN(Date.parse(body.scheduledAt)) ? new Date(body.scheduledAt) : null;
  if (scheduled && scheduled.getTime() < Date.now() - 3600_000) throw new HttpError(400, 'Elige una fecha futura.');

  const service = [
    ...names,
    wantsCustom ? `Visita de cotización: ${customText}` : null,
  ].filter(Boolean).join(', ');

  const { data: order, error } = await db.from('orders').insert({
    display_id: displayId('ORD'),
    client_id: caller.id,
    provider_id: provider.id,
    service_requested: service,
    status: 'pending',
    payment_status: 'pending',
    scheduled_date: scheduled?.toISOString() ?? null,
    address,
    origin: 'booking',
    pricing_version: q.version,
    pricing_tier: q.tier,
    total_amount: q.total,
    subtotal: q.subtotal,
    client_fee: q.clientFee,
    commission: q.commission,
    commission_tax: q.commissionTax,
    provider_net: q.providerNet,
    deposit_percent: q.depositPercent,
    deposit_amount: q.deposit,
    balance_amount: q.balance,
    advance_amount: q.advance,
    guarantee_contribution: q.guaranteeContribution,
  }).select('*').single();
  if (error || !order) throw new Error(`No se pudo crear la orden: ${error?.message}`);

  const { clientSecret } = await paymentIntentFor(order, 'full');
  return Response.json({ orderId: order.id, clientSecret, quote: q });
});
