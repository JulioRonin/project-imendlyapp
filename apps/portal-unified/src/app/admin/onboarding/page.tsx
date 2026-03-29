"use client";

import { Logo } from '@i-mendly/shared/Logo';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';

export default function AdminOnboardingPage() {
  const pending = [
    { id: '1', name: 'Juan Pérez', category: 'Electricista', date: 'Hace 2 horas', status: 'pending' },
    { id: '2', name: 'Ricardo López', category: 'Plomería', date: 'Hace 4 horas', status: 'pending' },
    { id: '3', name: 'Sofía Martínez', category: 'Limpieza', date: 'Ayer', status: 'pending' },
  ];

  return (
    <main className="min-h-screen bg-silver font-urbanist flex">
      <AdminSidebar />
      <div className="flex-1 max-w-7xl mx-auto px-8 py-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-brand-night tracking-tighter mb-2">Validación de Profesionales</h2>
            <p className="text-brand-night/40 font-bold uppercase text-xs tracking-widest">Cola de aprobación (Fase 2)</p>
          </div>
          <Badge variant="silver" className="px-5 py-2">3 Peticiones Pendientes</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pending.map(p => (
            <Card key={p.id} className="group hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <Avatar name={p.name} size="md" />
                <div>
                  <h3 className="text-lg font-black text-brand-night tracking-tight">{p.name}</h3>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">{p.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-6 text-center">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-brand-night/30 uppercase tracking-widest mb-1">Documentos</p>
                  <p className="text-sm font-bold text-emerald-600">✓ Listos</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-brand-night/30 uppercase tracking-widest mb-1">Interview</p>
                  <p className="text-sm font-bold text-amber-500 italic">Agendada</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] font-bold text-brand-night/30 uppercase tracking-widest">{p.date}</span>
                <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Ver Expediente</button>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 text-xs border-slate-200">Rechazar</Button>
                <Button variant="primary" className="flex-1 text-xs shadow-lg shadow-primary/20">Aprobar</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
