-- ============================================================
-- 11. EVIDENCIA LEGAL Y ONBOARDING DE PROFESIONALES
--
-- 1. legal_acceptances: registro INMUTABLE de qué documento legal
--    aceptó cada usuario, en qué versión y cuándo. Es la evidencia del
--    consentimiento (incluido el consentimiento expreso para datos
--    personales sensibles de los profesionales).
-- 2. handle_new_user: además de crear el perfil, guarda el teléfono y
--    registra las aceptaciones enviadas en el registro. Se hace aquí
--    (SECURITY DEFINER) porque si Supabase exige confirmar el correo,
--    el cliente aún no tiene sesión al registrarse y no podría
--    insertar la evidencia por su cuenta.
-- 3. Una sola solicitud de onboarding por usuario.
-- 4. Aprobar una solicitud (status = 'active') activa y certifica
--    automáticamente al profesional. Antes solo cambiaba el estado de
--    la solicitud y el perfil quedaba pendiente para siempre.
--
-- Requiere la migración 10. Idempotente.
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. Evidencia de aceptación de documentos legales
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.legal_acceptances (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  document    TEXT NOT NULL CHECK (document IN (
                'terminos_clientes',
                'terminos_profesionales',
                'aviso_privacidad',
                'datos_sensibles',
                'consentimiento_referencias',
                'declaracion_veracidad'
              )),
  version     TEXT NOT NULL,
  source      TEXT NOT NULL DEFAULT 'app' CHECK (source IN ('registro', 'onboarding', 'app')),
  accepted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (user_id, document, version)
);

CREATE INDEX IF NOT EXISTS idx_legal_acceptances_user ON public.legal_acceptances(user_id);

ALTER TABLE public.legal_acceptances ENABLE ROW LEVEL SECURITY;

-- Cada quien ve y registra lo suyo; el admin consulta todo.
-- Sin políticas de UPDATE ni DELETE: la evidencia no se edita.
DROP POLICY IF EXISTS "legal_select_own" ON public.legal_acceptances;
DROP POLICY IF EXISTS "legal_insert_own" ON public.legal_acceptances;
CREATE POLICY "legal_select_own" ON public.legal_acceptances FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "legal_insert_own" ON public.legal_acceptances FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ─────────────────────────────────────────────
-- 2. Alta de usuarios con consentimientos
--    Metadatos esperados en signUp:
--    { full_name, role, phone,
--      legal: { "<documento>": "<version>", ... } }
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role user_role;
  v_doc  TEXT;
  v_ver  TEXT;
BEGIN
  -- Solo 'client' o 'provider' pueden venir del registro; 'admin' se asigna a mano.
  v_role := CASE
    WHEN new.raw_user_meta_data->>'role' = 'provider' THEN 'provider'::user_role
    ELSE 'client'::user_role
  END;

  INSERT INTO public.users (id, full_name, role, phone)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Nuevo Usuario'),
    v_role,
    NULLIF(new.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO NOTHING;

  IF v_role = 'provider' THEN
    INSERT INTO public.providers (id, category) VALUES (new.id, 'General')
    ON CONFLICT (id) DO NOTHING;
  END IF;

  -- Evidencia de los documentos aceptados durante el registro
  IF jsonb_typeof(new.raw_user_meta_data->'legal') = 'object' THEN
    FOR v_doc, v_ver IN
      SELECT key, value FROM jsonb_each_text(new.raw_user_meta_data->'legal')
    LOOP
      IF v_doc IN ('terminos_clientes', 'terminos_profesionales', 'aviso_privacidad',
                   'datos_sensibles', 'consentimiento_referencias', 'declaracion_veracidad')
         AND v_ver IS NOT NULL AND length(v_ver) <= 32 THEN
        INSERT INTO public.legal_acceptances (user_id, document, version, source)
        VALUES (new.id, v_doc, v_ver, 'registro')
        ON CONFLICT (user_id, document, version) DO NOTHING;
      END IF;
    END LOOP;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─────────────────────────────────────────────
-- 3. Una solicitud de onboarding por usuario
--    (solo si no hay duplicados previos que lo impidan)
-- ─────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT user_id FROM public.onboarding_applications
    WHERE user_id IS NOT NULL GROUP BY user_id HAVING count(*) > 1
  ) THEN
    CREATE UNIQUE INDEX IF NOT EXISTS uq_onboarding_user
      ON public.onboarding_applications(user_id) WHERE user_id IS NOT NULL;
  ELSE
    RAISE NOTICE 'Hay solicitudes duplicadas por usuario: depúralas y vuelve a correr esta migración para crear el índice único.';
  END IF;
END $$;

-- ─────────────────────────────────────────────
-- 4. Aprobar la solicitud activa y certifica al profesional
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.activate_provider_on_approval()
RETURNS TRIGGER AS $$
DECLARE
  v_category TEXT;
BEGIN
  IF NEW.status = 'active' AND OLD.status IS DISTINCT FROM 'active' AND NEW.user_id IS NOT NULL THEN
    v_category := CASE NEW.main_specialty
      WHEN 'elec' THEN 'Electricidad'
      WHEN 'plom' THEN 'Plomería'
      WHEN 'pint' THEN 'Pintura'
      WHEN 'clim' THEN 'Climas/AC'
      WHEN 'limp' THEN 'Limpieza'
      WHEN 'alba' THEN 'Albañilería'
      WHEN 'carp' THEN 'Carpintería'
      WHEN 'fumi' THEN 'Fumigación'
      WHEN 'otro' THEN COALESCE(NULLIF(NEW.other_specialty_name, ''), 'Otro')
      ELSE COALESCE(NEW.main_specialty, 'General')
    END;

    INSERT INTO public.providers (id, category) VALUES (NEW.user_id, v_category)
    ON CONFLICT (id) DO NOTHING;

    UPDATE public.providers SET
      account_status = 'active',
      is_verified    = TRUE,
      category       = v_category,
      categories     = ARRAY[v_category],
      zones          = COALESCE(NEW.zones, zones)
    WHERE id = NEW.user_id;
  END IF;

  -- Si una solicitud aprobada se revierte, el profesional deja de estar visible
  IF OLD.status = 'active' AND NEW.status IS DISTINCT FROM 'active' AND NEW.user_id IS NOT NULL THEN
    UPDATE public.providers SET account_status = 'pending', is_verified = FALSE
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_activate_provider_on_approval ON public.onboarding_applications;
CREATE TRIGGER trg_activate_provider_on_approval
  AFTER UPDATE OF status ON public.onboarding_applications
  FOR EACH ROW EXECUTE FUNCTION public.activate_provider_on_approval();
