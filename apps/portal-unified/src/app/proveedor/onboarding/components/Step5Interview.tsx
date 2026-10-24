"use client";

import React, { useMemo } from 'react';
import { Check, Video } from 'lucide-react';
import { useOnboarding } from './OnboardingContext';
import { WizardFooter } from './WizardParts';

const LABEL_CLS = 'block text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-3';

const SLOTS = ['09:00', '10:00', '11:30', '13:00', '15:00', '16:30', '18:00'];

const DAY_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTH_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const pad = (n: number) => String(n).padStart(2, '0');
const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const to12h = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return `${pad(((h + 11) % 12) + 1)}:${pad(m)} ${h < 12 ? 'AM' : 'PM'}`;
};

/** Próximos 4 días hábiles (lun–vie) a partir de mañana. */
function nextBusinessDays(count = 4) {
  const out: { iso: string; name: string; date: string }[] = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  while (out.length < count) {
    d.setDate(d.getDate() + 1);
    const wd = d.getDay();
    if (wd === 0 || wd === 6) continue;
    out.push({
      iso: isoDate(d),
      name: out.length === 0 && (d.getTime() - Date.now()) < 36 * 3600 * 1000 ? 'Mañana' : DAY_SHORT[wd],
      date: `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`,
    });
  }
  return out;
}

export const Step5Interview: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const { data, updateData } = useOnboarding();
  const days = useMemo(() => nextBusinessDays(), []);

  // Una fecha guardada que ya pasó (borrador viejo) no cuenta
  const selectedDate = days.some(d => d.iso === data.interview?.date) ? data.interview?.date : undefined;
  const selectedTime = selectedDate ? data.interview?.time : undefined;

  const select = (iso: string, time?: string) => {
    const day = days.find(d => d.iso === iso);
    updateData({
      interview: {
        date: iso,
        time,
        label: day && time ? `${day.name} ${day.date} · ${to12h(time)}` : undefined,
      },
    });
  };

  const missing = !selectedDate ? 'Elige un día para tu entrevista' : !selectedTime ? 'Elige un horario' : '';

  return (
    <div className="flex-1 flex flex-col space-y-5">
      <section className="v2-scale bg-cream rounded-[2.25rem] v2-shadow-soft p-6 space-y-7">
        <p className="text-[14px] font-medium text-muted">
          Agenda una videollamada de 15 minutos con nuestro equipo. Horario de Ciudad Juárez.
        </p>

        <div>
          <label className={LABEL_CLS}>Selecciona un día</label>
          <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-6 px-6 no-scrollbar">
            {days.map(day => {
              const active = selectedDate === day.iso;
              return (
                <button
                  key={day.iso}
                  type="button"
                  onClick={() => active || select(day.iso)}
                  className={`shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-[1.5rem] v2-press transition-colors duration-300 ${
                    active ? 'bg-ink text-white v2-shadow-lift' : 'bg-sand text-ink hover:bg-primary-light'
                  }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-[0.18em] ${active ? 'text-white/60' : 'text-muted'}`}>{day.name}</span>
                  <span className="text-[16px] font-semibold mt-1.5 tabular-nums">{day.date}</span>
                </button>
              );
            })}
          </div>
        </div>

        {selectedDate && (
          <div className="v2-rise">
            <label className={LABEL_CLS}>Selecciona el horario</label>
            <div className="grid grid-cols-2 gap-2.5">
              {SLOTS.map(time => {
                const active = selectedTime === time;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => select(selectedDate, time)}
                    className={`h-12 px-4 rounded-full text-[13px] font-semibold tabular-nums v2-press transition-colors duration-300 flex items-center justify-center gap-2 ${
                      active ? 'bg-ink text-white v2-shadow-lift' : 'bg-sand text-muted hover:text-ink'
                    }`}
                  >
                    {active && <Check size={14} />} {to12h(time)}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <section className="v2-scale bg-lavender-light rounded-[1.75rem] p-6 flex items-start gap-4" style={{ animationDelay: '120ms' }}>
        <span className="w-12 h-12 shrink-0 rounded-[1rem] bg-cream text-ink flex items-center justify-center v2-shadow-soft">
          <Video size={20} />
        </span>
        <div>
          <p className="text-[14px] font-semibold text-ink mb-2">¿Qué revisaremos?</p>
          <ul className="space-y-2">
            {[
              'Protocolo de servicio al cliente de I mendly',
              'Herramientas y equipo con los que trabajas',
              'Cómo funciona el cobro: anticipo al aceptar y liquidación al día siguiente de terminar',
            ].map(item => (
              <li key={item} className="flex items-start gap-2.5 text-[13px] font-medium text-ink/80">
                <Check size={14} className="shrink-0 mt-0.5 text-ink" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <WizardFooter onBack={onBack} onNext={onNext} canNext={!missing} missing={missing} label="Confirmar agenda" />
    </div>
  );
};
