"use client";

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@i-mendly/shared/components/Card';
import { Badge } from '@i-mendly/shared/components/Badge';
import { Button } from '@i-mendly/shared/components/Button';
import { Avatar } from '@i-mendly/shared/components/Avatar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  ClipboardList
} from 'lucide-react';

const STAGES = [
  { id: 'application', label: 'Aplicación', variant: 'silver' },
  { id: 'revision', label: 'En Revisión', variant: 'warning' },
  { id: 'interview', label: 'Entrevista', variant: 'indigo' },
  { id: 'training', label: 'Capacitación', variant: 'purple' },
  { id: 'active', label: 'Activo', variant: 'success' },
];

export default function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  async function fetchCandidate() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('onboarding_applications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCandidate(data);
    } catch (error) {
      console.error('Error fetching candidate:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(newStatus: string) {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from('onboarding_applications')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setCandidate({ ...candidate, status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-silver flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-soft animate-pulse font-[600]">Cargando expediente...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-silver flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <XCircle size={48} className="text-red-400 mb-4" />
          <h2 className="text-xl font-bold">Aspirante no encontrado</h2>
          <Link href="/admin/proveedores/onboarding" className="mt-4 text-primary font-bold">Volver al pipe</Link>
        </div>
      </div>
    );
  }

  const currentStage = STAGES.find(s => s.id === candidate.status);

  return (
    <main className="min-h-screen bg-silver font-urbanist flex">
      <AdminSidebar />
      <div className="flex-1 max-w-7xl mx-auto px-8 py-12">
        <header className="mb-10">
          <Link href="/admin/proveedores/onboarding" className="flex items-center gap-2 text-gray-soft text-xs mb-6 hover:text-black-rich transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al Pipe
          </Link>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
              <Avatar name={candidate.full_name} size="xl" className="border-4 border-white shadow-xl" />
              <div>
                <h2 className="text-4xl font-[800] tracking-tighter text-black-rich mb-2">{candidate.full_name}</h2>
                <div className="flex gap-3 items-center">
                  <Badge variant={currentStage?.variant as any || 'silver'} className="px-4 py-1 text-xs">
                    {currentStage?.label || candidate.status}
                  </Badge>
                  <span className="text-gray-soft text-sm font-[600]">Especialidad: <span className="text-black-rich capitalize">{candidate.main_specialty === 'otro' ? candidate.other_specialty_name : candidate.main_specialty}</span></span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <select 
                className="bg-white border border-black/10 rounded-xl px-4 py-2 text-sm font-[600] outline-none"
                value={candidate.status}
                onChange={(e) => updateStatus(e.target.value)}
                disabled={updating}
              >
                {STAGES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
              <Button variant="primary" className="shadow-lg shadow-primary/20">Aprobar Aspirante</Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card variant="default" className="p-8 bg-white border-none shadow-sm rounded-3xl">
              <h3 className="text-lg font-[800] text-black-rich mb-8 uppercase tracking-widest flex items-center gap-2">
                <FileText size={18} className="text-primary" /> Información de Perfil
              </h3>
              <div className="grid grid-cols-2 gap-y-10">
                <div>
                  <p className="text-[10px] text-gray-soft font-[700] uppercase tracking-widest mb-1">Email</p>
                  <p className="text-sm font-[600] flex items-center gap-2"><Mail size={14} className="text-primary/60" /> {candidate.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-soft font-[700] uppercase tracking-widest mb-1">Teléfono</p>
                  <p className="text-sm font-[600] flex items-center gap-2"><Phone size={14} className="text-primary/60" /> {candidate.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-soft font-[700] uppercase tracking-widest mb-1">Ubicación</p>
                  <p className="text-sm font-[600] flex items-center gap-2"><MapPin size={14} className="text-primary/60" /> {candidate.city || 'Ciudad Juárez'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-soft font-[700] uppercase tracking-widest mb-1">Fecha Nacimiento</p>
                  <p className="text-sm font-[600]">{candidate.birth_date || 'No proporcionada'}</p>
                </div>
                <div className="col-span-2 p-4 bg-silver-light/20 rounded-2xl border border-black/5">
                   <p className="text-[10px] text-gray-soft font-[700] uppercase tracking-widest mb-2">Descripción de Especialidad</p>
                   <p className="text-sm text-black-rich/80 leading-relaxed font-[500]">
                     {candidate.is_other_specialty ? candidate.other_specialty_description : `Proveedor experto en ${candidate.main_specialty}.`}
                   </p>
                </div>
              </div>
            </Card>

            <Card variant="default" className="p-8 bg-white border-none shadow-sm rounded-3xl">
              <h3 className="text-lg font-[800] text-black-rich mb-8 uppercase tracking-widest flex items-center gap-2">
                <ClipboardList size={18} className="text-primary" /> Servicios y Cobertura
              </h3>
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] text-gray-soft font-[700] uppercase tracking-widest mb-3">Sub-servicios Ofrecidos</p>
                  <div className="flex flex-wrap gap-2">
                    {candidate.sub_services?.length > 0 ? candidate.sub_services.map((s: string, i: number) => (
                      <Badge key={i} variant="silver" className="lowercase">{s}</Badge>
                    )) : <p className="text-sm text-gray-soft italic">Ninguno seleccionado</p>}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-gray-soft font-[700] uppercase tracking-widest mb-3">Zonas de Trabajo</p>
                  <div className="flex flex-wrap gap-2">
                    {candidate.zones?.length > 0 ? candidate.zones.map((z: string, i: number) => (
                      <Badge key={i} variant="indigo" className="capitalize">{z}</Badge>
                    )) : <p className="text-sm text-gray-soft italic">Ninguna seleccionada</p>}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Side Column - Results & Status */}
          <div className="space-y-8">
            <Card variant="default" className="p-8 bg-white border-none shadow-sm rounded-3xl">
              <h3 className="text-lg font-[800] text-black-rich mb-6 uppercase tracking-widest">Estado Examen</h3>
              {candidate.exam_results ? (
                <div className="text-center p-6 bg-silver-light/30 rounded-2xl border border-black/5">
                  <div className={`text-4xl font-[900] mb-2 ${candidate.exam_results.passed ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {candidate.exam_results.score}%
                  </div>
                  <Badge variant={candidate.exam_results.passed ? 'success' : 'error'} className="mb-4">
                    {candidate.exam_results.passed ? 'APROBADO' : 'FALLIDO'}
                  </Badge>
                  <p className="text-xs text-gray-soft font-[500]">Completado el {new Date(candidate.exam_results.completed_at).toLocaleDateString()}</p>
                </div>
              ) : (
                <div className="text-center p-8 bg-silver-light/20 rounded-2xl border border-dashed border-black/10">
                  <AlertTriangle size={24} className="text-amber-400 mx-auto mb-3" />
                  <p className="text-xs text-gray-soft font-[600]">Examen pendiente de realizar</p>
                </div>
              )}
            </Card>

            <Card variant="default" className="p-8 bg-white border-none shadow-sm rounded-3xl">
              <h3 className="text-lg font-[800] text-black-rich mb-6 uppercase tracking-widest">Entrevista</h3>
              {candidate.interview_details ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <Calendar size={20} className="text-indigo-500" />
                    <div>
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Fecha</p>
                      <p className="text-sm font-[700] text-indigo-900">{candidate.interview_details.date === 'today' ? 'Hoy' : candidate.interview_details.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <Clock size={20} className="text-indigo-500" />
                    <div>
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Horario</p>
                      <p className="text-sm font-[700] text-indigo-900">{candidate.interview_details.time}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-soft italic text-center p-4">No agendada aún</p>
              )}
            </Card>

            <Card variant="default" className="p-8 bg-white border-none shadow-sm rounded-3xl">
              <h3 className="text-lg font-[800] text-black-rich mb-6 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-500" /> Recomendaciones de Clientes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map(i => {
                  const name = candidate.documents?.[`testimonial${i}_name`];
                  const contact = candidate.documents?.[`testimonial${i}_contact`];
                  const text = candidate.documents?.[`testimonial${i}_text`];
                  
                  if (!name && !text) return null;

                  return (
                    <div key={i} className="p-5 bg-silver-light/20 rounded-2xl border border-black/5 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm font-[800] text-black-rich">{name || 'Sin nombre'}</p>
                          <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{contact || 'Sin contacto'}</p>
                        </div>
                        <div className="flex text-emerald-500 gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-xs">★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-black-rich/70 italic leading-relaxed flex-grow">
                        "{text || 'Sin testimonio'}"
                      </p>
                    </div>
                  );
                })}
                {!candidate.documents?.testimonial1_name && !candidate.documents?.testimonial2_name && (
                  <p className="text-sm text-gray-soft italic col-span-2 text-center p-4">No se proporcionaron recomendaciones.</p>
                )}
              </div>
            </Card>

            <Card variant="default" className="p-8 bg-white border-none shadow-sm rounded-3xl">
              <h3 className="text-lg font-[800] text-black-rich mb-6 uppercase tracking-widest">Documentación</h3>
              <div className="space-y-3">
                {candidate.documents ? Object.entries(candidate.documents).map(([key, val]: any) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-silver-light/20 rounded-xl border border-black/5 hover:bg-silver-light/40 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-primary/60" />
                      <span className="text-xs font-[600] capitalize text-black-rich/80">{key.replace(/_/g, ' ')}</span>
                    </div>
                    <Download size={14} className="text-gray-soft group-hover:text-primary transition-colors" />
                  </div>
                )) : <p className="text-sm text-gray-soft italic text-center p-4">Sin documentos</p>}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
