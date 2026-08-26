"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Button } from '@i-mendly/shared/components/Button';
import {
  ArrowLeft, ChevronRight, ClipboardList, Hammer,
  Loader2, MapPin, Plus, Users
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { PROJECT_STATUS_LABELS, timeAgo, formatMXN } from '../../../lib/tablero';

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
    <main className="min-h-screen bg-slate-50 pb-24">
      <header className="px-8 py-10 flex items-center justify-between sticky top-0 bg-slate-50/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          <Link href="/cliente" className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-primary">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-brand-night uppercase tracking-tighter">Mis Proyectos</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Publica y recibe ofertas de verificados</p>
          </div>
        </div>
        <Link href="/cliente/proyectos/nuevo">
          <Button variant="primary" className="h-12 px-6 rounded-2xl bg-primary text-white border-none shadow-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Plus size={16} /> Publicar
          </Button>
        </Link>
      </header>

      <div className="px-8 max-w-3xl mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-5 duration-700">
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Cargando proyectos...</p>
          </div>
        )}

        {!isLoading && projects.length === 0 && (
          <div className="p-16 border-4 border-dashed border-slate-100 rounded-[3.5rem] flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
              <Hammer size={32} className="text-primary" />
            </div>
            <h3 className="text-lg font-black text-brand-night uppercase tracking-tight mb-2">¿Necesitas un trabajo en casa?</h3>
            <p className="text-slate-400 font-medium text-sm max-w-sm mb-6">Publica tu proyecto — una pérgola, una cocina, una reparación — y recibe hasta 5 ofertas de proveedores verificados de tu zona.</p>
            <Link href="/cliente/proyectos/nuevo">
              <Button variant="primary" className="h-14 px-10 rounded-2xl bg-brand-night text-white border-none shadow-lg text-[10px] font-black uppercase tracking-widest">
                Publicar mi primer proyecto
              </Button>
            </Link>
          </div>
        )}

        {projects.map(p => {
          const st = PROJECT_STATUS_LABELS[p.status] ?? { label: p.status, tone: 'default' as const };
          return (
            <div key={p.id} onClick={() => router.push(`/cliente/proyectos/${p.id}`)} className="cursor-pointer group">
              <Card className="p-7 rounded-[2.5rem] border-none shadow-card bg-white hover:shadow-float transition-all duration-500">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] font-mono">{p.display_id}</span>
                  <Badge variant={st.tone} className="text-[9px] font-black uppercase px-3 py-1">{st.label}</Badge>
                </div>
                <h3 className="text-lg font-black text-brand-night uppercase tracking-tight leading-tight mb-2">{p.title}</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{p.category}</span>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin size={12} />
                    <span className="text-[10px] font-bold uppercase">{p.zone}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300">{timeAgo(p.created_at)}</span>
                  <div className="ml-auto flex items-center gap-4">
                    {(p.budget_min || p.budget_max) && (
                      <span className="text-xs font-black text-emerald-500">
                        {p.budget_min ? formatMXN(p.budget_min) : ''}{p.budget_min && p.budget_max ? '–' : ''}{p.budget_max ? formatMXN(p.budget_max) : ''}
                      </span>
                    )}
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black ${p.offers_count > 0 ? 'bg-primary/10 text-primary' : 'bg-slate-50 text-slate-300'}`}>
                      <Users size={12} />
                      {p.offers_count}/{p.max_offers} ofertas
                    </div>
                    <ChevronRight size={20} className="text-slate-100 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </main>
  );
}
