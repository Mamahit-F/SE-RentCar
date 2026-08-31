import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  Car, 
  Calendar, 
  FileCheck, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { adminService } from '../../services/api';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true);
      try {
        const res = await adminService.getDashboardStats();
        setStats(res?.data || null);
      } catch (err) {
        console.error('Error fetching admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">Panel Kontrol Administrator</h1>
          <p className="text-xs text-slate-400">Ringkasan analitik dan pengawasan sistem platform AutoPartner</p>
        </div>

        {/* Pending Verification Notice */}
        {stats?.pendingApplications > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Terdapat {stats.pendingApplications} Pengajuan Mitra Rental Menunggu Verifikasi
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Tinjau berkas perizinan usaha dan lokasi garasi untuk mengaktifkan mitra rental.
                </p>
              </div>
            </div>
            <Link
              to="/admin/applications"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition shrink-0"
            >
              Verifikasi Sekarang <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Stats Counters */}
        {loading ? (
          <LoadingSpinner text="Memuat metrik platform..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Total Pengguna</span>
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-white">{stats?.totalUsers || 0}</p>
              <p className="text-[11px] text-slate-400">Customer terdaftar aktif</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Mitra Rental</span>
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Building2 className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-purple-400">{stats?.totalPartners || 0}</p>
              <p className="text-[11px] text-slate-400">{stats?.activeRentals || 0} rental aktif beroperasi</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Armada Mobil</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Car className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-emerald-400">{stats?.totalCars || 0}</p>
              <p className="text-[11px] text-slate-400">Mobil terdaftar di seluruh mitra</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Total Transaksi Booking</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Calendar className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-amber-400">{stats?.totalBookings || 0}</p>
              <p className="text-[11px] text-slate-400">Pesanan sewa di platform</p>
            </div>
          </div>
        )}

        {/* Quick Management Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/applications"
            className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl transition space-y-3 group shadow-lg"
          >
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit group-hover:scale-110 transition">
              <FileCheck className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition">Verifikasi Mitra</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tinjau dokumen legalitas (NIB, SIUP) dan verifikasi tempat rental baru agar dapat beroperasi.
            </p>
          </Link>

          <Link
            to="/admin/rentals"
            className="bg-slate-950 border border-slate-800 hover:border-purple-500/50 p-6 rounded-2xl transition space-y-3 group shadow-lg"
          >
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit group-hover:scale-110 transition">
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition">Kelola Semua Rental</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Moderasi tempat rental mitra, aktifkan atau nonaktifkan operasional mitra jika melanggar ketentuan.
            </p>
          </Link>

          <Link
            to="/admin/users"
            className="bg-slate-950 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition space-y-3 group shadow-lg"
          >
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit group-hover:scale-110 transition">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition">Kelola Pengguna</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Daftar seluruh akun pelanggan dan mitra rental serta pengelolaan status akun.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
