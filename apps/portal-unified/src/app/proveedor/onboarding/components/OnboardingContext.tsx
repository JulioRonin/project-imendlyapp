"use client";

import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { LEGAL_VERSION, legalMetadata } from '@/lib/legal';

// ── Tipos ────────────────────────────────────────────────

export type FileField =
  | 'profile_photo' | 'ine_front' | 'ine_back' | 'selfie_ine'
  | 'antecedentes' | 'domicilio' | 'portafolio' | 'certificaciones';

const MULTI_FIELDS: FileField[] = ['portafolio', 'certificaciones'];

export interface OnboardingDocuments {
  curp?: string;
  rfc?: string;
  // Rutas dentro del bucket privado onboarding-docs (nunca URLs públicas)
  files?: Partial<Record<FileField, string | string[]>>;
  testimonial1_name?: string;
  testimonial1_contact?: string;
  testimonial1_text?: string;
  testimonial2_name?: string;
  testimonial2_contact?: string;
  testimonial2_text?: string;
  references_consent?: boolean;
}

export interface OnboardingData {
  full_name?: string;
  company_name?: string;
  birth_date?: string;
  phone?: string;
  email?: string;
  password?: string;
  main_specialty?: string;
  is_other_specialty?: boolean;
  other_specialty_name?: string;
  other_specialty_description?: string;
  zones?: string[];
  sub_services?: string[];
  availability?: any;
  documents?: OnboardingDocuments;
  interview?: { date?: string; time?: string; label?: string };
  exam?: { score?: number; passed?: boolean; completed_at?: string };
}

export type Phase =
  | 'loading'        // resolviendo sesión
  | 'new'            // sin cuenta: bienvenida + crear cuenta
  | 'in-progress'    // cuenta de profesional creada, solicitud pendiente de enviar
  | 'submitted'      // solicitud ya enviada
  | 'not-provider';  // hay sesión de otra cuenta (cliente/admin)

