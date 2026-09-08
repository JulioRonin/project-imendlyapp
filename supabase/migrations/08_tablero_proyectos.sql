-- ========================================================
-- 08. TABLERO DE PROYECTOS (Oferta-Demanda)
-- El cliente publica un proyecto; proveedores certificados ofertan.
-- Reglas de negocio en el schema: máx 5 ofertas activas por proyecto,
-- 1 oferta por proveedor por proyecto, moderación previa a publicación.
-- ========================================================

-- 1. ENUMS
DO $$ BEGIN
  CREATE TYPE project_status AS ENUM ('pending_review', 'open', 'assigned', 'completed', 'cancelled', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE offer_status AS ENUM ('active', 'accepted', 'declined', 'withdrawn');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE offer_type AS ENUM ('price', 'visit');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. TABLAS

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  display_id TEXT UNIQUE NOT NULL, -- e.g. 'PRJ-4821'
  client_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,

  category TEXT NOT NULL,           -- mismo catálogo que providers.category
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  photos TEXT[] DEFAULT '{}',

  -- Ubicación aproximada: la dirección exacta NUNCA vive aquí,
  -- se comparte hasta agendar visita / aceptar oferta.
  zone TEXT NOT NULL,
  neighborhood TEXT,

  budget_min NUMERIC(10,2),
  budget_max NUMERIC(10,2),
  timing TEXT DEFAULT 'flexible' CHECK (timing IN ('urgente', 'esta_semana', 'este_mes', 'flexible')),

  status project_status DEFAULT 'pending_review',
  moderation_note TEXT,             -- razón de rechazo del admin
  max_offers INTEGER DEFAULT 5,
  offers_count INTEGER DEFAULT 0,   -- solo ofertas activas (mantenido por trigger)
  accepted_offer_id UUID,           -- FK lógica a project_offers (se agrega abajo)
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL, -- orden creada al aceptar

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.project_offers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE NOT NULL,

  offer_type offer_type NOT NULL DEFAULT 'price',
  amount NUMERIC(10,2),             -- NULL cuando offer_type = 'visit'
  amount_max NUMERIC(10,2),         -- opcional: rango
  message TEXT NOT NULL,
  estimated_days INTEGER,
  includes_materials BOOLEAN DEFAULT FALSE,

  -- Anticipo protegido: % que el proveedor solicita al arrancar (práctica de mercado 30-50%)
  deposit_percent INTEGER DEFAULT 30 CHECK (deposit_percent BETWEEN 0 AND 50),

  status offer_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Una oferta por proveedor por proyecto
  UNIQUE(project_id, provider_id),
  -- Oferta de precio debe traer monto
  CONSTRAINT price_offer_has_amount CHECK (offer_type = 'visit' OR amount IS NOT NULL)
);

ALTER TABLE public.projects
  DROP CONSTRAINT IF EXISTS projects_accepted_offer_fk;
ALTER TABLE public.projects
  ADD CONSTRAINT projects_accepted_offer_fk
  FOREIGN KEY (accepted_offer_id) REFERENCES public.project_offers(id) ON DELETE SET NULL;

