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
