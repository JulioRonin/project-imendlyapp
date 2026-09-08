import { createClient } from '@supabase/supabase-js';

// Fallbacks de build: sin variables de entorno el build de producción no debe
// romper (el prerender importa este módulo). En runtime, si faltan las
// variables reales, las llamadas fallarán y lo avisamos en consola.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  'sb_publishable_placeholder';

if (typeof window !== 'undefined' && supabaseUrl.includes('placeholder')) {
  console.warn(
    '[I mendly] NEXT_PUBLIC_SUPABASE_URL no está configurada. ' +
    'Define las variables de entorno de Supabase en .env.local o en Vercel.'
  );
}

// Mantenemos una única instancia del cliente para evitar múltiples conexiones
export const supabase = createClient(supabaseUrl, supabaseKey);
