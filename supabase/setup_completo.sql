-- ============================================================
-- I MENDLY — SETUP COMPLETO DE BASE DE DATOS
-- Para un proyecto de Supabase NUEVO (vacío).
--
-- Uso: copia TODO este archivo en el SQL Editor de Supabase
-- y ejecútalo una sola vez.
--
-- ADVERTENCIA: el bloque inicial hace DROP de tablas existentes.
-- Solo para proyectos nuevos o reinicio total.
-- ============================================================


-- ════════════════════════════════════════════════════════════
-- >>> 00_initial_schema.sql
-- ════════════════════════════════════════════════════════════

-- I Mendly - Database Schema for Supabase
-- Core Authentication integration and application tables

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- DANGER: Limpieza de tablas existentes para poder correr el script sin errores
DROP TABLE IF EXISTS public.disputes CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.provider_portfolio CASCADE;
DROP TABLE IF EXISTS public.provider_services CASCADE;
DROP TABLE IF EXISTS public.providers CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS provider_status CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS dispute_severity CASCADE;

-- 1. ENUMS (Custom Data Types)
CREATE TYPE user_role AS ENUM ('client', 'provider', 'admin');
CREATE TYPE provider_status AS ENUM ('pending', 'active', 'suspended');
CREATE TYPE order_status AS ENUM ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE dispute_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- 2. CORE TABLES

-- USERS (Extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY, -- Removed hard FK to auth.users to allow manual admin creation
  role user_role NOT NULL DEFAULT 'client',
  full_name TEXT NOT NULL,
  phone text,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PROVIDERS (Detailed profile for professionals)
-- 1-to-1 relationship with users
CREATE TABLE public.providers (
  id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  category TEXT NOT NULL,
  experience_years INTEGER DEFAULT 0,
  about TEXT,
  account_status provider_status DEFAULT 'pending',
  is_verified BOOLEAN DEFAULT FALSE,
  rating NUMERIC(3,2) DEFAULT 0.0,
  reviews_count INTEGER DEFAULT 0,
  base_price NUMERIC(10,2) DEFAULT 0.0,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  zones TEXT[] DEFAULT '{}',
  coverage_radius_km INTEGER DEFAULT 10,
  clabe_account TEXT,
  bank_name TEXT,
  secondary_clabe TEXT,
  secondary_bank_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PROVIDER SERVICES (Dynamic specific services offered by a provider)
-- 1-to-Many relationship with providers
CREATE TABLE public.provider_services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  is_range BOOLEAN DEFAULT FALSE,
  max_price NUMERIC(10,2),
  unit TEXT DEFAULT 'Servicio',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PROVIDER PORTFOLIO (Images/past work showcases)
CREATE TABLE public.provider_portfolio (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- REVIEWS (Client feedback for providers)
CREATE TABLE public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ORDERS (Bookings between clients and providers)
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  display_id TEXT UNIQUE NOT NULL, -- e.g., 'ORD-8842'
  client_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  service_requested TEXT NOT NULL,
  status order_status DEFAULT 'pending',
  scheduled_date TIMESTAMP WITH TIME ZONE,
  total_amount NUMERIC(10,2) NOT NULL,
  payment_intent_id TEXT, -- Stripe reference
  payment_status TEXT DEFAULT 'pending',
  address TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- DISPUTES (Issues raised regarding an order)
CREATE TABLE public.disputes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  display_id TEXT UNIQUE NOT NULL, -- e.g., 'DP-0021'
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity dispute_severity DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  resolution TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- Note: RLS policies are placeholder examples and should be adjusted based on strict rules.
-- Users: Enable all operations for admin dashboard/testing
CREATE POLICY "Enable all operations for users" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- Providers: Enable all operations for admin dashboard/testing
CREATE POLICY "Enable all operations for providers" ON public.providers FOR ALL USING (true) WITH CHECK (true);

-- Services and portfolios
CREATE POLICY "Enable all operations for services" ON public.provider_services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for portfolios" ON public.provider_portfolio FOR ALL USING (true) WITH CHECK (true);

-- Orders: Clients and Providers can see their own orders. Admin can see all.
CREATE POLICY "Clients see own orders" ON public.orders FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Providers see assigned orders" ON public.orders FOR SELECT USING (auth.uid() = provider_id);

-- 4. TRIGGERS
-- Auto-update updated_at columns
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_providers_modtime BEFORE UPDATE ON public.providers FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_disputes_modtime BEFORE UPDATE ON public.disputes FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Auto-sync New Auth Users to Public Users Table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, full_name, avatar_url, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'client'::user_role)
  );
  
  -- If the role was passed as provider, optionally create a bare provider record
  IF (new.raw_user_meta_data->>'role') = 'provider' THEN
      INSERT INTO public.providers (id, category) VALUES (new.id, 'General');
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user() when auth.users is populated
-- This assumes the Supabase auth schema exists.
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ════════════════════════════════════════════════════════════
-- >>> 01_storage_setup.sql
-- ════════════════════════════════════════════════════════════

-- SQL Script to set up Storage for Provider Avatars
-- Run this in the Supabase SQL Editor (https://app.supabase.com/project/_/sql)

-- 1. Create the bucket if it doesn't exist
-- We use a single insert for simplicity
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 
  'avatars', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

-- 2. Clean up existing policies for this bucket to avoid "already exists" errors
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Users update own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users delete own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads for dev" ON storage.objects;

-- 3. Set up RLS Policies for the avatars bucket
-- Allow public access to read files
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'avatars' );

-- For DEVELOPMENT: Allow all uploads (even anonymous) if you haven't set up Auth yet
-- If you want strict auth, change this to "TO authenticated"
CREATE POLICY "Allow public uploads for dev" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'avatars' );

