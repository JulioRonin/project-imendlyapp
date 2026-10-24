"use client";

import React from 'react';
import { ArrowRight, CheckCircle2, CreditCard, Camera, Lock, IdCard } from 'lucide-react';
import { useOnboarding } from './OnboardingContext';

const LABEL_CLS = 'block text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-2 ml-1';
const INPUT_CLS = 'w-full h-14 px-5 bg-sand rounded-[1.25rem] border-0 text-[15px] font-semibold text-ink uppercase tabular-nums placeholder:text-faint placeholder:font-medium placeholder:normal-case outline-none focus:ring-2 focus:ring-primary/30 transition-shadow';

export const Step2Identity: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const { data, updateData } = useOnboarding();

  const documents = data.documents || {};
  const fileFront = documents.ine_front || null;
  const fileBack = documents.ine_back || null;
  const fileSelfie = documents.selfie_ine || null;

  const handleFileChange = (field: string, file: File | null) => {
    updateData({
      documents: {
        ...documents,
        [field]: file ? file.name : null
      }
    });
  };

  const getStatusClass = (file: any) =>
    file ? "bg-mint-light text-mint-deep" : "bg-sand text-muted hover:bg-primary-light/60";

  return (
    <div className="flex-1 flex flex-col">
      <section className="v2-scale bg-cream rounded-[2.25rem] v2-shadow-soft p-6 space-y-6">
        <p className="text-[14px] font-medium text-muted">Por tu seguridad y la de nuestros clientes, necesitamos validar tu identidad.</p>

        <div>
          <label className={LABEL_CLS}>CURP (18 caracteres)</label>
          <input
            placeholder="AAAA000000XXXXXX00"
            maxLength={18}
            value={documents.curp || ''}
            onChange={e => updateData({ documents: { ...documents, curp: e.target.value } })}
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label className={LABEL_CLS}>RFC (opcional)</label>
          <input
            placeholder="AAAA000000XXX"
            maxLength={13}
            value={documents.rfc || ''}
            onChange={e => updateData({ documents: { ...documents, rfc: e.target.value } })}
            className={INPUT_CLS}
          />
        </div>

        <div>
          <label className={LABEL_CLS}>Identificación oficial</label>
          <div className="grid grid-cols-2 gap-3">
            <label className={`h-36 flex flex-col items-center justify-center gap-2 rounded-[1.5rem] cursor-pointer v2-press transition-colors ${getStatusClass(fileFront)}`}>
              <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => e.target.files && handleFileChange('ine_front', e.target.files[0])} />
              {fileFront ? (
                 <>
                   <CheckCircle2 size={24} />
                   <span className="text-[12px] font-semibold px-3 text-center break-all line-clamp-1">{fileFront}</span>
                   <span className="text-[11px] font-semibold">✓ subido</span>
                 </>
              ) : (
                 <>
                   <span className="w-11 h-11 rounded-[1rem] bg-cream text-primary-deep flex items-center justify-center">
                     <IdCard size={20} />
                   </span>
                   <span className="text-[12.5px] font-semibold text-ink">INE frente</span>
                 </>
              )}
            </label>

            <label className={`h-36 flex flex-col items-center justify-center gap-2 rounded-[1.5rem] cursor-pointer v2-press transition-colors ${getStatusClass(fileBack)}`}>
              <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => e.target.files && handleFileChange('ine_back', e.target.files[0])} />
              {fileBack ? (
                 <>
                   <CheckCircle2 size={24} />
                   <span className="text-[12px] font-semibold px-3 text-center break-all line-clamp-1">{fileBack}</span>
                   <span className="text-[11px] font-semibold">✓ subido</span>
                 </>
              ) : (
                 <>
                   <span className="w-11 h-11 rounded-[1rem] bg-cream text-primary-deep flex items-center justify-center">
                     <CreditCard size={20} />
                   </span>
                   <span className="text-[12.5px] font-semibold text-ink">INE reverso</span>
                 </>
              )}
            </label>
          </div>

          <label className={`mt-3 h-36 flex flex-col items-center justify-center gap-2 rounded-[1.5rem] cursor-pointer v2-press transition-colors ${getStatusClass(fileSelfie)}`}>
            <input type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => e.target.files && handleFileChange('selfie_ine', e.target.files[0])} />
            {fileSelfie ? (
               <>
                 <CheckCircle2 size={24} />
                 <span className="text-[12px] font-semibold px-3 text-center break-all line-clamp-1">{fileSelfie}</span>
                 <span className="text-[11px] font-semibold">✓ subido</span>
               </>
            ) : (
               <>
                 <span className="w-11 h-11 rounded-[1rem] bg-cream text-primary-deep flex items-center justify-center">
                   <Camera size={20} />
                 </span>
                 <span className="text-[12.5px] font-semibold text-ink">Selfie con INE</span>
               </>
            )}
          </label>
        </div>

        <p className="flex items-center gap-2 text-[12px] font-semibold text-mint-deep">
          <Lock size={13} /> Cifrado de extremo a extremo. Tu información está protegida.
        </p>
      </section>

      {/* Botonera sticky */}
      <div className="sticky bottom-0 mt-auto -mx-6 px-6 pt-4 pb-6 bg-gradient-to-t from-linen via-linen/95 to-transparent">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} className="h-14 px-6 rounded-full text-[13px] font-semibold text-muted hover:text-ink v2-press transition-colors">Atrás</button>
          <button
            type="button"
            onClick={onNext}
            className="flex-1 h-14 rounded-full bg-primary text-ink hover:bg-primary-dark text-[13px] font-bold flex items-center justify-center gap-2 v2-press shadow-lg shadow-primary/25 transition-colors"
          >
            Validar y continuar <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
