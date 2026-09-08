"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Phone, Mail, MapPin, CreditCard, Plus, ShieldCheck, ChevronRight, Edit2, CheckCircle2, Trash2, Loader2, Info } from 'lucide-react';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Input } from '@i-mendly/shared/components/Input';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { BottomNav } from '@i-mendly/shared';

import { supabase } from '@/lib/supabase';

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
    <main className="min-h-screen bg-slate-50 pb-32">
      {/* Profile Incomplete Notice */}
      {(!profileComplete.hasPhone || !profileComplete.hasAddress || !profileComplete.hasPayment) && (
        <div className="px-8 mt-4 animate-in fade-in slide-in-from-top-2 duration-700">
          <Card className="p-6 bg-amber-50 border-amber-200 border shadow-none rounded-[2rem] flex items-center gap-5">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm shrink-0">
              <Info size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">Perfil Incompleto</p>
              <p className="text-[11px] text-amber-600 font-bold">
                Para poder reservar servicios, necesitamos tu {
                  [!profileComplete.hasPhone && 'teléfono', !profileComplete.hasAddress && 'dirección', !profileComplete.hasPayment && 'cuenta bancaria'].filter(Boolean).join(', ')
                }.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Header Boutique */}
      <header className="px-8 py-10 flex items-center justify-between sticky top-0 bg-slate-50/90 backdrop-blur-xl z-50">
        <button 
          onClick={() => router.back()}
          className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-brand-night hover:text-primary hover:scale-110 transition-all border border-slate-100"
        >
          <ArrowLeft size={20} strokeWidth={3} />
        </button>
        <div className="text-center">
            <p className="text-[10px] font-black tracking-[0.5em] text-brand-night/20 uppercase mb-1">Mi Cuenta</p>
            <h1 className="text-xl font-black text-brand-night uppercase tracking-tighter">Perfil de Usuario</h1>
        </div>
        <div className="w-12" /> {/* Spacer */}
      </header>

      <div className="px-8 max-w-3xl mx-auto space-y-12">
        
        {/* Top Profile Summary */}
        <section className="flex flex-col items-center">
          <div className="relative mb-6">
            <Avatar name={personalInfo.name} size="lg" className="w-32 h-32 text-4xl shadow-2xl ring-8 ring-white" />
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-xl shadow-lg border-2 border-white flex items-center justify-center hover:scale-110 transition-transform">
              <User size={18} />
            </button>
          </div>
          <h2 className="text-3xl font-black text-brand-night uppercase tracking-tighter mb-2">{personalInfo.name}</h2>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full border border-emerald-100/50">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Cuenta Verificada</span>
          </div>
        </section>

        {/* Personal Information */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Información Básica</h3>
            <button 
              onClick={() => isEditingInfo ? handleSaveInfo() : setIsEditingInfo(true)}
              className="text-primary hover:text-primary/70 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors"
            >
              {isEditingInfo ? (
                <><CheckCircle2 size={14} /> Guardar</>
              ) : (
                <><Edit2 size={14} /> Editar</>
              )}
            </button>
          </div>

          <Card className="p-8 rounded-[2rem] border-none shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] bg-white space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Nombre Completo</label>
              <div className="relative">
                <Input 
                  value={personalInfo.name} 
                  onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                  disabled={!isEditingInfo}
                  className={`pl-12 h-14 ${!isEditingInfo ? 'bg-slate-50 border-transparent text-brand-night font-bold' : ''}`}
                />
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Teléfono Celular</label>
                <div className="relative">
                  <Input 
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                    disabled={!isEditingInfo}
                    className={`pl-12 h-14 ${!isEditingInfo ? 'bg-slate-50 border-transparent text-brand-night font-bold' : ''}`}
                  />
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Correo Electrónico</label>
                <div className="relative">
                  <Input 
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                    disabled={!isEditingInfo}
                    className={`pl-12 h-14 ${!isEditingInfo ? 'bg-slate-50 border-transparent text-slate-500 font-medium' : ''}`}
                  />
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Payment Methods */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Métodos de Pago</h3>
            <button 
              onClick={() => setIsAddingPayment(true)}
              className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
            >
              <Plus size={18} strokeWidth={2.5} />
            </button>
          </div>

          <div className="space-y-4">
            {paymentMethods.map((method: any) => (
              <Card key={method.id} className="p-6 rounded-[2rem] border border-slate-100 shadow-sm bg-white flex items-center justify-between hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
                    {method.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-brand-night uppercase tracking-wider mb-1">
                      {method.type} terminada en {method.last4}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Expira {method.exp} {method.isDefault && <span className="ml-2 text-primary">· Principal</span>}
                    </p>
                  </div>
                </div>
                <button className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={18} />
                </button>
              </Card>
            ))}

            {isAddingPayment && (
              <Card className="p-8 rounded-[2rem] border-2 border-dashed border-primary/20 bg-primary/5">
                <h4 className="text-xs font-black text-brand-night uppercase tracking-widest mb-6">Agregar Nueva Tarjeta / Cuenta</h4>
                <form onSubmit={handleSavePaymentMethod} className="space-y-4">
                  <Input placeholder="Número de Tarjeta (16 dígitos)" className="h-14 bg-white" required />
                  <div className="flex gap-4">
                    <Input placeholder="MM/YY" className="h-14 bg-white" required />
                    <Input placeholder="CVC" type="password" className="h-14 bg-white" required />
                  </div>
                  <Input placeholder="Nombre del Titular" className="h-14 bg-white" required />
                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddingPayment(false)} className="flex-1 rounded-2xl h-14">Cancelar</Button>
                    <Button type="submit" className="flex-1 rounded-2xl h-14 bg-brand-night hover:bg-black text-[11px] font-black uppercase tracking-widest">Guardar Cuenta</Button>
                  </div>
                </form>
              </Card>
            )}
          </div>
        </section>

        {/* Addresses */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Direcciones Guardadas</h3>
            <button className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-200 transition-colors">
              <Plus size={18} strokeWidth={2.5} />
            </button>
          </div>

          <div className="space-y-4">
            {addresses.map((address: any) => (
              <Card key={address.id} className="p-6 rounded-[2rem] border border-slate-100 shadow-sm bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow group">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mt-1">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-brand-night uppercase tracking-wider mb-1 flex items-center gap-3">
                      {address.title}
                      {address.is_default && (
                        <span className="bg-primary/10 text-primary text-[8px] px-2 py-0.5 rounded-full">PRINCIPAL</span>
                      )}
                    </h4>
                    <p className="text-xs font-medium text-slate-500 mb-1">{address.street}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{address.city}, {address.state} · C.P. {address.cp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <button 
                    onClick={() => handleDeleteAddress(address.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                  <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary">
                    Editar <ChevronRight size={14} className="ml-1" />
                  </Button>
                </div>
              </Card>
            ))}

            {isAddingAddress ? (
              <Card className="p-8 rounded-[2rem] border-2 border-dashed border-primary/20 bg-primary/5">
                <h4 className="text-xs font-black text-brand-night uppercase tracking-widest mb-6">Nueva Dirección</h4>
                <form onSubmit={handleAddAddress} className="space-y-4">
                  <Input 
                    placeholder="Título (e.g. Casa, Oficina)" 
                    value={newAddress.title}
                    onChange={(e) => setNewAddress({...newAddress, title: e.target.value})}
                    className="h-14 bg-white" 
                    required 
                  />
                  <Input 
                    placeholder="Calle y Número" 
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                    className="h-14 bg-white" 
                    required 
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      placeholder="Ciudad" 
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      className="h-14 bg-white" 
                      required 
                    />
                    <Input 
                      placeholder="Estado" 
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                      className="h-14 bg-white" 
                      required 
                    />
                  </div>
                  <Input 
                    placeholder="Código Postal" 
                    value={newAddress.cp}
                    onChange={(e) => setNewAddress({...newAddress, cp: e.target.value})}
                    className="h-14 bg-white" 
                    required 
                  />
                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddingAddress(false)} className="flex-1 rounded-2xl h-14">Cancelar</Button>
                    <Button type="submit" className="flex-1 rounded-2xl h-14 bg-brand-night hover:bg-black text-[11px] font-black uppercase tracking-widest">
                      {loading ? <Loader2 className="animate-spin" /> : 'Guardar Dirección'}
                    </Button>
                  </div>
                </form>
              </Card>
            ) : (
                <button 
                  onClick={() => setIsAddingAddress(true)}
                  className="w-full py-8 rounded-[2rem] border-2 border-dashed border-slate-100 text-slate-300 font-black uppercase text-[10px] tracking-widest hover:border-primary/20 hover:text-primary transition-all flex flex-col items-center gap-2"
                >
                  <Plus size={24} />
                  Agregar Dirección
                </button>
            )}
          </div>
        </section>

      </div>
      
      {/* Bottom Nav */}
      <BottomNav onLogout={handleLogout} />
    </main>
  );
}