-- Allow updates and deletes
CREATE POLICY "Users update own avatars" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'avatars' );

CREATE POLICY "Users delete own avatars" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'avatars' );

-- ════════════════════════════════════════════════════════════
-- >>> 02_multi_category.sql
-- ════════════════════════════════════════════════════════════

-- SQL Migration for Multi-Category & Grouped Services
-- Run this in the Supabase SQL Editor

-- 1. Add categories array to providers
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS categories TEXT[] NOT NULL DEFAULT '{}';

-- 2. Migrate existing single category data into the array
UPDATE public.providers 
SET categories = ARRAY[category] 
WHERE categories = '{}' AND category IS NOT NULL;

-- 3. Add category to provider_services for grouping
ALTER TABLE public.provider_services ADD COLUMN IF NOT EXISTS category TEXT;

-- 4. Initial migration: Link services to the provider's first category if it exists
UPDATE public.provider_services s
SET category = p.category
FROM public.providers p
WHERE s.provider_id = p.id AND s.category IS NULL;

-- 5. Add index for performance on categories search
CREATE INDEX IF NOT EXISTS idx_providers_categories ON public.providers USING GIN (categories);

-- ════════════════════════════════════════════════════════════
-- >>> 02_provider_availability.sql
-- ════════════════════════════════════════════════════════════

-- Migration: Provider Availability and Reviews Enhancements

-- 1. Table for Provider Working Hours
CREATE TABLE IF NOT EXISTS public.provider_availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0 (Sun) to 6 (Sat)
  start_time TIME NOT NULL DEFAULT '09:00',
  end_time TIME NOT NULL DEFAULT '18:00',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(provider_id, day_of_week)
);

-- Enable RLS for availability
ALTER TABLE public.provider_availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view availability" ON public.provider_availability FOR SELECT USING (true);
CREATE POLICY "Providers can manage own availability" ON public.provider_availability FOR ALL USING (true);

-- 2. Ensure reviews are manageable
-- (Already exists in 00_initial_schema.sql, but let's make sure it has everything we need)
-- Add a display name or similar if needed? No, uses users join.

-- 3. Default Availability for existing providers (Mon-Fri 9-18)
INSERT INTO public.provider_availability (provider_id, day_of_week)
SELECT id, d
FROM public.providers, generate_series(1, 5) d
ON CONFLICT DO NOTHING;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_availability_provider_id ON public.provider_availability(provider_id);

-- ════════════════════════════════════════════════════════════
-- >>> 03_availability_and_reviews_fix.sql
-- ════════════════════════════════════════════════════════════

-- Migration: Availability, Reviews, and Portfolio RLS Fixes

-- 1. Ensure provider_availability table exists
CREATE TABLE IF NOT EXISTS public.provider_availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0 (Sun) to 6 (Sat)
  start_time TIME NOT NULL DEFAULT '09:00',
  end_time TIME NOT NULL DEFAULT '18:00',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(provider_id, day_of_week)
);

-- 2. Enable RLS for all relevant tables
ALTER TABLE public.provider_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_portfolio ENABLE ROW LEVEL SECURITY;

