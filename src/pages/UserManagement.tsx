import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';
import { 
  Users, 
  Shield, 
  User, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  MoreVertical
} from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('role', { ascending: true });
    
    if (error) setError(error.message);
    if (data) setUsers(data);
    setLoading(false);
  };

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'guru' : 'admin';
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) throw error;
      await fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah role.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Manajemen Pengguna</h1>
        <p className="text-slate-500 mt-1">Kelola hak akses admin dan guru di aplikasi.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

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
                  <th className="px-6 py-4 font-bold text-slate-700">Nama Pengguna</th>
                  <th className="px-6 py-4 font-bold text-slate-700">Role</th>
                  <th className="px-6 py-4 font-bold text-slate-700">Terdaftar Pada</th>
                  <th className="px-6 py-4 font-bold text-slate-700 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                          <User size={20} />
                        </div>
                        <span className="font-bold text-slate-900">{user.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.role === 'admin' ? (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-dark text-white rounded-full text-xs font-bold uppercase">
                            <Shield size={12} />
                            Admin
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase">
                            <Users size={12} />
                            Guru
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => toggleRole(user.id, user.role)}
                          className="px-4 py-2 text-sm font-bold text-brand-light hover:bg-brand-light/5 rounded-xl transition-all"
                        >
                          Ubah Role
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 flex items-start gap-4">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 text-amber-600 shadow-sm">
          <AlertCircle size={24} />
        </div>
        <div>
          <h4 className="font-bold text-amber-900 mb-1">Peringatan Keamanan</h4>
          <p className="text-amber-800 leading-relaxed opacity-80">
            Perubahan role admin memberikan akses penuh ke seluruh data aplikasi. Pastikan Anda hanya memberikan role admin kepada personel yang berwenang.
          </p>
        </div>
      </div>
    </div>
  );
}
