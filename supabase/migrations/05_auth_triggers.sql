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