type AccountResult = { status: 'session' | 'confirm' | 'error'; message?: string };

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  updateDocuments: (newDocs: Partial<OnboardingDocuments>) => void;
  phase: Phase;
  userId: string | null;
  createAccount: () => Promise<AccountResult>;
  uploadFile: (field: FileField, file: File) => Promise<string | null>;
  removeFile: (field: FileField, path: string) => void;
  submitApplication: () => Promise<{ success: boolean; error?: string }>;
  signOutAndRestart: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const MAX_BYTES = 10 * 1024 * 1024; // límite del bucket onboarding-docs
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const draftKey = (uid: string) => `im-onboarding-${uid}`;

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<OnboardingData>({
    zones: [],
    sub_services: [],
    availability: {},
    documents: { files: {} },
  });
  const [phase, setPhase] = useState<Phase>('loading');
  const [userId, setUserId] = useState<string | null>(null);

  const updateData = useCallback((newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  }, []);

  const updateDocuments = useCallback((newDocs: Partial<OnboardingDocuments>) => {
    setData(prev => ({ ...prev, documents: { ...(prev.documents || {}), ...newDocs } }));
  }, []);

  // ── Resolver en qué punto está la persona ──────────────
  const resolve = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setUserId(null); setPhase('new'); return; }

    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (profile?.role !== 'provider') { setUserId(user.id); setPhase('not-provider'); return; }

    setUserId(user.id);
    const { data: application } = await supabase
      .from('onboarding_applications').select('id').eq('user_id', user.id).maybeSingle();
    if (application) { setPhase('submitted'); return; }

    // Retomar: datos del registro + borrador de esta sesión del navegador
    const meta = user.user_metadata || {};
    let draft: Partial<OnboardingData> = {};
    try { draft = JSON.parse(sessionStorage.getItem(draftKey(user.id)) || '{}'); } catch { /* noop */ }
    setData(prev => ({
      ...prev,
      full_name: meta.full_name, phone: meta.phone, birth_date: meta.birth_date,
      company_name: meta.company_name, email: user.email,
      ...draft,
      password: undefined,
    }));
    setPhase('in-progress');
  }, []);

  useEffect(() => {
    resolve();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') resolve();
    });
    return () => sub.subscription.unsubscribe();
  }, [resolve]);

  // Borrador por pestaña (sessionStorage): sobrevive a un refresh, no se
  // guarda la contraseña y se borra al cerrar la pestaña.
  useEffect(() => {
    if (!userId || phase !== 'in-progress') return;
    try {
      const { password: _omit, ...rest } = data;
      sessionStorage.setItem(draftKey(userId), JSON.stringify(rest));
    } catch { /* sin almacenamiento */ }
  }, [data, userId, phase]);

  // ── Paso 1: cuenta + consentimientos ───────────────────
  const createAccount = async (): Promise<AccountResult> => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: (data.email || '').trim(),
      password: data.password || '',
      options: {
        emailRedirectTo: `${window.location.origin}/proveedor/onboarding`,
        data: {
          full_name: data.full_name?.trim(),
          role: 'provider',
          phone: data.phone,
          birth_date: data.birth_date,
          company_name: data.company_name || null,
          // Evidencia: términos, aviso de privacidad y consentimiento
          // EXPRESO para datos sensibles (los registra el trigger de alta)
          legal: legalMetadata(['terminos_profesionales', 'aviso_privacidad', 'datos_sensibles']),
        },
      },
    });
    if (error) {
      return {
        status: 'error',
        message: /registered|exists/i.test(error.message)
          ? 'Ya existe una cuenta con este correo. Inicia sesión en el portal de profesionales para continuar tu solicitud.'
          : 'No pudimos crear tu cuenta. Revisa tus datos e intenta de nuevo.',
      };
    }
    if (!authData.session) return { status: 'confirm' };
    setUserId(authData.user?.id ?? null);
    setPhase('in-progress');
    return { status: 'session' };
  };

  // ── Documentos: subida real al bucket privado ──────────
  const uploadFile = async (field: FileField, file: File): Promise<string | null> => {
    if (!userId) return 'Tu sesión expiró. Vuelve a iniciar sesión.';
    if (!ALLOWED.includes(file.type)) return 'Formato no válido. Usa JPG, PNG, WEBP o PDF.';
    if (file.size > MAX_BYTES) return 'El archivo pesa más de 10 MB.';

    const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
    const path = `${userId}/${field}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const { error } = await supabase.storage.from('onboarding-docs').upload(path, file, { upsert: false });
    if (error) return 'No pudimos subir el archivo. Revisa tu conexión e intenta de nuevo.';

    setData(prev => {
      const files = { ...(prev.documents?.files || {}) };
      if (MULTI_FIELDS.includes(field)) {
        const list = Array.isArray(files[field]) ? (files[field] as string[]) : [];
        files[field] = [...list, path];
      } else {
        files[field] = path;
      }
      return { ...prev, documents: { ...(prev.documents || {}), files } };
    });
    return null;
  };

  const removeFile = (field: FileField, path: string) => {
    supabase.storage.from('onboarding-docs').remove([path]); // sin bloquear la UI
    setData(prev => {
      const files = { ...(prev.documents?.files || {}) };
      if (Array.isArray(files[field])) files[field] = (files[field] as string[]).filter(p => p !== path);
      else delete files[field];
      return { ...prev, documents: { ...(prev.documents || {}), files } };
    });
  };

  // ── Envío final ─────────────────────────────────────────
  const submitApplication = async () => {
    if (!userId) return { success: false, error: 'Tu sesión expiró. Vuelve a iniciar sesión.' };
    const { error } = await supabase.from('onboarding_applications').insert([{
      user_id: userId,
      full_name: data.full_name,
      company_name: data.company_name,
      email: data.email,
      phone: data.phone,
      birth_date: data.birth_date,
      main_specialty: data.main_specialty,
      is_other_specialty: data.is_other_specialty,
      other_specialty_name: data.other_specialty_name,
      other_specialty_description: data.other_specialty_description,
      zones: data.zones,
      sub_services: data.sub_services,
      availability: data.availability,
      documents: data.documents,
      interview_details: data.interview,
      exam_results: data.exam,
      status: 'application',
    }]);
    if (error) {
      return {
        success: false,
        error: error.code === '23505'
          ? 'Ya enviaste una solicitud con esta cuenta.'
          : 'No pudimos enviar tu solicitud. Intenta de nuevo en un momento.',
      };
    }

    // Evidencia de la declaración de veracidad y del consentimiento de referencias
    await supabase.from('legal_acceptances').insert([
      { user_id: userId, document: 'declaracion_veracidad', version: LEGAL_VERSION, source: 'onboarding' },
      { user_id: userId, document: 'consentimiento_referencias', version: LEGAL_VERSION, source: 'onboarding' },
    ]);
    try { sessionStorage.removeItem(draftKey(userId)); } catch { /* noop */ }
    setPhase('submitted');
    return { success: true };
  };

  const signOutAndRestart = async () => {
    await supabase.auth.signOut();
    setUserId(null);
    setPhase('new');
  };

  return (
    <OnboardingContext.Provider value={{
      data, updateData, updateDocuments, phase, userId,
      createAccount, uploadFile, removeFile, submitApplication, signOutAndRestart,
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

// ── Validaciones compartidas ─────────────────────────────
export const onlyDigits = (v: string) => (v || '').replace(/\D/g, '');
export const isEmail = (v?: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((v || '').trim());
export const isCurp = (v?: string) => /^[A-Z]{4}\d{6}[HMX][A-Z]{5}[A-Z0-9]\d$/.test((v || '').toUpperCase());
export const isRfc = (v?: string) => /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test((v || '').toUpperCase());
export function isAdult(birth?: string) {
  if (!birth) return false;
  const d = new Date(`${birth}T00:00:00`);
  if (isNaN(d.getTime())) return false;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age >= 18 && age <= 100;
}
export const fileCount = (v?: string | string[]) => (Array.isArray(v) ? v.length : v ? 1 : 0);
