"use client";

import { Card } from '@i-mendly/shared/components/Card';
import { Button } from '@i-mendly/shared/components/Button';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Clock, CheckCircle2, 
  MessageCircle, BarChart3, Home, User,
  ChevronRight, Calendar, LogOut, Check
} from 'lucide-react';
import { BottomNav } from '@i-mendly/shared';
import Link from 'next/link';
import { usePlatformStore } from '@/store/usePlatformStore';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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
    <main className="min-h-screen bg-slate-50 pb-24">
      <header className="px-8 py-10 flex items-center justify-between sticky top-0 bg-slate-50/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
           <BarChart3 className="text-primary w-8 h-8" strokeWidth={3} />
           <h1 className="text-2xl font-black text-brand-night uppercase tracking-tighter">Mis Órdenes</h1>
        </div>
        <Badge variant="default" className="py-2.5 px-5 text-[9px] font-black tracking-widest uppercase shadow-sm">{myOrders.length} ACTIVOS</Badge>
      </header>

      <div className="px-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <section className="space-y-6">
           {isLoading && (
             <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <BarChart3 className="w-10 h-10 text-primary animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Sincronizando Órdenes...</p>
             </div>
           )}

           {!isLoading && myOrders.length === 0 && (
             <div className="p-16 border-4 border-dashed border-slate-100 rounded-[3.5rem] flex flex-col items-center text-center">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                     <BarChart3 size={32} className="text-slate-200" />
                 </div>
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No hay más órdenes pendientes</p>
                 <Link href="/cliente" className="mt-6">
                    <Button variant="ghost" className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Contratar nuevo servicio</Button>
                 </Link>
             </div>
           )}

           {myOrders.map((p) => (
             <div 
               key={p.dbId} 
               onClick={() => router.push(`/cliente/ordenes/${p.dbId}`)}
               className="block relative cursor-pointer"
             >
                <Card className="p-8 rounded-[2.5rem] border-none shadow-[0_20px_64px_-12px_rgba(0,0,0,0.06)] hover:shadow-[0_32px_96px_-12px_rgba(124,58,237,0.15)] transition-all duration-500 group bg-white">
                   <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-colors shadow-inner
                          ${p.status === 'PAID' ? 'bg-emerald-50 text-emerald-500' : 
                            p.status === 'REJECTED' ? 'bg-red-50 text-red-500' :
                            'bg-primary/5 text-primary'}`}>
                         {p.status === 'PAID' ? <CheckCircle2 size={32} /> : 
                          p.status === 'REJECTED' ? <LogOut size={32} /> : <Clock size={32} />}
                      </div>
                      
                      <div className="flex-1">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] font-mono">ORD-{p.id}</span>
                            <Badge variant={
                               p.status === 'PENDING' ? 'default' :
                               p.status === 'ACCEPTED' ? 'success' :
                               p.status === 'REJECTED' ? 'error' :
                               p.status === 'PAID' ? 'success' : 'warning'
                            } className="text-[9px] font-black uppercase px-2 py-0.5 shadow-sm">
                               {p.status}
                            </Badge>
                         </div>
                         <h3 className="text-xl font-black text-brand-night mb-1 tracking-tight uppercase leading-none">{p.serviceName}</h3>
                         
                         {p.status === 'COUNTER_OFFER' && p.counterOffer && (
                           <div className="my-4 p-4 rounded-xl bg-orange-50 border border-orange-100 flex items-start gap-3">
                             <div className="flex-1">
                               <p className="text-[10px] uppercase font-black tracking-widest text-orange-600 mb-1">El profesional sugiere otro horario:</p>
                               <p className="text-sm font-bold text-orange-900">{p.counterOffer.date} - {p.counterOffer.time}</p>
                               <p className="text-xs font-medium mt-1 text-orange-700">"{p.counterOffer.message}"</p>
                             </div>
                             <Button 
                               onClick={() => handleAcceptCounterOffer(p.id)}
                               variant="primary" 
                               className="bg-orange-500 hover:bg-orange-600 text-white border-none text-[10px] h-8 rounded-lg uppercase font-black"
                             >
                               Aceptar Nuevo Horario
                             </Button>
                           </div>
                         )}

                         <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-2">
                               <Avatar src={p.providerAvatar} name={p.providerName} className="w-6 h-6 rounded-lg" />
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{p.providerName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                               <Calendar size={12} />
                               <span className="text-[10px] font-bold">{p.date} - {p.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-500 font-black ml-auto border border-emerald-100 bg-emerald-50 px-3 py-1 rounded-full text-xs">
                               ${p.price.toFixed(2)}
                            </div>
                         </div>
                      </div>

                      <div className="hidden md:flex flex-col items-end gap-3 justify-center">
                         {p.status === 'ACCEPTED' && (
                           <Button 
                              onClick={() => handlePayOrder(p.id)}
                              variant="primary" 
                              className="bg-brand-night text-white hover:bg-slate-800 text-[10px] uppercase font-black tracking-widest px-6 h-12 rounded-xl shadow-lg border-none"
                           >
                             Proceder al Pago
                           </Button>
                         )}

                         <div className="flex items-center gap-3">
                           <button className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">
                              <MessageCircle size={20} />
                           </button>
                           <ChevronRight size={24} className="text-slate-100 group-hover:text-primary transition-colors cursor-pointer" />
                         </div>
                      </div>
                   </div>
                   
                   {/* Mobile payment button fallback */}
                   {p.status === 'ACCEPTED' && (
                     <div className="mt-6 md:hidden">
                       <Button 
                          onClick={() => handlePayOrder(p.id)}
                          variant="primary" 
                          className="w-full bg-brand-night text-white hover:bg-slate-800 text-[10px] uppercase font-black tracking-widest h-12 rounded-xl shadow-lg border-none"
                       >
                         Proceder al Pago
                       </Button>
                     </div>
                   )}
                </Card>
             </div>
           ))}
        </section>
      </div>

      {/* Menú inferior eliminado a petición del cliente */}
    </main>
  );
}
