"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@i-mendly/shared/components/Button';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabase';
import { 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  CreditCard, 
  Briefcase, 
  User, 
  Trash2,
  Plus,
  ChevronDown,
  Image as ImageIcon,
  Upload,
  X,
  Star,
  Clock
} from 'lucide-react';

const JUAREZ_ZONES = [
  "Sendero", "Centro", "Las Torres", "Ejercito", "Campos Eliseos", 
  "Cuatro Siglos", "Las Misiones", "Aeropuerto", "Zaragoza"
];

const CATEGORIES = [
  "Electricidad", "Plomería", "Limpieza", "Climas/AC", "Pintura", 
  "Carpintería", "Jardinería", "Cerrajería", "Fumigación", "Carwash", 
  "Remodelación", "Moda y costura", "Pisos", "Herrería"
];

const COMMERCIAL_BANKS = [
  "BBVA Bancomer", "Banamex", "Santander", "Banorte", "HSBC", 
  "Scotiabank", "Inbursa", "Spin by oxxo", "NU", "Revolut", "Otro"
];

export default function ProviderEditForm({ params }: { params: any }) {
  // Access params.id safely if it's a Promise (Next.js 15) or plain object (Next.js 13/14)
  const resolvedParams: any = (React as any).use ? (React as any).use(params) : params;
  const currentId = resolvedParams?.id || 'new';
  const isNew = currentId === 'new';
  const router = useRouter();

  const [provider, setProvider] = useState({
    name: '',
    categories: [] as string[],
    status: 'Pendiente',
    about: '',
    experience: 0,
    zones: [] as string[],
    coverageRadius: 10,
    clabe: '',
    bank: '',
    secondaryClabe: '',
    secondaryBank: '',
    avatarUrl: '',
    isTop: false,
    services: [] as any[],
    portfolio: [] as any[],
    availability: [] as any[],
    isVerified: false,
    reviews: [] as any[]
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isZonesOpen, setIsZonesOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!isNew);

  useEffect(() => {
    if (!isNew && currentId) {
      fetchProviderData();
    }
  }, [currentId, isNew]);

  const fetchProviderData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch provider details + Name from users table
      const { data, error } = await supabase
        .from('providers')
        .select(`
          *,
          users ( full_name, avatar_url ),
          provider_availability ( * ),
          reviews ( *, users ( full_name ) )
        `)
        .eq('id', currentId)
        .single();

      if (error) throw error;

      if (data) {
        const u = Array.isArray(data.users) ? data.users[0] : data.users;
        
        // 2. Fetch services
        const { data: services, error: sError } = await supabase
          .from('provider_services')
          .select('*')
          .eq('provider_id', currentId);
          
        if (sError) console.error('Error fetching services:', sError);
          
        // 3. Fetch portfolio
        const { data: portfolio, error: pError } = await supabase
          .from('provider_portfolio')
          .select('*')
          .eq('provider_id', currentId)
          .order('created_at', { ascending: false });

        if (pError) console.error('Error fetching portfolio:', pError);

        setProvider({
          name: u?.full_name || '',
          categories: data.categories || (data.category ? [data.category] : []),
          status: data.account_status === 'active' ? 'Activo' : (data.account_status === 'pending' ? 'Pendiente' : 'Suspendido'),
          about: data.about || '',
          experience: data.experience_years || 0,
          zones: data.zones || [],
          coverageRadius: data.coverage_radius_km || 10,
          clabe: data.clabe_account || '',
          bank: data.bank_name || '',
          secondaryClabe: data.secondary_clabe || '',
          secondaryBank: data.secondary_bank_name || '',
          avatarUrl: u?.avatar_url || '',
          isVerified: data.is_verified || false,
          isTop: (data as any).is_top || false,
          services: (services || []).map(s => ({
            id: s.id,
            name: s.name,
            price: s.price,
            isRange: s.is_range,
            maxPrice: s.max_price,
            unit: s.unit,
            category: s.category
          })),
          portfolio: (portfolio || []).map(p => ({
            id: p.id,
            imageUrl: p.image_url,
            title: p.title || '',
            description: p.description || ''
          })),
          availability: (data.provider_availability || []).sort((a: any, b: any) => a.day_of_week - b.day_of_week),
          reviews: (data.reviews || []).map((r: any) => ({
            id: r.id,
            rating: r.rating,
            comment: r.comment || '',
            user: r.users?.full_name || 'Cliente',
            date: new Date(r.created_at).toLocaleDateString()
          }))
        });
        
        if (u?.avatar_url) {
          setImagePreview(u.avatar_url);
        }
      }
    } catch (err: any) {
      console.error('Error fetching provider:', err.message);
      alert('Error al cargar datos del proveedor.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActivation = () => {
    const newStatus = provider.status === 'Activo' ? 'Suspendido' : 'Activo';
    setProvider({ ...provider, status: newStatus });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let providerId = currentId;

      // Ensure we have a valid UUID for the database. If it's 'new', generate one.
      if (isNew || providerId === 'new' || !providerId) {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
          providerId = crypto.randomUUID();
        } else {
          // Robust fallback for UUID v4
          providerId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        }
      }

      if (!providerId || providerId === 'new') {
        throw new Error('El sistema no pudo asignar un identificador válido (ID: ' + providerId + '). Por favor intenta de nuevo.');
      }

      // Convert status from Spanish UI to database enum
      const dbStatus = provider.status === 'Activo' 
        ? 'active' 
        : (provider.status === 'Pendiente' ? 'pending' : 'suspended');

      // Handle Image Upload if new file selected
      let finalAvatarUrl = provider.avatarUrl;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${providerId}-${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, imageFile, { upsert: true });
          
        if (uploadError) {
          console.error('Error uploading to Supabase Storage:', uploadError.message);
          let errorMsg = 'No se pudo guardar la imagen. ';
          if (uploadError.message.includes('Bucket not found')) {
            errorMsg += 'El contenedor "avatars" no existe en Supabase. Por favor ejecuta el script de migración SQL proporcionado.';
          } else {
            errorMsg += uploadError.message;
          }
          alert(errorMsg);
          setIsSaving(false);
          return; // Stop saving if image fails? Or should we continue? 
          // User said "it doesn't save", so if they want the image, we should probably stop.
        } else {
          const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
          finalAvatarUrl = data.publicUrl;
        }
      }

      // 1. First, satisfy the foreign key constraint by ensuring a record exists in public.users
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id: providerId,
          full_name: provider.name,
          avatar_url: finalAvatarUrl,
          role: 'provider',
          updated_at: new Date().toISOString()
        });

      if (userError) throw userError;

      // 2. Now upsert the provider details
      const { error: providerError } = await supabase
        .from('providers')
        .upsert({
          id: providerId,
          categories: provider.categories,
          category: provider.categories.length > 0 ? provider.categories[0] : 'General',
          experience_years: provider.experience,
          about: provider.about,
          account_status: dbStatus,
          zones: provider.zones,
          coverage_radius_km: provider.coverageRadius,
          clabe_account: provider.clabe,
          bank_name: provider.bank,
          secondary_clabe: provider.secondaryClabe,
          secondary_bank_name: provider.secondaryBank,
          is_verified: provider.isVerified,
          is_top: provider.isTop,
          updated_at: new Date().toISOString()
        });

      if (providerError) throw providerError;

      // Handle Services (Delta approach: Delete existing and re-insert)
      if (!isNew) {
        await supabase.from('provider_services').delete().eq('provider_id', providerId);
      }

      if (provider.services.length > 0) {
        const servicesData = provider.services.map(s => ({
          provider_id: providerId,
          name: s.name,
          price: s.price,
          is_range: s.isRange,
          max_price: s.maxPrice,
          unit: s.unit,
          category: s.category || (provider.categories.length > 0 ? provider.categories[0] : 'General')
        }));

        const { error: servicesError } = await supabase
          .from('provider_services')
          .insert(servicesData);

        if (servicesError) throw servicesError;
      }

      // Handle Portfolio (Delta approach)
      if (!isNew) {
        await supabase.from('provider_portfolio').delete().eq('provider_id', providerId);
      }
      
      if (provider.portfolio.length > 0) {
        const portfolioData = provider.portfolio.map(p => ({
          provider_id: providerId,
          image_url: p.imageUrl,
          title: p.title,
          description: p.description
        }));
        
        const { error: pError } = await supabase.from('provider_portfolio').insert(portfolioData);
        if (pError) throw pError;
      }

      // Handle Availability (Delta approach)
      if (!isNew) {
        await supabase.from('provider_availability').delete().eq('provider_id', providerId);
      }
      
      if (provider.availability.length > 0) {
        const availData = provider.availability.map(a => ({
          provider_id: providerId,
          day_of_week: a.day_of_week,
          start_time: a.start_time,
          end_time: a.end_time,
          is_active: a.is_active
        }));
        
        await supabase.from('provider_availability').insert(availData);
      }

      // Handle Reviews (Only for manual additions if any)
      // Note: Typically reviews are client-side, but if we add them here:
      if (provider.reviews.some(r => r.isNew)) {
         const newReviews = provider.reviews.filter(r => r.isNew).map(r => ({
            provider_id: providerId,
            rating: r.rating,
            comment: r.comment,
            created_at: new Date().toISOString()
         }));
         await supabase.from('reviews').insert(newReviews);
      }

      alert('Proveedor guardado exitosamente en Supabase.');
      router.push('/admin/professionals');

    } catch (error: any) {
      console.error('Error Guardando en Supabase:', error.message || error);
      alert(`Error al guardar el proveedor: ${error.message || 'Verifica las llaves y el esquema.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const addService = (category?: string) => {
    setProvider({
      ...provider,
      services: [
        ...provider.services, 
        { 
          id: 'new-' + Date.now() + Math.random(), 
          name: '', 
          price: 0, 
          isRange: false, 
          maxPrice: 0, 
          unit: 'Servicio',
          category: category || (provider.categories.length > 0 ? provider.categories[0] : 'General')
        }
      ]
    });
  };

  const removeService = (id: number) => {
    setProvider({
      ...provider,
      services: provider.services.filter(s => s.id !== id)
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${currentId}-portfolio-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        try {
          const { error } = await supabase.storage
            .from('portfolio')
            .upload(fileName, file);
            
          if (error) throw error;
          
          const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(fileName);
          
          setProvider(prev => ({
            ...prev,
            portfolio: [...prev.portfolio, { id: Date.now() + Math.random(), imageUrl: publicUrl, title: '', description: '' }]
          }));
        } catch (err: any) {
          alert('Error subiendo imagen al portafolio: ' + err.message);
        }
      }
    }
  };

  const removePortfolioItem = (id: any) => {
    setProvider({
      ...provider,
      portfolio: provider.portfolio.filter(p => p.id !== id)
    });
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-silver font-urbanist flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-soft font-bold animate-pulse uppercase tracking-widest text-xs">Cargando datos del profesional...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-silver font-urbanist p-8 max-w-5xl mx-auto">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/professionals">
            <button className="w-10 h-10 rounded-pill bg-white flex items-center justify-center text-black-rich shadow-sm hover:bg-silver-light transition-all">
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-[600] tracking-tight text-black-rich">
              {isNew ? 'Nuevo Proveedor' : `Editar Perfil: ${provider.name}`}
            </h1>
            <p className="text-sm font-medium text-gray-soft mt-1">
              {isNew ? 'Registra manualmente un nuevo profesional en la plataforma.' : (
                <span className="flex items-center gap-2">
                  ID: {currentId} • 
                  <Badge variant={provider.status === 'Activo' ? 'success' : provider.status === 'Pendiente' ? 'warning' : 'error'}>
                    {provider.status}
                  </Badge>
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isNew && (
            <Button 
              onClick={toggleActivation}
              variant={provider.status === 'Activo' ? 'secondary' : 'primary'}
              className={`gap-2 ${provider.status === 'Pendiente' ? 'bg-amber-500 hover:bg-amber-600 border-none' : ''}`}
            >
              {provider.status === 'Activo' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
              {provider.status === 'Activo' ? 'Suspender Proveedor' : 'Activar Proveedor'}
            </Button>
          )}
          <Button onClick={handleSave} variant="primary" className="gap-2" disabled={isSaving}>
            <Save size={16} /> {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: General Info */}
        <div className="md:col-span-2 space-y-6">
          <Card variant="default" className="p-8">
            <h2 className="text-xl font-[600] mb-6 flex items-center gap-2"><User size={20} className="text-primary"/> Información General</h2>
            
            <div className="flex gap-8 mb-8">
              <div className="flex flex-col items-center gap-4 relative">
                <Avatar src={imagePreview || provider.avatarUrl} name={provider.name || 'Nuevo'} size="xl" className="w-24 h-24 text-2xl" />
                <label className="text-xs font-[600] text-primary hover:text-primary/70 cursor-pointer bg-primary/10 px-4 py-2 rounded-lg transition-colors inline-block text-center w-full">
                  Cambiar Foto
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <label className="text-xs font-[600] text-gray-soft uppercase tracking-wider mb-1 block">Nombre Completo / Empresa</label>
                  <input type="text" value={provider.name} onChange={e => setProvider({...provider, name: e.target.value})} className="w-full bg-silver-light/30 border border-black/5 rounded-md p-3 text-sm font-[500] outline-none focus:border-primary/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-[600] text-gray-soft uppercase tracking-wider mb-1 block">Categorías de Especialidad</label>
                    <div className="flex flex-wrap gap-2 mb-4 p-3 bg-silver-light/20 rounded-xl border border-black/5 min-h-[60px]">
                      {provider.categories.length === 0 && (
                        <p className="text-xs text-gray-soft/50 italic py-2">No has seleccionado categorías aún.</p>
                      )}
                      {provider.categories.map(cat => (
                        <Badge key={cat} variant="silver" className="flex items-center gap-1.5 px-3 py-1.5 border border-black/5 bg-white">
                          {cat}
                          <button onClick={() => setProvider({...provider, categories: provider.categories.filter(c => c !== cat)})} className="hover:text-im-error transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <select 
                      onChange={e => {
                        const val = e.target.value;
                        if (val !== 'Selecciona...' && !provider.categories.includes(val)) {
                          setProvider({...provider, categories: [...provider.categories, val]});
                        }
                      }}
                      className="w-full bg-silver-light/30 border border-black/5 rounded-md p-3 text-sm font-[500] outline-none focus:border-primary/50"
                    >
                      <option>Selecciona para agregar...</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat} disabled={provider.categories.includes(cat)}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-black/5 space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative inline-flex items-center">
                      <input 
                        type="checkbox" 
                        checked={provider.isVerified} 
                        onChange={e => setProvider({...provider, isVerified: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-brand-night uppercase tracking-tighter group-hover:text-primary transition-colors">Profesional Verificado</span>
                      <span className="text-[10px] text-gray-soft font-bold uppercase tracking-widest">Confirma que los documentos y la identidad han sido validados</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative inline-flex items-center">
                      <input 
                        type="checkbox" 
                        checked={provider.isTop} 
                        onChange={e => setProvider({...provider, isTop: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-brand-night uppercase tracking-tighter group-hover:text-amber-600 transition-colors">Insignia I Mendly (Proveedor Top)</span>
                      <span className="text-[10px] text-gray-soft font-bold uppercase tracking-widest">Activa la medalla de distinción premium para este profesional</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-[600] text-gray-soft uppercase tracking-wider mb-1 block">Acerca del Profesional (Bio)</label>
              <textarea rows={4} value={provider.about} onChange={e => setProvider({...provider, about: e.target.value})} className="w-full bg-silver-light/30 border border-black/5 rounded-md p-3 text-sm font-[500] outline-none focus:border-primary/50 resize-none" />
            </div>
          </Card>

          {/* Dynamic Services Editor */}
          <Card variant="default" className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-[600] flex items-center gap-2"><Briefcase size={20} className="text-primary"/> Catálogo de Servicios</h2>
              <Button size="sm" variant="secondary" className="gap-2 text-xs py-1" onClick={() => addService()}><Plus size={14}/> Agregar Servicio</Button>
            </div>

            <div className="space-y-8">
              {provider.services.length === 0 && (
                <p className="text-sm text-gray-soft text-center py-8 bg-silver-light/20 rounded-md border border-dashed border-black/10">No hay servicios registrados.</p>
              )}
              
              {/* Grouped Services */}
              {(provider.categories.length > 0 ? provider.categories : ['Sin Categoría']).map(cat => (
                <div key={cat} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-gray-soft uppercase tracking-[0.2em] border-l-2 border-primary pl-3 py-1 bg-primary/5 inline-block rounded-r-md">
                      {cat}
                    </h3>
                    <button 
                      onClick={() => addService(cat)}
                      className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Plus size={12} />
                      Agregar {cat}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {provider.services.filter(s => s.category === cat || (!s.category && cat === provider.categories[0]) || (!s.category && provider.categories.length === 0 && cat === 'Sin Categoría')).map((service) => {
                      const globalIndex = provider.services.findIndex(s => s.id === service.id);
                      return (
                        <div key={service.id} className="flex flex-col gap-3 bg-silver-light/20 p-4 rounded-xl border border-black/5 group transition-all hover:bg-silver-light/40">
                          <div className="flex items-center gap-3">
                            <input 
                              type="text" 
                              value={service.name} 
                              onChange={e => {
                                const newServices = [...provider.services];
                                newServices[globalIndex].name = e.target.value;
                                setProvider({...provider, services: newServices});
                              }}
                              className="flex-1 bg-white border border-black/5 rounded md p-2 text-sm font-[500] outline-none focus:border-primary/30 transition-colors" 
                              placeholder="Nombre del servicio"
                            />
                            
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-[600] text-gray-soft uppercase tracking-wider">Cat:</span>
                              <select 
                                value={service.category || cat} 
                                onChange={e => {
                                  const newServices = [...provider.services];
                                  newServices[globalIndex].category = e.target.value;
                                  setProvider({...provider, services: newServices});
                                }}
                                className="bg-white border border-black/5 rounded-md p-1.5 text-xs font-[600] outline-none focus:border-primary/50 text-black-rich cursor-pointer"
                              >
                                {provider.categories.map(c => <option key={c} value={c}>{c}</option>)}
                                {provider.categories.length === 0 && <option value="General">General</option>}
                              </select>
                            </div>

                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-soft text-sm">$</span>
                              <input 
                                type="number" 
                                value={service.price} 
                                onChange={e => {
                                  const newServices = [...provider.services];
                                  newServices[globalIndex].price = parseFloat(e.target.value) || 0;
                                  setProvider({...provider, services: newServices});
                                }}
                                className="w-24 bg-white border border-black/5 rounded md p-2 pl-6 text-sm font-[500] outline-none focus:border-primary/30 transition-colors" 
                              />
                            </div>
                            <button onClick={() => removeService(service.id)} className="p-2 text-gray-soft hover:text-im-error hover:bg-im-error/10 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                              <Trash2 size={16} />
                            </button>
                          </div>
                          
                          {/* Rango de precios y Unidades */}
                          <div className="flex items-center gap-4 mt-1 border-t border-black/5 pt-3">
                            <label className="flex items-center gap-2 text-xs font-[600] text-gray-soft cursor-pointer hover:text-primary transition-colors">
                              <input 
                                type="checkbox" 
                                checked={service.isRange || false} 
                                onChange={e => {
                                  const newServices = [...provider.services];
                                  newServices[globalIndex].isRange = e.target.checked;
                                  setProvider({...provider, services: newServices});
                                }}
                                className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary accent-emerald-500 cursor-pointer" 
                              />
                              Activar Rango
                            </label>

                            {service.isRange && (
                              <div className="relative flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                <span className="text-xs font-[600] text-gray-soft uppercase tracking-wider">A</span>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-soft text-sm">$</span>
                                  <input 
                                    type="number" 
                                    value={service.maxPrice || 0} 
                                    onChange={e => {
                                      const newServices = [...provider.services];
                                      newServices[globalIndex].maxPrice = parseFloat(e.target.value) || 0;
                                      setProvider({...provider, services: newServices});
                                    }}
                                    className="w-24 bg-white border border-black/5 rounded md p-2 pl-6 text-sm font-[500] outline-none focus:border-primary/30 transition-colors" 
                                    placeholder="Max"
                                  />
                                </div>
                              </div>
                            )}
                            
                            <div className="ml-auto flex items-center gap-2">
                              <span className="text-xs font-[600] text-gray-soft uppercase tracking-wider">Por:</span>
                              <select 
                                value={service.unit || 'Servicio'} 
                                onChange={e => {
                                  const newServices = [...provider.services];
                                  newServices[globalIndex].unit = e.target.value;
                                  setProvider({...provider, services: newServices});
                                }}
                                className="bg-white border border-black/5 rounded-md p-1.5 text-xs font-[600] outline-none focus:border-primary/50 text-black-rich cursor-pointer"
                              >
                                <option value="Servicio">Servicio</option>
                                <option value="M2">Metros Cuadrados (m²)</option>
                                <option value="M lineal">Metro Lineal</option>
                                <option value="PZ">Pieza (pz)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Portfolio Showcase */}
          <Card variant="default" className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-[600] flex items-center gap-2">
                <ImageIcon size={20} className="text-primary"/> Portafolio de Trabajos
              </h2>
              <label className="cursor-pointer">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handlePortfolioUpload}
                />
                <div className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Upload size={14}/> Subir Imágenes
                </div>
              </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {provider.portfolio.length === 0 && (
                <div className="col-span-full py-16 border-2 border-dashed border-silver-light rounded-[2.5rem] flex flex-col items-center justify-center text-gray-soft bg-silver-light/10">
                  <ImageIcon size={48} className="opacity-10 mb-4" />
                  <p className="text-sm font-semibold tracking-wide uppercase opacity-40">No hay trabajos en el portafolio aún</p>
                </div>
              )}
              {provider.portfolio.map((item: any) => (
                <div key={item.id} className="relative aspect-square rounded-[2rem] overflow-hidden group border border-black/5 shadow-sm bg-white">
                  <img src={item.imageUrl} alt="Portfolio" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-brand-night/60 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                    <button 
                      onClick={() => removePortfolioItem(item.id)}
                      className="absolute top-4 right-4 w-8 h-8 bg-im-error/90 text-white rounded-full flex items-center justify-center shadow-lg transform translate-y-[-10px] group-hover:translate-y-0 transition-all duration-300"
                    >
                      <Trash2 size={14} />
                    </button>
                    
                    <ImageIcon size={24} className="text-white/40 mb-3 transform scale-75 group-hover:scale-100 transition-transform duration-500" />
                    
                    <input 
                       type="text" 
                       placeholder="Título del trabajo..." 
                       value={item.title}
                       onChange={e => {
                         const newPortfolio = [...provider.portfolio];
                         const idx = newPortfolio.findIndex(p => p.id === item.id);
                         newPortfolio[idx].title = e.target.value;
                         setProvider({...provider, portfolio: newPortfolio});
                       }}
                       className="w-full bg-transparent text-white text-xs font-black placeholder:text-white/40 outline-none border-b border-white/20 pb-1 text-center"
                    />
                    <textarea 
                       placeholder="Descripción breve..." 
                       value={item.description}
                       onChange={e => {
                         const newPortfolio = [...provider.portfolio];
                         const idx = newPortfolio.findIndex(p => p.id === item.id);
                         newPortfolio[idx].description = e.target.value;
                         setProvider({...provider, portfolio: newPortfolio});
                       }}
                       className="w-full bg-transparent text-white text-[10px] font-medium placeholder:text-white/30 outline-none border-none mt-2 resize-none text-center h-12"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Schedule & Availability */}
          <Card variant="default" className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-[600] flex items-center gap-2"><Clock size={20} className="text-primary"/> Horarios y Disponibilidad</h2>
              <div className="text-[10px] font-bold text-gray-soft uppercase tracking-widest bg-silver-light/30 px-3 py-1.5 rounded-lg border border-black/5">Configuración Semanal</div>
            </div>

            <div className="space-y-3">
              {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((dayName, idx) => {
                const dayIdx = (idx + 1) % 7; // Convert to 0 (Sun) - 6 (Sat)
                const dayData = provider.availability.find(a => a.day_of_week === dayIdx) || { day_of_week: dayIdx, start_time: '09:00', end_time: '18:00', is_active: false };
                
                return (
                  <div key={dayName} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${dayData.is_active ? 'bg-white border-primary/20 shadow-sm' : 'bg-silver-light/10 border-transparent opacity-60'}`}>
                    <div className="w-24 text-sm font-black text-brand-night uppercase tracking-tighter">{dayName}</div>
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={dayData.is_active} 
                        onChange={(e) => {
                           const newAvail = [...provider.availability];
                           const existingIdx = newAvail.findIndex(a => a.day_of_week === dayIdx);
                           if (existingIdx >= 0) {
                             newAvail[existingIdx].is_active = e.target.checked;
                           } else {
                             newAvail.push({ ...dayData, is_active: e.target.checked });
                           }
                           setProvider({...provider, availability: newAvail});
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>

                    {dayData.is_active && (
                      <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                         <input 
                           type="time" 
                           value={dayData.start_time.substring(0,5)} 
                           onChange={(e) => {
                             const newAvail = [...provider.availability];
                             const idx = newAvail.findIndex(a => a.day_of_week === dayIdx);
                             newAvail[idx].start_time = e.target.value;
                             setProvider({...provider, availability: newAvail});
                           }}
                           className="bg-silver-light/30 border border-black/5 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:border-primary/50"
                         />
                         <span className="text-[10px] font-black text-gray-soft">A</span>
                         <input 
                           type="time" 
                           value={dayData.end_time.substring(0,5)} 
                           onChange={(e) => {
                             const newAvail = [...provider.availability];
                             const idx = newAvail.findIndex(a => a.day_of_week === dayIdx);
                             newAvail[idx].end_time = e.target.value;
                             setProvider({...provider, availability: newAvail});
                           }}
                           className="bg-silver-light/30 border border-black/5 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:border-primary/50"
                         />
                      </div>
                    )}
                    {!dayData.is_active && <span className="text-[10px] font-bold text-gray-soft/50 uppercase italic">No laborable</span>}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Client Reviews */}
          <Card variant="default" className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-[600] flex items-center gap-2"><Star size={20} className="text-primary"/> Reseñas de Clientes</h2>
              <Button 
                 size="sm" 
                 variant="secondary" 
                 className="gap-2 text-[10px] font-black tracking-widest uppercase"
                 onClick={() => {
                    setProvider({
                      ...provider,
                      reviews: [
                        { id: Date.now(), rating: 5, comment: '', user: 'Cliente Nuevo', date: 'Recién', isNew: true },
                        ...provider.reviews
                      ]
                    });
                 }}
              >
                <Plus size={14}/> Agregar Reseña
              </Button>
            </div>

            <div className="space-y-4">
              {provider.reviews.length === 0 && (
                <p className="text-sm text-gray-soft text-center py-8 bg-silver-light/20 rounded-md border border-dashed border-black/10">No hay reseñas para mostrar.</p>
              )}
              {provider.reviews.map((review, idx) => (
                <div key={review.id} className="p-5 rounded-2xl border border-black/5 bg-white shadow-sm flex flex-col gap-3 group relative">
                  <button 
                     onClick={() => setProvider({...provider, reviews: provider.reviews.filter(r => r.id !== review.id)})}
                     className="absolute top-4 right-4 text-gray-soft hover:text-im-error opacity-0 group-hover:opacity-100 transition-all font-bold"
                  >
                     <Trash2 size={14} />
                  </button>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <input 
                          type="text" 
                          value={review.user}
                          readOnly={!review.isNew}
                          onChange={(e) => {
                             const newReviews = [...provider.reviews];
                             newReviews[idx].user = e.target.value;
                             setProvider({...provider, reviews: newReviews});
                          }}
                          className={`text-xs font-black uppercase tracking-widest outline-none ${review.isNew ? 'border-b border-primary/30' : 'bg-transparent border-none'}`} 
                       />
                       <span className="text-[10px] text-gray-soft/50 font-bold">{review.date}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} onClick={() => {
                           const newReviews = [...provider.reviews];
                           newReviews[idx].rating = s;
                           setProvider({...provider, reviews: newReviews});
                        }}>
                          <Star size={12} className={s <= review.rating ? 'text-amber-400' : 'text-slate-200'} fill={s <= review.rating ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <textarea 
                     placeholder="Escribe la reseña aquí..."
                     value={review.comment}
                     onChange={(e) => {
                        const newReviews = [...provider.reviews];
                        newReviews[idx].comment = e.target.value;
                        setProvider({...provider, reviews: newReviews});
                     }}
                     className="w-full bg-silver-light/20 border border-black/5 rounded-xl p-3 text-sm font-medium outline-none focus:border-primary/30 resize-none h-20"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Operative & Financial */}
        <div className="space-y-6">
          {/* Geolocation & Zones */}
          <Card variant="default" className="p-6">
            <h2 className="text-lg font-[600] mb-5 flex items-center gap-2"><MapPin size={18} className="text-primary"/> Operaciones</h2>
            <div className="space-y-4">
              <div className="relative">
                <label className="text-xs font-[600] text-gray-soft uppercase tracking-wider mb-1 block">Zonas de Cobertura</label>
                <div 
                  onClick={() => setIsZonesOpen(!isZonesOpen)}
                  className="w-full bg-silver-light/30 border border-black/5 rounded-md p-3 text-sm font-[500] cursor-pointer flex justify-between items-center outline-none focus:border-primary/50"
                >
                  <span className="truncate pr-4">{provider.zones.length > 0 ? provider.zones.join(', ') : 'Seleccionar Zonas...'}</span>
                  <ChevronDown size={16} className={`transform transition-transform ${isZonesOpen ? 'rotate-180' : ''}`} />
                </div>
                {isZonesOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-black/10 rounded-md shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-50 p-2 max-h-60 overflow-y-auto">
                    {JUAREZ_ZONES.map(zone => (
                      <label key={zone} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-md cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={provider.zones.includes(zone)} 
                          onChange={(e) => {
                             if (e.target.checked) {
                               setProvider({...provider, zones: [...provider.zones, zone]});
                             } else {
                               setProvider({...provider, zones: provider.zones.filter((z: string) => z !== zone)});
                             }
                          }}
                          className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary accent-emerald-500"
                        />
                        <span className="text-sm font-[600] text-black-rich">{zone}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4 bg-silver-light/30 rounded-md border border-black/5 mt-2">
                <p className="text-xs font-[600] text-black-rich mb-2">Rango de Cobertura (Distancia)</p>
                <select 
                  value={provider.coverageRadius} 
                  onChange={e => setProvider({...provider, coverageRadius: parseInt(e.target.value)})}
                  className="w-full bg-white border border-black/5 rounded p-3 text-sm font-[500] outline-none focus:border-primary/50"
                >
                  <option value={5}>5 KM</option>
                  <option value={10}>10 KM</option>
                  <option value={20}>20 KM</option>
                  <option value={50}>50 KM</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Financials / CLABE */}
          <Card variant="default" className="p-6">
            <h2 className="text-lg font-[600] mb-5 flex items-center gap-2"><CreditCard size={18} className="text-primary"/> Datos Fiscales y Pagos</h2>
            <p className="text-xs text-gray-soft mb-4 font-medium leading-relaxed">
              Esta información se utiliza para la dispersión de fondos del escrow hacia el proveedor (Stripe Connect / Transferencia).
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-[600] text-gray-soft uppercase tracking-wider mb-1 block">Banco Principal (Opcional)</label>
                  <select value={provider.bank} onChange={e => setProvider({...provider, bank: e.target.value})} className="w-full bg-white border border-black/5 rounded-md p-3 text-sm font-[500] outline-none focus:border-primary/50">
                    <option value="">Selecciona Banco...</option>
                    {COMMERCIAL_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-[600] text-gray-soft uppercase tracking-wider mb-1 block">Cuenta CLABE Principal</label>
                  <input type="text" value={provider.clabe} onChange={e => setProvider({...provider, clabe: e.target.value})} maxLength={18} placeholder="000..." className="w-full bg-white border border-black/5 rounded-md p-3 text-sm font-[600] tracking-widest outline-none focus:border-primary/50 font-mono" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-black/5">
                <div>
                  <label className="text-xs font-[600] text-gray-soft uppercase tracking-wider mb-1 block">Banco Secundario (Opcional)</label>
                  <select value={provider.secondaryBank} onChange={e => setProvider({...provider, secondaryBank: e.target.value})} className="w-full bg-white border border-black/5 rounded-md p-3 text-sm font-[500] outline-none focus:border-primary/50">
                    <option value="">Selecciona Banco...</option>
                    {COMMERCIAL_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-[600] text-gray-soft uppercase tracking-wider mb-1 block">Cuenta CLABE Secundaria</label>
                  <input type="text" value={provider.secondaryClabe} onChange={e => setProvider({...provider, secondaryClabe: e.target.value})} maxLength={18} placeholder="000..." className="w-full bg-white border border-black/5 rounded-md p-3 text-sm font-[600] tracking-widest outline-none focus:border-primary/50 font-mono" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
