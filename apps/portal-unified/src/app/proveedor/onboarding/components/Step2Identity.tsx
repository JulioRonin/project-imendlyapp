"use client";

import React from 'react';
import { Button } from '@i-mendly/shared/components/Button';
import { Input } from '@i-mendly/shared/components/Input';
import { useOnboarding } from './OnboardingContext';

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
    file ? "border-solid border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-dashed border-white/20 hover:border-primary/50 text-white";

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-3xl font-black mb-2 tracking-tight">Verificación de identidad</h2>
      <p className="text-white/50 mb-8 font-medium">Por tu seguridad y la de nuestros clientes, necesitamos validar tu identidad.</p>

      <div className="space-y-6 mb-10">
        <Input 
          dark 
          label="CURP (18 caracteres)" 
          placeholder="AAAA000000XXXXXX00" 
          maxLength={18} 
          value={documents.curp || ''}
          onChange={e => updateData({ documents: { ...documents, curp: e.target.value } })}
        />
        <Input 
          dark 
          label="RFC (Opcional)" 
          placeholder="AAAA000000XXX" 
          maxLength={13} 
          value={documents.rfc || ''}
          onChange={e => updateData({ documents: { ...documents, rfc: e.target.value } })}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <label className={`h-40 flex flex-col items-center justify-center rounded-[2rem] border-2 cursor-pointer transition-all ${getStatusClass(fileFront)}`}>
            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => e.target.files && handleFileChange('ine_front', e.target.files[0])} />
            {fileFront ? (
               <>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 mb-3">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                 </svg>
                 <span className="text-xs font-black uppercase tracking-widest px-2 text-center break-all line-clamp-1">{fileFront}</span>
               </>
            ) : (
               <>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-3 opacity-80">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                 </svg>
                 <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">INE Frente</span>
               </>
            )}
          </label>

          <label className={`h-40 flex flex-col items-center justify-center rounded-[2rem] border-2 cursor-pointer transition-all ${getStatusClass(fileBack)}`}>
            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => e.target.files && handleFileChange('ine_back', e.target.files[0])} />
            {fileBack ? (
               <>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 mb-3">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                 </svg>
                 <span className="text-xs font-black uppercase tracking-widest px-2 text-center break-all line-clamp-1">{fileBack}</span>
               </>
            ) : (
               <>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-3 opacity-80">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h16.5A2.25 2.25 0 0 1 22.5 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 17.25V6.75A2.25 2.25 0 0 1 3.75 4.5zM1.5 9h21M1.5 12h21" />
                 </svg>
                 <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">INE Reverso</span>
               </>
            )}
          </label>
        </div>
        
        <label className={`h-40 flex flex-col items-center justify-center rounded-[2rem] border-2 cursor-pointer transition-all ${getStatusClass(fileSelfie)}`}>
          <input type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => e.target.files && handleFileChange('selfie_ine', e.target.files[0])} />
          {fileSelfie ? (
             <>
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 mb-3">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
               </svg>
               <span className="text-xs font-black uppercase tracking-widest px-2 text-center break-all line-clamp-1">{fileSelfie}</span>
             </>
          ) : (
             <>
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-3 opacity-80">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                 <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
               </svg>
               <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Selfie con INE</span>
             </>
          )}
        </label>
      </div>

      <p className="mb-8 text-xs font-bold text-white/30 flex items-center gap-2">
        <span>🔒 Cifrado de extremo a extremo. Tu información está protegida.</span>
      </p>

      <div className="flex gap-4">
        <Button variant="ghost" onClick={onBack} className="flex-1 text-white/40 hover:text-white">Atrás</Button>
        <Button variant="primary" onClick={onNext} className="flex-[2]">Validar y Continuar</Button>
      </div>
    </div>
  );
};
