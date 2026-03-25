"use client";

import { useState } from "react";
import { Logo } from "@i-mendly/shared/Logo";
import { Button } from "@i-mendly/shared/components/Button";
import { Card } from "@i-mendly/shared/components/Card";
import { Input } from "@i-mendly/shared/components/Input";
import { ArrowRight, Globe, Lock, User, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EntryLoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      // In a real app, we check the role here. For now, we go to role selection.
      router.push("/role-selection");
    }, 1500);
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-8 overflow-hidden bg-white">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <img 
            src="/assets/landing_client_bg_v2.png" 
            className="w-full h-full object-cover opacity-10 blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(124,58,237,0.1),_transparent_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-xl animate-in fade-in zoom-in duration-1000">
        <div className="text-center mb-12">
            <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 mx-auto border border-slate-50">
               <Logo className="w-8 h-8 text-brand-night" />
            </div>
            <h1 className="text-4xl font-black text-brand-night tracking-tighter uppercase mb-2">I Mendly</h1>
            <p className="text-brand-night/30 text-[10px] font-black uppercase tracking-[0.5em]">Boutique Home Services</p>
        </div>

        <Card variant="glass" className="p-12 md:p-16 rounded-[3.5rem] shadow-[0_48px_128px_-12px_rgba(0,0,0,0.1)] border border-white/40">
           <div className="flex gap-8 mb-12 border-b border-slate-100 pb-2">
              <button 
                onClick={() => setIsLogin(true)}
                className={`text-[10px] font-black uppercase tracking-widest pb-3 transition-all relative ${isLogin ? 'text-brand-night' : 'text-slate-300'}`}
              >
                Ingresar
                {isLogin && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`text-[10px] font-black uppercase tracking-widest pb-3 transition-all relative ${!isLogin ? 'text-brand-night' : 'text-slate-300'}`}
              >
                Registrarme
                {!isLogin && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
              </button>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="relative group">
                  <Input 
                    placeholder="Nombre Completo" 
                    className="bg-white/50 border-none h-14 pl-12 rounded-2xl text-[11px] font-bold uppercase tracking-tight placeholder:text-slate-300" 
                  />
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
              )}
              
              <div className="relative group">
                <Input 
                  type="email" 
                  placeholder="Email" 
                  className="bg-white/50 border-none h-14 pl-12 rounded-2xl text-[11px] font-bold uppercase tracking-tight placeholder:text-slate-300" 
                  required
                />
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-primary transition-colors" />
              </div>

              <div className="relative group">
                <Input 
                  type="password" 
                  placeholder="Contraseña" 
                  className="bg-white/50 border-none h-14 pl-12 rounded-2xl text-[11px] font-bold uppercase tracking-tight placeholder:text-slate-300" 
                  required
                />
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-primary transition-colors" />
              </div>

              <Button 
                disabled={loading}
                className="w-full py-7 text-[10px] tracking-[0.4em] uppercase font-black rounded-2xl shadow-2x shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4"
              >
                {loading ? 'Validando...' : isLogin ? 'Entrar' : 'Crear Cuenta'}
              </Button>
           </form>

           <div className="mt-12 flex flex-col items-center gap-6">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">O continúa con</p>
              <div className="flex gap-4">
                 <button className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-slate-100 hover:scale-110 transition-all">
                    <img src="https://www.google.com/favicon.ico" className="w-5 h-5 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all" />
                 </button>
                 <button className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-slate-100 hover:scale-110 transition-all">
                    <Globe size={20} className="text-slate-300" />
                 </button>
              </div>
           </div>
        </Card>

        <div className="mt-12 text-center flex items-center justify-center gap-2">
           <ShieldCheck size={14} className="text-emerald-500" />
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tus datos están protegidos por I Mendly Security</p>
        </div>
      </div>
    </main>
  );
}
