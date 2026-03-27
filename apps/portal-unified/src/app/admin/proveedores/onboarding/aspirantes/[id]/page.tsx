"use client";

import { Logo } from '@i-mendly/shared/Logo';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Button } from '@i-mendly/shared/components/Button';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import Link from 'next/link';
import { 
  AlertCircle, 
  BarChart3, 
  UserPlus, 
  TrendingUp, 
  Zap,
  ArrowLeft,
  FileText,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ShieldCheck,
  ClipboardList
} from 'lucide-react';

export default function AspiranteDetailPage({ params }: { params: { id: string } }) {
  const navItems = [
    { label: 'Dashboard', icon: <BarChart3 size={18} />, href: '/admin' },
    { label: 'Disputas', icon: <AlertCircle size={18} />, href: '/admin/disputas' },
    { label: 'Onboarding', icon: <UserPlus size={18} />, href: '/admin/proveedores/onboarding', active: true },
    { label: 'Finanzas', icon: <TrendingUp size={18} />, href: '/admin/finanzas' },
    { label: 'Master Plan', icon: <Zap size={18} />, href: '/admin/master-plan' },
  ];

  return (
    <main className="min-h-screen bg-silver font-urbanist flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-black-rich text-white flex flex-col sticky top-0 h-screen p-6">
        <div className="mb-12">
          <Logo size={32} variant="dark" />
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item, i) => (
            <Link key={i} href={item.href}>
              <div className={`
                flex items-center gap-3 px-4 py-3 rounded-pill transition-all
                ${item.active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/50 hover:text-white hover:bg-white/5'}
              `}>
                {item.icon}
                <span className="text-sm font-[500]">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content Area */}
      <div className="flex-1 max-w-7xl mx-auto px-8 py-12">
        <header className="mb-12">
          <Link href="/admin/proveedores/onboarding/aspirantes" className="flex items-center gap-2 text-gray-soft text-xs mb-6 hover:text-black-rich transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al Listado
          </Link>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
               <Avatar name="Marcos Rivas" size="xl" className="border-4 border-white shadow-lg" />
               <div>
                  <div className="flex items-center gap-3 mb-2">
                     <h2 className="text-4xl font-[600] tracking-tight text-black-rich">Marcos Rivas</h2>
                     <Badge variant="silver" className="uppercase text-[10px]">ENTREVISTA</Badge>
                  </div>
                  <p className="text-gray-soft text-lg mb-4">Plomero Especialista · Cd. Juárez, MX</p>
                  <div className="flex gap-4">
                     <span className="flex items-center gap-2 text-xs text-black-rich/60 font-[500]"><Mail size={14} /> marcos.rivas@email.com</span>
                     <span className="flex items-center gap-2 text-xs text-black-rich/60 font-[500]"><Phone size={14} /> +52 656 123 4567</span>
                  </div>
               </div>
            </div>
            <div className="flex gap-3">
               <Button variant="secondary" className="rounded-pill">Contactar</Button>
               <Button variant="primary" className="bg-black-rich hover:bg-black text-white px-8 rounded-pill">Agendar Entrevista</Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Details Section */}
           <div className="lg:col-span-2 space-y-8">
              <Card variant="default" className="p-8">
                 <h3 className="text-lg font-[600] text-black-rich tracking-tight mb-8 flex items-center gap-2">
                    <FileText size={20} className="text-primary" /> Documentación y Verificación
                 </h3>
                 <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'Identificación Oficial (INE)', status: 'Verificado', icon: <ShieldCheck className="text-primary" /> },
                      { name: 'Comprobante Domicilio', status: 'En espera', icon: <MessageSquare className="text-im-warning" /> },
                      { name: 'Antecedentes No Penales', status: 'Verificado', icon: <ShieldCheck className="text-primary" /> },
                      { name: 'Certificación Técnica', status: 'Pendiente subida', icon: <AlertCircle className="text-gray-soft" /> },
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-silver-light/20 rounded-lg border-[0.5px] border-black/5">
                         <div className="flex items-center gap-3">
                            {doc.icon}
                            <span className="text-xs font-[600] text-black-rich">{doc.name}</span>
                         </div>
                         <Badge variant="silver" className="text-[9px]">{doc.status}</Badge>
                      </div>
                    ))}
                 </div>
              </Card>

              <Card variant="default" className="p-8">
                 <h3 className="text-lg font-[600] text-black-rich tracking-tight mb-8 flex items-center gap-2">
                    <ClipboardList size={20} className="text-primary" /> Notas de Reclutamiento
                 </h3>
                 <div className="space-y-6">
                    <div className="p-6 bg-silver-light/20 rounded-lg border-l-4 border-primary">
                       <p className="text-xs text-gray-soft font-[600] mb-2 uppercase tracking-widest text-[9px]">24 Mar, 2026 · Admin RH</p>
                       <p className="text-sm leading-relaxed text-black-rich">
                          "Se revisó el perfil técnico. Marcos tiene 12 años de experiencia. Su historial en otras plataformas es excelente. 
                          Procede a fase de entrevista técnica en campo para validación de herramientas."
                       </p>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full border-dashed border-black/10 text-gray-soft rounded-pill">+ Añadir nueva nota</Button>
                 </div>
              </Card>

              {/* Action Resolution Card */}
              <Card variant="dark" className="p-10">
                 <h3 className="text-xl font-[600] mb-4 tracking-tight">Acción de Estatus</h3>
                 <p className="text-sm opacity-60 mb-8 leading-relaxed">
                    Decide el siguiente paso para el aspirante. Si lo apruebas, pasará a la etapa de **Capacitación** (Onboarding técnico). 
                    Si lo rechazas, se enviará una notificación formal de agradecimiento.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="ghost" className="border-white/10 text-white hover:bg-primary gap-2 rounded-pill">
                       <CheckCircle2 size={18} /> Aprobar para Capacitación
                    </Button>
                    <Button variant="ghost" className="border-white/10 text-white hover:bg-im-error gap-2 rounded-pill">
                       <XCircle size={18} /> Rechazar Candidato
                    </Button>
                 </div>
              </Card>
           </div>

           {/* Metrics Sidebar */}
           <div className="space-y-8">
              <Card variant="default" className="p-8">
                 <h3 className="text-lg font-[600] text-black-rich tracking-tight mb-8">Score de Aplicación</h3>
                 <div className="flex flex-col items-center py-8">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                       <svg className="absolute inset-0 w-full h-full -rotate-90">
                          <circle cx="64" cy="64" r="58" className="stroke-silver-light" strokeWidth="8" fill="none" />
                          <circle cx="64" cy="64" r="58" className="stroke-primary" strokeWidth="8" strokeDasharray={`${85 * 3.64} 364`} strokeLinecap="round" fill="none" />
                       </svg>
                       <p className="text-3xl font-[600] text-black-rich">85%</p>
                    </div>
                    <p className="mt-6 text-sm text-gray-soft font-[500]">Perfil Técnico: **A+**</p>
                 </div>
                 <div className="w-full h-[1px] bg-black/5 my-8" />
                 <div className="space-y-4">
                    <p className="text-[10px] text-gray-soft font-[600] uppercase tracking-widest text-center">Comparativa con Global</p>
                    <div className="flex items-center gap-4">
                       <div className="flex-1 h-1.5 bg-silver-light rounded-pill overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: '92%' }} />
                       </div>
                       <span className="text-[10px] font-[600]">92 ptos</span>
                    </div>
                 </div>
              </Card>

              <Card variant="silver" className="p-8 border-none bg-black-rich text-white overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-[40px] rounded-pill -mr-12 -mt-12" />
                 <h4 className="text-sm font-[600] mb-4">Verificación de Antecedentes</h4>
                 <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-primary">
                       <CheckCircle2 size={14} /> Historial Limpio (Poder Judicial)
                    </div>
                    <div className="flex items-center gap-2 text-xs text-primary">
                       <CheckCircle2 size={14} /> Referencias Laborales (3/3)
                    </div>
                 </div>
              </Card>
           </div>
        </div>
      </div>
    </main>
  );
}
