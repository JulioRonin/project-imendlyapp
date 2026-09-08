// Acceso rápido de desarrollo — NUNCA debe quedar activo en producción real.
//
// Se habilita solo en dos casos:
//   1. `next dev` (NODE_ENV === 'development') — el caso normal de trabajo local.
//   2. NEXT_PUBLIC_DEV_BYPASS === 'true' — escotilla explícita para demos en
//      previews de Vercel. NO la definas en el proyecto de producción.
//
// Siempre que esté activo se muestra una franja fija "MODO DEMO" en pantalla,
// para que sea imposible operar un despliegue real sin notarlo.
//
// Ojo: esto NO crea una sesión de Supabase. Sirve para recorrer las pantallas;
// las páginas que consultan la base de datos aparecerán vacías porque no hay
// sesión real. Para una app usable con datos, corre `supabase/seed_demo.sql`
// y entra con los usuarios de prueba.

export const DEV_BYPASS_ENABLED =
  process.env.NODE_ENV === 'development' ||
  process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

export type DemoRole = 'cliente' | 'proveedor' | 'admin';

export interface DemoUser {
  role: DemoRole;
  label: string;
  email: string;
  name: string;
  path: string;
}

// Los correos coinciden con los usuarios que crea supabase/seed_demo.sql,
// para que el acceso rápido y el login real lleven al mismo lugar.
export const DEMO_USERS: DemoUser[] = [
  {
    role: 'cliente',
    label: 'Cliente',
    email: 'cliente@imendly.test',
    name: 'María González',
    path: '/cliente',
  },
  {
    role: 'proveedor',
    label: 'Proveedor',
    email: 'proveedor@imendly.test',
    name: 'Javier Ramírez',
    path: '/proveedor',
  },
  {
    role: 'admin',
    label: 'Admin',
    email: 'admin@imendly.test',
    name: 'Operación I mendly',
    path: '/admin',
  },
];

export const DEMO_PASSWORD = 'imendly123';
