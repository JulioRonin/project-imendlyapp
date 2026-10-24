"use client";

import React from 'react';
import { Check, MapPin } from 'lucide-react';
import { useOnboarding } from './OnboardingContext';
import { WizardFooter } from './WizardParts';

const LABEL_CLS = 'block text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-3';
const INPUT_CLS = 'w-full h-14 px-5 bg-sand rounded-[1.25rem] border-0 text-[15px] font-semibold text-ink placeholder:text-faint placeholder:font-medium outline-none focus:ring-2 focus:ring-primary/30 transition-shadow';
const PILL_BASE = 'rounded-full text-[13px] font-semibold v2-press transition-colors duration-300';
const PILL_ON = 'bg-ink text-white v2-shadow-lift';
const PILL_OFF = 'bg-sand text-muted hover:text-ink';

const CATEGORIES = [
  {
    id: 'elec',
    name: 'Electricidad',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    )
  },
  {
    id: 'plom',
    name: 'Plomería',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.492-3.053c.24-.294.416-.636.516-1.002L15 9.75V4.5M11.42 15.17l-3.28-3.28m0 0L4.5 8.25m3.64 3.64c-.366.1-.708.276-1.002.516L4.5 15v5.25l1.373-1.373.948.948 1.157-1.157.948.948 1.157-1.157" />
      </svg>
    )
  },
  {
    id: 'pint',
    name: 'Pintura',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25l4.1-4.1M22.5 3.75h-2.25c-1.243 0-2.25 1.007-2.25 2.25v1.5c0 1.243 1.007 2.25 2.25 2.25h2.25c1.243 0 2.25-1.007 2.25-2.25v-1.5c0-1.243-1.007-2.25-2.25-2.25ZM9.75 14.25l6.401-6.402m-6.401 6.402a3.75 3.75 0 0 1-5.304 0M16.151 7.848a3.75 3.75 0 0 1 5.304 0Z" />
      </svg>
    )
  },
  {
    id: 'clim',
    name: 'Climas/AC',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20m0 0l3-3m-3 3l-3-3M22 12H2m0 0l3-3m-3 3l3 3m10.121-7.121L4.879 19.121m0 0l3.082.918m-3.082-.918l-.918-3.082m15.242 0L4.879 4.879m0 0l3.082-.918M4.879 4.879l-.918 3.082" />
      </svg>
    )
  },
  {
    id: 'limp',
    name: 'Limpieza',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    )
  },
  {
    id: 'alba',
    name: 'Albañilería',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.015-.39.03-.586.045M12 2.25v9m-7.87 2.45c-.196-.015-.391-.03-.586-.045M4.13 14.15a2.18 2.18 0 0 1-.75-1.661V8.706c0-1.081.768-2.015 1.837-2.175A48.114 48.114 0 0 1 8.63 6.14m12.37-3.89h-10.5" />
      </svg>
    )
  },
  {
    id: 'carp',
    name: 'Carpintería',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    )
  },
  {
    id: 'fumi',
    name: 'Fumigación',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
      </svg>
    )
  },
  {
    id: 'otro',
    name: 'Otro',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    )
  }
];

const SUB_SERVICES: Record<string, string[]> = {
  elec: ['Cortocircuitos', 'Instalación de ventiladores', 'Cableado general', 'Contactos/Apagadores', 'Revisión de tableros'],
  plom: ['Fugas de agua', 'Bóilers/Calentadores', 'Destape de tuberías', 'Instalación de tinacos', 'Reparación de sanitarios'],
  pint: ['Interiores', 'Exteriores', 'Impermeabilización', 'Resanes', 'Pintura en herrería'],
  clim: ['Mantenimiento Preventivo (Minisplit)', 'Instalación de Minisplit', 'Carga de gas Refrigerante', 'Detección de Fugas AC', 'Limpieza de ductos'],
  limp: ['Limpieza Profunda', 'Limpieza Post-construcción', 'Lavado de salas/alfombras', 'Pulido de pisos'],
  alba: ['Remodelaciones', 'Enyesado/Estuco', 'Pisos/Azulejos', 'Muros de block', 'Firmes y banquetas'],
  carp: ['Reparación de muebles', 'Instalación de puertas', 'Fabricación de clósets', 'Cocinas integrales', 'Restauración'],
  fumi: ['Cucarachas/Hormigas', 'Chinches de cama', 'Arañas y alacranes', 'Fumigación preventiva', 'Desinfección de virus'],
};

