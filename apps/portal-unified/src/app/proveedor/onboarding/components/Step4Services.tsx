import { useState } from 'react';
import { Button } from '@i-mendly/shared/components/Button';
import { Input } from '@i-mendly/shared/components/Input';
import { Badge } from '@i-mendly/shared/components/Badge';

export const Step4Services: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const [selected, setSelected] = useState<string[]>([]);
  
  const categories = [
    { id: 'elec', name: 'Electricidad', icon: '⚡' },
    { id: 'plom', name: 'Plomería', icon: '🔧' },
    { id: 'pint', name: 'Pintura', icon: '🎨' },
    { id: 'clim', name: 'Climas/AC', icon: '❄️' },
    { id: 'limp', name: 'Limpieza', icon: '🧹' },
    { id: 'alba', name: 'Albañilería', icon: '🏗️' },
    { id: 'carp', name: 'Carpintería', icon: '🪵' },
    { id: 'fumi', name: 'Fumigación', icon: '💉' }
  ];

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-3xl font-black mb-2 tracking-tight">Servicios y especialidad</h2>
      <p className="text-white/50 mb-8 font-medium">Selecciona las categorías donde eres experto.</p>

      <div className="grid grid-cols-2 gap-3 mb-10">
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => toggle(cat.id)}
            className={`
              flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all duration-200
              ${selected.includes(cat.id) 
                ? 'border-primary bg-primary/10 text-white' 
                : 'border-white/5 bg-white/5 text-white/50 hover:border-white/20'}
            `}
          >
            <span className="text-3xl mb-2">{cat.icon}</span>
            <span className="text-xs font-black uppercase tracking-widest">{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="space-y-6 mb-10">
        <div>
          <p className="text-sm font-black text-white/40 uppercase tracking-widest mb-4">Zonas de cobertura</p>
          <div className="flex flex-wrap gap-2">
            {['Norte', 'Centro', 'Sur', 'Oriente', 'Poniente', 'V. de Juárez'].map(z => (
              <button key={z} className="px-5 py-2 rounded-xl bg-white/5 border border-white/5 text-sm font-bold hover:bg-white/10 transition-colors">
                {z}
              </button>
            ))}
          </div>
        </div>

        <Input label="Años de experiencia" type="number" placeholder="Ej. 10" />
        <Input label="Tarifa base por hora (Referencia MXN)" type="number" placeholder="Ej. 350" />
      </div>

      <div className="flex gap-4">
        <Button variant="ghost" onClick={onBack} className="flex-1 text-white/40 hover:text-white">Atrás</Button>
        <Button variant="primary" onClick={onNext} className="flex-[2]">Definir Perfil</Button>
      </div>
    </div>
  );
};
