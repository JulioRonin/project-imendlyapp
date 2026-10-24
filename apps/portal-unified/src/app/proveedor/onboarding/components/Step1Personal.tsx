import { Avatar } from '@i-mendly/shared/components/Avatar';
import { Camera, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useOnboarding } from './OnboardingContext';

const LABEL_CLS = 'block text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-2 ml-1';
const INPUT_CLS = 'w-full h-14 px-5 bg-sand rounded-[1.25rem] border-0 text-[15px] font-semibold text-ink placeholder:text-faint placeholder:font-medium outline-none focus:ring-2 focus:ring-primary/30 transition-shadow';

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

  const canNext = !!(data.full_name && data.email);

  return (
    <div className="flex-1 flex flex-col">
      <section className="v2-scale bg-cream rounded-[2.25rem] v2-shadow-soft p-6 space-y-6">
        <p className="text-[14px] font-medium text-muted">Cuéntanos quién eres para empezar a conectar.</p>

        <div className="flex flex-col items-center">
          <label className="relative cursor-pointer group v2-press">
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            <Avatar src={photoUrl || data.documents?.profile_photo} size="xl" className="ring-4 ring-sand" />
            <span className="absolute -bottom-1 -right-1 w-10 h-10 bg-ink text-white rounded-full flex items-center justify-center ring-4 ring-cream">
              <Camera size={15} />
            </span>
          </label>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mt-4">Foto de perfil profesional</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className={LABEL_CLS}>Nombre completo</label>
            <input
              placeholder="Ej. Juan Pérez"
              value={data.full_name || ''}
              onChange={e => updateData({ full_name: e.target.value })}
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Nombre de la empresa (opcional)</label>
            <input
              placeholder="Ej. Soluciones del Hogar S.A."
              value={data.company_name || ''}
              onChange={e => updateData({ company_name: e.target.value })}
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Fecha de nacimiento</label>
            <input
              type="date"
              value={data.birth_date || ''}
              onChange={e => updateData({ birth_date: e.target.value })}
              className={`${INPUT_CLS} tabular-nums`}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Teléfono celular</label>
            <input
              placeholder="55 1234 5678"
              value={data.phone || ''}
              onChange={e => updateData({ phone: e.target.value })}
              className={`${INPUT_CLS} tabular-nums`}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Correo electrónico</label>
            <input
              type="email"
              placeholder="nombre@ejemplo.com"
              value={data.email || ''}
              onChange={e => updateData({ email: e.target.value })}
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Contraseña</label>
            <input
              type="password"
              placeholder="********"
              value={data.password || ''}
              onChange={e => updateData({ password: e.target.value })}
              className={INPUT_CLS}
            />
          </div>
        </div>
      </section>

      {/* Botonera sticky */}
      <div className="sticky bottom-0 mt-auto -mx-6 px-6 pt-4 pb-6 bg-gradient-to-t from-linen via-linen/95 to-transparent">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} className="h-14 px-6 rounded-full text-[13px] font-semibold text-muted hover:text-ink v2-press transition-colors">Atrás</button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canNext}
            className={`flex-1 h-14 rounded-full text-[13px] font-bold flex items-center justify-center gap-2 transition-colors ${
              canNext ? 'bg-primary text-ink hover:bg-primary-dark v2-press shadow-lg shadow-primary/25' : 'bg-sand text-faint cursor-not-allowed'
            }`}
          >
            {!canNext ? 'Completa los campos' : <>Continuar <ArrowRight size={16} /></>}
          </button>
        </div>
      </div>
    </div>
  );
};
