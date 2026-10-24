"use client";

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Mail,
  Phone,
  MapPin,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ClipboardList,
  Check,
  X,
  CalendarPlus,
  ChevronDown,
  Star
} from 'lucide-react';

const STAGES = [
  { id: 'application', label: 'Aplicación', pill: 'bg-sand text-muted' },
  { id: 'revision', label: 'En revisión', pill: 'bg-primary-light text-primary-deep' },
  { id: 'interview', label: 'Entrevista', pill: 'bg-lavender-light text-ink' },
  { id: 'training', label: 'Capacitación', pill: 'bg-lavender text-ink' },
  { id: 'active', label: 'Activo', pill: 'bg-mint-light text-mint-deep' },
];

const EYEBROW = 'text-[10px] font-bold uppercase tracking-[0.18em] text-muted';

/** Iniciales sobre arcilla profunda. */
function Initials({ name, className = '' }: { name?: string; className?: string }) {
  const initials = (name || '').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'IM';
  return (
    <span className={`shrink-0 rounded-[1.75rem] bg-clay-deep text-white flex items-center justify-center font-semibold ${className}`}>
      {initials}
    </span>
  );
}

function SectionCard({ eyebrow, title, icon, children, className = '' }: { eyebrow: string; title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-cream rounded-[2.25rem] p-6 md:p-8 v2-shadow-soft ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        {icon && <span className="w-10 h-10 shrink-0 rounded-[0.9rem] bg-primary-light text-primary-deep flex items-center justify-center">{icon}</span>}
        <div>
          <p className={EYEBROW}>{eyebrow}</p>
          <h2 className="text-[20px] font-semibold tracking-tight text-ink">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  async function fetchCandidate() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('onboarding_applications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCandidate(data);
    } catch (error) {
      console.error('Error fetching candidate:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(newStatus: string) {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from('onboarding_applications')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setCandidate({ ...candidate, status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-linen flex">
        <AdminSidebar />
        <div className="flex-1 min-w-0">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
            <div className="h-10 w-48 rounded-full v2-shimmer" />
            <div className="mt-8 h-28 rounded-[2.25rem] v2-shimmer" />
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-80 rounded-[2.25rem] v2-shimmer" />
              <div className="h-80 rounded-[2.25rem] v2-shimmer" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!candidate) {
    return (
      <main className="min-h-screen bg-linen flex">
        <AdminSidebar />
        <div className="flex-1 min-w-0 flex items-center justify-center px-6">
          <div className="v2-rise bg-cream rounded-[2.25rem] p-12 flex flex-col items-center text-center v2-shadow-soft max-w-md">
            <span className="w-16 h-16 rounded-[1.25rem] bg-primary-light text-primary-deep flex items-center justify-center mb-5">
              <XCircle size={26} />
            </span>
            <h2 className="text-[20px] font-semibold tracking-tight text-ink">Aspirante no encontrado</h2>
            <p className="mt-2 text-[14px] font-medium text-muted">El expediente que buscas no existe o fue eliminado.</p>
            <Link href="/admin/proveedores/onboarding" className="mt-6 h-14 px-6 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press">
              Volver al pipeline
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const currentStage = STAGES.find(s => s.id === candidate.status);
  const specialty = candidate.main_specialty === 'otro' ? candidate.other_specialty_name : candidate.main_specialty;

  return (
    <main className="min-h-screen bg-linen flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
          {/* ── Cabecera editorial ── */}
          <header className="v3-blur-in">
            <Link href="/admin/proveedores/onboarding" className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-muted hover:text-ink transition-colors group mb-6">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al pipeline
            </Link>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="flex items-center gap-5 min-w-0">
                <div className="p-1.5 rounded-[2.1rem] bg-lavender-light shrink-0">
                  <Initials name={candidate.full_name} className="w-24 h-24 text-[28px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep mb-1">Expediente</p>
                  <h1 className="text-[32px] md:text-[40px] font-semibold tracking-tight leading-[1.02] text-ink truncate">{candidate.full_name}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center h-7 px-3 rounded-full text-[11px] font-semibold ${currentStage?.pill || 'bg-sand text-muted'}`}>
                      {currentStage?.label || candidate.status}
                    </span>
                    <span className="text-[13px] font-medium text-muted">Especialidad: <span className="text-ink font-semibold capitalize">{specialty}</span></span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <div className="relative">
                  <select
                    className="h-12 pl-4 pr-10 rounded-full bg-sand text-[13px] font-semibold text-ink outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-lavender/60 disabled:opacity-60"
                    value={candidate.status}
                    onChange={(e) => updateStatus(e.target.value)}
                    disabled={updating}
                  >
                    {STAGES.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-faint" />
                </div>
                <button
                  onClick={() => updateStatus('interview')}
                  disabled={updating}
                  className="h-12 px-5 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press disabled:opacity-60"
                >
                  <CalendarPlus size={15} /> Agendar entrevista
                </button>
                <button
                  className="h-12 px-5 rounded-full bg-sand text-error text-[13px] font-bold flex items-center gap-2 v2-press"
                >
                  <X size={15} /> Rechazar
                </button>
                <button
                  onClick={() => updateStatus('active')}
                  disabled={updating || candidate.status === 'active'}
                  className="h-12 px-6 rounded-full bg-mint text-ink text-[13px] font-bold flex items-center gap-2 v2-press disabled:opacity-60"
                >
                  <Check size={15} /> Aprobar aspirante
                </button>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-10">
            {/* ── Columna principal ── */}
            <div className="lg:col-span-2 space-y-6">
              <SectionCard eyebrow="Identidad" title="Información de perfil" icon={<FileText size={18} />} className="v2-rise v2-d1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Email', value: candidate.email, icon: <Mail size={15} /> },
                    { label: 'Teléfono', value: candidate.phone, icon: <Phone size={15} /> },
                    { label: 'Ubicación', value: candidate.city || 'Ciudad Juárez', icon: <MapPin size={15} /> },
                    { label: 'Fecha de nacimiento', value: candidate.birth_date || 'No proporcionada', icon: <Calendar size={15} /> },
                  ].map(f => (
                    <div key={f.label} className="bg-sand rounded-[1.25rem] p-4">
                      <p className={`${EYEBROW} mb-1.5`}>{f.label}</p>
                      <p className="text-[14px] font-semibold text-ink flex items-center gap-2 min-w-0"><span className="text-faint shrink-0">{f.icon}</span> <span className="truncate">{f.value || '—'}</span></p>
                    </div>
                  ))}
                  <div className="sm:col-span-2 bg-sand rounded-[1.25rem] p-5">
                    <p className={`${EYEBROW} mb-2`}>Descripción de especialidad</p>
                    <p className="text-[14px] font-medium text-ink/80 leading-relaxed">
                      {candidate.is_other_specialty ? candidate.other_specialty_description : `Proveedor experto en ${candidate.main_specialty}.`}
                    </p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard eyebrow="Oferta" title="Servicios y cobertura" icon={<ClipboardList size={18} />} className="v2-rise v2-d2">
                <div className="space-y-6">
                  <div>
                    <p className={`${EYEBROW} mb-3`}>Sub-servicios ofrecidos</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.sub_services?.length > 0 ? candidate.sub_services.map((s: string, i: number) => (
                        <span key={i} className="inline-flex items-center h-9 px-3.5 rounded-full bg-sand text-ink text-[12.5px] font-semibold lowercase">{s}</span>
                      )) : <p className="text-[13px] font-medium text-faint">Ninguno seleccionado</p>}
                    </div>
                  </div>
                  <div>
                    <p className={`${EYEBROW} mb-3`}>Zonas de trabajo</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.zones?.length > 0 ? candidate.zones.map((z: string, i: number) => (
                        <span key={i} className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-lavender-light text-ink text-[12.5px] font-semibold capitalize"><MapPin size={12} /> {z}</span>
                      )) : <p className="text-[13px] font-medium text-faint">Ninguna seleccionada</p>}
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard eyebrow="Referencias" title="Recomendaciones de clientes" icon={<Star size={18} />} className="v2-rise v2-d3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[1, 2].map(i => {
                    const name = candidate.documents?.[`testimonial${i}_name`];
                    const contact = candidate.documents?.[`testimonial${i}_contact`];
                    const text = candidate.documents?.[`testimonial${i}_text`];

                    if (!name && !text) return null;

                    return (
                      <div key={i} className="p-5 bg-sand rounded-[1.5rem] flex flex-col h-full">
                        <div className="flex justify-between items-start gap-3 mb-3">
                          <div className="min-w-0">
                            <p className="text-[15px] font-semibold text-ink truncate">{name || 'Sin nombre'}</p>
                            <p className="text-[12px] font-medium text-muted truncate">{contact || 'Sin contacto'}</p>
                          </div>
                          <div className="flex text-primary-deep gap-0.5 shrink-0">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} fill="currentColor" />
                            ))}
                          </div>
                        </div>
                        <p className="text-[13.5px] font-medium text-ink/80 leading-relaxed flex-grow">
                          “{text || 'Sin testimonio'}”
                        </p>
                      </div>
                    );
                  })}
                  {!candidate.documents?.testimonial1_name && !candidate.documents?.testimonial2_name && (
                    <p className="text-[13px] font-medium text-faint md:col-span-2 text-center py-4">No se proporcionaron recomendaciones.</p>
                  )}
                </div>
              </SectionCard>
            </div>

            {/* ── Columna lateral ── */}
            <aside className="space-y-6">
              <SectionCard eyebrow="Evaluación" title="Estado del examen" className="v2-rise v2-d2">
                {candidate.exam_results ? (
                  <div className={`text-center p-6 rounded-[1.5rem] ${candidate.exam_results.passed ? 'bg-mint-light' : 'bg-rose/10'}`}>
                    <p className={`text-[48px] font-bold tabular-nums tracking-tight leading-none ${candidate.exam_results.passed ? 'text-mint-deep' : 'text-error'}`}>
                      {candidate.exam_results.score}%
                    </p>
                    <span className={`mt-4 inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[11px] font-bold ${candidate.exam_results.passed ? 'bg-mint text-ink' : 'bg-cream text-error'}`}>
                      {candidate.exam_results.passed ? <><CheckCircle size={12} /> Aprobado</> : <><XCircle size={12} /> No aprobado</>}
                    </span>
                    <p className="mt-3 text-[12px] font-medium text-muted">Completado el {new Date(candidate.exam_results.completed_at).toLocaleDateString()}</p>
                  </div>
                ) : (
                  <div className="text-center p-6 rounded-[1.5rem] bg-sand">
                    <span className="w-12 h-12 mx-auto rounded-[1rem] bg-primary-light text-primary-deep flex items-center justify-center mb-3">
                      <AlertTriangle size={20} />
                    </span>
                    <p className="text-[14px] font-semibold text-ink">Examen pendiente</p>
                    <p className="mt-1 text-[12.5px] font-medium text-muted">Aún no ha realizado la evaluación técnica.</p>
                  </div>
                )}
              </SectionCard>

              <SectionCard eyebrow="Agenda" title="Entrevista" className="v2-rise v2-d3">
                {candidate.interview_details ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-4 p-4 bg-lavender-light rounded-[1.25rem]">
                      <span className="w-10 h-10 shrink-0 rounded-[0.9rem] bg-cream text-ink flex items-center justify-center"><Calendar size={18} /></span>
                      <div>
                        <p className={EYEBROW}>Fecha</p>
                        <p className="text-[15px] font-semibold text-ink">{candidate.interview_details.date === 'today' ? 'Hoy' : candidate.interview_details.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-lavender-light rounded-[1.25rem]">
                      <span className="w-10 h-10 shrink-0 rounded-[0.9rem] bg-cream text-ink flex items-center justify-center"><Clock size={18} /></span>
                      <div>
                        <p className={EYEBROW}>Horario</p>
                        <p className="text-[15px] font-semibold text-ink tabular-nums">{candidate.interview_details.time}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 rounded-[1.5rem] bg-sand">
                    <p className="text-[14px] font-semibold text-ink">No agendada aún</p>
                    <p className="mt-1 text-[12.5px] font-medium text-muted">Usa “Agendar entrevista” para mover al aspirante a esta etapa.</p>
                  </div>
                )}
              </SectionCard>

              <SectionCard eyebrow="Expediente" title="Documentación" className="v2-rise v2-d4">
                <div className="divide-y divide-line">
                  {candidate.documents ? Object.entries(candidate.documents).map(([key, val]: any) => {
                    const received = Boolean(val);
                    return (
                      <button key={key} className="w-full flex items-center justify-between gap-3 py-3.5 text-left group v2-press">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`w-9 h-9 shrink-0 rounded-[0.8rem] flex items-center justify-center ${received ? 'bg-mint-light text-mint-deep' : 'bg-sand text-faint'}`}>
                            <FileText size={15} />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[13.5px] font-semibold text-ink capitalize truncate">{key.replace(/_/g, ' ')}</p>
                            <p className={`text-[11.5px] font-semibold ${received ? 'text-mint-deep' : 'text-muted'}`}>{received ? 'Recibido' : 'Pendiente'}</p>
                          </div>
                        </div>
                        <Download size={15} className="shrink-0 text-faint group-hover:text-ink transition-colors" />
                      </button>
                    );
                  }) : <p className="text-[13px] font-medium text-faint text-center py-4">Sin documentos</p>}
                </div>
              </SectionCard>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
