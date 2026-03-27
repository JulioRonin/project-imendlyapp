"use client";

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Star
} from 'lucide-react';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Avatar } from '@i-mendly/shared/components/Avatar';

const ORDERS = [
  {
    id: 'ORD-9901',
    client: 'Marisa Velasco',
    service: 'Limpieza Express',
    date: '24 Mar, 2026',
    amount: '$450.00',
    status: 'completed',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'ORD-9882',
    client: 'Juan Armenda',
    service: 'Plomería Emergencia',
    date: '22 Mar, 2026',
    amount: '$1,200.00',
    status: 'completed',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1546213290-e1b492ab3eee?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'ORD-9875',
    client: 'Karla Sanchez',
    service: 'Reparación Lavadora',
    date: '20 Mar, 2026',
    amount: '$890.00',
    status: 'cancelled',
    rating: null,
    image: 'https://images.unsplash.com/photo-1533109721025-d1ae2ee5c9fe?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'ORD-9850',
    client: 'Sofia Loren',
    service: 'Limpieza Profunda',
    date: '18 Mar, 2026',
    amount: '$2,100.00',
    status: 'completed',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1510443105220-5c62df56881c?auto=format&fit=crop&q=80&w=100'
  }
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'cancelled'>('all');

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8F9FB]">
      {/* Header */}
      <header className="h-24 px-10 border-b border-slate-100 bg-white flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-black text-brand-night tracking-tight uppercase">Historial de Órdenes</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Consulta y gestiona tus trabajos pasados</p>
        </div>

        <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 w-64 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Search size={18} className="text-slate-400 mr-2" />
                <input type="text" placeholder="Buscar orden o cliente..." className="bg-transparent border-none text-[11px] font-bold uppercase tracking-tight outline-none w-full placeholder:text-slate-300" />
            </div>
            <Button variant="outline" className="rounded-xl h-11 px-4 flex items-center gap-2 border-slate-200">
                <Filter size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Filtros</span>
            </Button>
            <Button variant="outline" className="rounded-xl h-11 px-4 flex items-center gap-2 border-slate-200">
                <Download size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Exportar</span>
            </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto space-y-8">
        {/* Tabs */}
        <div className="flex gap-8 border-b border-slate-100 pb-2">
            {(['all', 'completed', 'cancelled'] as const).map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-[11px] font-black uppercase tracking-widest pb-3 transition-all relative ${
                        activeTab === tab ? 'text-brand-night' : 'text-slate-300 hover:text-slate-400'
                    }`}
                >
                    {tab === 'all' ? 'Todas' : tab === 'completed' ? 'Completadas' : 'Canceladas'}
                    {activeTab === tab && (
                        <div className="absolute bottom-0 left-1 right-1 h-1 bg-primary rounded-full" />
                    )}
                </button>
            ))}
        </div>

        {/* Orders Table/List */}
        <div className="space-y-4">
            <div className="grid grid-cols-6 px-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                <div className="col-span-2">Cliente & Servicio</div>
                <div>Fecha</div>
                <div>Importe</div>
                <div>Estatus</div>
                <div className="text-right">Calificación</div>
            </div>

            <div className="space-y-3">
                {ORDERS.map((order) => (
                    <Card 
                        key={order.id} 
                        className="p-4 px-8 rounded-[1.5rem] border-slate-50 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/20 transition-all group cursor-pointer"
                    >
                        <div className="grid grid-cols-6 items-center">
                            <div className="col-span-2 flex items-center gap-4">
                                <Avatar size="md" name={order.client} className="rounded-[1rem]" />
                                <div>
                                    <p className="text-[14px] font-black text-brand-night leading-tight mb-0.5">{order.client}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{order.service} • {order.id}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                <Calendar size={14} className="text-slate-300" />
                                {order.date}
                            </div>

                            <div className="text-[14px] font-black text-brand-night italic">
                                {order.amount}
                            </div>

                            <div>
                                <Badge 
                                    variant={order.status === 'completed' ? 'success' : 'default'} 
                                    className="text-[9px] font-black px-3 py-1 uppercase tracking-widest"
                                >
                                    {order.status === 'completed' ? 'Finalizado' : 'Cancelado'}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-end gap-1 text-[12px] font-black text-brand-night">
                                {order.rating ? (
                                    <>
                                        <Star size={14} fill="currentColor" className="text-amber-400" />
                                        {order.rating}
                                    </>
                                ) : (
                                    <span className="text-slate-200">—</span>
                                )}
                                <Button variant="ghost" size="sm" className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight size={18} className="text-slate-300" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>

        {/* Load More */}
        <div className="flex justify-center pt-8">
            <Button variant="outline" className="rounded-full px-10 h-12 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-400 hover:text-brand-night">
                Cargar servicios anteriores
            </Button>
        </div>
      </main>
    </div>
  );
}
