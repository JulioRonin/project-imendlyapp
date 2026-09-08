"use client";

import React, { useState, useEffect } from 'react';
import {
  Search, ChevronRight, ArrowLeft, Calendar,
  CheckCircle2, Clock, AlertCircle, Star,
  Edit3, Camera, MapPin, Handshake, PenTool, ClipboardList
} from 'lucide-react';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { supabase } from '../../../lib/supabase';

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

const EYEBROW = 'text-[10px] font-bold uppercase tracking-[0.18em]';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'>('all');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('orders')
          .select('*, clients:users!orders_client_id_fkey(full_name, avatar_url)')
          .eq('provider_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching provider orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o => {
      if (activeTab === 'all') return true;
      return o.status === activeTab;
  });

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const inProgressCount = orders.filter(o => o.status === 'in_progress' || o.status === 'scheduled').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;
  const cancelledCount = orders.filter(o => o.status === 'cancelled').length;

  const renderStatusBadge = (status: string) => {
      const base = 'inline-flex items-center h-8 px-3.5 rounded-full text-[12px] font-semibold whitespace-nowrap';
      switch (status) {
          case 'pending':
              return <span className={`${base} bg-primary-light text-primary`}>Por confirmar</span>;
          case 'scheduled':
          case 'in_progress':
              return <span className={`${base} bg-primary-light text-primary`}>En progreso</span>;
          case 'completed':
              return <span className={`${base} bg-sage-light text-sage`}>Completado</span>;
          case 'cancelled':
              return <span className={`${base} bg-sand text-muted`}>Cancelado</span>;
          default:
              return null;
      }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Error al actualizar el estado de la orden');
    }
  };

  if (loading) return (
    <div className="flex-1 bg-linen px-6 md:px-12 pt-10">
        <div className="max-w-5xl mx-auto space-y-4">
            <div className="h-10 w-56 rounded-full v2-shimmer" />
            <div className="h-5 w-80 rounded-full v2-shimmer" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                {[0, 1, 2, 3].map(i => <div key={i} className="h-28 rounded-[1.75rem] v2-shimmer" />)}
            </div>
            <div className="space-y-3 pt-6">
                {[0, 1, 2].map(i => <div key={i} className="h-24 rounded-[1.75rem] v2-shimmer" />)}
            </div>
        </div>
    </div>
  );

  const TABS = [
    { id: 'all', label: 'Todas' },
    { id: 'pending', label: 'Por confirmar' },
    { id: 'in_progress', label: 'En progreso' },
    { id: 'completed', label: 'Completadas' },
    { id: 'cancelled', label: 'Canceladas' },
  ] as const;

  const COUNTERS = [
    { id: 'pending', label: 'Por confirmar', value: pendingCount, icon: Clock },
    { id: 'in_progress', label: 'En progreso', value: inProgressCount, icon: PenTool },
    { id: 'completed', label: 'Completadas', value: completedCount, icon: CheckCircle2 },
    { id: 'cancelled', label: 'Canceladas', value: cancelledCount, icon: AlertCircle },
  ] as const;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-linen">
      <main className="flex-1 overflow-y-auto px-6 md:px-12 pb-20">
        <div className="max-w-5xl mx-auto">
        {!selectedOrder ? (
            <>
                {/* ── Cabecera editorial ── */}
                <header className="pt-10 md:pt-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <p className={`v3-blur-in ${EYEBROW} text-primary`}>Historial</p>
                        <h1 className="v3-blur-in text-[34px] md:text-[44px] font-semibold tracking-tight leading-[1.02] text-ink mt-2" style={{ animationDelay: '100ms' }}>
                            Tus órdenes
                        </h1>
                        <p className="v3-blur-in mt-2 text-[14px] font-medium text-muted" style={{ animationDelay: '200ms' }}>
                            Consulta y gestiona los trabajos que has recibido
                        </p>
                    </div>
                    <div className="v3-blur-in flex items-center gap-3 h-12 px-5 rounded-full bg-cream v2-shadow-soft w-full md:w-72" style={{ animationDelay: '300ms' }}>
                        <Search size={17} className="shrink-0 text-faint" />
                        <input type="text" placeholder="Buscar orden o cliente" className="w-full bg-transparent text-[14px] font-semibold text-ink placeholder:text-faint placeholder:font-medium outline-none" />
                    </div>
                </header>

                {/* ── Contadores ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-9">
                    {COUNTERS.map((c, i) => {
                        const active = activeTab === c.id;
                        const Icon = c.icon;
                        return (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => setActiveTab(c.id)}
                                className={`v2-rise v2-d${i + 1} text-left p-5 rounded-[1.75rem] v2-press v2-float transition-colors duration-300 ${
                                    active ? 'bg-ink text-white' : 'bg-cream text-ink v2-shadow-soft'
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <span className={`w-10 h-10 rounded-[0.9rem] flex items-center justify-center ${active ? 'bg-white/10 text-primary' : 'bg-primary-light text-primary'}`}>
                                        <Icon size={17} />
                                    </span>
                                    <span className="text-[30px] font-bold tabular-nums tracking-tight leading-none">{c.value}</span>
                                </div>
                                <p className={`mt-4 text-[12.5px] font-semibold ${active ? 'text-white/70' : 'text-muted'}`}>{c.label}</p>
                            </button>
                        );
                    })}
                </div>

                {/* ── Tabs subrayadas ── */}
                <div className="v3-blur-in mt-9 -mx-6 md:mx-0 px-6 md:px-0 flex gap-7 overflow-x-auto no-scrollbar" style={{ animationDelay: '400ms' }}>
                    {TABS.map((tab) => {
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`relative shrink-0 pb-3 text-[14px] transition-colors duration-300 ${active ? 'font-semibold text-ink' : 'font-medium text-faint hover:text-muted'}`}
                            >
                                {tab.label}
                                <span className={`absolute left-0 right-0 -bottom-px h-[3px] rounded-full bg-primary transition-transform duration-500 origin-left ${active ? 'scale-x-100' : 'scale-x-0'}`} />
                            </button>
                        );
                    })}
                </div>

                {/* ── Lista de órdenes ── */}
                <div className="mt-6 space-y-3">
                    {filteredOrders.length === 0 ? (
                        <div className="v2-rise bg-cream rounded-[2.25rem] px-8 py-14 flex flex-col items-center text-center v2-shadow-soft">
                            <span className="w-16 h-16 rounded-[1.4rem] bg-primary-light text-primary flex items-center justify-center mb-5">
                                <ClipboardList size={26} />
                            </span>
                            <h3 className="text-[19px] font-semibold tracking-tight text-ink">Sin órdenes aquí</h3>
                            <p className="mt-1.5 text-[13.5px] font-medium text-muted max-w-xs">No hay órdenes en esta categoría todavía. Cuando un cliente te contrate, aparecerá en esta lista.</p>
                            <button type="button" onClick={() => setActiveTab('all')} className="mt-6 h-12 px-6 rounded-full bg-ink text-white text-[13px] font-bold v2-press">
                                Ver todas
                            </button>
                        </div>
                    ) : filteredOrders.map((order, i) => {
                        const client = order.clients;
                        const amount = `$${order.total_amount.toLocaleString('es-MX')}`;
                        const date = new Date(order.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });

                        return (
                            <article
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className={`v2-rise v2-d${Math.min(i + 1, 8)} group bg-cream rounded-[1.75rem] p-4 md:p-5 v2-shadow-soft v2-press v2-float cursor-pointer`}
                            >
                                <div className="flex items-center gap-4">
                                    <Avatar size="md" name={client.full_name} src={client.avatar_url} className="shrink-0 ring-4 ring-white" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[15px] font-semibold tracking-tight text-ink truncate">{order.service_requested}</p>
                                        <p className="text-[12.5px] font-medium text-muted truncate mt-0.5">
                                            {client.full_name} · <span className="text-faint">{order.display_id}</span>
                                        </p>
                                        <p className="md:hidden mt-1.5 text-[12px] font-medium text-muted flex items-center gap-1.5">
                                            <Calendar size={12} className="text-faint" /> {date}
                                        </p>
                                    </div>

                                    <div className="hidden md:flex items-center gap-1.5 text-[12.5px] font-medium text-muted w-32 shrink-0">
                                        <Calendar size={13} className="text-faint" />
                                        {date}
                                    </div>

                                    <div className="hidden md:block w-24 shrink-0">
                                        {renderStatusBadge(order.status)}
                                    </div>

                                    <div className="hidden md:flex items-center gap-1 text-[13px] font-bold text-ink tabular-nums w-14 shrink-0">
                                        {order.rating ? (
                                            <>
                                                <Star size={13} className="text-primary fill-primary" />
                                                {order.rating}
                                            </>
                                        ) : (
                                            <span className="text-faint font-medium">—</span>
                                        )}
                                    </div>

                                    <div className="text-right shrink-0">
                                        <p className="text-[19px] md:text-[21px] font-bold tabular-nums tracking-tight text-ink leading-none">{amount}</p>
                                        <div className="md:hidden mt-2 flex justify-end">{renderStatusBadge(order.status)}</div>
                                    </div>

                                    <span className="hidden md:flex w-10 h-10 shrink-0 rounded-full bg-sand text-ink items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight size={16} />
                                    </span>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </>
        ) : (
            /* ── Detalle de la orden ── */
            <div className="pt-8 md:pt-10 max-w-3xl mx-auto space-y-5">
                <button
                    onClick={() => setSelectedOrder(null)}
                    className="v3-blur-in flex items-center gap-3 text-[13px] font-semibold text-muted hover:text-ink transition-colors"
                >
                    <span className="w-12 h-12 rounded-full bg-cream v2-shadow-soft flex items-center justify-center text-ink v2-press">
                        <ArrowLeft size={18} />
                    </span>
                    Volver a órdenes
                </button>

                <section className="v2-scale bg-cream rounded-[2.5rem] p-6 md:p-8 v2-shadow-soft">
                    {/* Encabezado */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex items-center gap-5 min-w-0">
                            <Avatar size="lg" name={selectedOrder.clients.full_name} src={selectedOrder.clients.avatar_url} className="shrink-0 ring-4 ring-white" />
                            <div className="min-w-0">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className={`${EYEBROW} text-primary`}>{selectedOrder.display_id}</span>
                                    {renderStatusBadge(selectedOrder.status)}
                                </div>
                                <h2 className="mt-1.5 text-[24px] md:text-[28px] font-semibold tracking-tight leading-tight text-ink">{selectedOrder.service_requested}</h2>
                                <p className="mt-1.5 text-[13px] font-medium text-muted flex items-center gap-2 flex-wrap">
                                    {selectedOrder.clients.full_name} · {new Date(selectedOrder.created_at).toLocaleDateString('es-MX')}
                                    <span className="inline-flex items-center gap-1"><MapPin size={12} className="text-primary" /> {selectedOrder.address}</span>
                                </p>
                            </div>
                        </div>
                        <div className="shrink-0 md:text-right bg-sand rounded-[1.5rem] px-6 py-4">
                            <p className={`${EYEBROW} text-muted`}>Total acordado</p>
                            <p className="mt-1 text-[32px] font-bold tabular-nums tracking-tight text-ink leading-none">${selectedOrder.total_amount.toLocaleString('es-MX')}</p>
                        </div>
                    </div>

                    {/* Línea de tiempo */}
                    <div className="mt-8 bg-linen rounded-[1.75rem] p-6">
                        <p className={`${EYEBROW} text-muted mb-6`}>Avance de la orden</p>
                        <div className="relative flex items-start justify-between">
                            <div className="absolute top-3 left-4 right-4 h-[3px] bg-sand rounded-full" />
                            <div className={`absolute top-3 left-4 h-[3px] rounded-full transition-all duration-1000 ${
                                selectedOrder.status === 'cancelled' ? 'bg-faint' : 'bg-primary'
                            } ${
                                selectedOrder.status === 'pending' ? 'w-[10%]' :
                                selectedOrder.status === 'scheduled' ? 'w-[45%]' :
                                selectedOrder.status === 'in_progress' ? 'w-[70%]' :
                                'right-4'
                            }`} />

                            {[
                                { label: 'Solicitud', active: true },
                                { label: 'Confirmación', active: selectedOrder.status !== 'pending' },
                                { label: 'En progreso', active: selectedOrder.status === 'in_progress' || selectedOrder.status === 'completed' },
                                { label: 'Finalización', active: selectedOrder.status === 'completed' || selectedOrder.status === 'cancelled' }
                            ].map((step, idx) => (
                                <div key={idx} className="relative z-10 flex flex-col items-center gap-2.5 w-20">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-linen transition-colors ${
                                        step.active ? (selectedOrder.status === 'cancelled' ? 'bg-faint text-white' : 'bg-primary text-white') : 'bg-sand'
                                    }`}>
                                        {step.active ? <CheckCircle2 size={13} /> : <span className="w-1.5 h-1.5 rounded-full bg-faint" />}
                                    </span>
                                    <span className={`text-[11.5px] font-semibold text-center ${step.active ? 'text-ink' : 'text-faint'}`}>{step.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Acciones contextuales */}
                    <div className="mt-6 space-y-4">
                        {selectedOrder.status === 'pending_confirmation' && (
                            <div className="relative overflow-hidden bg-ink rounded-[2rem] p-7 md:p-8 text-white">
                                <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
                                <div className="relative">
                                    <p className={`${EYEBROW} text-primary`}>Requiere tu confirmación</p>
                                    <h4 className="mt-2 text-[21px] font-semibold tracking-tight leading-tight">Revisa y acepta la orden</h4>
                                    <p className="mt-2 text-[13.5px] font-medium text-white/60 max-w-lg">Revisa los detalles y la dirección antes de aceptar. Puedes sugerir otro horario o aceptar tal como se solicitó.</p>
                                    <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                        <button type="button" className="h-14 px-6 rounded-full bg-white/10 text-white text-[13px] font-bold v2-press hover:bg-white/15 transition-colors">
                                            Contraofertar horario
                                        </button>
                                        <button
                                            type="button"
                                            className="h-14 px-8 rounded-full bg-primary text-white text-[13px] font-bold v2-press hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
                                            onClick={() => updateOrderStatus(selectedOrder.id, 'scheduled')}
                                        >
                                            Aceptar servicio
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {(selectedOrder.status === 'in_progress' || selectedOrder.status === 'pending_client_approval') && (
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-linen rounded-[1.75rem] p-6 flex flex-col">
                                    <span className="w-12 h-12 rounded-[1rem] bg-primary-light text-primary flex items-center justify-center mb-4">
                                        <Edit3 size={19} />
                                    </span>
                                    <h4 className="text-[16px] font-semibold tracking-tight text-ink">Ajustar costo o alcance</h4>
                                    <p className="mt-1.5 text-[13px] font-medium text-muted leading-relaxed mb-6">Si al revisar notas que se requiere más trabajo, recalcula el costo. El cliente deberá aceptarlo antes de continuar.</p>
                                    <button type="button" className="mt-auto h-12 rounded-full bg-cream text-ink text-[13px] font-bold v2-press v2-shadow-soft">
                                        Crear ajuste
                                    </button>
                                </div>

                                <div className="bg-linen rounded-[1.75rem] p-6 flex flex-col">
                                    <span className="w-12 h-12 rounded-[1rem] bg-primary-light text-primary flex items-center justify-center mb-4">
                                        <Camera size={19} />
                                    </span>
                                    <h4 className="text-[16px] font-semibold tracking-tight text-ink">Entregar servicio</h4>
                                    <p className="mt-1.5 text-[13px] font-medium text-muted leading-relaxed mb-6">Sube evidencia del trabajo terminado para que el cliente libere los fondos a tu cuenta.</p>
                                    <button
                                        type="button"
                                        className="mt-auto h-12 rounded-full bg-ink text-white text-[13px] font-bold v2-press"
                                        onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                                    >
                                        Marcar completado
                                    </button>
                                </div>
                            </div>
                        )}

                        {selectedOrder.status === 'completed' && (
                            <div className="bg-sage-light rounded-[1.75rem] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <span className="w-12 h-12 shrink-0 rounded-[1rem] bg-white text-sage flex items-center justify-center">
                                        <Handshake size={20} />
                                    </span>
                                    <div>
                                        <p className="text-[15px] font-semibold tracking-tight text-ink">Trabajo finalizado y pagado</p>
                                        <p className="text-[12.5px] font-medium text-muted mt-0.5">Fondos liberados y listos para cobro.</p>
                                    </div>
                                </div>
                                <button type="button" className="h-11 px-5 rounded-full bg-white text-ink text-[12.5px] font-bold v2-press shrink-0">
                                    Ver recibo
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        )}
        </div>
      </main>
    </div>
  );
}
