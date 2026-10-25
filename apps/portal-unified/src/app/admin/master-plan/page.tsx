"use client";

import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SegmentBar } from '@/components/client/ui';

const PHASES = [
  { phase: "Fase 0", title: "Foundation", items: ["Setup Entorno", "ECC Config", "Supabase Schema", "Design System v2"], status: "completed" },
  { phase: "Fase 1", title: "Portal Proveedor", items: ["Onboarding 6 pasos", "Verificación Identidad", "Dashboard Proveedor"], status: "active" },
  { phase: "Fase 2", title: "Portal Cliente", items: ["Búsqueda/Filtros", "Integración Stripe", "Cobro protegido"], status: "todo" },
  { phase: "Fase 3", title: "Portal Admin", items: ["Dashboard Operativo", "Resolución Disputas", "Analytics"], status: "todo" },
];

const PHASE_PILL: Record<string, { label: string; className: string }> = {
  completed: { label: 'Lista', className: 'bg-mint-light text-mint-deep' },
  active: { label: 'En progreso', className: 'bg-lavender-light text-ink' },
  todo: { label: 'Pendiente', className: 'bg-sand text-muted' },
};

/** Segmentos completados (solo presentación): todo lo de la fase lista, la mitad de la activa. */
const doneSegments = (status: string, total: number) =>
  status === 'completed' ? total : status === 'active' ? Math.ceil(total / 2) : 0;

