"use client";

import { useMemo, useState } from 'react';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Loader2, Lock } from 'lucide-react';
import { formatMxn } from '@/lib/pricing';

let stripePromise: Promise<Stripe | null> | null = null;
const getStripe = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) return null;
  if (!stripePromise) stripePromise = loadStripe(key, { locale: 'es-419' });
  return stripePromise;
};

// Apariencia del formulario de Stripe con los colores de Nocturne Atelier
const APPEARANCE = {
  theme: 'flat' as const,
  variables: {
    colorPrimary: '#111111',
    colorBackground: '#F1EEE8',
    colorText: '#111111',
    colorTextSecondary: '#6F6B66',
    colorDanger: '#D0466B',
    fontFamily: 'Urbanist, system-ui, sans-serif',
    borderRadius: '20px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': { padding: '16px 18px', fontWeight: '600' },
    '.Label': { fontWeight: '700', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6F6B66' },
    '.Tab': { backgroundColor: '#FFFFFF', border: '1px solid rgba(17,17,17,0.07)' },
    '.Tab--selected': { backgroundColor: '#FFAA78', color: '#111111' },
  },
};

export type PayResult = 'succeeded' | 'processing';

function PayForm({ amount, returnUrl, onDone, label }: { amount: number; returnUrl: string; onDone: (r: PayResult) => void; label?: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pay = async () => {
    if (!stripe || !elements) return;
    setBusy(true);
    setError(null);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: 'if_required',
    });
    setBusy(false);
    if (error) {
      setError(error.message || 'No pudimos procesar el pago.');
      return;
    }
    // OXXO y SPEI quedan "en proceso" hasta que llega el dinero; el webhook lo confirma
    onDone(paymentIntent?.status === 'succeeded' ? 'succeeded' : 'processing');
  };

  return (
    <div className="space-y-5">
      <PaymentElement onReady={() => setReady(true)} options={{ layout: 'tabs' }} />
      {error && <p className="p-4 rounded-[1.25rem] bg-rose/15 text-error text-[13px] font-semibold text-center">{error}</p>}
      <button
        type="button"
        onClick={pay}
        disabled={!stripe || !ready || busy}
        className="w-full h-14 rounded-full bg-ink text-white text-[13px] font-bold flex items-center justify-center gap-2 v2-press disabled:opacity-60"
      >
        {busy ? <Loader2 size={16} className="animate-spin" /> : <><Lock size={14} /> {label || 'Pagar'} {formatMxn(amount)}</>}
      </button>
      <p className="text-center text-[11.5px] font-medium text-faint">
        Pago procesado por Stripe. I mendly no guarda los datos de tu tarjeta.
      </p>
    </div>
  );
}

/** Formulario de pago de Stripe (tarjeta, OXXO o SPEI según lo activado en el Dashboard). */
export function StripePay(props: { clientSecret: string; amount: number; returnUrl: string; onDone: (r: PayResult) => void; label?: string }) {
  const stripe = useMemo(getStripe, []);
  if (!stripe) {
    return (
      <p className="p-4 rounded-[1.25rem] bg-sand text-[13px] font-semibold text-muted text-center">
        Los pagos aún no están configurados. Falta la llave pública de Stripe.
      </p>
    );
  }
  return (
    <Elements stripe={stripe} options={{ clientSecret: props.clientSecret, appearance: APPEARANCE, locale: 'es-419' }}>
      <PayForm {...props} />
    </Elements>
  );
}
