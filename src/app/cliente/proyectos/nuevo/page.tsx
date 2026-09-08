"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import {
  ArrowLeft, ArrowRight, Camera, Check, ClipboardList,
  Loader2, MapPin, ShieldCheck, Trash2, X
} from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import {
  PROJECT_CATEGORIES, PROJECT_ZONES, TIMING_OPTIONS,
  findContactInfo, genDisplayId, formatMXN, timingLabel
} from '../../../../lib/tablero';

const STEPS = ['Tu proyecto', 'Zona y presupuesto', 'Revisar y publicar'];

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
    <main className="min-h-screen bg-slate-50 pb-24">
      <header className="px-8 py-10 flex items-center gap-4 sticky top-0 bg-slate-50/90 backdrop-blur-xl z-50">
        <Link href="/cliente/proyectos" className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-primary">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-brand-night uppercase tracking-tighter">Publicar Proyecto</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Paso {step + 1} de 3 · {STEPS[step]}</p>
        </div>
      </header>

      <div className="px-8 max-w-2xl mx-auto space-y-8">
        {/* Progress */}
        <div className="flex gap-2">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-slate-200'}`} />
          ))}
        </div>

        {/* PASO 1: proyecto */}
        {step === 0 && (
          <Card className="p-8 rounded-[2.5rem] border-none shadow-card bg-white space-y-7">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 block">¿Qué tipo de trabajo necesitas?</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PROJECT_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-4 rounded-2xl border-2 text-xs font-black uppercase tracking-wide transition-all ${category === cat ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block">Título del proyecto</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ej. Fabricar pérgola para patio de 4×5 m"
                className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold text-brand-night placeholder:text-slate-300 placeholder:font-medium"
                maxLength={90}
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block">Describe lo que necesitas</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Medidas, materiales que imaginas, estado actual, y todo lo que ayude a cotizar sin visitar. Mínimo 30 caracteres."
                rows={5}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white outline-none font-medium text-brand-night placeholder:text-slate-300 resize-none"
                maxLength={1200}
              />
              <div className="flex justify-between mt-2">
                <span className={`text-[10px] font-bold ${description.trim().length < 30 ? 'text-slate-300' : 'text-primary'}`}>{description.trim().length} / 30 mín.</span>
              </div>
            </div>

            {contactIssue && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3">
                <X size={16} className="text-red-500 mt-0.5 flex-none" />
                <p className="text-xs font-bold text-red-600">Detectamos {contactIssue} en el texto. Para tu seguridad, el contacto se comparte dentro de la plataforma al aceptar una oferta — así tu proyecto queda protegido por la Garantía I mendly.</p>
              </div>
            )}

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 block">Fotos (opcional, máx. 5)</label>
              <div className="flex flex-wrap gap-3">
                {photos.map((f, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={URL.createObjectURL(f)} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                    <button onClick={() => setPhotos(p => p.filter((_, j) => j !== i))} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center">
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
                {photos.length < 5 && (
                  <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 cursor-pointer hover:border-primary hover:text-primary transition-colors">
                    <Camera size={20} />
                    <input type="file" accept="image/*" multiple className="hidden" onChange={e => handlePhotos(e.target.files)} />
                  </label>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* PASO 2: zona y presupuesto */}
        {step === 1 && (
          <Card className="p-8 rounded-[2.5rem] border-none shadow-card bg-white space-y-7">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 block">Zona</label>
              <div className="flex flex-wrap gap-2">
                {PROJECT_ZONES.map(z => (
                  <button
                    key={z}
                    onClick={() => setZone(z)}
                    className={`px-4 py-2.5 rounded-full border-2 text-[11px] font-black uppercase tracking-wide transition-all ${zone === z ? 'border-primary bg-primary text-white' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block">Colonia (opcional)</label>
              <input
                value={neighborhood}
                onChange={e => setNeighborhood(e.target.value)}
                placeholder="Solo la colonia — tu dirección exacta nunca es pública"
                className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold text-brand-night placeholder:text-slate-300 placeholder:font-medium"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block">Presupuesto estimado (opcional)</label>
              <div className="flex items-center gap-3">
                <input
                  value={budgetMin}
                  onChange={e => setBudgetMin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Desde $"
                  inputMode="numeric"
                  className="flex-1 h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold text-brand-night placeholder:text-slate-300"
                />
                <span className="text-slate-300 font-black">—</span>
                <input
                  value={budgetMax}
                  onChange={e => setBudgetMax(e.target.value.replace(/\D/g, ''))}
                  placeholder="Hasta $"
                  inputMode="numeric"
                  className="flex-1 h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold text-brand-night placeholder:text-slate-300"
                />
              </div>
              <p className="text-[10px] font-bold text-slate-300 mt-2">Un rango orienta mejores ofertas. Si no lo sabes, déjalo vacío y pide visita de cotización.</p>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 block">¿Para cuándo?</label>
              <div className="grid grid-cols-2 gap-3">
                {TIMING_OPTIONS.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setTiming(t.value)}
                    className={`px-4 py-3.5 rounded-2xl border-2 text-[11px] font-black uppercase tracking-wide transition-all ${timing === t.value ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* PASO 3: revisión */}
        {step === 2 && (
          <div className="space-y-6">
            <Card className="p-8 rounded-[2.5rem] border-none shadow-card bg-white space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{category}</span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{timingLabel(timing)}</span>
              </div>
              <h2 className="text-xl font-black text-brand-night tracking-tight uppercase leading-tight">{title}</h2>
              <p className="text-sm font-medium text-slate-500 whitespace-pre-wrap">{description}</p>
              <div className="flex items-center gap-4 pt-2 border-t border-slate-50">
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin size={14} />
                  <span className="text-[11px] font-bold uppercase">{zone}{neighborhood ? ` · ${neighborhood}` : ''}</span>
                </div>
                {(budgetMin || budgetMax) && (
                  <span className="ml-auto text-xs font-black text-emerald-500 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                    {budgetMin ? formatMXN(Number(budgetMin)) : ''}{budgetMin && budgetMax ? ' – ' : ''}{budgetMax ? formatMXN(Number(budgetMax)) : ''}
                  </span>
                )}
              </div>
              {photos.length > 0 && (
                <div className="flex gap-2">
                  {photos.map((f, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={URL.createObjectURL(f)} alt={`Foto ${i + 1}`} className="w-16 h-16 rounded-xl object-cover" />
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6 rounded-[2rem] border-none bg-primary/5 flex items-start gap-4">
              <ShieldCheck size={22} className="text-primary flex-none mt-0.5" />
              <div>
                <p className="text-xs font-black text-brand-night uppercase tracking-wide mb-1">Así te protegemos</p>
                <p className="text-xs font-medium text-slate-500">Tu proyecto pasa una revisión rápida antes de publicarse. Solo proveedores verificados de tu zona podrán ofertar (máximo 5 ofertas). Tu dirección y teléfono se comparten únicamente cuando tú aceptas una oferta.</p>
              </div>
            </Card>

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-xs font-bold text-red-600">{error}</div>
            )}
          </div>
        )}

        {/* Navegación */}
        <div className="flex gap-4">
          {step > 0 && (
            <Button variant="ghost" onClick={() => setStep(s => s - 1)} className="h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400">
              Atrás
            </Button>
          )}
          {step < 2 ? (
            <Button
              variant="primary"
              disabled={!canNext}
              onClick={() => canNext && setStep(s => s + 1)}
              className={`flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest border-none shadow-lg flex items-center justify-center gap-2 ${canNext ? 'bg-brand-night text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
            >
              Continuar <ArrowRight size={16} />
            </Button>
          ) : (
            <Button
              variant="primary"
              disabled={saving}
              onClick={publish}
              className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest border-none shadow-lg bg-primary text-white hover:bg-primary-dark flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              {saving ? 'Publicando...' : 'Publicar proyecto'}
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
