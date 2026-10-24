-- ═════════════════════════════════════════════════════════════
-- 12 · Cobros con Stripe (Connect, cargos y transferencias separadas)
--
-- Modelo de dinero:
--   1. El cliente paga a la plataforma (anticipo y saldo, o pago completo).
--   2. La plataforma retiene el dinero y lo transfiere al profesional:
--        · adelanto para materiales al iniciar el trabajo (si hubo anticipo)
--        · el resto 24 h después de que el cliente confirma la entrega
--   3. La comisión y la tarifa de servicio se quedan en la plataforma.
--
-- Todos los montos de dinero los escribe SOLO el servidor (rol de servicio):
-- ni clientes ni profesionales pueden crear órdenes ni tocar montos o estados
-- de pago desde la app. Idempotente: se puede correr más de una vez.
-- ═════════════════════════════════════════════════════════════

-- ── 1. Profesionales: nivel y cuenta de Stripe ───────────────
ALTER TABLE public.providers
  ADD COLUMN IF NOT EXISTS tier TEXT NOT NULL DEFAULT 'verificado',
  ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_details_submitted BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS stripe_payouts_enabled BOOLEAN NOT NULL DEFAULT false;

DO $$ BEGIN
  ALTER TABLE public.providers ADD CONSTRAINT providers_tier_check
    CHECK (tier IN ('verificado', 'certificado', 'elite'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE UNIQUE INDEX IF NOT EXISTS uq_providers_stripe_account
  ON public.providers(stripe_account_id) WHERE stripe_account_id IS NOT NULL;

-- Nivel y datos de Stripe solo los cambia el equipo o el servidor
CREATE OR REPLACE FUNCTION public.protect_provider_billing()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.is_privileged() THEN
    IF NEW.tier                     IS DISTINCT FROM OLD.tier
    OR NEW.stripe_account_id        IS DISTINCT FROM OLD.stripe_account_id
    OR NEW.stripe_details_submitted IS DISTINCT FROM OLD.stripe_details_submitted
    OR NEW.stripe_payouts_enabled   IS DISTINCT FROM OLD.stripe_payouts_enabled THEN
      RAISE EXCEPTION 'El nivel y la cuenta de cobro solo los cambia I mendly';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_provider_billing ON public.providers;
CREATE TRIGGER trg_protect_provider_billing BEFORE UPDATE ON public.providers
  FOR EACH ROW EXECUTE FUNCTION public.protect_provider_billing();

-- ── 2. Órdenes: precio congelado y ciclo del dinero ──────────
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS origin TEXT NOT NULL DEFAULT 'booking',     -- booking | project
  ADD COLUMN IF NOT EXISTS offer_id UUID REFERENCES public.project_offers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS pricing_version TEXT,                        -- versión del plan con que se cotizó
  ADD COLUMN IF NOT EXISTS pricing_tier TEXT,
  ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12,2),                      -- precio del profesional
  ADD COLUMN IF NOT EXISTS client_fee NUMERIC(12,2) NOT NULL DEFAULT 0, -- tarifa de servicio al cliente
  ADD COLUMN IF NOT EXISTS commission NUMERIC(12,2) NOT NULL DEFAULT 0, -- comisión (sin IVA)
  ADD COLUMN IF NOT EXISTS commission_tax NUMERIC(12,2) NOT NULL DEFAULT 0, -- IVA de la comisión
  ADD COLUMN IF NOT EXISTS provider_net NUMERIC(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deposit_percent INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC(12,2) NOT NULL DEFAULT 0,   -- lo que paga el cliente al aceptar
  ADD COLUMN IF NOT EXISTS balance_amount NUMERIC(12,2) NOT NULL DEFAULT 0,   -- lo que paga al confirmar
  ADD COLUMN IF NOT EXISTS advance_amount NUMERIC(12,2) NOT NULL DEFAULT 0,   -- se libera al iniciar
  ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS released_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS refunded_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS guarantee_contribution NUMERIC(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS release_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payout_hold BOOLEAN NOT NULL DEFAULT false,  -- reclamo o contracargo abierto
  ADD COLUMN IF NOT EXISTS needs_review TEXT;                           -- motivo para que el admin intervenga

DO $$ BEGIN
  ALTER TABLE public.orders ADD CONSTRAINT orders_origin_check CHECK (origin IN ('booking', 'project'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_orders_release ON public.orders(release_at)
  WHERE confirmed_at IS NOT NULL;

-- Montos, estados y fechas del ciclo: solo el servidor o el admin.
-- Las partes siguen pudiendo editar datos no monetarios (dirección, notas).
CREATE OR REPLACE FUNCTION public.protect_order_payment()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.is_privileged() THEN
    IF NEW.status            IS DISTINCT FROM OLD.status
    OR NEW.payment_status    IS DISTINCT FROM OLD.payment_status
    OR NEW.payment_intent_id IS DISTINCT FROM OLD.payment_intent_id
    OR NEW.total_amount      IS DISTINCT FROM OLD.total_amount
    OR NEW.provider_id       IS DISTINCT FROM OLD.provider_id
    OR NEW.client_id         IS DISTINCT FROM OLD.client_id
    OR NEW.origin            IS DISTINCT FROM OLD.origin
    OR NEW.offer_id          IS DISTINCT FROM OLD.offer_id
    OR NEW.pricing_version   IS DISTINCT FROM OLD.pricing_version
    OR NEW.pricing_tier      IS DISTINCT FROM OLD.pricing_tier
    OR NEW.subtotal          IS DISTINCT FROM OLD.subtotal
    OR NEW.client_fee        IS DISTINCT FROM OLD.client_fee
    OR NEW.commission        IS DISTINCT FROM OLD.commission
    OR NEW.commission_tax    IS DISTINCT FROM OLD.commission_tax
    OR NEW.provider_net      IS DISTINCT FROM OLD.provider_net
    OR NEW.deposit_percent   IS DISTINCT FROM OLD.deposit_percent
    OR NEW.deposit_amount    IS DISTINCT FROM OLD.deposit_amount
    OR NEW.balance_amount    IS DISTINCT FROM OLD.balance_amount
    OR NEW.advance_amount    IS DISTINCT FROM OLD.advance_amount
    OR NEW.paid_amount       IS DISTINCT FROM OLD.paid_amount
    OR NEW.released_amount   IS DISTINCT FROM OLD.released_amount
    OR NEW.refunded_amount   IS DISTINCT FROM OLD.refunded_amount
    OR NEW.guarantee_contribution IS DISTINCT FROM OLD.guarantee_contribution
    OR NEW.started_at        IS DISTINCT FROM OLD.started_at
    OR NEW.delivered_at      IS DISTINCT FROM OLD.delivered_at
    OR NEW.confirmed_at      IS DISTINCT FROM OLD.confirmed_at
    OR NEW.release_at        IS DISTINCT FROM OLD.release_at
    OR NEW.payout_hold       IS DISTINCT FROM OLD.payout_hold
    OR NEW.needs_review      IS DISTINCT FROM OLD.needs_review THEN
      RAISE EXCEPTION 'El estado, los montos y los pagos de la orden solo cambian desde el servidor';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_order_payment ON public.orders;
CREATE TRIGGER trg_protect_order_payment BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.protect_order_payment();

-- Las órdenes ya no se crean desde el navegador: las crea el servidor con
-- el precio calculado ahí (reserva directa u oferta aceptada).
DROP POLICY IF EXISTS "orders_insert_client" ON public.orders;
DROP POLICY IF EXISTS "orders_insert_admin" ON public.orders;
CREATE POLICY "orders_insert_admin" ON public.orders FOR INSERT
  WITH CHECK (public.is_admin());

-- ── 3. Pagos del cliente (uno por PaymentIntent) ─────────────
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('deposit', 'balance', 'full')),
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'mxn',
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id TEXT,
  method TEXT,                                  -- card | oxxo | customer_balance …
  status TEXT NOT NULL DEFAULT 'requires_payment'
    CHECK (status IN ('requires_payment', 'processing', 'succeeded', 'failed', 'canceled', 'refunded', 'partially_refunded', 'disputed')),
  refunded_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (order_id, kind)
);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);

-- ── 4. Transferencias al profesional ─────────────────────────
CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('advance', 'final')),
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  stripe_transfer_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'reversed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (order_id, kind)
);
CREATE INDEX IF NOT EXISTS idx_payouts_provider ON public.payouts(provider_id);

-- ── 5. Eventos de Stripe ya procesados (idempotencia del webhook) ──
CREATE TABLE IF NOT EXISTS public.stripe_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 5b. Cliente de Stripe por usuario (para SPEI y métodos guardados) ──
CREATE TABLE IF NOT EXISTS public.billing_customers (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 6. RLS: lectura para las partes, escritura solo del servidor ──
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;      -- sin políticas: nadie desde la app
ALTER TABLE public.billing_customers ENABLE ROW LEVEL SECURITY;  -- sin políticas: nadie desde la app

DROP POLICY IF EXISTS "payments_select_party" ON public.payments;
CREATE POLICY "payments_select_party" ON public.payments FOR SELECT
  USING (public.is_order_party(order_id) OR public.is_admin());

DROP POLICY IF EXISTS "payouts_select_own" ON public.payouts;
CREATE POLICY "payouts_select_own" ON public.payouts FOR SELECT
  USING (provider_id = auth.uid() OR public.is_admin());

DROP TRIGGER IF EXISTS update_payments_modtime ON public.payments;
CREATE TRIGGER update_payments_modtime BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();
