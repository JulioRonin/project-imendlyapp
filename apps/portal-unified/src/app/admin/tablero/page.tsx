"use client";

import { useEffect, useState } from 'react';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Button } from '@i-mendly/shared/components/Button';
import {
  Calendar, Check, Clock, Loader2, MapPin, Newspaper, ShieldAlert, Users, X
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { PROJECT_STATUS_LABELS, findContactInfo, formatMXN, timeAgo, timingLabel } from '../../../lib/tablero';

type Filter = 'pending_review' | 'open' | 'assigned' | 'all';

const REJECT_TEMPLATES = [
  'El texto incluye datos de contacto. Por seguridad, el contacto se comparte solo dentro de la plataforma.',
  'La descripción es demasiado vaga para recibir buenas ofertas. Agrega medidas, fotos o más detalle.',
  'La categoría seleccionada no corresponde al trabajo descrito.',
  'El contenido no corresponde a un proyecto de servicios del hogar.',
];

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

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'pending_review', label: `Por revisar (${counts.pending_review || 0})` },
    { key: 'open', label: `Abiertos (${counts.open || 0})` },
    { key: 'assigned', label: `Asignados (${counts.assigned || 0})` },
    { key: 'all', label: 'Todos' },
  ];

  return (
    <main className="flex-1 min-h-screen bg-slate-50 pb-24">
      <header className="px-8 py-10 flex items-center gap-4">
        <Newspaper className="text-primary w-8 h-8" strokeWidth={2.5} />
        <div>
          <h1 className="text-2xl font-black text-brand-night uppercase tracking-tighter">Moderación del Tablero</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Cada proyecto se revisa antes de publicarse</p>
        </div>
      </header>

      <div className="px-8 max-w-4xl space-y-6">
        <div className="flex flex-wrap gap-3">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f.key ? 'bg-brand-night text-white shadow-lg' : 'bg-white text-slate-400 shadow-sm hover:text-brand-night'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Cargando...</p>
          </div>
        )}

        {!isLoading && projects.length === 0 && (
          <div className="p-16 border-4 border-dashed border-slate-100 rounded-[3.5rem] text-center">
            <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">Sin proyectos en esta vista</p>
          </div>
        )}

        {projects.map(p => {
          const st = PROJECT_STATUS_LABELS[p.status] ?? { label: p.status, tone: 'default' as const };
          const contactFlag = findContactInfo(`${p.title} ${p.description}`);
          return (
            <Card key={p.id} className="p-7 rounded-[2.5rem] border-none shadow-card bg-white space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] font-mono">{p.display_id}</span>
                  <Badge variant={st.tone} className="text-[9px] font-black uppercase px-3 py-1">{st.label}</Badge>
                  {contactFlag && (
                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-red-500 bg-red-50 px-3 py-1 rounded-full">
                      <ShieldAlert size={12} /> Posible contacto en texto
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-300">{timeAgo(p.created_at)}</span>
              </div>

              <div>
                <h3 className="text-lg font-black text-brand-night uppercase tracking-tight leading-tight">{p.title}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Cliente: {p.users?.full_name || '—'} {p.users?.phone ? `· ${p.users.phone}` : ''}
                </p>
              </div>

              <p className="text-sm font-medium text-slate-500 whitespace-pre-wrap bg-slate-50 rounded-2xl p-4">{p.description}</p>

              {p.photos?.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {p.photos.map((url: string, i: number) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={url} alt={`Foto ${i + 1}`} className="w-20 h-20 rounded-xl object-cover" />
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{p.category}</span>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin size={13} /><span className="text-[10px] font-bold uppercase">{p.zone}{p.neighborhood ? ` · ${p.neighborhood}` : ''}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Calendar size={13} /><span className="text-[10px] font-bold uppercase">{timingLabel(p.timing)}</span>
                </div>
                {(p.budget_min || p.budget_max) && (
                  <span className="text-xs font-black text-emerald-500">
                    {p.budget_min ? formatMXN(p.budget_min) : ''}{p.budget_min && p.budget_max ? ' – ' : ''}{p.budget_max ? formatMXN(p.budget_max) : ''}
                  </span>
                )}
                <div className="ml-auto flex items-center gap-1.5 text-slate-400">
                  <Users size={13} /><span className="text-[10px] font-black">{p.offers_count}/{p.max_offers} ofertas</span>
                </div>
              </div>

              {p.status === 'pending_review' && (
                rejecting === p.id ? (
                  <div className="bg-red-50 rounded-[2rem] p-5 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Motivo del rechazo (visible para el cliente)</p>
                    <div className="flex flex-wrap gap-2">
                      {REJECT_TEMPLATES.map((t, i) => (
                        <button key={i} onClick={() => setRejectNote(t)} className="text-left text-[10px] font-bold text-red-500 bg-white border border-red-100 rounded-xl px-3 py-2 hover:bg-red-100 transition-colors">
                          {t}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={rejectNote}
                      onChange={e => setRejectNote(e.target.value)}
                      rows={2}
                      placeholder="Escribe o edita el motivo..."
                      className="w-full px-4 py-3 rounded-xl bg-white border border-red-100 outline-none text-sm font-medium text-brand-night resize-none"
                    />
                    <div className="flex gap-3">
                      <Button onClick={() => { setRejecting(null); setRejectNote(''); }} variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cancelar</Button>
                      <Button onClick={() => reject(p.id)} disabled={!rejectNote.trim() || acting === p.id} variant="primary" className="flex-1 py-3 rounded-xl bg-red-500 text-white border-none text-[10px] font-black uppercase tracking-widest">
                        {acting === p.id ? <Loader2 size={14} className="animate-spin" /> : 'Confirmar rechazo'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => approve(p.id)}
                      disabled={acting === p.id}
                      variant="primary"
                      className="flex-1 py-4 rounded-2xl bg-primary text-white hover:bg-primary-dark border-none shadow-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      {acting === p.id ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Aprobar y publicar
                    </Button>
                    <Button
                      onClick={() => { setRejecting(p.id); setRejectNote(contactFlag ? REJECT_TEMPLATES[0] : ''); }}
                      variant="ghost"
                      className="px-8 py-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <X size={15} /> Rechazar
                    </Button>
                  </div>
                )
              )}

              {p.status === 'rejected' && p.moderation_note && (
                <div className="p-4 rounded-2xl bg-red-50 text-xs font-medium text-red-600">
                  <span className="font-black uppercase text-[10px] tracking-widest">Rechazado: </span>{p.moderation_note}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </main>
  );
}
