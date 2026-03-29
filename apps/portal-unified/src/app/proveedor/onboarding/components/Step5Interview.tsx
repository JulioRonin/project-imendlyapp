import { Button } from '@i-mendly/shared/components/Button';
import { useOnboarding } from './OnboardingContext';

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

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-3xl font-black mb-2 tracking-tight">Entrevista de calidad</h2>
      <p className="text-white/50 mb-8 font-medium">Agenda una breve videollamada de 15 min con nuestro equipo de CX.</p>

      <div className="space-y-6 mb-10">
        <p className="text-sm font-black text-white/40 uppercase tracking-widest mb-4">Selecciona un Día</p>
        
        {/* Date Selector Carousel */}
        <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
          {upcomingDays.map(day => (
            <button
              key={day.id}
              onClick={() => handleDateSelect(day.id)}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-[2rem] border transition-all duration-300
                ${selectedDate === day.id 
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] scale-[1.05]' 
                  : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10'
                }`}
            >
              <span className={`text-xs font-black uppercase tracking-widest ${selectedDate === day.id ? 'text-emerald-400' : 'text-white/40'}`}>{day.name}</span>
              <span className={`text-sm font-bold mt-1 ${selectedDate === day.id ? 'text-white' : 'text-white/80'}`}>{day.date}</span>
            </button>
          ))}
        </div>

        {/* Time Selector Grid */}
        {selectedDate && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-sm font-black text-white/40 uppercase tracking-widest mb-4">Selecciona el Horario</p>
            <div className="grid grid-cols-2 gap-3">
              {timesMap[selectedDate]?.map(time => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`py-4 px-6 rounded-2xl border transition-all text-sm font-bold
                    ${selectedTime === time 
                      ? 'border-emerald-500 bg-emerald-500 text-brand-night shadow-[0_4px_15px_rgba(16,185,129,0.3)]' 
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10'
                    }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white/5 rounded-3xl p-6 mb-10">
        <h4 className="text-sm font-black uppercase tracking-widest text-emerald-500 mb-3">¿Qué revisaremos?</h4>
        <ul className="text-sm text-white/60 space-y-3 font-medium">
          <li className="flex gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-emerald-500/50"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>
            Protocolo de servicio al cliente I mendly
          </li>
          <li className="flex gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-emerald-500/50"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>
            Confirmación de herramientas y equipo
          </li>
          <li className="flex gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-emerald-500/50"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>
            Dudas sobre pagos y el modelo escrow
          </li>
        </ul>
      </div>

      <div className="flex gap-4">
        <Button variant="ghost" onClick={onBack} className="flex-1 text-white/40 hover:text-white border-white/10">Atrás</Button>
        <Button 
          variant="primary" 
          onClick={onNext} 
          disabled={!selectedDate || !selectedTime}
          className={`flex-[2] border-none transition-all ${(!selectedDate || !selectedTime) ? 'bg-white/5 text-white/30 cursor-not-allowed opacity-50' : 'bg-emerald-600 hover:bg-emerald-500 text-brand-night shadow-[0_0_20px_rgba(16,185,129,0.3)]'}`}
        >
          {selectedDate && selectedTime ? 'Confirmar Agenda' : 'Selecciona un horario'}
        </Button>
      </div>
    </div>
  );
};
