"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  TrendingUp,
  ArrowLeft,
  ChevronRight,
  Search,
  Users,
  CheckCircle2,
  UserPlus,
  ArrowUpRight
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

const STAGE_CONFIG = [
  { id: 'application', label: 'Aplicación', pill: 'bg-sand text-muted' },
  { id: 'revision', label: 'En revisión', pill: 'bg-primary-light text-primary-deep' },
  { id: 'interview', label: 'Entrevista', pill: 'bg-lavender-light text-ink' },
  { id: 'training', label: 'Capacitación', pill: 'bg-lavender text-ink' },
  { id: 'active', label: 'Activos', pill: 'bg-mint-light text-mint-deep' },
];

/** Iniciales sobre arcilla profunda. */
function Initials({ name, className = '' }: { name?: string; className?: string }) {
  const initials = (name || '').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'IM';
  return (
    <span className={`shrink-0 rounded-[1rem] bg-clay-deep text-white flex items-center justify-center font-semibold ${className}`}>
      {initials}
    </span>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, number>>({
    application: 0,
    revision: 0,
    interview: 0,
    training: 0,
    active: 0
  });
  // Solo presentación: etapa seleccionada en las tabs del pipeline
  const [stageFilter, setStageFilter] = useState<string>('all');

  useEffect(() => {
    fetchCandidates();
  }, []);

  async function fetchCandidates() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('onboarding_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setCandidates(data);
        const newStats = data.reduce((acc: any, curr: any) => {
          acc[curr.status] = (acc[curr.status] || 0) + 1;
          return acc;
        }, {
          application: 0,
          revision: 0,
          interview: 0,
          training: 0,
          active: 0
        });
        setStats(newStats);
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  }

  const visibleCandidates = stageFilter === 'all' ? candidates : candidates.filter(c => c.status === stageFilter);
  const newToday = candidates.filter(c => new Date(c.created_at).toDateString() === new Date().toDateString()).length;

  return (
    <main className="min-h-screen bg-linen flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
          {/* ── Cabecera editorial ── */}
          <header className="v3-blur-in">
            <Link href="/admin" className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-muted hover:text-ink transition-colors group mb-6">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al dashboard
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep mb-2">Proveedores</p>
                <h1 className="text-[36px] md:text-[44px] font-semibold tracking-tight leading-[1.02] text-ink">Pipeline de onboarding</h1>
                <p className="mt-2 text-[14px] font-medium text-muted max-w-lg">Seguimiento y conversión de nuevos proveedores de servicios.</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="bg-cream rounded-[1.5rem] px-5 py-3 v2-shadow-soft">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Nuevos hoy</p>
                  <p className="mt-1 text-[26px] font-bold tabular-nums tracking-tight text-primary-deep leading-none">+{newToday}</p>
                </div>
                <button className="h-14 px-6 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press">
                  <UserPlus size={16} /> Invitar proveedor
                </button>
              </div>
            </div>
          </header>

          {/* ── Contadores por etapa ── */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-3">
            {STAGE_CONFIG.map((stage, i) => (
              <button
                key={stage.id}
                onClick={() => setStageFilter(stageFilter === stage.id ? 'all' : stage.id)}
                className={`v2-rise v2-d${i + 1} text-left bg-cream rounded-[1.5rem] p-5 v2-shadow-soft v2-press v2-float transition-shadow ${stageFilter === stage.id ? 'ring-2 ring-lavender' : ''}`}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">{stage.label}</p>
                <p className="mt-3 text-[34px] font-bold tabular-nums tracking-tight text-ink leading-none">{stats[stage.id] || 0}</p>
                <p className="mt-2 text-[11.5px] font-medium text-faint">proveedores</p>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
            {/* ── Candidatos ── */}
            <section className="v2-rise v2-d3 lg:col-span-2 bg-cream rounded-[2.25rem] p-7 md:p-8 v2-shadow-soft">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-1">Aspirantes</p>
                  <h2 className="text-[22px] font-semibold tracking-tight text-ink">Candidatos en proceso</h2>
                </div>
                <div className="flex items-center gap-3 bg-sand rounded-full pl-4 pr-2 h-11 w-full sm:w-64 focus-within:ring-2 focus-within:ring-lavender/60">
                  <Search size={15} className="shrink-0 text-faint" />
                  <input className="flex-1 min-w-0 bg-transparent text-[13px] font-semibold text-ink placeholder:text-faint placeholder:font-medium outline-none" placeholder="Buscar candidato" />
                </div>
              </div>

              {/* Pipeline como tabs subrayadas */}
              <div className="-mx-7 md:-mx-8 px-7 md:px-8 flex gap-6 overflow-x-auto no-scrollbar border-b border-line mb-5">
                {[{ id: 'all', label: 'Todos' }, ...STAGE_CONFIG].map(tab => {
                  const active = stageFilter === tab.id;
                  const count = tab.id === 'all' ? candidates.length : (stats[tab.id] || 0);
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setStageFilter(tab.id)}
                      className={`relative shrink-0 pb-3 text-[13.5px] flex items-center gap-2 transition-colors duration-300 ${active ? 'font-semibold text-ink' : 'font-medium text-faint hover:text-muted'}`}
                    >
                      {tab.label}
                      <span className={`text-[11px] font-bold tabular-nums px-2 h-5 rounded-full flex items-center ${active ? 'bg-lavender-light text-ink' : 'bg-sand text-muted'}`}>{count}</span>
                      <span className={`absolute left-0 right-0 -bottom-px h-[3px] rounded-full bg-lavender transition-transform duration-500 origin-left ${active ? 'scale-x-100' : 'scale-x-0'}`} />
                    </button>
                  );
                })}
              </div>

              <div className="hidden md:grid grid-cols-4 px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-faint">
                <span>Nombre</span>
                <span>Especialidad</span>
                <span>Etapa actual</span>
                <span className="text-right">Ubicación</span>
              </div>

              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-16 rounded-[1.25rem] v2-shimmer" />
                  ))}
                </div>
              ) : visibleCandidates.length === 0 ? (
                <div className="v2-rise py-12 flex flex-col items-center text-center">
                  <span className="w-16 h-16 rounded-[1.25rem] bg-primary-light text-primary-deep flex items-center justify-center mb-5">
                    <Users size={26} />
                  </span>
                  <h3 className="text-[18px] font-semibold tracking-tight text-ink">Sin aspirantes en esta etapa</h3>
                  <p className="mt-2 text-[13.5px] font-medium text-muted max-w-xs">Cuando un proveedor complete su aplicación aparecerá aquí para dar seguimiento.</p>
                  <button className="mt-6 h-12 px-6 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press">
                    <UserPlus size={15} /> Invitar proveedor
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-line">
                  {visibleCandidates.map((p, i) => {
                    const stage = STAGE_CONFIG.find(s => s.id === p.status);
                    return (
                      <Link href={`/admin/proveedores/onboarding/aspirantes/${p.id}`} key={p.id ?? i} className={`group v2-rise v2-d${Math.min(i + 1, 8)} grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-0 items-center px-4 py-3 md:h-[72px] rounded-[1.25rem] hover:bg-sand/60 transition-colors`}>
                        <div className="flex items-center gap-3 min-w-0">
                          <Initials name={p.full_name} className="w-11 h-11 text-[13px]" />
                          <div className="min-w-0">
                            <p className="text-[14px] font-semibold text-ink truncate group-hover:text-primary-deep transition-colors">{p.full_name}</p>
                            <p className="text-[11.5px] font-medium text-faint tabular-nums">ID {p.id?.slice(0, 8)}</p>
                          </div>
                        </div>
                        <span className="text-[13px] font-medium text-muted capitalize">{p.main_specialty === 'otro' ? p.other_specialty_name : p.main_specialty}</span>
                        <div>
                          <span className={`inline-flex items-center h-7 px-3 rounded-full text-[11px] font-semibold ${stage?.pill || 'bg-sand text-muted'}`}>
                            {stage?.label || p.status}
                          </span>
                        </div>
                        <span className="flex items-center md:justify-end gap-3 text-[13px] font-medium text-muted">
                          {p.city || 'Ciudad Juárez'}
                          <span className="w-9 h-9 rounded-full bg-sand text-ink flex items-center justify-center transition-colors group-hover:bg-ink group-hover:text-white">
                            <ChevronRight size={15} />
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}

              <Link href="/admin/proveedores/onboarding/aspirantes" className="mt-6 w-full h-12 rounded-full bg-sand text-ink text-[13px] font-bold flex items-center justify-center gap-2 v2-press">
                Ver listado completo de aspirantes <ArrowUpRight size={15} />
              </Link>
            </section>

            {/* ── Métricas ── */}
            <aside className="space-y-5">
              <section className="v2-rise v2-d4 bg-cream rounded-[2.25rem] p-7 md:p-8 v2-shadow-soft">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-1">Conversión</p>
                <h2 className="text-[22px] font-semibold tracking-tight text-ink mb-6">Conversión del pipeline</h2>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4 p-4 bg-sand rounded-[1.5rem]">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-11 h-11 shrink-0 rounded-[1rem] bg-mint-light text-mint-deep flex items-center justify-center">
                        <Users size={18} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-ink">Tasa de aprobación</p>
                        <p className="text-[12px] font-medium text-muted">Conversión total</p>
                      </div>
                    </div>
                    <p className="text-[26px] font-bold tabular-nums tracking-tight text-ink leading-none">
                      {candidates.length > 0 ? ((stats.active / candidates.length) * 100).toFixed(1) : '0.0'}%
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 p-4 bg-sand rounded-[1.5rem]">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-11 h-11 shrink-0 rounded-[1rem] bg-primary-light text-primary-deep flex items-center justify-center">
                        <TrendingUp size={18} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-ink">Tiempo medio</p>
                        <p className="text-[12px] font-medium text-muted">Días para activación</p>
                      </div>
                    </div>
                    <p className="text-[26px] font-bold tabular-nums tracking-tight text-ink leading-none">4.2d</p>
                  </div>
                </div>

                <div className="mt-7 pt-6 border-t border-line">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-4">Especialidades con mayor demanda</p>
                  <div className="space-y-1">
                    {Object.entries(
                      candidates.reduce((acc: any, curr: any) => {
                        const spec = curr.main_specialty === 'otro' ? curr.other_specialty_name : curr.main_specialty;
                        acc[spec] = (acc[spec] || 0) + 1;
                        return acc;
                      }, {})
                    )
                    .sort((a: any, b: any) => b[1] - a[1])
                    .slice(0, 4)
                    .map(([name, count]: any, i) => (
                      <div key={name} className="flex justify-between items-center p-2.5 rounded-[1rem] hover:bg-sand/60 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-7 h-7 shrink-0 rounded-[0.6rem] bg-primary-light text-primary-deep text-[11px] font-bold tabular-nums flex items-center justify-center">0{i + 1}</span>
                          <span className="text-[14px] font-semibold text-ink capitalize truncate">{name}</span>
                        </div>
                        <span className="text-[15px] font-bold tabular-nums text-ink">{count}</span>
                      </div>
                    ))}
                    {candidates.length === 0 && <p className="text-[13px] font-medium text-faint text-center py-4">No hay datos aún</p>}
                  </div>
                </div>
              </section>

              <section className="v2-rise v2-d5 relative overflow-hidden v3-night-grad text-on-dark rounded-[2.25rem] p-7 v2-shadow-lift">
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary/25 blur-3xl" />
                <div className="relative">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lavender mb-2 flex items-center gap-2">
                    <CheckCircle2 size={12} /> Protocolo de oro
                  </p>
                  <h3 className="text-[18px] font-semibold tracking-tight">Validación antes de activar</h3>
                  <p className="mt-2 text-[13px] font-medium text-on-dark/60 leading-relaxed">
                    Todos los proveedores deben pasar validación de INE, comprobante de domicilio y entrevista técnica antes de ser marcados como <span className="font-bold text-mint">activos</span>.
                  </p>
                  <button className="mt-6 w-full h-12 rounded-full bg-white text-ink text-[13px] font-bold flex items-center justify-center gap-2 v2-press">
                    Ver lista de verificación <ArrowUpRight size={15} />
                  </button>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
