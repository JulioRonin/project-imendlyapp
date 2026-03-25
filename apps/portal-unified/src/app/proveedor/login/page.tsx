"use client";

import { Logo } from '@i-mendly/shared/Logo';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Input } from '@i-mendly/shared/components/Input';
import Link from 'next/link';

export default function ProfessionalLoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-12 rounded-[3rem] border-none shadow-2xl bg-white">
        <div className="text-center mb-10">
          <Logo className="w-16 h-16 mx-auto mb-6 text-brand-night" />
          <h1 className="text-3xl font-black text-brand-night uppercase tracking-tighter">Bienvenido</h1>
          <p className="text-brand-night/40 font-medium text-sm mt-2">INGRESA A TU PORTAL DE PROFESIONAL</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); window.location.href='/proveedor/dashboard'; }}>
          <Input label="Email Profesional" type="email" placeholder="nombre@compania.com" required className="py-4" />
          <Input label="Contraseña" type="password" placeholder="••••••••" required className="py-4" />
          
          <div className="flex items-center justify-between text-xs font-bold px-1">
            <label className="flex items-center gap-2 cursor-pointer text-brand-night/40 hover:text-brand-night transition-colors">
              <input type="checkbox" className="rounded-md border-slate-200 text-primary focus:ring-primary" />
              Recordarme
            </label>
            <button type="button" className="text-primary hover:underline uppercase tracking-widest">¿Olvidaste tu contraseña?</button>
          </div>

          <Button type="submit" className="w-full py-8 text-sm font-black uppercase tracking-[0.3em] shadow-xl shadow-primary/10 hover:scale-[1.02] transition-transform">
            Entrar al Portal
          </Button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-50 text-center">
          <p className="text-xs font-bold text-brand-night/30 uppercase tracking-widest mb-4">¿Aún no tienes cuenta?</p>
          <Link href="/proveedor/onboarding">
            <span className="text-sm font-black text-coral uppercase tracking-widest hover:underline cursor-pointer">Postularme ahora</span>
          </Link>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/">
            <span className="text-[10px] font-black text-brand-night/20 uppercase tracking-widest hover:text-brand-night transition-colors cursor-pointer">← Volver al inicio</span>
          </Link>
        </div>
      </Card>
    </main>
  );
}
