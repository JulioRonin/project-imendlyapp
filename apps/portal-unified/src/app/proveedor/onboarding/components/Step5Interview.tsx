import { ArrowRight, Check, Video } from 'lucide-react';
import { useOnboarding } from './OnboardingContext';

const LABEL_CLS = 'block text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-3';

export const Step5Interview: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const { data, updateData } = useOnboarding();
  const selectedDate = data.interview?.date || null;
  const selectedTime = data.interview?.time || null;

  const upcomingDays = [
    { id: 'today', name: 'Hoy', date: 'Jue 26' },
    { id: 'tmrw', name: 'Mañana', date: 'Vie 27' },
    { id: 'mon', name: 'Lunes', date: 'Lun 30' },
    { id: 'tue', name: 'Martes', date: 'Mar 31' },
  ];

  const timesMap: Record<string, string[]> = {
    today: ['04:00 PM', '04:30 PM', '05:45 PM'],
    tmrw: ['10:00 AM', '11:30 AM', '01:00 PM', '03:30 PM'],
    mon: ['09:00 AM', '09:45 AM', '11:00 AM', '02:00 PM', '04:15 PM'],
    tue: ['10:00 AM', '12:30 PM', '02:45 PM', '05:00 PM'],
  };

  const handleDateSelect = (id: string) => {
    if (selectedDate !== id) {
      updateData({ interview: { date: id, time: undefined } });
    }
  };

  const handleTimeSelect = (time: string) => {
    updateData({ interview: { ...data.interview, time } });
  };

  const canNext = !!(selectedDate && selectedTime);

  return (
    <div className="flex-1 flex flex-col space-y-5">
      <section className="v2-scale bg-cream rounded-[2.25rem] v2-shadow-soft p-6 space-y-7">
        <p className="text-[14px] font-medium text-muted">Agenda una breve videollamada de 15 min con nuestro equipo de CX.</p>

        <div>
          <label className={LABEL_CLS}>Selecciona un día</label>
          {/* Date Selector Carousel */}
          <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-6 px-6 no-scrollbar">
            {upcomingDays.map(day => {
              const active = selectedDate === day.id;
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => handleDateSelect(day.id)}
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

        {/* Time Selector Grid */}
        {selectedDate && (
          <div className="v2-rise">
            <label className={LABEL_CLS}>Selecciona el horario</label>
            <div className="grid grid-cols-2 gap-2.5">
              {timesMap[selectedDate]?.map(time => {
                const active = selectedTime === time;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => handleTimeSelect(time)}
                    className={`h-12 px-4 rounded-full text-[13px] font-semibold tabular-nums v2-press transition-colors duration-300 flex items-center justify-center gap-2 ${
                      active ? 'bg-ink text-white v2-shadow-lift' : 'bg-sand text-muted hover:text-ink'
                    }`}
                  >
                    {active && <Check size={14} />} {time}
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
              'Protocolo de servicio al cliente I mendly',
              'Confirmación de herramientas y equipo',
              'Dudas sobre pagos y el modelo escrow',
            ].map(item => (
              <li key={item} className="flex items-start gap-2.5 text-[13px] font-medium text-ink/80">
                <Check size={14} className="shrink-0 mt-0.5 text-ink" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Botonera sticky */}
      <div className="sticky bottom-0 mt-auto -mx-6 px-6 pt-4 pb-6 bg-gradient-to-t from-linen via-linen/95 to-transparent">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} className="h-14 px-6 rounded-full text-[13px] font-semibold text-muted hover:text-ink v2-press transition-colors">Atrás</button>
          <button
            type="button"
            onClick={onNext}
            disabled={!selectedDate || !selectedTime}
            className={`flex-1 h-14 rounded-full text-[13px] font-bold flex items-center justify-center gap-2 transition-colors ${
              canNext ? 'bg-primary text-ink hover:bg-primary-dark v2-press shadow-lg shadow-primary/25' : 'bg-sand text-faint cursor-not-allowed'
            }`}
          >
            {canNext ? <>Confirmar agenda <ArrowRight size={16} /></> : 'Selecciona un horario'}
          </button>
        </div>
      </div>
    </div>
  );
};
