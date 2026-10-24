// BORRADOR DE TRABAJO — basado en docs/legal/garantia-imendly.md, pendiente de
// revisión por abogado. El tope ($10,000 MXN) debe ajustarse al fondo real.
// Al cambiar el contenido, sube LEGAL_VERSION en src/lib/legal.ts.

import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalDoc, Section, Callout } from '@/components/legal/LegalDoc';
import { LEGAL_LINKS } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Garantía I mendly · I mendly',
  description: 'Qué cubre la Garantía I mendly, hasta cuánto y cómo reclamarla.',
};

const GUARANTEE_CAP = '$10,000 MXN';

export default function GarantiaPage() {
  return (
    <LegalDoc
      current={LEGAL_LINKS.garantia}
      eyebrow="Garantía I mendly"
      title="Si algo sale mal, respondemos"
      intro={
        <p>
          Lo corregimos o te reembolsamos hasta el tope, siempre que hayas contratado y pagado dentro de la app. Aquí está
          exactamente qué cubre, hasta cuánto y cómo pedirla.
        </p>
      }
    >
      <Section n={1} title="Qué es">
        <p>
          La Garantía I mendly es una <strong>cobertura comercial limitada y voluntaria</strong> que ofrecemos a los clientes que
          contratan y pagan servicios íntegramente dentro de la plataforma.
        </p>
        <p>
          No es un seguro, una fianza ni una garantía ilimitada. No convierte a I mendly en garante general de los trabajos,
          en empleador de los profesionales ni en parte del contrato de servicio entre tú y el profesional.
        </p>
      </Section>

      <Section n={2} title="Cuándo aplica">
        <p>Deben cumplirse todas estas condiciones:</p>
        <ol>
          <li>Contrataste el servicio en la app, aceptando una oferta.</li>
          <li><strong>Pagaste el 100% dentro de la app, incluido el anticipo.</strong> Cualquier pago por fuera anula la cobertura.</li>
          <li>El profesional estaba verificado o certificado al momento del servicio.</li>
          <li>Reportaste el problema en la app dentro de los <strong>15 días naturales</strong> siguientes a la entrega.</li>
          <li>Permites revisar el trabajo con fotos, visita o videollamada, y participas en la mediación.</li>
        </ol>
      </Section>

      <Section n={3} title="Qué cubre y hasta cuánto">
        <p>Ante un defecto atribuible al profesional, I mendly resuelve con una de estas dos vías, según el dictamen de mediación:</p>
        <ul>
          <li><strong>Corrección:</strong> el mismo u otro profesional certificado corrige o rehace el trabajo, sin costo para ti.</li>
          <li>
            <strong>Reembolso:</strong> te devolvemos hasta lo que pagaste en la app, con un <strong>tope de {GUARANTEE_CAP} por
            proyecto</strong>.
          </li>
        </ul>
        <p>El tope aplica por proyecto, no por reclamo.</p>
      </Section>

      <Section n={4} title="Qué no cubre">
        <ul>
          <li>Trabajos o pagos hechos fuera de la plataforma, total o parcialmente.</li>
          <li>Materiales que aportaste tú o que se compraron fuera de la cotización aceptada.</li>
          <li>Daños indirectos: pérdida de ingresos, daños a terceros o daño moral.</li>
          <li>Desgaste normal, mal uso o modificaciones hechas por terceros después de la entrega.</li>
          <li>Diferencias entre una estimación inicial y la cotización final que aceptaste tras la visita.</li>
          <li>Trabajos sin entrega registrada en la app.</li>
          <li>Caso fortuito o fuerza mayor.</li>
        </ul>
      </Section>

      <Section n={5} title="Cómo reclamar">
        <ol>
          <li>Reporta desde la orden en la app, con fotos y una descripción, dentro de los 15 días naturales.</li>
          <li>El profesional tiene 48 horas para responder con su versión y evidencia.</li>
          <li>Nuestro equipo media y dictamina en un máximo de 72 horas hábiles después de recibir ambas versiones.</li>
          <li>La resolución se ejecuta y queda registrada. El dictamen agota la cobertura para ese reclamo.</li>
        </ol>
        <p>
          Esta garantía se suma a los derechos que te da la Ley Federal de Protección al Consumidor; no los sustituye ni los
          limita.
        </p>
      </Section>

      <Callout>
        Dentro de la app estás protegido. Fuera de ella, el trato es solo entre tú y el profesional. Consulta también los{' '}
        <Link className="underline" href={LEGAL_LINKS.terminos}>Términos para clientes</Link>.
      </Callout>
    </LegalDoc>
  );
}
