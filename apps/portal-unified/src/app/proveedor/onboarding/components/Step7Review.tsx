import { Button } from '@i-mendly/shared/components/Button';
import { Badge } from '@i-mendly/shared/components/Badge';

export const Step7Review: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-700">
      <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-8 relative border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
        </svg>
        <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-2.5 rounded-full border-4 border-brand-night animate-pulse" />
      </div>

      <Badge variant="default" className="mb-4 px-4 py-1.5 shadow-lg bg-brand-night text-white border-brand-night/50">ESTADO: EN REVISIÓN</Badge>
      
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
