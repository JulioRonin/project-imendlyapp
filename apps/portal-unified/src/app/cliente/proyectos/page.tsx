"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ChevronRight, Hammer,
  MapPin, Plus, Users
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { PROJECT_STATUS_LABELS, timeAgo, formatMXN } from '../../../lib/tablero';
import { ClientNav } from '@/components/client/ClientNav';

const STATUS_PILL: Record<'default' | 'success' | 'warning' | 'error', string> = {
  success: 'bg-[#E7F2E9] text-primary',
  warning: 'bg-amber-50 text-amber-700',
  error: 'bg-red-50 text-red-600',
  default: 'bg-black/[0.05] text-[#7A7468]',
};

export default function MisProyectosPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setIsLoading(false); return; }

        const { data, error } = await supabase
          .from('projects')
          .select('id, display_id, category, title, zone, neighborhood, status, offers_count, max_offers, budget_min, budget_max, created_at')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <main className="min-h-screen bg-[#F4F1EA] pb-36">
      {/* Header interno v2 */}
      <header className="v2-rise sticky top-0 z-50 bg-[#F4F1EA]/85 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link
            href="/cliente"
            aria-label="Volver"
            className="w-12 h-12 shrink-0 rounded-full bg-white v2-shadow-soft flex items-center justify-center text-[#1B1A17] v2-press"
          >
            <ArrowLeft size={19} />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              Tablero de proyectos
            </p>
            <h1 className="text-[22px] font-semibold tracking-tight text-[#1B1A17] leading-tight">
              Mis proyectos
            </h1>
          </div>
          <Link
            href="/cliente/proyectos/nuevo"
            className="shrink-0 h-12 px-5 rounded-full bg-primary text-white text-[13px] font-bold flex items-center gap-2 shadow-lg shadow-primary/25 v2-press hover:bg-primary-dark transition-colors"
          >
            <Plus size={16} strokeWidth={2.5} /> Publicar
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 mt-2 space-y-4">
        {/* Loading — skeleton shimmer */}
        {isLoading && (
          <>
            {[0, 1, 2].map(i => (
              <div key={i} className={`v2-rise v2-d${i + 1} h-40 rounded-[1.75rem] v2-shimmer`} />
            ))}
          </>
        )}

        {/* Estado vacío */}
        {!isLoading && projects.length === 0 && (
          <div className="v2-rise v2-d1 bg-white rounded-[2.25rem] v2-shadow-soft px-8 py-14 flex flex-col items-center text-center">
            <span className="w-20 h-20 rounded-[1.4rem] bg-[#E7F2E9] text-primary flex items-center justify-center mb-6">
              <Hammer size={32} />
            </span>
            <h3 className="text-[19px] font-semibold tracking-tight text-[#1B1A17] mb-2">
              ¿Necesitas un trabajo en casa?
            </h3>
            <p className="text-[14px] font-medium text-[#7A7468] max-w-sm mb-8">
              Publica tu proyecto — una pérgola, una cocina, una reparación — y recibe
              hasta 5 ofertas de proveedores verificados de tu zona.
            </p>
            <Link
              href="/cliente/proyectos/nuevo"
              className="h-14 px-9 rounded-full bg-primary text-white text-[13px] font-bold flex items-center justify-center shadow-lg shadow-primary/25 v2-press hover:bg-primary-dark transition-colors"
            >
              Publicar mi primer proyecto
            </Link>
          </div>
        )}

        {/* Tarjetas de proyecto */}
        {projects.map((p, i) => {
          const st = PROJECT_STATUS_LABELS[p.status] ?? { label: p.status, tone: 'default' as const };
          const hasOffers = p.offers_count > 0;
          return (
            <div
              key={p.id}
              onClick={() => router.push(`/cliente/proyectos/${p.id}`)}
              className={`v2-rise v2-d${Math.min(i + 1, 8)} cursor-pointer group`}
            >
              <article className="bg-white rounded-[1.75rem] v2-shadow-soft p-6 v2-press v2-float transition-shadow">
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                    {p.display_id}
                  </span>
                  <span className={`shrink-0 inline-flex items-center h-7 px-3 rounded-full text-[11px] font-bold ${STATUS_PILL[st.tone]}`}>
                    {st.label}
                  </span>
                </div>

                <h3 className="text-[17px] font-semibold tracking-tight text-[#1B1A17] leading-snug mb-3">
                  {p.title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="inline-flex items-center h-7 px-3 rounded-full bg-[#F4F1EA] text-[12px] font-semibold text-[#7A7468]">
                    {p.category}
                  </span>
                  <span className="flex items-center gap-1 text-[12px] font-medium text-[#ACA598]">
                    <MapPin size={12} /> {p.zone}
                  </span>
                  <span className="text-[12px] font-medium text-[#ACA598]">{timeAgo(p.created_at)}</span>
                </div>

                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-black/[0.05]">
                  <span className={`inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-[12px] font-bold ${hasOffers ? 'bg-[#E7F2E9] text-primary' : 'bg-[#F4F1EA] text-[#ACA598]'}`}>
                    <Users size={13} />
                    {p.offers_count}/{p.max_offers} ofertas
                  </span>
                  {(p.budget_min || p.budget_max) && (
                    <span className="ml-auto text-[14px] font-bold text-primary tabular-nums">
                      {p.budget_min ? formatMXN(p.budget_min) : ''}{p.budget_min && p.budget_max ? '–' : ''}{p.budget_max ? formatMXN(p.budget_max) : ''}
                    </span>
                  )}
                  <ChevronRight
                    size={18}
                    className={`${(p.budget_min || p.budget_max) ? '' : 'ml-auto '}text-[#ACA598] transition-all group-hover:text-primary group-hover:translate-x-0.5`}
                  />
                </div>
              </article>
            </div>
          );
        })}
      </div>

      <ClientNav />
    </main>
  );
}
