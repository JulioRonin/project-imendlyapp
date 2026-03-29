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
