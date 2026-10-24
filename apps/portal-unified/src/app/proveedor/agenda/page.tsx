"use client";

import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  X,
  CheckCircle2,
  XCircle,
  RefreshCw,
  CalendarDays
} from 'lucide-react';
import { Avatar } from '@i-mendly/shared/components/Avatar';

const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const EYEBROW = 'text-[10px] font-bold uppercase tracking-[0.18em]';
const INPUT_CLS = 'w-full h-14 px-5 bg-sand rounded-[1.25rem] border-0 text-[15px] font-semibold text-ink tabular-nums placeholder:text-faint placeholder:font-medium outline-none focus:ring-2 focus:ring-primary/30';

const ALL_EVENTS = [
  {
    id: 1,
    title: 'Limpieza Profunda',
    client: 'Beatriz Soler',
    year: 2026, month: 2, day: 26,
    time: '09:00 - 11:00',
    type: 'cleaning',
    status: 'pending',
    color: 'bg-lavender',
    image: '/assets/cleaning_professional.png',
    address: 'Av. Las Palmas 342, San Pedro',
    details: 'Limpieza profunda de 3 habitaciones y 2 baños completos. Incluye ventanas interiores.'
  },
  {
    id: 2,
    title: 'Mantenimiento AA',
    client: 'Roberto Gomez',
    year: 2026, month: 2, day: 26,
    time: '12:30 - 14:00',
    type: 'tech',
    status: 'pending',
    color: 'bg-primary',
    image: '/assets/ac_maintenance_boutique.png',
    address: 'Condominio Alta Vista, Depto 4B',
    details: 'Mantenimiento preventivo de 2 unidades minisplit de 1.5 toneladas.'
  },
  {
    id: 3,
    title: 'Alta Costura',
    client: 'Elena Martinez',
    year: 2026, month: 2, day: 24,
    time: '15:00 - 18:00',
    type: 'decor',
    status: 'confirmed',
    color: 'bg-ink',
    image: '/assets/fashion_sewing.png',
    address: 'Plaza Fiesta, Local 12',
    details: 'Ajuste de vestido de noche y dobladillo de pantalón de traje.'
  }
];

