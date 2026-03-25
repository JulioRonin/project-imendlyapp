import { Button } from '@i-mendly/shared/components/Button';
import { Input } from '@i-mendly/shared/components/Input';
import { Card } from '@i-mendly/shared/components/Card';

export const Step2Identity: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-3xl font-black mb-2 tracking-tight">Verificación de identidad</h2>
      <p className="text-white/50 mb-8 font-medium">Por tu seguridad y la de nuestros clientes, necesitamos validar tu identidad.</p>

      <div className="space-y-6 mb-10">
        <Input label="CURP (18 caracteres)" placeholder="AAAA000000XXXXXX00" maxLength={18} />
        <Input label="RFC (Opcional)" placeholder="AAAA000000XXX" maxLength={13} />
        
        <div className="grid grid-cols-2 gap-4">
          <Card variant="glass" className="h-40 flex flex-col items-center justify-center border-dashed border-white/20 hover:border-primary/50 cursor-pointer">
            <span className="text-2xl mb-2">🪪</span>
            <span className="text-xs font-bold uppercase tracking-widest opacity-60">INE Frente</span>
          </Card>
          <Card variant="glass" className="h-40 flex flex-col items-center justify-center border-dashed border-white/20 hover:border-primary/50 cursor-pointer">
            <span className="text-2xl mb-2">🔙</span>
            <span className="text-xs font-bold uppercase tracking-widest opacity-60">INE Reverso</span>
          </Card>
        </div>
        
        <Card variant="glass" className="h-40 flex flex-col items-center justify-center border-dashed border-white/20 hover:border-primary/50 cursor-pointer">
          <span className="text-2xl mb-2">🤳</span>
          <span className="text-xs font-bold uppercase tracking-widest opacity-60">Selfie con INE</span>
        </Card>
      </div>

      <p className="mb-8 text-xs font-bold text-white/30 flex items-center gap-2">
        <span>🔒 Cifrado de extremo a extremo. Tu información está protegida.</span>
      </p>

      <div className="flex gap-4">
        <Button variant="ghost" onClick={onBack} className="flex-1 text-white/40 hover:text-white">Atrás</Button>
        <Button variant="primary" onClick={onNext} className="flex-[2]">Validar y Continuar</Button>
      </div>
    </div>
  );
};
