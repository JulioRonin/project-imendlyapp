-- ============================================================
-- I MENDLY — DATOS DE DEMOSTRACIÓN
--
-- Crea usuarios de prueba con login real y datos suficientes
-- para recorrer el Tablero de Proyectos de punta a punta.
--
-- Requisito: haber ejecutado antes `setup_completo.sql`.
-- Uso: pegar en el SQL Editor de Supabase y ejecutar.
--
-- ⚠️  SOLO para entornos de desarrollo o demo.
--     Nunca ejecutar en la base de datos de producción:
--     crea cuentas con contraseña conocida.
--
-- Usuarios creados (contraseña: imendly123)
--   cliente@imendly.test     · María González      (cliente)
--   proveedor@imendly.test   · Javier Ramírez      (proveedor · Electricidad)
--   carpintero@imendly.test  · Laura Mendoza       (proveedor · Carpintería)
--   plomero@imendly.test     · Carlos Ibarra       (proveedor · Plomería)
--   admin@imendly.test       · Operación I mendly  (admin)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── Limpieza: permite re-ejecutar el seed sin duplicar ──────
DELETE FROM auth.users WHERE email IN (
  'cliente@imendly.test', 'proveedor@imendly.test',
  'carpintero@imendly.test', 'plomero@imendly.test', 'admin@imendly.test'
);

-- ── 1. Cuentas de autenticación ─────────────────────────────
-- El trigger on_auth_user_created crea automáticamente la fila
-- correspondiente en public.users (y en public.providers cuando
-- el rol es 'provider').

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, recovery_token, email_change, email_change_token_new
)
VALUES
  ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-4000-8000-000000000001',
   'authenticated', 'authenticated', 'cliente@imendly.test',
   crypt('imendly123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}',
   '{"full_name":"María González","role":"client"}',
   now(), now(), '', '', '', ''),

  ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-4000-8000-000000000002',
   'authenticated', 'authenticated', 'proveedor@imendly.test',
   crypt('imendly123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}',
   '{"full_name":"Javier Ramírez","role":"provider"}',
   now(), now(), '', '', '', ''),

  ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-4000-8000-000000000003',
   'authenticated', 'authenticated', 'carpintero@imendly.test',
   crypt('imendly123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}',
   '{"full_name":"Laura Mendoza","role":"provider"}',
   now(), now(), '', '', '', ''),

  ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-4000-8000-000000000004',
   'authenticated', 'authenticated', 'plomero@imendly.test',
   crypt('imendly123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}',
   '{"full_name":"Carlos Ibarra","role":"provider"}',
   now(), now(), '', '', '', ''),

  ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-4000-8000-000000000005',
   'authenticated', 'authenticated', 'admin@imendly.test',
   crypt('imendly123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}',
   '{"full_name":"Operación I mendly","role":"admin"}',
   now(), now(), '', '', '', '');

-- Identidades: necesarias para que el login con email funcione
INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id,
  last_sign_in_at, created_at, updated_at
)
SELECT
  gen_random_uuid(), u.id,
  jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
  'email', u.id::text, now(), now(), now()
FROM auth.users u
WHERE u.email LIKE '%@imendly.test';

-- ── 2. Perfiles ─────────────────────────────────────────────
-- El trigger ya creó public.users; aseguramos teléfono y rol.

UPDATE public.users SET phone = '656-100-0001'
  WHERE id = 'a0000000-0000-4000-8000-000000000001';
UPDATE public.users SET phone = '656-100-0002'
  WHERE id = 'a0000000-0000-4000-8000-000000000002';
UPDATE public.users SET phone = '656-100-0003'
  WHERE id = 'a0000000-0000-4000-8000-000000000003';
UPDATE public.users SET phone = '656-100-0004'
  WHERE id = 'a0000000-0000-4000-8000-000000000004';
UPDATE public.users SET role = 'admin'
  WHERE id = 'a0000000-0000-4000-8000-000000000005';

-- Perfiles de proveedor (el trigger los creó con categoría 'General')
UPDATE public.providers SET
  category = 'Electricidad',
  categories = ARRAY['Electricidad', 'Climas/AC'],
  experience_years = 12,
  about = 'Electricista certificado. Instalaciones residenciales, tableros y climas.',
  account_status = 'active', is_verified = TRUE,
  rating = 4.8, reviews_count = 34, base_price = 350,
  zones = ARRAY['Centro', 'Satélite', 'Pronaf'], coverage_radius_km = 15
WHERE id = 'a0000000-0000-4000-8000-000000000002';

UPDATE public.providers SET
  category = 'Carpintería',
  categories = ARRAY['Carpintería'],
  experience_years = 18,
  about = 'Carpintería a medida: cocinas integrales, clósets y pérgolas.',
  account_status = 'active', is_verified = TRUE,
  rating = 4.9, reviews_count = 51, base_price = 1500,
  zones = ARRAY['Centro', 'Gómez Morín', 'Valle del Sol'], coverage_radius_km = 20
