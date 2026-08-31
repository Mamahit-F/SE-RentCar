import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Car, 
  Search, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Users, 
  Building2, 
  Star, 
  CalendarCheck,
  CreditCard,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { publicRentalService, publicCarService } from '../../services/api';
import RatingStars from '../../components/common/RatingStars';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeRentals, setActiveRentals] = useState([]);
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rentalsRes, carsRes] = await Promise.all([
          publicRentalService.getActiveRentals({}),
          publicCarService.searchCars({}),
        ]);
        setActiveRentals(rentalsRes?.data?.slice(0, 4) || []);
        setFeaturedCars(carsRes?.data?.slice(0, 6) || []);
      } catch (err) {
        console.error('Error fetching landing page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/cars?search=${encodeURIComponent(searchQuery)}`);
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/60 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            Sistem Partnership Rental Mobil Resmi & Terverifikasi
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Sewa Mobil Aman & Cepat dari <span className="text-blue-500">Mitra Terpercaya</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Temukan berbagai armada mobil pilihan dengan kondisi terbaik dari puluhan tempat rental resmi yang telah diverifikasi oleh tim kurator kami.
          </p>

          {/* Quick Search Form */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="bg-slate-900/90 border border-slate-700 p-2 rounded-2xl flex flex-col sm:flex-row items-center gap-2 shadow-xl backdrop-blur">
              <div className="flex items-center gap-2.5 px-3 py-2 flex-1 w-full">
                <Search className="h-4 w-4 text-blue-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Cari merk atau tipe mobil (contoh: Avanza, Zenix, SUV)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none w-full"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-blue-600/30 shrink-0"
              >
                <Search className="h-4 w-4" />
                Cari Sekarang
              </button>
            </div>
          </form>

          {/* Value Props */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>100% Mitra Terverifikasi</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-blue-400 shrink-0" />
              <span>Anti Tanggal Bentrok</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-amber-400 shrink-0" />
              <span>Simulasi Bayar Transparan</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Armada Mobil Populer</h2>
            <p className="text-xs sm:text-sm text-slate-400">Pilihan mobil terbaik siap jalan untuk perjalanan dinas maupun liburan</p>
          </div>
          <Link to="/cars" className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition">
            Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Memuat armada mobil..." />
        ) : featuredCars.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-xs text-slate-400">
            Belum ada mobil yang terdaftar.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
              <div key={car.id} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition flex flex-col group shadow-lg">
                <div className="h-48 bg-slate-900 relative overflow-hidden">
                  <img
                    src={car.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-blue-400 border border-slate-800">
                    {car.type || 'Mobil'}
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 border border-slate-800">
                    {car.transmission}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-400">{car.brand} • {car.year}</p>
                      <span className="text-xs text-slate-400">{car.seats} Kursi</span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition">{car.model}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      {car.rentalPlaceName} ({car.rentalPlaceCity})
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400">Mulai dari</span>
                      <p className="text-sm font-extrabold text-emerald-400">{formatRupiah(car.pricePerDay)}<span className="text-xs text-slate-400 font-normal"> /hari</span></p>
                    </div>
                    <Link
                      to={`/cars/${car.id}`}
                      className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-md shadow-blue-600/20"
                    >
                      Pesan Mobil
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Active Rental Partners Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Mitra Rental Terverifikasi</h2>
            <p className="text-xs sm:text-sm text-slate-400">Tempat rental resmi dengan reputasi dan ulasan teruji</p>
          </div>
          <Link to="/rentals" className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition">
            Lihat Semua Mitra <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeRentals.map((rental) => (
            <Link
              key={rental.id}
              to={`/rentals/${rental.id}`}
              className="bg-slate-950 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 transition space-y-4 flex flex-col justify-between group shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="h-3 w-3" /> Terverifikasi
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition">{rental.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-500" />
                    {rental.city}, {rental.province}
                  </p>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {rental.description || 'Penyedia jasa sewa mobil berkualitas.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs">
                <RatingStars rating={rental.averageRating} count={rental.totalReviews} />
                <span className="font-semibold text-blue-400">{rental.totalCars} Mobil</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Partner Call to Action */}
      <section className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-purple-900/40 border border-slate-800 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="space-y-3 max-w-xl text-center md:text-left">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Peluang Bisnis Kemitraan</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Punya Usaha Rental Mobil? Bergabung Jadi Mitra Kami!
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Dapatkan akses ke ribuan pelanggan potensial, kelola armada mobil dengan mudah, dan nikmati sistem manajemen pesanan terintegrasi.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition"
          >
            <Building2 className="h-4 w-4" />
            Daftar Sebagai Mitra Rental
          </Link>
        </div>
      </section>
    </div>
  );
}
