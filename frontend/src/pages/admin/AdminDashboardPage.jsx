import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  Car, 
  Calendar, 
  FileCheck, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  AlertCircle
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
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-warm-200 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-ink-primary tracking-tight">Pusat Kontrol Administrator</h1>
            <p className="text-xs text-ink-secondary">Ringkasan operasional platform kemitraan rental mobil dan verifikasi izin mitra</p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
            <ShieldCheck className="h-4 w-4 text-amber-600" /> Mode Super Admin
          </div>
        </div>

        {/* Verification Alert Banner */}
        {stats?.pendingApplications > 0 && (
          <div className="bg-amber-50 border border-amber-300 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-900 shadow-subtle">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-200/60 rounded-xl text-amber-900 shrink-0 mt-0.5">
                <Clock className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-extrabold text-amber-950">
                  {stats.pendingApplications} Permohonan Tempat Rental Menunggu Verifikasi
                </h4>
                <p className="text-xs text-amber-800">
                  Segera periksa kelengkapan NIB dan keabsahan dokumen izin usaha mitra rental baru.
                </p>
              </div>
            </div>

            <Link
              to="/admin/applications"
              className="inline-flex items-center gap-2 bg-midnight-900 hover:bg-midnight-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-card transition shrink-0"
            >
              Tinjau Permohonan <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {/* Top KPI Grid */}
        {loading ? (
          <LoadingSpinner text="Memuat statistik platform..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white border border-warm-300 p-6 rounded-3xl space-y-3 shadow-subtle">
              <div className="flex items-center justify-between text-ink-secondary text-xs font-bold">
                <span>Total Pengguna</span>
                <div className="p-2.5 rounded-xl bg-warm-100 text-midnight-900">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-ink-primary">{stats?.totalUsers || 0}</p>
              <p className="text-[11px] text-ink-secondary">Pelanggan & Mitra terdaftar</p>
            </div>

            <div className="bg-white border border-warm-300 p-6 rounded-3xl space-y-3 shadow-subtle">
              <div className="flex items-center justify-between text-ink-secondary text-xs font-bold">
                <span>Tempat Rental</span>
                <div className="p-2.5 rounded-xl bg-warm-100 text-midnight-900">
                  <Building2 className="h-4 w-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-ink-primary">{stats?.totalRentals || 0}</p>
              <p className="text-[11px] text-ink-secondary">{stats?.activeRentals || 0} berstatus aktif</p>
            </div>

            <div className="bg-white border border-warm-300 p-6 rounded-3xl space-y-3 shadow-subtle">
              <div className="flex items-center justify-between text-ink-secondary text-xs font-bold">
                <span>Total Armada Mobil</span>
                <div className="p-2.5 rounded-xl bg-warm-100 text-midnight-900">
                  <Car className="h-4 w-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-ink-primary">{stats?.totalCars || 0}</p>
              <p className="text-[11px] text-ink-secondary">{stats?.activeCars || 0} unit aktif di platform</p>
            </div>

            <div className="bg-white border border-warm-300 p-6 rounded-3xl space-y-3 shadow-subtle">
              <div className="flex items-center justify-between text-ink-secondary text-xs font-bold">
                <span>Total Booking Sewa</span>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                  <Calendar className="h-4 w-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-emerald-700">{stats?.totalBookings || 0}</p>
              <p className="text-[11px] text-ink-secondary">Transaksi pemesanan rental</p>
            </div>
          </div>
        )}

        {/* Operational Management Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link
            to="/admin/applications"
            className="bg-white border border-warm-300 hover:border-midnight-900 p-6 rounded-3xl transition-all duration-200 space-y-3 group shadow-subtle hover:shadow-card"
          >
            <div className="p-3 bg-amber-50 text-amber-800 rounded-2xl w-fit group-hover:scale-105 transition">
              <FileCheck className="h-6 w-6 stroke-[2]" />
            </div>
            <h3 className="text-base font-extrabold text-ink-primary group-hover:text-midnight-900 transition">Verifikasi Mitra</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Tinjau permohonan pendaftaran rental baru, cek berkas legalitas, dan berikan persetujuan.
            </p>
          </Link>

          <Link
            to="/admin/rentals"
            className="bg-white border border-warm-300 hover:border-midnight-900 p-6 rounded-3xl transition-all duration-200 space-y-3 group shadow-subtle hover:shadow-card"
          >
            <div className="p-3 bg-warm-100 text-midnight-900 rounded-2xl w-fit group-hover:scale-105 transition">
              <Building2 className="h-6 w-6 stroke-[2]" />
            </div>
            <h3 className="text-base font-extrabold text-ink-primary group-hover:text-midnight-900 transition">Semua Tempat Rental</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Moderasi status aktif/nonaktif tempat rental mitra di seluruh kota di Indonesia.
            </p>
          </Link>

          <Link
            to="/admin/users"
            className="bg-white border border-warm-300 hover:border-midnight-900 p-6 rounded-3xl transition-all duration-200 space-y-3 group shadow-subtle hover:shadow-card"
          >
            <div className="p-3 bg-warm-100 text-midnight-900 rounded-2xl w-fit group-hover:scale-105 transition">
              <Users className="h-6 w-6 stroke-[2]" />
            </div>
            <h3 className="text-base font-extrabold text-ink-primary group-hover:text-midnight-900 transition">Kelola Pengguna</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Daftar seluruh akun pelanggan, mitra rental, serta pengaturan status aktif pengguna.
            </p>
          </Link>

          <Link
            to="/admin/bookings"
            className="bg-white border border-warm-300 hover:border-midnight-900 p-6 rounded-3xl transition-all duration-200 space-y-3 group shadow-subtle hover:shadow-card"
          >
            <div className="p-3 bg-warm-100 text-midnight-900 rounded-2xl w-fit group-hover:scale-105 transition">
              <Calendar className="h-6 w-6 stroke-[2]" />
            </div>
            <h3 className="text-base font-extrabold text-ink-primary group-hover:text-midnight-900 transition">Audit Booking</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Pantau seluruh riwayat transaksi sewa dan kuitansi pembayaran secara real-time.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
