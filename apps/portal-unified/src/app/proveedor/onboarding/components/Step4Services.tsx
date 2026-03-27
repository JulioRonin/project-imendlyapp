import { useState } from 'react';
import { Button } from '@i-mendly/shared/components/Button';
import { Input } from '@i-mendly/shared/components/Input';
import { Badge } from '@i-mendly/shared/components/Badge';

export const Step4Services: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedSub, setSelectedSub] = useState<string[]>([]);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [useGeofence, setUseGeofence] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>(['L', 'M', 'X', 'J', 'V']);

  // SVG Icons mapped for each category
  const categories = [
    { 
      id: 'elec', 
      name: 'Electricidad', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-90">
          <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
        </svg>
      )
    },
    { 
      id: 'plom', 
      name: 'Plomería', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-90">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.492-3.053c.24-.294.416-.636.516-1.002L15 9.75V4.5M11.42 15.17l-3.28-3.28m0 0L4.5 8.25m3.64 3.64c-.366.1-.708.276-1.002.516L4.5 15v5.25l1.373-1.373.948.948 1.157-1.157.948.948 1.157-1.157" />
        </svg>
      )
    },
    { 
      id: 'pint', 
      name: 'Pintura', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-90">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25l4.1-4.1M22.5 3.75h-2.25c-1.243 0-2.25 1.007-2.25 2.25v1.5c0 1.243 1.007 2.25 2.25 2.25h2.25c1.243 0 2.25-1.007 2.25-2.25v-1.5c0-1.243-1.007-2.25-2.25-2.25ZM9.75 14.25l6.401-6.402m-6.401 6.402a3.75 3.75 0 0 1-5.304 0M16.151 7.848a3.75 3.75 0 0 1 5.304 0Z" />
        </svg>
      )
    },
    { 
      id: 'clim', 
      name: 'Climas/AC', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-90">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20m0 0l3-3m-3 3l-3-3M22 12H2m0 0l3-3m-3 3l3 3m10.121-7.121L4.879 19.121m0 0l3.082.918m-3.082-.918l-.918-3.082m15.242 0L4.879 4.879m0 0l3.082-.918M4.879 4.879l-.918 3.082" />
        </svg>
      )
    },
    { 
      id: 'limp', 
      name: 'Limpieza', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-90">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      )
    },
    { 
      id: 'alba', 
      name: 'Albañilería', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-90">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.015-.39.03-.586.045M12 2.25v9m-7.87 2.45c-.196-.015-.391-.03-.586-.045M4.13 14.15a2.18 2.18 0 0 1-.75-1.661V8.706c0-1.081.768-2.015 1.837-2.175A48.114 48.114 0 0 1 8.63 6.14m12.37-3.89h-10.5" />
        </svg>
      )
    },
    { 
      id: 'carp', 
      name: 'Carpintería', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-90">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
      )
    },
    { 
      id: 'fumi', 
      name: 'Fumigación', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-90">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
        </svg>
      )
    }
  ];

  // Dynamic Sub-services mapping
  const subServicesMap: Record<string, string[]> = {
    elec: ['Cortocircuitos', 'Instalación de ventiladores', 'Cableado general', 'Contactos/Apagadores', 'Revisión de tableros'],
    plom: ['Fugas de agua', 'Bóilers/Calentadores', 'Destape de tuberías', 'Instalación de tinacos', 'Reparación de sanitarios'],
    pint: ['Interiores', 'Exteriores', 'Impermeabilización', 'Resanes', 'Pintura en herrería'],
    clim: ['Mantenimiento Preventivo (Minisplit)', 'Instalación de Minisplit', 'Carga de gas Refrigerante', 'Detección de Fugas AC', 'Limpieza de ductos'],
    limp: ['Limpieza Profunda', 'Limpieza Post-construcción', 'Lavado de salas/alfombras', 'Pulido de pisos'],
    alba: ['Remodelaciones', 'Enyesado/Estuco', 'Pisos/Azulejos', 'Muros de block', 'Firmes y banquetas'],
    carp: ['Reparación de muebles', 'Instalación de puertas', 'Fabricación de clósets', 'Cocinas integrales', 'Restauración'],
    fumi: ['Cucarachas/Hormigas', 'Chinches de cama', 'Arañas y alacranes', 'Fumigación preventiva', 'Desinfección de virus'],
  };

  const cdJuarezZones = [
    'Centro', 'Gómez Morín', 'Valle del Sol', 'Sendero', 'Las Torres', 
    'Pronaf', 'Satélite', 'Anapra', 'Tierra Nueva', 'El Barreal', 'Zaragoza'
  ];

  const handleCatToggle = (id: string) => {
    setSelectedCats(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSubToggle = (sub: string) => {
    setSelectedSub(prev => prev.includes(sub) ? prev.filter(x => x !== sub) : [...prev, sub]);
  };

  const handleZoneToggle = (zone: string) => {
    setSelectedZones(prev => prev.includes(zone) ? prev.filter(x => x !== zone) : [...prev, zone]);
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(x => x !== day) : [...prev, day]);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-3xl font-black mb-2 tracking-tight">Servicios y especialidad</h2>
      <p className="text-white/50 mb-8 font-medium">Selecciona las categorías donde eres experto.</p>

      {/* Main Categories */}
      <div className="grid grid-cols-2 gap-3 mb-10">
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => handleCatToggle(cat.id)}
            className={`
              flex flex-col items-center justify-center p-6 rounded-3xl border transition-all duration-300
              ${selectedCats.includes(cat.id) 
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] scale-[1.02]' 
                : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:bg-white/10'}
            `}
          >
            <div className={`mb-3 ${selectedCats.includes(cat.id) ? 'text-emerald-400' : 'text-white/40'}`}>
              {cat.icon}
            </div>
            <span className={`text-xs font-black uppercase tracking-widest ${selectedCats.includes(cat.id) ? 'text-emerald-400' : 'text-white/60'}`}>
              {cat.name}
            </span>
          </button>
        ))}
      </div>

      {/* Dynamic Subservices based on Categories */}
      {selectedCats.length > 0 && (
        <div className="mb-10 animate-in fade-in duration-500">
          <p className="text-sm font-black text-white/40 uppercase tracking-widest mb-4">¿Qué servicios ofreces específicamente?</p>
          <div className="space-y-6">
            {selectedCats.map(catId => {
              const catData = categories.find(c => c.id === catId);
              const subs = subServicesMap[catId] || [];
              return (
                <div key={catId} className="bg-white/5 border border-white/5 p-5 rounded-[2rem]">
                  <p className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">{catData?.name}</p>
                  <div className="flex flex-col gap-2">
                    {subs.map(sub => (
                      <label key={sub} className="flex items-center gap-3 cursor-pointer group py-1">
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={selectedSub.includes(sub)} 
                          onChange={() => handleSubToggle(sub)} 
                        />
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${selectedSub.includes(sub) ? 'bg-emerald-500 border-emerald-500 text-brand-night' : 'border-white/20 bg-brand-night group-hover:border-emerald-500/50'}`}>
                          {selectedSub.includes(sub) && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>}
                        </div>
                        <span className={`text-sm font-medium pt-0.5 select-none ${selectedSub.includes(sub) ? 'text-white' : 'text-white/60'}`}>{sub}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Geofence & Zones */}
      <div className="space-y-6 mb-10 pt-4 border-t border-white/5">
        <div>
          <p className="text-sm font-black text-white/40 uppercase tracking-widest mb-4">Zonas de cobertura en Cd. Juárez</p>
          
          <button 
            onClick={() => setUseGeofence(!useGeofence)}
            className={`w-full flex items-center gap-3 p-4 rounded-[2rem] border transition-all mb-4 ${useGeofence ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <div className="text-left flex-1">
              <p className="text-sm font-bold">📍 Compartir Ubicación y Operar en Radio Libre (10km)</p>
              <p className="text-[10px] uppercase font-black tracking-widest opacity-60">Recomendado para maximizar solicitudes</p>
            </div>
            {useGeofence && (
              <span className="bg-emerald-500 text-brand-night rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>
              </span>
            )}
          </button>

          {!useGeofence && (
            <div className="flex flex-wrap gap-2 animate-in fade-in duration-300">
              {cdJuarezZones.map(z => (
                <button 
                  key={z} 
                  onClick={() => handleZoneToggle(z)}
                  className={`px-5 py-2.5 rounded-full border text-xs font-bold transition-all
                    ${selectedZones.includes(z) 
                      ? 'border-emerald-500 bg-emerald-500 text-brand-night' 
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30'}
                  `}
                >
                  {z}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Work Schedule */}
      <div className="space-y-6 mb-10 pt-4 border-t border-white/5">
        <div>
          <p className="text-sm font-black text-white/40 uppercase tracking-widest mb-4">Días y Horarios Laborales</p>
          
          <div className="flex items-center gap-2 mb-6">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (
              <button 
                key={day} 
                onClick={() => handleDayToggle(day)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all
                  ${selectedDays.includes(day) 
                    ? 'bg-emerald-500 text-brand-night shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-105' 
                    : 'bg-white/10 text-white/50 hover:bg-white/20'}
                `}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-black uppercase text-white/40 mb-2 tracking-widest">Hora Inicial</label>
              <select className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white appearance-none outline-none focus:border-emerald-500 transition-all cursor-pointer font-bold">
                <option value="06:00" className="text-black">06:00 AM</option>
                <option value="07:00" className="text-black">07:00 AM</option>
                <option value="08:00" className="text-black" defaultValue="08:00">08:00 AM</option>
                <option value="09:00" className="text-black">09:00 AM</option>
                <option value="10:00" className="text-black">10:00 AM</option>
                <option value="11:00" className="text-black">11:00 AM</option>
                <option value="12:00" className="text-black">12:00 PM</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-black uppercase text-white/40 mb-2 tracking-widest">Hora Final</label>
              <select className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white appearance-none outline-none focus:border-emerald-500 transition-all cursor-pointer font-bold">
                <option value="15:00" className="text-black">03:00 PM</option>
                <option value="16:00" className="text-black">04:00 PM</option>
                <option value="17:00" className="text-black">05:00 PM</option>
                <option value="18:00" className="text-black" defaultValue="18:00">06:00 PM</option>
                <option value="19:00" className="text-black">07:00 PM</option>
                <option value="20:00" className="text-black">08:00 PM</option>
                <option value="21:00" className="text-black">09:00 PM</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="ghost" onClick={onBack} className="flex-1 text-white/40 hover:text-white border-white/10">Atrás</Button>
        <Button variant="primary" onClick={onNext} className="flex-[2] bg-emerald-600 hover:bg-emerald-500 border-none">Definir Perfil</Button>
      </div>
    </div>
  );
};
