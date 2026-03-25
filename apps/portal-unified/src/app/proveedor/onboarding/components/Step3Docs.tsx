import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';

export const Step3Docs: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-3xl font-black mb-2 tracking-tight">Documentos y antecedentes</h2>
      <p className="text-white/50 mb-8 font-medium">Sube los documentos requeridos para certificar tu perfil.</p>

      <div className="space-y-4 mb-10">
        {[
          { icon: "📄", name: "Antecedentes no penales", status: "Pendiente" },
          { icon: "🏠", name: "Comprobante de domicilio", status: "Subido", checked: true },
          { icon: "🖼️", name: "Portafolio de trabajos (mín 3 fotos)", status: "Pendiente" },
          { icon: "🎓", name: "Certificaciones técnicas (Opcional)", status: "Pendiente" }
        ].map((doc, i) => (
          <Card key={i} variant="glass" className="flex items-center justify-between p-4 border-white/5 hover:bg-white/10 cursor-pointer">
            <div className="flex items-center gap-4">
              <span className="text-xl">{doc.icon}</span>
              <div>
                <p className="text-sm font-bold text-white/80">{doc.name}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{doc.status}</p>
              </div>
            </div>
            {doc.checked ? <Badge variant="success">✓</Badge> : <span className="text-white/20">＋</span>}
          </Card>
        ))}
      </div>

      <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl mb-10">
        <p className="text-xs text-secondary-light font-medium leading-relaxed">
          📱 Puedes tomar fotos directo desde la app. Recomendamos buena iluminación para evitar rechazos.
        </p>
      </div>

      <div className="flex gap-4">
        <Button variant="ghost" onClick={onBack} className="flex-1 text-white/40 hover:text-white">Atrás</Button>
        <Button variant="primary" onClick={onNext} className="flex-[2]">Siguiente Paso</Button>
      </div>
    </div>
  );
};
