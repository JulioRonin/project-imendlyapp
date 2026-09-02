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

const inputCls =
  'w-full h-14 px-5 rounded-[1.25rem] bg-[#FBF9F4] text-[#1B1A17] text-[14px] font-semibold placeholder:text-[#ACA598] placeholder:font-medium outline-none focus:ring-2 focus:ring-primary/30 transition-shadow disabled:text-[#7A7468]';

export default function ClientProfilePage() {
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
        router.push('/login');
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
    router.push('/login');
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
    <main className="min-h-screen bg-[#F4F1EA] pb-36">
      {/* ── Header interno v2 ── */}
      <header className="v2-rise sticky top-0 z-50 bg-[#F4F1EA]/85 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            aria-label="Volver"
            className="w-12 h-12 shrink-0 rounded-full bg-white v2-shadow-soft flex items-center justify-center text-[#1B1A17] v2-press"
          >
            <ArrowLeft size={19} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Mi cuenta</p>
            <h1 className="text-[22px] font-semibold tracking-tight text-[#1B1A17] leading-tight">Perfil</h1>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 mt-2 space-y-8">
        {/* ── Aviso de perfil incompleto ── */}
        {(!profileComplete.hasPhone || !profileComplete.hasAddress || !profileComplete.hasPayment) && (
          <div className="v2-rise v2-d1 bg-amber-50 rounded-[1.75rem] p-5 flex items-center gap-4">
            <span className="w-12 h-12 shrink-0 rounded-[1.05rem] bg-white text-amber-500 flex items-center justify-center v2-shadow-soft">
              <Info size={22} />
            </span>
            <div>
              <p className="text-[13.5px] font-bold tracking-tight text-amber-700 mb-0.5">Perfil incompleto</p>
              <p className="text-[12.5px] font-medium text-amber-700/80 leading-relaxed">
                Para poder reservar servicios, necesitamos tu {
                  [!profileComplete.hasPhone && 'teléfono', !profileComplete.hasAddress && 'dirección', !profileComplete.hasPayment && 'cuenta bancaria'].filter(Boolean).join(', ')
                }.
              </p>
            </div>
          </div>
        )}

        {/* ── Cabecera de perfil ── */}
        <section className="v2-rise v2-d2 flex flex-col items-center text-center">
          <Avatar
            name={personalInfo.name}
            size="xl"
            className="w-28 h-28 text-3xl ring-4 ring-[#E7F2E9] v2-shadow-lift mb-5"
          />
          <h2 className="text-[22px] font-bold tracking-tight text-[#1B1A17] mb-1">{personalInfo.name}</h2>
          <p className="text-[14px] font-medium text-[#7A7468] mb-4">{personalInfo.email}</p>
          <span className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-[#E7F2E9] text-[#2A9460] text-[11px] font-bold">
            <ShieldCheck size={13} /> Cuenta verificada
          </span>
        </section>

        {/* ── Información básica ── */}
        <Reveal>
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-xl font-semibold tracking-tight text-[#1B1A17]">Información básica</h3>
              {!isEditingInfo && (
                <button
                  onClick={() => setIsEditingInfo(true)}
                  className="flex items-center gap-1.5 text-[13px] font-semibold text-primary v2-press"
                >
                  <Edit2 size={14} /> Editar
                </button>
              )}
            </div>

            <div className="bg-white rounded-[2.25rem] v2-shadow-soft overflow-hidden">
              {isEditingInfo ? (
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ACA598] mb-2 ml-1 block">
                      Nombre completo
                    </label>
                    <input
                      value={personalInfo.name}
                      onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ACA598] mb-2 ml-1 block">
                      Teléfono celular
                    </label>
                    <input
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ACA598] mb-2 ml-1 block">
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
                      className="flex-1 h-14 rounded-full bg-white border border-black/[0.06] text-[#1B1A17] text-[13px] font-semibold v2-press hover:bg-[#FBF9F4] transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveInfo}
                      className="flex-1 h-14 rounded-full bg-primary text-white text-[13px] font-bold shadow-lg shadow-primary/25 v2-press hover:bg-primary-dark transition-colors"
                    >
                      {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Guardar cambios'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 px-6 py-5">
                    <span className="w-11 h-11 shrink-0 rounded-[1.05rem] bg-[#E7F2E9] text-primary flex items-center justify-center">
                      <User size={19} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-[#ACA598]">Nombre completo</p>
                      <p className="text-[14.5px] font-semibold text-[#1B1A17] truncate">{personalInfo.name || '—'}</p>
                    </div>
                  </div>
                  <div className="border-t border-black/[0.06] flex items-center gap-4 px-6 py-5">
                    <span className="w-11 h-11 shrink-0 rounded-[1.05rem] bg-[#E7F2E9] text-primary flex items-center justify-center">
                      <Phone size={19} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-[#ACA598]">Teléfono celular</p>
                      <p className="text-[14.5px] font-semibold text-[#1B1A17] truncate tabular-nums">{personalInfo.phone || 'Sin registrar'}</p>
                    </div>
                  </div>
                  <div className="border-t border-black/[0.06] flex items-center gap-4 px-6 py-5">
                    <span className="w-11 h-11 shrink-0 rounded-[1.05rem] bg-[#E7F2E9] text-primary flex items-center justify-center">
                      <Mail size={19} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-[#ACA598]">Correo electrónico</p>
                      <p className="text-[14.5px] font-semibold text-[#1B1A17] truncate">{personalInfo.email || '—'}</p>
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
              <h3 className="text-xl font-semibold tracking-tight text-[#1B1A17]">Métodos de pago</h3>
              <button
                onClick={() => setIsAddingPayment(true)}
                aria-label="Agregar método de pago"
                className="w-10 h-10 rounded-full bg-[#E7F2E9] text-primary flex items-center justify-center v2-press hover:bg-primary hover:text-white transition-colors"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="bg-white rounded-[2.25rem] v2-shadow-soft overflow-hidden">
              {paymentMethods.map((method: any, i: number) => (
                <div key={method.id} className={`flex items-center gap-4 px-6 py-5 group ${i > 0 ? 'border-t border-black/[0.06]' : ''}`}>
                  <span className="w-11 h-11 shrink-0 rounded-[1.05rem] bg-[#E7F2E9] text-primary flex items-center justify-center">
                    <CreditCard size={19} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14.5px] font-semibold text-[#1B1A17]">
                      {method.type} terminada en {method.last4}
                    </p>
                    <p className="text-[12px] font-medium text-[#7A7468]">
                      Expira {method.exp} {method.isDefault && <span className="text-primary font-semibold">· Principal</span>}
                    </p>
                  </div>
                  <button className="text-[#ACA598] hover:text-red-500 transition-colors p-2 v2-press" aria-label="Eliminar método">
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}

              {isAddingPayment ? (
                <div className={`p-6 ${paymentMethods.length > 0 ? 'border-t border-black/[0.06]' : ''}`}>
                  <h4 className="text-[15px] font-semibold tracking-tight text-[#1B1A17] mb-5">Agregar nueva tarjeta / cuenta</h4>
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
                        className="flex-1 h-14 rounded-full bg-white border border-black/[0.06] text-[#1B1A17] text-[13px] font-semibold v2-press hover:bg-[#FBF9F4] transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 h-14 rounded-full bg-primary text-white text-[13px] font-bold shadow-lg shadow-primary/25 v2-press hover:bg-primary-dark transition-colors"
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
                    className="w-full flex items-center gap-4 px-6 py-5 text-left v2-press hover:bg-[#FBF9F4] transition-colors"
                  >
                    <span className="w-11 h-11 shrink-0 rounded-[1.05rem] bg-[#E7F2E9] text-primary flex items-center justify-center">
                      <Plus size={19} strokeWidth={2.5} />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[14.5px] font-semibold text-[#1B1A17]">Agregar método de pago</span>
                      <span className="block text-[12px] font-medium text-[#7A7468]">Tarjeta o cuenta bancaria</span>
                    </span>
                    <ChevronRight size={17} className="text-[#ACA598]" />
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
              <h3 className="text-xl font-semibold tracking-tight text-[#1B1A17]">Direcciones guardadas</h3>
              <button
                onClick={() => setIsAddingAddress(true)}
                aria-label="Agregar dirección"
                className="w-10 h-10 rounded-full bg-[#E7F2E9] text-primary flex items-center justify-center v2-press hover:bg-primary hover:text-white transition-colors"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="bg-white rounded-[2.25rem] v2-shadow-soft overflow-hidden">
              {addresses.map((address: any, i: number) => (
                <div key={address.id} className={`flex items-center gap-4 px-6 py-5 group ${i > 0 ? 'border-t border-black/[0.06]' : ''}`}>
                  <span className="w-11 h-11 shrink-0 rounded-[1.05rem] bg-[#E7F2E9] text-primary flex items-center justify-center">
                    <MapPin size={19} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14.5px] font-semibold text-[#1B1A17] flex items-center gap-2.5">
                      {address.title}
                      {address.is_default && (
                        <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-[#E7F2E9] text-[#2A9460] text-[10px] font-bold">
                          Principal
                        </span>
                      )}
                    </p>
                    <p className="text-[13px] font-medium text-[#7A7468] truncate">{address.street}</p>
                    <p className="text-[12px] font-medium text-[#ACA598]">
                      {address.city}, {address.state} · C.P. {address.cp}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      aria-label="Eliminar dirección"
                      className="text-[#ACA598] hover:text-red-500 transition-colors p-2 v2-press"
                    >
                      <Trash2 size={17} />
                    </button>
                    <ChevronRight size={17} className="text-[#ACA598]" />
                  </div>
                </div>
              ))}

              {isAddingAddress ? (
                <div className={`p-6 ${addresses.length > 0 ? 'border-t border-black/[0.06]' : ''}`}>
                  <h4 className="text-[15px] font-semibold tracking-tight text-[#1B1A17] mb-5">Nueva dirección</h4>
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
                        className="flex-1 h-14 rounded-full bg-white border border-black/[0.06] text-[#1B1A17] text-[13px] font-semibold v2-press hover:bg-[#FBF9F4] transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 h-14 rounded-full bg-primary text-white text-[13px] font-bold shadow-lg shadow-primary/25 v2-press hover:bg-primary-dark transition-colors flex items-center justify-center"
                      >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Guardar dirección'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className={`w-full flex items-center gap-4 px-6 py-5 text-left v2-press hover:bg-[#FBF9F4] transition-colors ${addresses.length > 0 ? 'border-t border-black/[0.06]' : ''}`}
                >
                  <span className="w-11 h-11 shrink-0 rounded-[1.05rem] bg-[#E7F2E9] text-primary flex items-center justify-center">
                    <Plus size={19} strokeWidth={2.5} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[14.5px] font-semibold text-[#1B1A17]">Agregar dirección</span>
                    <span className="block text-[12px] font-medium text-[#7A7468]">Casa, oficina u otro lugar</span>
                  </span>
                  <ChevronRight size={17} className="text-[#ACA598]" />
                </button>
              )}
            </div>
          </section>
        </Reveal>

        {/* ── Cerrar sesión ── */}
        <Reveal delay={180}>
          <div className="bg-white rounded-[2.25rem] v2-shadow-soft overflow-hidden">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-5 text-left v2-press hover:bg-red-50 transition-colors"
            >
              <span className="w-11 h-11 shrink-0 rounded-[1.05rem] bg-red-50 text-red-500 flex items-center justify-center">
                <LogOut size={19} />
              </span>
              <span className="flex-1 text-[14.5px] font-semibold text-red-500">Cerrar sesión</span>
              <ChevronRight size={17} className="text-red-300" />
            </button>
          </div>
        </Reveal>
      </div>

      <ClientNav />
    </main>
  );
}
