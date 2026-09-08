"use client";

import React from 'react';
import { Button } from '@i-mendly/shared/components/Button';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Input } from '@i-mendly/shared/components/Input';
import { useOnboarding } from './OnboardingContext';

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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
      )
    },
    { 
      id: "doc2", 
      name: "Comprobante de domicilio", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    { 
      id: "doc3", 
      name: "Portafolio de trabajos (mín 3 fotos)", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      )
    },
    { 
      id: "doc4", 
      name: "Certificaciones técnicas (Opcional)", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
        </svg>
      )
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-3xl font-black mb-2 tracking-tight">Documentos y antecedentes</h2>
      <p className="text-white/50 mb-8 font-medium">Sube los documentos requeridos para certificar tu perfil.</p>

      <div className="space-y-4 mb-10">
        {docs.map((doc) => {
          const fileName = documents[doc.id];
          const isUploaded = !!fileName;
          return (
            <label key={doc.id} className={`flex items-center justify-between p-4 rounded-3xl border-2 cursor-pointer transition-all ${isUploaded ? "border-emerald-500 bg-emerald-500/10" : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"}`}>
              <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => e.target.files && handleFileChange(doc.id, e.target.files[0])} />
              
              <div className="flex items-center gap-4">
                <span className={`p-3 rounded-full ${isUploaded ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/70"}`}>
                  {doc.icon}
                </span>
                <div>
                  <p className="text-sm font-bold text-white mb-1">{doc.name}</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isUploaded ? "text-emerald-400" : "text-white/60"}`}>
                    {isUploaded ? `Subido: ${fileName}` : "Pendiente"}
                  </p>
                </div>
              </div>
              {isUploaded ? (
                <div className="bg-emerald-500 rounded-full text-brand-night p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
              ) : (
                <span className="text-white/40 border border-white/20 rounded-full w-6 h-6 flex items-center justify-center font-bold">＋</span>
              )}
            </label>
          )
        })}
      </div>

      {/* Recommendations Section */}
      <div className="mb-10 pt-4 border-t border-white/5">
        <h3 className="text-sm font-black text-white/40 uppercase tracking-widest mb-4">Recomendaciones de clientes (Opcional)</h3>
        <p className="text-xs text-white/50 mb-4 font-medium">Agrega un par de recomendaciones de clientes que puedan dar fe de tu trabajo.</p>
        
        <div className="space-y-6">
          {/* Recommendation 1 */}
          <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                dark 
                label="Nombre del Cliente" 
                placeholder="Ej. María G." 
                value={documents.testimonial1_name || ''}
                onChange={e => updateData({ documents: { ...documents, testimonial1_name: e.target.value } })}
              />
              <Input 
                dark 
                label="Contacto (WhatsApp/Tel)" 
                placeholder="Ej. 656 123 4567" 
                value={documents.testimonial1_contact || ''}
                onChange={e => updateData({ documents: { ...documents, testimonial1_contact: e.target.value } })}
              />
            </div>
            <textarea 
              className="w-full bg-brand-night/50 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 transition-all resize-none text-sm font-medium"
              rows={2}
              placeholder="Ej. Excelente trabajo, muy puntual y limpio..."
              value={documents.testimonial1_text || ''}
              onChange={e => updateData({ documents: { ...documents, testimonial1_text: e.target.value } })}
            />
          </div>

          {/* Recommendation 2 */}
          <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5 space-y-4 opacity-80 hover:opacity-100 transition-opacity">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                dark 
                label="Nombre del Cliente" 
                placeholder="Ej. Juan P." 
                value={documents.testimonial2_name || ''}
                onChange={e => updateData({ documents: { ...documents, testimonial2_name: e.target.value } })}
              />
              <Input 
                dark 
                label="Contacto (WhatsApp/Tel)" 
                placeholder="Ej. 656 987 6543" 
                value={documents.testimonial2_contact || ''}
                onChange={e => updateData({ documents: { ...documents, testimonial2_contact: e.target.value } })}
              />
            </div>
            <textarea 
              className="w-full bg-brand-night/50 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 transition-all resize-none text-sm font-medium"
              rows={2}
              placeholder="Ej. Muy profesional y detallista en los acabados..."
              value={documents.testimonial2_text || ''}
              onChange={e => updateData({ documents: { ...documents, testimonial2_text: e.target.value } })}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="ghost" onClick={onBack} className="flex-1 text-white/40 hover:text-white">Atrás</Button>
        <Button variant="primary" onClick={onNext} className="flex-[2]">Siguiente Paso</Button>
      </div>
    </div>
  );
};
