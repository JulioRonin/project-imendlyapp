"use client";

import { Logo } from '@i-mendly/shared/Logo';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Button } from '@i-mendly/shared/components/Button';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
  Settings,
  CheckCircle2
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

const STAGE_CONFIG = [
  { id: 'application', label: 'Aplicación', color: 'bg-silver-light', variant: 'silver' as const },
  { id: 'revision', label: 'En Revisión', color: 'bg-amber-50', variant: 'warning' as const },
  { id: 'interview', label: 'Entrevista', color: 'bg-indigo-50', variant: 'indigo' as const },
  { id: 'training', label: 'Capacitación', color: 'bg-purple-50', variant: 'purple' as const },
  { id: 'active', label: 'Activos', color: 'bg-emerald-50', variant: 'success' as const },
];

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

  return (
    <main className="min-h-screen bg-silver font-urbanist flex">
      <AdminSidebar />
      <div className="flex-1 max-w-7xl mx-auto px-8 py-12">
        <header className="mb-12">
          <Link href="/admin" className="flex items-center gap-2 text-gray-soft text-xs mb-6 hover:text-black-rich transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al Dashboard
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-[600] tracking-tight text-black-rich mb-2">Pipe de Onboarding</h2>
              <p className="text-gray-soft text-sm font-[500]">Seguimiento y conversión de nuevos proveedores de servicios.</p>
            </div>
            <div className="flex gap-4 items-center">
               <div className="text-right">
                  <p className="text-[10px] text-gray-soft uppercase font-[700] tracking-widest">Nuevos Hoy</p>
                  <p className="text-xl font-[700] text-primary">+{candidates.filter(c => new Date(c.created_at).toDateString() === new Date().toDateString()).length}</p>
               </div>
               <Button variant="primary" className="gap-2 shadow-lg shadow-primary/20">Invitar Proveedor</Button>
            </div>
          </div>
        </header>

        {/* Pipeline Funnel Visualization */}
        <div className="flex items-center gap-4 mb-16 overflow-x-auto pb-4 no-scrollbar">
           {STAGE_CONFIG.map((stage, i) => (
             <div key={stage.id} className="flex items-center gap-4">
                <Card variant="default" className={`p-8 min-w-[200px] text-center ${stage.color} border-none shadow-sm flex flex-col items-center justify-center`}>
                   <p className="text-[10px] uppercase font-[700] mb-3 opacity-60 tracking-widest font-urbanist text-black-rich">{stage.label}</p>
                   <div className="flex items-baseline gap-1">
                     <p className="text-4xl font-[800] text-black-rich">{stats[stage.id] || 0}</p>
                     <span className="text-[10px] text-gray-soft font-[600]">PROV</span>
                   </div>
                </Card>
                {i < STAGE_CONFIG.length - 1 && (
                   <ChevronRight size={20} className="text-black/20 flex-shrink-0" />
                )}
             </div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Detailed Table / List of candidates */}
           <Card variant="default" className="lg:col-span-2 p-8 bg-white border-none shadow-sm rounded-2xl">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xl font-[700] text-black-rich tracking-tight">Candidatos en Proceso</h3>
                 <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-soft" size={14} />
                    <input className="w-full pl-9 pr-4 py-2 bg-silver-light border-none rounded-xl text-xs focus:ring-1 focus:ring-primary outline-none font-[500]" placeholder="Buscar candidato..." />
                 </div>
              </div>
              
              <div className="space-y-4">
                 <div className="grid grid-cols-4 px-4 py-2 text-[10px] font-[700] text-gray-soft uppercase tracking-widest">
                    <span>Nombre</span>
                    <span>Especialidad</span>
                    <span>Etapa actual</span>
                    <span className="text-right">Ubicación</span>
                 </div>
                 {loading ? (
                   <div className="py-20 text-center text-gray-soft text-sm font-[500]">Cargando aspirantes...</div>
                 ) : candidates.length === 0 ? (
                   <div className="py-20 text-center text-gray-soft text-sm font-[500]">No hay aspirantes registrados aún.</div>
                 ) : candidates.map((p, i) => {
                   const stage = STAGE_CONFIG.find(s => s.id === p.status);
                   return (
                     <Link href={`/admin/proveedores/onboarding/aspirantes/${p.id}`} key={i}>
                       <div className="grid grid-cols-4 items-center p-4 bg-silver-light/20 rounded-2xl border border-transparent hover:border-black/5 hover:bg-silver-light/40 transition-all duration-300 cursor-pointer group mb-1">
                          <div className="flex items-center gap-3">
                             <Avatar name={p.full_name} size="sm" className="shadow-sm" />
                             <div>
                               <p className="text-sm font-[700] text-black-rich group-hover:text-primary transition-colors">{p.full_name}</p>
                               <p className="text-[10px] text-gray-soft font-[500]">ID: {p.id.slice(0, 8)}</p>
                             </div>
                          </div>
                          <span className="text-xs text-black-rich/70 font-[600] capitalize">{p.main_specialty === 'otro' ? p.other_specialty_name : p.main_specialty}</span>
                          <div>
                             <Badge variant={stage?.variant || 'silver'} className="font-[800]">
                               {stage?.label || p.status}
                             </Badge>
                          </div>
                          <span className="text-xs text-gray-soft text-right font-[600]">{p.city || 'Ciudad Juárez'}</span>
                       </div>
                     </Link>
                   );
                 })}
              </div>
              <Link href="/admin/proveedores/onboarding/aspirantes">
                <Button variant="ghost" size="sm" className="w-full mt-8 text-primary font-[700] hover:bg-primary/5 rounded-xl border border-primary/10">Ver listado completo de aspirantes</Button>
              </Link>
           </Card>

           {/* Metrics Card */}
           <div className="space-y-8">
              <Card variant="default" className="p-8 bg-white border-none shadow-sm rounded-2xl">
                 <h3 className="text-xl font-[700] text-black-rich tracking-tight mb-8 font-urbanist">Conversión de Pipe</h3>
                 
                 <div className="space-y-8">
                    <div className="flex items-center justify-between p-4 bg-silver-light/30 rounded-2xl">
                       <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-xl">
                            <Users size={18} className="text-primary" />
                          </div>
                          <div>
                             <p className="text-sm font-[700] text-black-rich uppercase tracking-tight">Tasa Aprobación</p>
                             <p className="text-[10px] text-gray-soft font-[500]">Conversión total</p>
                          </div>
                       </div>
                       <p className="text-2xl font-[800] text-black-rich">
                         {candidates.length > 0 ? ((stats.active / candidates.length) * 100).toFixed(1) : '0.0'}%
                       </p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-silver-light/30 rounded-2xl">
                       <div className="flex items-center gap-3">
                          <div className="bg-emerald-500/10 p-2 rounded-xl">
                            <TrendingUp size={18} className="text-emerald-500" />
                          </div>
                          <div>
                             <p className="text-sm font-[700] text-black-rich uppercase tracking-tight">Tiempo Medio</p>
                             <p className="text-[10px] text-gray-soft font-[500]">Días para activación</p>
                          </div>
                       </div>
                       <p className="text-2xl font-[800] text-black-rich">4.2d</p>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-black/5">
                       <p className="text-[10px] uppercase font-[700] text-gray-soft tracking-widest px-1">Especialidades con mayor demanda</p>
                       <div className="space-y-3">
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
                           <div key={name} className="flex justify-between items-center text-sm p-2 hover:bg-silver-light/20 rounded-lg transition-colors">
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-[800] text-primary bg-primary/5 w-5 h-5 flex items-center justify-center rounded-sm">0{i+1}</span>
                                <span className="capitalize font-[600] text-black-rich/80">{name}</span>
                              </div>
                              <span className="font-[800] text-black-rich">{count}</span>
                           </div>
                         ))}
                         {candidates.length === 0 && <p className="text-xs text-gray-soft text-center py-4">No hay datos aún</p>}
                       </div>
                    </div>
                 </div>
              </Card>

              <Card variant="default" className="p-8 bg-black-rich text-white border-none shadow-xl rounded-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
                 <div className="flex items-center gap-3 mb-4 relative z-10">
                    <CheckCircle2 size={20} className="text-primary" />
                    <h4 className="text-sm font-[700] uppercase tracking-widest">Protocolo de Oro</h4>
                 </div>
                 <p className="text-xs text-white/60 leading-relaxed relative z-10 font-[500]">
                    Todos los proveedores deben pasar validación de INE, comprobante de domicilio y entrevista técnica antes de ser marcados como **ACTIVOS**.
                 </p>
                 <Button variant="ghost" className="w-full mt-6 border-white/10 text-white hover:bg-white/5 text-xs">Ver lista de verificación</Button>
              </Card>
           </div>
        </div>
      </div>
    </main>
  );
}
