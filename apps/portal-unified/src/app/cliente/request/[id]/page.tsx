"use client";

import Link from 'next/link';

import { Logo } from '@i-mendly/shared/Logo';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Input } from '@i-mendly/shared/components/Input';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Avatar } from '@i-mendly/shared/components/Avatar';

export default function RequestPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-100 px-8 py-6 mb-12 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size={40} />
            <span className="text-xl font-black text-brand-night uppercase tracking-tighter">I mendly</span>
          </div>
          <h1 className="text-xs font-black uppercase tracking-[0.3em] text-brand-night/30">Checkout Seguro</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-5 gap-16">
        <div className="md:col-span-3 space-y-12">
          <section className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-100 border border-slate-50">
            <h2 className="text-2xl font-black text-brand-night mb-10 tracking-tight flex items-center gap-4">
              <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm">1</span>
              Detalles del Servicio
            </h2>
            <div className="space-y-8">
              <Input label="¿Qué necesitas reparar hoy?" placeholder="Ej. Fuga en lavabo o cortocircuito" className="py-4 px-6 text-lg font-bold" />
              <div className="flex flex-col gap-3">
                <label className="text-xs font-black text-brand-night/40 uppercase tracking-widest ml-1">Descripción del problema</label>
                <textarea 
                  className="w-full rounded-2xl border-none bg-slate-100 px-6 py-5 text-brand-night focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none h-40 font-medium text-lg leading-relaxed shadow-inner"
                  placeholder="Describe los detalles para recibir una mejor atención..."
                />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <Input label="Fecha" type="date" className="font-bold" />
                <Input label="Hora" type="time" className="font-bold" />
              </div>
            </div>
          </section>

          <section className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-100 border border-slate-50">
            <h2 className="text-2xl font-black text-brand-night mb-8 tracking-tight flex items-center gap-4">
              <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm">2</span>
              Ubicación de Visita
            </h2>
            <Input label="Dirección de tu hogar" placeholder="CALLE, NUMERO, CP" className="py-4 px-6 font-bold" />
          </section>
        </div>

        <aside className="md:col-span-2">
          <Card className="sticky top-32 p-10 border-none shadow-2xl shadow-primary/10 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">🔒</div>
            <div className="flex items-center gap-6 mb-10">
              <Avatar name="JP" size="lg" className="ring-4 ring-primary/5" />
              <div>
                <p className="text-[10px] font-black text-brand-night/20 uppercase tracking-widest">Profesional Asignado</p>
                <p className="text-xl font-black text-brand-night uppercase">Juan Pérez</p>
              </div>
            </div>

            <div className="space-y-6 py-10 border-y border-slate-50 mb-10">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-brand-night/60">Costo base reparación</span>
                <span className="text-lg font-black text-brand-night">$450.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-brand-night/60">Garantía Escrow I mendly</span>
                <span className="text-lg font-black text-brand-night">$85.00</span>
              </div>
              <div className="flex justify-between items-center pt-6">
                <span className="text-xl font-black text-brand-night uppercase tracking-tighter">Total a Depositar</span>
                <span className="text-3xl font-black text-primary tracking-tighter">$535.00</span>
              </div>
            </div>

            <Link href="/cliente/orders/success" className="block w-full">
              <Button variant="coral" size="lg" className="w-full py-6 text-sm font-black uppercase tracking-[0.4em] shadow-2xl shadow-coral/30 hover:scale-[1.02] transition-transform">
                Confirmar Pago Seg.
              </Button>
            </Link>
            
            <p className="mt-8 p-6 rounded-2xl bg-slate-50 border border-slate-100 text-[10px] font-bold text-brand-night/40 leading-relaxed text-center italic">
              "Tus fondos se mantienen en escrow y solo se liberan cuando tú confirmas que el trabajo está terminado correctamente."
            </p>
          </Card>
        </aside>
      </div>
    </main>
  );
}
