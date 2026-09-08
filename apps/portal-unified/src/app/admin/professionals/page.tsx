"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Search, ChevronRight, Plus } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { RatingPill } from '@/components/client/ui';

const FILTERS = ['Todos', 'Activo', 'Pendiente', 'Suspendido'];

const STATUS_PILL: Record<string, string> = {
  Activo: 'bg-sage-light text-sage',
  Pendiente: 'bg-primary-light text-primary',
  Suspendido: 'bg-error/10 text-error',
};

/** Retrato grande con esquinas suaves; iniciales sobre arcilla profunda si no hay foto. */
function Portrait({ name, src, className = '' }: { name: string; src?: string; className?: string }) {
  const initials = name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'IM';
  return (
    <div className={`shrink-0 rounded-[1.25rem] overflow-hidden bg-clay-deep text-white flex items-center justify-center font-semibold ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

export default function ProfessionalsManagementPage() {
  const [filter, setFilter] = useState('Todos');
  const [providers, setProviders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProviders = async () => {
    setIsLoading(true);
    try {
      // Fetch providers joined with the users table to get the name
      const { data, error } = await supabase
        .from('providers')
        .select(`
          id,
          category,
          account_status,
          rating,
          reviews_count,
          created_at,
          users ( full_name )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted = (data || []).map(p => {
        const u = Array.isArray(p.users) ? p.users[0] : p.users;
        return {
          id: p.id,
          name: u?.full_name || 'Sin Nombre/Empresa',
          category: p.category,
          status: p.account_status === 'active' ? 'Activo' : (p.account_status === 'pending' ? 'Pendiente' : 'Suspendido'),
          rating: p.rating || 0,
          services: p.reviews_count || 0, // Fallback to reviews count for demo
          joined: new Date(p.created_at).toLocaleDateString()
        };
      });

      setProviders(formatted);
    } catch (err) {
      console.error('Error fetching providers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const filteredProfessionals = providers.filter(p => filter === 'Todos' || p.status === filter);
  const countFor = (status: string) => status === 'Todos' ? providers.length : providers.filter(p => p.status === status).length;

  return (
    <main className="min-h-screen bg-linen flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
          {/* ── Cabecera editorial ── */}
          <header className="v3-blur-in flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-2">Proveedores</p>
              <h1 className="text-[36px] md:text-[44px] font-semibold tracking-tight leading-[1.02] text-ink">Profesionales</h1>
              <p className="mt-2 text-[14px] font-medium text-muted max-w-lg">Administra el talento, aprueba perfiles e inspecciona sus datos.</p>
            </div>
            <Link href="/admin/professionals/new" className="shrink-0 h-14 px-6 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press">
              <Plus size={16} /> Nuevo proveedor
            </Link>
          </header>

          {/* ── Buscador de vidrio ── */}
          <div className="v3-blur-in mt-8 max-w-xl" style={{ animationDelay: '140ms' }}>
            <div className="flex items-center gap-3 glass rounded-full pl-5 pr-2 h-14">
              <Search size={18} className="shrink-0 text-faint" />
              <input
                type="text"
                placeholder="Buscar por nombre o categoría"
                className="flex-1 min-w-0 h-full bg-transparent text-ink text-[15px] font-semibold placeholder:text-faint placeholder:font-medium outline-none"
              />
            </div>
          </div>

          {/* ── Filtros como tabs subrayadas ── */}
          <div className="v3-blur-in mt-8 -mx-6 md:mx-0 px-6 md:px-0 flex gap-7 overflow-x-auto no-scrollbar" style={{ animationDelay: '240ms' }}>
            {FILTERS.map(status => {
              const active = filter === status;
              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`relative shrink-0 pb-3 text-[14px] flex items-center gap-2 transition-colors duration-300 ${active ? 'font-semibold text-ink' : 'font-medium text-faint hover:text-muted'}`}
                >
                  {status}
                  <span className={`text-[11px] font-bold tabular-nums px-2 h-5 rounded-full flex items-center ${active ? 'bg-primary-light text-primary' : 'bg-sand text-muted'}`}>{countFor(status)}</span>
                  <span className={`absolute left-0 right-0 -bottom-px h-[3px] rounded-full bg-primary transition-transform duration-500 origin-left ${active ? 'scale-x-100' : 'scale-x-0'}`} />
                </button>
              );
            })}
          </div>

          {/* ── Grid de tarjetas ── */}
          {isLoading && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-44 rounded-[1.75rem] v2-shimmer" />
              ))}
            </div>
          )}

          {!isLoading && filteredProfessionals.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProfessionals.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/admin/professionals/${p.id}`}
                  className={`group block v2-rise v2-d${Math.min(i + 1, 8)}`}
                >
                  <article className="h-full bg-cream rounded-[1.75rem] p-5 v2-shadow-soft v2-press v2-float flex flex-col gap-5">
                    <div className="flex items-start gap-4">
                      <Portrait name={p.name} className="w-[72px] h-[72px] text-[22px]" />
                      <div className="flex-1 min-w-0 pt-1">
                        <h3 className="text-[17px] font-semibold tracking-tight text-ink truncate">{p.name}</h3>
                        <p className="text-[13px] font-medium text-muted mt-0.5 truncate">{p.category || 'Sin categoría'}</p>
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          {p.rating > 0 ? (
                            <RatingPill value={Number(p.rating)} />
                          ) : (
                            <span className="inline-flex items-center h-9 px-3 rounded-full bg-sand text-[12px] font-medium text-muted">Sin reseñas</span>
                          )}
                          <span className={`inline-flex items-center h-9 px-3.5 rounded-full text-[12px] font-semibold ${STATUS_PILL[p.status] || 'bg-sand text-muted'}`}>
                            {p.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <p className="text-[12px] font-medium text-muted">
                        <span className="text-faint">Registro</span> {p.joined} · <span className="tabular-nums">{p.services}</span> completados
                      </p>
                      <span className="w-10 h-10 rounded-full bg-sand text-ink flex items-center justify-center transition-colors group-hover:bg-ink group-hover:text-white">
                        <ChevronRight size={16} />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* ── Estado vacío ── */}
          {!isLoading && filteredProfessionals.length === 0 && (
            <div className="v2-rise mt-12 bg-cream rounded-[2.25rem] p-12 flex flex-col items-center text-center v2-shadow-soft">
              <span className="w-16 h-16 rounded-[1.25rem] bg-primary-light text-primary flex items-center justify-center mb-5">
                <Users size={26} />
              </span>
              <h3 className="text-[20px] font-semibold tracking-tight text-ink">Sin profesionales con este filtro</h3>
              <p className="mt-2 text-[14px] font-medium text-muted max-w-sm">Cambia el filtro o registra un nuevo proveedor para empezar a construir el catálogo.</p>
              <Link href="/admin/professionals/new" className="mt-6 h-14 px-6 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press">
                <Plus size={16} /> Nuevo proveedor
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
