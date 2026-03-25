import { Button } from '@i-mendly/shared/components/Button';
import { Badge } from '@i-mendly/shared/components/Badge';

export const Step6Review: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-700">
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl mb-8 relative">
        <span>📦</span>
        <div className="absolute -bottom-1 -right-1 bg-brand-coral p-2 rounded-full border-4 border-brand-night animate-pulse" />
      </div>

      <Badge variant="navy" className="mb-4 px-4 py-1.5 shadow-lg">ESTADO: EN REVISIÓN</Badge>
      
      <h2 className="text-4xl font-black mb-4 tracking-tighter">¡Casi listo, Profesional!</h2>
      <p className="text-white/60 text-lg mb-10 max-w-sm font-medium">
        Estamos revisando tus documentos. Recibirás una notificación en menos de 24 horas.
      </p>

      <div className="w-full space-y-3 mb-12">
        <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Próximo paso</p>
          <p className="text-sm font-bold text-white/80">Confirmación de Entrevista</p>
          <p className="text-xs text-white/40 mt-1">Te enviaremos el enlace de Zoom por correo y WhatsApp.</p>
        </div>
      </div>

      <Button variant="secondary" className="w-full" onClick={() => window.location.href = '/'}>
        Volver al inicio
      </Button>
      
      <p className="mt-8 text-xs font-bold text-white/30 uppercase tracking-widest">
        Dudas: soporte@imendly.mx
      </p>
    </div>
  );
};
