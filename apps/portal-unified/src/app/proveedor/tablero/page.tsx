"use client";

import { useEffect, useState } from 'react';
import {
  Calendar, Check, ClipboardList, Filter, Hammer, Loader2,
  MapPin, Send, ShieldCheck, Users, X, Trophy
} from 'lucide-react';
import { providerTakeHome, isTier, formatMxn, TIER_LABEL, type ProviderTier } from '@/lib/pricing';
import { supabase } from '../../../lib/supabase';
import {
  OFFER_STATUS_LABELS, findContactInfo, formatMXN, timeAgo, timingLabel
} from '../../../lib/tablero';

type Tab = 'disponibles' | 'mis-ofertas';

const EYEBROW = 'text-[10px] font-bold uppercase tracking-[0.18em]';
const INPUT_CLS = 'w-full h-14 px-5 bg-cream rounded-[1.25rem] border-0 text-[15px] font-semibold text-ink tabular-nums placeholder:text-faint placeholder:font-medium outline-none focus:ring-2 focus:ring-primary/30 transition-shadow';
const PILL_BASE = 'h-12 px-4 rounded-full text-[13px] font-semibold v2-press transition-colors duration-300';
const PILL_ON = 'bg-ink text-white v2-shadow-lift';
const PILL_OFF = 'bg-cream text-muted hover:text-ink';

const OFFER_TONE: Record<string, string> = {
  active: 'bg-primary-light text-primary-deep',
  accepted: 'bg-mint-light text-mint-deep',
  declined: 'bg-sand text-muted',
  withdrawn: 'bg-sand text-faint',
};

