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
import { Edit3, Camera, MapPin, Handshake, PenTool } from 'lucide-react';

const ORDERS = [
  {
    id: 'ORD-9905',
    client: 'Carlos Rivera',
    service: 'Instalación Eléctrica',
    date: '26 Mar, 2026',
    amount: '$1,500.00',
    status: 'pending_confirmation',
    rating: null,
    image: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'ORD-9904',
    client: 'Ana Gómez',
    service: 'Pintura Interior',
    date: '25 Mar, 2026',
    amount: '$3,200.00',
    status: 'in_progress',
    rating: null,
    image: 'https://images.unsplash.com/photo-1546213290-e1b492ab3eee?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'ORD-9901',
    client: 'Marisa Velasco',
    service: 'Limpieza Express',
    date: '24 Mar, 2026',
    amount: '$450.00',
    status: 'completed',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1533109721025-d1ae2ee5c9fe?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'ORD-9882',
    client: 'Juan Armenda',
    service: 'Plomería Emergencia',
    date: '22 Mar, 2026',
    amount: '$1,200.00',
    status: 'completed',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1510443105220-5c62df56881c?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'ORD-9875',
    client: 'Karla Sanchez',
    service: 'Reparación Lavadora',
    date: '20 Mar, 2026',
    amount: '$890.00',
    status: 'cancelled',
    rating: null,
    image: 'https://images.unsplash.com/photo-1510443105220-5c62df56881c?auto=format&fit=crop&q=80&w=100'
  }
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending_confirmation' | 'in_progress' | 'completed' | 'cancelled'>('all');
  const [selectedOrder, setSelectedOrder] = useState<typeof ORDERS[0] | null>(null);

  const filteredOrders = ORDERS.filter(o => {
      if (activeTab === 'all') return true;
      if (activeTab === 'in_progress') return o.status === 'in_progress' || o.status === 'pending_client_approval';
      return o.status === activeTab;
  });

  const pendingCount = ORDERS.filter(o => o.status === 'pending_confirmation').length;
  const inProgressCount = ORDERS.filter(o => o.status === 'in_progress' || o.status === 'pending_client_approval').length;
  const completedCount = ORDERS.filter(o => o.status === 'completed').length;
  const cancelledCount = ORDERS.filter(o => o.status === 'cancelled').length;

  const renderStatusBadge = (status: string) => {
      switch (status) {
          case 'pending_confirmation':
              return <Badge variant="warning" className="text-[9px] font-black px-3 py-1 uppercase tracking-widest bg-amber-500 text-white">Por Confirmar</Badge>;
          case 'in_progress':
          case 'pending_client_approval':
              return <Badge variant="default" className="text-[9px] font-black px-3 py-1 uppercase tracking-widest bg-blue-500 text-white border-blue-500">En Progreso</Badge>;
          case 'completed':
              return <Badge variant="success" className="text-[9px] font-black px-3 py-1 uppercase tracking-widest bg-emerald-500 text-white">Completado</Badge>;
          case 'cancelled':
              return <Badge variant="error" className="text-[9px] font-black px-3 py-1 uppercase tracking-widest bg-slate-400 text-white">Cancelado</Badge>;
          default:
              return null;
      }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8F9FB]">
      {/* Header */}
      <header className="h-24 px-10 border-b border-slate-100 bg-white flex items-center justify-between sticky top-0 z-10 shrink-0">
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
      <main className="flex-1 p-10 overflow-y-auto space-y-8 custom-scrollbar relative">
        {!selectedOrder ? (
            <>
                {/* Scoreboards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in duration-300">
                    <div onClick={() => setActiveTab('pending_confirmation')} className={`p-6 rounded-[2rem] cursor-pointer transition-all border ${activeTab === 'pending_confirmation' ? 'bg-amber-500 text-white border-amber-500 shadow-xl shadow-amber-500/20' : 'bg-white hover:border-amber-500 border-slate-100'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <Clock size={20} className={activeTab === 'pending_confirmation' ? 'text-white' : 'text-amber-500'} />
                            <span className="text-3xl font-black tracking-tighter">{pendingCount}</span>
                        </div>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'pending_confirmation' ? 'text-white/80' : 'text-slate-400'}`}>Por Confirmar</p>
                    </div>

                    <div onClick={() => setActiveTab('in_progress')} className={`p-6 rounded-[2rem] cursor-pointer transition-all border ${activeTab === 'in_progress' ? 'bg-blue-500 text-white border-blue-500 shadow-xl shadow-blue-500/20' : 'bg-white hover:border-blue-500 border-slate-100'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <PenTool size={20} className={activeTab === 'in_progress' ? 'text-white' : 'text-blue-500'} />
                            <span className="text-3xl font-black tracking-tighter">{inProgressCount}</span>
                        </div>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'in_progress' ? 'text-white/80' : 'text-slate-400'}`}>En Progreso</p>
                    </div>

                    <div onClick={() => setActiveTab('completed')} className={`p-6 rounded-[2rem] cursor-pointer transition-all border ${activeTab === 'completed' ? 'bg-emerald-500 text-white border-emerald-500 shadow-xl shadow-emerald-500/20' : 'bg-white hover:border-emerald-500 border-slate-100'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <CheckCircle2 size={20} className={activeTab === 'completed' ? 'text-white' : 'text-emerald-500'} />
                            <span className="text-3xl font-black tracking-tighter">{completedCount}</span>
                        </div>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'completed' ? 'text-white/80' : 'text-slate-400'}`}>Completadas</p>
                    </div>

                    <div onClick={() => setActiveTab('cancelled')} className={`p-6 rounded-[2rem] cursor-pointer transition-all border ${activeTab === 'cancelled' ? 'bg-slate-800 text-white border-slate-800 shadow-xl shadow-slate-800/20' : 'bg-white hover:border-slate-800 border-slate-100'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <AlertCircle size={20} className={activeTab === 'cancelled' ? 'text-white' : 'text-slate-800'} />
                            <span className="text-3xl font-black tracking-tighter">{cancelledCount}</span>
                        </div>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'cancelled' ? 'text-white/80' : 'text-slate-400'}`}>Canceladas</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-slate-100 pb-2">
                    {(['all', 'pending_confirmation', 'in_progress', 'completed', 'cancelled'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-[11px] font-black uppercase tracking-widest pb-3 transition-all relative ${
                                activeTab === tab ? 'text-brand-night' : 'text-slate-300 hover:text-slate-400'
                            }`}
                        >
                            {tab === 'all' ? 'Todas' : tab === 'pending_confirmation' ? 'Por Confirmar' : tab === 'in_progress' ? 'En Progreso' : tab === 'completed' ? 'Completadas' : 'Canceladas'}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-1 right-1 h-1 bg-primary rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Orders Table/List */}
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="grid grid-cols-6 px-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">
                        <div className="col-span-2">Cliente & Servicio</div>
                        <div>Fecha</div>
                        <div>Importe</div>
                        <div>Estatus</div>
                        <div className="text-right">Calificación</div>
                    </div>

                    <div className="space-y-3">
                        {filteredOrders.length === 0 ? (
                            <div className="bg-white p-12 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
                                <Search size={32} className="text-slate-200 mb-4" />
                                <p className="text-sm font-black text-brand-night uppercase tracking-tight">Sin Resultados</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">No hay órdenes en esta categoría.</p>
                            </div>
                        ) : filteredOrders.map((order) => (
                            <div 
                                key={order.id} 
                                onClick={() => setSelectedOrder(order)}
                                className="bg-white p-4 px-8 rounded-[1.5rem] border border-slate-100/60 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/20 transition-all group cursor-pointer"
                            >
                                <div className="grid grid-cols-6 items-center">
                                    <div className="col-span-2 flex items-center gap-4">
                                        <div className="relative">
                                            <Avatar size="md" name={order.client} className="rounded-[1rem]" />
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                {order.status === 'completed' ? <CheckCircle2 size={10} className="text-emerald-500" /> : <Clock size={10} className="text-amber-500" />}
                                            </div>
                                        </div>
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
                                        {renderStatusBadge(order.status)}
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
                            </div>
                        ))}
                    </div>
                </div>
            </>
        ) : (
            /* Detailed Order View */
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 max-w-4xl mx-auto space-y-6">
                <button 
                    onClick={() => setSelectedOrder(null)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-night transition-colors mb-2"
                >
                    <span className="rotate-180"><ChevronRight size={14} /></span>
                    Volver a Historial
                </button>

                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    {/* Header Detail */}
                    <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-6">
                            <Avatar size="lg" name={selectedOrder.client} className="rounded-[1.5rem] w-20 h-20 shadow-inner" />
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedOrder.id}</span>
                                    {renderStatusBadge(selectedOrder.status)}
                                </div>
                                <h2 className="text-2xl font-black text-brand-night tracking-tight uppercase">{selectedOrder.service}</h2>
                                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-tight flex items-center gap-2 mt-1">
                                    {selectedOrder.client} • {selectedOrder.date} 
                                    <MapPin size={12} className="ml-2 text-primary" /> 
                                    Domicilio del cliente
                                </p>
                            </div>
                        </div>
                        <div className="text-right bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Total Acordado</p>
                            <p className="text-3xl font-black italic text-brand-night">{selectedOrder.amount}</p>
                        </div>
                    </div>

                    {/* Interactive Roadmap */}
                    <div className="bg-slate-50 p-8 rounded-[1.5rem] border border-slate-100 mb-8 relative">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Roadmap de la Orden</h3>
                        <div className="flex items-center justify-between relative mt-4">
                            <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-200 -translate-y-1/2 z-0 rounded-full"></div>
                            <div className={`absolute top-1/2 left-0 h-1.5 bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-1000 ${
                                selectedOrder.status === 'pending_confirmation' ? 'w-[10%]' : 
                                selectedOrder.status === 'in_progress' ? 'w-[50%]' : 
                                selectedOrder.status === 'pending_client_approval' ? 'w-[50%]' : 
                                selectedOrder.status === 'completed' ? 'w-full' : 'w-full bg-slate-400'
                            }`}></div>
                            
                            {[
                                { label: 'Solicitud', active: true },
                                { label: 'Confirmación', active: selectedOrder.status !== 'pending_confirmation' },
                                { label: selectedOrder.status === 'pending_client_approval' ? 'Revisión Costos' : 'En Progreso', active: selectedOrder.status === 'in_progress' || selectedOrder.status === 'pending_client_approval' || selectedOrder.status === 'completed' },
                                { label: 'Finalización', active: selectedOrder.status === 'completed' || selectedOrder.status === 'cancelled' }
                            ].map((step, idx) => (
                                <div key={idx} className="relative z-10 flex flex-col items-center gap-3">
                                    <div className={`w-10 h-10 rounded-[1rem] flex items-center justify-center border-4 border-slate-50 text-white shadow-sm transition-colors ${
                                        step.active ? (selectedOrder.status === 'cancelled' ? 'bg-slate-400' : 'bg-primary') : 'bg-slate-300'
                                    }`}>
                                        {step.active ? <CheckCircle2 size={16} /> : <div className="w-2.5 h-2.5 rounded-full bg-white/50" />}
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${
                                        step.active ? 'text-brand-night' : 'text-slate-400'
                                    }`}>{step.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contextual Action Areas */}
                    <div className="space-y-6">
                        {selectedOrder.status === 'pending_confirmation' && (
                            <div className="bg-brand-night p-8 rounded-[1.5rem] text-center shadow-xl shadow-brand-night/10">
                                <h4 className="text-[14px] font-black uppercase tracking-widest text-white mb-2">Orden Requiere Confirmación</h4>
                                <p className="text-[11px] font-medium text-white/60 mb-8 max-w-lg mx-auto">Revisa los detalles y la dirección antes de aceptar. Puedes sugerir un cambio de horario o aceptar tal como se solicitó.</p>
                                <div className="flex items-center justify-center gap-4">
                                    <Button variant="outline" className="h-12 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/5 border-white/10 text-white hover:bg-white hover:text-brand-night transition-colors">
                                        Contra Ofertar Horario
                                    </Button>
                                    <Button variant="primary" className="h-12 px-10 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary hover:bg-emerald-500 border-none">
                                        Aceptar Servicio Ahora
                                    </Button>
                                </div>
                            </div>
                        )}

                        {(selectedOrder.status === 'in_progress' || selectedOrder.status === 'pending_client_approval') && (
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-blue-50 border border-blue-100 p-6 rounded-[1.5rem] flex flex-col items-start hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                                        <Edit3 size={18} />
                                    </div>
                                    <h4 className="text-[12px] font-black uppercase tracking-widest text-brand-night mb-2">Modificar Costo Acordado / Servicio</h4>
                                    <p className="text-[10px] font-bold text-slate-500 leading-relaxed mb-6">Si durante la revisión física notas que se requiere más trabajo, puedes recalcular el costo. El cliente deberá aceptar antes de continuar.</p>
                                    <Button variant="outline" className="w-full mt-auto h-11 text-[10px] font-black uppercase tracking-widest border-blue-200 text-blue-600 bg-white hover:bg-blue-600 hover:text-white transition-colors">
                                        Crear Ajuste
                                    </Button>
                                </div>

                                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[1.5rem] flex flex-col items-start hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                                        <Camera size={18} />
                                    </div>
                                    <h4 className="text-[12px] font-black uppercase tracking-widest text-brand-night mb-2">Entregar Servicio</h4>
                                    <p className="text-[10px] font-bold text-slate-500 leading-relaxed mb-6">Sube evidencia del trabajo completado para que el cliente pueda liberar los fondos a tu cuenta.</p>
                                    <Button variant="primary" className="w-full mt-auto h-11 text-[10px] font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 border-none shadow-lg shadow-emerald-500/20">
                                        Subir Evidencias y Finalizar
                                    </Button>
                                </div>
                            </div>
                        )}

                        {selectedOrder.status === 'completed' && (
                            <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                                        <Handshake size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-black uppercase tracking-widest text-brand-night">Trabajo Finalizado y Pagado</p>
                                        <p className="text-[10px] font-bold text-slate-500 mt-1">Fondos liberados y listos para cobro.</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 hover:bg-white hover:text-brand-night transition-colors">
                                    Ver Recibo
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}
