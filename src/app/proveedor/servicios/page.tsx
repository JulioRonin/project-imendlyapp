"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Settings, 
  X
} from 'lucide-react';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Input } from '@i-mendly/shared/components/Input';

interface Service {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
}

const INITIAL_SERVICES: Service[] = [
  { id: 1, name: 'Limpieza Profunda', category: 'Interiores', price: '$800 / hr', image: 'https://images.unsplash.com/photo-1581578731522-bc0cc1249767?auto=format&fit=crop&q=80&w=200' },
  { id: 2, name: 'Limpieza Express', category: 'Interiores', price: '$450 / hr', image: 'https://images.unsplash.com/photo-1527515545081-5db817172677?auto=format&fit=crop&q=80&w=200' },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [isAdding, setIsAdding] = useState(false);
  
  // New service form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Interiores');
  const [newPrice, setNewPrice] = useState('');

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) return;

    const newService: Service = {
      id: Date.now(),
      name: newName,
      category: newCategory,
      price: newPrice.includes('$') ? newPrice : `$${newPrice}`,
      image: 'https://images.unsplash.com/photo-1581578731522-bc0cc1249767?auto=format&fit=crop&q=80&w=200' // Placeholder image
    };

    setServices([...services, newService]);
    setIsAdding(false);
    setNewName('');
    setNewPrice('');
  };

  const handleDelete = (id: number) => {
    setServices(services.filter(s => s.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8F9FB]">
      <header className="h-24 px-10 border-b border-slate-100 bg-white flex items-center justify-between sticky top-0 z-10 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-brand-night tracking-tight uppercase">Catálogo de Servicios</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Define qué ofreces y cuánto cobras</p>
        </div>

        <div className="flex items-center gap-4">
            <Button 
                variant="primary" 
                onClick={() => setIsAdding(true)}
                className="rounded-[1.25rem] h-12 px-8 flex items-center gap-2 shadow-lg shadow-primary/20"
            >
                <Plus size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Nuevo Servicio</span>
            </Button>
        </div>
      </header>

      <main className="flex-1 p-10 overflow-y-auto space-y-10 custom-scrollbar relative">
        {/* ADD SERVICE MODAL */}
        {isAdding && (
            <div className="fixed inset-0 bg-brand-night/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-white rounded-[2.5rem] p-8 relative overflow-hidden animate-in zoom-in-95 duration-200">
                    <button 
                        onClick={() => setIsAdding(false)}
                        className="absolute top-6 right-6 w-8 h-8 bg-slate-50 text-slate-400 hover:text-brand-night hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors"
                    >
                        <X size={16} />
                    </button>
                    
                    <div className="mb-8">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20">
                            <Plus size={24} className="text-primary" />
                        </div>
                        <h3 className="text-xl font-black text-brand-night tracking-tight uppercase">Crear Servicio</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ingresa los detalles de tu nuevo catálogo</p>
                    </div>

                    <form onSubmit={handleAddService} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre del Servicio</label>
                            <Input 
                                placeholder="Ej. Instalación de Minisplit" 
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="bg-slate-50 border-slate-100 h-14 rounded-[1.25rem] text-[11px] font-bold uppercase tracking-tight" 
                                required
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoría</label>
                                <select 
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-[1.25rem] px-4 text-[11px] font-bold uppercase tracking-tight outline-none focus:ring-2 focus:ring-primary/20 transition-all text-brand-night"
                                >
                                    <option value="Interiores">Interiores</option>
                                    <option value="Exteriores">Exteriores</option>
                                    <option value="Tecnología">Tecnología</option>
                                    <option value="Mantenimiento">Mantenimiento</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Tarifa (Precio base)</label>
                                <Input 
                                    placeholder="Ej. $500 / hr" 
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                    className="bg-slate-50 border-slate-100 h-14 rounded-[1.25rem] text-[11px] font-bold uppercase tracking-tight" 
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsAdding(false)} 
                                className="flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest"
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                variant="primary" 
                                className="flex-1 h-12 rounded-xl shadow-lg shadow-primary/20 text-[10px] font-black uppercase tracking-widest"
                            >
                                Guardar
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {services.map((s) => (
                <Card key={s.id} className="p-0 rounded-[2.5rem] overflow-hidden bg-white border-slate-50 group hover:border-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/5">
                    <div className="h-48 relative overflow-hidden">
                        <img src={s.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={s.name} />
                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-1">{s.category}</p>
                            <h4 className="text-lg font-black text-white uppercase tracking-tight">{s.name}</h4>
                        </div>
                        <button 
                            onClick={() => handleDelete(s.id)}
                            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-im-error hover:bg-im-error hover:text-white transition-all shadow-lg"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tarifa Sugerida</p>
                                <p className="text-2xl font-black text-brand-night italic">{s.price}</p>
                            </div>
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                                <Settings size={20} className="text-slate-300" />
                            </div>
                        </div>
                        <Button variant="outline" className="w-full h-11 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border-slate-100 font-urbanist">
                            Editar Detalles
                        </Button>
                    </div>
                </Card>
            ))}

            {/* Empty Add Card inline */}
            <button 
                onClick={() => setIsAdding(true)}
                className="rounded-[2.5rem] border-4 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center p-12 text-slate-300 hover:border-primary/20 hover:bg-white hover:text-primary transition-all group min-h-[400px]"
            >
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-primary/5 transition-colors">
                    <Plus size={32} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">Cargar Nuevo Trabajo</span>
                <p className="text-[9px] mt-3 font-bold opacity-60">Impacta con tus mejores fotos</p>
            </button>
        </div>
      </main>
    </div>
  );
}
