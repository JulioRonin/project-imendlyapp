import 'server-only';
import { randomBytes } from 'crypto';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin 0/O ni 1/I

/** Folio legible y prácticamente único, p. ej. ORD-7KQ2XM. */
export function displayId(prefix: string) {
  const bytes = randomBytes(6);
  return `${prefix}-${Array.from(bytes, b => ALPHABET[b % ALPHABET.length]).join('')}`;
}
