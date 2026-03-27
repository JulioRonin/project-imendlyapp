"use client";

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search, 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  MoreVertical,
  Filter
} from 'lucide-react';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Avatar } from '@i-mendly/shared/components/Avatar';

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTHS = ['Marzo', 'Abril', 'Mayo'];

const EVENTS = [
  {
    id: 1,
    title: 'Limpieza Profunda',
    client: 'Beatriz Soler',
    time: '09:00 - 11:00',
    type: 'cleaning',
    status: 'confirmed',
    color: 'bg-emerald-500',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 2,
    title: 'Mantenimiento AA',
    client: 'Roberto Gomez',
    time: '12:30 - 14:00',
    type: 'tech',
    status: 'pending',
    color: 'bg-blue-500',
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7903?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 3,
    title: 'Pintura Interior',
    client: 'Elena Martinez',
    time: '15:00 - 18:00',
    type: 'decor',
    status: 'confirmed',
    color: 'bg-purple-500',
    image: 'https://images.unsplash.com/photo-1562591176-3213038a834b?auto=format&fit=crop&q=80&w=200'
  }
];

export default function AgendaPage() {
  const [view, setView] = useState<'day' | 'week' | 'month'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8F9FB]">
      {/* Header */}
      <header className="h-24 px-10 border-b border-slate-100 bg-white flex items-center justify-between sticky top-0 z-10">
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
                    : 'text-slate-400 hover:text-brand-night'
                }`}
              >
                {v === 'day' ? 'Día' : v === 'week' ? 'Semana' : 'Mes'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl px-2">
                <button className="p-2 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-brand-night">
                    <ChevronLeft size={18} />
                </button>
                <span className="px-4 text-[10px] font-black uppercase tracking-wider text-brand-night">
                    Marzo 2026
                </span>
                <button className="p-2 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-brand-night">
                    <ChevronRight size={18} />
                </button>
            </div>
            <Button variant="primary" className="rounded-[1.25rem] h-12 px-6 flex items-center gap-2 shadow-lg shadow-primary/20">
                <Plus size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Nuevo Bloqueo</span>
            </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-10 overflow-hidden flex gap-8">
        {/* Left Column: Calendar Grid */}
        <div className="flex-1 flex flex-col gap-6">
            <Card className="flex-1 rounded-[2.5rem] p-8 flex flex-col overflow-hidden bg-white shadow-sm border-slate-100/60">
                {/* Calendar Grid Header */}
                <div className="grid grid-cols-7 mb-6">
                    {DAYS.map(day => (
                        <div key={day} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest pb-4">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Grid Body (Simplified for visual demo) */}
                <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-4">
                    {Array.from({ length: 35 }).map((_, i) => {
                        const dayNum = i - 2; // Offset for Mar 2026 start
                        const isCurrentMonth = dayNum > 0 && dayNum <= 31;
                        const isToday = dayNum === 26;
                        
                        return (
                            <div 
                                key={i} 
                                className={`group relative rounded-2xl p-4 transition-all border ${
                                    isCurrentMonth 
                                        ? 'bg-white border-slate-50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1' 
                                        : 'bg-slate-50/30 border-transparent opacity-30 pointer-events-none'
                                } ${isToday ? 'ring-2 ring-primary ring-offset-4 ring-offset-white' : ''}`}
                            >
                                <span className={`text-[11px] font-black ${isToday ? 'text-primary' : 'text-brand-night'}`}>
                                    {isCurrentMonth ? dayNum : ''}
                                </span>
                                
                                {isToday && (
                                    <div className="mt-4 space-y-1.5">
                                        <div className="h-1.5 w-full bg-emerald-500 rounded-full" />
                                        <div className="h-1.5 w-2/3 bg-blue-500 rounded-full" />
                                    </div>
                                )}

                                {dayNum === 24 && (
                                    <div className="mt-4 h-1.5 w-full bg-purple-500 rounded-full opacity-40" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>

        {/* Right Column: Day Detail */}
        <div className="w-[400px] flex flex-col gap-8">
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-brand-night tracking-tight uppercase">Jueves, 26 Mar</h2>
                    <Badge variant="success" className="text-[9px] font-black px-3 py-1 uppercase tracking-widest">4 Servicios</Badge>
                </div>

                <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] pr-2 custom-scrollbar">
                    {EVENTS.map((event) => (
                        <Card key={event.id} className="p-0 overflow-hidden rounded-[2rem] border-slate-100 group">
                            <div className="flex h-36">
                                <div className="w-32 relative overflow-hidden">
                                    <img src={event.image} className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700" alt={event.title} />
                                    <div className={`absolute inset-0 bg-gradient-to-tr ${event.color} opacity-20`} />
                                </div>
                                <div className="flex-1 p-6 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-[14px] font-black text-brand-night leading-tight">{event.title}</span>
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
                        </Card>
                    ))}
                </div>
            </section>

            <Card className="bg-brand-night rounded-[2rem] p-8 text-white relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">Meta Diaria</h4>
                    <p className="text-2xl font-black tracking-tight mb-2">$3,450 / $5,000</p>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[69%] rounded-full shadow-[0_0_20px_rgba(61,184,122,0.4)]" />
                    </div>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}
