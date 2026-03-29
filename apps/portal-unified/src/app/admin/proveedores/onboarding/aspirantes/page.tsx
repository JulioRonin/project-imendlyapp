"use client";

import { Logo } from '@i-mendly/shared/Logo';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Button } from '@i-mendly/shared/components/Button';
import { Input } from '@i-mendly/shared/components/Input';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import Link from 'next/link';
import { 
  AlertCircle, 
  BarChart3, 
  UserPlus, 
  TrendingUp, 
  Zap,
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  ChevronRight
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

export default function AspirantesListPage() {
  return (
    <main className="min-h-screen bg-silver font-urbanist flex">
      <AdminSidebar />
      <div className="flex-1 max-w-7xl mx-auto px-8 py-12">
        <header className="mb-12">
          <Link href="/admin/proveedores/onboarding" className="flex items-center gap-2 text-gray-soft text-xs mb-6 hover:text-black-rich transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al Onboarding
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-[600] tracking-tight text-black-rich mb-2">Listado de Aspirantes</h2>
              <p className="text-gray-soft text-sm">Gestión integral del talento en proceso de incorporación.</p>
            </div>
            <div className="flex gap-3">
               <Badge variant="silver" className="px-4 py-2 font-[600]">{ALL_ASPIRANTES.length} TOTAL</Badge>
            </div>
          </div>
        </header>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
           <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-soft" size={18} />
              <Input 
                placeholder="Buscar por nombre, especialidad o ciudad..." 
                className="pl-12 bg-white border-black/5 rounded-pill"
              />
           </div>
           <Button variant="secondary" className="gap-2 rounded-pill px-6">
             <Filter size={18} /> Filtrar Etapa
           </Button>
        </div>

        {/* Aspirantes List Table */}
        <Card variant="default" className="p-0 overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-silver-light/30 border-b border-black/5">
                       <th className="px-8 py-4 text-[10px] font-[600] text-gray-soft uppercase tracking-widest">Aspirante</th>
                       <th className="px-8 py-4 text-[10px] font-[600] text-gray-soft uppercase tracking-widest">Especialidad</th>
                       <th className="px-8 py-4 text-[10px] font-[600] text-gray-soft uppercase tracking-widest">Etapa</th>
                       <th className="px-8 py-4 text-[10px] font-[600] text-gray-soft uppercase tracking-widest">Fecha Ingreso</th>
                       <th className="px-8 py-4 text-[10px] font-[600] text-gray-soft uppercase tracking-widest text-right">Acciones</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-black/5">
                    {ALL_ASPIRANTES.map((p) => (
                      <tr key={p.id} className="hover:bg-silver-light/10 transition-colors group">
                         <td className="px-8 py-6">
                            <Link href={`/admin/proveedores/onboarding/aspirantes/${p.id}`} className="flex items-center gap-4">
                               <Avatar name={p.name} size="sm" />
                               <div>
                                  <p className="text-sm font-[600] text-black-rich group-hover:text-primary transition-colors">{p.name}</p>
                                  <p className="text-[10px] text-gray-soft">{p.city}</p>
                               </div>
                            </Link>
                         </td>
                         <td className="px-8 py-6 text-sm text-black-rich/60">{p.specialty}</td>
                         <td className="px-8 py-6">
                            <Badge variant="silver" className="uppercase text-[9px]">{p.stage}</Badge>
                         </td>
                         <td className="px-8 py-6 text-sm text-gray-soft">{p.date}</td>
                         <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-2">
                               <Link href={`/admin/proveedores/onboarding/aspirantes/${p.id}`}>
                                 <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-pill hover:bg-primary/10 hover:text-primary transition-colors">
                                    <ChevronRight size={18} />
                                 </Button>
                               </Link>
                               <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-pill hover:bg-silver-light/50 transition-colors">
                                  <MoreVertical size={16} />
                               </Button>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </Card>
      </div>
    </main>
  );
}
