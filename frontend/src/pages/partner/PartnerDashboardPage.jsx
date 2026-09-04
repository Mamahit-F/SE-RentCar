import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Star, 
  Building2, 
  PlusCircle, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { partnerService } from '../../services/api';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function PartnerDashboardPage() {
  const [stats, setStats] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartnerData = async () => {
      setLoading(true);
      try {
        const [statsRes, rentalsRes] = await Promise.all([
          partnerService.getDashboardStats(),
          partnerService.getMyRentals(),
        ]);
        setStats(statsRes?.data || null);
        setRentals(rentalsRes?.data || []);
      } catch (err) {
        console.error('Error loading partner dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerData();
  }, []);

  const primaryRental = rentals.length > 0 ? rentals[0] : null;

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-warm-200 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-ink-primary tracking-tight">Portal Manajemen Mitra Rental</h1>
            <p className="text-xs text-ink-secondary">Pantau performa armada mobil dan kelola pesanan masuk pelanggan</p>
          </div>

          {primaryRental?.status === 'ACTIVE' && (
            <Link
              to="/partner/cars"
              className="inline-flex items-center gap-2 bg-midnight-900 hover:bg-midnight-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-card transition duration-200 self-start sm:self-auto"
            >
              <PlusCircle className="h-4 w-4" />
              Tambah Armada Baru
            </Link>
          )}
        </div>

        {/* Application Status Banner */}
        {!primaryRental ? (
          <div className="bg-midnight-900 text-white rounded-3xl p-7 space-y-3 shadow-card relative overflow-hidden">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-lime" />
              <h3 className="text-base font-extrabold text-white">Anda Belum Mengajukan Tempat Rental</h3>
            </div>
            <p className="text-xs text-warm-200/90 max-w-2xl leading-relaxed">
              Daftarkan profil bisnis tempat rental Anda beserta dokumen legalitas (NIB/SIUP) agar dapat diverifikasi oleh admin dan mulai menerima pesanan sewa mobil.
            </p>
            <div className="pt-2">
              <Link
                to="/partner/rental"
                className="inline-flex items-center gap-2 bg-lime hover:bg-lime-400 text-midnight-950 text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-lime-glow transition"
              >
                Ajukan Tempat Rental Sekarang <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : primaryRental.status === 'PENDING' ? (
          <div className="bg-amber-50 border border-amber-300 rounded-3xl p-6 space-y-2 text-amber-900 shadow-subtle">
            <div className="flex items-center gap-2.5 font-extrabold text-sm text-amber-900">
              <Clock className="h-5 w-5 text-amber-600" />
              Pengajuan Tempat Rental Sedang Dalam Proses Verifikasi Admin
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Tempat rental: <strong>{primaryRental.name}</strong> ({primaryRental.city}). Tim verifikator sedang meninjau dokumen perizinan Anda. Anda akan dapat menambah armada dan menerima booking setelah status menjadi <strong>ACTIVE</strong>.
            </p>
          </div>
        ) : primaryRental.status === 'REJECTED' ? (
          <div className="bg-rose-50 border border-rose-300 rounded-3xl p-6 space-y-3 text-rose-900 shadow-subtle">
            <div className="flex items-center gap-2.5 font-extrabold text-sm text-rose-900">
              <AlertCircle className="h-5 w-5 text-rose-600" />
              Pengajuan Tempat Rental Ditolak
            </div>
            <p className="text-xs text-rose-800">
              Alasan Penolakan: <strong>{primaryRental.rejectionReason || 'Dokumen belum lengkap / tidak valid'}</strong>
            </p>
            <Link
              to="/partner/rental"
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
            >
              Perbarui Data & Ajukan Ulang
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-warm-300 rounded-3xl p-5 flex items-center justify-between shadow-subtle">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-ink-primary">{primaryRental.name}</h4>
                <p className="text-xs text-ink-secondary">Status: <span className="text-emerald-700 font-bold">Aktif & Terverifikasi</span> ({primaryRental.city})</p>
              </div>
            </div>
            <Link to="/partner/rental" className="text-xs text-midnight-900 font-bold hover:underline">
              Kelola Profil Rental →
            </Link>
          </div>
        )}

        {/* Dashboard Counter Cards */}
        {loading ? (
          <LoadingSpinner text="Memuat statistik mitra..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white border border-warm-300 p-6 rounded-3xl space-y-3 shadow-subtle">
              <div className="flex items-center justify-between text-ink-secondary text-xs font-bold">
                <span>Total Armada</span>
                <div className="p-2.5 rounded-xl bg-warm-100 text-midnight-900">
                  <Car className="h-4 w-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-ink-primary">{stats?.totalCars || 0}</p>
              <p className="text-[11px] text-ink-secondary">{stats?.availableCars || 0} mobil siap jalan</p>
            </div>

            <div className="bg-white border border-warm-300 p-6 rounded-3xl space-y-3 shadow-subtle">
              <div className="flex items-center justify-between text-ink-secondary text-xs font-bold">
                <span>Pesanan Menunggu</span>
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-amber-600">{stats?.pendingBookings || 0}</p>
              <p className="text-[11px] text-ink-secondary">Perlu konfirmasi sewa</p>
            </div>

            <div className="bg-white border border-warm-300 p-6 rounded-3xl space-y-3 shadow-subtle">
              <div className="flex items-center justify-between text-ink-secondary text-xs font-bold">
                <span>Pesanan Berhasil</span>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-emerald-700">{stats?.completedBookings || 0}</p>
              <p className="text-[11px] text-ink-secondary">{stats?.confirmedBookings || 0} sedang berlangsung</p>
            </div>

            <div className="bg-white border border-warm-300 p-6 rounded-3xl space-y-3 shadow-subtle">
              <div className="flex items-center justify-between text-ink-secondary text-xs font-bold">
                <span>Rating Rata-rata</span>
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                  <Star className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-ink-primary">{stats?.averageRating || 0}</p>
                <span className="text-xs text-ink-secondary font-bold">/ 5.0</span>
              </div>
              <p className="text-[11px] text-ink-secondary">{stats?.totalReviews || 0} ulasan pelanggan</p>
            </div>
          </div>
        )}

        {/* Quick Management Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/partner/cars"
            className="bg-white border border-warm-300 hover:border-midnight-900 p-6 rounded-3xl transition-all duration-200 space-y-3 group shadow-subtle hover:shadow-card"
          >
            <div className="p-3 bg-warm-100 text-midnight-900 rounded-2xl w-fit group-hover:scale-105 transition">
              <Car className="h-6 w-6 stroke-[2]" />
            </div>
            <h3 className="text-base font-extrabold text-ink-primary group-hover:text-midnight-900 transition">Kelola Armada Mobil</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Tambah mobil baru, atur tarif sewa harian, kelola transmisi dan status ketersediaan armada.
            </p>
          </Link>

          <Link
            to="/partner/bookings"
            className="bg-white border border-warm-300 hover:border-midnight-900 p-6 rounded-3xl transition-all duration-200 space-y-3 group shadow-subtle hover:shadow-card"
          >
            <div className="p-3 bg-warm-100 text-midnight-900 rounded-2xl w-fit group-hover:scale-105 transition">
              <Calendar className="h-6 w-6 stroke-[2]" />
            </div>
            <h3 className="text-base font-extrabold text-ink-primary group-hover:text-midnight-900 transition">Pesanan Masuk</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Konfirmasi pesanan dari pelanggan, pantau jadwal sewa, dan selesaikan sewa setelah mobil dikembalikan.
            </p>
          </Link>

          <Link
            to="/partner/rental"
            className="bg-white border border-warm-300 hover:border-midnight-900 p-6 rounded-3xl transition-all duration-200 space-y-3 group shadow-subtle hover:shadow-card"
          >
            <div className="p-3 bg-warm-100 text-midnight-900 rounded-2xl w-fit group-hover:scale-105 transition">
              <Building2 className="h-6 w-6 stroke-[2]" />
            </div>
            <h3 className="text-base font-extrabold text-ink-primary group-hover:text-midnight-900 transition">Profil Tempat Rental</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Ubah alamat operasional, nomor kontak, izin usaha (NIB), dan tautan berkas dokumen rental.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
