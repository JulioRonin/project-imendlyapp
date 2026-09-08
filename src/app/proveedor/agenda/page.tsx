"use client";

import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search, 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  MoreVertical,
  Filter,
  X,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Avatar } from '@i-mendly/shared/components/Avatar';

const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const ALL_EVENTS = [
  {
    id: 1,
    title: 'Limpieza Profunda',
    client: 'Beatriz Soler',
    year: 2026, month: 2, day: 26,
    time: '09:00 - 11:00',
    type: 'cleaning',
    status: 'pending',
    color: 'bg-emerald-500',
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
    color: 'bg-blue-500',
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
    color: 'bg-purple-500',
    image: '/assets/fashion_sewing.png',
    address: 'Plaza Fiesta, Local 12',
    details: 'Ajuste de vestido de noche y dobladillo de pantalón de traje.'
  }
];

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
    <div className="flex-1 flex flex-col pt-4">
        <div className="grid grid-cols-7 mb-4 shrink-0">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                <div key={day} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest pb-2">
                    {day}
                </div>
            ))}
        </div>
        <div className="flex-1 grid grid-cols-7 auto-rows-fr gap-3">
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
                    <div 
                        key={i} 
                        onClick={() => {
                            if (isCurrentMonth) {
                                setSelectedDateObj(dateObj);
                            }
                        }}
                        className={`group relative rounded-2xl p-3 transition-all border cursor-pointer ${
                            isCurrentMonth 
                                ? 'bg-white border-slate-100/50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1' 
                                : 'bg-slate-50/30 border-transparent opacity-30 pointer-events-none'
                        } ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-white scale-105 z-10 shadow-lg shadow-primary/10' : ''}`}
                    >
                        <span className={`text-[11px] font-black ${isSelected ? 'text-primary' : 'text-brand-night'}`}>
                            {isCurrentMonth ? dayNum : ''}
                        </span>
                        
                        {dayEvents.length > 0 && (
                            <div className="mt-3 flex flex-col gap-1 w-full">
                                {dayEvents.map((ev, idx) => (
                                    <div key={idx} className={`h-1.5 w-full ${ev.color} rounded-full`} style={{ width: `${100 - idx*20}%`, opacity: isSelected ? 1 : 0.7 }} />
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
  );

  const renderWeekGrid = () => (
      <div className="flex-1 flex flex-col pt-4">
        <div className="grid grid-cols-7 mb-4 shrink-0 border-b border-slate-100 pb-4">
            {weekDays.map((d, i) => (
                <div key={i} className={`text-center flex flex-col items-center gap-1 cursor-pointer p-2 rounded-xl transition-colors ${
                    d.getDate() === selectedDateObj.getDate() && d.getMonth() === selectedDateObj.getMonth() ? 'bg-primary/5' : 'hover:bg-slate-50'
                }`} onClick={() => setSelectedDateObj(d)}>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{DAYS_ES[d.getDay()]}</span>
                    <span className={`text-lg font-black ${d.getDate() === selectedDateObj.getDate() && d.getMonth() === selectedDateObj.getMonth() ? 'text-primary' : 'text-brand-night'}`}>
                        {d.getDate()}
                    </span>
                </div>
            ))}
        </div>
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-4">
                {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(hour => {
                    // Collect events that start around this hour for the week
                    const hourPrefix = hour.split(':')[0];
                    return (
                        <div key={hour} className="flex gap-4 group">
                            <div className="w-16 text-right shrink-0">
                                <span className="text-[10px] font-bold text-slate-300 group-hover:text-brand-night transition-colors">{hour}</span>
                            </div>
                            <div className="flex-1 grid grid-cols-7 gap-3 pb-8 border-t border-slate-50 border-dashed pt-2 relative">
                                {weekDays.map((wd, wdIdx) => {
                                    const eventsInHour = ALL_EVENTS.filter(e => 
                                        e.year === wd.getFullYear() && 
                                        e.month === wd.getMonth() && 
                                        e.day === wd.getDate() && 
                                        e.time.startsWith(hourPrefix)
                                    );
                                    return (
                                        <div key={wdIdx} className="relative z-10">
                                            {eventsInHour.map(ev => (
                                                <div 
                                                    key={ev.id} 
                                                    onClick={() => { setSelectedEvent(ev); setSelectedDateObj(wd); }}
                                                    className={`${ev.color} p-2 rounded-xl cursor-pointer hover:scale-105 transition-all shadow-md shadow-brand-night/5`}
                                                >
                                                    <p className="text-[9px] font-black text-white leading-tight truncate">{ev.title}</p>
                                                    <p className="text-[8px] font-medium text-white/80 mt-1">{ev.time}</p>
                                                </div>
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
        <div className="flex-1 flex flex-col pt-4">
            <div className="mb-6 flex justify-between items-center bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div>
                    <h3 className="text-2xl font-black text-brand-night">{DAYS_ES[selectedDateObj.getDay()]}, {selectedDateObj.getDate()} {MONTHS_ES[selectedDateObj.getMonth()]}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Línea de tiempo diaria</p>
                </div>
                <Badge variant="default" className="bg-primary/10 text-primary border-none text-[10px] uppercase font-black px-4 py-2">{dayEvents.length} Eventos Hoy</Badge>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-6">
                    {['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'].map(hour => {
                        const hourPrefix = hour.split(':')[0];
                        const eventsInHour = dayEvents.filter(e => e.time.startsWith(hourPrefix) || e.time.startsWith(String(parseInt(hourPrefix)+1).padStart(2, '0')));
                        return (
                            <div key={hour} className="flex gap-6 group relative">
                                <div className="w-16 text-right shrink-0">
                                    <span className="text-[12px] font-black text-slate-300 group-hover:text-primary transition-colors">{hour}</span>
                                </div>
                                <div className="absolute left-[88px] top-4 bottom-0 w-[2px] bg-slate-50 group-last:hidden" />
                                <div className="absolute left-[84px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white group-hover:bg-primary transition-colors" />
                                
                                <div className="flex-1 space-y-4 pb-4">
                                    {eventsInHour.length === 0 ? (
                                        <div className="h-10" />
                                    ) : (
                                        eventsInHour.map(ev => (
                                            <div 
                                                key={ev.id} 
                                                onClick={() => setSelectedEvent(ev)}
                                                className="p-5 flex items-center gap-5 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-100/50 rounded-2xl bg-white ring-1 ring-slate-100"
                                            >
                                                <div className={`w-1.5 h-12 rounded-full ${ev.color}`} />
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-black text-brand-night">{ev.title}</h4>
                                                    <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">{ev.time} • {ev.client}</p>
                                                </div>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full text-slate-300 hover:text-primary bg-slate-50">
                                                    <ChevronRight size={14} />
                                                </Button>
                                            </div>
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
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8F9FB]">
      <header className="h-24 px-10 border-b border-slate-100 bg-white flex items-center justify-between sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-2xl font-black text-brand-night tracking-tight uppercase">Agenda</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Gestión de servicios y disponibilidad</p>
          </div>
          
          <div className="h-10 w-[1px] bg-slate-100 hidden md:block" />
          
          <div className="hidden md:flex items-center gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100">
            {(['day', 'week', 'month'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  view === v 
                    ? 'bg-white text-brand-night shadow-sm ring-1 ring-slate-100' 
                    : 'text-slate-400 hover:text-brand-night hover:bg-slate-200/50'
                }`}
              >
                {v === 'day' ? 'Día' : v === 'week' ? 'Semana' : 'Mes'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl px-2">
                <button onClick={handlePrev} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400 hover:text-brand-night">
                    <ChevronLeft size={18} />
                </button>
                <span className="px-5 text-[10px] font-black uppercase tracking-[0.1em] text-brand-night select-none min-w-[140px] text-center">
                    {headerLabel}
                </span>
                <button onClick={handleNext} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400 hover:text-brand-night">
                    <ChevronRight size={18} />
                </button>
            </div>
            <Button variant="primary" className="rounded-[1.25rem] h-12 px-6 flex items-center gap-2 shadow-lg shadow-primary/20">
                <Plus size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline-block">Nuevo Bloqueo</span>
            </Button>
        </div>
      </header>

      <div className="flex-1 p-8 md:p-10 overflow-hidden flex flex-col lg:flex-row gap-8">
        <div className="flex-1 flex flex-col min-w-0">
            <Card className="flex-1 rounded-[2.5rem] p-6 lg:p-8 flex flex-col overflow-hidden bg-white shadow-sm border-slate-100/60 transition-all">
                {view === 'month' && renderMonthGrid()}
                {view === 'week' && renderWeekGrid()}
                {view === 'day' && renderDayGrid()}
            </Card>
        </div>

        <div className="w-full lg:w-[420px] shrink-0 flex flex-col gap-8">
            <section className="space-y-6 flex-1 flex flex-col min-h-0 bg-slate-50/50 p-6 lg:p-8 rounded-[2.5rem] border border-slate-100/60">
                <div className="flex items-center justify-between shrink-0 mb-2">
                    <h2 className="text-2xl font-black text-brand-night tracking-tight uppercase">
                      {DAYS_ES[selectedDateObj.getDay()]}, {selectedDateObj.getDate()} {MONTHS_ES[selectedDateObj.getMonth()].substring(0,3)}
                    </h2>
                    <Badge variant="success" className="text-[9px] font-black px-3 py-1.5 uppercase tracking-[0.1em] shadow-sm">{eventsForSelectedDate.length} Servicios</Badge>
                </div>

                <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar pb-10">
                    {eventsForSelectedDate.length === 0 && (
                      <div className="p-8 text-center text-slate-400 font-bold text-sm bg-white rounded-3xl border border-dashed border-slate-200">
                        No hay servicios programados para este día.
                      </div>
                    )}
                    {eventsForSelectedDate.map((event) => (
                        <div 
                          key={event.id} 
                          onClick={() => setSelectedEvent(event)}
                          className="bg-white p-0 overflow-hidden rounded-[2rem] border border-slate-100 group cursor-pointer hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all"
                        >
                            <div className="flex h-36">
                                <div className="w-32 relative overflow-hidden">
                                    <img src={event.image} className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700" alt={event.title} />
                                    <div className={`absolute inset-0 bg-gradient-to-tr ${event.color} opacity-20`} />
                                </div>
                                <div className="flex-1 p-6 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-[14px] font-black text-brand-night leading-tight group-hover:text-primary transition-colors">{event.title}</span>
                                            <button className="text-slate-300 hover:text-brand-night transition-colors">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                                            <Clock size={12} /> {event.time}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-2">
                                            <Avatar size="sm" name={event.client} className="w-6 h-6 border-slate-100" />
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{event.client}</span>
                                        </div>
                                        <Badge 
                                            variant={event.status === 'confirmed' ? 'success' : 'default'} 
                                            className="text-[9px] font-black px-2 py-0.5 rounded-lg"
                                        >
                                            {event.status === 'confirmed' ? 'Ok' : 'Wait'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Card className="bg-white rounded-[2rem] p-8 text-brand-night relative overflow-hidden group border-none shadow-sm shrink-0">
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10 flex flex-col">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-4">Meta Diaria</h4>
                    <p className="text-2xl font-black tracking-tight mb-3 text-brand-night">$3,450 <span className="text-slate-300">/ $5,000</span></p>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[69%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                    </div>
                </div>
            </Card>
        </div>
      </div>

      {/* Event Details & Counter-offer Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-brand-night/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-500">
            <button 
              onClick={() => { setSelectedEvent(null); setIsCounterOffering(false); }}
              className="absolute top-6 right-6 w-10 h-10 bg-slate-50 text-slate-400 hover:text-brand-night rounded-full flex items-center justify-center transition-colors z-20"
            >
              <X size={20} />
            </button>
            
            <div className="relative h-48 w-full overflow-hidden rounded-t-[3rem]">
              <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-night/90 to-brand-night/20 flex items-end p-8">
                <div>
                  <Badge variant={selectedEvent.status === 'confirmed' ? 'success' : 'default'} className="mb-3 text-[10px] uppercase tracking-widest font-black">
                    {selectedEvent.status === 'confirmed' ? 'Confirmado' : 'Pendiente de tu revisión'}
                  </Badge>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter shadow-sm">{selectedEvent.title}</h2>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <Avatar name={selectedEvent.client} className="w-12 h-12 shadow-sm" />
                <div>
                  <p className="text-sm font-black text-brand-night uppercase">{selectedEvent.client}</p>
                  <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Cliente Mendly</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-white border border-slate-100 shadow-sm rounded-3xl">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                    <CalendarIcon size={14} className="text-primary" /> Fecha
                  </p>
                  <p className="text-sm font-black text-brand-night">{selectedEvent.day} Mar 2026</p>
                </div>
                <div className="p-5 bg-white border border-slate-100 shadow-sm rounded-3xl">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                    <Clock size={14} className="text-primary" /> Horario
                  </p>
                  <p className="text-sm font-black text-brand-night">{selectedEvent.time}</p>
                </div>
                <div className="col-span-2 p-5 bg-white border border-slate-100 shadow-sm rounded-3xl">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                    <MapPin size={14} className="text-primary" /> Dirección
                  </p>
                  <p className="text-sm font-black text-brand-night">{selectedEvent.address}</p>
                </div>
              </div>

              <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-2">Detalles del Servicio</p>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">{selectedEvent.details}</p>
              </div>

              {selectedEvent.status === 'pending' && (
                <div className="pt-6 border-t border-slate-100">
                  {!isCounterOffering ? (
                    <div className="flex gap-4">
                      <Button className="flex-1 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20">
                        <CheckCircle2 size={16} className="mr-2" /> Aceptar
                      </Button>
                      <Button variant="outline" className="flex-1 h-12 rounded-2xl border-brand-coral text-brand-coral hover:bg-brand-coral/5 text-[10px] font-black uppercase tracking-widest">
                        <XCircle size={16} className="mr-2" /> Rechazar
                      </Button>
                      <Button 
                        onClick={() => setIsCounterOffering(true)}
                        className="flex-1 h-12 rounded-2xl bg-brand-night hover:bg-brand-night/90 text-white text-[10px] font-black uppercase tracking-widest shadow-xl"
                      >
                        <RefreshCw size={16} className="mr-2" /> Contraofertar
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                      <h4 className="text-sm font-black uppercase tracking-widest text-brand-night">Proponer Nueva Fecha/Hora</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-2">Fecha</label>
                          <input 
                            type="date" 
                            value={counterDate}
                            onChange={(e) => setCounterDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl h-12 px-4 text-sm font-bold text-brand-night outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-2">Hora (Inicio)</label>
                          <input 
                            type="time" 
                            value={counterTime}
                            onChange={(e) => setCounterTime(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl h-12 px-4 text-sm font-bold text-brand-night outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button 
                          onClick={() => setIsCounterOffering(false)}
                          variant="ghost" 
                          className="flex-1 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                        >
                          Cancelar
                        </Button>
                        <Button className="flex-1 h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                          Enviar Propuesta
                        </Button>
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
