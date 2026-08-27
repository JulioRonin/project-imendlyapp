"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import {
  ArrowLeft, BadgeCheck, Calendar, Check, Clock,
  Loader2, MapPin, ShieldCheck, Users, X
} from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { PROJECT_STATUS_LABELS, timingLabel, timeAgo, formatMXN, genDisplayId } from '../../../../lib/tablero';
import { ClientNav } from '@/components/client/ClientNav';
import { RatingPill } from '@/components/client/ui';

const STATUS_PILL: Record<'default' | 'success' | 'warning' | 'error', string> = {
  success: 'bg-[#E9F7EF] text-primary',
  warning: 'bg-amber-50 text-amber-700',
  error: 'bg-red-50 text-red-600',
  default: 'bg-black/[0.05] text-[#70756E]',
};

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
      <main className="min-h-screen bg-[#F3F4F1] pb-36">
        <div className="max-w-3xl mx-auto px-6 pt-6 space-y-4">
          <div className="v2-rise h-12 w-2/3 rounded-full v2-shimmer" />
          <div className="v2-rise v2-d1 h-56 rounded-[2.25rem] v2-shimmer" />
          <div className="v2-rise v2-d2 h-64 rounded-[1.75rem] v2-shimmer" />
          <div className="v2-rise v2-d3 h-64 rounded-[1.75rem] v2-shimmer" />
        </div>
        <ClientNav />
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-[#F3F4F1] pb-36 flex flex-col items-center justify-center gap-6 px-6 text-center">
        <span className="v2-rise w-20 h-20 rounded-[1.4rem] bg-[#E9F7EF] text-primary flex items-center justify-center">
          <X size={30} />
        </span>
        <div className="v2-rise v2-d1">
          <h1 className="text-[19px] font-semibold tracking-tight text-[#151714] mb-1">Proyecto no encontrado</h1>
          <p className="text-[14px] font-medium text-[#70756E]">Puede que se haya eliminado o el enlace sea incorrecto.</p>
        </div>
        <Link
          href="/cliente/proyectos"
          className="v2-rise v2-d2 h-14 px-8 rounded-full bg-primary text-white text-[13px] font-bold flex items-center justify-center shadow-lg shadow-primary/25 v2-press hover:bg-primary-dark transition-colors"
        >
          Volver a mis proyectos
        </Link>
        <ClientNav />
      </main>
    );
  }

  const st = PROJECT_STATUS_LABELS[project.status] ?? { label: project.status, tone: 'default' as const };

  return (
    <main className="min-h-screen bg-[#F3F4F1] pb-36">
      {/* Header interno v2 */}
      <header className="v2-rise sticky top-0 z-50 bg-[#F3F4F1]/85 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link
            href="/cliente/proyectos"
            aria-label="Volver"
            className="w-12 h-12 shrink-0 rounded-full bg-white v2-shadow-soft flex items-center justify-center text-[#151714] v2-press"
          >
            <ArrowLeft size={19} />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              {project.display_id}
            </p>
            <h1 className="text-[20px] font-semibold tracking-tight text-[#151714] leading-tight truncate">
              {project.title}
            </h1>
          </div>
          <span className={`shrink-0 inline-flex items-center h-8 px-3.5 rounded-full text-[11px] font-bold ${STATUS_PILL[st.tone]}`}>
            {st.label}
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 mt-2 space-y-5">
        {justPublished && project.status === 'pending_review' && (
          <div className="v2-rise v2-d1 rounded-[1.75rem] bg-amber-50 p-6 flex items-start gap-4">
            <span className="w-12 h-12 shrink-0 rounded-[1rem] bg-white text-amber-500 flex items-center justify-center v2-shadow-soft">
              <Clock size={20} />
            </span>
            <div>
              <p className="text-[14px] font-semibold text-amber-800 mb-1">Tu proyecto está en revisión</p>
              <p className="text-[12.5px] font-medium text-amber-700">
                Nuestro equipo lo revisa antes de publicarlo (normalmente en menos de 2 horas hábiles).
                En cuanto se apruebe, los proveedores verificados de tu zona podrán enviarte ofertas.
              </p>
            </div>
          </div>
        )}

        {project.status === 'rejected' && project.moderation_note && (
          <div className="v2-rise v2-d1 rounded-[1.75rem] bg-red-50 p-6 flex items-start gap-4">
            <span className="w-12 h-12 shrink-0 rounded-[1rem] bg-white text-red-500 flex items-center justify-center v2-shadow-soft">
              <X size={20} />
            </span>
            <div>
              <p className="text-[14px] font-semibold text-red-700 mb-1">Tu proyecto necesita ajustes</p>
              <p className="text-[12.5px] font-medium text-red-600">{project.moderation_note}</p>
            </div>
          </div>
        )}

        {/* Detalle del proyecto */}
        <section className="v2-rise v2-d2 bg-white rounded-[2.25rem] v2-shadow-soft p-7 space-y-5">
          <p className="text-[14.5px] font-medium text-[#70756E] whitespace-pre-wrap">{project.description}</p>

          {project.photos?.length > 0 && (
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
              {project.photos.map((url: string, i: number) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={url} alt={`Foto ${i + 1}`} className="w-24 h-24 shrink-0 rounded-[1.25rem] object-cover" />
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5 pt-4 border-t border-black/[0.05]">
            <span className="inline-flex items-center h-7 px-3 rounded-full bg-[#F3F4F1] text-[12px] font-semibold text-[#70756E]">
              {project.category}
            </span>
            <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#A8ADA6]">
              <MapPin size={13} />
              {project.zone}{project.neighborhood ? ` · ${project.neighborhood}` : ''}
            </span>
            <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#A8ADA6]">
              <Calendar size={13} />
              {timingLabel(project.timing)}
            </span>
            {(project.budget_min || project.budget_max) && (
              <span className="ml-auto inline-flex items-center h-8 px-3.5 rounded-full bg-[#E9F7EF] text-primary text-[12.5px] font-bold tabular-nums">
                {project.budget_min ? formatMXN(project.budget_min) : ''}{project.budget_min && project.budget_max ? ' – ' : ''}{project.budget_max ? formatMXN(project.budget_max) : ''}
              </span>
            )}
          </div>
        </section>

        {/* Ofertas */}
        <div className="v2-rise v2-d3 flex items-end justify-between pt-2">
          <h2 className="text-xl font-semibold tracking-tight text-[#151714]">Ofertas recibidas</h2>
          <span className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-[#E9F7EF] text-primary text-[12px] font-bold tabular-nums">
            <Users size={13} /> {project.offers_count}/{project.max_offers}
          </span>
        </div>

        {error && (
          <div className="p-5 rounded-[1.25rem] bg-red-50 text-[12.5px] font-semibold text-red-600">{error}</div>
        )}

        {offers.length === 0 && project.status === 'open' && (
          <div className="v2-rise v2-d4 bg-white rounded-[2.25rem] v2-shadow-soft px-8 py-12 flex flex-col items-center text-center">
            <span className="w-16 h-16 rounded-[1.25rem] bg-[#E9F7EF] text-primary flex items-center justify-center mb-5">
              <Users size={26} />
            </span>
            <h3 className="text-[16px] font-semibold tracking-tight text-[#151714] mb-1.5">Aún no hay ofertas</h3>
            <p className="text-[13.5px] font-medium text-[#70756E] max-w-xs">
              Los proveedores verificados de tu zona ya fueron notificados. Te avisaremos en cuanto llegue la primera.
            </p>
          </div>
        )}

        {offers.map((offer, i) => {
          const prov = offer.providers;
          const name = prov?.users?.full_name || 'Proveedor';
          const isAccepted = offer.status === 'accepted';
          const isDeclined = offer.status === 'declined';
          return (
            <article
              key={offer.id}
              className={`v2-rise v2-d${Math.min(i + 4, 8)} bg-white rounded-[1.75rem] v2-shadow-lift p-6 space-y-4 v2-float ${isDeclined ? 'opacity-50' : ''} ${isAccepted ? 'ring-2 ring-primary' : ''}`}
            >
              {/* Cabecera del proveedor */}
              <div className="flex items-center gap-3.5">
                <Avatar src={prov?.users?.avatar_url} name={name} size="md" className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[15.5px] font-semibold tracking-tight text-[#151714] truncate">{name}</h3>
                    {prov?.is_verified && <BadgeCheck size={16} className="shrink-0 text-primary" />}
                  </div>
                  <p className="text-[12.5px] font-medium text-[#A8ADA6] truncate">
                    {prov?.category} · {prov?.reviews_count || 0} reseñas
                  </p>
                </div>
                <RatingPill value={Number(prov?.rating) || 0} className="shrink-0" />
              </div>

              {/* El monto es protagonista */}
              {offer.offer_type === 'price' ? (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A8ADA6] mb-0.5">Oferta</p>
                  <p className="text-[27px] font-bold tracking-tight text-[#151714] tabular-nums leading-none">
                    {formatMXN(offer.amount)}{offer.amount_max ? ` – ${formatMXN(offer.amount_max)}` : ''}
                  </p>
                </div>
              ) : (
                <span className="inline-flex items-center h-9 px-4 rounded-full bg-[#E9F7EF] text-primary text-[13px] font-bold">
                  Visita gratis para cotizar
                </span>
              )}

              {offer.message && (
                <p className="text-[13.5px] font-medium text-[#70756E] bg-[#FAFBF8] rounded-[1.25rem] p-4">
                  {offer.message}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
                {offer.offer_type === 'price' && (
                  <span className="inline-flex items-center h-7 px-3 rounded-full bg-[#F3F4F1] text-[12px] font-semibold text-[#70756E]">
                    {offer.includes_materials ? 'Incluye materiales' : 'Sin materiales'}
                  </span>
                )}
                {offer.offer_type === 'price' && offer.estimated_days && (
                  <span className="inline-flex items-center h-7 px-3 rounded-full bg-[#F3F4F1] text-[12px] font-semibold text-[#70756E] tabular-nums">
                    {offer.estimated_days} días est.
                  </span>
                )}
                {offer.deposit_percent > 0 && offer.offer_type === 'price' && (
                  <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-[#E9F7EF] text-primary text-[12px] font-bold">
                    <ShieldCheck size={12} /> Anticipo {offer.deposit_percent}% protegido
                  </span>
                )}
                <span className="ml-auto text-[12px] font-medium text-[#A8ADA6]">{timeAgo(offer.created_at)}</span>
              </div>

              {project.status === 'open' && offer.status === 'active' && (
                <button
                  type="button"
                  onClick={() => acceptOffer(offer)}
                  disabled={accepting !== null}
                  className="w-full h-14 rounded-full bg-[#151714] text-white text-[13px] font-bold flex items-center justify-center gap-2 v2-press hover:bg-black transition-colors disabled:opacity-60"
                >
                  {accepting === offer.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  Aceptar esta oferta
                </button>
              )}
              {isAccepted && (
                <div className="flex items-center justify-center gap-2 h-12 rounded-full bg-[#E9F7EF] text-primary">
                  <Check size={16} />
                  <span className="text-[13px] font-bold">Oferta aceptada</span>
                  {project.order_id && (
                    <Link
                      href={`/cliente/ordenes/${project.order_id}`}
                      className="ml-1 text-[13px] font-bold underline underline-offset-2"
                    >
                      Ver orden
                    </Link>
                  )}
                </div>
              )}
            </article>
          );
        })}

        {/* Garantía */}
        <div className="v2-rise v2-d8 rounded-[2.25rem] bg-[#E9F7EF] p-7 flex items-start gap-4">
          <span className="w-12 h-12 shrink-0 rounded-[1rem] bg-white text-primary flex items-center justify-center v2-shadow-soft">
            <ShieldCheck size={22} />
          </span>
          <div>
            <p className="text-[14px] font-semibold text-[#151714] mb-1">Garantía I mendly</p>
            <p className="text-[12.5px] font-medium text-[#70756E]">
              Al aceptar una oferta y pagar dentro de la plataforma, tu anticipo y tu pago quedan
              protegidos y el trabajo cuenta con garantía. Los tratos fuera de la plataforma no
              tienen protección ni respaldo.
            </p>
          </div>
        </div>
      </div>

      <ClientNav />
    </main>
  );
}
