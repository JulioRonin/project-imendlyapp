"use client";

import { Check, X, FileCheck2, CalendarCheck, ArrowUpRight } from 'lucide-react';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';

/** Iniciales sobre arcilla profunda. */
function Initials({ name, className = '' }: { name: string; className?: string }) {
  const initials = name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'IM';
  return (
    <span className={`shrink-0 rounded-[1.25rem] bg-clay-deep text-white flex items-center justify-center font-semibold ${className}`}>
      {initials}
    </span>
  );
}

export default function AdminOnboardingPage() {
  const pending = [
    { id: '1', name: 'Juan Pérez', category: 'Electricista', date: 'Hace 2 horas', status: 'pending' },
    { id: '2', name: 'Ricardo López', category: 'Plomería', date: 'Hace 4 horas', status: 'pending' },
    { id: '3', name: 'Sofía Martínez', category: 'Limpieza', date: 'Ayer', status: 'pending' },
  ];

  return (
    <main className="min-h-screen bg-linen flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
          {/* ── Cabecera editorial ── */}
          <header className="v3-blur-in flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep mb-2">Cola de aprobación · Fase 2</p>
              <h1 className="text-[36px] md:text-[44px] font-semibold tracking-tight leading-[1.02] text-ink">Validación de profesionales</h1>
              <p className="mt-2 text-[14px] font-medium text-muted max-w-lg">Revisa documentos y entrevistas antes de activar a cada profesional en el catálogo.</p>
            </div>
            <div className="bg-cream rounded-[1.5rem] px-6 py-4 v2-shadow-soft">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Pendientes</p>
              <p className="mt-1 text-[32px] font-bold tabular-nums tracking-tight text-ink leading-none">{pending.length}</p>
            </div>
          </header>

          {/* ── Tarjetas de aspirantes ── */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {pending.map((p, i) => (
              <article key={p.id} className={`v2-rise v2-d${Math.min(i + 1, 8)} bg-cream rounded-[1.75rem] p-6 v2-shadow-soft v2-float flex flex-col gap-5`}>
                <div className="flex items-center gap-4">
                  <Initials name={p.name} className="w-[60px] h-[60px] text-[18px]" />
                  <div className="min-w-0">
                    <h3 className="text-[18px] font-semibold tracking-tight text-ink truncate">{p.name}</h3>
                    <p className="text-[13px] font-medium text-muted">{p.category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-sand rounded-[1.25rem] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-2">Documentos</p>
                    <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-mint-deep"><FileCheck2 size={14} /> Listos</p>
                  </div>
                  <div className="bg-sand rounded-[1.25rem] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-2">Entrevista</p>
                    <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary-deep"><CalendarCheck size={14} /> Agendada</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-faint">{p.date}</span>
                  <button className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-primary-deep group">
                    Ver expediente <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>

                <div className="mt-auto flex gap-2">
                  <button className="h-12 px-5 rounded-full bg-sand text-error text-[13px] font-bold flex items-center justify-center gap-2 v2-press">
                    <X size={15} /> Rechazar
                  </button>
                  <button className="flex-1 h-12 rounded-full bg-mint text-ink text-[13px] font-bold flex items-center justify-center gap-2 v2-press">
                    <Check size={15} /> Aprobar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
