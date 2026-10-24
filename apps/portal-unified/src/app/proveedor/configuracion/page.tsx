"use client";

import React, { useState } from 'react';
import {
  Camera,
  ShieldCheck,
  Globe,
  Share2,
  CheckCircle2,
  MapPin,
  ChevronRight,
  User,
  Briefcase,
  FileText,
  Eye
} from 'lucide-react';
import { Avatar } from '@i-mendly/shared/components/Avatar';

const LOCATIONS = {
  'CDMX': ['Polanco', 'Condesa', 'Roma', 'Santa Fe', 'Centro Histórico'],
  'Monterrey': ['San Pedro', 'San Nicolás', 'Santa Catarina', 'Centro'],
  'Guadalajara': ['Zapopan', 'Providencia', 'Tlaquepaque'],
  'Juarez': ['Campestre', 'Pradera Dorada', 'Campos Elíseos'],
  'Chihuahua': ['San Felipe', 'Las Haciendas', 'Cantera']
};

const EYEBROW = 'text-[10px] font-bold uppercase tracking-[0.18em]';
const FIELD_INPUT = 'w-full bg-transparent border-0 outline-none text-[14px] font-semibold text-ink placeholder:text-faint placeholder:font-medium text-right';

/** Fila de ajuste: squircle + label + valor editable (misma tarjeta, separadas por border-line). */
function SettingRow({
  icon,
  label,
  children,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-line last:border-b-0 focus-within:bg-sand/60 transition-colors">
      <span className="w-11 h-11 shrink-0 rounded-[1rem] bg-primary-light text-primary-deep flex items-center justify-center">
        {icon}
      </span>
      <div className="min-w-0 shrink-0 w-32 sm:w-44">
        <p className="text-[14px] font-semibold text-ink leading-tight">{label}</p>
        {hint && <p className="text-[11.5px] font-medium text-faint mt-0.5">{hint}</p>}
      </div>
      <div className="flex-1 min-w-0 flex items-center justify-end gap-2">
        {children}
      </div>
    </div>
  );
}

