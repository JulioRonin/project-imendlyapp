import { redirect } from "next/navigation";

// Ruta heredada: las entradas ahora están separadas.
//   Clientes → /cliente   ·   Profesionales → /proveedor/login
// El panel del equipo no se enlaza desde ninguna pantalla pública.
export default function RoleSelectionRedirect() {
  redirect("/cliente");
}
