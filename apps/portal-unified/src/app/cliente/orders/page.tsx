"use client";

import { Card } from '@i-mendly/shared/components/Card';
import { Button } from '@i-mendly/shared/components/Button';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { 
  ArrowLeft, Clock, CheckCircle2, 
  MessageCircle, BarChart3, Home, User,
  ChevronRight, Calendar
} from 'lucide-react';
import Link from 'next/link';

const PROJECTS = [
  { id: 'ORD-8842', provider: 'Carlos Ruiz', service: 'Pintura Mural', date: 'Mañana, 09:00 AM', status: 'En Camino', statusColor: 'primary' as const },
  { id: 'ORD-8839', provider: 'Ana Maria', service: 'Instalación AC', date: 'Viernes, 14:00 PM', status: 'Programado', statusColor: 'navy' as const },
  { id: 'ORD-8821', provider: 'Juan Pérez', service: 'Revisión Eléctrica', date: '12 Mar, 2024', status: 'Finalizado', statusColor: 'success' as const },
];

export default function OrdersDashboard() {
  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <header className="px-8 py-10 flex items-center justify-between sticky top-0 bg-slate-50/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
           <BarChart3 className="text-primary w-8 h-8" strokeWidth={3} />
           <h1 className="text-2xl font-black text-brand-night uppercase tracking-tighter">Mis Órdenes</h1>
        </div>
        <Badge variant="primary" className="py-2.5 px-5 text-[9px] font-black tracking-widest uppercase shadow-sm">3 ACTIVOS</Badge>
      </header>

      <div className="px-8 max-w-5xl mx-auto space-y-8">
        <section className="space-y-6">
           {PROJECTS.map((p) => (
             <Link key={p.id} href={`/cliente/ordenes/${p.id}`} className="block">
                <Card className="p-8 rounded-[2.5rem] border-none shadow-[0_20px_64px_-12px_rgba(0,0,0,0.06)] hover:shadow-[0_32px_96px_-12px_rgba(124,58,237,0.15)] transition-all duration-500 group bg-white">
                   <div className="flex items-center gap-6">
                      <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-colors ${p.status === 'Finalizado' ? 'bg-emerald-50 text-emerald-500' : 'bg-primary/5 text-primary'}`}>
                         {p.status === 'Finalizado' ? <CheckCircle2 size={32} /> : <Clock size={32} />}
                      </div>
                      
                      <div className="flex-1">
                         <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{p.id}</span>
                            <Badge variant={p.statusColor} className="text-[8px] font-black uppercase px-2 py-0.5">{p.status}</Badge>
                         </div>
                         <h3 className="text-xl font-black text-brand-night mb-1 tracking-tight uppercase leading-none">{p.service}</h3>
                         <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-2">
                               <Avatar name={p.provider} className="w-6 h-6 rounded-lg" />
                               <span className="text-[10px] font-bold text-slate-400">{p.provider}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                               <Calendar size={12} />
                               <span className="text-[10px] font-bold">{p.date}</span>
                            </div>
                         </div>
                      </div>

                      <div className="hidden md:flex items-center gap-3">
                         <button className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">
                            <MessageCircle size={20} />
                         </button>
                         <ChevronRight size={24} className="text-slate-100 group-hover:text-primary transition-colors" />
                      </div>
                   </div>
                </Card>
             </Link>
           ))}
        </section>

        {/* Empty State visual hint */}
        <div className="p-16 border-4 border-dashed border-slate-100 rounded-[3.5rem] flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <BarChart3 size={32} className="text-slate-200" />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No hay más órdenes pendientes</p>
            <Link href="/cliente/home" className="mt-6">
               <Button variant="ghost" className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Contratar nuevo servicio</Button>
            </Link>
        </div>
      </div>

      {/* Shared Bottom Nav */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-brand-night/95 backdrop-blur-xl rounded-full px-10 py-5 flex items-center gap-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 border border-white/5">
        <Link href="/cliente/home" className="text-white/30 hover:text-white transition-all transform hover:scale-110 active:scale-90">
          <Home size={22} strokeWidth={2} />
        </Link>
        <Link href="/cliente/orders" className="text-white transition-all transform hover:scale-110 active:scale-90">
          <BarChart3 size={22} strokeWidth={2} />
        </Link>
        <Link href="/cliente/reports" className="text-white/30 hover:text-white transition-all transform hover:scale-110 active:scale-90">
          <MessageCircle size={22} strokeWidth={2} />
        </Link>
        <Link href="/cliente/profile" className="text-white/30 hover:text-white transition-all transform hover:scale-110 active:scale-90">
          <User size={22} strokeWidth={2} />
        </Link>
      </nav>
    </main>
  );
}
