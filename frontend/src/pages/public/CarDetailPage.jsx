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
  Info,
  Check,
  ChevronRight,
  Star
} from 'lucide-react';
import { publicCarService, bookingService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Booking Form State
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const afterTomorrow = new Date();
  afterTomorrow.setDate(afterTomorrow.getDate() + 4);

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
      await bookingService.createBooking({
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
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner text="Memuat spesifikasi kendaraan..." />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="py-16 space-y-4 max-w-lg mx-auto text-center">
        <EmptyState
          icon={Car}
          title="Mobil Tidak Ditemukan"
          description={error || 'Mobil mungkin sedang tidak aktif atau ID tidak sesuai.'}
          action={
            <Link to="/cars" className="inline-flex items-center gap-2 text-xs font-bold text-midnight-900 bg-warm-100 px-4 py-2 rounded-xl border border-warm-300">
              <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog Mobil
            </Link>
          }
        />
      </div>
    );
  }

  // Gallery images array
  const galleryImages = [
    car.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumbs — Matching Figma Image 3 */}
      <nav className="flex items-center gap-2 text-xs text-ink-secondary font-semibold">
        <Link to="/" className="hover:text-midnight-900 transition">Beranda</Link>
        <ChevronRight className="h-3 w-3 text-ink-muted" />
        <Link to="/cars" className="hover:text-midnight-900 transition">Discover</Link>
        <ChevronRight className="h-3 w-3 text-ink-muted" />
        <span className="text-ink-primary font-bold truncate">{car.brand} {car.model}</span>
      </nav>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column (8 cols): Photo Gallery + Specs & Info */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Hero Photo Gallery */}
          <div className="space-y-4">
            <div className="bg-white border border-warm-300 rounded-3xl overflow-hidden shadow-subtle h-[340px] sm:h-[460px] relative">
              <img
                src={galleryImages[activeImageIndex]}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shadow-subtle">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Siap Disewa
              </div>
            </div>

            {/* Thumbnail Row */}
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-20 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                    activeImageIndex === idx
                      ? 'border-midnight-900 shadow-card scale-[1.02]'
                      : 'border-warm-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Title & Badges Bar */}
          <div className="bg-white border border-warm-300 rounded-3xl p-6 sm:p-8 space-y-6 shadow-subtle">
            
            {/* Top Tag Pills & Rating Row (Figma Style) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-warm-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <Check className="h-3 w-3 stroke-[3]" /> Terverifikasi
                </span>
                <span className="inline-flex items-center text-xs font-bold text-midnight-900 bg-midnight-50 px-3 py-1 rounded-full border border-midnight-200">
                  {car.type || 'Mobil Penumpang'}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-secondary bg-warm-100 px-3 py-1 rounded-full border border-warm-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Available Now
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs font-extrabold text-ink-primary bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                4.9 <span className="text-ink-secondary font-medium">(84 ulasan)</span>
              </div>
            </div>

            {/* Main Title & Partner */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-black text-ink-primary tracking-tight">
                {car.brand} {car.model}
              </h1>
              <p className="text-xs sm:text-sm text-ink-secondary flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-midnight-900 shrink-0" />
                Disediakan oleh{' '}
                <Link to={`/rentals/${car.rentalPlaceId}`} className="text-midnight-900 font-bold hover:underline">
                  {car.rentalPlaceName}
                </Link>{' '}
                ({car.rentalPlaceCity})
              </p>
            </div>

            {/* Specifications 4-Box Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-warm-50 p-4 rounded-2xl border border-warm-200 space-y-1">
                <span className="text-[10px] text-ink-secondary font-bold uppercase tracking-wider">Transmisi</span>
                <p className="text-xs font-extrabold text-ink-primary flex items-center gap-1.5">
                  <Gauge className="h-4 w-4 text-midnight-900" />
                  {car.transmission || 'Automatic'}
                </p>
              </div>

              <div className="bg-warm-50 p-4 rounded-2xl border border-warm-200 space-y-1">
                <span className="text-[10px] text-ink-secondary font-bold uppercase tracking-wider">Kapasitas</span>
                <p className="text-xs font-extrabold text-ink-primary flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-midnight-900" />
                  {car.seats} Penumpang
                </p>
              </div>

              <div className="bg-warm-50 p-4 rounded-2xl border border-warm-200 space-y-1">
                <span className="text-[10px] text-ink-secondary font-bold uppercase tracking-wider">Kapasitas Mesin</span>
                <p className="text-xs font-extrabold text-ink-primary flex items-center gap-1.5">
                  <Fuel className="h-4 w-4 text-midnight-900" />
                  {car.cc ? `${car.cc} cc` : '1500 cc'}
                </p>
              </div>

              <div className="bg-warm-50 p-4 rounded-2xl border border-warm-200 space-y-1">
                <span className="text-[10px] text-ink-secondary font-bold uppercase tracking-wider">Warna Unit</span>
                <p className="text-xs font-extrabold text-ink-primary flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-midnight-900" />
                  {car.color || 'Hitam'}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 pt-4 border-t border-warm-200">
              <h3 className="text-sm font-bold text-ink-primary">Deskripsi & Kelayakan Unit</h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                {car.description || 'Armada kendaraan dalam kondisi sangat prima, servis berkala resmi, interior bersih wangi, AC dingin optimal, dan ban siap untuk perjalanan jarak dekat maupun luar kota.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Sticky Booking Panel (Matching Figma Image 3) */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-warm-300 rounded-3xl p-6 sm:p-7 shadow-floating space-y-6 sticky top-24">
            
            {/* Price Header */}
            <div className="space-y-1 pb-4 border-b border-warm-200">
              <span className="text-[11px] font-bold text-ink-secondary uppercase tracking-wider">Tarif Sewa Harian</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-midnight-900 tracking-tight">
                  {formatRupiah(car.pricePerDay)}
                </span>
                <span className="text-xs text-ink-secondary font-medium">/ hari</span>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-900">Pemesanan Berhasil!</h4>
                <p className="text-xs text-emerald-700">Mengarahkan ke riwayat pesanan Anda...</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {bookingError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{bookingError}</span>
                  </div>
                )}

                {/* Pickup Location Readonly */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-ink-secondary uppercase tracking-wider">
                    Lokasi Penjemputan (Pickup)
                  </label>
                  <div className="bg-warm-50 border border-warm-200 rounded-xl px-3.5 py-2.5 text-xs text-ink-primary font-bold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-midnight-900 shrink-0" />
                    <span className="truncate">{car.rentalPlaceName} ({car.rentalPlaceCity})</span>
                  </div>
                </div>

                {/* Pickup & Return Dates Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-ink-secondary uppercase tracking-wider">
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-warm-50 border border-warm-300 rounded-xl px-3 py-2 text-xs font-semibold text-ink-primary focus:outline-none focus:border-midnight-900 focus:bg-white transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-ink-secondary uppercase tracking-wider">
                      Tanggal Selesai
                    </label>
                    <input
                      type="date"
                      required
                      min={startDate}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-warm-50 border border-warm-300 rounded-xl px-3 py-2 text-xs font-semibold text-ink-primary focus:outline-none focus:border-midnight-900 focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* Price Calculation Summary Table */}
                <div className="bg-warm-50 p-4 rounded-2xl border border-warm-200 space-y-2.5 text-xs">
                  <div className="flex justify-between text-ink-secondary">
                    <span>Durasi Sewa:</span>
                    <span className="font-bold text-ink-primary">{days > 0 ? `${days} Hari` : 'Pilih tanggal valid'}</span>
                  </div>
                  <div className="flex justify-between text-ink-secondary">
                    <span>{formatRupiah(car.pricePerDay)} × {days > 0 ? days : 1} hari</span>
                    <span className="font-bold text-ink-primary">{formatRupiah(estimatedPrice)}</span>
                  </div>
                  <div className="pt-2 border-t border-warm-200 flex justify-between font-black text-sm text-ink-primary">
                    <span>Total Pembayaran:</span>
                    <span className="text-midnight-900">{formatRupiah(estimatedPrice)}</span>
                  </div>
                </div>

                {/* Primary CTA Button */}
                <button
                  type="submit"
                  disabled={bookingLoading || days <= 0}
                  className="w-full bg-midnight-900 hover:bg-midnight-800 disabled:opacity-50 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-card transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  {bookingLoading ? 'Memproses Pesanan...' : 'Pesan Sekarang (Book Now)'}
                </button>

                {/* Trust mini guarantees */}
                <div className="pt-3 border-t border-warm-200 space-y-1 text-center">
                  <p className="text-[11px] text-ink-secondary font-medium">
                    ⚡ Anti-Overlap: Validasi tanggal bentrok otomatis
                  </p>
                  <p className="text-[10px] text-ink-muted">
                    Bebas biaya pembatalan sebelum konfirmasi mitra
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
