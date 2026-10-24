"use client";

import React from 'react';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { useOnboarding } from './OnboardingContext';

const LABEL_CLS = 'block text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-2 ml-1';
const INPUT_CLS = 'w-full h-14 px-5 bg-sand rounded-[1.25rem] border-0 text-[15px] font-semibold text-ink placeholder:text-faint placeholder:font-medium outline-none focus:ring-2 focus:ring-primary/30 transition-shadow';
const TEXTAREA_CLS = 'w-full bg-sand rounded-[1.25rem] border-0 px-5 py-4 text-[14px] font-medium text-ink placeholder:text-faint outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-shadow';

export const Step3Docs: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const { data, updateData } = useOnboarding();
  const documents = data.documents || {};

  const handleFileChange = (id: string, file: File | null) => {
    updateData({
      documents: {
        ...documents,
        [id]: file ? file.name : null
      }
    });
  };

  const docs = [
    {
      id: "doc1",
      name: "Antecedentes no penales",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
      )
    },
    {
      id: "doc2",
      name: "Comprobante de domicilio",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    {
      id: "doc3",
      name: "Portafolio de trabajos (mín 3 fotos)",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      )
    },
    {
      id: "doc4",
      name: "Certificaciones técnicas (Opcional)",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex-1 flex flex-col space-y-5">
      <section className="v2-scale bg-cream rounded-[2.25rem] v2-shadow-soft p-6">
        <p className="text-[14px] font-medium text-muted mb-5">Sube los documentos requeridos para certificar tu perfil.</p>

        <div className="-mx-2">
          {docs.map((doc, i) => {
            const fileName = documents[doc.id];
            const isUploaded = !!fileName;
            return (
              <label key={doc.id} className={`v2-rise v2-d${i + 1} flex items-center gap-4 px-2 py-4 cursor-pointer v2-press border-b border-line last:border-b-0`}>
                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => e.target.files && handleFileChange(doc.id, e.target.files[0])} />

                <span className={`w-12 h-12 shrink-0 rounded-[1.05rem] flex items-center justify-center ${isUploaded ? "bg-mint-light text-mint-deep" : "bg-primary-light text-primary-deep"}`}>
                  {doc.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-ink leading-tight">{doc.name}</p>
                  <p className={`mt-0.5 text-[12px] font-semibold truncate ${isUploaded ? "text-mint-deep" : "text-faint font-medium"}`}>
                    {isUploaded ? `✓ subido · ${fileName}` : "Pendiente"}
                  </p>
                </div>
                {isUploaded ? (
                  <span className="w-8 h-8 shrink-0 rounded-full bg-mint text-white flex items-center justify-center">
                    <Check size={14} strokeWidth={3} />
                  </span>
                ) : (
                  <span className="w-8 h-8 shrink-0 rounded-full bg-sand text-ink flex items-center justify-center">
                    <Plus size={14} />
                  </span>
                )}
              </label>
            )
          })}
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="v2-scale bg-cream rounded-[2.25rem] v2-shadow-soft p-6" style={{ animationDelay: '120ms' }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep">Opcional</p>
        <h3 className="mt-1 text-[19px] font-semibold tracking-tight text-ink">Recomendaciones de clientes</h3>
        <p className="mt-1 text-[13px] font-medium text-muted mb-6">Agrega un par de recomendaciones de clientes que puedan dar fe de tu trabajo.</p>

        <div className="space-y-6">
          {/* Recommendation 1 */}
          <div className="space-y-3">
            <p className="text-[12px] font-semibold text-ink">Recomendación 1</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL_CLS}>Nombre del cliente</label>
                <input
                  placeholder="Ej. María G."
                  value={documents.testimonial1_name || ''}
                  onChange={e => updateData({ documents: { ...documents, testimonial1_name: e.target.value } })}
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Contacto</label>
                <input
                  placeholder="Ej. 656 123 4567"
                  value={documents.testimonial1_contact || ''}
                  onChange={e => updateData({ documents: { ...documents, testimonial1_contact: e.target.value } })}
                  className={`${INPUT_CLS} tabular-nums`}
                />
              </div>
            </div>
            <textarea
              className={TEXTAREA_CLS}
              rows={2}
              placeholder="Ej. Excelente trabajo, muy puntual y limpio..."
              value={documents.testimonial1_text || ''}
              onChange={e => updateData({ documents: { ...documents, testimonial1_text: e.target.value } })}
            />
          </div>

          {/* Recommendation 2 */}
          <div className="space-y-3 pt-5 border-t border-line">
            <p className="text-[12px] font-semibold text-ink">Recomendación 2</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL_CLS}>Nombre del cliente</label>
                <input
                  placeholder="Ej. Juan P."
                  value={documents.testimonial2_name || ''}
                  onChange={e => updateData({ documents: { ...documents, testimonial2_name: e.target.value } })}
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Contacto</label>
                <input
                  placeholder="Ej. 656 987 6543"
                  value={documents.testimonial2_contact || ''}
                  onChange={e => updateData({ documents: { ...documents, testimonial2_contact: e.target.value } })}
                  className={`${INPUT_CLS} tabular-nums`}
                />
              </div>
            </div>
            <textarea
              className={TEXTAREA_CLS}
              rows={2}
              placeholder="Ej. Muy profesional y detallista en los acabados..."
              value={documents.testimonial2_text || ''}
              onChange={e => updateData({ documents: { ...documents, testimonial2_text: e.target.value } })}
            />
          </div>
        </div>
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
            Continuar <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
