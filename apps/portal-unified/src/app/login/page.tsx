"use client";

import { ArrowRight, Home, Globe, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@i-mendly/shared/Logo";
import { Button } from "@i-mendly/shared/components/Button";
import { Card } from "@i-mendly/shared/components/Card";
import { Input } from "@i-mendly/shared/components/Input";
import Link from "next/link";
import { usePlatformStore } from "@/store/usePlatformStore";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const login = usePlatformStore(state => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth delay for premium feel
    setTimeout(() => {
      // Mock E2E logic based on user request
      if (email.toLowerCase() === 'indigo@gmail.com') {
        login(email, 'proveedor');
        router.push("/proveedor/dashboard");
      } else {
        login(email, 'cliente');
        router.push("/cliente");
      }
    }, 1500);
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-8 overflow-hidden font-urbanist bg-[#F8F9FB]">
      <div className="absolute inset-0 z-0 bg-brand-night opacity-[0.02] pattern-grid-black" />

      <div className="relative z-10 w-full max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="flex justify-center mb-16">
           <Logo size={100} orientation="vertical" />
        </div>

        <Card variant="floating" className="p-12 md:p-16 rounded-[4rem] border-none shadow-[0_48px_128px_-12px_rgba(0,0,0,0.1)]">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-brand-night tracking-tight mb-3 uppercase">
              {isLogin ? 'Bienvenido' : 'Crear Cuenta'}
            </h1>
            <p className="text-brand-night/40 text-[10px] font-black uppercase tracking-[0.4em]">
              {isLogin ? 'Acceso Exclusivo Clientes' : 'Únete a la Red Boutique'}
            </p>
          </div>

          <div className="flex p-1.5 bg-slate-50 rounded-2xl mb-10">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${isLogin ? 'bg-white text-brand-night shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${!isLogin ? 'bg-white text-brand-night shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-5">
              {!isLogin && (
                <Input
                  label="Nombre Completo"
                  placeholder="JUAN PÉREZ"
                  required
                  className="bg-slate-50/50 border-transparent h-14 rounded-2xl text-[11px] font-bold uppercase tracking-tight"
                />
              )}
              <Input
                label="Email Principal"
                type="email"
                placeholder="NOMBRE@EJEMPLO.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-50/50 border-transparent h-14 rounded-2xl text-[11px] font-bold uppercase tracking-tight"
              />
              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                required
                className="bg-slate-50/50 border-transparent h-14 rounded-2xl text-[11px] font-bold uppercase tracking-tight"
              />
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  variant="primary"
                  className="w-full h-16 text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span className="flex items-center gap-3">
                      {isLogin ? 'Entrar Ahora' : 'Crear mi Cuenta'} <ArrowRight size={18} />
                    </span>
                  )}
                </Button>
              </div>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Acceso Social</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => router.push('/cliente')}
                variant="secondary" 
                type="button" 
                className="h-14 text-[10px] font-black uppercase tracking-widest gap-3 bg-slate-50/50 border-none shadow-none hover:bg-slate-100 transition-colors rounded-2xl"
              >
                <Globe size={18} className="text-slate-400" />
                Google
              </Button>
              <Button variant="secondary" type="button" className="h-14 text-[10px] font-black uppercase tracking-widest gap-3 bg-slate-50/50 border-none shadow-none hover:bg-slate-100 transition-colors rounded-2xl">
                <Shield size={18} className="text-slate-400" />
                Shield Id
              </Button>
            </div>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">
              Al continuar, confirmas que aceptas nuestros <br/>
              <span className="text-brand-night cursor-pointer hover:underline underline-offset-4 transition-all uppercase">Términos y Condiciones</span>
            </p>
          </div>
        </Card>

        <div className="mt-12 flex justify-center">
          <Link href="/role-selection" className="flex items-center gap-3 text-[10px] font-black text-brand-night/30 uppercase tracking-[0.3em] hover:text-brand-night transition-colors group">
            <Home size={16} className="group-hover:-translate-y-0.5 transition-transform" /> Volver a Roles
          </Link>
        </div>
      </div>
    </main>
  );
}
