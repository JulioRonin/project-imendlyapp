"use client";

import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  MessageSquare,
  History,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

/** Iniciales sobre arcilla profunda. */
function Initials({ name, className = '' }: { name: string; className?: string }) {
  const initials = name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'IM';
  return (
    <span className={`shrink-0 rounded-[1.1rem] bg-clay-deep text-white flex items-center justify-center font-semibold ${className}`}>
      {initials}
    </span>
  );
}

const DOT_TONE: Record<string, string> = {
  alert: 'bg-rose',
  file: 'bg-primary',
  message: 'bg-lavender',
  system: 'bg-faint',
};

export default function DisputeDetailPage({ params }: { params: { id: string } }) {
  const timeline = [
    { date: '25 Mar, 10:30 AM', event: 'Disputa abierta por el cliente', actor: 'Carlos Slim', type: 'system' },
    { date: '25 Mar, 11:45 AM', event: 'Réplica de proveedor enviada', actor: 'Juan Eléctrico', type: 'message' },
    { date: '25 Mar, 02:20 PM', event: 'Evidencia fotográfica cargada', actor: 'Carlos Slim', type: 'file' },
    { date: '25 Mar, 04:00 PM', event: 'Intervención de mediador solicitada', actor: 'Sistema', type: 'alert' },
  ];

  return (
    <main className="min-h-screen bg-linen flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
          {/* ── Cabecera editorial ── */}
          <header className="v3-blur-in">
            <Link href="/admin/disputas" className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-muted hover:text-ink transition-colors group mb-6">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al listado
            </Link>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center h-7 px-3 rounded-full bg-rose/20 text-error text-[11px] font-semibold">Crítica</span>
                  <span className="text-[12px] font-semibold text-muted tabular-nums">{params.id || 'DP-0021'}</span>
                </div>
                <h1 className="text-[36px] md:text-[44px] font-semibold tracking-tight leading-[1.02] text-ink">Incumplimiento de instalación</h1>
                <p className="mt-3 text-[15px] font-medium text-muted leading-relaxed">
                  “El cliente reclama que el tablero no fue terminado y hay cables expuestos peligrosos.”
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="h-14 px-6 rounded-full bg-cream text-ink text-[13px] font-bold flex items-center gap-2 v2-shadow-soft v2-press">
                  <MessageSquare size={16} /> Contactar partes
                </button>
                <button className="h-14 px-7 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press">
                  Intervenir ahora
                </button>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-10">
            <div className="lg:col-span-2 space-y-6">
              {/* ── Partes ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="v2-rise v2-d1 bg-cream rounded-[1.75rem] p-6 v2-shadow-soft">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-4">Cliente</p>
                  <div className="flex items-center gap-4">
                    <Initials name="Carlos Slim" className="w-14 h-14 text-[16px]" />
                    <div>
                      <p className="text-[17px] font-semibold tracking-tight text-ink">Carlos Slim</p>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-mint-deep"><ShieldCheck size={13} /> Cliente verificado</p>
                    </div>
                  </div>
                </div>
                <div className="v2-rise v2-d2 bg-cream rounded-[1.75rem] p-6 v2-shadow-soft">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-4">Proveedor</p>
                  <div className="flex items-center gap-4">
                    <Initials name="Juan Eléctrico" className="w-14 h-14 text-[16px]" />
                    <div>
                      <p className="text-[17px] font-semibold tracking-tight text-ink">Juan Eléctrico</p>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-warning"><Clock size={13} /> En revisión</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Evidencia ── */}
              <section className="v2-rise v2-d3 bg-cream rounded-[2.25rem] p-7 md:p-8 v2-shadow-soft">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-1">Expediente</p>
                    <h2 className="text-[22px] font-semibold tracking-tight text-ink">Evidencia y documentos</h2>
                  </div>
                  <span className="inline-flex items-center h-9 px-3.5 rounded-full bg-sand text-muted text-[12px] font-semibold tabular-nums">4 archivos</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map(i => (
                    <button key={i} className="aspect-video bg-sand rounded-[1.25rem] flex flex-col items-center justify-center gap-2 text-muted hover:text-ink transition-colors v2-press group">
                      <span className="w-12 h-12 rounded-[1rem] bg-cream text-primary-deep flex items-center justify-center">
                        <FileText size={20} />
                      </span>
                      <span className="text-[12px] font-semibold">Foto_Evidencia_{i}.jpg</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* ── Resolución ── */}
              <section className="v2-rise v2-d4 bg-cream rounded-[2.25rem] p-7 md:p-8 v2-shadow-soft">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep mb-1">Decisión final</p>
                <h2 className="text-[22px] font-semibold tracking-tight text-ink">Resolución administrativa</h2>
                <p className="mt-3 text-[14px] font-medium text-muted leading-relaxed max-w-xl">
                  Como administrador puedes liberar el pago al proveedor, reembolsar al cliente o proponer un ajuste parcial.
                  Esta acción es <span className="font-bold text-ink">final e irreversible</span>.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="h-12 px-6 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press">
                    <CheckCircle2 size={16} className="text-mint" /> Pago total
                  </button>
                  <button className="h-12 px-6 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press">
                    <XCircle size={16} className="text-rose" /> Reembolso
                  </button>
                  <button className="h-12 px-6 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press">
                    <HelpCircle size={16} className="text-lavender" /> Mediación
                  </button>
                </div>
              </section>
            </div>

            {/* ── Timeline ── */}
            <aside className="v2-rise v2-d3 bg-cream rounded-[2.25rem] p-7 md:p-8 v2-shadow-soft h-fit">
              <div className="flex items-center gap-3 mb-8">
                <span className="w-10 h-10 rounded-[0.9rem] bg-lavender-light text-ink flex items-center justify-center">
                  <History size={18} />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Historial</p>
                  <h2 className="text-[18px] font-semibold tracking-tight text-ink">Historial del caso</h2>
                </div>
              </div>
              <div className="relative space-y-7">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-line" />
                {timeline.map((step, i) => (
                  <div key={i} className={`v2-rise v2-d${Math.min(i + 4, 8)} relative pl-8`}>
                    <span className={`absolute left-0 top-1 w-[15px] h-[15px] rounded-full ring-4 ring-cream ${DOT_TONE[step.type] || 'bg-faint'}`} />
                    <p className="text-[11px] font-semibold text-faint tabular-nums mb-1">{step.date}</p>
                    <p className="text-[14px] font-semibold text-ink leading-tight">{step.event}</p>
                    <p className="mt-0.5 text-[12.5px] font-medium text-muted">{step.actor}</p>
                  </div>
                ))}
              </div>
              <button className="mt-10 w-full h-12 rounded-full bg-sand text-ink text-[13px] font-bold flex items-center justify-center gap-2 v2-press">
                <MessageSquare size={15} /> Añadir nota interna
              </button>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