export default function TableroProveedorPage() {
  const [tab, setTab] = useState<Tab>('disponibles');
  const [isLoading, setIsLoading] = useState(true);
  const [provider, setProvider] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [myOffers, setMyOffers] = useState<any[]>([]);
  const [onlyMyCategory, setOnlyMyCategory] = useState(true);

  // Formulario de oferta
  const [offeringOn, setOfferingOn] = useState<string | null>(null);
  const [offerType, setOfferType] = useState<'price' | 'visit'>('price');
  const [amount, setAmount] = useState('');
  const [amountMax, setAmountMax] = useState('');
  const [message, setMessage] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('');
  const [includesMaterials, setIncludesMaterials] = useState(false);
  const [depositPercent, setDepositPercent] = useState(30);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setIsLoading(false); return; }

      const { data: prov } = await supabase
        .from('providers')
        .select('id, category, categories, zones, is_verified, account_status, tier')
        .eq('id', user.id)
        .single();
      setProvider(prov);

      const { data: offs } = await supabase
        .from('project_offers')
        .select('id, project_id, offer_type, amount, amount_max, message, status, created_at, projects ( display_id, title, category, zone, status )')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });
      setMyOffers(offs || []);

      let query = supabase
        .from('projects')
        .select('id, display_id, category, title, description, photos, zone, neighborhood, budget_min, budget_max, timing, offers_count, max_offers, created_at')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      const cats: string[] = (prov?.categories?.length ? prov.categories : [prov?.category]).filter(Boolean);
      if (onlyMyCategory && cats.length) query = query.in('category', cats);

      const { data: projs } = await query;
      const offeredIds = new Set((offs || []).map((o: any) => o.project_id));
      setProjects((projs || []).map((p: any) => ({ ...p, alreadyOffered: offeredIds.has(p.id) })));
    } catch (err) {
      console.error('Error fetching tablero:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [onlyMyCategory]);

  const resetForm = () => {
    setOfferingOn(null); setOfferType('price'); setAmount(''); setAmountMax('');
    setMessage(''); setEstimatedDays(''); setIncludesMaterials(false);
    setDepositPercent(30); setFormError(null);
  };

  const submitOffer = async (project: any) => {
    setFormError(null);
    const contactIssue = findContactInfo(message);
    if (contactIssue) {
      setFormError(`Tu mensaje contiene ${contactIssue}. El contacto se comparte automáticamente cuando el cliente acepta tu oferta — compartirlo antes es causa de strike.`);
      return;
    }
    if (message.trim().length < 20) {
      setFormError('Describe tu propuesta en al menos 20 caracteres. Los clientes eligen ofertas claras.');
      return;
    }
    if (offerType === 'price' && !amount) {
      setFormError('Indica el precio de tu oferta, o cambia a "Necesito visita para cotizar".');
      return;
    }
    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Inicia sesión de nuevo.');

      const { error: insErr } = await supabase.from('project_offers').insert({
        project_id: project.id,
        provider_id: user.id,
        offer_type: offerType,
        amount: offerType === 'price' ? Number(amount) : null,
        amount_max: offerType === 'price' && amountMax ? Number(amountMax) : null,
        message: message.trim(),
        estimated_days: estimatedDays ? Number(estimatedDays) : null,
        includes_materials: includesMaterials,
        deposit_percent: offerType === 'price' ? depositPercent : 0,
      });
      if (insErr) throw insErr;
      resetForm();
      fetchData();
    } catch (err: any) {
      console.error('Error sending offer:', err);
      setFormError(err.message?.includes('máximo de ofertas')
        ? 'Este proyecto ya alcanzó el máximo de 5 ofertas.'
        : err.message?.includes('duplicate')
          ? 'Ya enviaste una oferta a este proyecto.'
          : (err.message || 'No se pudo enviar la oferta.'));
    } finally {
      setSending(false);
    }
  };

  const TABS = [
    { id: 'disponibles', label: 'Disponibles', count: projects.length },
    { id: 'mis-ofertas', label: 'Mis ofertas', count: myOffers.length },
  ] as const;

  return (
    <main className="flex-1 min-w-0 bg-linen pb-24">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        {/* ── Cabecera editorial ── */}
        <header className="pt-10 md:pt-12">
          <p className={`v3-blur-in ${EYEBROW} text-primary-deep`}>Clientes buscando tu trabajo</p>
          <h1 className="v3-blur-in text-[34px] md:text-[44px] font-semibold tracking-tight leading-[1.02] text-ink mt-2" style={{ animationDelay: '100ms' }}>
            Tablero de proyectos
          </h1>
          <p className="v3-blur-in mt-2 text-[14px] font-medium text-muted" style={{ animationDelay: '200ms' }}>
            Oferta en proyectos abiertos de tu zona y gana nuevos clientes
          </p>
        </header>

        {/* ── Tabs subrayadas + filtro ── */}
        <div className="v3-blur-in mt-9 flex items-end gap-7" style={{ animationDelay: '300ms' }}>
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`relative shrink-0 pb-3 text-[14px] transition-colors duration-300 tabular-nums ${active ? 'font-semibold text-ink' : 'font-medium text-faint hover:text-muted'}`}
              >
                {t.label} ({t.count})
                <span className={`absolute left-0 right-0 -bottom-px h-[3px] rounded-full bg-lavender transition-transform duration-500 origin-left ${active ? 'scale-x-100' : 'scale-x-0'}`} />
              </button>
            );
          })}
          {tab === 'disponibles' && (
            <button
              type="button"
              onClick={() => setOnlyMyCategory(v => !v)}
              className={`ml-auto mb-1.5 h-10 px-4 rounded-full text-[12.5px] font-semibold flex items-center gap-2 v2-press transition-colors duration-300 ${
                onlyMyCategory ? 'bg-lavender text-ink' : 'bg-cream text-muted v2-shadow-soft'
              }`}
            >
              <Filter size={13} /> {onlyMyCategory ? 'Mi especialidad' : 'Todas'}
            </button>
          )}
        </div>

        {isLoading && (
          <div className="mt-6 space-y-4">
            {[0, 1, 2].map(i => <div key={i} className="h-56 rounded-[2.25rem] v2-shimmer" />)}
          </div>
        )}

        {/* TAB: Disponibles */}
        {!isLoading && tab === 'disponibles' && (
          <div className="mt-6 space-y-4">
            {projects.length === 0 && (
              <div className="v2-rise bg-cream rounded-[2.25rem] px-8 py-14 flex flex-col items-center text-center v2-shadow-soft">
                <span className="w-16 h-16 rounded-[1.4rem] bg-primary-light text-primary-deep flex items-center justify-center mb-5">
                  <Hammer size={26} />
                </span>
                <h3 className="text-[19px] font-semibold tracking-tight text-ink">Sin proyectos abiertos</h3>
                <p className="mt-1.5 text-[13.5px] font-medium text-muted max-w-xs">
                  No hay proyectos abiertos {onlyMyCategory ? 'en tu especialidad' : ''} por ahora. Te avisaremos cuando un cliente publique uno.
                </p>
                {onlyMyCategory && (
                  <button type="button" onClick={() => setOnlyMyCategory(false)} className="mt-6 h-12 px-6 rounded-full bg-ink text-white text-[13px] font-bold v2-press">
                    Ver todas las categorías
                  </button>
                )}
              </div>
            )}

            {projects.map((p, i) => (
              <article key={p.id} className={`v2-rise v2-d${Math.min(i + 1, 8)} bg-cream rounded-[2.25rem] p-6 md:p-7 v2-shadow-soft space-y-4`}>
                <div className="flex items-center justify-between gap-3">
                  <span className={`${EYEBROW} text-primary-deep`}>{p.display_id}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-medium text-faint">{timeAgo(p.created_at)}</span>
                    <span className={`inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-[11.5px] font-semibold tabular-nums ${
                      p.offers_count >= p.max_offers ? 'bg-rose/20 text-error' : 'bg-primary-light text-primary-deep'
                    }`}>
                      <Users size={12} /> {p.offers_count}/{p.max_offers} ofertas
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-[21px] font-semibold tracking-tight leading-tight text-ink">{p.title}</h3>
                  <p className="mt-2 text-[14px] font-medium text-muted line-clamp-3 leading-relaxed">{p.description}</p>
                </div>

                {p.photos?.length > 0 && (
                  <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
                    {p.photos.slice(0, 4).map((url: string, i: number) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={url} alt={`Foto ${i + 1}`} className="w-20 h-20 shrink-0 rounded-[1.25rem] object-cover" />
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center h-8 px-3.5 rounded-full bg-sand text-[12.5px] font-semibold text-ink">{p.category}</span>
                  <span className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-sand text-[12.5px] font-semibold text-muted">
                    <MapPin size={12} className="text-faint" /> {p.zone}
                  </span>
                  <span className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-sand text-[12.5px] font-semibold text-muted">
                    <Calendar size={12} className="text-faint" /> {timingLabel(p.timing)}
                  </span>
                  {(p.budget_min || p.budget_max) && (
                    <span className="ml-auto inline-flex items-center h-8 px-3.5 rounded-full bg-primary-light text-primary-deep text-[13px] font-bold tabular-nums">
                      {p.budget_min ? formatMXN(p.budget_min) : ''}{p.budget_min && p.budget_max ? ' – ' : ''}{p.budget_max ? formatMXN(p.budget_max) : ''}
                    </span>
                  )}
                </div>

                {/* CTA / formulario */}
                {p.alreadyOffered ? (
                  <div className="flex items-center justify-center gap-2 h-12 bg-mint-light rounded-full text-mint-deep">
                    <Check size={15} /><span className="text-[13px] font-semibold">Ya enviaste tu oferta</span>
                  </div>
                ) : p.offers_count >= p.max_offers ? (
                  <div className="flex items-center justify-center gap-2 h-12 bg-sand rounded-full text-muted">
                    <X size={15} /><span className="text-[13px] font-semibold">Cupo de ofertas lleno</span>
                  </div>
                ) : offeringOn === p.id ? (
                  <div className="v2-scale bg-sand rounded-[1.75rem] p-5 md:p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`${EYEBROW} text-primary-deep`}>Tu oferta</p>
                        <h4 className="mt-1 text-[17px] font-semibold tracking-tight text-ink">Propón tu precio o una visita</h4>
                      </div>
                      <button type="button" onClick={resetForm} aria-label="Cancelar" className="w-10 h-10 rounded-full bg-cream text-ink flex items-center justify-center v2-press"><X size={16} /></button>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setOfferType('price')}
                        className={`${PILL_BASE} ${offerType === 'price' ? PILL_ON : PILL_OFF}`}
                      >
                        Doy precio directo
                      </button>
                      <button
                        type="button"
                        onClick={() => setOfferType('visit')}
                        className={`${PILL_BASE} ${offerType === 'visit' ? PILL_ON : PILL_OFF}`}
                      >
                        Necesito visita (gratis)
                      </button>
                    </div>

                    {offerType === 'price' && (
                      <>
                        <div className="flex items-center gap-3">
                          <input
                            value={amount}
                            onChange={e => setAmount(e.target.value.replace(/\D/g, ''))}
                            placeholder="Precio $"
                            inputMode="numeric"
                            className={INPUT_CLS}
                          />
                          <input
                            value={amountMax}
                            onChange={e => setAmountMax(e.target.value.replace(/\D/g, ''))}
                            placeholder="Hasta $ (opcional)"
                            inputMode="numeric"
                            className={INPUT_CLS}
                          />
                        </div>
                        {Number(amount) > 0 && (() => {
                          const tier: ProviderTier = isTier(provider?.tier) ? provider.tier : 'verificado';
                          const take = providerTakeHome(Number(amount), tier);
                          return (
                            <p className="px-1 text-[12.5px] font-medium text-muted tabular-nums">
                              Recibes <span className="font-semibold text-ink">{formatMxn(take.net)}</span> · comisión {TIER_LABEL[tier]} con IVA {formatMxn(take.commission)}
                              {amountMax ? ' · se cobra el monto inicial del rango' : ''}
                            </p>
                          );
                        })()}
                        <div className="flex items-center gap-3">
                          <input
                            value={estimatedDays}
                            onChange={e => setEstimatedDays(e.target.value.replace(/\D/g, ''))}
                            placeholder="Días estimados"
                            inputMode="numeric"
                            className={INPUT_CLS}
                          />
                          <button
                            type="button"
                            onClick={() => setIncludesMaterials(v => !v)}
                            className={`flex-1 h-14 shrink-0 ${PILL_BASE} ${includesMaterials ? PILL_ON : PILL_OFF}`}
                          >
                            {includesMaterials ? '✓ Incluye materiales' : 'Sin materiales'}
                          </button>
                        </div>
                        <div>
                          <label className={`${EYEBROW} text-muted mb-2 flex items-center gap-2 tabular-nums`}>
                            <ShieldCheck size={13} className="text-primary-deep" /> Anticipo protegido: {depositPercent}%
                          </label>
                          <input
                            type="range" min={0} max={50} step={10}
                            value={depositPercent}
                            onChange={e => setDepositPercent(Number(e.target.value))}
                            className="w-full"
                            style={{ accentColor: '#FFAA78' }}
                          />
                          <p className="text-[12px] font-medium text-muted mt-1.5">El cliente paga el anticipo por la plataforma — tú arrancas con dinero seguro y él con garantía.</p>
                        </div>
                      </>
                    )}

                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder={offerType === 'price'
                        ? 'Explica qué incluye tu precio y por qué eres la mejor opción. Sin teléfonos ni redes — el contacto se comparte al aceptar tu oferta.'
                        : 'Explica por qué necesitas ver el trabajo y qué evaluarás en la visita. Sin teléfonos ni redes.'}
                      rows={3}
                      maxLength={500}
                      className="w-full px-5 py-4 rounded-[1.25rem] bg-cream border-0 outline-none focus:ring-2 focus:ring-primary/30 text-[14px] font-medium text-ink placeholder:text-faint resize-none transition-shadow"
                    />

                    {formError && <div className="p-4 rounded-[1.25rem] bg-error/10 text-[12.5px] font-semibold text-error">{formError}</div>}

                    <button
                      type="button"
                      onClick={() => submitOffer(p)}
                      disabled={sending}
                      className="w-full h-14 rounded-full bg-primary hover:bg-primary-dark text-ink text-[13px] font-bold flex items-center justify-center gap-2 v2-press transition-colors disabled:opacity-70"
                    >
                      {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
                      Enviar oferta
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => { resetForm(); setOfferingOn(p.id); }}
                    className="w-full h-14 rounded-full bg-ink text-white text-[13px] font-bold flex items-center justify-center gap-2 v2-press"
                  >
                    <Send size={15} /> Ofertar en este proyecto
                  </button>
                )}
              </article>
            ))}
          </div>
        )}

        {/* TAB: Mis ofertas */}
        {!isLoading && tab === 'mis-ofertas' && (
          <div className="mt-6 space-y-3">
            {myOffers.length === 0 && (
              <div className="v2-rise bg-cream rounded-[2.25rem] px-8 py-14 flex flex-col items-center text-center v2-shadow-soft">
                <span className="w-16 h-16 rounded-[1.4rem] bg-primary-light text-primary-deep flex items-center justify-center mb-5">
                  <ClipboardList size={26} />
                </span>
                <h3 className="text-[19px] font-semibold tracking-tight text-ink">Aún no has enviado ofertas</h3>
                <p className="mt-1.5 text-[13.5px] font-medium text-muted max-w-xs">Revisa los proyectos disponibles y envía tu primera propuesta.</p>
                <button type="button" onClick={() => setTab('disponibles')} className="mt-6 h-12 px-6 rounded-full bg-ink text-white text-[13px] font-bold v2-press">
                  Ver proyectos
                </button>
              </div>
            )}
            {myOffers.map((o, i) => {
              const st = OFFER_STATUS_LABELS[o.status] ?? { label: o.status, tone: 'default' as const };
              return (
                <article key={o.id} className={`v2-rise v2-d${Math.min(i + 1, 8)} bg-cream rounded-[1.75rem] p-5 md:p-6 v2-shadow-soft`}>
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <span className={`${EYEBROW} text-primary-deep`}>{o.projects?.display_id}</span>
                    <span className={`inline-flex items-center h-7 px-3 rounded-full text-[11px] font-semibold ${OFFER_TONE[o.status] || 'bg-sand text-muted'}`}>{st.label}</span>
                  </div>
                  <h3 className="text-[17px] font-semibold tracking-tight text-ink leading-tight">{o.projects?.title}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[12.5px] font-medium text-muted">{o.projects?.category} · {o.projects?.zone}</span>
                    <span className="ml-auto text-[19px] font-bold tabular-nums tracking-tight text-ink">
                      {o.offer_type === 'price' ? formatMXN(o.amount) : 'Visita para cotizar'}
                    </span>
                  </div>
                  {o.status === 'accepted' && (
                    <div className="mt-4 flex items-center gap-3 p-4 rounded-[1.25rem] bg-mint-light text-mint-deep">
                      <Trophy size={16} className="shrink-0" />
                      <p className="text-[13px] font-semibold">¡El cliente te eligió! Revisa tus órdenes para coordinar.</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
