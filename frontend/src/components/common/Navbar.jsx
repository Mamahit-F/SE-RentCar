import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Car, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  Calendar, 
  Building2, 
  ShieldCheck, 
  Menu, 
  X,
  PlusCircle,
  FileText
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
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-105 transition">
            <Car className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              AutoPartner <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">Pro</span>
            </span>
            <p className="text-xs text-slate-400">Sistem Partnership Rental Mobil</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/rentals" className="text-slate-300 hover:text-white transition">
            Tempat Rental
          </Link>
          <Link to="/cars" className="text-slate-300 hover:text-white transition">
            Cari Mobil
          </Link>
          {isAuthenticated && !isAdmin && !isPartner && (
            <Link to="/my-bookings" className="text-slate-300 hover:text-white transition flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-blue-400" />
              Pesanan Saya
            </Link>
          )}
          {isPartner && (
            <Link to="/partner/dashboard" className="text-amber-400 hover:text-amber-300 transition flex items-center gap-1.5 font-semibold">
              <Building2 className="h-4 w-4" />
              Portal Partner
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin/dashboard" className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="h-4 w-4" />
              Panel Admin
            </Link>
          )}
        </nav>

        {/* User Auth Buttons / Profile Menu */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-white">{user?.name}</p>
                <div className="flex justify-end mt-0.5">
                  <Badge status={role} />
                </div>
              </div>
              <Link 
                to="/profile"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
                title="Profil Pengguna"
              >
                <UserIcon className="h-4 w-4" />
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-3 py-2 rounded-xl transition border border-rose-500/20"
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
                className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl transition hover:bg-slate-800"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl shadow-md shadow-blue-600/20 transition"
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
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-sm font-medium">
            <Link 
              to="/rentals" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white transition py-1"
            >
              Tempat Rental
            </Link>
            <Link 
              to="/cars" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white transition py-1"
            >
              Cari Mobil
            </Link>
            {isAuthenticated && !isAdmin && !isPartner && (
              <Link 
                to="/my-bookings" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white transition py-1 flex items-center gap-2"
              >
                <Calendar className="h-4 w-4 text-blue-400" />
                Pesanan Saya
              </Link>
            )}
            {isPartner && (
              <Link 
                to="/partner/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-amber-400 font-semibold py-1 flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" />
                Portal Partner
              </Link>
            )}
            {isAdmin && (
              <Link 
                to="/admin/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-emerald-400 font-semibold py-1 flex items-center gap-2"
              >
                <ShieldCheck className="h-4 w-4" />
                Panel Admin
              </Link>
            )}
          </nav>

          <div className="pt-4 border-t border-slate-800">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">{user?.name}</p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                  </div>
                  <Badge status={role} />
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center text-xs font-semibold bg-slate-800 text-slate-200 py-2 rounded-xl border border-slate-700"
                  >
                    Profil
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 text-center text-xs font-semibold bg-rose-500/10 text-rose-400 py-2 rounded-xl border border-rose-500/20"
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
                  className="w-full text-center text-xs font-semibold bg-slate-800 text-slate-200 py-2.5 rounded-xl border border-slate-700"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-xs font-semibold bg-blue-600 text-white py-2.5 rounded-xl shadow-md"
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