-- 3. DROP legacy policies if they exist (to avoid duplicates)
DROP POLICY IF EXISTS "Public can view availability" ON public.provider_availability;
DROP POLICY IF EXISTS "Providers can manage own availability" ON public.provider_availability;
DROP POLICY IF EXISTS "Public can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public can view portfolios" ON public.provider_portfolio;

-- 4. Create Public Access Policies (SELECT)
CREATE POLICY "Public can view availability" ON public.provider_availability FOR SELECT USING (true);
CREATE POLICY "Public can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public can view portfolios" ON public.provider_portfolio FOR SELECT USING (true);

-- 5. Create Management Policies (Providers/Admins)
CREATE POLICY "Providers can manage own availability" ON public.provider_availability FOR ALL USING (true);
CREATE POLICY "Enable all for reviews" ON public.reviews FOR ALL USING (true);
CREATE POLICY "Enable all for portfolios" ON public.provider_portfolio FOR ALL USING (true);

-- 6. Insert Default Availability for existing providers if not already present
INSERT INTO public.provider_availability (provider_id, day_of_week)
SELECT id, d
FROM public.providers, generate_series(1, 5) d
ON CONFLICT DO NOTHING;

-- 7. Add Title and Description to Portfolio if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='provider_portfolio' AND column_name='title') THEN
        ALTER TABLE public.provider_portfolio ADD COLUMN title TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='provider_portfolio' AND column_name='description') THEN
        ALTER TABLE public.provider_portfolio ADD COLUMN description TEXT;
    END IF;
END $$;

-- ════════════════════════════════════════════════════════════
-- >>> 04_onboarding_system.sql
-- ════════════════════════════════════════════════════════════

-- 04_onboarding_system.sql
-- Database schema for Provider Onboarding Pipeline
-- Fully Idempotent Script

-- 1. Create onboarding_applications table
CREATE TABLE IF NOT EXISTS public.onboarding_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    company_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    birth_date DATE,
    -- Status pipeline: 'application', 'revision', 'interview', 'training', 'active'
    status TEXT NOT NULL DEFAULT 'application',
    main_specialty TEXT,
    is_other_specialty BOOLEAN DEFAULT FALSE,
    other_specialty_name TEXT,
    other_specialty_description TEXT,
    city TEXT DEFAULT 'Ciudad Juárez',
    zones TEXT[] DEFAULT '{}',
    sub_services TEXT[] DEFAULT '{}',
    availability JSONB DEFAULT '{}',
    documents JSONB DEFAULT '{}',
    interview_details JSONB DEFAULT '{}',
    exam_results JSONB DEFAULT '{}',
    notes TEXT,
    conversion_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.onboarding_applications ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Public can apply (INSERT)
DROP POLICY IF EXISTS "Public can submit onboarding application" ON public.onboarding_applications;
CREATE POLICY "Public can submit onboarding application" ON public.onboarding_applications 
FOR INSERT WITH CHECK (true);

-- Admins can manage everything
DROP POLICY IF EXISTS "Admins can manage onboarding applications" ON public.onboarding_applications;
CREATE POLICY "Admins can manage onboarding applications" ON public.onboarding_applications 
FOR ALL USING (true); -- Development simplified RLS

-- 4. Update Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS tr_onboarding_updated_at ON public.onboarding_applications;
CREATE TRIGGER tr_onboarding_updated_at
    BEFORE UPDATE ON public.onboarding_applications
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- 5. Seed some initial mock data for the dashboard (Optional but helpful for testing)
INSERT INTO public.onboarding_applications (full_name, main_specialty, email, status, city)
VALUES 
('Marcos Rivas', 'Plomero', 'marcos@test.com', 'interview', 'Ciudad Juárez'),
('Elena García', 'Electricista', 'elena@test.com', 'revision', 'El Paso'),
('David Ortiz', 'Limpieza', 'david@test.com', 'interview', 'Ciudad Juárez'),
('Sofía Lara', 'Carpintería', 'sofia@test.com', 'training', 'Ciudad Juárez')
ON CONFLICT (id) DO NOTHING;

-- 6. Storage Bucket for Onboarding Docs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'onboarding-docs', 
  'onboarding-docs', 
  true, 
  10485760, -- 10MB
  ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true;

-- Full Idempotency for Storage Policies
DROP POLICY IF EXISTS "Public Onboarding Docs Access" ON storage.objects;
CREATE POLICY "Public Onboarding Docs Access" ON storage.objects FOR SELECT USING ( bucket_id = 'onboarding-docs' );

DROP POLICY IF EXISTS "Public Onboarding Docs Upload" ON storage.objects;
CREATE POLICY "Public Onboarding Docs Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'onboarding-docs' );