export default function ConfigurationPage() {
  const [selectedCity, setSelectedCity] = useState<keyof typeof LOCATIONS | ''>('');
  const [selectedArea, setSelectedArea] = useState<string>('');

  const currentAreas = selectedCity ? LOCATIONS[selectedCity] : [];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-linen">
      <main className="flex-1 overflow-y-auto px-6 md:px-12 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* ── Cabecera editorial ── */}
          <header className="pt-10 md:pt-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className={`v3-blur-in ${EYEBROW} text-primary-deep`}>Tu cuenta</p>
              <h1 className="v3-blur-in text-[34px] md:text-[44px] font-semibold tracking-tight leading-[1.02] text-ink mt-2" style={{ animationDelay: '100ms' }}>
                Configuración
              </h1>
              <p className="v3-blur-in mt-2 text-[14px] font-medium text-muted" style={{ animationDelay: '200ms' }}>
                Perfil público y preferencias de la cuenta
              </p>
            </div>

            <div className="v3-blur-in flex items-center gap-3" style={{ animationDelay: '300ms' }}>
              <button type="button" className="h-12 md:h-14 px-5 rounded-full bg-cream text-ink text-[13px] font-bold flex items-center gap-2 v2-shadow-soft v2-press">
                <Eye size={16} /> Previsualizar
              </button>
              <button type="button" className="h-12 md:h-14 px-6 rounded-full bg-ink text-white text-[13px] font-bold v2-press">
                Guardar cambios
              </button>
            </div>
          </header>

          <div className="mt-9 grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* ── Perfil ── */}
              <section className="v2-rise v2-d1 bg-cream rounded-[2.25rem] v2-shadow-soft overflow-hidden">
                <div className="px-5 pt-6 pb-5 flex items-center gap-5">
                  <div className="relative shrink-0">
                    <Avatar size="xl" name="Juan Perez" className="w-24 h-24 rounded-[1.9rem] ring-4 ring-sand" />
                    <button type="button" aria-label="Cambiar foto" className="absolute -bottom-1.5 -right-1.5 w-10 h-10 bg-ink text-white rounded-full flex items-center justify-center ring-4 ring-cream v2-press">
                      <Camera size={16} />
                    </button>
                  </div>
                  <div className="min-w-0">
                    <p className={`${EYEBROW} text-muted`}>Datos generales</p>
                    <h2 className="mt-1 text-[22px] font-semibold tracking-tight text-ink leading-tight">Así te ven los clientes</h2>
                    <p className="mt-1 text-[13px] font-medium text-muted">Nombre, oficio y una presentación breve.</p>
                  </div>
                </div>

                <SettingRow icon={<User size={18} />} label="Nombre público">
                  <input defaultValue="Juan Pérez" className={FIELD_INPUT} />
                </SettingRow>
                <SettingRow icon={<Briefcase size={18} />} label="Ocupación">
                  <input defaultValue="Especialista en Limpieza" className={FIELD_INPUT} />
                </SettingRow>
                <div className="px-5 py-5 flex items-start gap-4">
                  <span className="w-11 h-11 shrink-0 rounded-[1rem] bg-primary-light text-primary-deep flex items-center justify-center">
                    <FileText size={18} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-ink leading-tight mb-3">Presentación</p>
                    <textarea
                      className="w-full bg-sand border-0 rounded-[1.25rem] px-5 py-4 text-[14px] font-medium text-ink min-h-[104px] outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                      defaultValue="Mas de 10 años de experiencia brindando servicios de alta calidad para hogares exigentes."
                    />
                  </div>
                </div>
              </section>

              {/* ── Redes ── */}
              <section className="v2-rise v2-d2 bg-cream rounded-[2.25rem] v2-shadow-soft overflow-hidden">
                <div className="px-5 pt-6 pb-3">
                  <p className={`${EYEBROW} text-muted`}>Redes</p>
                  <h2 className="mt-1 text-[20px] font-semibold tracking-tight text-ink leading-tight">Dónde encontrarte</h2>
                </div>
                <SettingRow icon={<Globe size={18} />} label="Sitio web">
                  <input type="text" defaultValue="www.mendly.com/juanp" className={FIELD_INPUT} />
                </SettingRow>
                <SettingRow icon={<Share2 size={18} />} label="Redes sociales">
                  <input type="text" defaultValue="@juan_services" className={FIELD_INPUT} />
                </SettingRow>
              </section>

              {/* ── Ubicación ── */}
              <section className="v2-rise v2-d3 bg-cream rounded-[2.25rem] v2-shadow-soft overflow-hidden">
                <div className="px-5 pt-6 pb-3">
                  <p className={`${EYEBROW} text-muted`}>Zona de trabajo</p>
                  <h2 className="mt-1 text-[20px] font-semibold tracking-tight text-ink leading-tight">Dónde atiendes</h2>
                </div>
                <SettingRow icon={<MapPin size={18} />} label="Ciudad">
                  <select
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value as any);
                      setSelectedArea('');
                    }}
                    className={`${FIELD_INPUT} appearance-none cursor-pointer`}
                  >
                    <option value="" disabled>Selecciona una ciudad</option>
                    <option value="CDMX">CDMX</option>
                    <option value="Monterrey">Monterrey</option>
                    <option value="Guadalajara">Guadalajara</option>
                    <option value="Juarez">Ciudad Juárez</option>
                    <option value="Chihuahua">Chihuahua</option>
                  </select>
                  <ChevronRight size={16} className="shrink-0 text-faint" />
                </SettingRow>
                <SettingRow icon={<MapPin size={18} />} label="Área principal" hint={selectedCity ? undefined : 'Primero elige una ciudad'}>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    disabled={!selectedCity}
                    className={`${FIELD_INPUT} appearance-none cursor-pointer disabled:text-faint disabled:cursor-not-allowed`}
                  >
                    <option value="" disabled>
                      {selectedCity ? 'Selecciona un área' : '—'}
                    </option>
                    {currentAreas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                  <ChevronRight size={16} className="shrink-0 text-faint" />
                </SettingRow>
              </section>
            </div>

            {/* ── Verificación ── */}
            <aside className="space-y-5">
              <div className="v2-rise v2-d3 relative overflow-hidden v3-night-grad rounded-[2.25rem] p-7 text-on-dark v2-shadow-lift">
                <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-mint/20 blur-3xl pointer-events-none" />
                <div className="relative">
                  <span className="w-14 h-14 rounded-[1.2rem] bg-mint-light text-mint-deep flex items-center justify-center mb-5">
                    <ShieldCheck size={26} />
                  </span>
                  <p className={`${EYEBROW} text-on-dark/60`}>Estado de verificación</p>
                  <h3 className="mt-2 text-[22px] font-semibold tracking-tight leading-tight">Perfil verificado</h3>
                  <p className="mt-2 text-[13px] font-medium text-on-dark/60 leading-relaxed">
                    Tu perfil cumple con todos los estándares de seguridad de I mendly.
                  </p>
                  <span className="mt-4 inline-flex items-center h-8 px-3.5 rounded-full bg-mint-light text-mint-deep text-[12px] font-semibold">
                    Partner Premium
                  </span>

                  <div className="mt-7 space-y-2">
                    {['Identidad', 'Domicilio', 'Seguro RC'].map((v, i) => (
                      <div key={i} className="flex justify-between items-center bg-white/[0.07] px-4 h-12 rounded-[1rem]">
                        <span className="text-[13px] font-semibold">{v}</span>
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-mint">
                          <CheckCircle2 size={14} /> Verificado
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
