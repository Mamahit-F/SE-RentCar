import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Car, 
  User as UserIcon, 
  LogOut, 
  Calendar, 
  Building2, 
  ShieldCheck, 
  Menu, 
  X,
  Compass,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from './Badge';

export default function Navbar() {
  const { user, isAuthenticated, logout, role, isAdmin, isPartner } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-warm-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo - RentCar Minut Style */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-midnight-900 flex items-center justify-center text-lime shadow-md shadow-midnight-900/10 group-hover:scale-105 transition-transform duration-200">
            <Car className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-ink-primary flex items-center gap-1.5">
              RentCar Minut <span className=""></span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links - Center Pills */}
        <nav className="hidden md:flex items-center gap-1.5 bg-warm-100/90 p-1.5 rounded-full border border-warm-200 text-xs font-semibold">
          <NavLink 
            to="/cars" 
            className={({ isActive }) => 
              `px-4 py-2 rounded-full transition-all duration-200 ${
                isActive 
                  ? 'bg-white text-ink-primary shadow-subtle font-bold border border-warm-200' 
                  : 'text-ink-secondary hover:text-ink-primary hover:bg-white/60'
              }`
            }
          >
            Discover
          </NavLink>
          <NavLink 
            to="/rentals" 
            className={({ isActive }) => 
              `px-4 py-2 rounded-full transition-all duration-200 ${
                isActive 
                  ? 'bg-white text-ink-primary shadow-subtle font-bold border border-warm-200' 
                  : 'text-ink-secondary hover:text-ink-primary hover:bg-white/60'
              }`
            }
          >
            Tempat Rental
          </NavLink>
          {isAuthenticated && !isAdmin && !isPartner && (
            <NavLink 
              to="/my-bookings" 
              className={({ isActive }) => 
                `px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                  isActive 
                    ? 'bg-white text-ink-primary shadow-subtle font-bold border border-warm-200' 
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-white/60'
                }`
              }
            >
              <Calendar className="h-3.5 w-3.5 text-midnight-900" />
              Pesanan Saya
            </NavLink>
          )}
          {isPartner && (
            <NavLink 
              to="/partner/dashboard" 
              className={({ isActive }) => 
                `px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                  isActive 
                    ? 'bg-midnight-900 text-white shadow-subtle font-bold' 
                    : 'text-midnight-900 font-bold hover:bg-white/80'
                }`
              }
            >
              <Building2 className="h-3.5 w-3.5 text-lime" />
              Portal Partner
            </NavLink>
          )}
          {isAdmin && (
            <NavLink 
              to="/admin/dashboard" 
              className={({ isActive }) => 
                `px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                  isActive 
                    ? 'bg-midnight-900 text-white shadow-subtle font-bold' 
                    : 'text-midnight-900 font-bold hover:bg-white/80'
                }`
              }
            >
              <ShieldCheck className="h-3.5 w-3.5 text-lime" />
              Panel Admin
            </NavLink>
          )}
        </nav>

        {/* User Auth Buttons / Profile Menu */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-ink-primary leading-tight">{user?.name}</p>
                <div className="flex justify-end mt-0.5">
                  <Badge status={role} />
                </div>
              </div>
              <Link 
                to="/profile"
                className="h-10 w-10 rounded-full bg-warm-100 hover:bg-warm-200 text-ink-primary transition flex items-center justify-center border border-warm-300"
                title="Profil Pengguna"
              >
                <UserIcon className="h-4 w-4 stroke-[2.2]" />
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-2.5 rounded-xl transition border border-rose-200"
                title="Keluar Akun"
              >
                <LogOut className="h-3.5 w-3.5" />
                Keluar
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs font-bold text-ink-primary hover:text-midnight-900 px-4 py-2.5 rounded-xl transition hover:bg-warm-100"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-xs font-bold bg-midnight-900 hover:bg-midnight-800 text-white px-5 py-2.5 rounded-xl shadow-card transition duration-200"
              >
                Daftar Sekarang
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl text-ink-primary hover:bg-warm-100 transition border border-warm-200"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-warm-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-card">
          <nav className="flex flex-col space-y-2 text-sm font-semibold">
            <Link 
              to="/cars" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-ink-primary hover:bg-warm-100 p-2.5 rounded-xl transition"
            >
              Discover / Cari Mobil
            </Link>
            <Link 
              to="/rentals" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-ink-primary hover:bg-warm-100 p-2.5 rounded-xl transition"
            >
              Tempat Rental
            </Link>
            {isAuthenticated && !isAdmin && !isPartner && (
              <Link 
                to="/my-bookings" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-ink-primary hover:bg-warm-100 p-2.5 rounded-xl transition flex items-center gap-2"
              >
                <Calendar className="h-4 w-4 text-midnight-900" />
                Pesanan Saya
              </Link>
            )}
            {isPartner && (
              <Link 
                to="/partner/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-midnight-900 font-bold bg-warm-100 p-2.5 rounded-xl flex items-center gap-2"
              >
                <Building2 className="h-4 w-4 text-midnight-900" />
                Portal Partner
              </Link>
            )}
            {isAdmin && (
              <Link 
                to="/admin/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-midnight-900 font-bold bg-warm-100 p-2.5 rounded-xl flex items-center gap-2"
              >
                <ShieldCheck className="h-4 w-4 text-midnight-900" />
                Panel Admin
              </Link>
            )}
          </nav>

          <div className="pt-4 border-t border-warm-200">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-ink-primary">{user?.name}</p>
                    <p className="text-xs text-ink-secondary">{user?.email}</p>
                  </div>
                  <Badge status={role} />
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center text-xs font-bold bg-warm-100 text-ink-primary py-2.5 rounded-xl border border-warm-300"
                  >
                    Profil
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 text-center text-xs font-bold bg-rose-50 text-rose-700 py-2.5 rounded-xl border border-rose-200"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-xs font-bold bg-warm-100 text-ink-primary py-3 rounded-xl border border-warm-300"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-xs font-bold bg-midnight-900 text-white py-3 rounded-xl shadow-card"
                >
                  Daftar Sekarang
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
