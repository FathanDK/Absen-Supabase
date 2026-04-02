import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, CheckCircle, Users, BarChart3, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-gradient rounded-xl flex items-center justify-center text-white shadow-lg">
            <CheckCircle size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">Hadirin</span>
        </div>
        <Link 
          to="/login" 
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-gradient text-white rounded-full font-medium hover:opacity-90 transition-all shadow-md hover:shadow-lg"
        >
          <LogIn size={18} />
          Masuk
        </Link>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
                Revolusi <span className="text-brand-light">Absensi Digital</span> untuk Sekolah Masa Depan.
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                Hadirin adalah platform manajemen kehadiran cerdas yang dirancang khusus untuk menyederhanakan proses administrasi guru dan siswa. Cepat, akurat, dan transparan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/login" 
                  className="px-8 py-4 bg-brand-gradient text-white rounded-xl font-bold text-lg text-center shadow-xl hover:scale-105 transition-transform"
                >
                  Mulai Sekarang
                </Link>
                <a 
                  href="#features" 
                  className="px-8 py-4 bg-slate-100 text-slate-700 rounded-xl font-bold text-lg text-center hover:bg-slate-200 transition-colors"
                >
                  Pelajari Fitur
                </a>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-10">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-light rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/2 w-64 h-64 bg-brand-sky rounded-full blur-3xl"></div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Mengapa Memilih Hadirin?</h2>
            <p className="text-slate-600">Solusi lengkap untuk kebutuhan absensi harian di lingkungan pendidikan.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheck className="text-brand-light" size={32} />,
                title: "Keamanan Terjamin",
                desc: "Data absensi tersimpan aman di cloud dengan enkripsi tingkat tinggi."
              },
              {
                icon: <Users className="text-brand-light" size={32} />,
                title: "Manajemen Terintegrasi",
                desc: "Kelola data guru, siswa, dan kelas dalam satu dashboard yang intuitif."
              },
              {
                icon: <BarChart3 className="text-brand-light" size={32} />,
                title: "Rekap Otomatis",
                desc: "Dapatkan laporan kehadiran harian, mingguan, hingga bulanan secara instan."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center text-white">
              <CheckCircle size={18} />
            </div>
            <span className="text-xl font-bold text-slate-900">Hadirin</span>
          </div>
          <p className="text-slate-500">© 2026 Hadirin Digital Attendance. Semua Hak Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
