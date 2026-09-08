import { Button } from '@i-mendly/shared/components/Button';
import { Input } from '@i-mendly/shared/components/Input';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { useState } from 'react';
import { useOnboarding } from './OnboardingContext';

export const Step1Personal: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const { data, updateData } = useOnboarding();
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPhotoUrl(url);
      // In a real app, we would upload here or in handleSave
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-3xl font-black mb-2 tracking-tight">Datos personales</h2>
      <p className="text-white/50 mb-8 font-medium">Cuéntanos quién eres para empezar a conectar.</p>

      <div className="flex flex-col items-center mb-8">
        <label className="relative cursor-pointer group">
          <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          <Avatar src={photoUrl || data.documents?.profile_photo} size="xl" className="border-4 border-white/10 group-hover:border-primary/50 transition-colors" />
          <div className="absolute bottom-1 right-1 bg-primary p-2 rounded-xl text-white shadow-lg">
            📷
          </div>
        </label>
        <p className="text-xs font-bold text-white/40 mt-3 uppercase tracking-widest">Foto de perfil profesional</p>
      </div>

      <div className="space-y-4 mb-10">
        <Input 
          dark 
          label="Nombre Completo" 
          placeholder="Ej. Juan Pérez" 
          value={data.full_name || ''} 
          onChange={e => updateData({ full_name: e.target.value })} 
        />
        <Input 
          dark 
          label="Nombre de la empresa (Opcional)" 
          placeholder="Ej. Soluciones del Hogar S.A." 
          value={data.company_name || ''} 
          onChange={e => updateData({ company_name: e.target.value })} 
        />
        <Input 
          dark 
          label="Fecha de Nacimiento" 
          type="date" 
          value={data.birth_date || ''} 
          onChange={e => updateData({ birth_date: e.target.value })} 
        />
        <Input 
          dark 
          label="Teléfono Celular" 
          placeholder="55 1234 5678" 
          value={data.phone || ''} 
          onChange={e => updateData({ phone: e.target.value })} 
        />
        <Input 
          dark 
          label="Correo Electrónico" 
          type="email" 
          placeholder="nombre@ejemplo.com" 
          value={data.email || ''} 
          onChange={e => updateData({ email: e.target.value })} 
        />
        <Input 
          dark 
          label="Contraseña" 
          type="password" 
          placeholder="********" 
          value={data.password || ''} 
          onChange={e => updateData({ password: e.target.value })} 
        />
      </div>

      <div className="flex gap-4">
        <Button variant="ghost" onClick={onBack} className="flex-1 text-white/40 hover:text-white">Atrás</Button>
        <Button 
          variant="primary" 
          onClick={onNext} 
          className="flex-[2]" 
          disabled={!data.full_name || !data.email}
        >
          {(!data.full_name || !data.email) ? 'Completa los campos' : 'Continuar al Paso 2'}
        </Button>
      </div>
    </div>
  );
};
