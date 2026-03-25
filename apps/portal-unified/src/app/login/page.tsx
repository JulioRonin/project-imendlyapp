"use client";

import { ArrowRight, Home, Globe, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@i-mendly/shared/Logo";
import { Button } from "@i-mendly/shared/components/Button";
import { Card } from "@i-mendly/shared/components/Card";
import { Input } from "@i-mendly/shared/components/Input";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth delay for premium feel
    setTimeout(() => {
      router.push("/proveedor");
    }, 1500);
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-8 overflow-hidden">
      {/* Background Image - Using verified login_bg.png */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url('/assets/login_bg.png')" }}
      >
        <div className="absolute inset-0 bg-brand-night/40 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 w-full max-w-xl animate-in fade-in zoom-in duration-700">
        <Link href="/" className="absolute -top-24 left-1/2 -translate-x-1/2 group">
           <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
             <Logo className="w-8 h-8 text-white" />
           </div>
        </Link>

        {/* Using shared Card with variant 'glass' for premium feel */}
        <Card variant="glass" className="p-12 md:p-16 rounded-[3.5rem] shadow-[0_48px_128px_-12px_rgba(0,0,0,0.3)] border border-white/20">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-brand-night tracking-tight uppercase mb-2">Bienvenido</h1>
            <p className="text-brand-night/40 text-[10px] font-black uppercase tracking-[0.3em]">Acceso Exclusivo I Mendly</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="relative group">
              <label className="text-[10px] font-black text-brand-night/30 uppercase tracking-[0.3em] mb-3 block pl-1">
                Email Corporativo
              </label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="nombre@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/50 border-none h-16 px-6 rounded-2xl text-brand-night font-bold placeholder:text-brand-night/10 focus-visible:ring-primary/20 transition-all group-hover:bg-white/80"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-2 bottom-2 w-12 bg-brand-night text-white rounded-xl flex items-center justify-center hover:bg-primary transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ArrowRight size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100/50"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white/40 backdrop-blur-md px-4 text-[9px] font-black text-slate-500 uppercase tracking-widest rounded-full">O continúa con</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button" className="h-14 rounded-2xl border-white/40 bg-white/20 font-black text-[10px] uppercase tracking-widest hover:bg-white/40 transition-all flex gap-3">
                <Globe size={18} className="text-slate-600" />
                Google
              </Button>
              <Button variant="outline" type="button" className="h-14 rounded-2xl border-white/40 bg-white/20 font-black text-[10px] uppercase tracking-widest hover:bg-white/40 transition-all flex gap-3">
                <Shield size={18} className="text-slate-600" />
                Shield Id
              </Button>
            </div>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
              Al acceder, aceptas nuestros <br/>
              <span className="text-brand-night cursor-pointer hover:underline underline-offset-4">Términos de Servicio</span>
            </p>
          </div>
        </Card>

        <div className="mt-12 flex justify-center">
          <Link href="/" className="flex items-center gap-2 text-[10px] font-black text-white/60 uppercase tracking-widest hover:text-white transition-colors">
            <Home size={14} /> Volver al Inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
