"use client";

import { Logo } from '@i-mendly/shared/Logo';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Button } from '@i-mendly/shared/components/Button';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  AlertCircle, 
  BarChart3, 
  UserPlus, 
  TrendingUp, 
  Zap,
  ArrowLeft,
  ChevronRight,
  ClipboardCheck,
  Search,
  Users,
  LogOut,
  Settings
} from 'lucide-react';

const STAGES = [
  { id: 'app', label: 'Aplicación', count: 124, color: 'bg-silver-light' },
  { id: 'rev', label: 'En Revisión', count: 42, color: 'bg-im-warning/10' },
  { id: 'int', label: 'Entrevista', count: 18, color: 'bg-primary/10' },
  { id: 'tra', label: 'Capacitación', count: 12, color: 'bg-primary/20' },
  { id: 'act', label: 'Activos', count: 458, color: 'bg-black-rich text-white' },
];

const NEW_PROVIDERS = [
  { name: 'Marcos Rivas', specialty: 'Plomero', stage: 'Entrevista', city: 'Ciudad Juárez' },
  { name: 'Elena García', specialty: 'Electricista', stage: 'Revisión', city: 'El Paso' },
  { name: 'David Ortiz', specialty: 'Limpieza', stage: 'Entrevista', city: 'Ciudad Juárez' },
  { name: 'Sofía Lara', specialty: 'General', stage: 'Capacitación', city: 'Ciudad Juárez' },
];

