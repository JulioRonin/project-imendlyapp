"use client";

import { useEffect, useState, type ReactNode } from 'react';
import { ArrowUpRight, LogOut, ShieldCheck } from 'lucide-react';
import { Logo } from '@i-mendly/shared/Logo';
import { supabase } from '@/lib/supabase';
import { DevBypassPanel } from '@/components/DevBypass';

type GuardState = 'checking' | 'anonymous' | 'forbidden' | 'admin';

/**
 * Protege TODO el portal admin: exige sesión real de Supabase y que
 * public.users.role sea 'admin'. Sustituye la antigua puerta con clave
 * escrita en el código (visible en el bundle y que solo cubría /admin).
 *
 * La autorización real vive en la base (RLS + is_admin()); este guard es
 * la capa de UX que evita mostrar pantallas a quien no corresponde.
 */
export function AdminGuard({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GuardState>('checking');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const evaluate = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setState('anonymous'); return; }
    const { data } = await supabase.from('users').select('role').eq('id', user.id).single();
    setState(data?.role === 'admin' ? 'admin' : 'forbidden');
  };

  useEffect(() => {
    evaluate();
    const { data: sub } = supabase.auth.onAuthStateChange(() => { evaluate(); });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) setError('Correo o contraseña incorrectos.');
    setLoading(false);
    // onAuthStateChange dispara evaluate(); si el rol no es admin cae en 'forbidden'
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setState('anonymous');
  };

  if (state === 'admin') return <>{children}</>;

  if (state === 'checking') {
    return (
      <main className="min-h-screen bg-linen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-line border-t-ink animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-linen flex flex-col lg:flex-row">
      {/* Panel oscuro: Night Concierge */}
      <section className="relative v3-night-grad text-on-dark lg:w-[46%] px-8 py-10 lg:px-14 lg:py-16 flex flex-col justify-between rounded-b-[2.75rem] lg:rounded-none">
        <div className="v3-blur-in"><Logo size={30} variant="dark" /></div>
        <div className="v3-blur-in mt-14 lg:mt-0" style={{ animationDelay: '160ms' }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lavender mb-3">Operación I mendly</p>
          <h1 className="text-[32px] lg:text-[44px] font-semibold tracking-tight leading-[1.05]">
            Panel del equipo
          </h1>
          <p className="mt-4 text-[14px] font-medium text-on-dark/60 max-w-sm">
            Moderación del tablero, certificación de proveedores, disputas y finanzas. Acceso exclusivo para cuentas con rol de administrador.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 text-[12.5px] font-semibold text-mint">
            <ShieldCheck size={15} /> Sesión verificada contra la base de datos
          </p>
        </div>
        <div className="hidden lg:block" />
      </section>

      {/* Formulario */}
      <section className="flex-1 flex items-center justify-center px-6 py-10 lg:px-16">
        <div className="w-full max-w-md">
          {state === 'forbidden' ? (
            <div className="v2-rise bg-cream rounded-[2.25rem] p-8 v2-shadow-soft">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-error mb-2">Sin acceso</p>
              <h2 className="text-[24px] font-semibold tracking-tight text-ink">Esta cuenta no es de administrador</h2>
              <p className="mt-2 text-[14px] font-medium text-muted">
                Tu sesión es válida pero su rol no permite entrar al panel. Cierra sesión e ingresa con una cuenta del equipo.
              </p>
              <button onClick={signOut} className="mt-6 w-full h-14 rounded-full bg-ink text-white text-[13px] font-bold flex items-center justify-center gap-2 v2-press">
                <LogOut size={16} /> Cerrar sesión
              </button>
            </div>
          ) : (
            <>
              <div className="v3-blur-in" style={{ animationDelay: '120ms' }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Equipo I mendly</p>
                <h2 className="mt-2 text-[34px] font-semibold tracking-tight leading-[1.02] text-ink">Entrar al panel</h2>
              </div>

              {error && (
                <div className="v2-rise mt-6 p-4 rounded-[1.25rem] bg-rose/15 text-error text-[13px] font-semibold text-center">{error}</div>
              )}

              <form onSubmit={signIn} className="v2-rise v2-d2 mt-8 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-2 ml-1">Correo</label>
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="equipo@imendly.com"
                    className="w-full h-14 px-5 bg-sand rounded-[1.25rem] border-0 text-[15px] font-semibold text-ink placeholder:text-faint placeholder:font-medium outline-none focus:ring-2 focus:ring-lavender/60"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-2 ml-1">Contraseña</label>
                  <input
                    type="password" required value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-14 px-5 bg-sand rounded-[1.25rem] border-0 text-[15px] font-semibold text-ink placeholder:text-faint placeholder:font-medium outline-none focus:ring-2 focus:ring-lavender/60"
                  />
                </div>
                <button
                  type="submit" disabled={loading}
                  className="mt-2 w-full h-14 rounded-full bg-ink text-white text-[13px] font-bold flex items-center justify-center gap-2 v2-press disabled:opacity-60"
                >
                  {loading ? 'Verificando…' : <>Entrar <ArrowUpRight size={17} /></>}
                </button>
              </form>

              <DevBypassPanel roles={['admin']} />
            </>
          )}
        </div>
      </section>
    </main>
  );
}
