"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Star,
  Clock,
  Camera,
  BadgeCheck
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

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

/* ── Presentación ───────────────────────────────────────────── */

type Section = 'general' | 'servicios' | 'portafolio' | 'horarios' | 'resenas' | 'operacion';

const SECTIONS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'general', label: 'General', icon: <User size={14} /> },
  { id: 'servicios', label: 'Servicios', icon: <Briefcase size={14} /> },
  { id: 'portafolio', label: 'Portafolio', icon: <ImageIcon size={14} /> },
  { id: 'horarios', label: 'Horarios', icon: <Clock size={14} /> },
  { id: 'resenas', label: 'Reseñas', icon: <Star size={14} /> },
  { id: 'operacion', label: 'Operación y pagos', icon: <CreditCard size={14} /> },
];

const STATUS_PILL: Record<string, string> = {
  Activo: 'bg-mint-light text-mint-deep',
  Pendiente: 'bg-primary-light text-primary-deep',
  Suspendido: 'bg-rose/20 text-error',
};

const EYEBROW = 'block text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-2 ml-1';
/** Campo base sin tamaño ni color: cada uso añade alto, ancho, peso y color explícitos. */
const FIELD = 'rounded-[1.25rem] border-0 placeholder:text-faint placeholder:font-medium outline-none focus:ring-2 focus:ring-lavender/60';
const INPUT = `${FIELD} w-full h-12 px-4 bg-sand text-[14px] font-semibold text-ink`;
const SELECT = `${INPUT} appearance-none cursor-pointer pr-10`;
const PRICE_INPUT = `${FIELD} w-full h-12 pl-8 pr-4 bg-sand text-[15px] font-bold text-primary-deep tabular-nums`;
const CLABE_INPUT = `${FIELD} w-full h-12 px-4 bg-sand text-[14px] font-bold text-ink tracking-[0.12em] tabular-nums`;
const TEXTAREA_BASE = 'w-full px-4 py-3.5 rounded-[1.25rem] border-0 text-[14px] font-medium text-ink placeholder:text-faint outline-none focus:ring-2 focus:ring-lavender/60 resize-none';
const TEXTAREA = `${TEXTAREA_BASE} bg-sand`;
const SWITCH_BASE = "relative shrink-0 rounded-full transition-colors duration-300 peer-checked:bg-ink after:content-[''] after:absolute after:top-1 after:left-1 after:rounded-full after:bg-cream after:shadow-sm after:transition-all after:duration-300";
const SWITCH = `${SWITCH_BASE} w-12 h-7 after:w-5 after:h-5 peer-checked:after:translate-x-5`;
const SWITCH_SM = `${SWITCH_BASE} w-10 h-6 after:w-4 after:h-4 peer-checked:after:translate-x-4`;

