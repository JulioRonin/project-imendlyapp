"use client";

import { Logo } from '@i-mendly/shared/Logo';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Button } from '@i-mendly/shared/components/Button';
import { Input } from '@i-mendly/shared/components/Input';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  AlertCircle, 
  BarChart3, 
  UserPlus, 
  TrendingUp, 
  Zap,
  Search,
  Filter,
  ArrowLeft,
  MessageSquare,
  Clock,
  ShieldCheck,
  LogOut,
  Settings
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

const MOCK_DISPUTES = [
  { 
    id: 'DP-0021', 
    title: 'Incumplimiento de Instalación', 
    client: 'Carlos Slim', 
    provider: 'Juan Eléctrico', 
    amount: '$2,400', 
    status: 'Critica', 
    date: '25 Mar, 2026',
    reason: 'El cliente reclama que el tablero no fue terminado.'
  },
  { 
    id: 'DP-0022', 
    title: 'Daño en Propiedad', 
    client: 'Sofía Vergara', 
    provider: 'Limpieza Express', 
    amount: '$850', 
    status: 'Abierta', 
    date: '24 Mar, 2026',
    reason: 'Se reporta una mancha en la alfombra después del servicio.'
  },
  { 
    id: 'DP-0023', 
    title: 'Desacuerdo en Precio Final', 
    client: 'Saul Canelo', 
    provider: 'Plomería Hnos', 
    amount: '$1,200', 
    status: 'En Revision', 
    date: '23 Mar, 2026',
    reason: 'El proveedor agregó costos de material no autorizados.'
  },
];
export default function DisputesPage() {
  const router = useRouter();

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
              <h2 className="text-4xl font-[600] tracking-tight text-black-rich mb-2">Gestión de Disputas</h2>
              <p className="text-gray-soft text-sm">Mediación y resolución de conflictos en el sistema Escrow.</p>
            </div>
            <div className="flex gap-3">
               <Badge variant="error" className="px-4 py-2">3 DISPUTAS ACTIVAS</Badge>
            </div>
          </div>
        </header>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
           <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-soft" size={18} />
              <Input 
                placeholder="Buscar por ID, Cliente o Proveedor..." 
                className="pl-12 bg-white border-black/5 rounded-pill"
              />
           </div>
           <Button variant="secondary" className="gap-2 rounded-pill px-6">
             <Filter size={18} /> Filtros Avanzados
           </Button>
        </div>

        {/* Disputes List */}
        <div className="space-y-4">
           {MOCK_DISPUTES.map((dispute) => (
             <Card key={dispute.id} variant="floating" className="p-0 overflow-hidden hover:border-primary/20 transition-colors group">
                <Link href={`/admin/disputas/${dispute.id}`}>
                  <div className="p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
                     <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                           <Badge variant={dispute.status === 'Critica' ? 'error' : 'silver'} className="uppercase text-[10px]">
                              {dispute.status}
                           </Badge>
                           <span className="text-xs text-gray-soft font-[500]">ID: {dispute.id}</span>
                           <span className="text-xs text-gray-soft flex items-center gap-1"><Clock size={12} /> {dispute.date}</span>
                        </div>
                        <h4 className="text-xl font-[600] text-black-rich mb-2 group-hover:text-primary transition-colors">{dispute.title}</h4>
                        <p className="text-sm text-gray-500 line-clamp-1 italic">"{dispute.reason}"</p>
                     </div>

                     <div className="flex gap-12 items-center">
                        <div className="flex items-center gap-6">
                           <div className="text-center">
                              <p className="text-[10px] text-gray-soft uppercase font-[600] mb-1">Cliente</p>
                              <p className="text-sm font-[600] text-black-rich">{dispute.client}</p>
                           </div>
                           <div className="w-[1px] h-8 bg-black/5" />
                           <div className="text-center">
                              <p className="text-[10px] text-gray-soft uppercase font-[600] mb-1">Proveedor</p>
                              <p className="text-sm font-[600] text-black-rich">{dispute.provider}</p>
                           </div>
                        </div>
                        <div className="text-right min-w-[100px]">
                           <p className="text-[10px] text-gray-soft uppercase font-[600] mb-1">En Escrow</p>
                           <p className="text-lg font-[600] text-black-rich">{dispute.amount}</p>
                        </div>
                        <div className="w-10 h-10 rounded-pill bg-silver-light/30 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                           <ArrowLeft className="rotate-180" size={20} />
                        </div>
                     </div>
                  </div>
                </Link>
             </Card>
           ))}
        </div>

        {/* Analytics Mini-Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
           <Card variant="silver" className="p-6 text-center">
              <ShieldCheck className="mx-auto mb-3 text-primary" size={24} />
              <p className="text-2xl font-[600] text-black-rich">94%</p>
              <p className="text-[10px] text-gray-soft uppercase">Tasa de Resolución</p>
           </Card>
           <Card variant="silver" className="p-6 text-center">
              <MessageSquare className="mx-auto mb-3 text-primary" size={24} />
              <p className="text-2xl font-[600] text-black-rich">1.4d</p>
              <p className="text-[10px] text-gray-soft uppercase">Tiempo Promedio</p>
           </Card>
           <Card variant="silver" className="p-6 text-center">
              <TrendingUp className="mx-auto mb-3 text-primary" size={24} />
              <p className="text-2xl font-[600] text-black-rich">$12,400</p>
              <p className="text-[10px] text-gray-soft uppercase">Recuperado este Mes</p>
           </Card>
        </div>
      </div>
    </main>
  );
}
