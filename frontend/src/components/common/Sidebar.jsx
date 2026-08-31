import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Calendar, 
  Building2, 
  Users, 
  FileCheck, 
  ShieldCheck,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { role, isAdmin, isPartner } = useAuth();

  const partnerLinks = [
    { to: '/partner/dashboard', label: 'Ringkasan Bisnis', icon: LayoutDashboard },
    { to: '/partner/rental', label: 'Profil Tempat Rental', icon: Building2 },
    { to: '/partner/cars', label: 'Kelola Armada Mobil', icon: Car },
    { to: '/partner/bookings', label: 'Kelola Pesanan Masuk', icon: Calendar },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Ringkasan Platform', icon: LayoutDashboard },
    { to: '/admin/applications', label: 'Verifikasi Mitra Rental', icon: FileCheck },
    { to: '/admin/rentals', label: 'Semua Tempat Rental', icon: Building2 },
    { to: '/admin/users', label: 'Kelola Pengguna', icon: Users },
    { to: '/admin/bookings', label: 'Monitoring Booking', icon: Calendar },
  ];

  const links = isAdmin ? adminLinks : isPartner ? partnerLinks : [];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 p-4 space-y-6 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="px-3 py-2 bg-slate-900/60 rounded-xl border border-slate-800/80">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
          {isAdmin ? '🛡️ Administrator' : '🏢 Mitra Rental'}
        </span>
        <p className="text-sm font-bold text-white truncate">
          {isAdmin ? 'Pusat Kontrol Sistem' : 'Portal Manajemen Mitra'}
        </p>
      </div>

      <nav className="space-y-1 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin/dashboard' || link.to === '/partner/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-900">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              isActive
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`
          }
        >
          <Settings className="h-4 w-4 shrink-0" />
          Pengaturan Akun
        </NavLink>
      </div>
    </aside>
  );
}
