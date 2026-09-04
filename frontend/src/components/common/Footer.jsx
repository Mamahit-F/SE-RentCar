import React from 'react';
import { Car, Heart, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-warm-200/80 bg-white text-ink-secondary text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-midnight-900 flex items-center justify-center text-lime shadow-subtle">
                <Car className="h-5 w-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-extrabold text-ink-primary tracking-tight">RentCar Minut</span>
            </div>
            <p className="text-ink-secondary max-w-md text-xs leading-relaxed">
              Platform mobilitas digital terverifikasi. Menghubungkan pelanggan dengan penyedia sewa mobil terpercaya di seluruh Indonesia dengan sistem pemesanan aman, harga transparan, dan armada siap jalan.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warm-100 border border-warm-300 text-[11px] font-semibold text-ink-primary">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Jaringan Mitra Rental Terverifikasi
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-ink-primary uppercase tracking-wider">Eksplorasi</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/cars" className="hover:text-midnight-900 transition flex items-center gap-1">
                  Discover Armada Mobil
                </Link>
              </li>
              <li>
                <Link to="/rentals" className="hover:text-midnight-900 transition flex items-center gap-1">
                  Daftar Tempat Rental
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-midnight-900 transition flex items-center gap-1">
                  Daftar Sebagai Mitra
                </Link>
              </li>
              <li>
                <a href="http://localhost:8080/swagger-ui/index.html" target="_blank" rel="noreferrer" className="hover:text-midnight-900 transition inline-flex items-center gap-1">
                  API Docs (Swagger) <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Academic Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-ink-primary uppercase tracking-wider">Informasi Project</h4>
            <ul className="space-y-2 text-[11px]">
              <li className="text-ink-primary font-medium">Software Engineering</li>
              <li>Sistem Partnership Rental Mobil</li>
              <li>Tech Stack: React · Spring Boot · PostgreSQL</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-warm-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-ink-muted">
          <p>© 2026 RentCar Minut Digital Mobility Platform. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
            <span>Dirancang untuk kemudahan mobilitas modern</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
