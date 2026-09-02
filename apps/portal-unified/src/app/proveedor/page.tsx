"use client";

import {
  Briefcase,
  TrendingUp,
  Star,
  Calendar,
  Clock,
  Bell,
  Search,
  CheckCircle2,
  ShieldCheck,
  BadgeCheck,
  ArrowUpRight,
  X,
  Check
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar } from "@i-mendly/shared/components/Avatar";
import { usePlatformStore } from "@/store/usePlatformStore";
import { SectionHead } from "@/components/client/ui";

const STATS = [
  { label: "Ingresos del mes", value: "$12,450", hint: "MXN cobrados", icon: TrendingUp },
  { label: "Servicios hoy", value: "0", hint: "en tu agenda", icon: Briefcase },
  { label: "Calificación", value: "4.9", hint: "promedio de clientes", icon: Star },
];

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Nueva solicitud',
  ACCEPTED: 'Aceptada',
  REJECTED: 'Rechazada',
  COUNTER_OFFER: 'Contraoferta enviada',
  PAID: 'Pagada y en curso',
};

const STATUS_TONE: Record<string, string> = {
  PENDING: 'bg-primary-light text-primary',
  ACCEPTED: 'bg-sage-light text-sage',
  REJECTED: 'bg-error/10 text-error',
  COUNTER_OFFER: 'bg-sand text-muted',
  PAID: 'bg-sage-light text-sage',
};

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

  // Solo presentación: el servicio en curso que protagoniza la tarjeta oscura
  const activeOrder = myOrders.find(o => o.status === 'PAID' || o.status === 'ACCEPTED');
  const pendingCount = myOrders.filter(o => o.status === 'PENDING').length;

  return (
    <main className="flex-1 min-w-0 bg-linen pb-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-6 md:pt-8">
        {/* ── Barra superior ── */}
        <div className="v3-blur-in flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-3 glass rounded-full pl-4 pr-2 h-12 w-80">
            <Search size={17} className="shrink-0 text-faint" />
            <input
              type="text"
              placeholder="Buscar servicios o clientes"
              className="flex-1 min-w-0 bg-transparent text-[14px] font-semibold text-ink placeholder:text-faint placeholder:font-medium outline-none"
            />
          </div>
          <p className="md:hidden text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Panel del profesional</p>

          <div className="flex items-center gap-3">
            <button aria-label="Notificaciones" className="relative w-11 h-11 rounded-full bg-white/70 flex items-center justify-center text-ink v2-press">
              <Bell size={17} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary ring-2 ring-white" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-semibold text-ink leading-tight">{currentUser?.email || 'Profesional'}</p>
                <p className="text-[11.5px] font-medium text-muted">Certificado I mendly</p>
              </div>
              <Avatar size="md" name={currentUser?.email || 'Profesional'} className="ring-4 ring-white" />
            </div>
          </div>
        </div>

        {/* ── Cabecera fotográfica ── */}
        <section className="v3-blur-in mt-6" style={{ animationDelay: '120ms' }}>
          <div className="group relative h-[440px] md:h-[460px] rounded-[2.5rem] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/provider_dashboard_hero.png" alt="Mesa de trabajo" className="absolute inset-0 w-full h-full object-cover v3-photo" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />

            <span className="v3-pop absolute top-5 left-5 md:top-7 md:left-7 glass rounded-full pl-2.5 pr-4 h-10 inline-flex items-center gap-2.5" style={{ animationDelay: '700ms' }}>
              <span className="relative w-2.5 h-2.5">
                <span className="absolute inset-0 rounded-full bg-primary v3-pulse-ring" />
                <span className="absolute inset-0 rounded-full bg-primary" />
              </span>
              <span className="text-[12.5px] font-semibold text-ink tabular-nums">{pendingCount} solicitudes nuevas</span>
            </span>

            <div className="absolute inset-x-4 bottom-4 md:inset-x-7 md:bottom-7 glass rounded-[1.9rem] p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-2">Tu día de trabajo</p>
                <h1 className="text-[32px] md:text-[42px] font-semibold tracking-tight leading-[1.02] text-ink">
                  Hola, {currentUser?.email.split('@')[0] || 'Profesional'}
                </h1>
                <p className="mt-2 text-[14px] font-medium text-muted">
                  Tienes {pendingCount} solicitudes pendientes para evaluar.
                </p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-sage">
                  <BadgeCheck size={15} /> Perfil certificado
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => router.push('/proveedor/configuracion')}
                  className="h-12 md:h-14 px-5 rounded-full bg-white text-ink text-[13px] font-bold v2-press"
                >
                  Configuración
                </button>
                <button
                  onClick={() => router.push('/proveedor/agenda')}
                  className="h-12 md:h-14 px-6 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press"
                >
                  Ver agenda <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Métricas ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {STATS.map((stat, i) => (
            <div key={i} className={`v2-rise v2-d${i + 1} bg-cream rounded-[1.75rem] p-6 v2-shadow-soft v2-float`}>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">{stat.label}</p>
                <span className="w-10 h-10 rounded-[0.9rem] bg-primary-light text-primary flex items-center justify-center">
                  <stat.icon size={17} />
                </span>
              </div>
              <p className="mt-4 text-[32px] font-bold tabular-nums tracking-tight text-ink leading-none">{stat.value}</p>
              <p className="mt-2 text-[12px] font-medium text-faint">{stat.hint}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
          {/* ── Próximos servicios ── */}
          <div className="lg:col-span-2">
            <SectionHead title="Próximos servicios" action="Ver historial" href="/proveedor/ordenes" />

            {myOrders.length === 0 && (
              <div className="v2-rise v2-d2 bg-cream rounded-[2rem] p-10 flex flex-col items-center text-center v2-shadow-soft">
                <span className="w-16 h-16 rounded-[1.4rem] bg-primary-light text-primary flex items-center justify-center mb-4">
                  <CheckCircle2 size={26} />
                </span>
                <h3 className="text-[17px] font-semibold text-ink">No tienes servicios activos</h3>
                <p className="mt-1 text-[13px] font-medium text-muted max-w-xs">Tu agenda está libre hoy. Revisa el tablero para ofertar en proyectos nuevos.</p>
                <button onClick={() => router.push('/proveedor/tablero')} className="mt-6 h-12 px-6 rounded-full bg-ink text-white text-[13px] font-bold v2-press">
                  Ir al tablero
                </button>
              </div>
            )}

            <div className="space-y-3">
              {myOrders.map((service, i) => (
                <article key={service.id} className={`v2-rise v2-d${Math.min(i + 2, 8)} bg-cream rounded-[1.75rem] p-5 md:p-6 v2-shadow-soft`}>
                  <div className="flex items-start gap-4">
                    <span className="w-14 h-14 shrink-0 rounded-[1.15rem] bg-primary-light text-primary flex items-center justify-center">
                      <Clock size={20} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">ORD-{service.id}</span>
                        <span className={`px-3 h-7 inline-flex items-center rounded-full text-[11px] font-semibold ${STATUS_TONE[service.status] || 'bg-sand text-muted'}`}>
                          {STATUS_LABEL[service.status] || service.status}
                        </span>
                      </div>
                      <h4 className="mt-1 text-[17px] font-semibold tracking-tight text-ink truncate">{service.clientEmail}</h4>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] font-medium text-muted mt-1">
                        <span className="flex items-center gap-1.5"><Briefcase size={13} className="text-faint" /> {service.serviceName}</span>
                        <span className="flex items-center gap-1.5"><Calendar size={13} className="text-faint" /> {service.date} · {service.time}</span>
                        <span className="ml-auto text-[14px] font-bold tabular-nums text-ink">${service.price.toLocaleString('es-MX')}</span>
                      </div>

                      {service.status === 'PENDING' && (
                        <div className="flex gap-2 mt-5">
                          <button
                            onClick={() => handleAccept(service.id)}
                            className="flex-1 h-11 rounded-full bg-primary hover:bg-primary-dark text-white text-[12.5px] font-bold flex items-center justify-center gap-2 v2-press"
                          >
                            <Check size={14} /> Aceptar
                          </button>
                          <button
                            onClick={() => handleCounter(service.id)}
                            className="flex-1 h-11 rounded-full bg-sand text-ink text-[12.5px] font-bold flex items-center justify-center gap-2 v2-press"
                          >
                            <Calendar size={14} /> Sugerir horario
                          </button>
                          <button
                            onClick={() => handleReject(service.id)}
                            aria-label="Rechazar"
                            className="w-11 h-11 shrink-0 rounded-full bg-sand text-error flex items-center justify-center v2-press"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* ── Columna lateral ── */}
          <aside className="space-y-5">
            {/* Servicio activo */}
            <div className="v2-rise v2-d3 relative overflow-hidden bg-ink rounded-[2.25rem] p-7 text-white v2-shadow-lift">
              <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-primary/25 blur-3xl" />
              <div className="relative">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Servicio activo</p>
                {activeOrder ? (
                  <>
                    <h3 className="mt-2 text-[20px] font-semibold tracking-tight leading-tight">{activeOrder.serviceName}</h3>
                    <p className="mt-1 text-[13px] font-medium text-white/60 truncate">{activeOrder.clientEmail}</p>
                    <p className="mt-6 text-[40px] font-bold tabular-nums tracking-tight leading-none">${activeOrder.price.toLocaleString('es-MX')}</p>
                    <p className="mt-2 text-[12px] font-medium text-white/50">{activeOrder.date} · {activeOrder.time}</p>
                    <button
                      onClick={() => router.push('/proveedor/ordenes')}
                      className="mt-6 w-full h-12 rounded-full bg-white text-ink text-[13px] font-bold flex items-center justify-center gap-2 v2-press"
                    >
                      Ver orden <ArrowUpRight size={15} />
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="mt-2 text-[20px] font-semibold tracking-tight leading-tight">Sin servicio en curso</h3>
                    <p className="mt-1 text-[13px] font-medium text-white/60">Cuando aceptes una solicitud aparecerá aquí con su monto.</p>
                    <p className="mt-6 text-[40px] font-bold tabular-nums tracking-tight leading-none text-white/30">$0</p>
                    <button
                      onClick={() => router.push('/proveedor/tablero')}
                      className="mt-6 w-full h-12 rounded-full bg-white text-ink text-[13px] font-bold flex items-center justify-center gap-2 v2-press"
                    >
                      Buscar proyectos <ArrowUpRight size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Tarea pendiente */}
            <div className="v2-rise v2-d4 bg-cream rounded-[2rem] p-6 v2-shadow-soft">
              <div className="flex items-start gap-4">
                <span className="w-12 h-12 shrink-0 rounded-[1.05rem] bg-sage-light text-sage flex items-center justify-center">
                  <ShieldCheck size={20} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Tarea pendiente</p>
                  <h4 className="mt-1 text-[16px] font-semibold text-ink leading-tight">Revalidar tu certificación</h4>
                  <p className="mt-1.5 text-[12.5px] font-medium text-muted leading-relaxed">
                    Sube tus documentos recientes para mantener tu badge I mendly y seguir recibiendo las mejores solicitudes.
                  </p>
                </div>
              </div>
              <button className="mt-5 w-full h-12 rounded-full bg-primary hover:bg-primary-dark text-white text-[13px] font-bold v2-press">
                Completar ahora
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
