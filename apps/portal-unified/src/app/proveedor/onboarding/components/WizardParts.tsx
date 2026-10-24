"use client";

import React, { useRef, useState } from 'react';
import { ArrowRight, Check, Loader2, Plus, Trash2, TriangleAlert } from 'lucide-react';
import { useOnboarding, type FileField } from './OnboardingContext';

export const LABEL_CLS = 'block text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-2 ml-1';
export const INPUT_CLS = 'w-full h-14 px-5 bg-sand rounded-[1.25rem] border-0 text-[15px] font-semibold text-ink placeholder:text-faint placeholder:font-medium outline-none focus:ring-2 focus:ring-lavender/60 transition-shadow';
export const ERROR_CLS = 'mt-1.5 ml-1 text-[11.5px] font-semibold text-error';

/**
 * Botonera fija del wizard. Mientras falte algo, el botón queda bloqueado
 * y dice exactamente qué falta (no se puede avanzar con campos vacíos).
 */
export function WizardFooter({
  onBack,
  onNext,
  canNext,
  missing,
  label = 'Continuar',
  loading = false,
  hideBack = false,
}: {
  onBack?: () => void;
  onNext: () => void;
  canNext: boolean;
  missing?: string;
  label?: string;
  loading?: boolean;
  hideBack?: boolean;
}) {
  return (
    <div className="sticky bottom-0 mt-auto -mx-6 px-6 pt-4 pb-6 bg-gradient-to-t from-linen via-linen/95 to-transparent">
      {!canNext && missing && (
        <p className="mb-3 flex items-center justify-center gap-1.5 text-[12px] font-semibold text-muted text-center">
          <TriangleAlert size={13} className="shrink-0 text-warning" /> {missing}
        </p>
      )}
      <div className="flex items-center gap-3">
        {!hideBack && onBack && (
          <button type="button" onClick={onBack} disabled={loading} className="h-14 px-6 rounded-full text-[13px] font-semibold text-muted hover:text-ink v2-press transition-colors disabled:opacity-50">
            Atrás
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext || loading}
          className={`flex-1 h-14 rounded-full text-[13px] font-bold flex items-center justify-center gap-2 transition-colors ${
            canNext && !loading ? 'bg-primary text-ink hover:bg-primary-dark v2-press shadow-lg shadow-primary/25' : 'bg-sand text-faint cursor-not-allowed'
          }`}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <>{label} <ArrowRight size={16} /></>}
        </button>
      </div>
    </div>
  );
}

/**
 * Casilla de carga de un documento. Sube el archivo al almacenamiento
 * privado en cuanto se elige y solo marca "Subido" cuando la subida
 * terminó de verdad.
 */
export function FileSlot({
  field,
  title,
  hint,
  icon,
  accept = 'image/*,application/pdf',
  capture,
  multiple = false,
  min = 1,
  optional = false,
}: {
  field: FileField;
  title: string;
  hint?: string;
  icon: React.ReactNode;
  accept?: string;
  capture?: 'user' | 'environment';
  multiple?: boolean;
  min?: number;
  optional?: boolean;
}) {
  const { data, uploadFile, removeFile } = useOnboarding();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const value = data.documents?.files?.[field];
  const paths = Array.isArray(value) ? value : value ? [value] : [];
  const done = paths.length >= min;

  const onPick = async (list: FileList | null) => {
    if (!list || list.length === 0) return;
    setError(null);
    const files = multiple ? Array.from(list) : [list[0]];
    setBusy(files.length);
    for (const f of files) {
      if (!multiple && paths[0]) removeFile(field, paths[0]); // reemplazo
      const err = await uploadFile(field, f);
      if (err) setError(err);
      setBusy(b => b - 1);
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  const status = busy > 0
    ? `Subiendo${multiple ? ` ${busy} archivo(s)` : ''}…`
    : done
      ? (multiple ? `${paths.length} archivo(s) subido(s)` : 'Subido')
      : multiple
        ? `${paths.length} de ${min} mínimo${optional ? ' · opcional' : ''}`
        : optional ? 'Opcional' : 'Pendiente';

  return (
    <div className="py-3.5 border-b border-line last:border-b-0">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy > 0}
        className="w-full flex items-center gap-4 text-left v2-press"
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          capture={capture}
          multiple={multiple}
          className="hidden"
          onChange={e => onPick(e.target.files)}
        />
        <span className={`w-12 h-12 shrink-0 rounded-[1.05rem] flex items-center justify-center ${done ? 'bg-mint-light text-mint-deep' : 'bg-primary-light text-primary-deep'}`}>
          {busy > 0 ? <Loader2 size={18} className="animate-spin" /> : icon}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[14px] font-semibold text-ink leading-tight">{title}</span>
          <span className={`block mt-0.5 text-[12px] font-semibold ${done ? 'text-mint-deep' : 'text-faint'}`}>{status}</span>
          {hint && <span className="block mt-0.5 text-[11.5px] font-medium text-faint">{hint}</span>}
        </span>
        <span className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${done ? 'bg-mint text-white' : 'bg-sand text-ink'}`}>
          {done ? <Check size={14} strokeWidth={3} /> : <Plus size={14} />}
        </span>
      </button>

      {multiple && paths.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 pl-16">
          {paths.map((p, i) => (
            <span key={p} className="inline-flex items-center gap-1.5 h-8 pl-3 pr-1.5 rounded-full bg-sand text-[11.5px] font-semibold text-ink">
              Archivo {i + 1}
              <button type="button" aria-label={`Quitar archivo ${i + 1}`} onClick={() => removeFile(field, p)} className="w-6 h-6 rounded-full bg-cream flex items-center justify-center text-muted hover:text-error">
                <Trash2 size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
      {error && <p className={`${ERROR_CLS} pl-16`}>{error}</p>}
    </div>
  );
}
