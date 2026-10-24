import { handle, requireCaller, HttpError } from '@/lib/server/http';
import { supabaseAdmin } from '@/lib/server/supabaseAdmin';
import { stripe } from '@/lib/server/stripe';
import { syncAccount } from '@/lib/server/money';

/** Estado de la cuenta de cobro y enlace al panel de Stripe del profesional. */
export const POST = handle(async (request) => {
  const caller = await requireCaller(request);
  if (caller.role !== 'provider') throw new HttpError(403, 'Solo para profesionales.');
  const { data: provider } = await supabaseAdmin().from('providers').select('stripe_account_id').eq('id', caller.id).single();
  if (!provider?.stripe_account_id) return Response.json({ connected: false });

  const account = await stripe().accounts.retrieve(provider.stripe_account_id);
  await syncAccount(account);
  const ready = !!account.details_submitted;
  const login = ready ? await stripe().accounts.createLoginLink(account.id) : null;
  return Response.json({
    connected: true,
    detailsSubmitted: ready,
    payoutsEnabled: !!account.payouts_enabled,
    dashboardUrl: login?.url ?? null,
  });
});
