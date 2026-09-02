-- ============================================================
-- 09. ARREGLO: recursión infinita en las políticas del tablero
--
-- Problema: la política de `projects` consultaba `project_offers`
-- y la de `project_offers` consultaba `projects`. Cada consulta
-- disparaba la RLS de la otra tabla, en ciclo, y PostgreSQL abortaba
-- con "infinite recursion detected in policy for relation projects".
--
-- Solución: mover ambas comprobaciones cruzadas a funciones
-- SECURITY DEFINER. Al ejecutarse con los privilegios del dueño,
-- no vuelven a evaluar la RLS de la tabla consultada y el ciclo
-- se rompe. Las funciones solo responden sí/no sobre el usuario
-- de la sesión, así que no amplían lo que nadie puede ver.
--
-- Seguro de ejecutar sobre una base ya creada.
-- ============================================================

-- ¿La sesión actual es dueña de este proyecto?
CREATE OR REPLACE FUNCTION public.owns_project(p_project_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = p_project_id AND client_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ¿La sesión actual ya ofertó en este proyecto?
CREATE OR REPLACE FUNCTION public.has_offer_on_project(p_project_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.project_offers
    WHERE project_id = p_project_id AND provider_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Recrear las dos políticas que se referenciaban entre sí
DROP POLICY IF EXISTS "Providers see projects they offered on" ON public.projects;
CREATE POLICY "Providers see projects they offered on" ON public.projects
  FOR SELECT USING (public.has_offer_on_project(id));

DROP POLICY IF EXISTS "Project owner sees offers" ON public.project_offers;
CREATE POLICY "Project owner sees offers" ON public.project_offers
  FOR SELECT USING (public.owns_project(project_id));

DROP POLICY IF EXISTS "Project owner resolves offers" ON public.project_offers;
CREATE POLICY "Project owner resolves offers" ON public.project_offers
  FOR UPDATE USING (public.owns_project(project_id));

-- Otorgar solo a los roles que existan (Supabase trae anon y authenticated)
DO $$
DECLARE r TEXT;
BEGIN
  FOREACH r IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = r) THEN
      EXECUTE format('GRANT EXECUTE ON FUNCTION public.owns_project(UUID) TO %I', r);
      EXECUTE format('GRANT EXECUTE ON FUNCTION public.has_offer_on_project(UUID) TO %I', r);
    END IF;
  END LOOP;
END $$;