WHERE id = 'a0000000-0000-4000-8000-000000000003';

UPDATE public.providers SET
  category = 'Plomería',
  categories = ARRAY['Plomería'],
  experience_years = 7,
  about = 'Plomería general, detección de fugas y mantenimiento hidráulico.',
  account_status = 'active', is_verified = TRUE,
  rating = 4.5, reviews_count = 19, base_price = 400,
  zones = ARRAY['Centro', 'Las Torres'], coverage_radius_km = 12
WHERE id = 'a0000000-0000-4000-8000-000000000004';

-- Servicios ofrecidos
INSERT INTO public.provider_services (provider_id, name, price, is_range, max_price, unit, category)
VALUES
  ('a0000000-0000-4000-8000-000000000002', 'Instalación de contacto',       250,  TRUE, 450,   'Pieza',    'Electricidad'),
  ('a0000000-0000-4000-8000-000000000002', 'Mantenimiento de minisplit',    650,  TRUE, 900,   'Equipo',   'Climas/AC'),
  ('a0000000-0000-4000-8000-000000000003', 'Cocina integral a medida',      18000, TRUE, 45000, 'Proyecto', 'Carpintería'),
  ('a0000000-0000-4000-8000-000000000003', 'Pérgola de madera',             12000, TRUE, 30000, 'Proyecto', 'Carpintería'),
  ('a0000000-0000-4000-8000-000000000004', 'Detección y reparación de fuga', 450,  TRUE, 1200,  'Servicio', 'Plomería');

-- ── 3. Proyectos del tablero ────────────────────────────────

INSERT INTO public.projects (
  id, display_id, client_id, category, title, description,
  zone, neighborhood, budget_min, budget_max, timing, status
)
VALUES
  -- Abierto y con ofertas: muestra el flujo completo al cliente
  ('b0000000-0000-4000-8000-000000000001', 'PRJ-4821',
   'a0000000-0000-4000-8000-000000000001', 'Carpintería',
   'Fabricar pérgola de madera para patio de 4×5 m',
   'Quiero una pérgola de madera tratada para el patio trasero, de aproximadamente 4 por 5 metros. El piso ya es de concreto. Me interesa que aguante el sol de Juárez y que incluya el sellado. Adjunto el espacio actual.',
   'Gómez Morín', 'Residencial Campestre', 18000, 35000, 'este_mes', 'open'),

  -- Abierto sin ofertas: el proveedor puede estrenar el formulario
  ('b0000000-0000-4000-8000-000000000002', 'PRJ-4822',
   'a0000000-0000-4000-8000-000000000001', 'Electricidad',
   'Instalación eléctrica para área de asador',
   'Necesito llevar corriente al área de asador: dos contactos exteriores, iluminación y una pastilla independiente en el tablero. La distancia desde el tablero es de unos 15 metros.',
   'Gómez Morín', 'Residencial Campestre', 4000, 9000, 'esta_semana', 'open'),

  -- En revisión: alimenta la cola de moderación del admin
  ('b0000000-0000-4000-8000-000000000003', 'PRJ-4823',
   'a0000000-0000-4000-8000-000000000001', 'Plomería',
   'Fuga de agua en baño principal',
   'Hay una fuga debajo del lavabo del baño principal que ya humedeció el mueble. Necesito que la revisen lo antes posible.',
   'Centro', 'Zona Centro', 800, 2500, 'urgente', 'pending_review');

-- Ofertas sobre el proyecto de la pérgola
-- (el trigger check_offer_slot exige que el proyecto esté abierto,
--  y sync_offers_count actualiza el contador automáticamente)
INSERT INTO public.project_offers (
  project_id, provider_id, offer_type, amount, amount_max,
  message, estimated_days, includes_materials, deposit_percent
)
VALUES
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000003',
   'price', 24000, 28000,
   'Trabajo la pérgola en madera de pino tratada en autoclave, con sellador para intemperie y garantía de un año en estructura. El rango depende del acabado que elijas. Incluye materiales, herrajes y limpieza al terminar.',
   9, TRUE, 40),

  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002',
   'visit', NULL, NULL,
   'Me gustaría pasar a medir el espacio y revisar el anclaje al concreto antes de darte un precio cerrado. La visita no tiene costo y te entrego la cotización el mismo día.',
   NULL, FALSE, 0);

-- ── Verificación ────────────────────────────────────────────
SELECT 'Usuarios creados' AS paso, COUNT(*) AS total FROM auth.users WHERE email LIKE '%@imendly.test'
UNION ALL SELECT 'Proveedores activos', COUNT(*) FROM public.providers WHERE is_verified = TRUE
UNION ALL SELECT 'Proyectos en el tablero', COUNT(*) FROM public.projects
UNION ALL SELECT 'Ofertas registradas', COUNT(*) FROM public.project_offers;
