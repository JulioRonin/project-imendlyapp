"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Button } from '@i-mendly/shared/components/Button';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import {
  ArrowLeft, BadgeCheck, Calendar, Check, ClipboardList, Clock,
  Loader2, MapPin, ShieldCheck, Star, Users, X
} from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { PROJECT_STATUS_LABELS, timingLabel, timeAgo, formatMXN, genDisplayId } from '../../../../lib/tablero';

export default function ProyectoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const [justPublished, setJustPublished] = useState(false);
  const projectId = params.id as string;

  useEffect(() => {
    // Leído del query string en cliente para evitar el bailout de useSearchParams en prerender
    setJustPublished(new URLSearchParams(window.location.search).get('published') === '1');
  }, []);

  const [project, setProject] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      const { data: proj, error: pErr } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      if (pErr) throw pErr;
      setProject(proj);

      const { data: offs, error: oErr } = await supabase
        .from('project_offers')
        .select(`
          id, offer_type, amount, amount_max, message, estimated_days,
          includes_materials, deposit_percent, status, created_at, provider_id,
          providers ( rating, reviews_count, is_verified, category, users ( full_name, avatar_url ) )
        `)
        .eq('project_id', projectId)
        .neq('status', 'withdrawn')
        .order('created_at', { ascending: true });
      if (oErr) throw oErr;

      // Ordenar por calificación del proveedor: aquí no gana el más barato, gana el mejor evaluado
      const sorted = (offs || []).sort((a: any, b: any) =>
        (Number(b.providers?.rating) || 0) - (Number(a.providers?.rating) || 0)
      );
      setOffers(sorted);
    } catch (err) {
      console.error('Error fetching project:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [projectId]);

  const acceptOffer = async (offer: any) => {
    if (!confirm(`¿Aceptar la oferta de ${offer.providers?.users?.full_name || 'este proveedor'}? Se compartirán sus datos de contacto contigo y las demás ofertas se cerrarán.`)) return;
    setAccepting(offer.id);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Inicia sesión de nuevo.');

      // 1. Crear la orden que conecta con el flujo existente (pago, seguimiento)
      const { data: order, error: ordErr } = await supabase
        .from('orders')
        .insert({
          display_id: genDisplayId('ORD'),
          client_id: user.id,
          provider_id: offer.provider_id,
          service_requested: `${project.category}: ${project.title}`,
          status: 'pending',
          total_amount: offer.amount || 0,
          payment_status: 'pending',
        })
        .select('id')
        .single();
      if (ordErr) throw ordErr;

      // 2. Marcar oferta aceptada y cerrar las demás
      const { error: accErr } = await supabase
        .from('project_offers')
        .update({ status: 'accepted' })
        .eq('id', offer.id);
      if (accErr) throw accErr;

      await supabase
        .from('project_offers')
        .update({ status: 'declined' })
        .eq('project_id', projectId)
        .neq('id', offer.id)
        .eq('status', 'active');

      // 3. Asignar el proyecto
      const { error: projErr } = await supabase
        .from('projects')
        .update({ status: 'assigned', accepted_offer_id: offer.id, order_id: order.id })
        .eq('id', projectId);
      if (projErr) throw projErr;

      router.push(`/cliente/ordenes/${order.id}`);
    } catch (err: any) {
      console.error('Error accepting offer:', err);
      setError(err.message || 'No se pudo aceptar la oferta.');
      setAccepting(null);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Cargando proyecto...</p>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6 px-8">
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Proyecto no encontrado</p>
        <Link href="/cliente/proyectos"><Button variant="ghost" className="text-primary text-[10px] font-black uppercase">Volver a mis proyectos</Button></Link>
      </main>
    );
  }

  const st = PROJECT_STATUS_LABELS[project.status] ?? { label: project.status, tone: 'default' as const };

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <header className="px-8 py-10 flex items-center gap-4 sticky top-0 bg-slate-50/90 backdrop-blur-xl z-50">
        <Link href="/cliente/proyectos" className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-primary">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] font-mono">{project.display_id}</span>
          <h1 className="text-xl font-black text-brand-night uppercase tracking-tighter leading-tight">{project.title}</h1>
        </div>
        <Badge variant={st.tone} className="text-[9px] font-black uppercase px-3 py-1.5">{st.label}</Badge>
      </header>

      <div className="px-8 max-w-3xl mx-auto space-y-6">
        {justPublished && project.status === 'pending_review' && (
          <Card className="p-6 rounded-[2rem] border-none bg-amber-50 flex items-start gap-4">
            <Clock size={22} className="text-amber-500 flex-none mt-0.5" />
            <div>
              <p className="text-xs font-black text-amber-700 uppercase tracking-wide mb-1">Tu proyecto está en revisión</p>
              <p className="text-xs font-medium text-amber-600">Nuestro equipo lo revisa antes de publicarlo (normalmente en menos de 2 horas hábiles). En cuanto se apruebe, los proveedores verificados de tu zona podrán enviarte ofertas.</p>
            </div>
          </Card>
        )}

        {project.status === 'rejected' && project.moderation_note && (
          <Card className="p-6 rounded-[2rem] border-none bg-red-50 flex items-start gap-4">
            <X size={22} className="text-red-500 flex-none mt-0.5" />
            <div>
              <p className="text-xs font-black text-red-700 uppercase tracking-wide mb-1">Tu proyecto necesita ajustes</p>
              <p className="text-xs font-medium text-red-600">{project.moderation_note}</p>
            </div>
          </Card>
        )}

        {/* Detalle del proyecto */}
        <Card className="p-8 rounded-[2.5rem] border-none shadow-card bg-white space-y-5">
          <p className="text-sm font-medium text-slate-500 whitespace-pre-wrap">{project.description}</p>
          {project.photos?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {project.photos.map((url: string, i: number) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={url} alt={`Foto ${i + 1}`} className="w-24 h-24 rounded-2xl object-cover" />
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-50">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{project.category}</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <MapPin size={13} />
              <span className="text-[10px] font-bold uppercase">{project.zone}{project.neighborhood ? ` · ${project.neighborhood}` : ''}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar size={13} />
              <span className="text-[10px] font-bold uppercase">{timingLabel(project.timing)}</span>
            </div>
            {(project.budget_min || project.budget_max) && (
              <span className="ml-auto text-xs font-black text-emerald-500 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                {project.budget_min ? formatMXN(project.budget_min) : ''}{project.budget_min && project.budget_max ? ' – ' : ''}{project.budget_max ? formatMXN(project.budget_max) : ''}
              </span>
            )}
          </div>
        </Card>

        {/* Ofertas */}
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-black text-brand-night uppercase tracking-widest flex items-center gap-2">
            <Users size={16} className="text-primary" /> Ofertas recibidas
          </h2>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{project.offers_count}/{project.max_offers}</span>
        </div>

        {error && <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-xs font-bold text-red-600">{error}</div>}

        {offers.length === 0 && project.status === 'open' && (
          <div className="p-12 border-4 border-dashed border-slate-100 rounded-[3rem] text-center">
            <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">Aún no hay ofertas — los proveedores de tu zona ya fueron notificados</p>
          </div>
        )}

        {offers.map(offer => {
          const prov = offer.providers;
          const name = prov?.users?.full_name || 'Proveedor';
          const isAccepted = offer.status === 'accepted';
          const isDeclined = offer.status === 'declined';
          return (
            <Card key={offer.id} className={`p-7 rounded-[2.5rem] border-none shadow-card bg-white space-y-4 ${isDeclined ? 'opacity-50' : ''} ${isAccepted ? 'ring-2 ring-primary' : ''}`}>
              <div className="flex items-center gap-4">
                <Avatar src={prov?.users?.avatar_url} name={name} className="w-14 h-14 rounded-2xl" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-brand-night uppercase tracking-tight">{name}</h3>
                    {prov?.is_verified && <BadgeCheck size={16} className="text-primary" />}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-black text-slate-500">{Number(prov?.rating || 0).toFixed(1)}</span>
                      <span className="text-[10px] font-bold text-slate-300">({prov?.reviews_count || 0})</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">{prov?.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  {offer.offer_type === 'price' ? (
                    <>
                      <p className="text-xl font-black text-brand-night">{formatMXN(offer.amount)}{offer.amount_max ? ` – ${formatMXN(offer.amount_max)}` : ''}</p>
                      {offer.estimated_days && <p className="text-[10px] font-bold text-slate-300 uppercase">{offer.estimated_days} días est.</p>}
                    </>
                  ) : (
                    <Badge variant="default" className="text-[9px] font-black uppercase px-3 py-1.5">Visita gratis para cotizar</Badge>
                  )}
                </div>
              </div>

              <p className="text-sm font-medium text-slate-500 bg-slate-50 rounded-2xl p-4">{offer.message}</p>

              <div className="flex flex-wrap items-center gap-3">
                {offer.offer_type === 'price' && (
                  <span className="text-[10px] font-black uppercase tracking-wide text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                    {offer.includes_materials ? 'Incluye materiales' : 'Sin materiales'}
                  </span>
                )}
                {offer.deposit_percent > 0 && offer.offer_type === 'price' && (
                  <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-primary bg-primary/5 px-3 py-1 rounded-full">
                    <ShieldCheck size={12} /> Anticipo {offer.deposit_percent}% protegido
                  </span>
                )}
                <span className="text-[10px] font-bold text-slate-300 ml-auto">{timeAgo(offer.created_at)}</span>
              </div>

              {project.status === 'open' && offer.status === 'active' && (
                <Button
                  onClick={() => acceptOffer(offer)}
                  disabled={accepting !== null}
                  variant="primary"
                  className="w-full h-13 py-4 rounded-2xl bg-brand-night text-white hover:bg-slate-800 border-none shadow-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  {accepting === offer.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  Aceptar esta oferta
                </Button>
              )}
              {isAccepted && (
                <div className="flex items-center gap-2 justify-center py-2 text-primary">
                  <Check size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Oferta aceptada</span>
                  {project.order_id && (
                    <Link href={`/cliente/ordenes/${project.order_id}`} className="ml-2 underline text-[10px] font-black uppercase tracking-widest">Ver orden</Link>
                  )}
                </div>
              )}
            </Card>
          );
        })}

        <Card className="p-6 rounded-[2rem] border-none bg-primary/5 flex items-start gap-4">
          <ShieldCheck size={22} className="text-primary flex-none mt-0.5" />
          <p className="text-xs font-medium text-slate-500"><strong className="text-brand-night font-black uppercase text-[11px] tracking-wide">Garantía I mendly · </strong>Al aceptar una oferta y pagar dentro de la plataforma, tu anticipo y tu pago quedan protegidos y el trabajo cuenta con garantía. Los tratos fuera de la plataforma no tienen protección ni respaldo.</p>
        </Card>
      </div>
    </main>
  );
}
