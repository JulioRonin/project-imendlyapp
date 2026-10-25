-- ═════════════════════════════════════════════════════════════
-- 13 · Precio final después de la visita
--
-- Ofertas con rango ("$3,000 a $5,000") y visitas de valoración: al
-- aceptarlas no se cobra nada. Después de visitar, el profesional envía el
-- precio final (cotización). El cliente lo aprueba pagando el anticipo, o
-- pide otro precio. Si el precio supera el máximo del rango, el profesional
-- tiene que justificarlo.
--
-- Cada cotización queda guardada como evidencia para disputas.
-- Requiere la migración 12. Idempotente.
-- ═════════════════════════════════════════════════════════════

-- ── 1. Estado del precio en la orden ─────────────────────────
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS price_status TEXT NOT NULL DEFAULT 'final',  -- final | pending_quote | quoted
  ADD COLUMN IF NOT EXISTS quote_min NUMERIC(12,2),                     -- rango acordado en la oferta
  ADD COLUMN IF NOT EXISTS quote_max NUMERIC(12,2);

DO $$ BEGIN
  ALTER TABLE public.orders ADD CONSTRAINT orders_price_status_check
    CHECK (price_status IN ('final', 'pending_quote', 'quoted'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── 2. Historial de cotizaciones ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_quotes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  deposit_percent INTEGER NOT NULL DEFAULT 0 CHECK (deposit_percent BETWEEN 0 AND 50),
  note TEXT,
  over_range BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'accepted', 'rejected', 'superseded')),
  client_note TEXT,                              -- por qué el cliente pidió otro precio
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  decided_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_order_quotes_order ON public.order_quotes(order_id, created_at DESC);

ALTER TABLE public.order_quotes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "order_quotes_select_party" ON public.order_quotes;
CREATE POLICY "order_quotes_select_party" ON public.order_quotes FOR SELECT
  USING (public.is_order_party(order_id) OR public.is_admin());
-- Sin políticas de escritura: solo el servidor crea y decide cotizaciones.

-- ── 2b. Pago final en dos partes ─────────────────────────────
-- Con el tope de adelanto, una parte del anticipo se queda retenida y se
-- paga al final junto con el saldo, como una transferencia aparte.
ALTER TABLE public.payouts DROP CONSTRAINT IF EXISTS payouts_kind_check;
ALTER TABLE public.payouts ADD CONSTRAINT payouts_kind_check CHECK (kind IN ('advance', 'final', 'retained'));

-- ── 3. Protección de la orden por lista blanca ───────────────
-- Las partes solo pueden editar dirección, ubicación y fecha. Cualquier
-- otra columna, incluidas las que se agreguen en el futuro, solo la cambia
-- el servidor o el admin.
CREATE OR REPLACE FUNCTION public.protect_order_payment()
RETURNS TRIGGER AS $$
DECLARE
  editable TEXT[] := ARRAY['address', 'lat', 'lng', 'scheduled_date', 'updated_at'];
BEGIN
  IF NOT public.is_privileged() THEN
    IF (to_jsonb(NEW) - editable) IS DISTINCT FROM (to_jsonb(OLD) - editable) THEN
      RAISE EXCEPTION 'El estado, los montos y los pagos de la orden solo cambian desde el servidor';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_order_payment ON public.orders;
CREATE TRIGGER trg_protect_order_payment BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.protect_order_payment();
