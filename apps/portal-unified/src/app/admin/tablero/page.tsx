"use client";

import { useEffect, useState } from 'react';
import {
  Calendar, Check, Loader2, MapPin, Newspaper, ShieldAlert, Users, X
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { PROJECT_STATUS_LABELS, findContactInfo, formatMXN, timeAgo, timingLabel } from '../../../lib/tablero';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

type Filter = 'pending_review' | 'open' | 'assigned' | 'all';

const REJECT_TEMPLATES = [
  'El texto incluye datos de contacto. Por seguridad, el contacto se comparte solo dentro de la plataforma.',
  'La descripción es demasiado vaga para recibir buenas ofertas. Agrega medidas, fotos o más detalle.',
  'La categoría seleccionada no corresponde al trabajo descrito.',
  'El contenido no corresponde a un proyecto de servicios del hogar.',
];

const TONE_PILL: Record<string, string> = {
  default: 'bg-lavender-light text-ink',
  success: 'bg-mint-light text-mint-deep',
  warning: 'bg-primary-light text-primary-deep',
  error: 'bg-rose/20 text-error',
};

export default function AdminTableroPage() {
  const [filter, setFilter] = useState<Filter>('pending_review');
  const [projects, setProjects] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('projects')
        .select('*, users ( full_name, phone )')
        .order('created_at', { ascending: false });
      if (filter !== 'all') query = query.eq('status', filter);
      const { data, error } = await query;
      if (error) throw error;
      setProjects(data || []);

      const { data: all } = await supabase.from('projects').select('status');
      const c: Record<string, number> = {};
      (all || []).forEach((p: any) => { c[p.status] = (c[p.status] || 0) + 1; });
      setCounts(c);
    } catch (err) {
      console.error('Error fetching admin tablero:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, [filter]);

  const approve = async (id: string) => {
    setActing(id);
    try {
      const { error } = await supabase.from('projects').update({ status: 'open', moderation_note: null }).eq('id', id);
      if (error) throw error;
      fetchProjects();
    } catch (err) { console.error(err); } finally { setActing(null); }
  };

  const reject = async (id: string) => {
    if (!rejectNote.trim()) return;
    setActing(id);
    try {
      const { error } = await supabase.from('projects').update({ status: 'rejected', moderation_note: rejectNote.trim() }).eq('id', id);
      if (error) throw error;
      setRejecting(null);
      setRejectNote('');
      fetchProjects();
    } catch (err) { console.error(err); } finally { setActing(null); }
  };

  const FILTERS: { key: Filter; label: string; count?: number }[] = [
    { key: 'pending_review', label: 'Por revisar', count: counts.pending_review || 0 },
    { key: 'open', label: 'Abiertos', count: counts.open || 0 },
    { key: 'assigned', label: 'Asignados', count: counts.assigned || 0 },
    { key: 'all', label: 'Todos' },
  ];

  return (
    <main className="min-h-screen bg-linen flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-10 md:py-14">
          {/* ── Cabecera editorial ── */}
          <header className="v3-blur-in flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep mb-2">Tablero</p>
              <h1 className="text-[36px] md:text-[44px] font-semibold tracking-tight leading-[1.02] text-ink">Moderación del tablero</h1>
              <p className="mt-2 text-[14px] font-medium text-muted max-w-lg">Cada proyecto se revisa antes de publicarse. Aprueba lo que cumple y explica con claridad lo que no.</p>
            </div>
            <span className="hidden md:flex w-14 h-14 shrink-0 rounded-[1.15rem] bg-primary-light text-primary-deep items-center justify-center">
              <Newspaper size={24} />
            </span>
          </header>

          {/* ── Filtros como tabs subrayadas ── */}
          <div className="v3-blur-in mt-8 -mx-6 md:mx-0 px-6 md:px-0 flex gap-7 overflow-x-auto no-scrollbar" style={{ animationDelay: '160ms' }}>
            {FILTERS.map(f => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`relative shrink-0 pb-3 text-[14px] flex items-center gap-2 transition-colors duration-300 ${active ? 'font-semibold text-ink' : 'font-medium text-faint hover:text-muted'}`}
                >
                  {f.label}
                  {typeof f.count === 'number' && (
                    <span className={`text-[11px] font-bold tabular-nums px-2 h-5 rounded-full flex items-center ${active ? 'bg-lavender-light text-ink' : 'bg-sand text-muted'}`}>{f.count}</span>
                  )}
                  <span className={`absolute left-0 right-0 -bottom-px h-[3px] rounded-full bg-lavender transition-transform duration-500 origin-left ${active ? 'scale-x-100' : 'scale-x-0'}`} />
                </button>
              );
            })}
          </div>

          {/* ── Cargando ── */}
          {isLoading && (
            <div className="mt-8 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-52 rounded-[1.75rem] v2-shimmer" />
              ))}
            </div>
          )}

          {/* ── Estado vacío ── */}
          {!isLoading && projects.length === 0 && (
            <div className="v2-rise mt-12 bg-cream rounded-[2.25rem] p-12 flex flex-col items-center text-center v2-shadow-soft">
              <span className="w-16 h-16 rounded-[1.25rem] bg-primary-light text-primary-deep flex items-center justify-center mb-5">
                <Newspaper size={26} />
              </span>
              <h3 className="text-[20px] font-semibold tracking-tight text-ink">Sin proyectos en esta vista</h3>
              <p className="mt-2 text-[14px] font-medium text-muted max-w-sm">Cuando un cliente publique un proyecto nuevo aparecerá aquí para su revisión.</p>
              <button onClick={() => setFilter('all')} className="mt-6 h-14 px-6 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press">
                Ver todos los proyectos
              </button>
            </div>
          )}

          {/* ── Lista de proyectos ── */}
          <div className="mt-8 space-y-4">
            {projects.map((p, i) => {
              const st = PROJECT_STATUS_LABELS[p.status] ?? { label: p.status, tone: 'default' as const };
              const contactFlag = findContactInfo(`${p.title} ${p.description}`);
              return (
                <article key={p.id} className={`v2-rise v2-d${Math.min(i + 1, 8)} bg-cream rounded-[1.75rem] p-6 md:p-7 v2-shadow-soft space-y-5`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep tabular-nums">{p.display_id}</span>
                      <span className={`inline-flex items-center h-7 px-3 rounded-full text-[11px] font-semibold ${TONE_PILL[st.tone] || TONE_PILL.default}`}>{st.label}</span>
                      {contactFlag && (
                        <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-rose/20 text-error text-[11px] font-semibold">
                          <ShieldAlert size={12} /> Posible contacto en texto
                        </span>
                      )}
                    </div>
                    <span className="text-[12px] font-medium text-faint">{timeAgo(p.created_at)}</span>
                  </div>

                  <div>
                    <h3 className="text-[20px] font-semibold tracking-tight text-ink leading-tight">{p.title}</h3>
                    <p className="mt-1 text-[13px] font-medium text-muted">
                      Cliente: <span className="text-ink">{p.users?.full_name || '—'}</span> {p.users?.phone ? `· ${p.users.phone}` : ''}
                    </p>
                  </div>

                  <p className="text-[14px] font-medium text-ink/80 leading-relaxed whitespace-pre-wrap bg-sand rounded-[1.25rem] p-5">{p.description}</p>

                  {p.photos?.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {p.photos.map((url: string, i: number) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={i} src={url} alt={`Foto ${i + 1}`} className="w-20 h-20 rounded-[1rem] object-cover" />
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12.5px] font-medium text-muted">
                    <span className="inline-flex items-center h-8 px-3 rounded-full bg-sand text-ink text-[12px] font-semibold">{p.category}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={13} className="text-faint" /> {p.zone}{p.neighborhood ? ` · ${p.neighborhood}` : ''}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={13} className="text-faint" /> {timingLabel(p.timing)}</span>
                    {(p.budget_min || p.budget_max) && (
                      <span className="text-[14px] font-bold tabular-nums text-primary-deep">
                        {p.budget_min ? formatMXN(p.budget_min) : ''}{p.budget_min && p.budget_max ? ' – ' : ''}{p.budget_max ? formatMXN(p.budget_max) : ''}
                      </span>
                    )}
                    <span className="ml-auto flex items-center gap-1.5">
                      <Users size={13} className="text-faint" /><span className="font-bold tabular-nums text-ink">{p.offers_count}/{p.max_offers}</span> ofertas
                    </span>
                  </div>

                  {p.status === 'pending_review' && (
                    rejecting === p.id ? (
                      <div className="bg-rose/10 rounded-[1.5rem] p-5 space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-error">Motivo del rechazo (visible para el cliente)</p>
                        <div className="flex flex-wrap gap-2">
                          {REJECT_TEMPLATES.map((t, i) => {
                            const selected = rejectNote === t;
                            return (
                              <button
                                key={i}
                                onClick={() => setRejectNote(t)}
                                className={`text-left text-[12px] font-semibold rounded-full px-4 py-2 transition-colors duration-300 v2-press ${selected ? 'bg-ink text-white' : 'bg-cream text-ink hover:bg-sand'}`}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                        <textarea
                          value={rejectNote}
                          onChange={e => setRejectNote(e.target.value)}
                          rows={2}
                          placeholder="Escribe o edita el motivo..."
                          className="w-full px-5 py-4 rounded-[1.25rem] bg-cream border-0 outline-none text-[14px] font-medium text-ink placeholder:text-faint resize-none focus:ring-2 focus:ring-lavender/60"
                        />
                        <div className="flex gap-3">
                          <button onClick={() => { setRejecting(null); setRejectNote(''); }} className="h-12 px-5 rounded-full text-[13px] font-bold text-muted hover:text-ink transition-colors v2-press">Cancelar</button>
                          <button
                            onClick={() => reject(p.id)}
                            disabled={!rejectNote.trim() || acting === p.id}
                            className="flex-1 h-12 rounded-full bg-ink text-white text-[13px] font-bold flex items-center justify-center gap-2 v2-press disabled:opacity-50"
                          >
                            {acting === p.id ? <Loader2 size={15} className="animate-spin" /> : 'Confirmar rechazo'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={() => approve(p.id)}
                          disabled={acting === p.id}
                          className="flex-1 h-12 rounded-full bg-mint text-ink text-[13px] font-bold flex items-center justify-center gap-2 v2-press disabled:opacity-50"
                        >
                          {acting === p.id ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Aprobar y publicar
                        </button>
                        <button
                          onClick={() => { setRejecting(p.id); setRejectNote(contactFlag ? REJECT_TEMPLATES[0] : ''); }}
                          className="h-12 px-6 rounded-full bg-sand text-error text-[13px] font-bold flex items-center justify-center gap-2 v2-press"
                        >
                          <X size={15} /> Rechazar
                        </button>
                      </div>
                    )
                  )}

                  {p.status === 'rejected' && p.moderation_note && (
                    <div className="p-4 rounded-[1.25rem] bg-rose/10 text-[13px] font-medium text-error">
                      <span className="font-bold">Rechazado: </span>{p.moderation_note}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
