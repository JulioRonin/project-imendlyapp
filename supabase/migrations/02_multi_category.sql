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
