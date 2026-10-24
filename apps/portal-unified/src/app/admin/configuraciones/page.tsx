"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Bell,
  Shield,
  LogOut,
  Mail,
  Phone,
  Globe,
  Moon,
  ChevronRight
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

/** Toggle de preferencia: ink cuando está activo. */
function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={`relative shrink-0 w-12 h-7 rounded-full transition-colors duration-300 v2-press ${on ? 'bg-ink' : 'bg-sand'}`}
    >
      <span className={`absolute top-1 w-5 h-5 rounded-full bg-cream v2-shadow-lift transition-all duration-300 ${on ? 'left-6' : 'left-1'}`} />
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    // In a real app, clear sessions/tokens here
    router.push('/role-selection');
  };

  return (
    <main className="min-h-screen bg-linen flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-14">
          {/* ── Cabecera editorial ── */}
          <header className="v3-blur-in">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep mb-2">Cuenta</p>
            <h1 className="text-[36px] md:text-[44px] font-semibold tracking-tight leading-[1.02] text-ink">Configuración</h1>
            <p className="mt-2 text-[14px] font-medium text-muted max-w-lg">Gestiona tu perfil, preferencias de seguridad y notificaciones.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-10">
            {/* ── Perfil ── */}
            <div className="space-y-5">
              <section className="v2-rise v2-d1 bg-cream rounded-[2.25rem] p-7 md:p-8 v2-shadow-soft flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <span className="w-24 h-24 rounded-[1.75rem] bg-lavender-light text-ink flex items-center justify-center ring-4 ring-cream">
                    <User size={40} />
                  </span>
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-mint ring-4 ring-cream" />
                </div>
                <h2 className="text-[22px] font-semibold tracking-tight text-ink">Julio M.</h2>
                <span className="mt-2 inline-flex items-center h-8 px-3.5 rounded-full bg-lavender-light text-ink text-[12px] font-semibold">Super administrador</span>

                <div className="w-full mt-7 space-y-3 text-left">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-2 ml-1">Correo</label>
                    <div className="flex items-center gap-3 h-12 px-4 rounded-[1.25rem] bg-sand focus-within:ring-2 focus-within:ring-lavender/60">
                      <Mail size={15} className="shrink-0 text-faint" />
                      <input readOnly defaultValue="julio@imendly.com" className="flex-1 min-w-0 bg-transparent text-[14px] font-semibold text-ink outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-2 ml-1">Teléfono</label>
                    <div className="flex items-center gap-3 h-12 px-4 rounded-[1.25rem] bg-sand focus-within:ring-2 focus-within:ring-lavender/60">
                      <Phone size={15} className="shrink-0 text-faint" />
                      <input readOnly defaultValue="+52 (656) 123-4567" className="flex-1 min-w-0 bg-transparent text-[14px] font-semibold text-ink outline-none tabular-nums" />
                    </div>
                  </div>
                </div>

                <button className="mt-7 w-full h-12 rounded-full bg-sand text-ink text-[13px] font-bold v2-press">
                  Editar perfil
                </button>
              </section>

              <section className="v2-rise v2-d2 relative overflow-hidden v3-night-grad text-on-dark rounded-[2rem] p-7 v2-shadow-lift">
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary/25 blur-3xl" />
                <div className="relative">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lavender mb-1 flex items-center gap-2">
                    <Shield size={12} /> Seguridad
                  </p>
                  <h3 className="text-[18px] font-semibold tracking-tight">Sesión protegida</h3>
                  <div className="mt-5 divide-y divide-white/10">
                    <div className="flex justify-between items-center py-3 text-[13px]">
                      <span className="font-medium text-on-dark/60">2FA activo</span>
                      <span className="inline-flex items-center h-7 px-2.5 rounded-full bg-mint text-ink text-[11px] font-bold">Sí</span>
                    </div>
                    <div className="flex justify-between items-center py-3 text-[13px]">
                      <span className="font-medium text-on-dark/60">Último acceso</span>
                      <span className="font-semibold tabular-nums">Hoy, 10:24 PM</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* ── Preferencias ── */}
            <div className="lg:col-span-2 space-y-5">
              <section className="v2-rise v2-d2 bg-cream rounded-[2.25rem] p-7 md:p-8 v2-shadow-soft">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-1">Preferencias</p>
                <h2 className="text-[22px] font-semibold tracking-tight text-ink mb-6">Preferencias de sistema</h2>

                <div className="divide-y divide-line">
                  <div className="flex items-center justify-between gap-4 py-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="w-11 h-11 shrink-0 rounded-[1rem] bg-primary-light text-primary-deep flex items-center justify-center">
                        <Bell size={18} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold text-ink">Notificaciones globales</p>
                        <p className="text-[12.5px] font-medium text-muted">Recibir alertas de nuevas disputas y aplicantes.</p>
                      </div>
                    </div>
                    <Toggle on={notifications} onClick={() => setNotifications(!notifications)} label="Notificaciones globales" />
                  </div>

                  <div className="flex items-center justify-between gap-4 py-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="w-11 h-11 shrink-0 rounded-[1rem] bg-lavender-light text-ink flex items-center justify-center">
                        <Moon size={18} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold text-ink">Modo oscuro</p>
                        <p className="text-[12.5px] font-medium text-muted">Optimizar interfaz para entornos de poca luz.</p>
                      </div>
                    </div>
                    <Toggle on={darkMode} onClick={() => setDarkMode(!darkMode)} label="Modo oscuro" />
                  </div>

                  <button className="w-full flex items-center justify-between gap-4 py-4 text-left group v2-press">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="w-11 h-11 shrink-0 rounded-[1rem] bg-sand text-ink flex items-center justify-center">
                        <Globe size={18} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold text-ink">Idioma del sistema</p>
                        <p className="text-[12.5px] font-medium text-muted">Español (México) · Latinoamérica</p>
                      </div>
                    </div>
                    <span className="w-10 h-10 shrink-0 rounded-full bg-sand text-ink flex items-center justify-center transition-colors group-hover:bg-ink group-hover:text-white">
                      <ChevronRight size={16} />
                    </span>
                  </button>
                </div>
              </section>

              {/* ── Zona de peligro ── */}
              <section className="v2-rise v2-d3 bg-rose/10 rounded-[2.25rem] p-7 md:p-8">
                <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-cream text-error text-[11px] font-bold mb-3">
                  <Shield size={12} /> Zona de peligro
                </span>
                <h2 className="text-[22px] font-semibold tracking-tight text-ink">Acciones irreversibles</h2>
                <p className="mt-2 text-[13.5px] font-medium text-muted max-w-md">Estas acciones afectarán tu acceso total al panel de operación.</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="h-12 px-6 rounded-full bg-sand text-error text-[13px] font-bold v2-press">
                    Borrar caché de sesión
                  </button>
                  <button
                    onClick={handleLogout}
                    className="h-12 px-6 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press"
                  >
                    <LogOut size={15} /> Cerrar sesión ahora
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