-- ════════════════════════════════════════════════════════════
-- >>> 05_auth_triggers.sql
-- ════════════════════════════════════════════════════════════

-- Enable the auth user sync trigger
-- This ensures every new user in auth.users gets a profile in public.users

-- 1. Ensure the function exists (it was defined in 00_initial_schema, but we'll re-apply for safety)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Nuevo Usuario'),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'client'::user_role)
  );
  
  -- If the role is provider, create a bare provider record
  IF (new.raw_user_meta_data->>'role') = 'provider' THEN
      INSERT INTO public.providers (id, category) 
      VALUES (new.id, 'General');
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop if exists and recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ════════════════════════════════════════════════════════════
-- >>> 06_user_addresses.sql
-- ════════════════════════════════════════════════════════════

-- 06_user_addresses.sql
-- Migration to support multiple addresses for clients

CREATE TABLE IF NOT EXISTS public.user_addresses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL, -- e.g. 'Casa', 'Oficina'
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    cp TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own addresses" 
ON public.user_addresses 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON public.user_addresses(user_id);

-- Update trigger for updated_at
CREATE TRIGGER update_user_addresses_modtime 
BEFORE UPDATE ON public.user_addresses 
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ════════════════════════════════════════════════════════════
-- >>> 07_top_insignia.sql
-- ════════════════════════════════════════════════════════════

-- Migration: Add Top Provider Insignia
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS is_top BOOLEAN DEFAULT false;

-- ════════════════════════════════════════════════════════════
-- >>> 99_consolidated_fix.sql
-- ════════════════════════════════════════════════════════════

-- ========================================================
-- MASTER CONSOLIDATED MIGRATION: Run this in Supabase SQL Editor
-- This script sets up Storage, Schema, and RLS for all new features.
-- ========================================================

-- 1. STORAGE BUCKETS SETUP
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
('avatars', 'avatars', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']),
('portfolio', 'portfolio', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads for dev" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id IN ('avatars', 'portfolio') );
CREATE POLICY "Allow public uploads for dev" ON storage.objects FOR ALL USING ( bucket_id IN ('avatars', 'portfolio') );

-- 2. PROVIDERS SCHEMA ENHANCEMENTS (Multi-Category)
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS categories TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE public.providers ALTER COLUMN category DROP NOT NULL;

-- Migrate legacy data
UPDATE public.providers SET categories = ARRAY[category] WHERE categories = '{}' AND category IS NOT NULL;

-- 3. PROVIDER SERVICES (Grouping support)
ALTER TABLE public.provider_services ADD COLUMN IF NOT EXISTS category TEXT;
UPDATE public.provider_services s SET category = p.category FROM public.providers p WHERE s.provider_id = p.id AND s.category IS NULL;

-- 4. PROVIDER PORTFOLIO (Full structure)
CREATE TABLE IF NOT EXISTS public.provider_portfolio (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure title/description exist if table was already there
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='provider_portfolio' AND column_name='title') THEN
        ALTER TABLE public.provider_portfolio ADD COLUMN title TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='provider_portfolio' AND column_name='description') THEN
        ALTER TABLE public.provider_portfolio ADD COLUMN description TEXT;
    END IF;
END $$;

-- 5. PROVIDER AVAILABILITY (Agenda Engine)
CREATE TABLE IF NOT EXISTS public.provider_availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0 (Sun) to 6 (Sat)
  start_time TIME NOT NULL DEFAULT '09:00',
  end_time TIME NOT NULL DEFAULT '18:00',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(provider_id, day_of_week)
);

-- Default data for Mon-Fri 9-18
INSERT INTO public.provider_availability (provider_id, day_of_week)
SELECT id, d FROM public.providers, generate_series(1, 5) d
ON CONFLICT DO NOTHING;

-- 6. ROW LEVEL SECURITY (RLS) POLICIES FOR ALL TABLES
-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- DROP legacy policies to re-apply correctly
DROP POLICY IF EXISTS "Public can view users" ON public.users;
DROP POLICY IF EXISTS "Public can view providers" ON public.providers;
DROP POLICY IF EXISTS "Public can view services" ON public.provider_services;
DROP POLICY IF EXISTS "Public can view portfolio" ON public.provider_portfolio;
DROP POLICY IF EXISTS "Public can view availability" ON public.provider_availability;
DROP POLICY IF EXISTS "Public can view reviews" ON public.reviews;

