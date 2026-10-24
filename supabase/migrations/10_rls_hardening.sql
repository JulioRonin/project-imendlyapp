-- ============================================================
-- 10. ENDURECIMIENTO DE RLS — cierre de las políticas de desarrollo
--
-- Hasta hoy, users/providers/provider_services/provider_portfolio/
-- provider_availability/reviews/onboarding_applications tenían
-- `FOR ALL USING (true)`: cualquiera con la llave pública podía leer
-- y ESCRIBIR todo (incluido ponerse role = 'admin'). Además el bucket
-- de documentos de identidad era de lectura pública y el trigger de
-- alta confiaba en el `role` enviado por el cliente al registrarse.
--
-- Principios:
--   · Lectura pública solo de lo que es catálogo (proveedores, servicios,
--     portafolio, disponibilidad, reseñas, nombres/avatares de usuarios).
--   · Escritura solo sobre lo propio (auth.uid()) o siendo admin.
--   · Campos sensibles protegidos por trigger aunque la fila sea propia
--     (role, is_verified, account_status, rating, payment_status…).
--   · Documentos de identidad: bucket privado, solo dueño o admin.
--
-- Seguro de ejecutar sobre una base ya creada (idempotente).
-- ============================================================

-- ─────────────────────────────────────────────
-- 0. Helpers
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Contexto privilegiado: admin autenticado, o sin sesión (SQL Editor /
-- service_role / seeds). Para 'anon' el uid también es NULL, pero RLS ya
-- le niega las filas; los triggers son defensa en profundidad para
-- ediciones propias de usuarios autenticados.
CREATE OR REPLACE FUNCTION public.is_privileged()
RETURNS BOOLEAN AS $$
  SELECT auth.uid() IS NULL OR public.is_admin();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ¿La sesión participa en esta orden (cliente o proveedor)?
CREATE OR REPLACE FUNCTION public.is_order_party(p_order_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.orders
    WHERE id = p_order_id AND (client_id = auth.uid() OR provider_id = auth.uid())
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ─────────────────────────────────────────────
-- 1. Alta de usuarios: nunca confiar en el rol que manda el cliente
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role user_role;
BEGIN
  -- Solo 'client' o 'provider' pueden venir del registro; 'admin' se asigna a mano.
  v_role := CASE
    WHEN new.raw_user_meta_data->>'role' = 'provider' THEN 'provider'::user_role
    ELSE 'client'::user_role
  END;

  INSERT INTO public.users (id, full_name, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'Nuevo Usuario'), v_role)
  ON CONFLICT (id) DO NOTHING;

  IF v_role = 'provider' THEN
    INSERT INTO public.providers (id, category) VALUES (new.id, 'General')
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─────────────────────────────────────────────
-- 2. Triggers de protección de campos sensibles
-- ─────────────────────────────────────────────

-- users.role: solo un admin puede cambiarlo o insertarlo distinto de client/provider
CREATE OR REPLACE FUNCTION public.protect_user_role()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.role = 'admin' AND NOT public.is_privileged() THEN
      RAISE EXCEPTION 'No tienes permiso para crear cuentas de administrador';
    END IF;
  ELSIF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_privileged() THEN
    RAISE EXCEPTION 'No tienes permiso para cambiar el rol';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_user_role ON public.users;
CREATE TRIGGER trg_protect_user_role BEFORE INSERT OR UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.protect_user_role();

-- providers: certificación, estado y métricas solo los mueve el admin (o el sistema)
CREATE OR REPLACE FUNCTION public.protect_provider_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.is_privileged() THEN
    IF NEW.is_verified     IS DISTINCT FROM OLD.is_verified
    OR NEW.account_status  IS DISTINCT FROM OLD.account_status
    OR NEW.rating          IS DISTINCT FROM OLD.rating
    OR NEW.reviews_count   IS DISTINCT FROM OLD.reviews_count THEN
      RAISE EXCEPTION 'Solo el equipo I mendly puede cambiar certificación, estado o métricas';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_provider_fields ON public.providers;
