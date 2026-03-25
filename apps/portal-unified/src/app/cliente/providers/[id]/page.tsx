"use client";

import Link from 'next/link';
import { Logo } from '@i-mendly/shared/Logo';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Avatar } from '@i-mendly/shared/components/Avatar';

import React from 'react';
import { MOCK_PROVIDERS } from '@i-mendly/shared/constants/mocks';

export default function ProviderProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const provider = MOCK_PROVIDERS.find(p => p.id === id) || MOCK_PROVIDERS[0];

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <nav className="bg-white border-b border-slate-100 px-8 py-4 mb-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Logo size={32} />
          <Button variant="ghost" onClick={() => window.history.back()}>Volver</Button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Profile Sidebar */}
        <div className="md:col-span-2 space-y-8">
          <div className="flex gap-6 items-start">
            <Avatar name={provider.name} size="xl" className="shadow-xl" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-4xl font-black text-brand-night tracking-tighter">{provider.name}</h1>
                <Badge variant="teal">Verificado</Badge>
              </div>
              <p className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-4">{provider.category}</p>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xl font-black text-brand-night leading-none">{provider.rating}</p>
                  <p className="text-[10px] font-bold text-brand-night/30 uppercase mt-1">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-brand-night leading-none">{provider.reviews}</p>
                  <p className="text-[10px] font-bold text-brand-night/30 uppercase mt-1">Reseñas</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-brand-night leading-none">{provider.experience}y</p>
                  <p className="text-[10px] font-bold text-brand-night/30 uppercase mt-1">Exp.</p>
                </div>
              </div>
            </div>
          </div>

          <section>
            <h2 className="text-xl font-black text-brand-night mb-4 tracking-tight">Acerca del profesional</h2>
            <p className="text-brand-night/60 leading-relaxed font-medium">
              {provider.about}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-brand-night mb-6 tracking-tight">Portafolio</h2>
            <div className="grid grid-cols-3 gap-4">
              {provider.portfolio.map(i => (
                <div key={i} className="aspect-square rounded-3xl bg-slate-200 animate-pulse border border-slate-300" />
              ))}
            </div>
          </section>
        </div>

        {/* Booking Card */}
        <aside>
          <Card className="sticky top-24 shadow-2xl shadow-primary/10 border-primary/5">
            <p className="text-sm font-black text-brand-night/40 uppercase tracking-widest mb-6">Cotización base</p>
            <div className="mb-8">
              <p className="text-4xl font-black text-brand-night">${provider.price}<span className="text-sm opacity-40">/h</span></p>
              <p className="text-xs font-bold text-brand-teal mt-2 flex items-center gap-1">
                <span>🛡️</span> Pago seguro con Escrow
              </p>
            </div>

            <div className="space-y-6 mb-10">
              <p className="text-xs font-black text-brand-night/30 uppercase tracking-[0.2em]">Servicios destacados</p>
              {provider.services.map((s, i) => (
                <Card key={i} className="p-6 border-none shadow-xl hover:shadow-primary/5 transition-all bg-white border border-slate-50 flex items-center justify-between group">
                  <div>
                    <h4 className="font-black text-brand-night group-hover:text-primary transition-colors">{s.name}</h4>
                    <p className="text-[10px] font-black text-brand-night/20 uppercase tracking-widest mt-1">Garantía I mendly</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-brand-night tracking-tighter">${s.price}</p>
                    <Link href={`/cliente/request/${provider.id}?service=${encodeURIComponent(s.name)}`}>
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest cursor-pointer hover:underline">Reservar</span>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            <Link href={`/cliente/request/${provider.id}`} className="block w-full">
              <Button variant="primary" size="lg" className="w-full py-6 text-sm font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                Solicitar Cotización
              </Button>
            </Link>
            
            <p className="text-[10px] text-center text-brand-night/40 mt-4 leading-relaxed font-medium">
              Ningún cargo se realizará hasta que el profesional acepte tu solicitud.
            </p>
          </Card>
        </aside>
      </div>
    </main>
  );
}
