// ═════════════════════════════════════════════════════════════
// Plan de precios de I mendly: ÚNICA fuente de verdad.
//
// Lo usan el servidor (cálculo de cobros), la app (desgloses) y las páginas
// legales (/legal/*), así que cambiar un número aquí lo cambia en todos lados.
// Si cambias el plan, sube PRICING_VERSION: cada orden guarda la versión con
// la que se cotizó y conserva su precio aunque el plan cambie después.
//
// ESTADO: propuesta pendiente de aprobación. El plan anterior (10/8/6% con
// tope de $1,500 y sin tarifa al cliente) pierde dinero en trabajos chicos,
// en el nivel Élite y en proyectos grandes pagados con tarjeta, porque la
// plataforma absorbía ~4.2% + $3.48 de Stripe por cobro.
// ═════════════════════════════════════════════════════════════

export const PRICING_VERSION = '2026-10-propuesta';

export type ProviderTier = 'verificado' | 'certificado' | 'elite';

export const PLAN = {
  /** Comisión al profesional por nivel, sin IVA (el IVA se suma y se le factura). */
  commission: { verificado: 0.12, certificado: 0.10, elite: 0.08 } as Record<ProviderTier, number>,
  /** Tope de comisión por orden, en MXN (sin IVA). */
  commissionCap: 4000,
  /** IVA que se suma a la comisión. */
  commissionVat: 0.16,

  /** Tarifa de servicio al cliente (cubre procesamiento de pago y garantía). */
  clientFee: 0.05,
  clientFeeMin: 29,
  clientFeeMax: 1500,

  /** Anticipo máximo que puede pedir un profesional en una oferta. */
  maxDepositPercent: 50,
  /** Parte del anticipo que se adelanta al profesional al iniciar (para materiales). */
  advanceShareOfDeposit: 1,

  /** Horas que se retiene el pago después de que el cliente confirma la entrega. */
  holdHours: 24,
  /** Si el profesional terminó y el cliente no responde, se confirma solo (solo si ya pagó todo). */
  autoConfirmHours: 72,

  /** Aportación al fondo de garantía, sobre el precio del profesional. */
  guaranteeFund: 0.015,
  /** Tope de la Garantía I mendly por proyecto, en MXN. */
  guaranteeCap: 5000,
  /** Días naturales para reportar un problema. */
  claimDays: 15,

  /** Visita de cotización cuando el cliente pide un servicio personalizado. */
  customRequestFee: 450,

  /** Monto mínimo que acepta Stripe por cobro en MXN. */
  minChargeMxn: 10,
} as const;

export const TIER_LABEL: Record<ProviderTier, string> = {
  verificado: 'Verificado',
  certificado: 'Certificado',
  elite: 'Élite',
};

export const isTier = (v: unknown): v is ProviderTier =>
  v === 'verificado' || v === 'certificado' || v === 'elite';

// ── Cálculo ─────────────────────────────────────────────────
// Se trabaja en centavos para que las sumas cuadren exacto.
const toCents = (mxn: number) => Math.round(mxn * 100);
const toMxn = (cents: number) => cents / 100;

export interface Quote {
  version: string;
  tier: ProviderTier;
  subtotal: number;        // precio del profesional
  clientFee: number;       // tarifa de servicio
  total: number;           // lo que paga el cliente
  commission: number;      // comisión sin IVA
  commissionTax: number;   // IVA de la comisión
  providerNet: number;     // lo que recibe el profesional
  depositPercent: number;
  deposit: number;         // primer cobro al cliente
  balance: number;         // segundo cobro (al confirmar la entrega)
  advance: number;         // se transfiere al profesional al iniciar
  guaranteeContribution: number;
}

/**
 * Cotiza una orden. `depositPercent` = 100 significa pago completo por
 * adelantado (reservas directas): no hay saldo y no hay adelanto al iniciar.
 */
export function quote(subtotalMxn: number, tier: ProviderTier, depositPercent: number): Quote {
  const sub = toCents(Math.max(0, subtotalMxn));
  const pct = Math.max(0, Math.min(100, Math.round(depositPercent)));

  const rawFee = Math.round(sub * PLAN.clientFee);
  const fee = sub === 0 ? 0 : Math.min(Math.max(rawFee, toCents(PLAN.clientFeeMin)), toCents(PLAN.clientFeeMax));
  const total = sub + fee;

  const commission = Math.min(Math.round(sub * PLAN.commission[tier]), toCents(PLAN.commissionCap));
  const commissionTax = Math.round(commission * PLAN.commissionVat);
  const providerNet = Math.max(0, sub - commission - commissionTax);

  const fullUpfront = pct >= 100;
  const deposit = fullUpfront ? total : Math.round(total * pct / 100);
  const balance = total - deposit;
  // Adelanto: la parte del anticipo que corresponde al trabajo, nunca más que lo que le toca al profesional
  const advance = fullUpfront ? 0 : Math.min(Math.round(sub * pct / 100 * PLAN.advanceShareOfDeposit), providerNet);

  return {
    version: PRICING_VERSION,
    tier,
    subtotal: toMxn(sub),
    clientFee: toMxn(fee),
    total: toMxn(total),
    commission: toMxn(commission),
    commissionTax: toMxn(commissionTax),
    providerNet: toMxn(providerNet),
    depositPercent: fullUpfront ? 100 : pct,
    deposit: toMxn(deposit),
    balance: toMxn(balance),
    advance: toMxn(advance),
    guaranteeContribution: toMxn(Math.round(sub * PLAN.guaranteeFund)),
  };
}

/** Lo que recibe el profesional por una oferta, para mostrarlo antes de enviarla. */
export function providerTakeHome(subtotalMxn: number, tier: ProviderTier) {
  const q = quote(subtotalMxn, tier, 0);
  return { commission: q.commission + q.commissionTax, net: q.providerNet };
}

export const formatMxn = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

export const pct = (n: number) => `${Math.round(n * 1000) / 10}%`;
