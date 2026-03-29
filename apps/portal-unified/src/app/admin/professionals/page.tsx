"use client";

import { Logo } from '@i-mendly/shared/Logo';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Button } from '@i-mendly/shared/components/Button';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  Settings, 
  AlertCircle, 
  BarChart3, 
  UserPlus,
  TrendingUp,
  Zap,
  LogOut,
  Search,
  Filter,
  CheckCircle2,
  MoreVertical,
  Plus
} from 'lucide-react';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';

export default function ProfessionalsManagementPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('Todos');
  const [providers, setProviders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchProviders = async () => {
    setIsLoading(true);
    try {
      // Fetch providers joined with the users table to get the name
      const { data, error } = await supabase
        .from('providers')
        .select(`
          id,
          category,
          account_status,
          rating,
          reviews_count,
          created_at,
          users ( full_name )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formatted = (data || []).map(p => {
        const u = Array.isArray(p.users) ? p.users[0] : p.users;
        return {
          id: p.id,
          name: u?.full_name || 'Sin Nombre/Empresa',
          category: p.category,
          status: p.account_status === 'active' ? 'Activo' : (p.account_status === 'pending' ? 'Pendiente' : 'Suspendido'),
          rating: p.rating || 0,
          services: p.reviews_count || 0, // Fallback to reviews count for demo
          joined: new Date(p.created_at).toLocaleDateString()
        };
      });
      
      setProviders(formatted);
    } catch (err) {
      console.error('Error fetching providers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);
  
  const handleLogout = () => {
    router.push('/role-selection');
  };

  const navItems = [
    { label: 'Dashboard', icon: <BarChart3 size={18} />, href: '/admin' },
    { label: 'Disputas', icon: <AlertCircle size={18} />, href: '/admin/disputas' },
    { label: 'Onboarding', icon: <UserPlus size={18} />, href: '/admin/proveedores/onboarding' },
    { label: 'Profesionales', icon: <Users size={18} />, href: '/admin/professionals', active: true },
    { label: 'Finanzas', icon: <TrendingUp size={18} />, href: '/admin/finanzas' },
    { label: 'Master Plan', icon: <Zap size={18} />, href: '/admin/master-plan' },
    { label: 'Configuración', icon: <Settings size={18} />, href: '/admin/configuraciones' },
  ];

  const filteredProfessionals = providers.filter(p => filter === 'Todos' || p.status === filter);

  return (
    <main className="min-h-screen bg-silver font-urbanist flex">
      <AdminSidebar />
      <div className="flex-1 max-w-7xl mx-auto px-8 py-12">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-[600] tracking-tight text-black-rich mb-2">Gestión de Profesionales</h2>
            <p className="text-gray-soft text-sm">Administra el talento, aprueba perfiles e inspecciona datos fiscales</p>
          </div>
          <div className="flex gap-3">
             <Button variant="secondary" size="sm" className="gap-2">
               <Filter size={16} /> Filtros
             </Button>
             <Link href="/admin/professionals/new">
               <Button variant="primary" size="sm" className="gap-2">
                 <Plus size={16} /> Nuevo Proveedor
               </Button>
             </Link>
          </div>
        </header>

        {/* Filters & Search */}
        <Card variant="default" className="p-4 mb-8 flex items-center justify-between">
           <div className="flex items-center gap-2 bg-silver-light/50 px-4 py-2 rounded-pill w-96 border-[0.5px] border-black/5">
              <Search size={16} className="text-gray-soft" />
              <input 
                 type="text" 
                 placeholder="Buscar por nombre o categoría..." 
                 className="bg-transparent border-none outline-none w-full text-sm text-black-rich font-[500]"
              />
           </div>
           
           <div className="flex items-center gap-2">
              {['Todos', 'Activo', 'Pendiente', 'Suspendido'].map((status) => (
                 <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-pill text-xs font-[600] uppercase tracking-wide transition-all ${
                       filter === status 
                       ? 'bg-black-rich text-white' 
                       : 'bg-silver-light text-black-rich/60 hover:bg-silver-light/80'
                    }`}
                 >
                    {status}
                 </button>
              ))}
           </div>
        </Card>

        {/* Data Table */}
        <Card variant="default" className="p-0 overflow-hidden border-[0.5px] border-black/5 border-b-0">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-silver-light/30 text-gray-soft text-[10px] font-[600] uppercase tracking-widest border-b-[0.5px] border-black/5">
                    <th className="px-6 py-4 font-medium">Proveedor</th>
                    <th className="px-6 py-4 font-medium">Categoría</th>
                    <th className="px-6 py-4 font-medium">Estado</th>
                    <th className="px-6 py-4 font-medium">Rating/Servicios</th>
                    <th className="px-6 py-4 font-medium">Registro</th>
                    <th className="px-6 py-4 font-medium text-right">Acciones</th>
                 </tr>
              </thead>
              <tbody>
                 {filteredProfessionals.map((p, i) => (
                    <tr key={i} className="border-b-[0.5px] border-black/5 hover:bg-silver-light/10 transition-colors group">
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <Avatar name={p.name} size="md" />
                             <div>
                                <p className="text-sm font-[600] text-black-rich">{p.name}</p>
                                <p className="text-xs text-gray-soft font-medium">ID: {p.id}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className="text-sm font-[500] text-black-rich">{p.category}</span>
                       </td>
                       <td className="px-6 py-4">
                          <Badge variant={p.status === 'Activo' ? 'success' : p.status === 'Pendiente' ? 'warning' : 'error'}>
                             {p.status}
                          </Badge>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-1 text-sm font-[600] text-black-rich">
                                <span className="text-primary">★</span> {p.rating > 0 ? p.rating : 'N/A'}
                             </div>
                             <p className="text-[10px] text-gray-soft uppercase tracking-wider">{p.services} Completados</p>
                          </div>
                       </td>
                       <td className="px-6 py-4 text-sm font-[500] text-gray-soft">
                          {p.joined}
                       </td>
                       <td className="px-6 py-4 text-right">
                          <Link href={`/admin/professionals/${p.id}`}>
                             <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 px-3">
                                Editar Perfil <ChevronRight size={14} className="ml-1" />
                             </Button>
                          </Link>
                       </td>
                    </tr>
                 ))}
                 
                 {isLoading && (
                    <tr>
                       <td colSpan={6} className="px-6 py-12 text-center text-gray-soft font-[500]">
                          Cargando profesionales de Supabase...
                       </td>
                    </tr>
                 )}
                 {!isLoading && filteredProfessionals.length === 0 && (
                    <tr>
                       <td colSpan={6} className="px-6 py-12 text-center text-gray-soft font-[500]">
                          No se encontraron profesionales con estos filtros. Empieza registrando uno nuevo arriba a la derecha.
                       </td>
                    </tr>
                 )}
              </tbody>
           </table>
        </Card>
      </div>
    </main>
  );
}

// Temporary ChevronRight until imported
function ChevronRight(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
