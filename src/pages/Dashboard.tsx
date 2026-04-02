import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Profile, TeacherAttendance, Student } from '../types';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  Calendar, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function Dashboard() {
  const { profile } = useOutletContext<{ profile: Profile }>();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    todayAttendance: 0,
    lateCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const [students, teachers, attendance] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('teacher_attendance').select('*').eq('date', today)
      ]);

      setStats({
        totalStudents: students.count || 0,
        totalTeachers: teachers.count || 0,
        todayAttendance: attendance.data?.filter(a => a.status === 'hadir').length || 0,
        lateCount: attendance.data?.filter(a => a.status === 'sakit' || a.status === 'izin').length || 0
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const cards = [
    { 
      title: 'Total Siswa', 
      value: stats.totalStudents, 
      icon: <GraduationCap className="text-brand-light" size={24} />,
      color: 'bg-blue-50'
    },
    { 
      title: 'Total Guru', 
      value: stats.totalTeachers, 
      icon: <Users className="text-emerald-500" size={24} />,
      color: 'bg-emerald-50'
    },
    { 
      title: 'Hadir Hari Ini', 
      value: stats.todayAttendance, 
      icon: <CheckCircle2 className="text-sky-500" size={24} />,
      color: 'bg-sky-50'
    },
    { 
      title: 'Izin/Sakit', 
      value: stats.lateCount, 
      icon: <AlertCircle className="text-amber-500" size={24} />,
      color: 'bg-amber-50'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Halo, {profile.full_name}! 👋</h1>
          <p className="text-slate-500 mt-1">Selamat datang di dashboard Hadirin. Berikut ringkasan hari ini.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100">
          <Calendar className="text-brand-light" size={20} />
          <span className="font-bold text-slate-700">
            {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.color} rounded-2xl flex items-center justify-center`}>
                {card.icon}
              </div>
              <TrendingUp className="text-slate-300" size={20} />
            </div>
            <p className="text-slate-500 font-medium">{card.title}</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Aktivitas Terbaru</h3>
            <button className="text-sm font-bold text-brand-light hover:underline">Lihat Semua</button>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-slate-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-900 font-medium">
                      <span className="font-bold">Guru {i + 1}</span> melakukan absensi mandiri
                    </p>
                    <p className="text-sm text-slate-500">10 menit yang lalu • Status: Hadir</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-brand-gradient rounded-3xl shadow-xl p-8 text-white">
          <h3 className="text-xl font-bold mb-6">Aksi Cepat</h3>
          <div className="space-y-4">
            <button className="w-full py-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl font-bold hover:bg-white/30 transition-all flex items-center justify-center gap-3">
              <UserCheck size={20} />
              Absen Sekarang
            </button>
            <button className="w-full py-4 bg-white text-brand-dark rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-3 shadow-lg">
              <Users size={20} />
              Absen Siswa
            </button>
          </div>
          <div className="mt-8 p-4 bg-white/10 rounded-2xl border border-white/10">
            <p className="text-sm opacity-80 leading-relaxed">
              Pastikan Anda melakukan absensi sebelum pukul 08:00 WIB untuk menghindari status terlambat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
