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
