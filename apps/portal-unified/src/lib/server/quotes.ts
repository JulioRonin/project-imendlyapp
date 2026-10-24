import 'server-only';
import type { Quote } from '@/lib/pricing';

/** Columnas de la orden que congelan una cotización. Un solo lugar para no olvidar ninguna. */
export function pricingColumns(q: Quote) {
  return {
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
  };
}
