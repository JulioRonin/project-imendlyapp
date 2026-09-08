"use client";

import { Logo } from '@i-mendly/shared/Logo';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Button } from '@i-mendly/shared/components/Button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, ArrowLeft } from 'lucide-react';

export default function MasterPlanPage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/role-selection');
  };

  return (
    <main className="min-h-screen bg-silver text-black-rich font-urbanist">
      {/* Navigation */}
      <nav className="bg-black-rich px-8 py-4 text-white flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/admin">
            <Logo size={32} variant="dark" />
          </Link>
          <h1 className="text-xs font-[600] uppercase tracking-[2px] opacity-70">XP Master Plan v2.0</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 gap-2">
              <ArrowLeft size={14} /> Volver al Dashboard
            </Button>
          </Link>
          <div className="w-[1px] h-6 bg-white/10 mx-2" />
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            size="sm" 
            className="text-im-error hover:bg-im-error/10 gap-2 font-[600]"
          >
            <LogOut size={16} /> Cerrar Sesión
          </Button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-20">
        <header className="mb-24 text-center">
          <Badge variant="success" className="mb-8 mx-auto">CONFIDENCIAL — USO INTERNO</Badge>
          <h2 className="text-5xl md:text-7xl font-[600] tracking-tight mb-4 leading-[1.05]">I MENDLY<br /><span className="text-primary">MASTER PLAN</span></h2>
          <p className="text-xs text-gray-soft uppercase tracking-[3px] font-[500]">Project Manager Certificado PMI · Marzo 2026</p>
        </header>

        {/* 0. Nota de Seguridad */}
        <section className="mb-24">
          <Card variant="silver" className="border-im-error/20 bg-im-error/5 p-10">
            <h3 className="text-im-error font-[600] text-xl mb-6 flex items-center gap-2">
              ⚠️ NOTA DE SEGURIDAD
            </h3>
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-sm font-mono text-xs text-black-rich/80 border-[0.5px] border-black/5">
              <p className="mb-3 font-[600] text-black-rich">NUNCA compartas estas credenciales en repositorios públicos:</p>
              <p className="text-im-error select-all">SUPABASE_URL=https://ysjtoesrtbgmugaagbcf.supabase.co</p>
              <p className="text-im-error select-all">SUPABASE_ANON_KEY=sb_publishable_aU82V5AyahQsEqYK4HSLKQ_LY3-neAZ</p>
              <p className="mt-6 font-[600] text-black-rich opacity-60 italic">Guarda siempre en: .env.local (y añade .env.local a .gitignore)</p>
            </div>
          </Card>
        </section>

        {/* 1. Business Case */}
        <section className="mb-32">
          <div className="flex items-center gap-6 mb-12">
             <div className="w-16 h-[1px] bg-primary" />
             <h3 className="text-3xl font-[600] uppercase tracking-tight">01. Business Case</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            <Card variant="floating" className="p-12 hover:translate-y-[-4px] transition-transform">
              <h4 className="text-black-rich font-[600] text-xl mb-6 italic">El Problema</h4>
              <ul className="space-y-5 text-gray-600 text-sm">
                <li className="flex gap-3">
                  <span className="text-primary">●</span>
                  Informalidad total en servicios (78% efectivo)
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">●</span>
                  Sin verificación de proveedores (Riesgo total)
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">●</span>
                  Anticipos sin respaldo → Fraudes frecuentes
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">●</span>
                  Precios opacos sin estándar de mercado
                </li>
              </ul>
            </Card>
            <Card variant="default" className="p-12 border-dashed border-primary/30">
              <h4 className="text-primary font-[600] text-xl mb-6 italic">Propuesta de Valor</h4>
              <p className="text-lg text-black-rich leading-relaxed mb-8">
                "Seguridad absoluta para el cliente, pago garantizado para el proveedor."
              </p>
              <div className="flex flex-wrap gap-3">
                 <Badge variant="success">ESCROW PROTECCIÓN</Badge>
                 <Badge variant="silver">CLIENTES CERTIFICADOS</Badge>
              </div>
            </Card>
          </div>

          <Card variant="silver" className="p-12">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
                <div>
                   <p className="text-5xl font-[600] text-primary mb-3">$41.9M</p>
                   <p className="text-[10px] font-[600] text-gray-soft uppercase tracking-widest">GMV Proyectado Año 1</p>
                </div>
                <div>
                   <p className="text-5xl font-[600] text-black-rich mb-3">3.4K</p>
                   <p className="text-[10px] font-[600] text-gray-soft uppercase tracking-widest">Hogares Activos</p>
                </div>
                <div>
                   <p className="text-5xl font-[600] text-black-rich mb-3">11%</p>
                   <p className="text-[10px] font-[600] text-gray-soft uppercase tracking-widest">Comisión Promedio</p>
                </div>
             </div>
          </Card>
        </section>

        {/* 2. Master Plan PMI */}
        <section className="mb-32">
          <div className="flex items-center gap-6 mb-12">
             <div className="w-16 h-[1px] bg-primary" />
             <h3 className="text-3xl font-[600] uppercase tracking-tight">02. PMI Master Plan</h3>
          </div>
          
          <div className="space-y-6">
            {[
              { phase: "Fase 0", title: "Foundation", items: ["Setup Entorno", "ECC Config", "Supabase Schema", "Design System v2"], status: "completed" },
              { phase: "Fase 1", title: "Portal Proveedor", items: ["Onboarding 6 pasos", "Verificación Identidad", "Dashboard Proveedor"], status: "active" },
              { phase: "Fase 2", title: "Portal Cliente", items: ["Búsqueda/Filtros", "Integración Conekta", "Escrow Escrow"], status: "todo" },
              { phase: "Fase 3", title: "Portal Admin", items: ["Dashboard Operativo", "Resolución Disputas", "Analytics"], status: "todo" },
            ].map((f, i) => (
              <Card 
                key={i} 
                variant={f.status === 'active' ? 'floating' : f.status === 'completed' ? 'default' : 'silver'}
                className={`p-10 ${f.status === 'todo' ? 'opacity-40 grayscale' : ''}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className={`text-[10px] font-[600] uppercase tracking-widest ${f.status === 'active' ? 'text-primary' : 'text-gray-soft'}`}>{f.phase}</span>
                  {f.status === 'completed' && <Badge variant="success">READY</Badge>}
                  {f.status === 'active' && <Badge variant="default" className="animate-pulse">IN PROGRESS</Badge>}
                </div>
                <h4 className="text-2xl font-[600] mb-8 tracking-tight">{f.title}</h4>
                <div className="flex flex-wrap gap-2">
                  {f.items.map((item, j) => (
                    <span key={j} className="px-3 py-1.5 rounded-sm bg-silver-light/50 text-[10px] font-[500] uppercase tracking-tight text-black-rich">
                      {item}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 3. AI Agents */}
        <section className="mb-32">
          <Card variant="default" className="p-20 relative overflow-hidden border-none bg-black-rich text-white">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 filter blur-[100px] rounded-full -mr-32 -mt-32" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-16 text-white">
                 <div className="w-16 h-[1px] bg-primary" />
                 <h3 className="text-3xl font-[600] uppercase tracking-tight">03. AI Agents ECC</h3>
              </div>
              
              <p className="text-xl font-[300] text-white/70 mb-16 leading-relaxed max-w-2xl">
                Sistema de optimización para agentes IA. 8 especialistas configurados con memoria persistente y reglas críticas de negocio.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[
                   { name: "Arquitecto Senior", desc: "Decisiones de escalabilidad y stack." },
                   { name: "Payments Expert", desc: "Responsable del Escrow y Conekta." },
                   { name: "Backend Guru", desc: "RLS Policies y PostgreSQL." },
                   { name: "Frontend Master", desc: "React/Next.js Design System." },
                 ].map((a, i) => (
                   <div key={i} className="p-8 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition group">
                      <p className="font-[600] text-primary uppercase text-sm mb-2 group-hover:translate-x-1 transition-transform">{a.name}</p>
                      <p className="text-xs text-white/40">{a.desc}</p>
                   </div>
                 ))}
              </div>
            </div>
          </Card>
        </section>

        {/* 4. Supabase Schema */}
        <section className="mb-32">
           <div className="flex items-center gap-6 mb-12">
             <div className="w-16 h-[1px] bg-primary" />
             <h3 className="text-3xl font-[600] uppercase tracking-tight">04. Supabase Schema</h3>
          </div>
          <Card variant="floating" className="p-10 bg-black-rich border-none overflow-x-auto">
             <pre className="text-primary font-mono text-xs leading-relaxed">{`-- SQL SCHEMA I MENDLY v2.0
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
          </Card>
          <p className="mt-6 text-[10px] font-[600] text-gray-soft uppercase tracking-widest text-center">Referencia técnica certificada</p>
        </section>

        {/* 5. Marketing MVP */}
        <section className="mb-32">
           <div className="flex items-center gap-6 mb-16">
             <div className="w-16 h-[1px] bg-primary" />
             <h3 className="text-3xl font-[600] uppercase tracking-tight">05. Marketing MVP</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-10">
                <h4 className="text-lg font-[600] text-black-rich uppercase tracking-wider">Target Proveedores</h4>
                <div className="space-y-6">
                   <div className="p-8 rounded-lg bg-white border border-black/5 border-l-primary border-l-4 shadow-sm">
                      <p className="text-lg font-[500] text-black-rich mb-2 italic">"¿Cuántos clientes te deben hoy?"</p>
                      <p className="text-xs text-gray-soft">TikTok Ads Hook para conversión 25%</p>
                   </div>
                   <div className="p-8 rounded-lg bg-white/50 border border-black/5 border-l-gray-soft border-l-4">
                      <p className="text-lg font-[500] text-gray-400 mb-2 italic">"Ferreterías Locales Juárez"</p>
                      <p className="text-xs text-gray-soft/50">Captación offline estratégica</p>
                   </div>
                </div>
             </div>
             <div className="space-y-10">
                <h4 className="text-lg font-[600] text-black-rich uppercase tracking-wider">Target Clientes</h4>
                <div className="space-y-6">
                   <Card variant="floating" className="p-10 border-l-primary border-l-4">
                      <p className="text-lg font-[500] text-black-rich mb-2 italic">"Tu dinero seguro hasta que apruebes."</p>
                      <p className="text-xs text-gray-soft">Facebook Ads - Adquisición $5k MXN</p>
                   </Card>
                </div>
             </div>
          </div>
        </section>

        {/* 6. Checklist */}
        <section className="mb-24">
           <Card variant="default" className="bg-primary p-16 text-center border-none shadow-xl shadow-primary/20">
              <h3 className="text-4xl md:text-5xl font-[600] text-white mb-6 uppercase tracking-tight">¿LISTOS PARA EL LAUNCH?</h3>
              <p className="text-xs font-[600] text-white/70 uppercase tracking-[3px] mb-12 italic">Checklist Final Juárez 2026</p>
              <div className="flex flex-wrap justify-center gap-4">
                 {['50 PROVEEDORES CERT', 'CONEKTA PROD', 'AVISO PRIVACIDAD', 'RLS 100%'].map((item, i) => (
                    <span key={i} className="px-5 py-2.5 bg-black-rich text-white text-[10px] font-[600] uppercase tracking-widest rounded-sm">
                      {item}
                    </span>
                 ))}
              </div>
           </Card>
        </section>
      </div>

      <footer className="py-20 border-t border-black/5 text-center">
        <p className="text-[11px] font-[600] text-gray-soft uppercase tracking-[6px] mb-4">I MENDLY 2026</p>
        <p className="text-[10px] text-gray-soft/50 uppercase tracking-widest font-[300]">EL TIEMPO VALE, EL TRABAJO MÁS.</p>
      </footer>
    </main>
  );
}