DROP POLICY IF EXISTS "Enable all for users" ON public.users;
DROP POLICY IF EXISTS "Enable all for providers" ON public.providers;
DROP POLICY IF EXISTS "Enable all for services" ON public.provider_services;
DROP POLICY IF EXISTS "Enable all for portfolio" ON public.provider_portfolio;
DROP POLICY IF EXISTS "Enable all for availability" ON public.provider_availability;
DROP POLICY IF EXISTS "Enable all for reviews" ON public.reviews;

-- Create Unified Public Access Policies
CREATE POLICY "Public can view users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public can view providers" ON public.providers FOR SELECT USING (true);
CREATE POLICY "Public can view services" ON public.provider_services FOR SELECT USING (true);
CREATE POLICY "Public can view portfolio" ON public.provider_portfolio FOR SELECT USING (true);
CREATE POLICY "Public can view availability" ON public.provider_availability FOR SELECT USING (true);
CREATE POLICY "Public can view reviews" ON public.reviews FOR SELECT USING (true);

-- Create Unified Management Policies (Development bypass)
CREATE POLICY "Enable all for users" ON public.users FOR ALL USING (true);
CREATE POLICY "Enable all for providers" ON public.providers FOR ALL USING (true);
CREATE POLICY "Enable all for services" ON public.provider_services FOR ALL USING (true);
CREATE POLICY "Enable all for portfolio" ON public.provider_portfolio FOR ALL USING (true);
CREATE POLICY "Enable all for availability" ON public.provider_availability FOR ALL USING (true);
CREATE POLICY "Enable all for reviews" ON public.reviews FOR ALL USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_providers_categories ON public.providers USING GIN (categories);
CREATE INDEX IF NOT EXISTS idx_portfolio_provider_id ON public.provider_portfolio(provider_id);
CREATE INDEX IF NOT EXISTS idx_availability_provider_id ON public.provider_availability(provider_id);

-- FINAL NOTE: Run this and refresh PostgREST cache in Supabase Dashboard (Settings -> API -> Save Config) if needed.

-- ════════════════════════════════════════════════════════════
-- >>> 08_tablero_proyectos.sql
-- ════════════════════════════════════════════════════════════

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

-- Las comprobaciones cruzadas entre projects y project_offers van en
-- funciones SECURITY DEFINER: si una política consultara la otra tabla
-- directamente, cada consulta dispararía la RLS de la contraria en
-- ciclo ("infinite recursion detected in policy"). Al ejecutarse con
-- los privilegios del dueño, estas funciones no reevalúan RLS y el
-- ciclo se rompe; solo responden sí/no sobre el usuario de la sesión.
CREATE OR REPLACE FUNCTION public.owns_project(p_project_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = p_project_id AND client_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.has_offer_on_project(p_project_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.project_offers
    WHERE project_id = p_project_id AND provider_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

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
  FOR SELECT USING (public.has_offer_on_project(id));

DROP POLICY IF EXISTS "Admin all projects" ON public.projects;
CREATE POLICY "Admin all projects" ON public.projects
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- OFFERS
DROP POLICY IF EXISTS "Providers manage own offers" ON public.project_offers;
CREATE POLICY "Providers manage own offers" ON public.project_offers
  FOR ALL USING (provider_id = auth.uid()) WITH CHECK (provider_id = auth.uid());

DROP POLICY IF EXISTS "Project owner sees offers" ON public.project_offers;
CREATE POLICY "Project owner sees offers" ON public.project_offers
  FOR SELECT USING (public.owns_project(project_id));

DROP POLICY IF EXISTS "Project owner resolves offers" ON public.project_offers;
CREATE POLICY "Project owner resolves offers" ON public.project_offers
  FOR UPDATE USING (public.owns_project(project_id));

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

-- ════════════════════════════════════════════════════════════
-- >>> 09_fix_rls_recursion.sql
-- ════════════════════════════════════════════════════════════

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

-- ════════════════════════════════════════════════════════════
-- >>> 10_rls_hardening.sql
-- ════════════════════════════════════════════════════════════

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

-- ════════════════════════════════════════════════════════════
-- >>> 11_legal_y_onboarding.sql
-- ════════════════════════════════════════════════════════════

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


-- ════════════════════════════════════════════════════════════
-- >>> 12_pagos_stripe.sql
-- ════════════════════════════════════════════════════════════
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


-- ════════════════════════════════════════════════════════════
-- >>> 13_cotizacion_final.sql
-- ════════════════════════════════════════════════════════════
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