CREATE TRIGGER trg_protect_provider_fields BEFORE UPDATE ON public.providers
  FOR EACH ROW EXECUTE FUNCTION public.protect_provider_fields();

-- orders: el estado de pago solo lo cambia el admin (más adelante, el webhook del procesador)
CREATE OR REPLACE FUNCTION public.protect_order_payment()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.is_privileged() THEN
    IF NEW.payment_status IS DISTINCT FROM OLD.payment_status
    OR NEW.payment_intent_id IS DISTINCT FROM OLD.payment_intent_id
    OR NEW.total_amount IS DISTINCT FROM OLD.total_amount THEN
      RAISE EXCEPTION 'El estado de pago y el monto no pueden modificarse desde la app';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_order_payment ON public.orders;
CREATE TRIGGER trg_protect_order_payment BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.protect_order_payment();

-- ─────────────────────────────────────────────
-- 3. Políticas por tabla
-- ─────────────────────────────────────────────

-- USERS: nombres/avatares legibles (los joins del catálogo los necesitan);
-- escritura solo propia o admin. NOTA: el teléfono queda legible para
-- usuarios autenticados hasta que exista el chat con contacto enmascarado.
DROP POLICY IF EXISTS "Enable all operations for users" ON public.users;
DROP POLICY IF EXISTS "Enable all for users" ON public.users;
DROP POLICY IF EXISTS "Public can view users" ON public.users;
DROP POLICY IF EXISTS "users_select" ON public.users;
DROP POLICY IF EXISTS "users_insert_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "users_delete_admin" ON public.users;
CREATE POLICY "users_select" ON public.users FOR SELECT USING (true);
CREATE POLICY "users_insert_own" ON public.users FOR INSERT
  WITH CHECK (id = auth.uid() OR public.is_admin());
CREATE POLICY "users_update_own" ON public.users FOR UPDATE
  USING (id = auth.uid() OR public.is_admin()) WITH CHECK (id = auth.uid() OR public.is_admin());
CREATE POLICY "users_delete_admin" ON public.users FOR DELETE USING (public.is_admin());

-- PROVIDERS: catálogo público; escritura propia o admin
DROP POLICY IF EXISTS "Enable all operations for providers" ON public.providers;
DROP POLICY IF EXISTS "Enable all for providers" ON public.providers;
DROP POLICY IF EXISTS "Public can view providers" ON public.providers;
DROP POLICY IF EXISTS "providers_select" ON public.providers;
DROP POLICY IF EXISTS "providers_insert_own" ON public.providers;
DROP POLICY IF EXISTS "providers_update_own" ON public.providers;
DROP POLICY IF EXISTS "providers_delete_admin" ON public.providers;
CREATE POLICY "providers_select" ON public.providers FOR SELECT USING (true);
CREATE POLICY "providers_insert_own" ON public.providers FOR INSERT
  WITH CHECK (id = auth.uid() OR public.is_admin());
CREATE POLICY "providers_update_own" ON public.providers FOR UPDATE
  USING (id = auth.uid() OR public.is_admin()) WITH CHECK (id = auth.uid() OR public.is_admin());
CREATE POLICY "providers_delete_admin" ON public.providers FOR DELETE USING (public.is_admin());

