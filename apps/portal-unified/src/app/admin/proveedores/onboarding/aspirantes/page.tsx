"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  MoreVertical,
  ChevronRight,
  Users
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

const ALL_ASPIRANTES = [
  { id: 1, name: 'Marcos Rivas', specialty: 'Plomero', stage: 'Entrevista', city: 'Cd. Juárez', date: '25 Mar' },
  { id: 2, name: 'Elena García', specialty: 'Electricista', stage: 'Revisión', city: 'Cd. Juárez', date: '24 Mar' },
  { id: 3, name: 'David Ortiz', specialty: 'Limpieza', stage: 'Entrevista', city: 'Cd. Juárez', date: '24 Mar' },
  { id: 4, name: 'Sofía Lara', specialty: 'General', stage: 'Capacitación', city: 'Cd. Juárez', date: '23 Mar' },
  { id: 5, name: 'Ricardo Luna', specialty: 'Cerrajería', stage: 'Revisión', city: 'Cd. Juárez', date: '22 Mar' },
  { id: 6, name: 'Paula Mier', specialty: 'Pintura', stage: 'Aplicación', city: 'Cd. Juárez', date: '21 Mar' },
  { id: 7, name: 'Luis Torres', specialty: 'Plomero', stage: 'Capacitación', city: 'Cd. Juárez', date: '20 Mar' },
  { id: 8, name: 'Ana Beltrán', specialty: 'Limpieza', stage: 'Revisión', city: 'Cd. Juárez', date: '19 Mar' },
];

const STAGES = ['Aplicación', 'Revisión', 'Entrevista', 'Capacitación'];

const STAGE_PILL: Record<string, string> = {
  Aplicación: 'bg-sand text-muted',
  Revisión: 'bg-primary-light text-primary-deep',
  Entrevista: 'bg-lavender-light text-ink',
  Capacitación: 'bg-lavender text-ink',
  Activo: 'bg-mint-light text-mint-deep',
};

/** Iniciales sobre arcilla profunda. */
function Initials({ name, className = '' }: { name: string; className?: string }) {
  const initials = name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'IM';
  return (
    <span className={`shrink-0 rounded-[1rem] bg-clay-deep text-white flex items-center justify-center font-semibold ${className}`}>
      {initials}
    </span>
  );
}