const statusPill = (status: string) => (
  <span className={`inline-flex items-center h-7 px-3 rounded-full text-[11px] font-semibold whitespace-nowrap ${
    status === 'confirmed' ? 'bg-mint-light text-mint-deep' : 'bg-primary-light text-primary-deep'
  }`}>
    {status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
  </span>
);

export default function AgendaPage() {
  const [view, setView] = useState<'day' | 'week' | 'month'>('month');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 26)); // Fixed start date for simulation as Mar 26, 2026
  const [selectedDateObj, setSelectedDateObj] = useState<Date>(new Date(2026, 2, 26));

  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isCounterOffering, setIsCounterOffering] = useState(false);
  const [counterDate, setCounterDate] = useState('2026-03-27');
  const [counterTime, setCounterTime] = useState('10:00');

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const handlePrev = () => {
    if (view === 'month') {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    } else if (view === 'week') {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 7);
        setCurrentDate(newDate);
    } else {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 1);
        setCurrentDate(newDate);
        setSelectedDateObj(newDate);
    }
  };

  const handleNext = () => {
    if (view === 'month') {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    } else if (view === 'week') {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 7);
        setCurrentDate(newDate);
    } else {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 1);
        setCurrentDate(newDate);
        setSelectedDateObj(newDate);
    }
  };

  const eventsForSelectedDate = useMemo(() => {
    return ALL_EVENTS.filter(e =>
      e.year === selectedDateObj.getFullYear() &&
      e.month === selectedDateObj.getMonth() &&
      e.day === selectedDateObj.getDate()
    );
  }, [selectedDateObj]);

  // Calendar Grid Generation
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  // Adjust so Monday is first day using a trick: map 0 (Sun) to 6, else day-1
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  // Week Grid Generation
  const getWeekDays = (date: Date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
      return Array.from({length: 7}, (_, i) => {
          const wd = new Date(d.setDate(diff + i));
          return wd;
      });
  };
  const weekDays = getWeekDays(currentDate);

  const renderMonthGrid = () => (
    <div className="flex-1 flex flex-col">
        <div className="grid grid-cols-7 mb-3 shrink-0">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                <div key={day} className={`text-center ${EYEBROW} text-faint pb-2`}>
                    {day}
                </div>
            ))}
        </div>
        <div className="flex-1 grid grid-cols-7 auto-rows-fr gap-2">
            {Array.from({ length: totalCells }).map((_, i) => {
                const dayNum = i - startOffset + 1;
                const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth;
                const dateObj = new Date(currentYear, currentMonth, dayNum);
                const isSelected = isCurrentMonth &&
                    dateObj.getFullYear() === selectedDateObj.getFullYear() &&
                    dateObj.getMonth() === selectedDateObj.getMonth() &&
                    dateObj.getDate() === selectedDateObj.getDate();
                const dayEvents = isCurrentMonth ? ALL_EVENTS.filter(e => e.year === currentYear && e.month === currentMonth && e.day === dayNum) : [];

                return (
                    <button
                        key={i}
                        type="button"
                        onClick={() => {
                            if (isCurrentMonth) {
                                setSelectedDateObj(dateObj);
                            }
                        }}
                        className={`relative aspect-square md:aspect-auto md:min-h-[72px] rounded-[1.25rem] p-2.5 flex flex-col items-start justify-between transition-colors duration-300 ${
                            isCurrentMonth
                                ? isSelected
                                    ? 'bg-ink text-white v2-shadow-lift'
                                    : 'bg-cream text-ink v2-press hover:bg-primary-light'
                                : 'bg-transparent pointer-events-none'
                        }`}
                    >
                        <span className={`text-[13px] font-semibold tabular-nums ${isSelected ? 'text-white' : 'text-ink'}`}>
                            {isCurrentMonth ? dayNum : ''}
                        </span>

                        {dayEvents.length > 0 && (
                            <span className="flex items-center gap-1">
                                {dayEvents.map((_, idx) => (
                                    <span key={idx} className="w-1.5 h-1.5 rounded-full bg-lavender" />
                                ))}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    </div>
  );

  const renderWeekGrid = () => (
      <div className="flex-1 flex flex-col">
        <div className="grid grid-cols-7 gap-1.5 mb-5 shrink-0">
            {weekDays.map((d, i) => {
                const active = d.getDate() === selectedDateObj.getDate() && d.getMonth() === selectedDateObj.getMonth();
                return (
                    <button key={i} type="button" className={`flex flex-col items-center gap-1 py-3 rounded-[1.25rem] v2-press transition-colors duration-300 ${
                        active ? 'bg-ink text-white' : 'bg-cream text-ink hover:bg-primary-light'
                    }`} onClick={() => setSelectedDateObj(d)}>
                        <span className={`${EYEBROW} ${active ? 'text-white/60' : 'text-faint'}`}>{DAYS_ES[d.getDay()]}</span>
                        <span className="text-[18px] font-semibold tabular-nums leading-none">
                            {d.getDate()}
                        </span>
                    </button>
                );
            })}
        </div>
        <div className="flex-1 overflow-y-auto pr-1 no-scrollbar">
            <div className="space-y-1">
                {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(hour => {
                    // Collect events that start around this hour for the week
                    const hourPrefix = hour.split(':')[0];
                    return (
                        <div key={hour} className="flex gap-3">
                            <div className="w-12 text-right shrink-0 pt-2">
                                <span className="text-[11px] font-semibold tabular-nums text-faint">{hour}</span>
                            </div>
                            <div className="flex-1 grid grid-cols-7 gap-1.5 min-h-[52px] border-t border-line pt-2 pb-2">
                                {weekDays.map((wd, wdIdx) => {
                                    const eventsInHour = ALL_EVENTS.filter(e =>
                                        e.year === wd.getFullYear() &&
                                        e.month === wd.getMonth() &&
                                        e.day === wd.getDate() &&
                                        e.time.startsWith(hourPrefix)
                                    );
                                    return (
                                        <div key={wdIdx} className="relative">
                                            {eventsInHour.map(ev => (
                                                <button
                                                    key={ev.id}
                                                    type="button"
                                                    onClick={() => { setSelectedEvent(ev); setSelectedDateObj(wd); }}
                                                    className="w-full text-left bg-ink text-white p-2 rounded-[0.9rem] v2-press"
                                                >
                                                    <span className="flex items-center gap-1.5">
                                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ev.color}`} />
                                                        <span className="text-[10px] font-semibold leading-tight truncate">{ev.title}</span>
                                                    </span>
                                                    <span className="block text-[9px] font-medium tabular-nums text-white/60 mt-0.5">{ev.time}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
      </div>
  );

  const renderDayGrid = () => {
      const dayEvents = ALL_EVENTS.filter(e =>
          e.year === selectedDateObj.getFullYear() &&
          e.month === selectedDateObj.getMonth() &&
          e.day === selectedDateObj.getDate()
      );

      return (
        <div className="flex-1 flex flex-col">
            <div className="mb-6 flex justify-between items-center bg-sand p-6 rounded-[1.75rem]">
                <div>
                    <p className={`${EYEBROW} text-muted`}>Línea de tiempo</p>
                    <h3 className="mt-1 text-[22px] font-semibold tracking-tight text-ink">{DAYS_ES[selectedDateObj.getDay()]}, {selectedDateObj.getDate()} {MONTHS_ES[selectedDateObj.getMonth()]}</h3>
                </div>
                <span className="inline-flex items-center h-8 px-3.5 rounded-full bg-cream text-[12px] font-semibold text-ink tabular-nums">{dayEvents.length} servicios</span>
            </div>
            <div className="flex-1 overflow-y-auto pr-1 no-scrollbar">
                <div className="space-y-4">
                    {['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'].map(hour => {
                        const hourPrefix = hour.split(':')[0];
                        const eventsInHour = dayEvents.filter(e => e.time.startsWith(hourPrefix) || e.time.startsWith(String(parseInt(hourPrefix)+1).padStart(2, '0')));
                        return (
                            <div key={hour} className="flex gap-5 group relative">
                                <div className="w-12 text-right shrink-0 pt-1">
                                    <span className="text-[12px] font-semibold tabular-nums text-faint">{hour}</span>
                                </div>
                                <div className="absolute left-[68px] top-5 bottom-0 w-[2px] bg-sand group-last:hidden" />
                                <div className="absolute left-[64px] top-2 w-2.5 h-2.5 rounded-full bg-sand ring-2 ring-linen group-hover:bg-lavender transition-colors" />

                                <div className="flex-1 space-y-3 pb-3 pl-5">
                                    {eventsInHour.length === 0 ? (
                                        <div className="h-10" />
                                    ) : (
                                        eventsInHour.map(ev => (
                                            <button
                                                key={ev.id}
                                                type="button"
                                                onClick={() => setSelectedEvent(ev)}
                                                className="w-full text-left p-5 flex items-center gap-4 bg-cream rounded-[1.5rem] v2-shadow-soft v2-press v2-float"
                                            >
                                                <div className={`w-1.5 h-12 rounded-full ${ev.color}`} />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-[15px] font-semibold text-ink truncate">{ev.title}</h4>
                                                    <p className="text-[12.5px] font-medium text-muted mt-0.5"><span className="font-bold tabular-nums text-ink">{ev.time}</span> · {ev.client}</p>
                                                </div>
                                                <span className="w-9 h-9 shrink-0 rounded-full bg-sand text-ink flex items-center justify-center">
                                                    <ChevronRight size={15} />
                                                </span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
      );
  }

  let headerLabel = `${MONTHS_ES[currentMonth]} ${currentYear}`;
  if (view === 'week') {
      const wStart = weekDays[0];
      const wEnd = weekDays[6];
      headerLabel = `${wStart.getDate()} ${MONTHS_ES[wStart.getMonth()].substring(0,3)} - ${wEnd.getDate()} ${MONTHS_ES[wEnd.getMonth()].substring(0,3)} ${currentYear}`;
  } else if (view === 'day') {
      headerLabel = `${selectedDateObj.getDate()} ${MONTHS_ES[selectedDateObj.getMonth()]} ${currentYear}`;
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-linen">
      <main className="flex-1 overflow-y-auto px-6 md:px-12 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* ── Cabecera editorial ── */}
          <header className="pt-10 md:pt-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className={`v3-blur-in ${EYEBROW} text-primary-deep`}>Tu semana de trabajo</p>
              <h1 className="v3-blur-in text-[34px] md:text-[44px] font-semibold tracking-tight leading-[1.02] text-ink mt-2" style={{ animationDelay: '100ms' }}>
                Agenda
              </h1>
              <p className="v3-blur-in mt-2 text-[14px] font-medium text-muted" style={{ animationDelay: '200ms' }}>
                Gestiona tus servicios y tu disponibilidad
              </p>
            </div>

            <div className="v3-blur-in flex flex-wrap items-center gap-3" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center gap-1 bg-cream p-1 rounded-full v2-shadow-soft">
                {(['day', 'week', 'month'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setView(v)}
                    className={`h-10 px-4 rounded-full text-[12.5px] font-semibold v2-press transition-colors duration-300 ${
                      view === v
                        ? 'bg-ink text-white'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    {v === 'day' ? 'Día' : v === 'week' ? 'Semana' : 'Mes'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 bg-cream p-1 rounded-full v2-shadow-soft">
                <button type="button" onClick={handlePrev} aria-label="Anterior" className="w-10 h-10 rounded-full flex items-center justify-center text-ink hover:bg-sand v2-press">
                  <ChevronLeft size={17} />
                </button>
                <span className="px-3 text-[13px] font-semibold text-ink select-none min-w-[150px] text-center tabular-nums">
                  {headerLabel}
                </span>
                <button type="button" onClick={handleNext} aria-label="Siguiente" className="w-10 h-10 rounded-full flex items-center justify-center text-ink hover:bg-sand v2-press">
                  <ChevronRight size={17} />
                </button>
              </div>

              <button type="button" className="h-12 px-5 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press">
                <Plus size={16} />
                <span className="hidden sm:inline-block">Nuevo bloqueo</span>
              </button>
            </div>
          </header>

          <div className="mt-9 flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="flex-1 flex flex-col min-w-0">
              <section className="v2-rise v2-d1 flex-1 rounded-[2.25rem] p-5 md:p-7 flex flex-col bg-cream v2-shadow-soft min-h-[520px]">
                {view === 'month' && renderMonthGrid()}
                {view === 'week' && renderWeekGrid()}
                {view === 'day' && renderDayGrid()}
              </section>
            </div>

            <aside className="w-full lg:w-[400px] shrink-0 flex flex-col gap-5">
              <section className="v2-rise v2-d2 flex flex-col min-h-0">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className={`${EYEBROW} text-muted`}>Día seleccionado</p>
                    <h2 className="mt-1 text-[22px] font-semibold tracking-tight text-ink leading-none">
                      {DAYS_ES[selectedDateObj.getDay()]}, {selectedDateObj.getDate()} {MONTHS_ES[selectedDateObj.getMonth()].substring(0,3)}
                    </h2>
                  </div>
                  <span className="inline-flex items-center h-8 px-3.5 rounded-full bg-lavender-light text-[12px] font-semibold text-ink tabular-nums">{eventsForSelectedDate.length} servicios</span>
                </div>

                <div className="space-y-3">
                  {eventsForSelectedDate.length === 0 && (
                    <div className="bg-cream rounded-[2.25rem] px-8 py-12 flex flex-col items-center text-center v2-shadow-soft">
                      <span className="w-16 h-16 rounded-[1.4rem] bg-primary-light text-primary-deep flex items-center justify-center mb-5">
                        <CalendarDays size={26} />
                      </span>
                      <h3 className="text-[18px] font-semibold tracking-tight text-ink">Día libre</h3>
                      <p className="mt-1.5 text-[13px] font-medium text-muted max-w-xs">No hay servicios programados para este día. Elige otra fecha o revisa el mes completo.</p>
                      <button type="button" onClick={() => setView('month')} className="mt-6 h-12 px-6 rounded-full bg-ink text-white text-[13px] font-bold v2-press">
                        Ver el mes
                      </button>
                    </div>
                  )}
                  {eventsForSelectedDate.map((event, i) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => setSelectedEvent(event)}
                      className={`v2-rise v2-d${Math.min(i + 2, 8)} group w-full text-left bg-cream p-3 rounded-[1.75rem] v2-shadow-soft v2-press v2-float`}
                    >
                      <div className="flex gap-4">
                        <div className="w-24 h-28 shrink-0 relative overflow-hidden rounded-[1.25rem]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={event.image} className="absolute inset-0 w-full h-full object-cover v3-photo" alt={event.title} />
                        </div>
                        <div className="flex-1 min-w-0 py-1.5 pr-2 flex flex-col justify-between">
                          <div>
                            <p className="text-[14px] font-bold tabular-nums text-ink">{event.time}</p>
                            <h4 className="mt-0.5 text-[15px] font-semibold text-ink leading-tight truncate">{event.title}</h4>
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-3">
                            <span className="flex items-center gap-2 min-w-0">
                              <Avatar size="sm" name={event.client} className="w-6 h-6 shrink-0" />
                              <span className="text-[12px] font-medium text-muted truncate">{event.client}</span>
                            </span>
                            {statusPill(event.status)}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="v2-rise v2-d4 bg-cream rounded-[2rem] p-6 v2-shadow-soft">
                <p className={`${EYEBROW} text-muted`}>Meta diaria</p>
                <p className="mt-3 text-[30px] font-bold tabular-nums tracking-tight text-ink leading-none">$3,450 <span className="text-[16px] font-semibold text-faint">/ $5,000</span></p>
                <div className="mt-4 h-2 bg-sand rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[69%] rounded-full" />
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>

      {/* Event Details & Counter-offer Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-ink/40 backdrop-blur-sm">
          <div className="v2-scale bg-cream rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar v2-shadow-float relative">
            <button
              type="button"
              onClick={() => { setSelectedEvent(null); setIsCounterOffering(false); }}
              aria-label="Cerrar"
              className="absolute top-5 right-5 w-11 h-11 glass text-ink rounded-full flex items-center justify-center z-20 v2-press"
            >
              <X size={18} />
            </button>

            <div className="relative h-56 w-full overflow-hidden rounded-t-[2.5rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent flex items-end p-7">
                <div className="v3-blur-in">
                  <span className={`inline-flex items-center h-7 px-3 rounded-full text-[11px] font-semibold glass ${selectedEvent.status === 'confirmed' ? 'text-mint-deep' : 'text-primary-deep'}`}>
                    {selectedEvent.status === 'confirmed' ? 'Confirmada' : 'Pendiente de tu revisión'}
                  </span>
                  <h2 className="mt-3 text-[28px] font-semibold tracking-tight leading-tight text-white">{selectedEvent.title}</h2>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-4 bg-sand p-4 rounded-[1.5rem]">
                <Avatar name={selectedEvent.client} className="w-12 h-12 ring-4 ring-white" />
                <div>
                  <p className="text-[15px] font-semibold text-ink">{selectedEvent.client}</p>
                  <p className="text-[12px] font-medium text-muted">Cliente I mendly</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-5 bg-sand rounded-[1.5rem]">
                  <p className={`${EYEBROW} text-muted mb-2 flex items-center gap-2`}>
                    <CalendarIcon size={13} className="text-primary-deep" /> Fecha
                  </p>
                  <p className="text-[15px] font-semibold text-ink tabular-nums">{selectedEvent.day} Mar 2026</p>
                </div>
                <div className="p-5 bg-sand rounded-[1.5rem]">
                  <p className={`${EYEBROW} text-muted mb-2 flex items-center gap-2`}>
                    <Clock size={13} className="text-primary-deep" /> Horario
                  </p>
                  <p className="text-[15px] font-semibold text-ink tabular-nums">{selectedEvent.time}</p>
                </div>
                <div className="col-span-2 p-5 bg-sand rounded-[1.5rem]">
                  <p className={`${EYEBROW} text-muted mb-2 flex items-center gap-2`}>
                    <MapPin size={13} className="text-primary-deep" /> Dirección
                  </p>
                  <p className="text-[15px] font-semibold text-ink">{selectedEvent.address}</p>
                </div>
              </div>

              <div className="bg-lavender-light p-6 rounded-[1.5rem]">
                <p className={`${EYEBROW} text-ink/60 mb-2`}>Detalles del servicio</p>
                <p className="text-[14px] font-medium text-ink leading-relaxed">{selectedEvent.details}</p>
              </div>

              {selectedEvent.status === 'pending' && (
                <div className="pt-2">
                  {!isCounterOffering ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button type="button" className="flex-1 h-14 rounded-full bg-primary hover:bg-primary-dark text-ink text-[13px] font-bold flex items-center justify-center gap-2 v2-press transition-colors">
                        <CheckCircle2 size={16} /> Aceptar
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCounterOffering(true)}
                        className="flex-1 h-14 rounded-full bg-ink text-white text-[13px] font-bold flex items-center justify-center gap-2 v2-press"
                      >
                        <RefreshCw size={16} /> Contraofertar
                      </button>
                      <button type="button" className="h-14 px-5 rounded-full bg-sand text-error text-[13px] font-bold flex items-center justify-center gap-2 v2-press">
                        <XCircle size={16} /> Rechazar
                      </button>
                    </div>
                  ) : (
                    <div className="v2-rise space-y-5">
                      <h4 className="text-[17px] font-semibold tracking-tight text-ink">Proponer nueva fecha y hora</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={`block ${EYEBROW} text-muted mb-2 ml-1`}>Fecha</label>
                          <input
                            type="date"
                            value={counterDate}
                            onChange={(e) => setCounterDate(e.target.value)}
                            className={INPUT_CLS}
                          />
                        </div>
                        <div>
                          <label className={`block ${EYEBROW} text-muted mb-2 ml-1`}>Hora de inicio</label>
                          <input
                            type="time"
                            value={counterTime}
                            onChange={(e) => setCounterTime(e.target.value)}
                            className={INPUT_CLS}
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setIsCounterOffering(false)}
                          className="h-14 px-6 rounded-full text-[13px] font-semibold text-muted hover:text-ink v2-press transition-colors"
                        >
                          Cancelar
                        </button>
                        <button type="button" className="flex-1 h-14 rounded-full bg-primary hover:bg-primary-dark text-ink text-[13px] font-bold v2-press transition-colors">
                          Enviar propuesta
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
