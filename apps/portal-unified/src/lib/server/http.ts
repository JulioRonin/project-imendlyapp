import 'server-only';
import { HttpError } from './stripe';
import { supabaseAdmin } from './supabaseAdmin';

export { HttpError };

export type Caller = { id: string; role: 'client' | 'provider' | 'admin' };

/** Identifica a quien llama con el token de sesión de Supabase (Authorization: Bearer). */
export async function requireCaller(request: Request): Promise<Caller> {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) throw new HttpError(401, 'Inicia sesión para continuar.');
  const db = supabaseAdmin();
  const { data, error } = await db.auth.getUser(token);
  if (error || !data.user) throw new HttpError(401, 'Tu sesión expiró. Inicia sesión de nuevo.');
  const { data: profile } = await db.from('users').select('role').eq('id', data.user.id).single();
  if (!profile) throw new HttpError(403, 'Tu cuenta no está completa.');
  return { id: data.user.id, role: profile.role };
}

export async function readJson<T>(request: Request): Promise<T> {
  try { return (await request.json()) as T; } catch { throw new HttpError(400, 'Solicitud inválida.'); }
}

/** Envuelve un handler: errores conocidos se devuelven con su mensaje, el resto como 500 genérico. */
export function handle(fn: (request: Request) => Promise<Response>) {
  return async (request: Request) => {
    try {
      return await fn(request);
    } catch (err) {
      if (err instanceof HttpError) return Response.json({ error: err.message }, { status: err.status });
      console.error('[api]', err);
      return Response.json({ error: 'Algo salió mal. Intenta de nuevo en un momento.' }, { status: 500 });
    }
  };
}

export const siteUrl = (request: Request) =>
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || new URL(request.url).origin;
