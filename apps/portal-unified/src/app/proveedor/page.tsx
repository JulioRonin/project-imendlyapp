"use client";

import { 
  Briefcase, 
  TrendingUp, 
  Star, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Bell,
  Search,
  CheckCircle2,
  AlertCircle,
  LogOut,
  X,
  Check
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@i-mendly/shared/components/Button";
import { Card } from "@i-mendly/shared/components/Card";
import { Avatar } from "@i-mendly/shared/components/Avatar";
import { Badge } from "@i-mendly/shared/components/Badge";
import { usePlatformStore } from "@/store/usePlatformStore";

const STATS = [
  { label: "Ingresos (Mes)", value: "$12,450", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
  { label: "Servicios Hoy", value: "0", icon: Briefcase, color: "text-primary", bg: "bg-primary/5" },
  { label: "Calificación", value: "4.9", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
];

export default function ProviderDashboard() {
  const router = useRouter();
  const currentUser = usePlatformStore(state => state.currentUser);
  const allOrders = usePlatformStore(state => state.orders);
  const updateOrderStatus = usePlatformStore(state => state.updateOrderStatus);
  
  // Filter for orders meant for this provider
  const myOrders = allOrders.filter(o => o.providerEmail === currentUser?.email);
  
  const handleLogout = () => {
    router.push('/role-selection');
  };

  const handleAccept = (id: string) => updateOrderStatus(id, 'ACCEPTED');
  const handleReject = (id: string) => updateOrderStatus(id, 'REJECTED');
  const handleCounter = (id: string) => {
    // Generate a quick dummy counter offer
    updateOrderStatus(id, 'COUNTER_OFFER', { date: 'Mañana', time: '12:00 PM', message: 'Tengo espacio a esta hora' });
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#FDFDFD]">
      {/* Search & Notifications Header */}
      <header className="h-20 border-b border-slate-100 flex items-center justify-between px-10 bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center bg-slate-100/50 border border-slate-200/50 rounded-2xl px-4 py-2 w-80 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search size={18} className="text-slate-400 mr-2" />
          <input type="text" placeholder="Buscar servicios o clientes..." className="bg-transparent border-none text-[11px] font-bold uppercase tracking-tight outline-none w-full placeholder:text-slate-300" />
        </div>

        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-coral rounded-full border-2 border-white animate-pulse" />
            <Bell size={20} className="text-slate-400 cursor-pointer group-hover:text-brand-night transition-colors" />
          </div>
          <div className="w-[1px] h-6 bg-slate-200" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-night">{currentUser?.email || 'Indigo Moda'}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Premium Partner</p>
            </div>
            <Avatar size="md" name="Indigo Moda" className="border-2 border-white shadow-sm" />
          </div>
        </div>
      </header>

      <main className="p-10 space-y-10 overflow-y-auto">
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
            <Badge variant="success" className="mb-4 uppercase tracking-widest px-3 py-1 text-[10px] font-bold">
              Perfil Verificado
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-brand-night tracking-tight">¡Hola, {currentUser?.email.split('@')[0] || 'Profesional'}!</h2>
            <p className="text-slate-400 font-medium mt-1">Tienes {myOrders.filter(o => o.status === 'PENDING').length} solicitudes pendientes para evaluar.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl px-6 h-12 text-xs font-black uppercase tracking-widest">
              Configuración
            </Button>
            <Button variant="primary" className="rounded-xl px-8 h-12 shadow-lg text-xs font-black uppercase tracking-widest">
              Ver Agenda
            </Button>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATS.map((stat, i) => (
            <Card key={i} className="p-8 rounded-[2rem] hover:scale-[1.02] transition-all group overflow-hidden relative border-none shadow-[0_32px_128px_-12px_rgba(0,0,0,0.05)]">
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.bg} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-2">{stat.label}</p>
                  <p className="text-2xl font-black text-brand-night tracking-tight">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Active Services List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-brand-night tracking-tight uppercase">Servicios Activos</h3>
              <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-primary">Ver historial</Button>
            </div>
            
            <div className="space-y-4">
              {myOrders.length === 0 && (
                <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} className="text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-bold text-sm">No tienes servicios activos</p>
                  <p className="text-slate-300 text-xs mt-1">Tu agenda está libre hoy.</p>
                </div>
              )}

              {myOrders.map((service, i) => (
                <Card key={i} className={`p-6 rounded-[1.5rem] transition-all group border-none shadow-md ${service.status === 'PENDING' ? 'bg-primary/5 ring-1 ring-primary/20' : 'bg-white'}`}>
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                      <Clock className="text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">ORD-{service.id}</span>
                        <Badge variant="default" className="text-[9px] font-black uppercase px-2 py-0.5">
                          {service.status === 'PENDING' && 'Nueva Solicitud'}
                          {service.status === 'ACCEPTED' && 'Aceptada'}
                          {service.status === 'REJECTED' && 'Rechazada'}
                          {service.status === 'COUNTER_OFFER' && 'Contraoferta Enviada'}
                          {service.status === 'PAID' && 'Pagada y Cursando'}
                        </Badge>
                      </div>
                      <h4 className="text-lg font-black text-brand-night">{service.clientEmail}</h4>
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mt-1">
                        <span className="flex items-center gap-1"><Briefcase size={12} /> {service.serviceName}</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {service.date} - {service.time}</span>
                      </div>
                      
                      {service.status === 'PENDING' && (
                        <div className="flex gap-3 mt-6 animate-in fade-in duration-500">
                          <Button 
                            variant="primary" 
                            onClick={() => handleAccept(service.id)}
                            className="flex-1 h-10 text-[10px] font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-400 shadow-[0_10px_30px_rgba(16,185,129,0.3)] shadow-emerald-500/20"
                          >
                            <Check size={14} className="mr-2" /> Aceptar
                          </Button>
                          <Button 
                            variant="secondary" 
                            onClick={() => handleCounter(service.id)}
                            className="flex-1 h-10 text-[10px] font-black uppercase tracking-widest text-primary border-primary/20 hover:bg-primary/10 bg-white shadow-sm"
                          >
                            <Calendar size={14} className="mr-2" /> Sugerir Horario
                          </Button>
                          <Button 
                            variant="ghost" 
                            onClick={() => handleReject(service.id)}
                            className="flex-none w-10 h-10 p-0 text-red-400 hover:bg-red-50 hover:text-red-500"
                          >
                            <X size={18} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <section className="space-y-6">
              <h3 className="text-xl font-black text-brand-night tracking-tight uppercase">Tareas Pendientes</h3>
              <Card variant="dark" className="p-6 rounded-[2rem] overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <AlertCircle size={80} strokeWidth={1} />
                </div>
                <div className="relative z-10">
                  <h4 className="font-black text-lg mb-2">Finalizar Perfil</h4>
                  <p className="text-white/60 text-xs font-medium leading-relaxed mb-6">
                    Completa la validación de tu seguro para aparecer en búsquedas premium.
                  </p>
                  <Button variant="primary" className="w-full font-black text-[10px] tracking-widest uppercase rounded-xl h-11">
                    Completar Ahora
                  </Button>
                </div>
              </Card>
            </section>
          </div>
        </div>
      </main>

      {/* Bottom Nav Helper */}
      <footer className="md:hidden bg-white border-t border-slate-100 p-4 sticky bottom-0 z-50">
        <div className="flex justify-around items-center">
          <Briefcase size={20} className="text-primary" />
          <Calendar size={20} className="text-slate-300" />
          <div className="w-12 h-12 bg-brand-night rounded-2xl flex items-center justify-center -mt-8 border-4 border-[#F8F9FB] shadow-xl">
            <CheckCircle2 size={24} className="text-white" />
          </div>
          <Bell size={20} className="text-slate-300" />
          <Avatar size="sm" name="JP" />
        </div>
      </footer>
    </div>
  );
}
