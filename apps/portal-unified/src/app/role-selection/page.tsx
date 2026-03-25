"use client";

import { Card } from '@i-mendly/shared/components/Card';
import { Button } from '@i-mendly/shared/components/Button';
import { Logo } from '@i-mendly/shared/Logo';
import Link from 'next/link';
import { Home, Wrench } from 'lucide-react';

export default function RoleSelectionPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden relative">
      {/* Background soft glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,_rgba(124,58,237,0.05),_transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(255,107,71,0.05),_transparent_50%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl">
        <div className="mb-16 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
          <Logo className="w-16 h-16 mb-6 mx-auto text-brand-night" />
          <h1 className="text-4xl md:text-5xl font-black text-brand-night tracking-tighter mb-3 uppercase">I mendly</h1>
          <p className="text-brand-night/30 text-xs font-black tracking-[0.5em] uppercase">Boutique Home Services</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 px-2">
          {/* Section: Clientes */}
          <Card className="group relative min-h-[500px] rounded-[3.5rem] border-none overflow-hidden shadow-[0_32px_96px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_48px_128px_-12px_rgba(124,58,237,0.2)] transition-all duration-700 cursor-pointer p-0">
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
              style={{ backgroundImage: "url('/assets/landing_client_bg_v2.png')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-brand-night/90 via-brand-night/20 to-transparent" />
            </div>

            <div className="absolute bottom-0 inset-x-0 p-10 md:p-12 z-10">
              <div className="backdrop-blur-2xl bg-white/10 border border-white/20 p-8 rounded-[2.5rem] flex flex-col items-center text-center shadow-2xl relative overflow-hidden group-hover:bg-white/15 transition-colors">
                <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-2 -translate-y-2">
                  <Home size={80} strokeWidth={1} className="text-white" />
                </div>
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500 text-white">
                  <Home size={24} />
                </div>
                <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Clientes</h2>
                <p className="text-white/60 mb-8 leading-relaxed font-medium text-sm">
                  Solicita servicios premium con el respaldo y la seguridad de nuestra red boutique.
                </p>
                <Link href="/cliente/home" className="w-full">
                  <Button className="w-full py-7 text-[10px] tracking-[0.4em] uppercase font-black rounded-2xl bg-primary text-white shadow-2xl shadow-primary/20 hover:bg-primary-dark transition-all">
                    Explorar Servicios
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Section: Profesionales */}
          <Card className="group relative min-h-[500px] rounded-[3.5rem] border-none overflow-hidden shadow-[0_32px_96px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_48px_128px_-12px_rgba(255,107,71,0.2)] transition-all duration-700 cursor-pointer p-0">
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
              style={{ backgroundImage: "url('/assets/landing_provider_bg.png')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-brand-night/90 via-brand-night/20 to-transparent" />
            </div>

            <div className="absolute bottom-0 inset-x-0 p-10 md:p-12 z-10">
              <div className="backdrop-blur-2xl bg-white/10 border border-white/20 p-8 rounded-[2.5rem] flex flex-col items-center text-center shadow-2xl relative overflow-hidden group-hover:bg-white/15 transition-colors">
                <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-2 -translate-y-2">
                  <Wrench size={80} strokeWidth={1} className="text-white" />
                </div>
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500 text-white">
                  <Wrench size={24} />
                </div>
                <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Profesionales</h2>
                <p className="text-white/60 mb-8 leading-relaxed font-medium text-sm">
                  Digitaliza tu oficio y accede a los clientes más exclusivos con nuestra infraestructura.
                </p>
                <Link href="/proveedor" className="w-full">
                  <Button variant="secondary" className="w-full py-7 text-[10px] tracking-[0.4em] uppercase font-black bg-[#FF6B47] text-white rounded-2xl shadow-xl shadow-[#FF6B47]/20 hover:scale-[1.02] transition-transform">
                    Mi Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-20 text-center opacity-40 hover:opacity-100 transition-opacity">
          <Link href="/admin" className="text-[9px] font-black text-brand-night uppercase tracking-[0.5em] hover:text-primary transition-colors underline-offset-8">
            Admin Console
          </Link>
        </div>
      </div>
    </main>
  );
}
