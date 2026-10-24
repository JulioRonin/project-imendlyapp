import 'server-only';
import Stripe from 'stripe';

// Cliente de Stripe del lado del servidor. La llave secreta vive SOLO en
// variables de entorno del servidor (nunca NEXT_PUBLIC_).
let client: Stripe | null = null;

export function stripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new HttpError(503, 'Los pagos no están configurados todavía.');
  if (!client) client = new Stripe(key, { appInfo: { name: 'I mendly' } });
  return client;
}

/** Pesos a centavos para la API de Stripe. */
export const cents = (mxn: number) => Math.round(Number(mxn) * 100);

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
