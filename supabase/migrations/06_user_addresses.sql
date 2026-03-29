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
