import { supabase } from '@/lib/supabase';

/** POST a una ruta de la API con el token de sesión. Lanza Error con el mensaje del servidor. */
export async function apiPost<T = any>(path: string, body: unknown): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
    body: JSON.stringify(body ?? {}),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Algo salió mal. Intenta de nuevo.');
  return json as T;
}
