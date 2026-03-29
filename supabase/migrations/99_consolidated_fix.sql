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