/** Retrato grande con esquinas suaves; iniciales sobre arcilla profunda si no hay foto. */
function Portrait({ name, src, className = '' }: { name: string; src?: string; className?: string }) {
  const initials = name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'IM';
  return (
    <div className={`shrink-0 rounded-[1.75rem] overflow-hidden bg-clay-deep text-white flex items-center justify-center font-semibold ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

function SectionCard({ eyebrow, title, action, children, className = '' }: { eyebrow: string; title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-cream rounded-[2.25rem] p-6 md:p-8 v2-shadow-soft ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-1">{eyebrow}</p>
          <h2 className="text-[22px] font-semibold tracking-tight text-ink">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function EmptyState({ icon, title, text, action }: { icon: React.ReactNode; title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="v2-rise py-10 flex flex-col items-center text-center">
      <span className="w-16 h-16 rounded-[1.25rem] bg-primary-light text-primary-deep flex items-center justify-center mb-5">{icon}</span>
      <h3 className="text-[18px] font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-2 text-[13.5px] font-medium text-muted max-w-xs">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

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
  // Solo presentación: sección visible en las tabs
  const [activeSection, setActiveSection] = useState<Section>('general');

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
      <main className="min-h-screen bg-linen flex">
        <AdminSidebar />
        <div className="flex-1 min-w-0">
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-14">
            <div className="h-10 w-48 rounded-full v2-shimmer" />
            <div className="mt-8 h-56 rounded-[2.25rem] v2-shimmer" />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2 h-96 rounded-[2.25rem] v2-shimmer" />
              <div className="h-96 rounded-[2.25rem] v2-shimmer" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linen flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-14 pb-32">
          {/* ── Cabecera editorial ── */}
          <header className="v3-blur-in">
            <Link href="/admin/professionals" className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-muted hover:text-ink transition-colors group mb-6">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver a profesionales
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep mb-2">{isNew ? 'Alta manual' : 'Expediente'}</p>
                <h1 className="text-[36px] md:text-[44px] font-semibold tracking-tight leading-[1.02] text-ink truncate">
                  {isNew ? 'Nuevo proveedor' : (provider.name || 'Editar perfil')}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] font-medium text-muted">
                  {isNew ? (
                    <span>Registra manualmente un nuevo profesional en la plataforma.</span>
                  ) : (
                    <>
                      <span className={`inline-flex items-center h-7 px-3 rounded-full text-[11px] font-semibold ${STATUS_PILL[provider.status] || 'bg-sand text-muted'}`}>{provider.status}</span>
                      {provider.isVerified && (
                        <span className="inline-flex items-center gap-1 h-7 px-3 rounded-full bg-mint-light text-mint-deep text-[11px] font-semibold"><BadgeCheck size={12} /> Verificado</span>
                      )}
                      <span className="text-faint tabular-nums truncate">ID {currentId}</span>
                    </>
                  )}
                </div>
              </div>
              <button onClick={handleSave} disabled={isSaving} className="shrink-0 h-14 px-7 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press disabled:opacity-60">
                <Save size={16} /> {isSaving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </header>

          {/* ── Perfil: avatar + identidad ── */}
          <section className="v3-blur-in mt-8 bg-cream rounded-[2.25rem] p-6 md:p-8 v2-shadow-soft" style={{ animationDelay: '120ms' }}>
            <div className="flex flex-col md:flex-row gap-7 md:gap-9">
              <div className="shrink-0 flex flex-col items-center gap-3">
                <div className="relative p-1.5 rounded-[2.1rem] bg-lavender-light">
                  <Portrait name={provider.name || 'Nuevo'} src={imagePreview || provider.avatarUrl} className="w-32 h-32 md:w-36 md:h-36 text-[36px]" />
                  <label className="absolute -bottom-2 left-1/2 -translate-x-1/2 glass rounded-full h-10 pl-3 pr-4 inline-flex items-center gap-2 text-[12px] font-bold text-ink cursor-pointer v2-press whitespace-nowrap">
                    <Camera size={14} /> Cambiar foto
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-5">
                <div>
                  <label className={EYEBROW}>Nombre completo / empresa</label>
                  <input type="text" value={provider.name} onChange={e => setProvider({...provider, name: e.target.value})} placeholder="Nombre del profesional" className={`${FIELD} w-full h-14 px-5 bg-sand text-[16px] font-semibold text-ink`} />
                </div>

                <div>
                  <label className={EYEBROW}>Categorías de especialidad</label>
                  <div className="flex flex-wrap gap-2 mb-3 min-h-[40px]">
                    {provider.categories.length === 0 && (
                      <p className="text-[13px] font-medium text-faint py-2 ml-1">No has seleccionado categorías aún.</p>
                    )}
                    {provider.categories.map(cat => (
                      <span key={cat} className="inline-flex items-center gap-2 h-10 pl-4 pr-2 rounded-full bg-lavender-light text-ink text-[13px] font-semibold">
                        {cat}
                        <button onClick={() => setProvider({...provider, categories: provider.categories.filter(c => c !== cat)})} aria-label={`Quitar ${cat}`} className="w-7 h-7 rounded-full bg-cream/70 text-muted hover:text-error flex items-center justify-center transition-colors v2-press">
                          <Trash2 size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <select
                      onChange={e => {
                        const val = e.target.value;
                        if (val !== 'Selecciona...' && !provider.categories.includes(val)) {
                          setProvider({...provider, categories: [...provider.categories, val]});
                        }
                      }}
                      className={SELECT}
                    >
                      <option>Selecciona para agregar...</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat} disabled={provider.categories.includes(cat)}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-faint" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <label className="flex items-center justify-between gap-4 p-4 rounded-[1.5rem] bg-sand cursor-pointer group">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-10 h-10 shrink-0 rounded-[0.9rem] bg-mint-light text-mint-deep flex items-center justify-center"><BadgeCheck size={18} /></span>
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-ink">Profesional verificado</p>
                        <p className="text-[11.5px] font-medium text-muted leading-snug">Documentos e identidad validados</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={provider.isVerified}
                      onChange={e => setProvider({...provider, isVerified: e.target.checked})}
                      className="sr-only peer"
                    />
                    <span className={`${SWITCH} bg-cream`} />
                  </label>

                  <label className="flex items-center justify-between gap-4 p-4 rounded-[1.5rem] bg-sand cursor-pointer group">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-10 h-10 shrink-0 rounded-[0.9rem] bg-primary-light text-primary-deep flex items-center justify-center"><Star size={18} /></span>
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-ink">Insignia I mendly (Top)</p>
                        <p className="text-[11.5px] font-medium text-muted leading-snug">Medalla de distinción premium</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={provider.isTop}
                      onChange={e => setProvider({...provider, isTop: e.target.checked})}
                      className="sr-only peer"
                    />
                    <span className={`${SWITCH} bg-cream`} />
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* ── Secciones como tabs subrayadas ── */}
          <div className="v3-blur-in mt-10 -mx-6 md:mx-0 px-6 md:px-0 flex gap-7 overflow-x-auto no-scrollbar border-b border-line" style={{ animationDelay: '220ms' }}>
            {SECTIONS.map(s => {
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSection(s.id)}
                  className={`relative shrink-0 pb-3 text-[14px] flex items-center gap-2 transition-colors duration-300 ${active ? 'font-semibold text-ink' : 'font-medium text-faint hover:text-muted'}`}
                >
                  <span className={active ? 'text-primary-deep' : 'text-faint'}>{s.icon}</span>
                  {s.label}
                  <span className={`absolute left-0 right-0 -bottom-px h-[3px] rounded-full bg-lavender transition-transform duration-500 origin-left ${active ? 'scale-x-100' : 'scale-x-0'}`} />
                </button>
              );
            })}
          </div>

          <div className="mt-8 space-y-6">
            {/* ── General ── */}
            {activeSection === 'general' && (
              <SectionCard eyebrow="Presentación" title="Acerca del profesional" className="v2-rise v2-d1">
                <div>
                  <label className={EYEBROW}>Bio pública</label>
                  <textarea rows={5} value={provider.about} onChange={e => setProvider({...provider, about: e.target.value})} placeholder="Experiencia, especialidades y lo que distingue a este profesional…" className={TEXTAREA} />
                </div>
              </SectionCard>
            )}

            {/* ── Servicios ── */}
            {activeSection === 'servicios' && (
              <SectionCard
                eyebrow="Catálogo"
                title="Catálogo de servicios"
                className="v2-rise v2-d1"
                action={
                  <button onClick={() => addService()} className="h-11 px-5 rounded-full bg-ink text-white text-[12.5px] font-bold flex items-center gap-2 v2-press"><Plus size={14} /> Agregar servicio</button>
                }
              >
                <div className="space-y-8">
                  {provider.services.length === 0 && (
                    <EmptyState
                      icon={<Briefcase size={26} />}
                      title="Sin servicios registrados"
                      text="Agrega los servicios que ofrece este profesional con su precio base o rango."
                      action={<button onClick={() => addService()} className="h-12 px-6 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press"><Plus size={15} /> Agregar servicio</button>}
                    />
                  )}

                  {/* Grouped Services */}
                  {(provider.categories.length > 0 ? provider.categories : ['Sin Categoría']).map(cat => (
                    <div key={cat} className="space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-deep">{cat}</h3>
                        <button
                          onClick={() => addService(cat)}
                          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-sand text-ink text-[12px] font-bold v2-press"
                        >
                          <Plus size={12} />
                          Agregar en {cat}
                        </button>
                      </div>
                      <div className="divide-y divide-line rounded-[1.5rem] bg-sand/50 overflow-hidden">
                        {provider.services.filter(s => s.category === cat || (!s.category && cat === provider.categories[0]) || (!s.category && provider.categories.length === 0 && cat === 'Sin Categoría')).map((service, i) => {
                          const globalIndex = provider.services.findIndex(s => s.id === service.id);
                          return (
                            <div key={service.id} className={`v2-rise v2-d${Math.min(i + 1, 8)} bg-cream p-4 md:p-5 flex flex-col gap-3`}>
                              <div className="flex flex-col md:flex-row md:items-center gap-3">
                                <input
                                  type="text"
                                  value={service.name}
                                  onChange={e => {
                                    const newServices = [...provider.services];
                                    newServices[globalIndex].name = e.target.value;
                                    setProvider({...provider, services: newServices});
                                  }}
                                  className={`${INPUT} flex-1`}
                                  placeholder="Nombre del servicio"
                                />

                                <div className="relative md:w-44">
                                  <select
                                    value={service.category || cat}
                                    onChange={e => {
                                      const newServices = [...provider.services];
                                      newServices[globalIndex].category = e.target.value;
                                      setProvider({...provider, services: newServices});
                                    }}
                                    className={`${FIELD} w-full h-12 pl-4 pr-10 bg-sand text-[13px] font-semibold text-ink appearance-none cursor-pointer`}
                                  >
                                    {provider.categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    {provider.categories.length === 0 && <option value="General">General</option>}
                                  </select>
                                  <ChevronDown size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-faint" />
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="relative w-32">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] font-bold text-primary-deep">$</span>
                                    <input
                                      type="number"
                                      value={service.price}
                                      onChange={e => {
                                        const newServices = [...provider.services];
                                        newServices[globalIndex].price = parseFloat(e.target.value) || 0;
                                        setProvider({...provider, services: newServices});
                                      }}
                                      className={PRICE_INPUT}
                                    />
                                  </div>
                                  <button onClick={() => removeService(service.id)} aria-label="Eliminar servicio" className="w-12 h-12 shrink-0 rounded-full bg-sand text-muted hover:text-error flex items-center justify-center transition-colors v2-press">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>

                              {/* Rango de precios y Unidades */}
                              <div className="flex flex-wrap items-center gap-4">
                                <label className="flex items-center gap-3 text-[12.5px] font-semibold text-muted cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={service.isRange || false}
                                    onChange={e => {
                                      const newServices = [...provider.services];
                                      newServices[globalIndex].isRange = e.target.checked;
                                      setProvider({...provider, services: newServices});
                                    }}
                                    className="sr-only peer"
                                  />
                                  <span className={`${SWITCH_SM} bg-sand`} />
                                  Precio en rango
                                </label>

                                {service.isRange && (
                                  <div className="v2-rise flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">hasta</span>
                                    <div className="relative w-32">
                                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] font-bold text-primary-deep">$</span>
                                      <input
                                        type="number"
                                        value={service.maxPrice || 0}
                                        onChange={e => {
                                          const newServices = [...provider.services];
                                          newServices[globalIndex].maxPrice = parseFloat(e.target.value) || 0;
                                          setProvider({...provider, services: newServices});
                                        }}
                                        className={`${FIELD} w-full h-11 pl-8 pr-4 bg-sand text-[15px] font-bold text-primary-deep tabular-nums`}
                                        placeholder="Max"
                                      />
                                    </div>
                                  </div>
                                )}

                                <div className="ml-auto flex items-center gap-2">
                                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">por</span>
                                  <div className="relative">
                                    <select
                                      value={service.unit || 'Servicio'}
                                      onChange={e => {
                                        const newServices = [...provider.services];
                                        newServices[globalIndex].unit = e.target.value;
                                        setProvider({...provider, services: newServices});
                                      }}
                                      className={`${FIELD} h-11 pl-4 pr-10 bg-sand text-[13px] font-semibold text-ink appearance-none cursor-pointer`}
                                    >
                                      <option value="Servicio">Servicio</option>
                                      <option value="M2">Metros Cuadrados (m²)</option>
                                      <option value="M lineal">Metro Lineal</option>
                                      <option value="PZ">Pieza (pz)</option>
                                    </select>
                                    <ChevronDown size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-faint" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* ── Portafolio ── */}
            {activeSection === 'portafolio' && (
              <SectionCard
                eyebrow="Trabajos"
                title="Portafolio de trabajos"
                className="v2-rise v2-d1"
                action={
                  <label className="cursor-pointer h-11 px-5 rounded-full bg-ink text-white text-[12.5px] font-bold flex items-center gap-2 v2-press">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handlePortfolioUpload}
                    />
                    <Upload size={14} /> Subir imágenes
                  </label>
                }
              >
                {provider.portfolio.length === 0 ? (
                  <EmptyState
                    icon={<ImageIcon size={26} />}
                    title="Sin trabajos en el portafolio"
                    text="Sube fotos de trabajos terminados; son lo primero que mira el cliente antes de contratar."
                    action={
                      <label className="cursor-pointer h-12 px-6 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-press">
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handlePortfolioUpload} />
                        <Upload size={15} /> Subir imágenes
                      </label>
                    }
                  />
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {provider.portfolio.map((item: any, i: number) => (
                      <div key={item.id} className={`v2-rise v2-d${Math.min(i + 1, 8)} group relative aspect-square rounded-[1.25rem] overflow-hidden bg-sand`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.imageUrl} alt={item.title || 'Trabajo del portafolio'} className="w-full h-full object-cover v3-photo group-hover:scale-105" />

                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <button
                            onClick={() => removePortfolioItem(item.id)}
                            aria-label="Eliminar imagen"
                            className="absolute top-3 right-3 w-9 h-9 glass text-error rounded-full flex items-center justify-center v2-press"
                          >
                            <Trash2 size={14} />
                          </button>

                          <input
                             type="text"
                             placeholder="Título del trabajo"
                             value={item.title}
                             onChange={e => {
                               const newPortfolio = [...provider.portfolio];
                               const idx = newPortfolio.findIndex(p => p.id === item.id);
                               newPortfolio[idx].title = e.target.value;
                               setProvider({...provider, portfolio: newPortfolio});
                             }}
                             className="w-full bg-transparent text-on-dark text-[14px] font-semibold placeholder:text-on-dark/50 outline-none border-b border-white/20 pb-1"
                          />
                          <textarea
                             placeholder="Descripción breve"
                             value={item.description}
                             onChange={e => {
                               const newPortfolio = [...provider.portfolio];
                               const idx = newPortfolio.findIndex(p => p.id === item.id);
                               newPortfolio[idx].description = e.target.value;
                               setProvider({...provider, portfolio: newPortfolio});
                             }}
                             className="w-full bg-transparent text-on-dark/80 text-[12px] font-medium placeholder:text-on-dark/40 outline-none border-none mt-2 resize-none h-10"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            )}

            {/* ── Horarios ── */}
            {activeSection === 'horarios' && (
              <SectionCard
                eyebrow="Agenda"
                title="Horarios y disponibilidad"
                className="v2-rise v2-d1"
                action={<span className="inline-flex items-center h-9 px-3.5 rounded-full bg-sand text-muted text-[12px] font-semibold">Configuración semanal</span>}
              >
                <div className="divide-y divide-line">
                  {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((dayName, idx) => {
                    const dayIdx = (idx + 1) % 7; // Convert to 0 (Sun) - 6 (Sat)
                    const dayData = provider.availability.find(a => a.day_of_week === dayIdx) || { day_of_week: dayIdx, start_time: '09:00', end_time: '18:00', is_active: false };

                    return (
                      <div key={dayName} className={`v2-rise v2-d${Math.min(idx + 1, 8)} flex flex-wrap items-center gap-4 py-4 transition-opacity ${dayData.is_active ? '' : 'opacity-60'}`}>
                        <div className="w-28 text-[15px] font-semibold text-ink">{dayName}</div>

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
                          <span className={`${SWITCH} bg-sand`} />
                        </label>

                        {dayData.is_active && (
                          <div className="v2-rise flex items-center gap-2">
                             <input
                               type="time"
                               value={dayData.start_time.substring(0,5)}
                               onChange={(e) => {
                                 const newAvail = [...provider.availability];
                                 const idx = newAvail.findIndex(a => a.day_of_week === dayIdx);
                                 newAvail[idx].start_time = e.target.value;
                                 setProvider({...provider, availability: newAvail});
                               }}
                               className={`${FIELD} h-11 px-4 bg-sand text-[14px] font-semibold text-ink tabular-nums`}
                             />
                             <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">a</span>
                             <input
                               type="time"
                               value={dayData.end_time.substring(0,5)}
                               onChange={(e) => {
                                 const newAvail = [...provider.availability];
                                 const idx = newAvail.findIndex(a => a.day_of_week === dayIdx);
                                 newAvail[idx].end_time = e.target.value;
                                 setProvider({...provider, availability: newAvail});
                               }}
                               className={`${FIELD} h-11 px-4 bg-sand text-[14px] font-semibold text-ink tabular-nums`}
                             />
                          </div>
                        )}
                        {!dayData.is_active && <span className="inline-flex items-center h-8 px-3 rounded-full bg-sand text-faint text-[11px] font-semibold">No laborable</span>}
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            )}

            {/* ── Reseñas ── */}
            {activeSection === 'resenas' && (
              <SectionCard
                eyebrow="Reputación"
                title="Reseñas de clientes"
                className="v2-rise v2-d1"
                action={
                  <button
                     className="h-11 px-5 rounded-full bg-ink text-white text-[12.5px] font-bold flex items-center gap-2 v2-press"
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
                    <Plus size={14} /> Agregar reseña
                  </button>
                }
              >
                <div className="space-y-3">
                  {provider.reviews.length === 0 && (
                    <EmptyState
                      icon={<Star size={26} />}
                      title="Sin reseñas para mostrar"
                      text="Las reseñas de clientes aparecerán aquí; también puedes registrar una manualmente."
                    />
                  )}
                  {provider.reviews.map((review, idx) => (
                    <div key={review.id} className={`v2-rise v2-d${Math.min(idx + 1, 8)} relative bg-sand/60 rounded-[1.5rem] p-5 flex flex-col gap-3`}>
                      <button
                         onClick={() => setProvider({...provider, reviews: provider.reviews.filter(r => r.id !== review.id)})}
                         aria-label="Eliminar reseña"
                         className="absolute top-4 right-4 w-9 h-9 rounded-full bg-cream text-muted hover:text-error flex items-center justify-center transition-colors v2-press"
                      >
                         <Trash2 size={14} />
                      </button>

                      <div className="flex flex-wrap items-center gap-3 pr-12">
                        <div className="flex items-center gap-3 min-w-0">
                           <input
                              type="text"
                              value={review.user}
                              readOnly={!review.isNew}
                              onChange={(e) => {
                                 const newReviews = [...provider.reviews];
                                 newReviews[idx].user = e.target.value;
                                 setProvider({...provider, reviews: newReviews});
                              }}
                              className={`text-[15px] font-semibold text-ink outline-none bg-transparent min-w-0 ${review.isNew ? 'border-b-2 border-lavender' : 'border-none'}`}
                           />
                           <span className="text-[12px] font-medium text-faint tabular-nums">{review.date}</span>
                        </div>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <button key={s} aria-label={`${s} estrellas`} onClick={() => {
                               const newReviews = [...provider.reviews];
                               newReviews[idx].rating = s;
                               setProvider({...provider, reviews: newReviews});
                            }} className="v2-press">
                              <Star size={15} className={s <= review.rating ? 'text-primary-deep' : 'text-faint/60'} fill={s <= review.rating ? 'currentColor' : 'none'} />
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
                         className={`${TEXTAREA_BASE} bg-cream h-20`}
                      />
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* ── Operación y pagos ── */}
            {activeSection === 'operacion' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard eyebrow="Cobertura" title="Operaciones" className="v2-rise v2-d1">
                  <div className="space-y-4">
                    <div className="relative">
                      <label className={EYEBROW}>Zonas de cobertura</label>
                      <div
                        onClick={() => setIsZonesOpen(!isZonesOpen)}
                        className={`${INPUT} cursor-pointer flex justify-between items-center`}
                      >
                        <span className="truncate pr-4">{provider.zones.length > 0 ? provider.zones.join(', ') : 'Seleccionar zonas...'}</span>
                        <ChevronDown size={16} className={`shrink-0 text-faint transform transition-transform ${isZonesOpen ? 'rotate-180' : ''}`} />
                      </div>
                      {isZonesOpen && (
                        <div className="v2-rise absolute top-full left-0 right-0 mt-2 bg-cream rounded-[1.5rem] v2-shadow-float z-50 p-2 max-h-60 overflow-y-auto">
                          {JUAREZ_ZONES.map(zone => {
                            const checked = provider.zones.includes(zone);
                            return (
                              <label key={zone} className={`flex items-center justify-between gap-3 px-4 h-11 rounded-[1rem] cursor-pointer transition-colors ${checked ? 'bg-lavender-light text-ink' : 'hover:bg-sand text-ink'}`}>
                                <span className="text-[14px] font-semibold">{zone}</span>
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={(e) => {
                                     if (e.target.checked) {
                                       setProvider({...provider, zones: [...provider.zones, zone]});
                                     } else {
                                       setProvider({...provider, zones: provider.zones.filter((z: string) => z !== zone)});
                                     }
                                  }}
                                  className="sr-only peer"
                                />
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${checked ? 'bg-ink text-white' : 'bg-sand'}`}>
                                  {checked && <CheckCircle2 size={14} />}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className={EYEBROW}>Rango de cobertura (distancia)</label>
                      <div className="relative">
                        <select
                          value={provider.coverageRadius}
                          onChange={e => setProvider({...provider, coverageRadius: parseInt(e.target.value)})}
                          className={`${SELECT} tabular-nums`}
                        >
                          <option value={5}>5 km</option>
                          <option value={10}>10 km</option>
                          <option value={20}>20 km</option>
                          <option value={50}>50 km</option>
                        </select>
                        <MapPin size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-faint" />
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard eyebrow="Dispersión" title="Datos fiscales y pagos" className="v2-rise v2-d2">
                  <p className="text-[13px] font-medium text-muted leading-relaxed mb-5 -mt-2">
                    Esta información se utiliza para la dispersión de fondos del escrow hacia el proveedor (Stripe Connect / Transferencia).
                  </p>
                  <div className="space-y-5">
                    <div className="space-y-3">
                      <div>
                        <label className={EYEBROW}>Banco principal (opcional)</label>
                        <div className="relative">
                          <select value={provider.bank} onChange={e => setProvider({...provider, bank: e.target.value})} className={SELECT}>
                            <option value="">Selecciona banco...</option>
                            {COMMERCIAL_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-faint" />
                        </div>
                      </div>
                      <div>
                        <label className={EYEBROW}>Cuenta CLABE principal</label>
                        <input type="text" value={provider.clabe} onChange={e => setProvider({...provider, clabe: e.target.value})} maxLength={18} placeholder="000 000 000000000000" className={CLABE_INPUT} />
                      </div>
                    </div>
                    <div className="space-y-3 pt-5 border-t border-line">
                      <div>
                        <label className={EYEBROW}>Banco secundario (opcional)</label>
                        <div className="relative">
                          <select value={provider.secondaryBank} onChange={e => setProvider({...provider, secondaryBank: e.target.value})} className={SELECT}>
                            <option value="">Selecciona banco...</option>
                            {COMMERCIAL_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-faint" />
                        </div>
                      </div>
                      <div>
                        <label className={EYEBROW}>Cuenta CLABE secundaria</label>
                        <input type="text" value={provider.secondaryClabe} onChange={e => setProvider({...provider, secondaryClabe: e.target.value})} maxLength={18} placeholder="000 000 000000000000" className={CLABE_INPUT} />
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {/* ── Zona de peligro ── */}
            {!isNew && (
              <section className={`v2-rise v2-d3 rounded-[2.25rem] p-6 md:p-8 ${provider.status === 'Activo' ? 'bg-rose/10' : 'bg-cream v2-shadow-soft'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div>
                    <span className={`inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-[11px] font-bold mb-3 ${provider.status === 'Activo' ? 'bg-cream text-error' : 'bg-primary-light text-primary-deep'}`}>
                      {provider.status === 'Activo' ? <><AlertTriangle size={12} /> Zona de peligro</> : <><CheckCircle2 size={12} /> Activación</>}
                    </span>
                    <h2 className="text-[22px] font-semibold tracking-tight text-ink">
                      {provider.status === 'Activo' ? 'Suspender a este proveedor' : 'Activar a este proveedor'}
                    </h2>
                    <p className="mt-2 text-[13.5px] font-medium text-muted max-w-md">
                      {provider.status === 'Activo'
                        ? 'Dejará de aparecer en el catálogo y no recibirá nuevas solicitudes. El cambio se aplica al guardar.'
                        : 'Aparecerá en el catálogo y podrá recibir solicitudes de clientes. El cambio se aplica al guardar.'}
                    </p>
                  </div>
                  <button
                    onClick={toggleActivation}
                    className={`shrink-0 h-12 px-6 rounded-full text-[13px] font-bold flex items-center gap-2 v2-press ${provider.status === 'Activo' ? 'bg-cream text-error' : 'bg-mint text-ink'}`}
                  >
                    {provider.status === 'Activo' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                    {provider.status === 'Activo' ? 'Suspender proveedor' : 'Activar proveedor'}
                  </button>
                </div>
              </section>
            )}
          </div>

          {/* ── Guardar (barra inferior fija) ── */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-10 z-40">
            <button onClick={handleSave} disabled={isSaving} className="h-14 px-8 rounded-full bg-ink text-white text-[13px] font-bold flex items-center gap-2 v2-shadow-float v2-press disabled:opacity-60">
              <Save size={16} /> {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
