// BORRADOR DE TRABAJO — pendiente de revisión por abogado antes del lanzamiento.
// Al cambiar el contenido, sube LEGAL_VERSION en src/lib/legal.ts.

import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalDoc, Section, Callout } from '@/components/legal/LegalDoc';
import { COMPANY, LEGAL_LINKS } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Aviso de privacidad · I mendly',
  description: 'Cómo I mendly trata los datos personales de clientes y profesionales.',
};

export default function PrivacidadPage() {
  return (
    <LegalDoc
      current={LEGAL_LINKS.privacidad}
      eyebrow="Aviso de privacidad integral"
      title="Tus datos, cuidados y con un propósito claro"
      intro={
        <>
          <p>
            Este aviso explica qué datos personales recabamos, para qué los usamos, con quién los compartimos y cómo puedes
            ejercer tus derechos, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares,
            su Reglamento y los Lineamientos del Aviso de Privacidad.
          </p>
          <p>Aplica a clientes, a profesionales y a quienes se postulan para ser profesionales.</p>
        </>
      }
    >
      <Section n={1} title="Responsable">
        <p>
          <strong>{COMPANY.legalName}</strong> (“I mendly”), con domicilio en {COMPANY.address}, es responsable del
          tratamiento de tus datos personales. Contacto del departamento de datos personales:{' '}
          <a href={`mailto:${COMPANY.privacyEmail}`}>{COMPANY.privacyEmail}</a>.
        </p>
      </Section>

      <Section n={2} title="Datos que recabamos de clientes">
        <ul>
          <li><strong>Identificación y contacto:</strong> nombre, correo electrónico y número de celular.</li>
          <li><strong>Servicio:</strong> dirección donde se hará el trabajo, descripción y fotos del proyecto que publiques.</li>
          <li>
            <strong>Pago:</strong> los datos de tu tarjeta los recibe directamente el procesador de pagos. I mendly solo conserva
            una referencia de la operación y los últimos dígitos.
          </li>
          <li><strong>Uso de la app:</strong> historial de órdenes, mensajes, reseñas y reclamos.</li>
        </ul>
        <p>De los clientes no recabamos datos personales sensibles.</p>
      </Section>

      <Section n={3} title="Datos que recabamos de profesionales y aspirantes">
        <ul>
          <li><strong>Identificación y contacto:</strong> nombre, nombre comercial, fecha de nacimiento, correo y celular.</li>
          <li><strong>Identificación oficial:</strong> CURP, RFC si lo proporcionas, imágenes de tu INE por ambos lados.</li>
          <li><strong>Domicilio:</strong> comprobante de domicilio.</li>
          <li><strong>Perfil profesional:</strong> especialidad, zonas, horarios, portafolio, certificaciones, examen y entrevista.</li>
          <li><strong>Referencias:</strong> nombre y teléfono de dos clientes anteriores que aceptaron ser contactados.</li>
          <li><strong>Cobro:</strong> datos bancarios para depositarte, cuando tu cuenta se active.</li>
          <li><strong>Desempeño:</strong> calificaciones, reclamos, cumplimiento y resultados de auditorías de calidad.</li>
        </ul>
      </Section>

      <Section n={4} id="datos-sensibles" title="Datos personales sensibles y consentimiento expreso">
        <p>Para certificar a un profesional tratamos datos que la ley considera sensibles o que requieren especial cuidado:</p>
        <ul>
          <li>la fotografía de tu rostro y la selfie con tu identificación, usadas para confirmar que eres quien dices ser;</li>
          <li>tu constancia de antecedentes no penales;</li>
          <li>tu identificación oficial y tu CURP.</li>
        </ul>
        <p>
          <strong>Solo los tratamos si nos das tu consentimiento expreso</strong>, mediante una casilla separada que debes marcar
          al crear tu cuenta de profesional. Guardamos la fecha y la versión del aviso que aceptaste.
        </p>
        <p>
          Los usamos únicamente para verificar tu identidad e idoneidad y decidir tu certificación. Se guardan en un
          almacenamiento privado al que solo tienes acceso tú y el personal de verificación autorizado de I mendly. Los enlaces
          para consultarlos caducan a los pocos minutos. <strong>Nunca se muestran a clientes</strong> ni se usan con fines de
          mercadotecnia. Lo que el cliente ve es tu nombre, tu foto de perfil, tu especialidad y tus calificaciones.
        </p>
        <p>
          Si tu solicitud se rechaza o la retiras, eliminamos estos documentos en un plazo máximo de 90 días, salvo que
          debamos conservarlos por obligación legal o para atender una reclamación en curso.
        </p>
      </Section>

      <Section n={5} title="Finalidades primarias">
        <p>Son necesarias para la relación que tienes con nosotros:</p>
        <ul>
          <li>crear y administrar tu cuenta;</li>
          <li>conectar a clientes con profesionales y gestionar órdenes, ofertas y proyectos;</li>
          <li>procesar pagos, anticipos, liquidaciones, reembolsos y facturación;</li>
          <li>verificar, certificar y evaluar la calidad de los profesionales;</li>
          <li>atender reclamos, aplicar la Garantía I mendly y prevenir fraudes;</li>
          <li>cumplir obligaciones legales y requerimientos de autoridad.</li>
        </ul>
      </Section>

      <Section n={6} title="Finalidades secundarias">
        <p>No son necesarias para el servicio y puedes negarte sin que eso afecte tu cuenta:</p>
        <ul>
          <li>enviarte promociones, novedades y encuestas;</li>
          <li>elaborar estadísticas para mejorar la app, de forma agregada.</li>
        </ul>
        <p>
          Para negarte escribe a <a href={`mailto:${COMPANY.privacyEmail}`}>{COMPANY.privacyEmail}</a> con el asunto
          “Finalidades secundarias”.
        </p>
      </Section>

      <Section n={7} title="Con quién compartimos tus datos">
        <ul>
          <li>
            <strong>Entre cliente y profesional:</strong> al aceptarse una oferta, compartimos solo lo necesario para el trabajo:
            nombre, dirección del servicio y medio de contacto. Esta transferencia es necesaria para cumplir el servicio que
            solicitaste.
          </li>
          <li>
            <strong>Encargados:</strong> procesador de pagos (Stripe), proveedores de alojamiento en la nube y base de datos, y servicios de
            envío de correos y mensajes. Actúan por cuenta de I mendly, con obligaciones de confidencialidad.
          </li>
          <li><strong>Autoridades:</strong> cuando lo exija la ley o una orden de autoridad competente.</li>
        </ul>
        <p>No vendemos ni rentamos tus datos personales.</p>
      </Section>

      <Section n={8} title="Derechos ARCO y revocación del consentimiento">
        <p>
          Puedes <strong>acceder</strong> a tus datos, <strong>rectificarlos</strong>, <strong>cancelarlos</strong> u{' '}
          <strong>oponerte</strong> a su tratamiento, y revocar el consentimiento que nos diste. Envía tu solicitud a{' '}
          <a href={`mailto:${COMPANY.privacyEmail}`}>{COMPANY.privacyEmail}</a> con:
        </p>
        <ol>
          <li>tu nombre y el correo de tu cuenta;</li>
          <li>una copia de tu identificación oficial o la de tu representante, con el documento que lo acredite;</li>
          <li>la descripción clara del derecho que quieres ejercer y de los datos involucrados.</li>
        </ol>
        <p>
          Te responderemos en un máximo de 20 días hábiles y, si procede, la haremos efectiva en los 15 días hábiles
          siguientes. Si revocas el consentimiento para datos sensibles, no podremos mantener tu certificación como
          profesional.
        </p>
        <p>
          Si consideras que tu derecho no fue atendido, puedes acudir a la autoridad competente en materia de protección de
          datos personales.
        </p>
      </Section>

      <Section n={9} title="Cómo limitar el uso de tus datos">
        <p>
          Puedes pedir que dejemos de enviarte comunicaciones promocionales desde el enlace de baja de cada correo o
          escribiendo a <a href={`mailto:${COMPANY.privacyEmail}`}>{COMPANY.privacyEmail}</a>. También puedes inscribirte en
          el Registro Público para Evitar Publicidad (REPEP) de la PROFECO.
        </p>
      </Section>

      <Section n={10} title="Seguridad y conservación">
        <p>
          Aplicamos medidas administrativas, técnicas y físicas: conexiones cifradas, controles de acceso por rol, registro de
          consentimientos y almacenamiento privado para documentos. Conservamos tus datos mientras tengas cuenta y, después,
          solo el tiempo que exijan las leyes fiscales y mercantiles o el necesario para atender reclamaciones.
        </p>
      </Section>

      <Section n={11} title="Cookies y tecnologías similares">
        <p>
          Usamos almacenamiento local del navegador para mantener tu sesión iniciada y guardar borradores, por ejemplo un
          proyecto a medio capturar. No usamos cookies de publicidad de terceros. Puedes borrarlas desde tu navegador; si lo
          haces, tendrás que iniciar sesión de nuevo.
        </p>
      </Section>

      <Section n={12} title="Cambios a este aviso">
        <p>
          Publicaremos cualquier cambio en esta página y te avisaremos en la app o por correo. Si el cambio afecta las
          finalidades o los datos sensibles, te pediremos tu consentimiento de nuevo.
        </p>
      </Section>

      <Callout>
        Lee también los <Link className="underline" href={LEGAL_LINKS.terminos}>Términos para clientes</Link> y los{' '}
        <Link className="underline" href={LEGAL_LINKS.profesionales}>Términos para profesionales</Link>.
      </Callout>
    </LegalDoc>
  );
}
