import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Car, 
  Search, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  Calendar,
  Users,
  Gauge,
  Check,
  ChevronRight
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
    if (searchCity) {
      navigate(`/cars?city=${encodeURIComponent(searchCity)}&search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/cars?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section — RentCar Minut Figma Style */}
      <section className="relative overflow-hidden bg-midnight-900 text-white min-h-[560px] flex items-center">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80"
            alt="Luxury mobility hero"
            className="w-full h-full object-cover object-center opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-midnight-950 via-midnight-900/90 to-midnight-900/60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-midnight-950/80 border border-lime/30 text-lime text-xs font-extrabold tracking-wider uppercase">
                <span className="h-2 w-2 rounded-full bg-lime animate-pulse" />
                VERIFIED RENTAL NETWORK
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                Move on <span className="text-lime">your</span> terms.
              </h1>

              <p className="text-warm-200/90 text-sm sm:text-base leading-relaxed max-w-xl">
                Temukan dan sewa mobil terverifikasi dari mitra rental terpercaya di seluruh Indonesia. Pilihan armada prima, harga transparan, dan pemesanan instan tanpa repot.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/cars"
                  className="inline-flex items-center gap-2 bg-lime hover:bg-lime-400 text-midnight-950 font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-lime-glow transition-all duration-200"
                >
                  <Car className="h-4 w-4 stroke-[2.5]" />
                  Cari Mobil Sekarang
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-6 py-3.5 rounded-xl border border-white/20 backdrop-blur transition-all duration-200"
                >
                  <Building2 className="h-4 w-4" />
                  Daftar Jadi Mitra
                </Link>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 max-w-lg">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">1,200+</p>
                  <p className="text-xs text-warm-300/80 mt-0.5 font-medium">Armada Mobil</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">340+</p>
                  <p className="text-xs text-warm-300/80 mt-0.5 font-medium">Mitra Terdaftar</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-lime">98%</p>
                  <p className="text-xs text-warm-300/80 mt-0.5 font-medium">Tingkat Kepuasan</p>
                </div>
              </div>
            </div>

            {/* Right Column: Floating Search Card (Figma Box) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-floating border border-warm-200 text-ink-primary space-y-5">
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-ink-primary tracking-tight">Cari Mobil Rental</h3>
                  <p className="text-xs text-ink-secondary">Pilih lokasi kota dan kata kunci kendaraan</p>
                </div>

                <form onSubmit={handleSearchSubmit} className="space-y-4">
                  {/* Location Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-ink-secondary uppercase tracking-wider">
                      Lokasi Kota
                    </label>
                    <div className="relative">
                      <MapPin className="h-4 w-4 text-midnight-900 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Contoh: Jakarta Selatan, Denpasar..."
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        className="w-full bg-warm-50 border border-warm-300 rounded-xl pl-10 pr-4 py-3 text-xs text-ink-primary font-medium placeholder-ink-muted focus:outline-none focus:border-midnight-900 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  {/* Search Query / Model */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-ink-secondary uppercase tracking-wider">
                      Model / Merk Mobil
                    </label>
                    <div className="relative">
                      <Search className="h-4 w-4 text-midnight-900 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Innova, Zenix, Avanza, HR-V..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-warm-50 border border-warm-300 rounded-xl pl-10 pr-4 py-3 text-xs text-ink-primary font-medium placeholder-ink-muted focus:outline-none focus:border-midnight-900 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-midnight-900 hover:bg-midnight-800 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-card transition duration-200"
                  >
                    <Search className="h-4 w-4 stroke-[2.5]" />
                    Temukan Kendaraan
                  </button>
                </form>

                {/* Trust mini banner */}
                <div className="pt-3 border-t border-warm-200 flex items-center justify-between text-[11px] text-ink-secondary font-medium">
                  <span className="flex items-center gap-1">
                    <Check className="h-3.5 w-3.5 text-emerald-600" /> Bebas Biaya Admin
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-midnight-900" /> Mitra Berizin
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Featured Vehicles Section — RentCar Minut Figma Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-midnight-600">Pilihan Populer</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">Armada Mobil Pilihan</h2>
              <p className="text-xs text-ink-secondary">Kendaraan prima siap jalan dengan ulasan terbaik dari pelanggan</p>
            </div>
            <Link 
              to="/cars" 
              className="inline-flex items-center gap-1 text-xs font-bold text-midnight-900 hover:text-midnight-700 transition"
            >
              Lihat Semua Armada <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Memuat armada mobil..." />
          ) : featuredCars.length === 0 ? (
            <div className="p-8 text-center bg-white border border-warm-300 rounded-3xl text-xs text-ink-secondary">
              Belum ada mobil yang terdaftar.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCars.map((car) => (
                <div 
                  key={car.id} 
                  className="bg-white border border-warm-300 rounded-2xl overflow-hidden hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Box */}
                    <div className="h-52 bg-warm-100 relative overflow-hidden">
                      <img
                        src={car.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Availability Tag */}
                      <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-700 border border-emerald-200/80 flex items-center gap-1 shadow-subtle">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Tersedia
                      </div>
                      <div className="absolute top-3.5 right-3.5 bg-midnight-900/80 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-bold text-white">
                        {car.type || 'Mobil'}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      {/* Title & Price Row */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-extrabold text-ink-primary group-hover:text-midnight-900 transition">
                            {car.brand} {car.model}
                          </h3>
                          <p className="text-xs text-ink-secondary font-medium mt-0.5">
                            {car.year} · {car.type || 'Mobil Penumpang'}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-base font-black text-midnight-900">
                            {formatRupiah(car.pricePerDay)}
                          </p>
                          <span className="text-[10px] text-ink-secondary font-medium block">/ hari</span>
                        </div>
                      </div>

                      {/* Specs Icons Pill Bar */}
                      <div className="flex items-center gap-3 pt-2 text-[11px] text-ink-secondary font-semibold">
                        <span className="flex items-center gap-1 bg-warm-100 px-2.5 py-1 rounded-lg border border-warm-200">
                          <Users className="h-3.5 w-3.5 text-midnight-700" />
                          {car.seats} Kursi
                        </span>
                        <span className="flex items-center gap-1 bg-warm-100 px-2.5 py-1 rounded-lg border border-warm-200">
                          <Gauge className="h-3.5 w-3.5 text-midnight-700" />
                          {car.transmission}
                        </span>
                        {car.cc && (
                          <span className="bg-warm-100 px-2.5 py-1 rounded-lg border border-warm-200">
                            {car.cc} cc
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-4 bg-warm-50/80 border-t border-warm-200 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-ink-primary flex items-center gap-1">
                        {car.rentalPlaceName}
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold border border-emerald-200">
                          ✓ Verified
                        </span>
                      </p>
                      <p className="text-[11px] text-ink-secondary">{car.rentalPlaceCity}</p>
                    </div>

                    <Link
                      to={`/cars/${car.id}`}
                      className="inline-flex items-center gap-1 bg-midnight-900 hover:bg-midnight-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-subtle transition duration-200"
                    >
                      Pesan
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Active Rental Places Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-midnight-600">Jaringan Mitra</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">Tempat Rental Terverifikasi</h2>
              <p className="text-xs text-ink-secondary">Penyedia sewa resmi dengan izin usaha legalitas lengkap</p>
            </div>
            <Link 
              to="/rentals" 
              className="inline-flex items-center gap-1 text-xs font-bold text-midnight-900 hover:text-midnight-700 transition"
            >
              Lihat Semua Mitra <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {activeRentals.map((rental) => (
              <Link
                key={rental.id}
                to={`/rentals/${rental.id}`}
                className="bg-white border border-warm-300 hover:border-midnight-900 rounded-2xl p-5 transition-all duration-200 space-y-4 flex flex-col justify-between group shadow-subtle hover:shadow-card"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-warm-100 flex items-center justify-center text-midnight-900 border border-warm-300 group-hover:scale-105 transition">
                      <Building2 className="h-5 w-5 stroke-[2]" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Terverifikasi
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-ink-primary group-hover:text-midnight-900 transition leading-snug">
                      {rental.name}
                    </h3>
                    <p className="text-xs text-ink-secondary mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-ink-muted shrink-0" />
                      {rental.city}, {rental.province}
                    </p>
                  </div>

                  <p className="text-xs text-ink-secondary line-clamp-2 leading-relaxed">
                    {rental.description || 'Penyedia layanan rental mobil terpercaya dengan armada berkualitas.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-warm-200 flex items-center justify-between text-xs">
                  <RatingStars rating={rental.averageRating} count={rental.totalReviews} />
                  <span className="font-extrabold text-midnight-900">{rental.totalCars} Mobil</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Partner CTA Banner */}
        <section className="bg-midnight-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-card">
          <div className="max-w-xl space-y-4 relative z-10">
            <span className="text-xs font-extrabold text-lime uppercase tracking-wider">
              Kemitraan Usaha Rental
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Kembangkan Bisnis Rental Anda Bersama RentCar Minut
            </h3>
            <p className="text-xs sm:text-sm text-warm-200/80 leading-relaxed">
              Daftarkan tempat rental Anda, jangkau ribuan pelanggan baru, dan kelola seluruh jadwal sewa serta armada dengan sistem manajemen terintegrasi.
            </p>
            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-lime hover:bg-lime-400 text-midnight-950 font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-lime-glow transition-all"
              >
                Daftar Sebagai Mitra Rental <ChevronRight className="h-4 w-4 stroke-[3]" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
