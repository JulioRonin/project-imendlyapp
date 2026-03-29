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
