import type { Metadata } from "next";
import "./globals.css";
import { AdminGuard } from "@/components/admin/AdminGuard";

export const metadata: Metadata = {
  title: "Operación · I mendly",
  description: "Panel del equipo I mendly",
  // El panel no debe aparecer en buscadores ni enlazarse desde lo público
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Toda ruta bajo /admin exige sesión con rol 'admin' (ver AdminGuard)
  return (
    <AdminGuard>
      <div className="min-h-full flex flex-col">{children}</div>
    </AdminGuard>
  );
}
