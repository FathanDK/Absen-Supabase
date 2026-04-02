import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Profile, Student, StudentAttendance } from '../types';
import { 
  Search, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  Loader2,
  Save,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function StudentAttendancePage() {
  const { profile } = useOutletContext<{ profile: Profile }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, StudentAttendance['status']>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('Semua');
  const [classes, setClasses] = useState<string[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    const fetchData = async () => {
      const [studentsRes, attendanceRes] = await Promise.all([
        supabase.from('students').select('*').order('name'),
        supabase.from('student_attendance').select('*').eq('date', today)
      ]);

      if (studentsRes.data) {
        setStudents(studentsRes.data);
        const uniqueClasses = Array.from(new Set(studentsRes.data.map(s => s.class)));
        setClasses(uniqueClasses);
      }

      if (attendanceRes.data) {
        const attendanceMap: Record<string, StudentAttendance['status']> = {};
        attendanceRes.data.forEach(a => {
          attendanceMap[a.student_id] = a.status;
        });
        setAttendance(attendanceMap);
      }

      setLoading(false);
    };

    fetchData();
  }, [today]);

  const handleStatusChange = (studentId: string, status: StudentAttendance['status']) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = async () => {
    setSubmitting(true);
    setMessage(null);

    try {
      const attendanceData = Object.entries(attendance).map(([studentId, status]) => ({
        student_id: studentId,
        teacher_id: profile.id,
        date: today,
        status
      }));

      const { error } = await supabase
        .from('student_attendance')
        .upsert(attendanceData);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Berhasil menyimpan absensi siswa.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Gagal menyimpan absensi.' });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.nisn.includes(searchTerm);
    const matchesClass = selectedClass === 'Semua' || s.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-brand-light" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Absensi Siswa</h1>
          <p className="text-slate-500 mt-1">Kelola kehadiran siswa hari ini: {format(new Date(), 'dd MMMM yyyy', { locale: id })}</p>
        </div>
        <button
          onClick={saveAttendance}
          disabled={submitting || Object.keys(attendance).length === 0}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-gradient text-white rounded-2xl font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
        >
          {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Simpan Absensi
        </button>
      </div>

      {message && (
        <div className={cn(
          "p-4 rounded-2xl flex items-center gap-3 font-medium",
          message.type === 'success' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
        )}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Cari nama atau NISN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-light outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter className="text-slate-400" size={20} />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-light outline-none min-w-[150px]"
          >
            <option value="Semua">Semua Kelas</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 font-bold text-slate-700">NISN</th>
                <th className="px-6 py-4 font-bold text-slate-700">Nama Siswa</th>
                <th className="px-6 py-4 font-bold text-slate-700">Kelas</th>
                <th className="px-6 py-4 font-bold text-slate-700 text-center">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-500 font-mono text-sm">{student.nisn}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{student.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase">
                      {student.class}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {[
                        { status: 'hadir', icon: <CheckCircle2 size={18} />, color: 'hover:bg-emerald-50 hover:text-emerald-600', active: 'bg-emerald-600 text-white' },
                        { status: 'izin', icon: <Clock size={18} />, color: 'hover:bg-blue-50 hover:text-blue-600', active: 'bg-blue-600 text-white' },
                        { status: 'sakit', icon: <AlertCircle size={18} />, color: 'hover:bg-amber-50 hover:text-amber-600', active: 'bg-amber-600 text-white' },
                        { status: 'alpa', icon: <XCircle size={18} />, color: 'hover:bg-red-50 hover:text-red-600', active: 'bg-red-600 text-white' },
                      ].map((opt) => (
                        <button
                          key={opt.status}
                          onClick={() => handleStatusChange(student.id, opt.status as any)}
                          title={opt.status.toUpperCase()}
                          className={cn(
                            "p-2 rounded-lg transition-all",
                            attendance[student.id] === opt.status ? opt.active : `text-slate-400 ${opt.color}`
                          )}
                        >
                          {opt.icon}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <Users className="mx-auto mb-4 opacity-20" size={48} />
                    Tidak ada siswa ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