export default function OnboardingPage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/role-selection');
  };

  const navItems = [
    { label: 'Dashboard', icon: <BarChart3 size={18} />, href: '/admin' },
    { label: 'Disputas', icon: <AlertCircle size={18} />, href: '/admin/disputas' },
    { label: 'Onboarding', icon: <UserPlus size={18} />, href: '/admin/proveedores/onboarding', active: true },
    { label: 'Finanzas', icon: <TrendingUp size={18} />, href: '/admin/finanzas' },
    { label: 'Master Plan', icon: <Zap size={18} />, href: '/admin/master-plan' },
    { label: 'Configuración', icon: <Settings size={18} />, href: '/admin/configuraciones' },
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
        
        <div className="pt-6 border-t border-white/10 mt-6">
           <button 
             onClick={handleLogout}
             className="flex items-center gap-3 px-4 py-3 rounded-pill w-full text-im-error hover:bg-im-error/10 transition-all font-[600] text-sm"
           >
             <LogOut size={18} />
             Cerrar Sesión
           </button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 max-w-7xl mx-auto px-8 py-12">
        <header className="mb-12">
          <Link href="/admin" className="flex items-center gap-2 text-gray-soft text-xs mb-6 hover:text-black-rich transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al Dashboard
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-[600] tracking-tight text-black-rich mb-2">Pipe de Onboarding</h2>
              <p className="text-gray-soft text-sm">Seguimiento y conversión de nuevos proveedores de servicios.</p>
            </div>
            <div className="flex gap-4 items-center">
               <div className="text-right">
                  <p className="text-[10px] text-gray-soft uppercase font-[600]">Nuevos Hoy</p>
                  <p className="text-xl font-[600] text-primary">+8</p>
               </div>
               <Button variant="primary" className="gap-2">Invitar Proveedor</Button>
            </div>
          </div>
        </header>

        {/* Pipeline Funnel Visualization */}
        <div className="flex items-center gap-4 mb-16 overflow-x-auto pb-4">
           {STAGES.map((stage, i) => (
             <div key={stage.id} className="flex items-center gap-4">
                <Card variant="floating" className={`p-8 min-w-[180px] text-center ${stage.color} border-none`}>
                   <p className="text-[10px] uppercase font-[600] mb-2 opacity-60 tracking-wider font-urbanist">{stage.label}</p>
                   <p className="text-3xl font-[600]">{stage.count}</p>
                </Card>
                {i < STAGES.length - 1 && (
                  <ChevronRight size={24} className="text-black/10 flex-shrink-0" />
                )}
             </div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Detailed Table / List of candidates */}
           <Card variant="default" className="lg:col-span-2 p-8">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-lg font-[600] text-black-rich tracking-tight">Candidatos en Proceso</h3>
                 <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-soft" size={14} />
                    <input className="w-full pl-9 pr-4 py-2 bg-silver-light border-none rounded-sm text-xs focus:ring-1 focus:ring-primary outline-none" placeholder="Buscar candidato..." />
                 </div>
              </div>
              
              <div className="space-y-4">
                 <div className="grid grid-cols-4 px-4 py-2 text-[10px] font-[600] text-gray-soft uppercase tracking-widest">
                    <span>Nombre</span>
                    <span>Especialidad</span>
                    <span>Etapa actual</span>
                    <span className="text-right">Ciudad</span>
                 </div>
                 {NEW_PROVIDERS.map((p, i) => (
                   <Link href={`/admin/proveedores/onboarding/aspirantes/${i + 1}`} key={i}>
                     <div className="grid grid-cols-4 items-center p-4 bg-silver-light/30 rounded-md border-[0.5px] border-black/5 hover:bg-silver-light/50 transition-colors cursor-pointer group mb-1">
                        <div className="flex items-center gap-3">
                           <Avatar name={p.name} size="sm" />
                           <span className="text-sm font-[600] text-black-rich group-hover:text-primary transition-colors">{p.name}</span>
                        </div>
                        <span className="text-xs text-black-rich/60">{p.specialty}</span>
                        <div>
                           <Badge variant="silver">{p.stage}</Badge>
                        </div>
                        <span className="text-xs text-gray-soft text-right">{p.city}</span>
                     </div>
                   </Link>
                 ))}
              </div>
              <Link href="/admin/proveedores/onboarding/aspirantes">
                <Button variant="secondary" size="sm" className="w-full mt-6 rounded-pill">Ver listado completo de aspirantes</Button>
              </Link>
           </Card>

           {/* Metrics Card */}
           <div className="space-y-8">
              <Card variant="default" className="p-8">
                 <h3 className="text-lg font-[600] text-black-rich tracking-tight mb-8 font-urbanist">Conversión de Pipe</h3>
                 
                 <div className="space-y-8">
                    {/* ... (previous metrics) ... */}
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Users size={20} className="text-primary" />
                          <div>
                             <p className="text-sm font-[600] text-black-rich">Tasa de Aprobación</p>
                             <p className="text-xs text-gray-soft">Promedio mensual</p>
                          </div>
                       </div>
                       <p className="text-xl font-[600] text-black-rich">15.4%</p>
                    </div>

                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <ClipboardCheck size={20} className="text-primary" />
                          <div>
                             <p className="text-sm font-[600] text-black-rich">Tiempo Onboarding</p>
                             <p className="text-xs text-gray-soft">Días promedio</p>
                          </div>
                       </div>
                       <p className="text-xl font-[600] text-black-rich">4.2d</p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-black/5">
                       <p className="text-[10px] uppercase font-[600] text-gray-soft tracking-wider">Top Áreas Demandantes (Cd Juárez)</p>
                       <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                             <span>Fracc. Campestre</span>
                             <span className="font-[600]">112</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                             <span>Valle del Sol</span>
                             <span className="font-[600]">94</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                             <span>Misiones</span>
                             <span className="font-[600]">78</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                             <span>Pradera Dorada</span>
                             <span className="font-[600]">62</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </Card>

              <Card variant="dark" className="p-8 relative overflow-hidden">
                 <div className="absolute inset-0 bg-primary opacity-5 animate-pulse" />
                 <h4 className="text-sm font-[600] mb-2 relative z-10">Reglas de Verificación</h4>
                 <p className="text-[10px] text-white/50 leading-loose relative z-10">
                    Todos los proveedores deben pasar validación de INE, comprobante de domicilio y entrevista técnica antes de ser marcados como **ACTIVOS**.
                 </p>
              </Card>
           </div>
        </div>
      </div>
    </main>
  );
}
