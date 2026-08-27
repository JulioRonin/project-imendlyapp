"use client";

import { Avatar } from '@i-mendly/shared/components/Avatar';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ClipboardList, Calendar, ChevronRight, MessageCircle,
} from 'lucide-react';
import Link from 'next/link';
import { usePlatformStore } from '@/store/usePlatformStore';
import { ClientNav } from '@/components/client/ClientNav';
import { SegmentBar } from '@/components/client/ui';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

/** Mapea el status existente al avance del ciclo (4 segmentos). */
const cycleDone = (status: string) => {
  switch (status) {
    case 'PENDING': return 1;
    case 'SCHEDULED':
    case 'ACCEPTED': return 2;
    case 'IN_PROGRESS': return 3;
    case 'COMPLETED':
    case 'PAID': return 4;
    default: return 0; // rechazado / cancelado
  }
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pendiente',
  SCHEDULED: 'Agendado',
  ACCEPTED: 'Aceptado',
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Completado',
  PAID: 'Pagado',
  REJECTED: 'Rechazado',
  CANCELLED: 'Cancelado',
  COUNTER_OFFER: 'Contraoferta',
};

/** Pill semántica de estado. */
const statusPillClass = (status: string) => {
  if (status === 'COMPLETED' || status === 'PAID') return 'bg-[#E9F7EF] text-[#2A9460]';
  if (status === 'REJECTED' || status === 'CANCELLED') return 'bg-red-50 text-red-600';
  if (status === 'PENDING' || status === 'COUNTER_OFFER') return 'bg-amber-50 text-amber-700';
  return 'bg-[#E9F7EF] text-[#2A9460]';
};