export default function AspirantesListPage() {
  // Solo presentación: etapa seleccionada en las tabs
  const [stageFilter, setStageFilter] = useState<string>('Todos');
  const visible = stageFilter === 'Todos' ? ALL_ASPIRANTES : ALL_ASPIRANTES.filter(p => p.stage === stageFilter);
  const countFor = (stage: string) => stage === 'Todos' ? ALL_ASPIRANTES.length : ALL_ASPIRANTES.filter(p => p.stage === stage).length;

  return (
    <main className="min-h-screen bg-linen flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
          {/* ── Cabecera editorial ── */}
          <header className="v3-blur-in">
            <Link href="/admin/proveedores/onboarding" className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-muted hover:text-ink transition-colors group mb-6">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al onboarding
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep mb-2">Proveedores</p>
                <h1 className="text-[36px] md:text-[44px] font-semibold tracking-tight leading-[1.02] text-ink">Listado de aspirantes</h1>
                <p className="mt-2 text-[14px] font-medium text-muted max-w-lg">Gestión integral del talento en proceso de incorporación.</p>
              </div>
              <div className="bg-cream rounded-[1.5rem] px-6 py-4 v2-shadow-soft">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Total</p>
                <p className="mt-1 text-[32px] font-bold tabular-nums tracking-tight text-ink leading-none">{ALL_ASPIRANTES.length}</p>
              </div>
            </div>
          </header>

          {/* ── Contadores por etapa ── */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            {STAGES.map((stage, i) => (
              <button
                key={stage}
                onClick={() => setStageFilter(stageFilter === stage ? 'Todos' : stage)}
                className={`v2-rise v2-d${i + 1} text-left bg-cream rounded-[1.5rem] p-5 v2-shadow-soft v2-press v2-float ${stageFilter === stage ? 'ring-2 ring-lavender' : ''}`}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">{stage}</p>
                <p className="mt-3 text-[34px] font-bold tabular-nums tracking-tight text-ink leading-none">{countFor(stage)}</p>
                <p className="mt-2 text-[11.5px] font-medium text-faint">aspirantes</p>
              </button>
            ))}
          </div>

          {/* ── Buscador de vidrio ── */}
          <div className="v3-blur-in mt-8 max-w-xl" style={{ animationDelay: '140ms' }}>
            <div className="flex items-center gap-3 glass rounded-full pl-5 pr-2 h-14">
              <Search size={18} className="shrink-0 text-faint" />
              <input
                type="text"
                placeholder="Buscar por nombre, especialidad o ciudad"
                className="flex-1 min-w-0 h-full bg-transparent text-ink text-[15px] font-semibold placeholder:text-faint placeholder:font-medium outline-none"
              />
            </div>
          </div>

          {/* ── Pipeline como tabs subrayadas ── */}
          <div className="v3-blur-in mt-8 -mx-6 md:mx-0 px-6 md:px-0 flex gap-7 overflow-x-auto no-scrollbar" style={{ animationDelay: '240ms' }}>
            {['Todos', ...STAGES].map(stage => {
              const active = stageFilter === stage;
              return (
                <button
                  key={stage}
                  onClick={() => setStageFilter(stage)}
                  className={`relative shrink-0 pb-3 text-[14px] flex items-center gap-2 transition-colors duration-300 ${active ? 'font-semibold text-ink' : 'font-medium text-faint hover:text-muted'}`}
                >
                  {stage}
                  <span className={`text-[11px] font-bold tabular-nums px-2 h-5 rounded-full flex items-center ${active ? 'bg-lavender-light text-ink' : 'bg-sand text-muted'}`}>{countFor(stage)}</span>
                  <span className={`absolute left-0 right-0 -bottom-px h-[3px] rounded-full bg-lavender transition-transform duration-500 origin-left ${active ? 'scale-x-100' : 'scale-x-0'}`} />
                </button>
              );
            })}
          </div>

          {/* ── Lista ── */}
          {visible.length > 0 ? (
            <div className="mt-8 bg-cream rounded-[2.25rem] p-3 md:p-4 v2-shadow-soft">
              <div className="hidden md:grid grid-cols-12 px-5 pt-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-faint">
                <span className="col-span-4">Aspirante</span>
                <span className="col-span-3">Especialidad</span>
                <span className="col-span-2">Etapa</span>
                <span className="col-span-2">Ingreso</span>
                <span className="col-span-1 text-right">Acciones</span>
              </div>
              <div className="divide-y divide-line">
                {visible.map((p, i) => (
                  <div key={p.id} className={`v2-rise v2-d${Math.min(i + 1, 8)} group grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-0 items-center px-5 py-4 md:h-[76px] rounded-[1.25rem] hover:bg-sand/60 transition-colors`}>
                    <Link href={`/admin/proveedores/onboarding/aspirantes/${p.id}`} className="col-span-4 flex items-center gap-3 min-w-0">
                      <Initials name={p.name} className="w-12 h-12 text-[14px]" />
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold text-ink truncate group-hover:text-primary-deep transition-colors">{p.name}</p>
                        <p className="text-[12px] font-medium text-muted">{p.city}</p>
                      </div>
                    </Link>
                    <span className="col-span-3 text-[14px] font-medium text-muted">{p.specialty}</span>
                    <div className="col-span-2">
                      <span className={`inline-flex items-center h-7 px-3 rounded-full text-[11px] font-semibold ${STAGE_PILL[p.stage] || 'bg-sand text-muted'}`}>{p.stage}</span>
                    </div>
                    <span className="col-span-2 text-[13px] font-medium text-faint tabular-nums">{p.date}</span>
                    <div className="col-span-1 flex md:justify-end gap-2">
                      <Link href={`/admin/proveedores/onboarding/aspirantes/${p.id}`} aria-label="Abrir expediente" className="w-10 h-10 rounded-full bg-sand text-ink flex items-center justify-center transition-colors group-hover:bg-ink group-hover:text-white v2-press">
                        <ChevronRight size={16} />
                      </Link>
                      <button aria-label="Más opciones" className="w-10 h-10 rounded-full text-faint hover:bg-sand hover:text-ink flex items-center justify-center transition-colors v2-press">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="v2-rise mt-12 bg-cream rounded-[2.25rem] p-12 flex flex-col items-center text-center v2-shadow-soft">
              <span className="w-16 h-16 rounded-[1.25rem] bg-primary-light text-primary-deep flex items-center justify-center mb-5">
                <Users size={26} />
              </span>
              <h3 className="text-[20px] font-semibold tracking-tight text-ink">Sin aspirantes en esta etapa</h3>
              <p className="mt-2 text-[14px] font-medium text-muted max-w-sm">Cambia la etapa o vuelve al pipeline para invitar nuevos proveedores.</p>
              <button onClick={() => setStageFilter('Todos')} className="mt-6 h-14 px-6 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press">
                Ver todos
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
