"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, ArrowLeft, ShieldCheck, Briefcase } from 'lucide-react';
import { Logo } from '@i-mendly/shared/Logo';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { usePlatformStore } from '@/store/usePlatformStore';
import { DevBypassPanel } from '@/components/DevBypass';

export default function ProfessionalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const login = usePlatformStore(state => state.login);

  const fetchUserWithRetry = async (user: any, retries = 5, delay = 500) => {
    for (let i = 0; i < retries; i++) {
      const { data, error: queryError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (data) return data;
      if (i < retries - 1) await new Promise(resolve => setTimeout(resolve, delay));
    }

    // FALLBACK: If retry fails, manually create the profile
    console.warn("Retrying profile fetch failed for professional, attempting manual fallback creation.");
    const role = user.user_metadata?.role || 'provider';
    const fullName = user.user_metadata?.full_name || 'Nuevo Profesional';

    const { data: newData, error: insertError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        role: role,
        full_name: fullName
      })
      .select('role')
      .single();

    if (insertError) {
      throw new Error("No se pudo sincronizar tu perfil profesional. Por favor, contacta a soporte.");
    }

    return newData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Fetch user role from public.users with retry
      const userData = await fetchUserWithRetry(data.user);

      if (userData.role !== 'provider' && userData.role !== 'admin') {
        throw new Error("Este acceso es exclusivo para profesionales registrados.");
      }

      login(email, userData.role as any);
      router.push("/proveedor");
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[100dvh] bg-linen flex flex-col lg:flex-row">
      {/* ── Foto a sangre ── */}
      <section className="relative h-[44vh] min-h-[320px] lg:h-auto lg:min-h-[100dvh] lg:w-[52%] rounded-b-[2.75rem] lg:rounded-none overflow-hidden shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/carpentry.png" alt="Taller de carpintería" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />

        <div className="v3-blur-in absolute top-6 left-6 lg:top-10 lg:left-10">
          <Logo size={30} variant="dark" />
        </div>

        <div className="v3-blur-in absolute inset-x-5 bottom-5 lg:inset-x-10 lg:bottom-10 glass rounded-[1.9rem] p-6 lg:p-8 max-w-lg" style={{ animationDelay: '200ms' }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-2">Para profesionales</p>
          <h2 className="text-[24px] lg:text-[32px] font-semibold tracking-tight leading-tight text-ink">
            Tu oficio, con clientes reales y cobro garantizado.
          </h2>
          <p className="mt-2 text-[13.5px] font-medium text-muted">
            Solicitudes en tu zona, anticipo protegido y pago al día siguiente.
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-sage">
            <ShieldCheck size={15} /> Red de profesionales certificados
          </p>
        </div>
      </section>

      {/* ── Formulario ── */}
      <section className="flex-1 flex items-center justify-center px-6 py-10 lg:px-16 lg:py-14">
        <div className="w-full max-w-md">
          <div className="v3-blur-in" style={{ animationDelay: '120ms' }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Ya tengo cuenta</p>
            <h1 className="mt-2 text-[34px] lg:text-[42px] font-semibold tracking-tight leading-[1.02] text-ink">Entrar al portal</h1>
            <p className="mt-2 text-[14px] font-medium text-muted">Gestiona tu agenda, ofertas y pagos desde un solo lugar.</p>
          </div>

          {error && (
            <div className="v2-rise mt-6 p-4 rounded-[1.25rem] bg-error/10 text-error text-[13px] font-semibold text-center">
              {error}
            </div>
          )}

          <form
            className="v2-rise v2-d2 mt-8 space-y-4"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-2 ml-1">Correo profesional</label>
              <input
                type="email"
                placeholder="nombre@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-14 px-5 bg-sand rounded-[1.25rem] border-0 text-[15px] font-semibold text-ink placeholder:text-faint placeholder:font-medium outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-2 ml-1">Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-14 px-5 bg-sand rounded-[1.25rem] border-0 text-[15px] font-semibold text-ink placeholder:text-faint placeholder:font-medium outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full h-14 rounded-full bg-ink text-white text-[13px] font-bold flex items-center justify-center gap-2 v2-press disabled:opacity-60"
            >
              {loading ? "Entrando…" : <>Entrar al portal <ArrowUpRight size={17} /></>}
            </button>
          </form>

          {/* Soy nuevo */}
          <Link
            href="/proveedor/onboarding"
            className="v2-rise v2-d4 group mt-6 flex items-center gap-4 bg-cream rounded-[1.75rem] p-5 v2-shadow-soft v2-press"
          >
            <span className="w-12 h-12 shrink-0 rounded-[1.05rem] bg-primary-light text-primary flex items-center justify-center">
              <Briefcase size={19} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold text-ink">¿Eres nuevo? Postúlate</p>
              <p className="text-[12.5px] font-medium text-muted mt-0.5">Únete a la red de profesionales certificados I mendly.</p>
            </div>
            <span className="w-10 h-10 shrink-0 rounded-full bg-ink text-white flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight size={16} />
            </span>
          </Link>

          <DevBypassPanel />

          <div className="v2-rise v2-d5 mt-8 flex justify-center">
            <Link href="/role-selection" className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-faint hover:text-ink transition-colors">
              <ArrowLeft size={14} /> Volver a la selección de rol
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
