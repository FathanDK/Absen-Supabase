import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  ClipboardList, 
  GraduationCap, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  CheckCircle,
  ShieldCheck
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AppLayout() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const menuItems = [
    { 
      title: 'Dashboard', 
      path: '/app', 
      icon: <LayoutDashboard size={20} />,
      roles: ['admin', 'guru']
    },
    { 
      title: 'Absensi Guru', 
      path: '/app/absensi-guru', 
      icon: <UserCheck size={20} />,
      roles: ['admin', 'guru']
    },
    { 
      title: 'Absensi Siswa', 
      path: '/app/absensi-siswa', 
      icon: <Users size={20} />,
      roles: ['admin', 'guru']
    },
    { 
      title: 'Rekap Absensi', 
      path: '/app/rekap', 
      icon: <ClipboardList size={20} />,
      roles: ['admin', 'guru'],
      subItems: [
        { title: 'Absensi Guru', path: '/app/rekap/guru', roles: ['admin'] },
        { title: 'Absensi Siswa', path: '/app/rekap/siswa', roles: ['admin', 'guru'] },
      ]
    },
    { 
      title: 'Data Siswa', 
      path: '/app/data-siswa', 
      icon: <GraduationCap size={20} />,
      roles: ['admin']
    },
    { 
      title: 'Manajemen User', 
      path: '/app/users', 
      icon: <ShieldCheck size={20} />,
      roles: ['admin']
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-light"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-brand-gradient text-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-2xl",
          !isSidebarOpen && "-translate-x-full lg:hidden"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 flex items-center justify-between">
            <Link to="/app" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                <CheckCircle size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tight">Hadirin</span>
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {menuItems.filter(item => item.roles.includes(profile?.role || '')).map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              
              return (
                <div key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                      isActive 
                        ? "bg-white text-brand-dark shadow-lg" 
                        : "hover:bg-white/10 text-white/80 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(isActive ? "text-brand-light" : "text-white/60 group-hover:text-white")}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.title}</span>
                    </div>
                    {item.subItems && <ChevronRight size={16} className={cn(isActive ? "rotate-90" : "")} />}
                  </Link>

                  {/* Submenu */}
                  {item.subItems && isActive && (
                    <div className="mt-2 ml-6 space-y-1 border-l border-white/20 pl-4">
                      {item.subItems.filter(sub => sub.roles.includes(profile?.role || '')).map(sub => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className={cn(
                            "block py-2 px-4 rounded-lg text-sm transition-all",
                            location.pathname === sub.path
                              ? "bg-white/20 text-white font-semibold"
                              : "text-white/60 hover:text-white hover:bg-white/10"
                          )}
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center gap-3 p-3 bg-white/10 rounded-2xl">
              <div className="w-10 h-10 bg-brand-sky rounded-full flex items-center justify-center font-bold text-white uppercase">
                {profile?.full_name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{profile?.full_name}</p>
                <p className="text-xs text-white/60 capitalize">{profile?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-800 hidden md:block">
              {menuItems.find(item => location.pathname.startsWith(item.path))?.title || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-slate-800">{profile?.full_name}</span>
              <span className="text-xs text-slate-500 capitalize">{profile?.role}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <Outlet context={{ profile }} />
        </main>
      </div>
    </div>
  );
}
