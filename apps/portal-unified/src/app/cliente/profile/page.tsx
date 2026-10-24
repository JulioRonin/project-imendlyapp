"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, User, Phone, Mail, MapPin, CreditCard, Plus,
  ShieldCheck, ChevronRight, Edit2, Trash2, Loader2, Info, LogOut,
} from 'lucide-react';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { ClientNav } from '@/components/client/ClientNav';
import { Reveal } from '@/components/client/ui';

import { supabase } from '@/lib/supabase';
import { RequireSession } from '@/components/auth/RequireSession';

const inputCls =
  'w-full h-14 px-5 rounded-[1.25rem] bg-sand text-ink text-[14px] font-semibold placeholder:text-faint placeholder:font-medium outline-none focus:ring-2 focus:ring-primary/30 transition-shadow disabled:text-muted';

function ClientProfilePage() {
  const router = useRouter();
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Form States
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [addresses, setAddresses] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [profileComplete, setProfileComplete] = useState({
    hasPhone: false,
    hasAddress: false,
    hasPayment: false
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/cliente');
        return;
      }
      setUserId(user.id);

      // 1. Fetch from public.users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userData) {
        setPersonalInfo({
          name: userData.full_name,
          email: user.email || '',
          phone: userData.phone || '',
        });
      }

      // 2. Fetch from user_addresses
      const { data: addrData, error: addrError } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (addrData) {
        setAddresses(addrData);
      }

      // 3. Mock logic for completeness check
      setProfileComplete({
        hasPhone: !!userData?.phone,
        hasAddress: (addrData?.length || 0) > 0,
        hasPayment: false // Start empty as requested
      });

      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/cliente');
  };

  const handleSaveInfo = async () => {
    if (!userId) return;

    setLoading(true);
    const { error } = await supabase
      .from('users')
      .update({
        full_name: personalInfo.name,
        phone: personalInfo.phone
      })
      .eq('id', userId);

    if (error) {
      alert("Error al guardar la información: " + error.message);
    } else {
      setIsEditingInfo(false);
    }
    setLoading(false);
  };

  const handleSavePaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingPayment(false);
  };

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    title: '',
    street: '',
    city: '',
    state: '',
    cp: ''
  });

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('user_addresses')
      .insert({
        user_id: userId,
        ...newAddress,
        is_default: addresses.length === 0
      })
      .select()
      .single();

    if (error) {
      alert("Error al agregar dirección: " + error.message);
    } else {
      setAddresses([...addresses, data]);
      setIsAddingAddress(false);
      setNewAddress({ title: '', street: '', city: '', state: '', cp: '' });
    }
    setLoading(false);
  };

  const handleDeleteAddress = async (addrId: string) => {
    if (!confirm("¿Eliminar esta dirección?")) return;

    setLoading(true);
    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', addrId);

    if (error) {
      alert("Error al eliminar dirección: " + error.message);
    } else {
      setAddresses(addresses.filter(a => a.id !== addrId));
    }
    setLoading(false);
  };

  // Removed mock PAYMENT_METHODS as per user request

  return (
    <main className="min-h-screen bg-linen pb-36 overflow-x-hidden">
      {/* ── Cabecera fotográfica ── */}
      <header className="v3-blur-in relative h-[260px] md:h-[300px] rounded-b-[2.75rem] overflow-hidden bg-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/provider_dashboard_hero.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-6 pt-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            aria-label="Volver"
            className="w-11 h-11 rounded-full glass flex items-center justify-center text-ink v2-press"
          >
            <ArrowLeft size={19} />
          </button>
          <span className="glass rounded-full px-4 h-10 inline-flex items-center text-[12px] font-semibold text-ink">Mi cuenta</span>
        </div>
      </header>

      {/* ── Avatar empalmado + identidad ── */}
      <section className="v3-blur-in max-w-3xl mx-auto px-6 -mt-14 relative z-10 flex flex-col items-center text-center" style={{ animationDelay: '160ms' }}>
        <Avatar
          name={personalInfo.name}
          size="xl"
          className="w-28 h-28 text-3xl ring-4 ring-linen v3-lift-shadow mb-5"
        />
        <h1 className="text-[28px] font-semibold tracking-tight text-ink mb-1">{personalInfo.name || 'Perfil'}</h1>
        <p className="text-[14px] font-medium text-muted mb-4">{personalInfo.email}</p>
        <span className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-mint-light text-mint-deep text-[11px] font-bold">
          <ShieldCheck size={13} /> Cuenta verificada
        </span>
      </section>

      <div className="max-w-3xl mx-auto px-6 mt-8 space-y-8">
        {/* ── Aviso de perfil incompleto ── */}
        {(!profileComplete.hasPhone || !profileComplete.hasAddress || !profileComplete.hasPayment) && (
          <div className="v2-rise v2-d1 bg-primary-light rounded-[1.75rem] p-5 flex items-center gap-4">
            <span className="w-12 h-12 shrink-0 rounded-[1.05rem] bg-cream text-warning flex items-center justify-center v2-shadow-soft">
              <Info size={22} />
            </span>
            <div>
              <p className="text-[13.5px] font-bold tracking-tight text-warning mb-0.5">Perfil incompleto</p>
              <p className="text-[12.5px] font-medium text-warning/80 leading-relaxed">
                Para poder reservar servicios, necesitamos tu {
                  [!profileComplete.hasPhone && 'teléfono', !profileComplete.hasAddress && 'dirección', !profileComplete.hasPayment && 'cuenta bancaria'].filter(Boolean).join(', ')
                }.
              </p>
            </div>
          </div>
        )}

        {/* ── Información básica ── */}
        <Reveal>
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-xl font-semibold tracking-tight text-ink">Información básica</h3>
              {!isEditingInfo && (
                <button
                  onClick={() => setIsEditingInfo(true)}
                  className="flex items-center gap-1.5 text-[13px] font-semibold text-primary-deep v2-press"
                >
                  <Edit2 size={14} /> Editar
                </button>
              )}
            </div>

            <div className="bg-cream rounded-[2.25rem] v2-shadow-soft overflow-hidden">
              {isEditingInfo ? (
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-faint mb-2 ml-1 block">
                      Nombre completo
                    </label>
                    <input
                      value={personalInfo.name}
                      onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-faint mb-2 ml-1 block">
                      Teléfono celular
                    </label>
                    <input
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-faint mb-2 ml-1 block">
                      Correo electrónico
                    </label>
                    <input
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                      className={inputCls}
                    />
                  </div>
                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setIsEditingInfo(false)}
                      className="flex-1 h-14 rounded-full bg-cream border border-line text-ink text-[13px] font-semibold v2-press hover:bg-sand transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveInfo}
                      className="flex-1 h-14 rounded-full bg-primary text-ink text-[13px] font-bold v2-press hover:bg-primary-dark transition-colors"
                    >
                      {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Guardar cambios'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 px-6 py-5">
                    <span className="w-11 h-11 shrink-0 rounded-[1.05rem] bg-primary-light text-primary-deep flex items-center justify-center">
                      <User size={19} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-faint">Nombre completo</p>
                      <p className="text-[14.5px] font-semibold text-ink truncate">{personalInfo.name || '—'}</p>
                    </div>
                  </div>
                  <div className="border-t border-line flex items-center gap-4 px-6 py-5">
                    <span className="w-11 h-11 shrink-0 rounded-[1.05rem] bg-primary-light text-primary-deep flex items-center justify-center">
                      <Phone size={19} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-faint">Teléfono celular</p>
                      <p className="text-[14.5px] font-semibold text-ink truncate tabular-nums">{personalInfo.phone || 'Sin registrar'}</p>
                    </div>
                  </div>
                  <div className="border-t border-line flex items-center gap-4 px-6 py-5">
                    <span className="w-11 h-11 shrink-0 rounded-[1.05rem] bg-primary-light text-primary-deep flex items-center justify-center">
                      <Mail size={19} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-faint">Correo electrónico</p>
                      <p className="text-[14.5px] font-semibold text-ink truncate">{personalInfo.email || '—'}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </Reveal>

        {/* ── Métodos de pago ── */}
        <Reveal delay={60}>
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-xl font-semibold tracking-tight text-ink">Métodos de pago</h3>
              <button
                onClick={() => setIsAddingPayment(true)}
                aria-label="Agregar método de pago"
                className="w-10 h-10 rounded-full bg-primary-light text-primary-deep flex items-center justify-center v2-press hover:bg-primary hover:text-ink transition-colors"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="bg-cream rounded-[2.25rem] v2-shadow-soft overflow-hidden">
              {paymentMethods.map((method: any, i: number) => (
                <div key={method.id} className={`flex items-center gap-4 px-6 py-5 group ${i > 0 ? 'border-t border-line' : ''}`}>
                  <span className="w-11 h-11 shrink-0 rounded-[1.05rem] bg-primary-light text-primary-deep flex items-center justify-center">
                    <CreditCard size={19} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14.5px] font-semibold text-ink">
                      {method.type} terminada en {method.last4}
                    </p>
                    <p className="text-[12px] font-medium text-muted">
                      Expira {method.exp} {method.isDefault && <span className="text-primary-deep font-semibold">· Principal</span>}
                    </p>
                  </div>
                  <button className="text-faint hover:text-error transition-colors p-2 v2-press" aria-label="Eliminar método">
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}

              {isAddingPayment ? (
                <div className={`p-6 ${paymentMethods.length > 0 ? 'border-t border-line' : ''}`}>
                  <h4 className="text-[15px] font-semibold tracking-tight text-ink mb-5">Agregar nueva tarjeta / cuenta</h4>
                  <form onSubmit={handleSavePaymentMethod} className="space-y-3.5">
                    <input placeholder="Número de tarjeta (16 dígitos)" className={inputCls} required />
                    <div className="grid grid-cols-2 gap-3.5">
                      <input placeholder="MM/YY" className={inputCls} required />
                      <input placeholder="CVC" type="password" className={inputCls} required />
                    </div>
                    <input placeholder="Nombre del titular" className={inputCls} required />
                    <div className="flex gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setIsAddingPayment(false)}
                        className="flex-1 h-14 rounded-full bg-cream border border-line text-ink text-[13px] font-semibold v2-press hover:bg-sand transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 h-14 rounded-full bg-primary text-ink text-[13px] font-bold v2-press hover:bg-primary-dark transition-colors"
                      >
                        Guardar cuenta
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                paymentMethods.length === 0 && (
                  <button
                    onClick={() => setIsAddingPayment(true)}
                    className="w-full flex items-center gap-4 px-6 py-5 text-left v2-press hover:bg-sand transition-colors"
                  >
                    <span className="w-11 h-11 shrink-0 rounded-[1.05rem] bg-primary-light text-primary-deep flex items-center justify-center">
                      <Plus size={19} strokeWidth={2.5} />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[14.5px] font-semibold text-ink">Agregar método de pago</span>
                      <span className="block text-[12px] font-medium text-muted">Tarjeta o cuenta bancaria</span>
                    </span>
                    <ChevronRight size={17} className="text-faint" />
                  </button>
                )
              )}
            </div>
          </section>
        </Reveal>

        {/* ── Direcciones guardadas ── */}
        <Reveal delay={120}>
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-xl font-semibold tracking-tight text-ink">Direcciones guardadas</h3>
              <button
                onClick={() => setIsAddingAddress(true)}
                aria-label="Agregar dirección"
                className="w-10 h-10 rounded-full bg-primary-light text-primary-deep flex items-center justify-center v2-press hover:bg-primary hover:text-ink transition-colors"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="bg-cream rounded-[2.25rem] v2-shadow-soft overflow-hidden">
              {addresses.map((address: any, i: number) => (
                <div key={address.id} className={`flex items-center gap-4 px-6 py-5 group ${i > 0 ? 'border-t border-line' : ''}`}>
                  <span className="w-11 h-11 shrink-0 rounded-[1.05rem] bg-primary-light text-primary-deep flex items-center justify-center">
                    <MapPin size={19} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14.5px] font-semibold text-ink flex items-center gap-2.5">
                      {address.title}
                      {address.is_default && (
                        <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-mint-light text-mint-deep text-[10px] font-bold">
                          Principal
                        </span>
                      )}
                    </p>
                    <p className="text-[13px] font-medium text-muted truncate">{address.street}</p>
                    <p className="text-[12px] font-medium text-faint">
                      {address.city}, {address.state} · C.P. {address.cp}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      aria-label="Eliminar dirección"
                      className="text-faint hover:text-error transition-colors p-2 v2-press"
                    >
                      <Trash2 size={17} />
                    </button>
                    <ChevronRight size={17} className="text-faint" />
                  </div>
                </div>
              ))}

              {isAddingAddress ? (
                <div className={`p-6 ${addresses.length > 0 ? 'border-t border-line' : ''}`}>
                  <h4 className="text-[15px] font-semibold tracking-tight text-ink mb-5">Nueva dirección</h4>
                  <form onSubmit={handleAddAddress} className="space-y-3.5">
                    <input
                      placeholder="Título (e.g. Casa, Oficina)"
                      value={newAddress.title}
                      onChange={(e) => setNewAddress({...newAddress, title: e.target.value})}
                      className={inputCls}
                      required
                    />
                    <input
                      placeholder="Calle y número"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                      className={inputCls}
                      required
                    />
                    <div className="grid grid-cols-2 gap-3.5">
                      <input
                        placeholder="Ciudad"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        className={inputCls}
                        required
                      />
                      <input
                        placeholder="Estado"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                        className={inputCls}
                        required
                      />
                    </div>
                    <input
                      placeholder="Código postal"
                      value={newAddress.cp}
                      onChange={(e) => setNewAddress({...newAddress, cp: e.target.value})}
                      className={inputCls}
                      required
                    />
                    <div className="flex gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="flex-1 h-14 rounded-full bg-cream border border-line text-ink text-[13px] font-semibold v2-press hover:bg-sand transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 h-14 rounded-full bg-primary text-ink text-[13px] font-bold v2-press hover:bg-primary-dark transition-colors flex items-center justify-center"
                      >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Guardar dirección'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className={`w-full flex items-center gap-4 px-6 py-5 text-left v2-press hover:bg-sand transition-colors ${addresses.length > 0 ? 'border-t border-line' : ''}`}
                >
                  <span className="w-11 h-11 shrink-0 rounded-[1.05rem] bg-primary-light text-primary-deep flex items-center justify-center">
                    <Plus size={19} strokeWidth={2.5} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[14.5px] font-semibold text-ink">Agregar dirección</span>
                    <span className="block text-[12px] font-medium text-muted">Casa, oficina u otro lugar</span>
                  </span>
                  <ChevronRight size={17} className="text-faint" />
                </button>
              )}
            </div>
          </section>
        </Reveal>

        {/* ── Cerrar sesión ── */}
        <Reveal delay={180}>
          <div className="bg-cream rounded-[2.25rem] v2-shadow-soft overflow-hidden">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-5 text-left v2-press hover:bg-rose/15 transition-colors"
            >
              <span className="w-11 h-11 shrink-0 rounded-[1.05rem] bg-rose/15 text-error flex items-center justify-center">
                <LogOut size={19} />
              </span>
              <span className="flex-1 text-[14.5px] font-semibold text-error">Cerrar sesión</span>
              <ChevronRight size={17} className="text-error/50" />
            </button>
          </div>
        </Reveal>
      </div>

      <ClientNav />
    </main>
  );
}

// Requiere cuenta: el invitado ve una invitación a registrarse sin salir del flujo
export default function ClientProfilePageGate() {
  return (
    <RequireSession
      title="Tu perfil I mendly"
      text="Inicia sesión para administrar tus datos, direcciones y preferencias."
      image="/assets/provider_dashboard_hero.png"
    >
      <ClientProfilePage />
    </RequireSession>
  );
}
