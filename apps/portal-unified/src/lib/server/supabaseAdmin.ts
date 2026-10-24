import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Cliente con rol de servicio: ignora RLS. Solo para rutas del servidor que
// ya verificaron quién llama. La llave nunca debe ser NEXT_PUBLIC_.
let admin: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Falta SUPABASE_SERVICE_ROLE_KEY o NEXT_PUBLIC_SUPABASE_URL en el servidor.');
  if (!admin) admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return admin;
}