export default function MasterPlanPage() {
  return (
    <main className="min-h-screen bg-linen flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-14">
          {/* ── Cabecera editorial ── */}
          <header className="v3-blur-in">
            <Link href="/admin" className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-muted hover:text-ink transition-colors group mb-6">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al dashboard
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-lavender-light text-ink text-[11px] font-bold mb-4">
                  <Lock size={12} /> Confidencial · uso interno
                </span>
                <h1 className="text-[40px] md:text-[56px] font-semibold tracking-tight leading-[1.0] text-ink">
                  I mendly <span className="text-primary-deep">Master Plan</span>
                </h1>
                <p className="mt-3 text-[14px] font-medium text-muted">Project Manager certificado PMI · Marzo 2026 · XP Master Plan v2.0</p>
              </div>
            </div>
          </header>

          {/* ── 01. Business case ── */}
          <section className="mt-14">
            <div className="v3-blur-in flex items-center gap-4 mb-7" style={{ animationDelay: '120ms' }}>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep">01</span>
              <h2 className="text-[26px] font-semibold tracking-tight text-ink">Business case</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="v2-rise v2-d1 bg-cream rounded-[2.25rem] p-8 md:p-9 v2-shadow-soft v2-float">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-2">Contexto</p>
                <h3 className="text-[22px] font-semibold tracking-tight text-ink mb-5">El problema</h3>
                <ul className="space-y-3.5 text-[14px] font-medium text-muted">
                  {[
                    'Informalidad total en servicios (78% efectivo)',
                    'Sin verificación de proveedores (riesgo total)',
                    'Anticipos sin respaldo → fraudes frecuentes',
                    'Precios opacos sin estándar de mercado',
                  ].map(item => (
                    <li key={item} className="flex gap-3 items-start">
                      <span className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="v2-rise v2-d2 relative overflow-hidden v3-night-grad text-on-dark rounded-[2.25rem] p-8 md:p-9 v2-shadow-lift">
                <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-primary/25 blur-3xl" />
                <div className="relative">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lavender mb-2">Propuesta de valor</p>
                  <p className="text-[24px] font-semibold tracking-tight leading-snug">
                    “Seguridad absoluta para el cliente, pago garantizado para el proveedor.”
                  </p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-mint text-ink text-[11px] font-bold"><ShieldCheck size={12} /> Escrow protección</span>
                    <span className="inline-flex items-center h-8 px-3 rounded-full bg-white/10 text-on-dark text-[11px] font-bold">Clientes certificados</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="v2-rise v2-d3 bg-cream rounded-[2.25rem] p-8 md:p-10 v2-shadow-soft">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {[
                  { value: '$41.9M', label: 'GMV proyectado año 1', accent: true },
                  { value: '3.4K', label: 'Hogares activos' },
                  { value: '11%', label: 'Comisión promedio' },
                ].map(k => (
                  <div key={k.label}>
                    <p className={`text-[44px] md:text-[52px] font-bold tabular-nums tracking-tight leading-none ${k.accent ? 'text-primary-deep' : 'text-ink'}`}>{k.value}</p>
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">{k.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 02. PMI Master Plan ── */}
          <section className="mt-16">
            <div className="flex items-center gap-4 mb-7">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep">02</span>
              <h2 className="text-[26px] font-semibold tracking-tight text-ink">PMI Master Plan</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {PHASES.map((f, i) => {
                const pill = PHASE_PILL[f.status] || PHASE_PILL.todo;
                return (
                  <article key={i} className={`v2-rise v2-d${Math.min(i + 1, 8)} bg-cream rounded-[2rem] p-7 md:p-8 v2-shadow-soft v2-float ${f.status === 'todo' ? 'opacity-70' : ''}`}>
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <span className={`text-[10px] font-bold uppercase tracking-[0.18em] ${f.status === 'active' ? 'text-primary-deep' : 'text-muted'}`}>{f.phase}</span>
                      <span className={`inline-flex items-center h-7 px-3 rounded-full text-[11px] font-semibold ${pill.className}`}>
                        {f.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-lavender mr-1.5 animate-pulse" />}
                        {pill.label}
                      </span>
                    </div>
                    <h3 className="text-[24px] font-semibold tracking-tight text-ink">{f.title}</h3>
                    <SegmentBar total={f.items.length} done={doneSegments(f.status, f.items.length)} className="mt-5" />
                    <div className="mt-5 flex flex-wrap gap-2">
                      {f.items.map((item, j) => (
                        <span key={j} className="inline-flex items-center h-8 px-3 rounded-full bg-sand text-ink text-[12px] font-semibold">
                          {item}
                        </span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* ── 03. AI Agents ── */}
          <section className="mt-16">
            <div className="v2-rise relative overflow-hidden v3-night-grad text-on-dark rounded-[2.75rem] p-8 md:p-14 v2-shadow-lift">
              <div className="absolute -right-24 -top-24 w-[380px] h-[380px] rounded-full bg-primary/15 blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-lavender">03</span>
                  <h2 className="text-[26px] font-semibold tracking-tight">AI Agents ECC</h2>
                </div>
                <p className="text-[17px] font-medium text-on-dark/60 leading-relaxed max-w-2xl mb-10">
                  Sistema de optimización para agentes IA. 8 especialistas configurados con memoria persistente y reglas críticas de negocio.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "Arquitecto Senior", desc: "Decisiones de escalabilidad y stack." },
                    { name: "Payments Expert", desc: "Responsable del cobro protegido y Stripe." },
                    { name: "Backend Guru", desc: "RLS Policies y PostgreSQL." },
                    { name: "Frontend Master", desc: "React/Next.js Design System." },
                  ].map((a, i) => (
                    <div key={i} className="p-6 rounded-[1.5rem] bg-white/5 hover:bg-white/10 transition-colors flex items-start gap-4">
                      <span className="w-10 h-10 shrink-0 rounded-[0.9rem] bg-white/10 text-primary flex items-center justify-center"><Sparkles size={17} /></span>
                      <div>
                        <p className="text-[15px] font-semibold">{a.name}</p>
                        <p className="mt-0.5 text-[13px] font-medium text-on-dark/50">{a.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── 04. Supabase Schema ── */}
          <section className="mt-16">
            <div className="flex items-center gap-4 mb-7">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep">04</span>
              <h2 className="text-[26px] font-semibold tracking-tight text-ink">Supabase schema</h2>
            </div>
            <div className="v2-rise bg-ink-900 text-on-dark rounded-[2rem] p-7 md:p-9 overflow-x-auto v2-shadow-lift">
              <pre className="text-primary font-mono text-[12.5px] leading-relaxed">{`-- SQL SCHEMA I MENDLY v2.0
CREATE TYPE user_role AS ENUM ('client', 'provider', 'admin');
CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'escrow_funded', ...);

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Active RLS by default
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;`}</pre>
            </div>
            <p className="mt-4 text-[12.5px] font-medium text-faint">Referencia técnica certificada · las credenciales viven en <span className="font-semibold text-muted">.env.local</span>, nunca en el código.</p>
          </section>

          {/* ── 05. Marketing MVP ── */}
          <section className="mt-16">
            <div className="flex items-center gap-4 mb-7">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep">05</span>
              <h2 className="text-[26px] font-semibold tracking-tight text-ink">Marketing MVP</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Target proveedores</p>
                <div className="v2-rise v2-d1 bg-cream rounded-[1.75rem] p-7 v2-shadow-soft">
                  <p className="text-[19px] font-semibold tracking-tight text-ink mb-2">“¿Cuántos clientes te deben hoy?”</p>
                  <span className="inline-flex items-center h-7 px-3 rounded-full bg-primary-light text-primary-deep text-[11px] font-semibold">TikTok Ads · hook conversión 25%</span>
                </div>
                <div className="v2-rise v2-d2 bg-sand rounded-[1.75rem] p-7">
                  <p className="text-[19px] font-semibold tracking-tight text-muted mb-2">“Ferreterías locales Juárez”</p>
                  <span className="inline-flex items-center h-7 px-3 rounded-full bg-cream text-muted text-[11px] font-semibold">Captación offline estratégica</span>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Target clientes</p>
                <div className="v2-rise v2-d2 bg-cream rounded-[1.75rem] p-7 v2-shadow-soft">
                  <p className="text-[19px] font-semibold tracking-tight text-ink mb-2">“Tu dinero seguro hasta que apruebes.”</p>
                  <span className="inline-flex items-center h-7 px-3 rounded-full bg-primary-light text-primary-deep text-[11px] font-semibold tabular-nums">Facebook Ads · adquisición $5k MXN</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── 06. Checklist ── */}
          <section className="mt-16 mb-10">
            <div className="v2-rise bg-primary rounded-[2.75rem] p-10 md:p-14 text-center v2-shadow-lift">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/60 mb-3">Checklist final · Juárez 2026</p>
              <h2 className="text-[34px] md:text-[48px] font-semibold tracking-tight leading-[1.02] text-ink">¿Listos para el launch?</h2>
              <div className="mt-8 flex flex-wrap justify-center gap-2.5">
                {['50 proveedores certificados', 'Stripe en producción', 'Aviso de privacidad', 'RLS 100%'].map((item, i) => (
                  <span key={i} className="inline-flex items-center h-10 px-5 rounded-full bg-ink text-white text-[12.5px] font-bold">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <footer className="py-10 border-t border-line text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">I mendly 2026</p>
            <p className="mt-2 text-[13px] font-medium text-faint">El tiempo vale, el trabajo más.</p>
          </footer>
        </div>
      </div>
    </main>
  );
}
