// Utilidades del Tablero de Proyectos (oferta-demanda)

export const PROJECT_CATEGORIES = [
  'Electricidad',
  'Plomería',
  'Pintura',
  'Climas/AC',
  'Limpieza',
  'Albañilería',
  'Carpintería',
  'Fumigación',
  'Herrería',
  'Otro',
] as const;

export const PROJECT_ZONES = [
  'Centro', 'Gómez Morín', 'Valle del Sol', 'Sendero', 'Las Torres',
  'Pronaf', 'Satélite', 'Anapra', 'Tierra Nueva', 'El Barreal', 'Zaragoza',
] as const;

export const TIMING_OPTIONS = [
  { value: 'urgente', label: 'Urgente (24-48h)' },
  { value: 'esta_semana', label: 'Esta semana' },
  { value: 'este_mes', label: 'Este mes' },
  { value: 'flexible', label: 'Fecha flexible' },
] as const;

export const timingLabel = (value: string) =>
  TIMING_OPTIONS.find(t => t.value === value)?.label ?? 'Flexible';

export const PROJECT_STATUS_LABELS: Record<string, { label: string; tone: 'default' | 'success' | 'warning' | 'error' }> = {
  pending_review: { label: 'En revisión', tone: 'warning' },
  open: { label: 'Recibiendo ofertas', tone: 'success' },
  assigned: { label: 'Asignado', tone: 'default' },
  completed: { label: 'Completado', tone: 'success' },
  cancelled: { label: 'Cancelado', tone: 'error' },
  rejected: { label: 'Rechazado', tone: 'error' },
};

export const OFFER_STATUS_LABELS: Record<string, { label: string; tone: 'default' | 'success' | 'warning' | 'error' }> = {
  active: { label: 'Enviada', tone: 'default' },
  accepted: { label: 'Aceptada', tone: 'success' },
  declined: { label: 'No seleccionada', tone: 'warning' },
  withdrawn: { label: 'Retirada', tone: 'error' },
};

// ---- Anti-fuga: detección de datos de contacto en texto libre ----
// El contacto se comparte solo al aceptar una oferta; los textos públicos
// (descripción del proyecto, mensaje de la oferta) no pueden llevar
// teléfonos, correos ni invitaciones a WhatsApp.
const PHONE_PATTERN = /(\+?52\s?)?(\(?\d{2,3}\)?[\s.-]?)?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2,4}|\d{10}/;
const EMAIL_PATTERN = /[\w.+-]+@[\w-]+\.[\w.]+/i;
const SOCIAL_PATTERN = /whats?app|wa\.me|telegram|@[\w.]{3,}|face\s?book|fb\.com|insta(gram)?\b/i;

export function findContactInfo(text: string): string | null {
  const digits = text.replace(/[\s.\-()]/g, '');
  if (/\d{10,}/.test(digits)) return 'un número telefónico';
  if (PHONE_PATTERN.test(text)) return 'un número telefónico';
  if (EMAIL_PATTERN.test(text)) return 'un correo electrónico';
  if (SOCIAL_PATTERN.test(text)) return 'una red social o WhatsApp';
  return null;
}

export const genDisplayId = (prefix: string) =>
  `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

export const formatMXN = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${Math.max(1, mins)} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `hace ${days} d`;
}
