import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Car, 
  MapPin, 
  Users, 
  Fuel, 
  Gauge, 
  Calendar, 
  ShieldCheck, 
  CreditCard, 
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Building2,
  Info
} from 'lucide-react';
import { publicCarService, bookingService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, isCustomer } = useAuth();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking Form State
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const afterTomorrow = new Date();
  afterTomorrow.setDate(afterTomorrow.getDate() + 3);

  const [startDate, setStartDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(afterTomorrow.toISOString().split('T')[0]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      try {
        const res = await publicCarService.getCarById(id);
        setCar(res?.data || null);
      } catch (err) {
        setError(err?.message || 'Gagal memuat detail mobil');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  // Calculate rental duration & price preview
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const days = calculateDays();
  const estimatedPrice = car ? Number(car.pricePerDay) * (days > 0 ? days : 1) : 0;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError(null);

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/cars/${id}` } } });
      return;
    }

    if (days <= 0) {
      setBookingError('Tanggal selesai harus setelah tanggal mulai rental');
      return;
    }

    setBookingLoading(true);

    try {
      const res = await bookingService.createBooking({
        carId: Number(id),
        startDate: startDate,
        endDate: endDate,
      });

      setBookingSuccess(true);
      setTimeout(() => {
        navigate('/my-bookings');
      }, 1500);
    } catch (err) {
      setBookingError(err?.message || 'Gagal membuat booking mobil');
    } finally {
      setBookingLoading(false);
    }
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  if (loading) {
    return <LoadingSpinner text="Memuat spesifikasi mobil..." />;
  }

  if (error || !car) {
    return (
      <div className="py-12 space-y-4 max-w-lg mx-auto text-center">
        <EmptyState
          icon={Car}
          title="Mobil Tidak Ditemukan"
          description={error || 'Mobil mungkin sedang tidak aktif atau ID salah.'}
          action={
            <Link to="/rentals" className="inline-flex items-center gap-2 text-xs font-bold text-blue-400">
              <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Rental
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6">
      <Link to={`/rentals/${car.rentalPlaceId}`} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
        <ArrowLeft className="h-4 w-4" /> Kembali ke {car.rentalPlaceName}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Car Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Image Banner */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="h-80 sm:h-96 bg-slate-900 overflow-hidden">
              <img
                src={car.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold text-blue-400 border border-slate-800">
              {car.type || 'Mobil Penumpang'}
            </div>
          </div>

          {/* Car Info & Specs */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{car.brand}</span>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Siap Disewa
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{car.model} ({car.year})</h1>
              <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
                Disediakan oleh <Link to={`/rentals/${car.rentalPlaceId}`} className="text-blue-400 font-semibold hover:underline">{car.rentalPlaceName}</Link> ({car.rentalPlaceCity})
              </p>
            </div>

            {/* Spec Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-900">
              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-medium uppercase">Transmisi</span>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Gauge className="h-4 w-4 text-blue-400" />
                  {car.transmission || 'Automatic'}
                </p>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-medium uppercase">Kapasitas</span>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-emerald-400" />
                  {car.seats} Penumpang
                </p>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-medium uppercase">Kapasitas Mesin</span>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Fuel className="h-4 w-4 text-amber-400" />
                  {car.cc ? `${car.cc} cc` : '1500 cc'}
                </p>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-medium uppercase">Warna Mobil</span>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-purple-400" />
                  {car.color || 'Hitam'}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">Deskripsi & Fasilitas Armada</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {car.description || 'Armada mobil dalam kondisi prima, selalu diservis rutin di bengkel resmi, interior bersih wangi dan AC dingin.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Booking Sticky Box */}
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 sticky top-24">
            <div className="space-y-1">
              <span className="text-xs text-slate-400">Harga Sewa Harian</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                {formatRupiah(car.pricePerDay)}
                <span className="text-xs font-normal text-slate-400"> /hari</span>
              </p>
            </div>

            {bookingSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-300">Booking Berhasil Dibuat!</h4>
                <p className="text-xs text-slate-400">Mengarahkan Anda ke halaman pesanan untuk simulasi pembayaran...</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {bookingError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
                    <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{bookingError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-blue-400" /> Tanggal Mulai Rental
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-blue-400" /> Tanggal Selesai Rental
                  </label>
                  <input
                    type="date"
                    required
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                {/* Price Breakdown Calculation */}
                <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Durasi Sewa:</span>
                    <span className="font-semibold text-slate-200">{days > 0 ? `${days} Hari` : 'Pilih tanggal valid'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Tarif per hari:</span>
                    <span className="font-semibold text-slate-200">{formatRupiah(car.pricePerDay)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white text-sm">
                    <span>Total Estimasi:</span>
                    <span className="text-emerald-400">{formatRupiah(estimatedPrice)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading || days <= 0}
                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition"
                >
                  <CreditCard className="h-4 w-4" />
                  {bookingLoading ? 'Memproses Pesanan...' : 'Pesan & Lanjutkan Bayar'}
                </button>

                <p className="text-[11px] text-center text-slate-500 leading-tight">
                  ⚡ Anti Overlap: Sistem secara otomatis memeriksa ketersediaan tanggal sebelum pemesanan disimpan.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
