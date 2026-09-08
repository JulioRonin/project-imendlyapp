"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, LogOut, Globe, Shield } from 'lucide-react';
import { Logo } from '@i-mendly/shared/Logo';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Input } from '@i-mendly/shared/components/Input';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { usePlatformStore } from '@/store/usePlatformStore';

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
      router.push("/proveedor/dashboard");
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-8 overflow-hidden font-urbanist bg-brand-night">
      {/* Decorative Blur */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary opacity-[0.1] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-[#FF6B47] opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="flex justify-center mb-16">
           <Logo size={100} orientation="vertical" variant="dark" />
        </div>

        <Card variant="glass" className="p-12 md:p-16 rounded-[4rem] border-white/10 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.5)] backdrop-blur-2xl bg-white/5">
          <div className="text-center mb-14">
            <h1 className="text-5xl font-black text-white tracking-tighter mb-4 uppercase drop-shadow-2xl">
              Profesionales
            </h1>
            <p className="text-primary text-[11px] font-black uppercase tracking-[0.5em] opacity-90">
              Gestión y Crecimiento de tu Oficio
            </p>
          </div>

          <div className="space-y-12">
            {/* Login Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-white/10" />
                <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] whitespace-nowrap">Ya tengo cuenta</h2>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>
              
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center animate-in shake duration-300">
                  {error}
                </div>
              )}
              
              <form 
                className="space-y-5" 
                onSubmit={handleSubmit}
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Email Profesional</label>
                  <Input 
                    type="email" 
                    placeholder="NOMBRE@COMPANIA.COM" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    className="bg-white/10 border-white/5 text-white placeholder:text-white/20 h-16 rounded-2xl text-[12px] font-bold uppercase tracking-tight focus:bg-white/15 focus:border-primary/50 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Contraseña</label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="bg-white/10 border-white/5 text-white placeholder:text-white/20 h-16 rounded-2xl text-[12px] font-bold uppercase tracking-tight focus:bg-white/15 focus:border-primary/50 transition-all" 
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-18 py-8 text-[11px] font-black uppercase tracking-[0.4em] bg-primary text-white hover:bg-primary/80 transition-all rounded-3xl shadow-[0_20px_48px_rgba(124,58,237,0.3)] border-none mt-6 group overflow-hidden relative"
                >
                   <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent,rgba(255,255,255,0.1),transparent)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                   {loading ? "Cargando..." : "Entrar al Portal"}
                </Button>
              </form>
            </div>

            {/* Registration Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-white/10" />
                <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] whitespace-nowrap">Soy nuevo</h2>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>

              <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 text-center relative overflow-hidden group hover:bg-white/[0.07] transition-all">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-white">
                  <Shield size={64} strokeWidth={1} />
                </div>
                <p className="text-white/80 text-sm mb-10 leading-relaxed font-medium relative z-10 px-4">
                  Únete a la red más exclusiva de prestadores de servicios y digitaliza tu operación con nuestra infraestructura premium.
                </p>
                <Link href="/proveedor/onboarding">
                  <Button className="w-full h-16 text-[10px] font-black uppercase tracking-[0.3em] bg-transparent border-white/20 text-white hover:bg-white hover:text-brand-night transition-all rounded-2xl relative z-10 shadow-2xl">
                    Postularme Ahora
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-12 flex justify-center">
          <Link href="/role-selection" className="flex items-center gap-3 text-[10px] font-black text-white/30 uppercase tracking-[0.3em] hover:text-white transition-colors group">
            <Home size={16} className="group-hover:-translate-y-0.5 transition-transform" /> Volver a Roles
          </Link>
        </div>
      </div>
    </main>
  );
}