const ZONES = [
  'Centro', 'Gómez Morín', 'Valle del Sol', 'Sendero', 'Las Torres',
  'Pronaf', 'Satélite', 'Anapra', 'Tierra Nueva', 'El Barreal', 'Zaragoza'
];

export const Step4Services: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const { data, updateData } = useOnboarding();

  const handleCatToggle = (id: string) => {
    const isNewSelect = data.main_specialty !== id;
    updateData({
      main_specialty: isNewSelect ? id : undefined,
      is_other_specialty: id === 'otro' && isNewSelect,
      sub_services: [] // Reset sub-services when category changes
    });
  };

  const selectedSub = data.sub_services || [];
  const selectedZones = data.zones || [];
  const availability = {
    days: ['L', 'M', 'X', 'J', 'V'], startTime: '08:00', endTime: '18:00', useGeofence: false,
    ...(data.availability || {}),
  };

  const handleSubToggle = (sub: string) => {
    const newSubs = selectedSub.includes(sub) ? selectedSub.filter(x => x !== sub) : [...selectedSub, sub];
    updateData({ sub_services: newSubs });
  };

  const handleZoneToggle = (zone: string) => {
    const newZones = selectedZones.includes(zone) ? selectedZones.filter(x => x !== zone) : [...selectedZones, zone];
    updateData({ zones: newZones });
  };

  const handleDayToggle = (day: string) => {
    const currentDays = availability.days || [];
    const newDays = currentDays.includes(day) ? currentDays.filter((x: string) => x !== day) : [...currentDays, day];
    updateData({ availability: { ...availability, days: newDays } });
  };

  const isOther = data.main_specialty === 'otro';

  const missing =
    !data.main_specialty ? 'Elige tu categoría principal' :
    isOther && (data.other_specialty_name || '').trim().length < 3 ? 'Escribe el nombre de tu especialidad' :
    isOther && (data.other_specialty_description || '').trim().length < 20 ? 'Describe tus servicios (mínimo 20 caracteres)' :
    !isOther && selectedSub.length === 0 ? 'Marca al menos un servicio que ofreces' :
    !availability.useGeofence && selectedZones.length === 0 ? 'Elige al menos una zona de cobertura' :
    (availability.days || []).length === 0 ? 'Elige al menos un día laboral' : '';

  // Guarda los valores por defecto del horario aunque no se toquen
  const next = () => {
    updateData({ availability });
    onNext();
  };

  return (
    <div className="flex-1 flex flex-col space-y-5">
      {/* ── Especialidad ── */}
      <section className="v2-scale bg-cream rounded-[2.25rem] v2-shadow-soft p-6 space-y-7">
        <div>
          <p className="text-[14px] font-medium text-muted mb-5">Selecciona la categoría principal donde eres experto.</p>
          <label className={LABEL_CLS}>Categoría principal</label>
          <div className="grid grid-cols-2 gap-2.5">
            {CATEGORIES.map(cat => {
              const active = data.main_specialty === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCatToggle(cat.id)}
                  className={`h-12 px-4 flex items-center gap-2.5 ${PILL_BASE} ${active ? PILL_ON : PILL_OFF}`}
                >
                  <span className={active ? 'text-primary' : 'text-primary-deep'}>{cat.icon}</span>
                  <span className="truncate">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conditional "Other" fields */}
        {isOther && (
          <div className="v2-rise space-y-4">
            <div>
              <label className={LABEL_CLS}>¿Cuál es tu especialidad?</label>
              <input
                placeholder="Ej. Herrería Artística"
                value={data.other_specialty_name || ''}
                onChange={e => updateData({ other_specialty_name: e.target.value })}
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className={LABEL_CLS}>Describe tus servicios</label>
              <textarea
                className="w-full bg-sand rounded-[1.25rem] border-0 px-5 py-4 text-[14px] font-medium text-ink placeholder:text-faint outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-shadow"
                rows={3}
                placeholder="Ej. Fabricación de barandales, puertas de seguridad y estructuras metálicas..."
                value={data.other_specialty_description || ''}
                onChange={e => updateData({ other_specialty_description: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Dynamic Subservices */}
        {data.main_specialty && !isOther && (
          <div className="v2-rise">
            <label className={LABEL_CLS}>¿Qué servicios ofreces específicamente?</label>
            <div className="bg-sand rounded-[1.5rem] p-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep px-3 pt-2 pb-1">
                {CATEGORIES.find(c => c.id === data.main_specialty)?.name}
              </p>
              <div className="flex flex-col">
                {(SUB_SERVICES[data.main_specialty] || []).map(sub => {
                  const on = selectedSub.includes(sub);
                  return (
                    <label key={sub} className={`flex items-center gap-3 cursor-pointer px-3 h-12 rounded-[1rem] v2-press transition-colors ${on ? 'bg-cream' : 'hover:bg-cream/60'}`}>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={on}
                        onChange={() => handleSubToggle(sub)}
                      />
                      <span className={`w-6 h-6 shrink-0 rounded-[0.5rem] flex items-center justify-center transition-colors ${on ? 'bg-ink text-white' : 'bg-cream text-transparent ring-1 ring-line'}`}>
                        <Check size={13} strokeWidth={3} />
                      </span>
                      <span className={`text-[13.5px] select-none ${on ? 'font-semibold text-ink' : 'font-medium text-muted'}`}>{sub}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Zonas ── */}
      <section className="v2-scale bg-cream rounded-[2.25rem] v2-shadow-soft p-6" style={{ animationDelay: '100ms' }}>
        <label className={LABEL_CLS}>Zonas de cobertura en Cd. Juárez</label>
        <button
          type="button"
          onClick={() => updateData({ availability: { ...availability, useGeofence: !availability.useGeofence } })}
          className={`w-full h-14 px-5 flex items-center gap-3 ${PILL_BASE} mb-3 ${availability.useGeofence ? PILL_ON : PILL_OFF}`}
        >
          <MapPin size={16} className={availability.useGeofence ? 'text-primary' : 'text-primary-deep'} />
          <span>Operar en radio libre (10 km)</span>
          {availability.useGeofence && <Check size={16} className="ml-auto" />}
        </button>

        {!availability.useGeofence && (
          <div className="v2-rise flex flex-wrap gap-2">
            {ZONES.map(z => (
              <button
                key={z}
                type="button"
                onClick={() => handleZoneToggle(z)}
                className={`h-11 px-5 ${PILL_BASE} ${selectedZones.includes(z) ? PILL_ON : PILL_OFF}`}
              >
                {z}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ── Horario ── */}
      <section className="v2-scale bg-cream rounded-[2.25rem] v2-shadow-soft p-6" style={{ animationDelay: '200ms' }}>
        <label className={LABEL_CLS}>Días y horarios laborales</label>
        <div className="flex items-center justify-between gap-1.5 mb-5">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => {
            const on = (availability.days || []).includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => handleDayToggle(day)}
                className={`w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-semibold v2-press transition-colors duration-300 ${on ? 'bg-ink text-white v2-shadow-lift' : 'bg-sand text-muted hover:text-ink'}`}
              >
                {day}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-2 ml-1">Desde</label>
            <select
              className={`${INPUT_CLS} appearance-none cursor-pointer tabular-nums`}
              value={availability.startTime || '08:00'}
              onChange={e => updateData({ availability: { ...availability, startTime: e.target.value } })}
            >
              <option value="06:00">06:00 AM</option>
              <option value="07:00">07:00 AM</option>
              <option value="08:00">08:00 AM</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-2 ml-1">Hasta</label>
            <select
              className={`${INPUT_CLS} appearance-none cursor-pointer tabular-nums`}
              value={availability.endTime || '18:00'}
              onChange={e => updateData({ availability: { ...availability, endTime: e.target.value } })}
            >
              <option value="13:00">01:00 PM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
              <option value="17:00">05:00 PM</option>
              <option value="18:00">06:00 PM</option>
              <option value="19:00">07:00 PM</option>
              <option value="20:00">08:00 PM</option>
              <option value="21:00">09:00 PM</option>
              <option value="22:00">10:00 PM</option>
            </select>
          </div>
        </div>
      </section>

      <WizardFooter onBack={onBack} onNext={next} canNext={!missing} missing={missing} />
    </div>
  );
};
