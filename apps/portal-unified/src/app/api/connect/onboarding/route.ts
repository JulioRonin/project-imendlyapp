import { handle, requireCaller, HttpError, siteUrl } from '@/lib/server/http';
import { supabaseAdmin } from '@/lib/server/supabaseAdmin';
import { stripe } from '@/lib/server/stripe';

/**
 * El profesional configura dónde recibe sus pagos. Stripe aloja el registro
 * (identidad, RFC, CLABE): I mendly nunca ve ni guarda los datos bancarios.
 */
export const POST = handle(async (request) => {
  const caller = await requireCaller(request);
  if (caller.role !== 'provider') throw new HttpError(403, 'Solo para profesionales.');
  const db = supabaseAdmin();

  const { data: provider } = await db.from('providers').select('id, stripe_account_id, account_status').eq('id', caller.id).single();
  if (!provider) throw new HttpError(404, 'No encontramos tu perfil de profesional.');
  if (provider.account_status !== 'active') throw new HttpError(409, 'Podrás configurar tus cobros cuando aprobemos tu certificación.');

  let accountId = provider.stripe_account_id as string | null;
  if (!accountId) {
    const { data: user } = await db.from('users').select('email').eq('id', caller.id).single();
    const account = await stripe().accounts.create(
      {
        type: 'express',
        country: 'MX',
        email: user?.email ?? undefined,
        business_type: 'individual',
        capabilities: { transfers: { requested: true } },
        metadata: { provider_id: caller.id },
      },
      { idempotencyKey: `account-${caller.id}` },
    );
    accountId = account.id;
    await db.from('providers').update({ stripe_account_id: accountId }).eq('id', caller.id);
  }

  const base = siteUrl(request);
  const link = await stripe().accountLinks.create({
    account: accountId,
    type: 'account_onboarding',
    refresh_url: `${base}/proveedor/pagos?stripe=reintentar`,
    return_url: `${base}/proveedor/pagos?stripe=listo`,
  });
  return Response.json({ url: link.url });
});
