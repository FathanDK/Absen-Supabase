import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Profile, TeacherAttendance } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  Calendar as CalendarIcon,
  Loader2,
  Check
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function TeacherAttendancePage() {
  const { profile } = useOutletContext<{ profile: Profile }>();
  const [attendance, setAttendance] = useState<TeacherAttendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    const fetchAttendance = async () => {
      const { data } = await supabase
        .from('teacher_attendance')
        .select('*')
        .eq('teacher_id', profile.id)
        .eq('date', today)
        .single();
      
      setAttendance(data);
      setLoading(false);
    };

    fetchAttendance();
  }, [profile.id, today]);

  const handleAttendance = async (status: TeacherAttendance['status']) => {
    setSubmitting(true);
    setMessage(null);

    try {
      const { data, error } = await supabase
        .from('teacher_attendance')
        .upsert({
          teacher_id: profile.id,
          date: today,
          status
        })
        .select()
        .single();

      if (error) throw error;
      setAttendance(data);
      setMessage({ type: 'success', text: `Berhasil melakukan absensi: ${status.toUpperCase()}` });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Gagal melakukan absensi.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-brand-light" size={32} />
      </div>
    );
  }

  const options: { status: TeacherAttendance['status'], label: string, icon: React.ReactNode, color: string, bgColor: string }[] = [
    { 
      status: 'hadir', 
      label: 'Hadir', 
      icon: <CheckCircle2 size={24} />, 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    { 
      status: 'izin', 
      label: 'Izin', 
      icon: <Clock size={24} />, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      status: 'sakit', 
      label: 'Sakit', 
      icon: <AlertCircle size={24} />, 
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    { 
      status: 'alpa', 
      label: 'Alpa', 
      icon: <XCircle size={24} />, 
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Absensi Mandiri Guru</h1>
        <p className="text-slate-500 mt-2">Silakan pilih status kehadiran Anda untuk hari ini.</p>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-brand-light">
              <CalendarIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Tanggal Hari Ini</p>
              <p className="text-xl font-bold text-slate-900">
                {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id })}
              </p>
            </div>
          </div>
          
          {attendance && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-bold text-sm">
              <Check size={18} />
              Sudah Absen: {attendance.status.toUpperCase()}
            </div>
          )}
        </div>

        <div className="p-8">
          {message && (
            <div className={cn(
              "mb-8 p-4 rounded-2xl flex items-center gap-3 font-medium",
              message.type === 'success' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
            )}>
              {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {options.map((option) => {
              const isSelected = attendance?.status === option.status;
              
              return (
                <button
                  key={option.status}
                  disabled={submitting}
                  onClick={() => handleAttendance(option.status)}
                  className={cn(
                    "flex flex-col items-center gap-4 p-6 rounded-3xl border-2 transition-all group relative overflow-hidden",
                    isSelected 
                      ? "border-brand-light bg-brand-light/5 shadow-lg" 
                      : "border-slate-100 hover:border-brand-light/30 hover:bg-slate-50"
                  )}
                >
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                    isSelected ? "bg-brand-light text-white" : `${option.bgColor} ${option.color}`
                  )}>
                    {option.icon}
                  </div>
                  <span className={cn(
                    "font-bold text-lg",
                    isSelected ? "text-brand-dark" : "text-slate-600"
                  )}>
                    {option.label}
                  </span>
                  
                  {isSelected && (
                    <div className="absolute top-2 right-2 text-brand-light">
                      <CheckCircle2 size={20} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-sky-50 rounded-3xl p-8 border border-sky-100 flex items-start gap-4">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 text-sky-600 shadow-sm">
          <AlertCircle size={24} />
        </div>
        <div>
          <h4 className="font-bold text-sky-900 mb-1">Informasi Penting</h4>
          <p className="text-sky-800 leading-relaxed opacity-80">
            Absensi mandiri hanya dapat dilakukan satu kali setiap harinya. Jika terjadi kesalahan input, silakan hubungi Admin untuk melakukan perubahan data.
          </p>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
