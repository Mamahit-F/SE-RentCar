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
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { partnerService } from '../../services/api';
import Sidebar from '../../components/common/Sidebar';
import Badge from '../../components/common/Badge';
import RatingStars from '../../components/common/RatingStars';
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
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Portal Manajemen Mitra Rental</h1>
            <p className="text-xs text-slate-400">Pantau performa armada mobil dan kelola pesanan masuk pelanggan</p>
          </div>

          {primaryRental?.status === 'ACTIVE' && (
            <Link
              to="/partner/cars"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition self-start sm:self-auto"
            >
              <PlusCircle className="h-4 w-4" />
              Tambah Armada Baru
            </Link>
          )}
        </div>

        {/* Application Status Banner */}
        {!primaryRental ? (
          <div className="bg-gradient-to-r from-purple-950/60 to-slate-950 border border-purple-800/60 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-purple-400" />
              <h3 className="text-base font-bold text-white">Anda Belum Mengajukan Tempat Rental</h3>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Daftarkan profil bisnis tempat rental Anda beserta dokumen legalitas agar dapat diverifikasi oleh admin dan mulai menerima pesanan sewa mobil.
            </p>
            <Link
              to="/partner/rental"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition mt-2"
            >
              Ajukan Tempat Rental Sekarang <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : primaryRental.status === 'PENDING' ? (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 space-y-2">
            <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
              <Clock className="h-5 w-5" />
              Pengajuan Tempat Rental Sedang Dalam Proses Verifikasi Admin
            </div>
            <p className="text-xs text-slate-300">
              Tempat rental: <strong className="text-white">{primaryRental.name}</strong> ({primaryRental.city}). Tim verifikator kami sedang meninjau kelengkapan dokumen perizinan Anda. Anda akan dapat menambah armada dan menerima booking setelah status menjadi <strong>ACTIVE</strong>.
            </p>
          </div>
        ) : primaryRental.status === 'REJECTED' ? (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2.5 text-rose-400 font-bold text-sm">
              <AlertCircle className="h-5 w-5" />
              Pengajuan Tempat Rental Ditolak
            </div>
            <p className="text-xs text-rose-200">
              Alasan Penolakan: <strong className="text-white">{primaryRental.rejectionReason || 'Dokumen belum lengkap / tidak valid'}</strong>
            </p>
            <Link
              to="/partner/rental"
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
            >
              Perbarui Data & Ajukan Ulang
            </Link>
          </div>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
              <div>
                <h4 className="text-sm font-bold text-white">{primaryRental.name}</h4>
                <p className="text-xs text-slate-400">Status: <span className="text-emerald-400 font-semibold">Aktif & Terverifikasi</span> ({primaryRental.city})</p>
              </div>
            </div>
            <Link to="/partner/rental" className="text-xs text-blue-400 font-semibold hover:underline">
              Kelola Profil Rental →
            </Link>
          </div>
        )}

        {/* Dashboard Counter Cards */}
        {loading ? (
          <LoadingSpinner text="Memuat statistik mitra..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Total Armada</span>
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Car className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-white">{stats?.totalCars || 0}</p>
              <p className="text-[11px] text-slate-400">{stats?.availableCars || 0} mobil siap sewa</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Pesanan Menunggu</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-amber-400">{stats?.pendingBookings || 0}</p>
              <p className="text-[11px] text-slate-400">Perlu konfirmasi / diproses</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Pesanan Berhasil</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-emerald-400">{stats?.completedBookings || 0}</p>
              <p className="text-[11px] text-slate-400">{stats?.confirmedBookings || 0} sedang berlangsung</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Penilaian & Rating</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Star className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-extrabold text-white">{stats?.averageRating || 0}</p>
                <span className="text-xs text-slate-400">/ 5.0</span>
              </div>
              <p className="text-[11px] text-slate-400">{stats?.totalReviews || 0} ulasan pelanggan</p>
            </div>
          </div>
        )}

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/partner/cars"
            className="bg-slate-950 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition space-y-3 group shadow-lg"
          >
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit group-hover:scale-110 transition">
              <Car className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition">Kelola Armada Mobil</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tambah mobil baru, atur tarif sewa harian, kelola transmisi dan status ketersediaan armada.
            </p>
          </Link>

          <Link
            to="/partner/bookings"
            className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl transition space-y-3 group shadow-lg"
          >
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit group-hover:scale-110 transition">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition">Pesanan Masuk</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Konfirmasi pesanan dari pelanggan, pantau jadwal sewa, dan selesaikan sewa setelah mobil dikembalikan.
            </p>
          </Link>

          <Link
            to="/partner/rental"
            className="bg-slate-950 border border-slate-800 hover:border-purple-500/50 p-6 rounded-2xl transition space-y-3 group shadow-lg"
          >
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit group-hover:scale-110 transition">
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition">Profil Tempat Rental</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ubah alamat operasional, nomor kontak, izin usaha (NIB), dan link dokumen legalitas rental.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
