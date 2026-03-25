import { Button } from '@i-mendly/shared/components/Button';
import { Input } from '@i-mendly/shared/components/Input';
import { Avatar } from '@i-mendly/shared/components/Avatar';

export const Step1Personal: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-3xl font-black mb-2 tracking-tight">Datos personales</h2>
      <p className="text-white/50 mb-8 font-medium">Cuéntanos quién eres para empezar a conectar.</p>

      <div className="flex flex-col items-center mb-8">
        <label className="relative cursor-pointer group">
          <Avatar size="xl" className="border-4 border-white/10 group-hover:border-primary/50 transition-colors" />
          <div className="absolute bottom-1 right-1 bg-primary p-2 rounded-xl text-white shadow-lg">
            📷
          </div>
        </label>
        <p className="text-xs font-bold text-white/40 mt-3 uppercase tracking-widest">Foto de perfil profesional</p>
      </div>

      <div className="space-y-4 mb-10">
        <Input label="Nombre Completo" placeholder="Ej. Juan Pérez" />
        <Input label="Fecha de Nacimiento" type="date" />
        <div className="flex gap-3 items-end">
          <Input label="Teléfono Celular" placeholder="55 1234 5678" className="flex-1" />
          <Button variant="secondary" className="mb-[1px]">Enviar OTP</Button>
        </div>
        <Input label="Correo Electrónico" type="email" placeholder="nombre@ejemplo.com" />
        <Input label="Contraseña" type="password" placeholder="********" />
      </div>

      <div className="flex gap-4">
        <Button variant="ghost" onClick={onBack} className="flex-1 text-white/40 hover:text-white">Atrás</Button>
        <Button variant="primary" onClick={onNext} className="flex-[2]">Continuar al Paso 2</Button>
      </div>
    </div>
  );
};
