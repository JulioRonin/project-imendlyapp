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
