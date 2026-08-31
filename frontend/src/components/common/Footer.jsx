import React from 'react';
import { Car, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Car className="h-5 w-5" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">AutoPartner</span>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed">
              Platform kemitraan rental mobil terverifikasi. Menghubungkan pelanggan dengan penyedia sewa mobil terpercaya di seluruh Indonesia dengan sistem pemesanan aman, cepat, dan transparan.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Navigasi Utama</h4>
            <ul className="space-y-2">
              <li><Link to="/rentals" className="hover:text-white transition">Tempat Rental</Link></li>
              <li><Link to="/cars" className="hover:text-white transition">Armada Mobil</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Daftar Jadi Mitra Rental</Link></li>
              <li><a href="http://localhost:8080/swagger-ui/index.html" target="_blank" rel="noreferrer" className="hover:text-white transition">OpenAPI Swagger UI</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Informasi Akademik</h4>
            <ul className="space-y-2">
              <li>Mata Kuliah: Software Engineering</li>
              <li>Fakultas Ilmu Komputer (Semester 7)</li>
              <li>Topik: Sistem Partnership Rental Mobil</li>
              <li>Tech Stack: React + Spring Boot + PostgreSQL</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 AutoPartner Platform. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-2 text-xs">
            <span>Dibuat dengan</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>untuk Tugas Besar Rekayasa Perangkat Lunak</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
