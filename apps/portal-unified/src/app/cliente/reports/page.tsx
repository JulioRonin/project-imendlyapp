"use client";

import { Card } from '@i-mendly/shared/components/Card';
import { Button } from '@i-mendly/shared/components/Button';
import { AlertCircle, FileWarning, ShieldCheck, Home } from 'lucide-react';
import Link from 'next/link';

export default function ReportsPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8 pb-32">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-brand-night tracking-tight">Centro de Reportes</h1>
          <p className="text-sm font-bold text-brand-night/40 mt-1">Protegemos tu experiencia con asistencia inmediata</p>
        </div>
        <Link href="/cliente/home">
          <Button variant="outline" className="rounded-2xl px-6">
            <Home size={18} className="mr-2" /> Inicio
          </Button>
        </Link>
      </header>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card className="p-8 border-none shadow-sm hover:shadow-xl transition-all cursor-pointer group bg-white">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-white transition-all">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-lg font-black text-brand-night mb-2 uppercase tracking-tighter">Garantía I mendly</h3>
          <p className="text-xs font-bold text-brand-night/40 leading-relaxed">¿El trabajo no quedó como esperabas? Abre un caso de garantía.</p>
        </Card>
        <Card className="p-8 border-none shadow-sm hover:shadow-xl transition-all cursor-pointer group bg-white">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-6 group-hover:bg-red-500 group-hover:text-white transition-all">
            <FileWarning size={24} />
          </div>
          <h3 className="text-lg font-black text-brand-night mb-2 uppercase tracking-tighter">Disputa de Pago</h3>
          <p className="text-xs font-bold text-brand-night/40 leading-relaxed">Reporta cobros indebidos o problemas con la liberación de fondos.</p>
        </Card>
        <Card className="p-8 border-none shadow-sm hover:shadow-xl transition-all cursor-pointer group bg-white">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-lg font-black text-brand-night mb-2 uppercase tracking-tighter">Seguridad Integral</h3>
          <p className="text-xs font-bold text-brand-night/40 leading-relaxed">Reporta comportamientos inadecuados para mantener la seguridad.</p>
        </Card>
      </div>

      <Card className="p-10 border-none shadow-2xl shadow-brand-night/5 bg-white rounded-[2.5rem]">
        <h2 className="text-2xl font-black text-brand-night mb-8 flex items-center gap-3">
          Abrir Nuevo Caso <div className="w-2 h-2 rounded-full bg-primary" />
        </h2>
        
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-brand-night/40 ml-2">Servicio Relacionado</label>
              <select className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-2xl p-5 text-sm font-bold outline-none transition-all">
                <option>Mantenimiento de AC (ORD-7721)</option>
                <option>Plomería Urgente (ORD-6540)</option>
                <option>Otro servicio</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-brand-night/40 ml-2">Asunto del Reporte</label>
              <input type="text" placeholder="Resumen del problema" className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-2xl p-5 text-sm font-bold outline-none transition-all" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-brand-night/40 ml-2">Descripción Detallada</label>
            <textarea rows={4} placeholder="Explica qué sucedió..." className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-2xl p-5 text-sm font-bold outline-none transition-all resize-none" />
          </div>
          
          <div className="flex justify-end">
            <Button className="px-12 py-6 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">Enviar Reporte</Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
