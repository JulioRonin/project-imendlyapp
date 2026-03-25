"use client";

import { Card } from '@i-mendly/shared/components/Card';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { Button } from '@i-mendly/shared/components/Button';
import { User, Bell, Shield, CreditCard, LogOut, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8 pb-32">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-brand-night tracking-tight">Mi Perfil</h1>
          <p className="text-sm font-bold text-brand-night/40 mt-1">Configuración y datos personales</p>
        </div>
        <Link href="/cliente/home">
          <Button variant="outline" className="rounded-2xl px-6">
            <Home size={18} className="mr-2" /> Inicio
          </Button>
        </Link>
      </header>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* User Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <Avatar name="Julio C." size="xl" className="ring-8 ring-white shadow-2xl" />
            <button className="absolute bottom-2 right-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <User size={16} />
            </button>
          </div>
          <h2 className="text-3xl font-black text-brand-night uppercase tracking-tighter">Julio C.</h2>
          <p className="text-sm font-bold text-brand-night/40">julio@example.com • Miembro desde 2026</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           <section className="space-y-6">
             <h3 className="text-xs font-black uppercase tracking-widest text-brand-night/30 ml-2">Cuenta</h3>
             <Card className="p-0 border-none shadow-sm overflow-hidden bg-white">
                {[
                  { icon: User, label: 'Datos Personales' },
                  { icon: Bell, label: 'Notificaciones' },
                  { icon: Shield, label: 'Seguridad y Privacidad' },
                ].map((item, i) => (
                  <button key={i} className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-brand-night/40 flex items-center justify-center">
                        <item.icon size={18} />
                      </div>
                      <span className="text-sm font-bold text-brand-night">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                  </button>
                ))}
             </Card>
           </section>

           <section className="space-y-6">
             <h3 className="text-xs font-black uppercase tracking-widest text-brand-night/30 ml-2">Pagos y Suscripciones</h3>
             <Card className="p-0 border-none shadow-sm overflow-hidden bg-white">
                {[
                  { icon: CreditCard, label: 'Métodos de Pago' },
                  { icon: Shield, label: 'Historial de Transacciones' },
                ].map((item, i) => (
                  <button key={i} className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-brand-night/40 flex items-center justify-center">
                        <item.icon size={18} />
                      </div>
                      <span className="text-sm font-bold text-brand-night">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                  </button>
                ))}
             </Card>

             <button className="w-full p-6 bg-red-50 rounded-[2rem] flex items-center justify-between hover:bg-red-100 transition-all group">
                <div className="flex items-center gap-4 text-red-600">
                  <LogOut size={18} />
                  <span className="text-sm font-black uppercase tracking-widest">Cerrar Sesión</span>
                </div>
                <ChevronRight size={16} className="text-red-200" />
             </button>
           </section>
        </div>
      </div>
    </main>
  );
}
