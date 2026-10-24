"use client";

import { ArrowUpRight, ArrowLeft, Globe, Shield, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@i-mendly/shared/Logo";
import Link from "next/link";
import { usePlatformStore } from "@/store/usePlatformStore";

import { supabase } from "@/lib/supabase";
import { DevBypassPanel } from "@/components/DevBypass";

const INPUT_CLS =
  "w-full h-14 px-5 bg-sand rounded-[1.25rem] border-0 text-[15px] font-semibold text-ink placeholder:text-faint placeholder:font-medium outline-none focus:ring-2 focus:ring-lavender/60";
const LABEL_CLS = "block text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-2 ml-1";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
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

    // FALLBACK: If retry fails, manually create the profile to ensure the user can enter
    console.warn("Retrying profile fetch failed, attempting manual fallback creation.");
    const role = user.user_metadata?.role || 'client';
    const fullName = user.user_metadata?.full_name || 'Nuevo Usuario';

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
      throw new Error("No se pudo sincronizar tu perfil. Por favor, contacta a soporte.");
    }

    return newData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // LOGIN
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;

        // Fetch user role from public.users with retry and fallback
        const userData = await fetchUserWithRetry(data.user);

        login(email, userData.role as any);

        if (userData.role === 'provider') {
          router.push("/proveedor");
        } else if (userData.role === 'admin') {
          router.push("/admin");
        } else {
          router.push("/cliente");
        }
      } else {
        // REGISTER
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: 'client',
            }
          }
        });

        if (authError) throw authError;

        if (data.user && data.session) {
          // Wait for profile sync
          const userData = await fetchUserWithRetry(data.user);
          login(email, userData.role as any);
          router.push("/cliente");
        } else {
          // Confirm email if needed
          alert("¡Registro exitoso! Por favor verifica tu correo electrónico para activar tu cuenta.");
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[100dvh] bg-linen flex flex-col lg:flex-row">
      {/* ── Foto a sangre ── */}
      <section className="relative h-[44vh] min-h-[320px] lg:h-auto lg:min-h-[100dvh] lg:w-[52%] rounded-b-[2.75rem] lg:rounded-none overflow-hidden shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/painting_work.png" alt="Casa luminosa recién pintada" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />

        <div className="v3-blur-in absolute top-6 left-6 lg:top-10 lg:left-10">
          <Logo size={30} variant="dark" />
        </div>

        <div className="v3-blur-in absolute inset-x-5 bottom-5 lg:inset-x-10 lg:bottom-10 glass rounded-[1.9rem] p-6 lg:p-8 max-w-lg" style={{ animationDelay: '200ms' }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep mb-2">Para tu hogar</p>
          <h2 className="text-[24px] lg:text-[32px] font-semibold tracking-tight leading-tight text-ink">
            Tu hogar, en buenas manos.
          </h2>
          <p className="mt-2 text-[13.5px] font-medium text-muted">
            Proveedores verificados, anticipo protegido y Garantía I mendly.
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-mint-deep">
            <ShieldCheck size={15} /> Garantía de hasta $10,000 MXN
          </p>
        </div>
      </section>

      {/* ── Formulario ── */}
      <section className="flex-1 flex items-center justify-center px-6 py-10 lg:px-16 lg:py-14">
        <div className="w-full max-w-md">
          <div className="v3-blur-in" style={{ animationDelay: '120ms' }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Clientes</p>
            <h1 className="mt-2 text-[34px] lg:text-[42px] font-semibold tracking-tight leading-[1.02] text-ink">
              {isLogin ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
            </h1>
            <p className="mt-2 text-[14px] font-medium text-muted">
              {isLogin ? 'Entra para seguir tus órdenes y proyectos.' : 'Publica proyectos y contrata certificados en minutos.'}
            </p>
          </div>

          {/* Toggle como tabs subrayadas */}
          <div className="v3-blur-in mt-8 flex gap-7" style={{ animationDelay: '220ms' }}>
            {[
              { key: true, label: 'Iniciar sesión' },
              { key: false, label: 'Registrarse' },
            ].map(tab => {
              const active = isLogin === tab.key;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setIsLogin(tab.key)}
                  className={`relative pb-3 text-[14px] transition-colors duration-300 ${active ? 'font-semibold text-ink' : 'font-medium text-faint hover:text-muted'}`}
                >
                  {tab.label}
                  <span className={`absolute left-0 right-0 -bottom-px h-[3px] rounded-full bg-lavender transition-transform duration-500 origin-left ${active ? 'scale-x-100' : 'scale-x-0'}`} />
                </button>
              );
            })}
          </div>

          {error && (
            <div className="v2-rise mt-6 p-4 rounded-[1.25rem] bg-rose/15 text-error text-[13px] font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="v2-rise v2-d2 mt-7 space-y-4">
            {!isLogin && (
              <div className="v2-scale">
                <label className={LABEL_CLS}>Nombre completo</label>
                <input
                  placeholder="Juan Pérez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className={INPUT_CLS}
                />
              </div>
            )}
            <div>
              <label className={LABEL_CLS}>Correo electrónico</label>
              <input
                type="email"
                placeholder="nombre@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className={LABEL_CLS}>Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={INPUT_CLS}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full h-14 rounded-full bg-ink text-on-dark text-[13px] font-bold flex items-center justify-center gap-2 v2-press disabled:opacity-60"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-on-dark/20 border-t-on-dark rounded-full animate-spin" />
              ) : (
                <>{isLogin ? 'Entrar' : 'Crear mi cuenta'} <ArrowUpRight size={17} /></>
              )}
            </button>

            {/* Acceso social */}
            <p className="pt-4 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-faint">O continúa con</p>
            <div className="grid grid-cols-2 gap-3">
              {/* Pendientes de integrar: hasta que exista el flujo OAuth real
                  quedan deshabilitados. Antes navegaban a /cliente sin
                  autenticar, lo que dejaba entrar a cualquiera. */}
              <button
                type="button"
                disabled
                title="Próximamente"
                className="h-14 rounded-full bg-cream v2-shadow-soft text-[13px] font-semibold text-ink flex items-center justify-center gap-2.5 opacity-40 cursor-not-allowed"
              >
                <Globe size={17} className="text-muted" />
                Google
              </button>
              <button
                type="button"
                disabled
                title="Próximamente"
                className="h-14 rounded-full bg-cream v2-shadow-soft text-[13px] font-semibold text-ink flex items-center justify-center gap-2.5 opacity-40 cursor-not-allowed"
              >
                <Shield size={17} className="text-muted" />
                Shield Id
              </button>
            </div>
          </form>

          <DevBypassPanel />

          <p className="v2-rise v2-d4 mt-8 text-center text-[12px] font-medium text-faint leading-relaxed">
            Al continuar, confirmas que aceptas nuestros{' '}
            <span className="text-ink font-semibold cursor-pointer hover:underline underline-offset-4">Términos y condiciones</span>
          </p>

          <div className="v2-rise v2-d5 mt-6 flex justify-center">
            <Link href="/role-selection" className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-faint hover:text-ink transition-colors">
              <ArrowLeft size={14} /> Volver a la selección de rol
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
