// BORRADOR DE TRABAJO — pendiente de revisión por abogado antes del lanzamiento.
// Al cambiar el contenido, sube LEGAL_VERSION en src/lib/legal.ts.

import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalDoc, Section, Callout } from '@/components/legal/LegalDoc';
import { PLAN, formatMxn, pct } from '@/lib/pricing';
import { COMPANY, LEGAL_LINKS } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Términos y condiciones para clientes · I mendly',
  description: 'Reglas de uso de I mendly para quienes contratan servicios para su hogar.',
};

export default function TerminosClientesPage() {
  return (
    <LegalDoc
      current={LEGAL_LINKS.terminos}
      eyebrow="Para clientes"
      title="Términos y condiciones de uso"
      intro={
        <>
          <p>
            Estos términos regulan el uso de la aplicación y el sitio de <strong>{COMPANY.brand}</strong>, operados por{' '}
            {COMPANY.legalName} (en adelante, “I mendly”), por parte de las personas que buscan y contratan servicios para su
            hogar (“Cliente” o “tú”).
          </p>
          <p>
            Al crear tu cuenta marcas una casilla en la que aceptas estos términos y el{' '}
            <Link href={LEGAL_LINKS.privacidad}>Aviso de privacidad</Link>. Guardamos la fecha y la versión que aceptaste.
            Si no estás de acuerdo, no crees una cuenta.
          </p>
        </>
      }
    >
      <Section n={1} title="Qué es I mendly">
        <p>
          I mendly es una <strong>plataforma tecnológica de intermediación</strong>: conecta a clientes con profesionales
          independientes del hogar que previamente verificamos. I mendly no ejecuta los trabajos ni es empleador de los
          profesionales. El contrato de servicio se celebra entre tú y el profesional que elijas; I mendly facilita la
          contratación, protege el pago dentro de la app y ofrece la Garantía I mendly con los alcances publicados.
        </p>
      </Section>

      <Section n={2} title="Tu cuenta">
        <ul>
          <li>Puedes explorar categorías, profesionales y precios de referencia sin registrarte.</li>
          <li>
            <strong>Para solicitar un servicio, publicar un proyecto, aceptar una oferta o pagar necesitas una cuenta.</strong>{' '}
            Así podemos identificar a ambas partes, proteger el pago y atender cualquier reclamo.
          </li>
          <li>Debes ser mayor de 18 años y proporcionar datos verdaderos: nombre, correo y celular.</li>
          <li>Tu cuenta es personal. Cuida tu contraseña: lo que se haga desde tu cuenta se considera hecho por ti.</li>
        </ul>
      </Section>

      <Section n={3} title="Cómo se contrata un servicio">
        <ol>
          <li>Describes lo que necesitas o eliges a un profesional. Las estimaciones que muestra la app son de referencia.</li>
          <li>Los profesionales envían su oferta. La <strong>cotización que aceptas en la app es la que rige</strong>.</li>
          <li>
            Al aceptar, compartimos con el profesional los datos necesarios para hacer el trabajo: tu nombre, la dirección del
            servicio y un medio de contacto. Solo el profesional que aceptaste los recibe.
          </li>
          <li>
            Si la oferta es un rango de precio o una visita de valoración, el profesional te envía el precio final después de
            visitar. <strong>No pagas nada hasta aprobarlo.</strong> Si supera el máximo del rango, debe explicarte por qué. Puedes
            aprobarlo, pedir otro precio o cancelar sin costo.
          </li>
        </ol>
      </Section>

      <Section n={4} title="Pagos">
        <ul>
          <li>
            Todos los pagos, incluido el anticipo, se hacen <strong>dentro de la app</strong> con tarjeta, en efectivo en OXXO o
            por transferencia SPEI, mediante nuestro procesador de pagos, Stripe. I mendly no almacena los datos de tu tarjeta.
          </li>
          <li>
            <strong>Reservas directas:</strong> pagas el total al reservar. <strong>Proyectos del tablero:</strong> si el
            profesional lo pidió en su oferta, pagas un anticipo de hasta {PLAN.maxDepositPercent}% al aceptarla y el saldo al
            confirmar la entrega.
          </li>
          <li>
            Al precio del profesional se suma una <strong>tarifa de servicio de {pct(PLAN.clientFee)}</strong> (mínimo{' '}
            {formatMxn(PLAN.clientFeeMin)}, máximo {formatMxn(PLAN.clientFeeMax)} por orden), que cubre el pago protegido y la
            Garantía I mendly. Siempre ves el desglose antes de pagar.
          </li>
          <li>
            I mendly retiene tu pago y se lo entrega al profesional {PLAN.holdHours} horas después de que confirmes que el trabajo
            quedó bien. Si el profesional pidió anticipo para materiales, esa parte se le adelanta cuando inicia el trabajo. Si ya
            pagaste todo y no respondes, la entrega se confirma sola {PLAN.autoConfirmHours} horas después de que el profesional
            la marque como terminada.
          </li>
          <li>Los precios se muestran en pesos mexicanos e incluyen los impuestos que correspondan, salvo que se indique otra cosa.</li>
          <li>
            <strong>Si pagas por fuera de la app, en efectivo o por transferencia directa, pierdes la protección del pago y la
            Garantía I mendly</strong>, y el trato queda únicamente entre tú y el profesional.
          </li>
        </ul>
      </Section>

      <Section n={5} title="Cancelaciones y reembolsos">
        <ul>
          <li>Puedes cancelar sin costo antes de que el profesional confirme la visita o inicie el trabajo.</li>
          <li>
            Si cancelas después de que el profesional se trasladó o compró material para tu servicio, el anticipo puede
            aplicarse a esos gastos comprobados. Te mostramos el monto antes de confirmar la cancelación.
          </li>
          <li>Si el profesional cancela o no se presenta, te devolvemos íntegro lo pagado.</li>
          <li>Los reembolsos se hacen al mismo medio de pago, en los plazos de tu banco.</li>
        </ul>
      </Section>

      <Section n={6} title="Garantía I mendly">
        <p>
          I mendly no es garante general de los trabajos realizados por los profesionales. Sin perjuicio de lo anterior,
          ofrecemos la <Link href={LEGAL_LINKS.garantia}>Garantía I mendly</Link>, una cobertura comercial limitada, con topes,
          plazos y exclusiones, aplicable únicamente a servicios pagados íntegramente dentro de la plataforma.
        </p>
      </Section>

      <Section n={7} title="Reglas de conducta">
        <ul>
          <li>Trata con respeto a los profesionales y al equipo de I mendly. No toleramos acoso ni discriminación.</li>
          <li>Da acceso seguro al lugar del trabajo y avisa de riesgos conocidos: instalaciones dañadas, mascotas, etc.</li>
          <li>Publica reseñas honestas, basadas en tu experiencia real.</li>
          <li>No uses la app para fines ilegales ni para contactar a profesionales con el fin de contratarlos por fuera.</li>
        </ul>
        <p>Podemos suspender o cerrar cuentas que incumplan estas reglas, avisándote el motivo.</p>
      </Section>

      <Section n={8} title="Reclamos y aclaraciones">
        <p>
          Si algo sale mal, repórtalo desde la orden en la app dentro de los {PLAN.claimDays} días naturales siguientes a la entrega.
          Al reportarlo, el pago pendiente al profesional se congela mientras se resuelve. El
          profesional tiene 48 horas para responder y nuestro equipo media y resuelve en un máximo de 72 horas hábiles después
          de recibir ambas versiones.
        </p>
        <p>
          También puedes escribirnos a <a href={`mailto:${COMPANY.supportEmail}`}>{COMPANY.supportEmail}</a>. Estos términos
          no limitan los derechos que te otorga la Ley Federal de Protección al Consumidor; puedes acudir a la Procuraduría
          Federal del Consumidor (PROFECO).
        </p>
      </Section>

      <Section n={9} title="Responsabilidad">
        <p>
          I mendly responde por el funcionamiento de la plataforma, la protección de los pagos hechos en ella y la Garantía
          I mendly en los términos publicados. Cada profesional responde por la calidad y la seguridad del trabajo que
          realiza. Nada de lo anterior limita la responsabilidad que la ley no permita limitar.
        </p>
      </Section>

      <Section n={10} title="Cambios a estos términos">
        <p>
          Si cambiamos estos términos te avisaremos en la app o por correo antes de que entren en vigor. Si el cambio es
          relevante, te pediremos aceptarlo de nuevo antes de tu siguiente contratación.
        </p>
      </Section>

      <Section n={11} title="Ley aplicable y jurisdicción">
        <p>
          Estos términos se rigen por las leyes federales de los Estados Unidos Mexicanos y, en lo aplicable, por las del
          Estado de Chihuahua. Para cualquier controversia, las partes se someten a los tribunales competentes de{' '}
          {COMPANY.city}, sin perjuicio de la competencia de la PROFECO.
        </p>
      </Section>

      <Callout>
        ¿Dudas? Escríbenos a <a className="underline" href={`mailto:${COMPANY.supportEmail}`}>{COMPANY.supportEmail}</a>.
        Respondemos en días hábiles.
      </Callout>
    </LegalDoc>
  );
}
