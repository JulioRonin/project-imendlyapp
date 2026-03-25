import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';

export const Step5Interview: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-3xl font-black mb-2 tracking-tight">Entrevista de calidad</h2>
      <p className="text-white/50 mb-8 font-medium">Agenda una breve videollamada de 15 min con nuestro equipo de CX.</p>

      <div className="space-y-4 mb-10">
        <p className="text-sm font-black text-white/40 uppercase tracking-widest mb-4">Próximos horarios disponibles</p>
        
        {['Mañana, 10:00 AM', 'Mañana, 11:30 AM', 'Lunes 30, 09:00 AM', 'Lunes 30, 04:00 PM'].map((time, i) => (
          <Card key={i} variant="glass" className="p-4 border-white/5 hover:border-primary/50 cursor-pointer flex items-center justify-between">
            <span className="text-sm font-bold text-white/80">{time}</span>
            <span className="text-primary font-black uppercase text-[10px] tracking-widest">Seleccionar</span>
          </Card>
        ))}
      </div>

      <div className="bg-white/5 rounded-3xl p-6 mb-10">
        <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-3">¿Qué revisaremos?</h4>
        <ul className="text-sm text-white/60 space-y-3 font-medium">
          <li className="flex gap-3"><span>✓</span> Protocolo de servicio al cliente I mendly</li>
          <li className="flex gap-3"><span>✓</span> Confirmación de herramientas y equipo</li>
          <li className="flex gap-3"><span>✓</span> Dudas sobre pagos y el modelo escrow</li>
        </ul>
      </div>

      <div className="flex gap-4">
        <Button variant="ghost" onClick={onBack} className="flex-1 text-white/40 hover:text-white">Atrás</Button>
        <Button variant="primary" onClick={onNext} className="flex-[2]">Agendar y Finalizar</Button>
      </div>
    </div>
  );
};