export default function OrdersDashboard() {
  const router = useRouter();
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = usePlatformStore(state => state.currentUser);
  const updateOrderStatus = usePlatformStore(state => state.updateOrderStatus);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            display_id,
            service_requested,
            status,
            total_amount,
            scheduled_date,
            provider_id,
            providers (
              users (
                full_name,
                avatar_url
              )
            )
          `)
          .eq('client_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const mappedOrders = data.map((o: any) => ({
            id: o.display_id,
            dbId: o.id,
            serviceName: o.service_requested,
            providerName: o.providers?.users?.full_name || 'Profesional',
            providerAvatar: o.providers?.users?.avatar_url,
            status: o.status.toUpperCase(),
            date: new Date(o.scheduled_date).toLocaleDateString(),
            time: new Date(o.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            price: Number(o.total_amount)
          }));
          setMyOrders(mappedOrders);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = () => {
    router.push('/role-selection');
  };

  const handlePayOrder = (id: string) => {
    updateOrderStatus(id, 'PAID');
    alert("¡Pago simulado exitoso vía Stripe! La orden está en proceso.");
  };

  const handleAcceptCounterOffer = (id: string) => {
    updateOrderStatus(id, 'ACCEPTED');
  };

  return (
    <main className="min-h-screen bg-[#F3F4F1] pb-36">
      {/* ── Header interno v2 ── */}
      <header className="v2-rise sticky top-0 z-50 bg-[#F3F4F1]/85 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link
            href="/cliente"
            aria-label="Volver al inicio"
            className="w-12 h-12 shrink-0 rounded-full bg-white v2-shadow-soft flex items-center justify-center text-[#151714] v2-press"
          >
            <ArrowLeft size={19} />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Tu actividad</p>
            <h1 className="text-[22px] font-semibold tracking-tight text-[#151714] leading-tight">Mis órdenes</h1>
          </div>
          <span className="shrink-0 h-9 px-4 inline-flex items-center rounded-full bg-white v2-shadow-soft text-[12px] font-bold text-[#151714] tabular-nums">
            {myOrders.length} {myOrders.length === 1 ? 'activa' : 'activas'}
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 mt-2">
        {/* ── Cargando ── */}
        {isLoading && (
          <div className="space-y-4">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-40 rounded-[1.75rem] bg-white v2-shimmer" />
            ))}
          </div>
        )}

        {/* ── Estado vacío ── */}
        {!isLoading && myOrders.length === 0 && (
          <div className="v2-rise v2-d1 bg-white rounded-[2.25rem] v2-shadow-soft px-8 py-16 flex flex-col items-center text-center">
            <span className="w-20 h-20 rounded-[1.5rem] bg-[#E9F7EF] text-primary flex items-center justify-center mb-6">
              <ClipboardList size={32} strokeWidth={1.8} />
            </span>
            <h2 className="text-[19px] font-semibold tracking-tight text-[#151714] mb-2">
              Aún no tienes órdenes
            </h2>
            <p className="text-[14px] font-medium text-[#70756E] max-w-xs mb-8">
              Cuando contrates un servicio, aquí verás su avance paso a paso.
            </p>
            <Link
              href="/cliente"
              className="h-14 px-8 inline-flex items-center rounded-full bg-primary text-white text-[13px] font-bold shadow-lg shadow-primary/25 v2-press hover:bg-primary-dark transition-colors"
            >
              Contratar un servicio
            </Link>
          </div>
        )}

        {/* ── Lista de órdenes ── */}
        <section className="space-y-4">
          {myOrders.map((p, i) => (
            <div
              key={p.dbId}
              onClick={() => router.push(`/cliente/ordenes/${p.dbId}`)}
              className={`v2-rise ${i < 8 ? `v2-d${Math.min(i + 1, 8)}` : 'v2-d8'} cursor-pointer`}
            >
              <article className="bg-white rounded-[1.75rem] p-6 v2-shadow-soft v2-press v2-float group">
                {/* Servicio + monto protagonista */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A8ADA6] mb-1 tabular-nums">
                      ORD-{p.id}
                    </p>
                    <h3 className="text-[17px] font-semibold tracking-tight text-[#151714] leading-snug">
                      {p.serviceName}
                    </h3>
                  </div>
                  <p className="shrink-0 text-[24px] font-bold tracking-tight text-[#151714] tabular-nums">
                    ${p.price.toFixed(2)}
                  </p>
                </div>

                {/* Proveedor + fecha */}
                <div className="flex items-center gap-4 mb-5 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar src={p.providerAvatar} name={p.providerName} size="sm" />
                    <span className="text-[13px] font-semibold text-[#70756E] truncate">{p.providerName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#A8ADA6] shrink-0">
                    <Calendar size={13} />
                    <span className="text-[12.5px] font-medium tabular-nums">{p.date} · {p.time}</span>
                  </div>
                </div>

                {/* Contraoferta */}
                {p.status === 'COUNTER_OFFER' && p.counterOffer && (
                  <div className="mb-5 p-5 rounded-[1.25rem] bg-amber-50 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700 mb-1">
                        Sugerencia de nuevo horario
                      </p>
                      <p className="text-[14px] font-semibold text-[#151714] tabular-nums">
                        {p.counterOffer.date} · {p.counterOffer.time}
                      </p>
                      <p className="text-[13px] font-medium text-amber-700/80 mt-1">
                        “{p.counterOffer.message}”
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAcceptCounterOffer(p.id); }}
                      className="shrink-0 h-11 px-5 rounded-full bg-[#151714] text-white text-[12px] font-bold v2-press"
                    >
                      Aceptar horario
                    </button>
                  </div>
                )}

                {/* Ciclo + estado */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <SegmentBar total={4} done={cycleDone(p.status)} />
                  </div>
                  <span className={`shrink-0 inline-flex items-center h-8 px-3.5 rounded-full text-[11px] font-bold ${statusPillClass(p.status)}`}>
                    {STATUS_LABEL[p.status] || p.status}
                  </span>
                </div>

                {/* Acciones */}
                <div className="mt-5 flex items-center gap-3">
                  {p.status === 'ACCEPTED' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePayOrder(p.id); }}
                      className="flex-1 sm:flex-none h-14 px-8 rounded-full bg-[#151714] text-white text-[13px] font-bold v2-press v2-shadow-lift"
                    >
                      Proceder al pago
                    </button>
                  )}
                  <span className="ml-auto flex items-center gap-2">
                    <span className="w-11 h-11 rounded-full bg-[#FAFBF8] text-[#A8ADA6] flex items-center justify-center group-hover:bg-[#E9F7EF] group-hover:text-primary transition-colors">
                      <MessageCircle size={18} />
                    </span>
                    <ChevronRight size={19} className="text-[#A8ADA6] group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </span>
                </div>
              </article>
            </div>
          ))}
        </section>
      </div>

      <ClientNav />
    </main>
  );
}
