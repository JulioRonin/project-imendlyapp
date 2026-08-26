"use client";

import { useEffect, useState } from 'react';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Button } from '@i-mendly/shared/components/Button';
import {
  Calendar, Check, ClipboardList, Filter, Hammer, Loader2,
  MapPin, Newspaper, Send, ShieldCheck, Users, X
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import {
  OFFER_STATUS_LABELS, findContactInfo, formatMXN, timeAgo, timingLabel
} from '../../../lib/tablero';

type Tab = 'disponibles' | 'mis-ofertas';

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
        .select('id, category, categories, zones, is_verified, account_status')
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

  return (
    <main className="min-h-screen bg-slate-50 pb-24 flex-1">
      <header className="px-8 py-10 flex items-center justify-between sticky top-0 bg-slate-50/90 backdrop-blur-xl z-40">
        <div className="flex items-center gap-4">
          <Newspaper className="text-primary w-8 h-8" strokeWidth={2.5} />
          <div>
            <h1 className="text-2xl font-black text-brand-night uppercase tracking-tighter">Tablero de Proyectos</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Clientes buscando tu trabajo — oferta y gana</p>
          </div>
        </div>
      </header>

      <div className="px-8 max-w-4xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTab('disponibles')}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'disponibles' ? 'bg-brand-night text-white shadow-lg' : 'bg-white text-slate-400 shadow-sm hover:text-brand-night'}`}
          >
            Disponibles ({projects.length})
          </button>
          <button
            onClick={() => setTab('mis-ofertas')}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'mis-ofertas' ? 'bg-brand-night text-white shadow-lg' : 'bg-white text-slate-400 shadow-sm hover:text-brand-night'}`}
          >
            Mis ofertas ({myOffers.length})
          </button>
          {tab === 'disponibles' && (
            <button
              onClick={() => setOnlyMyCategory(v => !v)}
              className={`ml-auto flex items-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${onlyMyCategory ? 'bg-primary/10 text-primary' : 'bg-white text-slate-400 shadow-sm'}`}
            >
              <Filter size={14} /> {onlyMyCategory ? 'Mi especialidad' : 'Todas'}
            </button>
          )}
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Buscando proyectos...</p>
          </div>
        )}

        {/* TAB: Disponibles */}
        {!isLoading && tab === 'disponibles' && (
          <>
            {projects.length === 0 && (
              <div className="p-16 border-4 border-dashed border-slate-100 rounded-[3.5rem] flex flex-col items-center text-center">
                <Hammer size={32} className="text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No hay proyectos abiertos {onlyMyCategory ? 'en tu especialidad' : ''} por ahora</p>
                {onlyMyCategory && (
                  <button onClick={() => setOnlyMyCategory(false)} className="mt-4 text-primary text-[10px] font-black uppercase tracking-widest underline">Ver todas las categorías</button>
                )}
              </div>
            )}

            {projects.map(p => (
              <Card key={p.id} className="p-7 rounded-[2.5rem] border-none shadow-card bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] font-mono">{p.display_id}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-300">{timeAgo(p.created_at)}</span>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black ${p.offers_count >= p.max_offers ? 'bg-red-50 text-red-400' : 'bg-primary/10 text-primary'}`}>
                      <Users size={12} /> {p.offers_count}/{p.max_offers}
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-black text-brand-night uppercase tracking-tight leading-tight">{p.title}</h3>
                <p className="text-sm font-medium text-slate-500 line-clamp-3">{p.description}</p>

                {p.photos?.length > 0 && (
                  <div className="flex gap-2">
                    {p.photos.slice(0, 4).map((url: string, i: number) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={url} alt={`Foto ${i + 1}`} className="w-16 h-16 rounded-xl object-cover" />
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{p.category}</span>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MapPin size={13} /><span className="text-[10px] font-bold uppercase">{p.zone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar size={13} /><span className="text-[10px] font-bold uppercase">{timingLabel(p.timing)}</span>
                  </div>
                  {(p.budget_min || p.budget_max) && (
                    <span className="ml-auto text-xs font-black text-emerald-500 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                      {p.budget_min ? formatMXN(p.budget_min) : ''}{p.budget_min && p.budget_max ? ' – ' : ''}{p.budget_max ? formatMXN(p.budget_max) : ''}
                    </span>
                  )}
                </div>

                {/* CTA / formulario */}
                {p.alreadyOffered ? (
                  <div className="flex items-center justify-center gap-2 py-3 bg-slate-50 rounded-2xl text-slate-400">
                    <Check size={14} /><span className="text-[10px] font-black uppercase tracking-widest">Ya enviaste tu oferta</span>
                  </div>
                ) : p.offers_count >= p.max_offers ? (
                  <div className="flex items-center justify-center gap-2 py-3 bg-red-50 rounded-2xl text-red-400">
                    <X size={14} /><span className="text-[10px] font-black uppercase tracking-widest">Cupo de ofertas lleno</span>
                  </div>
                ) : offeringOn === p.id ? (
                  <div className="bg-slate-50 rounded-[2rem] p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Tu oferta</p>
                      <button onClick={resetForm} className="text-slate-300 hover:text-red-400"><X size={18} /></button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setOfferType('price')}
                        className={`py-3.5 rounded-2xl border-2 text-[10px] font-black uppercase tracking-wide transition-all ${offerType === 'price' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 bg-white text-slate-400'}`}
                      >
                        Doy precio directo
                      </button>
                      <button
                        onClick={() => setOfferType('visit')}
                        className={`py-3.5 rounded-2xl border-2 text-[10px] font-black uppercase tracking-wide transition-all ${offerType === 'visit' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 bg-white text-slate-400'}`}
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
                            className="flex-1 h-13 py-3.5 px-5 rounded-2xl bg-white border-2 border-transparent focus:border-primary outline-none font-bold text-brand-night placeholder:text-slate-300"
                          />
                          <input
                            value={amountMax}
                            onChange={e => setAmountMax(e.target.value.replace(/\D/g, ''))}
                            placeholder="Hasta $ (opcional)"
                            inputMode="numeric"
                            className="flex-1 h-13 py-3.5 px-5 rounded-2xl bg-white border-2 border-transparent focus:border-primary outline-none font-bold text-brand-night placeholder:text-slate-300"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            value={estimatedDays}
                            onChange={e => setEstimatedDays(e.target.value.replace(/\D/g, ''))}
                            placeholder="Días estimados"
                            inputMode="numeric"
                            className="flex-1 h-13 py-3.5 px-5 rounded-2xl bg-white border-2 border-transparent focus:border-primary outline-none font-bold text-brand-night placeholder:text-slate-300"
                          />
                          <button
                            onClick={() => setIncludesMaterials(v => !v)}
                            className={`flex-1 h-13 py-3.5 rounded-2xl border-2 text-[10px] font-black uppercase tracking-wide transition-all ${includesMaterials ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 bg-white text-slate-400'}`}
                          >
                            {includesMaterials ? '✓ Incluye materiales' : 'Sin materiales'}
                          </button>
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                            <ShieldCheck size={13} className="text-primary" /> Anticipo protegido: {depositPercent}%
                          </label>
                          <input
                            type="range" min={0} max={50} step={10}
                            value={depositPercent}
                            onChange={e => setDepositPercent(Number(e.target.value))}
                            className="w-full accent-[#3DB87A]"
                          />
                          <p className="text-[10px] font-bold text-slate-300 mt-1">El cliente paga el anticipo por la plataforma — tú arrancas con dinero seguro y él con garantía.</p>
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
                      className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-primary outline-none font-medium text-brand-night placeholder:text-slate-300 resize-none text-sm"
                    />

                    {formError && <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-xs font-bold text-red-600">{formError}</div>}

                    <Button
                      onClick={() => submitOffer(p)}
                      disabled={sending}
                      variant="primary"
                      className="w-full py-4 rounded-2xl bg-primary text-white hover:bg-primary-dark border-none shadow-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
                      Enviar oferta
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => { resetForm(); setOfferingOn(p.id); }}
                    variant="primary"
                    className="w-full py-4 rounded-2xl bg-brand-night text-white hover:bg-slate-800 border-none shadow-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <Send size={15} /> Ofertar en este proyecto
                  </Button>
                )}
              </Card>
            ))}
          </>
        )}

        {/* TAB: Mis ofertas */}
        {!isLoading && tab === 'mis-ofertas' && (
          <>
            {myOffers.length === 0 && (
              <div className="p-16 border-4 border-dashed border-slate-100 rounded-[3.5rem] flex flex-col items-center text-center">
                <ClipboardList size={32} className="text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aún no has enviado ofertas</p>
              </div>
            )}
            {myOffers.map(o => {
              const st = OFFER_STATUS_LABELS[o.status] ?? { label: o.status, tone: 'default' as const };
              return (
                <Card key={o.id} className="p-6 rounded-[2rem] border-none shadow-card bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] font-mono">{o.projects?.display_id}</span>
                    <Badge variant={st.tone} className="text-[9px] font-black uppercase px-3 py-1">{st.label}</Badge>
                  </div>
                  <h3 className="font-black text-brand-night uppercase tracking-tight mb-1">{o.projects?.title}</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{o.projects?.category} · {o.projects?.zone}</span>
                    <span className="ml-auto text-sm font-black text-brand-night">
                      {o.offer_type === 'price' ? formatMXN(o.amount) : 'Visita para cotizar'}
                    </span>
                  </div>
                  {o.status === 'accepted' && (
                    <div className="mt-3 p-3 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest text-center">
                      ¡El cliente te eligió! Revisa tus órdenes para coordinar.
                    </div>
                  )}
                </Card>
              );
            })}
          </>
        )}
      </div>
    </main>
  );
}
