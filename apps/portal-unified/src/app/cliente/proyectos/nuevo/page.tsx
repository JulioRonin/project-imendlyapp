"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Camera, Check,
  Loader2, MapPin, ShieldCheck, Trash2, X
} from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import {
  PROJECT_CATEGORIES, PROJECT_ZONES, TIMING_OPTIONS,
  findContactInfo, genDisplayId, formatMXN, timingLabel
} from '../../../../lib/tablero';
import { SegmentBar } from '@/components/client/ui';

const STEPS = ['Tu proyecto', 'Zona y presupuesto', 'Revisar y publicar'];

const LABEL_CLS = 'text-[10px] font-bold uppercase tracking-[0.18em] text-[#7B7267] mb-3 block';
const INPUT_CLS = 'w-full h-14 px-5 rounded-[1.25rem] bg-[#FBF8F2] border-none outline-none focus:ring-2 focus:ring-primary/30 text-[15px] font-semibold text-[#1F1C18] placeholder:text-[#ADA398] placeholder:font-medium transition-shadow';

export default function NuevoProyectoPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [zone, setZone] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [timing, setTiming] = useState('flexible');

  const contactIssue = findContactInfo(`${title} ${description}`);

  const canNext =
    step === 0 ? (category && title.trim().length >= 8 && description.trim().length >= 30 && !contactIssue) :
    step === 1 ? (zone !== '') : true;

  const handlePhotos = (files: FileList | null) => {
    if (!files) return;
    setPhotos(prev => [...prev, ...Array.from(files)].slice(0, 5));
  };

  const publish = async () => {
    setSaving(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Subir fotos al bucket 'projects'
      const photoUrls: string[] = [];
      for (const file of photos) {
        const path = `${user.id}/${Date.now()}-${file.name.replace(/[^\w.]+/g, '_')}`;
        const { error: upErr } = await supabase.storage.from('projects').upload(path, file);
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from('projects').getPublicUrl(path);
        photoUrls.push(pub.publicUrl);
      }

      const { data: project, error: insErr } = await supabase
        .from('projects')
        .insert({
          display_id: genDisplayId('PRJ'),
          client_id: user.id,
          category,
          title: title.trim(),
          description: description.trim(),
          photos: photoUrls,
          zone,
          neighborhood: neighborhood.trim() || null,
          budget_min: budgetMin ? Number(budgetMin) : null,
          budget_max: budgetMax ? Number(budgetMax) : null,
          timing,
          status: 'pending_review',
        })
        .select('id')
        .single();

      if (insErr) throw insErr;
      router.push(`/cliente/proyectos/${project.id}?published=1`);
    } catch (err: any) {
      console.error('Error publishing project:', err);
      setError(err.message || 'No se pudo publicar el proyecto. Intenta de nuevo.');
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F0E8]">
      <div className="max-w-md mx-auto px-6 flex flex-col min-h-screen">
        {/* Header interno v2 */}
        <header className="v2-rise sticky top-0 z-50 bg-[#F4F0E8]/85 backdrop-blur-xl -mx-6 px-6 py-5">
          <div className="flex items-center gap-4">
            <Link
              href="/cliente/proyectos"
              aria-label="Volver"
              className="w-12 h-12 shrink-0 rounded-full bg-white v2-shadow-soft flex items-center justify-center text-[#1F1C18] v2-press"
            >
              <ArrowLeft size={19} />
            </Link>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                Paso {step + 1} de 3
              </p>
              <h1 className="text-[22px] font-semibold tracking-tight text-[#1F1C18] leading-tight">
                {STEPS[step]}
              </h1>
            </div>
          </div>
          <SegmentBar total={3} done={step + 1} className="mt-4" />
        </header>

        <div key={step} className="v2-scale flex-1 mt-2 space-y-5">
          {/* PASO 1: proyecto */}
          {step === 0 && (
            <section className="bg-white rounded-[2.25rem] v2-shadow-soft p-6 space-y-7">
              <div>
                <label className={LABEL_CLS}>¿Qué tipo de trabajo necesitas?</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {PROJECT_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`h-12 px-4 rounded-full text-[13px] font-semibold v2-press transition-colors duration-300 ${
                        category === cat
                          ? 'bg-[#1F1C18] text-white v2-shadow-lift'
                          : 'bg-[#FBF8F2] text-[#7B7267] hover:text-[#1F1C18]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={LABEL_CLS}>Título del proyecto</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ej. Fabricar pérgola para patio de 4×5 m"
                  className={INPUT_CLS}
                  maxLength={90}
                />
              </div>

              <div>
                <label className={LABEL_CLS}>Describe lo que necesitas</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Medidas, materiales que imaginas, estado actual, y todo lo que ayude a cotizar sin visitar. Mínimo 30 caracteres."
                  rows={5}
                  className="w-full px-5 py-4 rounded-[1.25rem] bg-[#FBF8F2] border-none outline-none focus:ring-2 focus:ring-primary/30 text-[14px] font-medium text-[#1F1C18] placeholder:text-[#ADA398] resize-none transition-shadow"
                  maxLength={1200}
                />
                <p className={`mt-2 text-[12px] font-semibold tabular-nums ${description.trim().length < 30 ? 'text-[#ADA398]' : 'text-primary'}`}>
                  {description.trim().length} / 30 mín.
                </p>
              </div>

              {contactIssue && (
                <div className="p-5 rounded-[1.25rem] bg-red-50 flex items-start gap-3.5">
                  <span className="w-9 h-9 shrink-0 rounded-[0.85rem] bg-white flex items-center justify-center text-red-500">
                    <X size={15} />
                  </span>
                  <p className="text-[12.5px] font-medium text-red-600">
                    Detectamos {contactIssue} en el texto. Para tu seguridad, el contacto se comparte
                    dentro de la plataforma al aceptar una oferta — así tu proyecto queda protegido
                    por la Garantía I mendly.
                  </p>
                </div>
              )}

              <div>
                <label className={LABEL_CLS}>Fotos (opcional, máx. 5)</label>
                <div className="flex flex-wrap gap-3">
                  {photos.map((f, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-[1.25rem] overflow-hidden bg-[#FBF8F2]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={URL.createObjectURL(f)} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhotos(p => p.filter((_, j) => j !== i))}
                        aria-label="Quitar foto"
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center v2-press"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))}
                  {photos.length < 5 && (
                    <label className="w-20 h-20 rounded-[1.25rem] bg-[#FBF8F2] flex flex-col items-center justify-center gap-1 text-[#ADA398] cursor-pointer hover:text-primary hover:bg-[#F6E6DD] transition-colors v2-press">
                      <Camera size={20} />
                      <span className="text-[10px] font-semibold">Agregar</span>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={e => handlePhotos(e.target.files)} />
                    </label>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* PASO 2: zona y presupuesto */}
          {step === 1 && (
            <section className="bg-white rounded-[2.25rem] v2-shadow-soft p-6 space-y-7">
              <div>
                <label className={LABEL_CLS}>Zona</label>
                <div className="flex flex-wrap gap-2">
                  {PROJECT_ZONES.map(z => (
                    <button
                      key={z}
                      type="button"
                      onClick={() => setZone(z)}
                      className={`h-11 px-5 rounded-full text-[13px] font-semibold v2-press transition-colors duration-300 ${
                        zone === z
                          ? 'bg-[#1F1C18] text-white v2-shadow-lift'
                          : 'bg-[#FBF8F2] text-[#7B7267] hover:text-[#1F1C18]'
                      }`}
                    >
                      {z}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={LABEL_CLS}>Colonia (opcional)</label>
                <input
                  value={neighborhood}
                  onChange={e => setNeighborhood(e.target.value)}
                  placeholder="Solo la colonia — tu dirección exacta nunca es pública"
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className={LABEL_CLS}>Presupuesto estimado (opcional)</label>
                <div className="flex items-center gap-3">
                  <input
                    value={budgetMin}
                    onChange={e => setBudgetMin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Desde $"
                    inputMode="numeric"
                    className={`${INPUT_CLS} tabular-nums`}
                  />
                  <span className="text-[#ADA398] font-semibold">—</span>
                  <input
                    value={budgetMax}
                    onChange={e => setBudgetMax(e.target.value.replace(/\D/g, ''))}
                    placeholder="Hasta $"
                    inputMode="numeric"
                    className={`${INPUT_CLS} tabular-nums`}
                  />
                </div>
                <p className="text-[12px] font-medium text-[#ADA398] mt-2.5">
                  Un rango orienta mejores ofertas. Si no lo sabes, déjalo vacío y pide visita de cotización.
                </p>
              </div>

              <div>
                <label className={LABEL_CLS}>¿Para cuándo?</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {TIMING_OPTIONS.map(t => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTiming(t.value)}
                      className={`h-12 px-4 rounded-full text-[12.5px] font-semibold v2-press transition-colors duration-300 ${
                        timing === t.value
                          ? 'bg-[#1F1C18] text-white v2-shadow-lift'
                          : 'bg-[#FBF8F2] text-[#7B7267] hover:text-[#1F1C18]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* PASO 3: revisión */}
          {step === 2 && (
            <>
              <section className="bg-white rounded-[2.25rem] v2-shadow-soft p-6 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">{category}</span>
                  <span className="text-[12px] font-semibold text-[#ADA398]">{timingLabel(timing)}</span>
                </div>
                <h2 className="text-[19px] font-semibold tracking-tight text-[#1F1C18] leading-snug">{title}</h2>
                <p className="text-[14px] font-medium text-[#7B7267] whitespace-pre-wrap">{description}</p>

                {photos.length > 0 && (
                  <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
                    {photos.map((f, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={URL.createObjectURL(f)} alt={`Foto ${i + 1}`} className="w-16 h-16 shrink-0 rounded-[1.15rem] object-cover" />
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-black/[0.05]">
                  <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#7B7267]">
                    <MapPin size={13} className="text-[#ADA398]" />
                    {zone}{neighborhood ? ` · ${neighborhood}` : ''}
                  </span>
                  {(budgetMin || budgetMax) && (
                    <span className="ml-auto inline-flex items-center h-8 px-3.5 rounded-full bg-[#F6E6DD] text-primary text-[12.5px] font-bold tabular-nums">
                      {budgetMin ? formatMXN(Number(budgetMin)) : ''}{budgetMin && budgetMax ? ' – ' : ''}{budgetMax ? formatMXN(Number(budgetMax)) : ''}
                    </span>
                  )}
                </div>
              </section>

              <section className="rounded-[1.75rem] bg-[#F6E6DD] p-6 flex items-start gap-4">
                <span className="w-12 h-12 shrink-0 rounded-[1rem] bg-white text-primary flex items-center justify-center v2-shadow-soft">
                  <ShieldCheck size={22} />
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-[#1F1C18] mb-1">Así te protegemos</p>
                  <p className="text-[12.5px] font-medium text-[#7B7267]">
                    Tu proyecto pasa una revisión rápida antes de publicarse. Solo proveedores
                    verificados de tu zona podrán ofertar (máximo 5 ofertas). Tu dirección y
                    teléfono se comparten únicamente cuando tú aceptas una oferta.
                  </p>
                </div>
              </section>

              {error && (
                <div className="p-5 rounded-[1.25rem] bg-red-50 text-[12.5px] font-semibold text-red-600">
                  {error}
                </div>
              )}
            </>
          )}
        </div>

        {/* Botonera inferior sticky */}
        <div className="sticky bottom-0 -mx-6 px-6 pt-4 pb-6 bg-gradient-to-t from-[#F4F0E8] via-[#F4F0E8]/95 to-transparent">
          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="h-14 px-6 rounded-full text-[13px] font-semibold text-[#7B7267] hover:text-[#1F1C18] v2-press transition-colors"
              >
                Atrás
              </button>
            )}
            {step < 2 ? (
              <button
                type="button"
                disabled={!canNext}
                onClick={() => canNext && setStep(s => s + 1)}
                className={`flex-1 h-14 rounded-full text-[13px] font-bold flex items-center justify-center gap-2 transition-colors ${
                  canNext
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 v2-press hover:bg-primary-dark'
                    : 'bg-black/[0.06] text-[#ADA398] cursor-not-allowed'
                }`}
              >
                Continuar <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                disabled={saving}
                onClick={publish}
                className="flex-1 h-14 rounded-full bg-primary text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/25 v2-press hover:bg-primary-dark transition-colors disabled:opacity-70"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {saving ? 'Publicando…' : 'Publicar proyecto'}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
