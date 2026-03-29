-- Migration: Add Top Provider Insignia
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS is_top BOOLEAN DEFAULT false;
