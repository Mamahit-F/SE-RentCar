import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Calendar, 
  Building2, 
  Users, 
  FileCheck, 
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
    <aside className="w-64 bg-white border-r border-warm-200/90 p-5 space-y-6 flex flex-col shrink-0 min-h-[calc(100vh-5rem)]">
      {/* Role Header Card */}
      <div className="px-4 py-3 bg-midnight-900 text-white rounded-2xl shadow-subtle flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-lime block mb-0.5">
            {isAdmin ? '🛡️ Administrator' : '🏢 Mitra Rental'}
          </span>
          <p className="text-xs font-bold text-white truncate">
            {isAdmin ? 'Pusat Kontrol Sistem' : 'Portal Manajemen'}
          </p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="space-y-1.5 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin/dashboard' || link.to === '/partner/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-midnight-900 text-white shadow-subtle'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-warm-100'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0 stroke-[2]" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Account Settings */}
      <div className="pt-4 border-t border-warm-200">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              isActive
                ? 'bg-warm-100 text-ink-primary border border-warm-300'
                : 'text-ink-secondary hover:text-ink-primary hover:bg-warm-100'
            }`
          }
        >
          <Settings className="h-4 w-4 shrink-0 stroke-[2]" />
          Pengaturan Akun
        </NavLink>
      </div>
    </aside>
  );
}
