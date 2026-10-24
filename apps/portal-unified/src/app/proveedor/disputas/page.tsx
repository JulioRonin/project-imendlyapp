"use client";

import React, { useState } from 'react';
import {
  AlertCircle,
  MessageCircle,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  Search,
  ArrowLeft,
  ImagePlus,
  ShieldCheck
} from 'lucide-react';
import { Avatar } from '@i-mendly/shared/components/Avatar';

const DISPUTES = [
  {
    id: 'DIS-102',
    client: 'Pedro Marmol',
    service: 'Instalación de Espejos',
    reason: 'Inconformidad con acabado',
    date: 'Hace 2 horas',
    status: 'opened',
    priority: 'high',
    lastMessage: 'El espejo quedó un poco chueco...',
  },
  {
    id: 'DIS-098',
    client: 'Lorena Fuentes',
    service: 'Limpieza Básica',
    reason: 'Cargo no reconocido',
    date: 'Ayer, 4:00 PM',
    status: 'resolving',
    priority: 'medium',
    lastMessage: 'Mendly Support: Estamos revisando el cobro...',
  },
  {
    id: 'DIS-085',
    client: 'Ricardo Salinas',
    service: 'Reparación Eléctrica',
    reason: 'Garantía solicitada',
    date: '12 Mar, 2026',
    status: 'closed',
    priority: 'low',
    lastMessage: 'Caso cerrado - Proveedor re-visitó el domicilio.',
  }
];

const EYEBROW = 'text-[10px] font-bold uppercase tracking-[0.18em]';
const PILL = 'inline-flex items-center h-7 px-3 rounded-full text-[11px] font-semibold whitespace-nowrap';

const PRIORITY_LABEL: Record<string, string> = { low: 'Baja', medium: 'Media', high: 'Alta', critical: 'Crítica' };
const PRIORITY_TONE: Record<string, string> = {
  low: 'bg-mint-light text-mint-deep',
  medium: 'bg-primary-light text-primary-deep',
  high: 'bg-rose/20 text-error',
  critical: 'bg-rose/20 text-error',
};

const STATUS_LABEL: Record<string, string> = { opened: 'Abierta', resolving: 'En mediación', closed: 'Resuelta' };
const STATUS_TONE: Record<string, string> = {
  opened: 'bg-rose/20 text-error',
  resolving: 'bg-primary-light text-primary-deep',
  closed: 'bg-mint-light text-mint-deep',
};

