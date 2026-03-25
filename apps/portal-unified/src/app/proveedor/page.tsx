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
  AlertCircle
} from "lucide-react";
import { Button } from "@i-mendly/shared/components/Button";
import { Card } from "@i-mendly/shared/components/Card";
import { Avatar } from "@i-mendly/shared/components/Avatar";
import { Badge } from "@i-mendly/shared/components/Badge";

const STATS = [
  { label: "Ingresos (Mes)", value: "$12,450", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
  { label: "Servicios Hoy", value: "4", icon: Briefcase, color: "text-primary", bg: "bg-primary/5" },
  { label: "Calificación", value: "4.9", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
];

const ACTIVE_SERVICES = [
  {
    id: "ORD-8822",
    client: "Carlos Ruiz",
    service: "Reparación AA",
    time: "10:30 AM",
    status: "En Camino",
    statusColor: "text-amber-700",
    variant: "primary" as const,
    address: "Polanco, CDMX"
  },
  {
    id: "ORD-8823",
    client: "Ana Maria",
    service: "Instalación Eléctrica",
    time: "02:00 PM",
    status: "Programado",
    statusColor: "text-indigo-700",
    variant: "primary" as const,
    address: "Santa Fe, CDMX"
  }
];

export default function ProviderDashboard() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-night rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xl">M</span>
            </div>
            <h1 className="text-lg font-black text-brand-night tracking-tight uppercase">Dashboard</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 w-64">
              <Search size={18} className="text-slate-400 mr-2" />
              <input type="text" placeholder="Buscar órdenes..." className="bg-transparent border-none text-sm outline-none w-full" />
            </div>
            <div className="relative">
              <Bell size={22} className="text-slate-400 cursor-pointer hover:text-brand-night transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-coral rounded-full" />
            </div>
            <Avatar size="md" name="Juan Perez" className="cursor-pointer border-2 border-slate-100" />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-10">
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Badge variant="success" className="mb-4 uppercase tracking-widest px-3 py-1 text-[10px] font-bold">
              Perfil Verificado
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-brand-night tracking-tight">¡Hola, Juan Pérez!</h2>
            <p className="text-slate-400 font-medium mt-1">Tienes 4 servicios pendientes para el día de hoy.</p>
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
            <Card key={i} className="p-8 rounded-[2rem] hover:scale-[1.02] transition-all group overflow-hidden relative">
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
              {ACTIVE_SERVICES.map((service, i) => (
                <Card key={i} className="p-6 rounded-[1.5rem] hover:border-slate-100 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                      <Clock className="text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{service.id}</span>
                        <Badge variant="primary" className="text-[9px] font-black uppercase px-2 py-0.5">
                          {service.status}
                        </Badge>
                      </div>
                      <h4 className="text-lg font-black text-brand-night">{service.client}</h4>
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mt-1">
                        <span className="flex items-center gap-1"><Briefcase size={12} /> {service.service}</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {service.time}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="rounded-xl">
                      <ChevronRight size={20} className="text-slate-300" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Empty state message */}
            <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} className="text-slate-200" />
              </div>
              <p className="text-slate-400 font-bold text-sm">No tienes más servicios para hoy.</p>
              <p className="text-slate-300 text-xs mt-1">¡Buen trabajo!</p>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <section className="space-y-6">
              <h3 className="text-xl font-black text-brand-night tracking-tight uppercase">Tareas Pendientes</h3>
              <Card variant="navy" className="p-6 rounded-[2rem] overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <AlertCircle size={80} strokeWidth={1} />
                </div>
                <div className="relative z-10">
                  <h4 className="font-black text-lg mb-2">Finalizar Perfil</h4>
                  <p className="text-white/60 text-xs font-medium leading-relaxed mb-6">
                    Completa la validación de tu seguro para aparecer en búsquedas premium.
                  </p>
                  <Button variant="coral" className="w-full font-black text-[10px] tracking-widest uppercase rounded-xl h-11">
                    Completar Ahora
                  </Button>
                </div>
              </Card>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl font-black text-brand-night tracking-tight uppercase">Próximos Pagos</h3>
              <div className="space-y-4">
                {[1, 2].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <TrendingUp size={18} />
                      </div>
                      <div>
                        <p className="font-black text-brand-night text-sm">Liberación Escrow</p>
                        <p className="text-slate-400 text-[10px] font-bold">Mañana, 09:00 AM</p>
                      </div>
                    </div>
                    <p className="font-black text-brand-night text-sm">$2,450</p>
                  </div>
                ))}
              </div>
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
