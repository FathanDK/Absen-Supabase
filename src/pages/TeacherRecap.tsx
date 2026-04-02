import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Profile, TeacherAttendance } from '../types';
import { 
  Search, 
  Download, 
  Calendar, 
  Filter,
  Loader2,
  UserCheck,
  MoreVertical
} from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { id } from 'date-fns/locale';

export default function TeacherRecapPage() {
  const { profile } = useOutletContext<{ profile: Profile }>();
  const [attendance, setAttendance] = useState<TeacherAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    end: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('teacher_attendance')
        .select('*, profiles(*)')
        .gte('date', dateRange.start)
        .lte('date', dateRange.end)
        .order('date', { ascending: false });
      
      if (data) setAttendance(data);
      setLoading(false);
    };

    fetchAttendance();
  }, [dateRange]);

  const filteredData = attendance.filter(a => 
    a.profiles?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'hadir': return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase">Hadir</span>;
      case 'izin': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">Izin</span>;
      case 'sakit': return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase">Sakit</span>;
      case 'alpa': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase">Alpa</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Rekap Absensi Guru</h1>
          <p className="text-slate-500 mt-1">Laporan kehadiran seluruh guru dan staf.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all">
          <Download size={20} />
          Ekspor PDF
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Cari nama guru..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-light outline-none"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <Calendar className="text-slate-400" size={18} />
            <input 
              type="date" 
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="bg-transparent outline-none text-sm font-medium"
            />
            <span className="text-slate-400">s/d</span>
            <input 
              type="date" 
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="bg-transparent outline-none text-sm font-medium"
            />
          </div>
          <button className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center">
            <Loader2 className="animate-spin text-brand-light" size={40} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 font-bold text-slate-700">Tanggal</th>
                  <th className="px-6 py-4 font-bold text-slate-700">Nama Guru</th>
                  <th className="px-6 py-4 font-bold text-slate-700">Status</th>
                  <th className="px-6 py-4 font-bold text-slate-700">Waktu Input</th>
                  <th className="px-6 py-4 font-bold text-slate-700"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {format(new Date(item.date), 'dd MMM yyyy', { locale: id })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-sky/10 text-brand-sky rounded-full flex items-center justify-center font-bold text-xs">
                          {item.profiles?.full_name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900">{item.profiles?.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {format(new Date(item.created_at), 'HH:mm', { locale: id })} WIB
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <UserCheck className="mx-auto mb-4 opacity-20" size={48} />
                      Tidak ada data absensi ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
