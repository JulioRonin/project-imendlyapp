// BORRADOR DE TRABAJO — pendiente de revisión por abogado antes del lanzamiento.
// Punto a revisar con el abogado: reforma a la Ley Federal del Trabajo sobre
// personas trabajadoras de plataformas digitales (dic. 2024) y su aplicación
// a servicios del hogar presenciales.
// Al cambiar el contenido, sube LEGAL_VERSION en src/lib/legal.ts.

import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalDoc, Section, Callout } from '@/components/legal/LegalDoc';
import { PLAN, TIER_LABEL, formatMxn, pct, type ProviderTier } from '@/lib/pricing';
import { COMPANY, LEGAL_LINKS } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Términos y condiciones para profesionales · I mendly',
  description: 'Reglas para ofrecer servicios del hogar a través de I mendly.',
};

export default function TerminosProfesionalesPage() {
  return (
    <LegalDoc
      current={LEGAL_LINKS.profesionales}
      eyebrow="Para profesionales"
      title="Términos y condiciones para profesionales"
      intro={
        <>
          <p>
            Estos términos regulan la relación entre {COMPANY.legalName} (“I mendly”) y las personas que ofrecen sus servicios
            del hogar a través de la plataforma (“Profesional” o “tú”), desde la solicitud de registro hasta la baja.
          </p>
          <p>
            Los aceptas marcando la casilla al crear tu cuenta de profesional, junto con el{' '}
            <Link href={LEGAL_LINKS.privacidad}>Aviso de privacidad</Link> y el consentimiento expreso para tus datos sensibles.
          </p>
        </>
      }
    >
      <Section n={1} title="Naturaleza de la relación">
        <p>
          La relación es <strong>mercantil</strong>. Eres un profesional independiente: decides qué trabajos aceptar, tus
          horarios, tus zonas y tus precios dentro de cada oferta, y aportas tus herramientas. I mendly te da acceso a la
          plataforma, a clientes y a la protección de pagos a cambio de una comisión por trabajo realizado.
        </p>
        <p>
          Eres responsable de cumplir tus obligaciones fiscales y de seguridad social como persona independiente. I mendly
          retendrá y enterará los impuestos que la ley le obligue a retener como plataforma digital y te entregará los
          comprobantes correspondientes.
        </p>
      </Section>

      <Section n={2} title="Requisitos y verificación">
        <ul>
          <li>Ser mayor de 18 años y contar con identificación oficial vigente.</li>
          <li>
            Entregar: CURP, INE por ambos lados, selfie con tu INE, foto de perfil, constancia de antecedentes no penales con
            vigencia máxima de 3 meses, comprobante de domicilio, al menos 3 fotos de trabajos propios y dos referencias de
            clientes que hayan aceptado ser contactadas.
          </li>
          <li>Aprobar el examen de certificación con al menos 80% y la entrevista con nuestro equipo.</li>
          <li>Completar un periodo de prueba de 3 trabajos supervisados.</li>
        </ul>
        <p>
          <strong>Declaras bajo protesta de decir verdad</strong> que la información y los documentos que entregas son
          auténticos. Un dato falso es motivo de rechazo o baja inmediata, sin perjuicio de las acciones legales que
          procedan. I mendly puede aprobar o rechazar solicitudes según sus criterios de calidad y seguridad.
        </p>
      </Section>

      <Section n={3} title="Niveles y comisiones">
        <p>Tu comisión baja conforme mejora tu calidad comprobada:</p>
        <ul>
          {(Object.keys(TIER_LABEL) as ProviderTier[]).map(t => (
            <li key={t}><strong>{TIER_LABEL[t]}:</strong> {pct(PLAN.commission[t])} del precio del trabajo, más IVA.</li>
          ))}
        </ul>
        <p>
          La comisión tiene un <strong>tope de {formatMxn(PLAN.commissionCap)} por orden</strong>, más IVA. Al cliente se le cobra
          aparte una tarifa de servicio que no sale de tu precio. Antes de enviar cada oferta verás cuánto
          recibirás después de comisión. Los criterios para subir o bajar de nivel se publican en tu portal. Cualquier cambio en
          comisiones te lo avisaremos con al menos 15 días naturales de anticipación y no aplicará a trabajos ya aceptados.
        </p>
      </Section>

      <Section n={4} title="Cobro de tus trabajos">
        <ul>
          <li>El cliente paga dentro de la app. Cuando el trabajo lo requiere, se cobra un anticipo al aceptar tu oferta.</li>
          <li>
            Para recibir pagos debes registrar una cuenta de cobro con <strong>Stripe</strong>, nuestro procesador de pagos. Stripe
            valida tu identidad y tu CLABE; I mendly no ve ni guarda tus datos bancarios.
          </li>
          <li>
            Si pediste anticipo, al <strong>iniciar el trabajo</strong> te adelantamos esa parte del precio para materiales.
          </li>
          <li>
            El resto, menos la comisión de tu nivel con su IVA, se te envía <strong>{PLAN.holdHours} horas después de que el
            cliente confirme la entrega</strong>. Si el cliente ya pagó todo y no responde, la entrega se confirma sola{' '}
            {PLAN.autoConfirmHours} horas después de que la marques como terminada.
          </li>
          <li>Stripe deposita en tu banco según el calendario de depósitos de tu cuenta.</li>
          <li>Si hay un reclamo abierto, el monto en disputa se retiene hasta que se resuelva la mediación.</li>
        </ul>
      </Section>

      <Section n={5} title="Prohibición de desviar clientes">
        <p>
          Los clientes que conoces por I mendly deben contratarte y pagarte dentro de la plataforma durante 12 meses desde el
          primer contacto. Ofrecer o aceptar pagos por fuera, compartir tus datos de contacto para evitar la comisión o pedir al
          cliente que cancele para contratarte directamente se sanciona según la sección 6, y puede llevar a la baja definitiva.
        </p>
      </Section>

      <Section n={6} title="Calidad, faltas y sanciones">
        <p>Se registran como faltas, entre otras:</p>
        <ul>
          <li>no presentarte a un trabajo confirmado o llegar con un retraso injustificado mayor a 30 minutos;</li>
          <li>trabajos con defectos comprobados en mediación;</li>
          <li>trato irrespetuoso, cobros no acordados o desvío de clientes.</li>
        </ul>
        <p>
          Las faltas pueden bajar tu nivel, suspender tu cuenta temporalmente o darte de baja, según su gravedad y
          reincidencia. Siempre se te notifica la falta con su evidencia y tienes 5 días hábiles para apelar.
        </p>
      </Section>

      <Section n={7} title="Garantía y responsabilidad por tu trabajo">
        <p>
          Eres responsable de la calidad y la seguridad de tus trabajos. Te obligas a cooperar con los reclamos de la{' '}
          <Link href={LEGAL_LINKS.garantia}>Garantía I mendly</Link>: responder en 48 horas con tu versión y evidencia y, en
          su caso, corregir el trabajo.
        </p>
        <p>
          Si la mediación determina un defecto atribuible a ti, el costo de corregirlo o el reembolso pagado al cliente{' '}
          <strong>puede descontarse de tus pagos futuros</strong> o cobrarse directamente, con derecho de apelación.
        </p>
      </Section>

      <Section n={8} title="Uso de tus datos y tu perfil">
        <p>
          Tu nombre, foto de perfil, especialidad, zonas, portafolio y calificaciones forman tu perfil público dentro de la
          app. Tus documentos de identidad, CURP, antecedentes y comprobante de domicilio son privados: solo los ve el equipo de
          verificación. El detalle está en el <Link href={`${LEGAL_LINKS.privacidad}#datos-sensibles`}>Aviso de privacidad</Link>.
        </p>
        <p>
          Los datos del cliente que recibes al aceptar un trabajo solo puedes usarlos para ese trabajo. No puedes guardarlos
          para otros fines, compartirlos ni usarlos para contactarlo con fines comerciales fuera de la app.
        </p>
      </Section>

      <Section n={9} title="Baja de la plataforma">
        <p>
          Puedes darte de baja en cualquier momento escribiendo a{' '}
          <a href={`mailto:${COMPANY.supportEmail}`}>{COMPANY.supportEmail}</a>, después de terminar o cancelar los trabajos
          que tengas aceptados. Recibirás los pagos pendientes que te correspondan, menos los montos retenidos por reclamos
          abiertos.
        </p>
      </Section>

      <Section n={10} title="Cambios, ley aplicable y jurisdicción">
        <p>
          Te avisaremos de cambios a estos términos con al menos 15 días naturales de anticipación. Si no estás de acuerdo,
          puedes darte de baja antes de que entren en vigor. Estos términos se rigen por las leyes federales de los Estados
          Unidos Mexicanos y, en lo aplicable, por las del Estado de Chihuahua; las partes se someten a los tribunales de{' '}
          {COMPANY.city}.
        </p>
      </Section>

      <Callout>
        ¿Dudas sobre tu certificación o tus pagos? Escríbenos a{' '}
        <a className="underline" href={`mailto:${COMPANY.supportEmail}`}>{COMPANY.supportEmail}</a>.
      </Callout>
    </LegalDoc>
  );
}