export default function DisputesPage() {
  const [activeTab, setActiveTab] = useState<'open' | 'resolved'>('open');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedDispute, setSelectedDispute] = useState<typeof DISPUTES[0] | null>(null);

  const filteredDisputes = DISPUTES.filter(d =>
      activeTab === 'open' ? d.status !== 'closed' : d.status === 'closed'
  );

  const openCount = DISPUTES.filter(d => d.status !== 'closed').length;
  const resolvedCount = DISPUTES.filter(d => d.status === 'closed').length;

  const FAQS = [
    {
        q: '¿Cómo responder a una reclamación?',
        a: 'Tienes 48 horas hábiles para presentar tus evidencias fotográficas o aceptar el reclamo. En caso de no responder, Mendly fallará automáticamente a favor del cliente para proteger la confianza en la plataforma.'
    },
    {
        q: 'Políticas de reembolso',
        a: 'Si un trabajo no se completa según los términos acordados o causa daños mayores, Mendly reembolsará al cliente del saldo retenido. Tienes derecho a apelar adjuntando pruebas previas y posteriores al servicio.'
    },
    {
        q: 'Garantías de servicio I Mendly',
        a: 'Todos los servicios Premium cuentan con una garantía de 7 días. Si el cliente reporta una falla dentro de este lapso, el sistema abrirá un ticket de Revisión prioritaria antes de emitir algún reembolso.'
    }
  ];

  const TABS = [
    { id: 'open', label: 'Abiertas', count: openCount },
    { id: 'resolved', label: 'Resueltas', count: resolvedCount },
  ] as const;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-linen">
      <main className="flex-1 overflow-y-auto px-6 md:px-12 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* ── Cabecera editorial ── */}
          <header className="pt-10 md:pt-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className={`v3-blur-in ${EYEBROW} text-primary-deep`}>Mediación</p>
              <h1 className="v3-blur-in text-[34px] md:text-[44px] font-semibold tracking-tight leading-[1.02] text-ink mt-2" style={{ animationDelay: '100ms' }}>
                Disputas y aclaraciones
              </h1>
              <p className="v3-blur-in mt-2 text-[14px] font-medium text-muted" style={{ animationDelay: '200ms' }}>
                Gestiona reclamos y resuelve conflictos con un mediador neutral
              </p>
            </div>
            <div className="v3-blur-in flex items-center gap-3 h-12 px-5 rounded-full bg-cream v2-shadow-soft w-full md:w-72" style={{ animationDelay: '300ms' }}>
              <Search size={17} className="shrink-0 text-faint" />
              <input type="text" placeholder="Buscar por ID o cliente" className="w-full bg-transparent text-[14px] font-semibold text-ink placeholder:text-faint placeholder:font-medium outline-none" />
            </div>
          </header>

          {/* ── Aviso de mediación ── */}
          <section className="v2-rise v2-d1 mt-9 bg-cream rounded-[2.25rem] p-6 md:p-7 v2-shadow-soft flex flex-col md:flex-row md:items-center gap-5">
            <span className="w-14 h-14 shrink-0 rounded-[1.2rem] bg-rose/20 text-error flex items-center justify-center">
              <ShieldAlert size={24} />
            </span>
            <div className="flex-1 min-w-0">
              <p className={`${EYEBROW} text-error`}>Aviso de mediación</p>
              <h4 className="mt-1 text-[17px] font-semibold tracking-tight text-ink">Tienes una disputa abierta con prioridad alta</h4>
              <p className="mt-1 text-[13.5px] font-medium text-muted leading-relaxed max-w-2xl">
                La resolución rápida afecta positivamente tu ranking en la plataforma. I mendly actúa como mediador neutral en todos los procesos.
              </p>
            </div>
            <button type="button" className="h-12 px-5 rounded-full bg-sand text-ink text-[13px] font-bold v2-press shrink-0">
              Política de arbitraje
            </button>
          </section>

          <div className="mt-8 grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* ── Columna principal ── */}
            <div className="lg:col-span-2">
              {selectedDispute ? (
                <div className="space-y-5">
                  <button
                    type="button"
                    onClick={() => setSelectedDispute(null)}
                    className="v3-blur-in flex items-center gap-3 text-[13px] font-semibold text-muted hover:text-ink transition-colors"
                  >
                    <span className="w-12 h-12 rounded-full bg-cream v2-shadow-soft flex items-center justify-center text-ink v2-press">
                      <ArrowLeft size={18} />
                    </span>
                    Volver a la lista
                  </button>

                  <section className="v2-scale bg-cream p-6 md:p-8 rounded-[2.5rem] v2-shadow-soft space-y-7">
                    {/* Encabezado */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`${EYEBROW} text-primary-deep`}>{selectedDispute.id}</span>
                          <span className={`${PILL} ${PRIORITY_TONE[selectedDispute.priority] || 'bg-sand text-muted'}`}>
                            Severidad {PRIORITY_LABEL[selectedDispute.priority] || selectedDispute.priority}
                          </span>
                        </div>
                        <h2 className="mt-2 text-[24px] md:text-[28px] font-semibold tracking-tight leading-tight text-ink">{selectedDispute.reason}</h2>
                        <p className="mt-1.5 text-[13px] font-medium text-muted">{selectedDispute.client} · {selectedDispute.service}</p>
                      </div>
                      <span className={`${PILL} h-8 px-3.5 text-[12px] shrink-0 ${STATUS_TONE[selectedDispute.status]}`}>
                        {STATUS_LABEL[selectedDispute.status]}
                      </span>
                    </div>

                    {/* Protocolo */}
                    <div className="bg-linen rounded-[1.75rem] p-6">
                      <p className={`${EYEBROW} text-muted mb-6`}>Protocolo y estado actual</p>
                      <div className="relative flex items-start justify-between">
                        <div className="absolute top-3 left-4 right-4 h-[3px] bg-sand rounded-full" />
                        <div className={`absolute top-3 left-4 h-[3px] rounded-full bg-primary transition-all duration-1000 ${
                          selectedDispute.status === 'opened' ? 'w-[33%]' :
                          selectedDispute.status === 'resolving' ? 'w-[66%]' : 'right-4'
                        }`} />

                        {[
                          { label: 'Reclamo', active: true },
                          { label: 'Evidencia', active: selectedDispute.status !== 'opened' || selectedDispute.status === 'opened' },
                          { label: 'Mediación', active: selectedDispute.status === 'resolving' || selectedDispute.status === 'closed' },
                          { label: 'Resolución', active: selectedDispute.status === 'closed' }
                        ].map((step, idx) => (
                          <div key={idx} className="relative z-10 flex flex-col items-center gap-2.5 w-20">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-linen transition-colors ${
                              step.active ? 'bg-primary text-ink' : 'bg-sand'
                            }`}>
                              {step.active ? <CheckCircle2 size={13} /> : <span className="w-1.5 h-1.5 rounded-full bg-faint" />}
                            </span>
                            <span className={`text-[11.5px] font-semibold text-center ${step.active ? 'text-ink' : 'text-faint'}`}>{step.label}</span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-6 text-[13.5px] font-medium text-ink leading-relaxed bg-cream p-5 rounded-[1.25rem]">
                        {selectedDispute.status === 'opened' ? (
                          "Es tu turno de responder. Por favor, proporciona fotos del servicio finalizado y una breve explicación de tu proceso. Tienes 48 hrs hábiles."
                        ) : selectedDispute.status === 'resolving' ? (
                          "El caso está en manos de nuestros mediadores. Estamos revisando ambas partes de la información y te notificaremos pronto."
                        ) : (
                          "Este caso ha sido cerrado y los fondos distribuidos acorde a la resolución final enviada a tu correo."
                        )}
                      </p>
                    </div>

                    {/* Evidencia */}
                    {selectedDispute.status !== 'closed' && (
                      <div className="space-y-6">
                        <div>
                          <label className={`block ${EYEBROW} text-muted mb-2 ml-1`}>Tu declaración</label>
                          <textarea
                            placeholder="Explica en detalle qué sucedió durante el servicio y por qué no estás de acuerdo con el reclamo…"
                            className="w-full min-h-[128px] bg-sand border-0 rounded-[1.25rem] px-5 py-4 text-[14px] font-medium text-ink placeholder:text-faint outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                          />
                        </div>

                        <div>
                          <label className={`block ${EYEBROW} text-muted mb-2 ml-1`}>Evidencia fotográfica</label>
                          <label className="bg-sand rounded-[1.5rem] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary-light/60 transition-colors v2-press">
                            <span className="w-12 h-12 rounded-[1.05rem] bg-cream text-primary-deep flex items-center justify-center mb-3">
                              <ImagePlus size={20} />
                            </span>
                            <p className="text-[14px] font-semibold text-ink">Arrastra tus fotos aquí o haz clic para subir</p>
                            <p className="text-[12px] font-medium text-muted mt-1">JPG, PNG o MP4 · máx. 10 MB</p>
                          </label>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2">
                          <button type="button" className="flex-1 h-14 rounded-full bg-primary hover:bg-primary-dark text-ink text-[13px] font-bold v2-press transition-colors">
                            Enviar evidencia
                          </button>
                          <button type="button" className="flex-1 h-14 rounded-full bg-sand text-ink text-[13px] font-bold v2-press">
                            Solicitar asistencia de administración
                          </button>
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              ) : (
                <>
                  <div className="flex items-end justify-between gap-4">
                    <h3 className="text-[22px] font-semibold tracking-tight text-ink">Tus casos</h3>
                    <div className="v3-blur-in flex gap-6" style={{ animationDelay: '350ms' }}>
                      {TABS.map(tab => {
                        const active = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative shrink-0 pb-3 text-[14px] transition-colors duration-300 tabular-nums ${active ? 'font-semibold text-ink' : 'font-medium text-faint hover:text-muted'}`}
                          >
                            {tab.label} ({tab.count})
                            <span className={`absolute left-0 right-0 -bottom-px h-[3px] rounded-full bg-lavender transition-transform duration-500 origin-left ${active ? 'scale-x-100' : 'scale-x-0'}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {filteredDisputes.length === 0 ? (
                      <div className="v2-rise bg-cream rounded-[2.25rem] px-8 py-14 flex flex-col items-center text-center v2-shadow-soft">
                        <span className="w-16 h-16 rounded-[1.4rem] bg-primary-light text-primary-deep flex items-center justify-center mb-5">
                          <ShieldCheck size={26} />
                        </span>
                        <h3 className="text-[19px] font-semibold tracking-tight text-ink">Todo en orden</h3>
                        <p className="mt-1.5 text-[13.5px] font-medium text-muted max-w-xs">No hay disputas en esta sección. Un buen servicio y comunicación clara mantienen tu historial limpio.</p>
                        <button type="button" onClick={() => setActiveTab(activeTab === 'open' ? 'resolved' : 'open')} className="mt-6 h-12 px-6 rounded-full bg-ink text-white text-[13px] font-bold v2-press">
                          Ver {activeTab === 'open' ? 'resueltas' : 'abiertas'}
                        </button>
                      </div>
                    ) : filteredDisputes.map((dispute, i) => (
                      <article
                        key={dispute.id}
                        onClick={() => setSelectedDispute(dispute)}
                        className={`v2-rise v2-d${Math.min(i + 2, 8)} group bg-cream p-5 md:p-6 rounded-[1.75rem] v2-shadow-soft v2-press v2-float flex items-start gap-5 cursor-pointer`}
                      >
                        <span className={`w-14 h-14 shrink-0 rounded-[1.15rem] flex items-center justify-center ${
                          dispute.status === 'closed' ? 'bg-mint-light text-mint-deep' : 'bg-rose/20 text-error'
                        }`}>
                          {dispute.status === 'closed' ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />}
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3">
                            <span className={`${EYEBROW} text-primary-deep truncate`}>{dispute.id} · <span className="text-faint">{dispute.date}</span></span>
                            <span className={`${PILL} shrink-0 ${PRIORITY_TONE[dispute.priority] || 'bg-sand text-muted'}`}>
                              {PRIORITY_LABEL[dispute.priority] || dispute.priority}
                            </span>
                          </div>
                          <h4 className="mt-1.5 text-[17px] font-semibold tracking-tight text-ink leading-tight">{dispute.reason}</h4>
                          <div className="flex items-center gap-2.5 mt-2">
                            <Avatar size="sm" name={dispute.client} className="w-6 h-6" />
                            <p className="text-[12.5px] font-medium text-muted truncate">{dispute.client} · {dispute.service}</p>
                            <span className={`${PILL} ml-auto hidden sm:inline-flex ${STATUS_TONE[dispute.status]}`}>{STATUS_LABEL[dispute.status]}</span>
                          </div>
                          <p className="mt-3 text-[13px] font-medium text-muted truncate bg-sand px-4 py-2.5 rounded-[1rem]">
                            “{dispute.lastMessage}”
                          </p>
                        </div>

                        <span className="hidden md:flex w-10 h-10 shrink-0 rounded-full bg-sand text-ink items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity self-center">
                          <ChevronRight size={16} />
                        </span>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* ── Columna lateral ── */}
            <aside className="space-y-5">
              <div className="v2-rise v2-d3 relative overflow-hidden v3-night-grad rounded-[2.25rem] p-7 text-on-dark v2-shadow-lift">
                <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-lavender/25 blur-3xl pointer-events-none" />
                <div className="relative">
                  <span className="w-14 h-14 rounded-[1.2rem] bg-white/10 text-primary flex items-center justify-center mb-5">
                    <MessageCircle size={26} />
                  </span>
                  <p className={`${EYEBROW} text-on-dark/60`}>Soporte express</p>
                  <h4 className="mt-2 text-[22px] font-semibold tracking-tight leading-tight">Chat con un mediador</h4>
                  <p className="mt-2 text-[13px] font-medium text-on-dark/60 leading-relaxed">
                    Conéctate con un agente verificado para resolver tu disputa de forma inmediata.
                  </p>
                  <button type="button" className="mt-6 w-full h-12 rounded-full bg-primary hover:bg-primary-dark text-ink text-[13px] font-bold v2-press transition-colors">
                    Iniciar chat
                  </button>
                </div>
              </div>

              <section className="v2-rise v2-d4">
                <h3 className="text-[18px] font-semibold tracking-tight text-ink mb-4">Centro de ayuda</h3>
                <div className="space-y-2.5">
                  {FAQS.map((faq, i) => (
                    <div
                      key={i}
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="p-5 bg-cream rounded-[1.5rem] v2-shadow-soft flex flex-col group cursor-pointer v2-press"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[14px] font-semibold text-ink">{faq.q}</span>
                        <ChevronRight size={15} className={`shrink-0 transition-transform duration-300 ${expandedFaq === i ? 'rotate-90 text-primary-deep' : 'text-faint'}`} />
                      </div>

                      {expandedFaq === i && (
                        <div className="v2-rise mt-3 pt-3 border-t border-line">
                          <p className="text-[13px] font-medium text-muted leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
