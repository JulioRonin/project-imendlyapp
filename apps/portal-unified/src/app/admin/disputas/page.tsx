"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Search,
  Filter,
  ArrowLeft,
  ChevronRight,
  MessageSquare,
  Clock,
  ShieldCheck
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

/** Severidad: alta/crítica rose · media peach · en revisión lavanda (estado activo). */
const SEVERITY_PILL: Record<string, string> = {
  Critica: 'bg-rose/20 text-error',
  Abierta: 'bg-primary-light text-primary-deep',
  'En Revision': 'bg-lavender-light text-ink',
};

const SEVERITY_LABEL: Record<string, string> = {
  Critica: 'Crítica',
  Abierta: 'Abierta',
  'En Revision': 'En revisión',
};

const SUMMARY = [
  { label: 'Tasa de resolución', value: '94%', icon: ShieldCheck },
  { label: 'Tiempo promedio', value: '1.4d', icon: MessageSquare },
  { label: 'Recuperado este mes', value: '$12,400', icon: TrendingUp },
];

export default function DisputesPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-linen flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
          {/* ── Cabecera editorial ── */}
          <header className="v3-blur-in">
            <Link href="/admin" className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-muted hover:text-ink transition-colors group mb-6">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al dashboard
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep mb-2">Escrow</p>
                <h1 className="text-[36px] md:text-[44px] font-semibold tracking-tight leading-[1.02] text-ink">Gestión de disputas</h1>
                <p className="mt-2 text-[14px] font-medium text-muted max-w-lg">Mediación y resolución de conflictos con el pago protegido en custodia.</p>
              </div>
              <span className="inline-flex items-center self-start md:self-auto h-10 px-4 rounded-full bg-rose/20 text-error text-[12.5px] font-bold tabular-nums">
                {MOCK_DISPUTES.length} disputas activas
              </span>
            </div>
          </header>

          {/* ── Buscador de vidrio + filtros ── */}
          <div className="v3-blur-in mt-8 flex flex-col md:flex-row gap-3" style={{ animationDelay: '140ms' }}>
            <div className="flex-1 max-w-xl flex items-center gap-3 glass rounded-full pl-5 pr-2 h-14">
              <Search size={18} className="shrink-0 text-faint" />
              <input
                type="text"
                placeholder="Buscar por ID, cliente o proveedor"
                className="flex-1 min-w-0 h-full bg-transparent text-ink text-[15px] font-semibold placeholder:text-faint placeholder:font-medium outline-none"
              />
            </div>
            <button className="h-14 px-6 rounded-full bg-cream text-ink text-[13px] font-bold flex items-center gap-2 v2-shadow-soft v2-press">
              <Filter size={16} /> Filtros avanzados
            </button>
          </div>

          {/* ── Lista de disputas ── */}
          <div className="mt-8 space-y-4">
            {MOCK_DISPUTES.map((dispute, i) => (
              <Link
                key={dispute.id}
                href={`/admin/disputas/${dispute.id}`}
                className={`group block v2-rise v2-d${Math.min(i + 1, 8)}`}
              >
                <article className="bg-cream rounded-[1.75rem] p-6 md:p-7 v2-shadow-soft v2-press v2-float flex flex-col lg:flex-row gap-6 lg:items-center">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`inline-flex items-center h-7 px-3 rounded-full text-[11px] font-semibold ${SEVERITY_PILL[dispute.status] || 'bg-sand text-muted'}`}>
                        {SEVERITY_LABEL[dispute.status] || dispute.status}
                      </span>
                      <span className="text-[12px] font-semibold text-muted tabular-nums">{dispute.id}</span>
                      <span className="text-[12px] font-medium text-faint flex items-center gap-1"><Clock size={12} /> {dispute.date}</span>
                    </div>
                    <h3 className="text-[20px] font-semibold tracking-tight text-ink group-hover:text-primary-deep transition-colors">{dispute.title}</h3>
                    <p className="mt-1 text-[13.5px] font-medium text-muted line-clamp-1">{dispute.reason}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 lg:gap-10">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-faint mb-1">Cliente</p>
                      <p className="text-[14px] font-semibold text-ink">{dispute.client}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-faint mb-1">Proveedor</p>
                      <p className="text-[14px] font-semibold text-ink">{dispute.provider}</p>
                    </div>
                    <div className="min-w-[96px]">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-faint mb-1">En escrow</p>
                      <p className="text-[22px] font-bold tabular-nums tracking-tight text-ink leading-none">{dispute.amount}</p>
                    </div>
                    <span className="w-11 h-11 rounded-full bg-sand text-ink flex items-center justify-center transition-colors group-hover:bg-ink group-hover:text-white">
                      <ChevronRight size={16} />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* ── Resumen ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            {SUMMARY.map((s, i) => (
              <div key={s.label} className={`v2-rise v2-d${i + 4} bg-cream rounded-[1.75rem] p-6 v2-shadow-soft v2-float`}>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">{s.label}</p>
                  <span className="w-10 h-10 rounded-[0.9rem] bg-primary-light text-primary-deep flex items-center justify-center">
                    <s.icon size={17} />
                  </span>
                </div>
                <p className="mt-4 text-[32px] font-bold tabular-nums tracking-tight text-ink leading-none">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