-- 3. ÍNDICES
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_client ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_zone ON public.projects(zone);
CREATE INDEX IF NOT EXISTS idx_offers_project ON public.project_offers(project_id);
CREATE INDEX IF NOT EXISTS idx_offers_provider ON public.project_offers(provider_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON public.project_offers(status);

-- 4. TRIGGERS

-- updated_at (reutiliza la función existente)
DROP TRIGGER IF EXISTS update_projects_modtime ON public.projects;
CREATE TRIGGER update_projects_modtime BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();
DROP TRIGGER IF EXISTS update_offers_modtime ON public.project_offers;
CREATE TRIGGER update_offers_modtime BEFORE UPDATE ON public.project_offers
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Cupo de ofertas: bloquea la 6ª oferta activa y solo permite ofertar en proyectos abiertos
CREATE OR REPLACE FUNCTION public.check_offer_slot()
RETURNS TRIGGER AS $$
DECLARE
  v_status project_status;
  v_max INTEGER;
  v_count INTEGER;
BEGIN
  SELECT status, max_offers, offers_count INTO v_status, v_max, v_count
  FROM public.projects WHERE id = NEW.project_id FOR UPDATE;

  IF v_status IS DISTINCT FROM 'open' THEN
    RAISE EXCEPTION 'El proyecto no está abierto a ofertas';
  END IF;
  IF v_count >= v_max THEN
    RAISE EXCEPTION 'Este proyecto ya alcanzó el máximo de ofertas';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_check_offer_slot ON public.project_offers;
CREATE TRIGGER trg_check_offer_slot BEFORE INSERT ON public.project_offers
  FOR EACH ROW EXECUTE FUNCTION public.check_offer_slot();

-- Mantener offers_count = ofertas activas
CREATE OR REPLACE FUNCTION public.sync_offers_count()
RETURNS TRIGGER AS $$
DECLARE
  v_project UUID;
BEGIN
  v_project := COALESCE(NEW.project_id, OLD.project_id);
  UPDATE public.projects SET offers_count = (
    SELECT COUNT(*) FROM public.project_offers
    WHERE project_id = v_project AND status = 'active'
  ) WHERE id = v_project;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_offers_count ON public.project_offers;
CREATE TRIGGER trg_sync_offers_count AFTER INSERT OR UPDATE OR DELETE ON public.project_offers
  FOR EACH ROW EXECUTE FUNCTION public.sync_offers_count();

-- 5. ROW LEVEL SECURITY
-- Nota: políticas reales (no el USING(true) de desarrollo de tablas anteriores).
-- El helper is_admin() consulta el rol en public.users.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin');
$$ LANGUAGE sql SECURITY DEFINER;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_offers ENABLE ROW LEVEL SECURITY;

-- PROJECTS
DROP POLICY IF EXISTS "Clients manage own projects" ON public.projects;
CREATE POLICY "Clients manage own projects" ON public.projects
  FOR ALL USING (client_id = auth.uid()) WITH CHECK (client_id = auth.uid());

DROP POLICY IF EXISTS "Providers browse open projects" ON public.projects;
CREATE POLICY "Providers browse open projects" ON public.projects
  FOR SELECT USING (status = 'open' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Providers see projects they offered on" ON public.projects;
CREATE POLICY "Providers see projects they offered on" ON public.projects
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.project_offers po
            WHERE po.project_id = id AND po.provider_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admin all projects" ON public.projects;
CREATE POLICY "Admin all projects" ON public.projects
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- OFFERS
DROP POLICY IF EXISTS "Providers manage own offers" ON public.project_offers;
CREATE POLICY "Providers manage own offers" ON public.project_offers
  FOR ALL USING (provider_id = auth.uid()) WITH CHECK (provider_id = auth.uid());

DROP POLICY IF EXISTS "Project owner sees offers" ON public.project_offers;
CREATE POLICY "Project owner sees offers" ON public.project_offers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects p
            WHERE p.id = project_id AND p.client_id = auth.uid())
  );

DROP POLICY IF EXISTS "Project owner resolves offers" ON public.project_offers;
CREATE POLICY "Project owner resolves offers" ON public.project_offers
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.projects p
            WHERE p.id = project_id AND p.client_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admin all offers" ON public.project_offers;
CREATE POLICY "Admin all offers" ON public.project_offers
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 6. STORAGE: bucket para fotos de proyectos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('projects', 'projects', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read project photos" ON storage.objects;
CREATE POLICY "Public read project photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'projects');
DROP POLICY IF EXISTS "Authenticated upload project photos" ON storage.objects;
CREATE POLICY "Authenticated upload project photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'projects' AND auth.uid() IS NOT NULL);
