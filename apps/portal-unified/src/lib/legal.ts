// Documentos legales de I mendly: versión vigente, rutas y datos del responsable.
//
// IMPORTANTE: los textos de /legal son un BORRADOR de trabajo que debe
// revisar un abogado antes del lanzamiento. Al cambiar el contenido de un
// documento, sube LEGAL_VERSION: el registro guarda la versión aceptada
// (tabla legal_acceptances) y así se sabe qué texto aceptó cada persona.

export const LEGAL_VERSION = '2026-10.2';
export const LEGAL_UPDATED = '24 de octubre de 2026';

// Datos del responsable. Completar al constituir la sociedad — se muestran
// tal cual en los documentos públicos.
export const COMPANY = {
  brand: 'I mendly',
  legalName: 'I mendly S.A.P.I. de C.V.',
  rfc: '[RFC por asignar al constituir la sociedad]',
  address: '[Domicilio fiscal en Ciudad Juárez, Chihuahua — por completar]',
  city: 'Ciudad Juárez, Chihuahua',
  privacyEmail: 'privacidad@imendly.com',
  supportEmail: 'soporte@imendly.com',
};

export type LegalDocument =
  | 'terminos_clientes'
  | 'terminos_profesionales'
  | 'aviso_privacidad'
  | 'datos_sensibles'
  | 'consentimiento_referencias'
  | 'declaracion_veracidad';

export const LEGAL_LINKS = {
  terminos: '/legal/terminos',
  profesionales: '/legal/profesionales',
  privacidad: '/legal/privacidad',
  garantia: '/legal/garantia',
};

/** Metadatos de signUp: el trigger handle_new_user los convierte en evidencia. */
export function legalMetadata(docs: LegalDocument[]): Record<string, string> {
  return Object.fromEntries(docs.map(d => [d, LEGAL_VERSION]));
}
