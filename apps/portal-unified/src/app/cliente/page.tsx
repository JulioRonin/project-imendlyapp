import { Logo } from '@i-mendly/shared/Logo';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Input } from '@i-mendly/shared/components/Input';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Avatar } from '@i-mendly/shared/components/Avatar';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Logo size={40} />
          <span className="text-2xl font-black text-brand-night tracking-tighter">I mendly</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-brand-night/60">
          <a href="#" className="hover:text-primary transition-colors">Servicios</a>
          <a href="#" className="hover:text-primary transition-colors">Zonas</a>
          <a href="#" className="hover:text-primary transition-colors">Cómo funciona</a>
          <a href="#" className="hover:text-primary transition-colors">Preguntas</a>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost">Entrar</Button>
          <Button variant="primary" className="shadow-lg shadow-primary/30">Registro</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-8 pt-16 pb-32 max-w-7xl mx-auto text-center">
        <Badge variant="primary" className="mb-6 px-5 py-2 text-sm shadow-sm">
          ✨ Nueva versión 1.0 disponible en México
        </Badge>
        <h1 className="text-5xl md:text-7xl font-black text-brand-night leading-[1.1] mb-8 tracking-tighter max-w-4xl mx-auto">
          Servicios del hogar <span className="text-primary italic">con confianza</span> y certeza.
        </h1>
        <p className="text-lg md:text-xl text-brand-night/60 mb-12 max-w-2xl mx-auto font-medium">
          Conectamos a los mejores profesionales certificados con quienes buscan calidad, rapidez y seguridad en cada rincón de su hogar.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <Input 
            placeholder="¿Qué servicio necesitas?" 
            className="w-full md:w-80 shadow-2xl shadow-slate-200"
            icon="🔍"
          />
          <Button variant="coral" size="lg" className="w-full md:w-auto h-full">
            Buscar Profesional
          </Button>
        </div>
      </section>

      {/* Featured Service Card Demo */}
      <section className="px-8 pb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:scale-[1.02] cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <Badge variant="teal">✓ Verificado</Badge>
              <span className="text-xl font-black text-brand-night">$450<span className="text-xs font-bold opacity-40">/h</span></span>
            </div>
            <Avatar name="Juan Pérez" size="lg" className="mb-4" />
            <h3 className="text-xl font-black text-brand-night mb-1 tracking-tight">Juan Pérez</h3>
            <p className="text-sm font-bold text-brand-night/40 mb-4 uppercase tracking-widest">Electricista Certificado</p>
            <p className="text-sm text-brand-night/60 leading-relaxed mb-6">
              Experto en instalaciones residenciales y reparación de climas con más de 10 años de trayectoria.
            </p>
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <span>★ 4.9 (124 reseñas)</span>
            </div>
          </Card>

          <Card variant="navy" className="hover:rotate-1">
            <Badge variant="coral" className="mb-6">OFERTA</Badge>
            <h3 className="text-2xl font-black mb-4">Mantenimiento de AC</h3>
            <p className="text-white/70 mb-8 leading-relaxed">
              Prepárate para el verano con nuestra revisión completa de sistemas de aire acondicionado.
            </p>
            <Button variant="coral" className="w-full">Reservar Ahora</Button>
          </Card>

          <Card variant="glass" className="flex flex-col justify-between border-primary/20 bg-primary/5">
            <div>
              <h3 className="text-xl font-black text-brand-night mb-4">Garantía Escrow</h3>
              <p className="text-brand-night/60 text-sm leading-relaxed mb-6">
                Tu pago está protegido. El profesional recibe el dinero solo cuando confirmes que el trabajo quedó perfecto.
              </p>
            </div>
            <Logo className="opacity-20 self-end -mb-4 -mr-4 rotate-12" size={120} />
          </Card>
        </div>
      </section>

      {/* Footer Demo */}
      <footer className="bg-brand-night text-white/40 py-20 px-8 text-center border-t border-white/5">
        <Logo size={40} className="mx-auto mb-6 saturate-0 opacity-50" />
        <p className="text-sm font-bold uppercase tracking-[0.2em] mb-4">I mendly · 2026</p>
        <p className="text-xs max-w-sm mx-auto opacity-50">
          Plataforma confidencial para desarrollo de servicios domésticos bajo demanda. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  );
}
