import { Button } from '@i-mendly/shared/components/Button';

export const Step0Welcome: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  return (
    <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight tracking-tighter">
        Trabaja con confianza.<br />
        <span className="text-primary tracking-tight">Gana con certeza.</span>
      </h1>
      <p className="text-white/60 text-lg mb-10 max-w-sm font-medium">
        Únete a la red de servicios más segura de México. Pagos garantizados y clientes verificados.
      </p>

      <div className="w-full space-y-4 mb-12">
        {[
          "1. Datos personales y perfil",
          "2. Verificación de identidad",
          "3. Documentos y antecedentes",
          "4. Servicios, zonas y tarifas",
          "5. Entrevista de calidad",
          "6. Certificación digital"
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
              {i + 1}
            </div>
            <span className="text-sm font-bold text-white/80">{step}</span>
          </div>
        ))}
      </div>

      <Button variant="primary" size="lg" className="w-full shadow-2xl shadow-primary/40" onClick={onNext}>
        Comenzar mi registro
      </Button>
      
      <p className="mt-8 text-sm font-bold text-white/40">
        ¿Ya tienes cuenta? <button className="text-primary hover:underline">Iniciar sesión</button>
      </p>
    </div>
  );
};