-- PROVIDER_SERVICES / PORTFOLIO / AVAILABILITY: lectura pública, escritura del dueño o admin
DROP POLICY IF EXISTS "Enable all operations for services" ON public.provider_services;
DROP POLICY IF EXISTS "Enable all for services" ON public.provider_services;
DROP POLICY IF EXISTS "Public can view services" ON public.provider_services;
DROP POLICY IF EXISTS "services_select" ON public.provider_services;
DROP POLICY IF EXISTS "services_write_own" ON public.provider_services;
CREATE POLICY "services_select" ON public.provider_services FOR SELECT USING (true);
CREATE POLICY "services_write_own" ON public.provider_services FOR ALL
  USING (provider_id = auth.uid() OR public.is_admin())
  WITH CHECK (provider_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Enable all operations for portfolios" ON public.provider_portfolio;
DROP POLICY IF EXISTS "Enable all for portfolios" ON public.provider_portfolio;
DROP POLICY IF EXISTS "Enable all for portfolio" ON public.provider_portfolio;
DROP POLICY IF EXISTS "Public can view portfolios" ON public.provider_portfolio;
DROP POLICY IF EXISTS "Public can view portfolio" ON public.provider_portfolio;
DROP POLICY IF EXISTS "portfolio_select" ON public.provider_portfolio;
DROP POLICY IF EXISTS "portfolio_write_own" ON public.provider_portfolio;
CREATE POLICY "portfolio_select" ON public.provider_portfolio FOR SELECT USING (true);
CREATE POLICY "portfolio_write_own" ON public.provider_portfolio FOR ALL
  USING (provider_id = auth.uid() OR public.is_admin())
  WITH CHECK (provider_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Providers can manage own availability" ON public.provider_availability;
DROP POLICY IF EXISTS "Enable all for availability" ON public.provider_availability;
DROP POLICY IF EXISTS "Public can view availability" ON public.provider_availability;
DROP POLICY IF EXISTS "availability_select" ON public.provider_availability;
DROP POLICY IF EXISTS "availability_write_own" ON public.provider_availability;
CREATE POLICY "availability_select" ON public.provider_availability FOR SELECT USING (true);
CREATE POLICY "availability_write_own" ON public.provider_availability FOR ALL
  USING (provider_id = auth.uid() OR public.is_admin())
  WITH CHECK (provider_id = auth.uid() OR public.is_admin());

-- REVIEWS: lectura pública; solo el cliente autenticado crea la suya; admin modera
DROP POLICY IF EXISTS "Enable all for reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "reviews_select" ON public.reviews;
DROP POLICY IF EXISTS "reviews_insert_own" ON public.reviews;
DROP POLICY IF EXISTS "reviews_admin" ON public.reviews;
CREATE POLICY "reviews_select" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_own" ON public.reviews FOR INSERT
  WITH CHECK (client_id = auth.uid() AND client_id <> provider_id);
CREATE POLICY "reviews_admin" ON public.reviews FOR UPDATE USING (public.is_admin());
DROP POLICY IF EXISTS "reviews_delete_admin" ON public.reviews;
CREATE POLICY "reviews_delete_admin" ON public.reviews FOR DELETE USING (public.is_admin());

-- ORDERS: solo las partes o el admin; el cliente crea las suyas
DROP POLICY IF EXISTS "Clients see own orders" ON public.orders;
DROP POLICY IF EXISTS "Providers see assigned orders" ON public.orders;
DROP POLICY IF EXISTS "orders_select_party" ON public.orders;
DROP POLICY IF EXISTS "orders_insert_client" ON public.orders;
DROP POLICY IF EXISTS "orders_update_party" ON public.orders;
DROP POLICY IF EXISTS "orders_delete_admin" ON public.orders;
CREATE POLICY "orders_select_party" ON public.orders FOR SELECT
  USING (client_id = auth.uid() OR provider_id = auth.uid() OR public.is_admin());
CREATE POLICY "orders_insert_client" ON public.orders FOR INSERT
  WITH CHECK (client_id = auth.uid() OR public.is_admin());
CREATE POLICY "orders_update_party" ON public.orders FOR UPDATE
  USING (client_id = auth.uid() OR provider_id = auth.uid() OR public.is_admin())
  WITH CHECK (client_id = auth.uid() OR provider_id = auth.uid() OR public.is_admin());
CREATE POLICY "orders_delete_admin" ON public.orders FOR DELETE USING (public.is_admin());

-- DISPUTES: las partes de la orden las ven; quien reporta la crea; admin resuelve
DROP POLICY IF EXISTS "disputes_select" ON public.disputes;
DROP POLICY IF EXISTS "disputes_insert_reporter" ON public.disputes;
DROP POLICY IF EXISTS "disputes_admin" ON public.disputes;
CREATE POLICY "disputes_select" ON public.disputes FOR SELECT
  USING (reporter_id = auth.uid() OR public.is_order_party(order_id) OR public.is_admin());
CREATE POLICY "disputes_insert_reporter" ON public.disputes FOR INSERT
  WITH CHECK (reporter_id = auth.uid() AND public.is_order_party(order_id));
CREATE POLICY "disputes_admin" ON public.disputes FOR UPDATE USING (public.is_admin());

-- ONBOARDING_APPLICATIONS: el aspirante crea y ve la suya; admin gestiona
DROP POLICY IF EXISTS "Public can submit onboarding application" ON public.onboarding_applications;
DROP POLICY IF EXISTS "Admins can manage onboarding applications" ON public.onboarding_applications;
DROP POLICY IF EXISTS "onboarding_insert_own" ON public.onboarding_applications;
DROP POLICY IF EXISTS "onboarding_select_own" ON public.onboarding_applications;
DROP POLICY IF EXISTS "onboarding_admin" ON public.onboarding_applications;
CREATE POLICY "onboarding_insert_own" ON public.onboarding_applications FOR INSERT
  WITH CHECK (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "onboarding_select_own" ON public.onboarding_applications FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "onboarding_admin" ON public.onboarding_applications FOR UPDATE USING (public.is_admin());
DROP POLICY IF EXISTS "onboarding_delete_admin" ON public.onboarding_applications;
CREATE POLICY "onboarding_delete_admin" ON public.onboarding_applications FOR DELETE USING (public.is_admin());

-- USER_ADDRESSES: ya era propia; el admin también puede leer (atención y moderación)
DROP POLICY IF EXISTS "addresses_admin_select" ON public.user_addresses;
CREATE POLICY "addresses_admin_select" ON public.user_addresses FOR SELECT USING (public.is_admin());

-- ─────────────────────────────────────────────
-- 4. Storage
-- ─────────────────────────────────────────────

-- Documentos de identidad: bucket PRIVADO, solo dueño o admin
UPDATE storage.buckets SET public = false WHERE id = 'onboarding-docs';
DROP POLICY IF EXISTS "Public Onboarding Docs Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Onboarding Docs Upload" ON storage.objects;
DROP POLICY IF EXISTS "onboarding_docs_select_own" ON storage.objects;
DROP POLICY IF EXISTS "onboarding_docs_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "onboarding_docs_delete_own" ON storage.objects;
CREATE POLICY "onboarding_docs_select_own" ON storage.objects FOR SELECT
  USING (bucket_id = 'onboarding-docs' AND (owner = auth.uid() OR public.is_admin()));
CREATE POLICY "onboarding_docs_insert_own" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'onboarding-docs' AND auth.uid() IS NOT NULL);
CREATE POLICY "onboarding_docs_delete_own" ON storage.objects FOR DELETE
  USING (bucket_id = 'onboarding-docs' AND (owner = auth.uid() OR public.is_admin()));

-- Avatares, portafolio y fotos de proyectos: lectura pública, escritura autenticada,
-- borrar/actualizar solo el dueño del archivo o admin
DROP POLICY IF EXISTS "Allow public uploads for dev" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Users update own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users delete own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload project photos" ON storage.objects;
DROP POLICY IF EXISTS "media_insert_auth" ON storage.objects;
DROP POLICY IF EXISTS "media_update_own" ON storage.objects;
DROP POLICY IF EXISTS "media_delete_own" ON storage.objects;
CREATE POLICY "media_insert_auth" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id IN ('avatars', 'portfolio', 'projects') AND auth.uid() IS NOT NULL);
CREATE POLICY "media_update_own" ON storage.objects FOR UPDATE
  USING (bucket_id IN ('avatars', 'portfolio', 'projects') AND (owner = auth.uid() OR public.is_admin()));
CREATE POLICY "media_delete_own" ON storage.objects FOR DELETE
  USING (bucket_id IN ('avatars', 'portfolio', 'projects') AND (owner = auth.uid() OR public.is_admin()));
-- (las políticas de SELECT público "Public Access" y "Public read project photos" se conservan)
