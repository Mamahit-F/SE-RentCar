import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  Car, 
  Filter, 
  SlidersHorizontal,
  Users,
  Gauge,
  RotateCcw
} from 'lucide-react';
import { publicRentalService, publicCarService } from '../../services/api';
import RatingStars from '../../components/common/RatingStars';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function RentalListPage() {
  const [searchParams] = useSearchParams();
  const initialCity = searchParams.get('city') || '';
  const initialQuery = searchParams.get('query') || searchParams.get('search') || '';

  // Tab mode: View Cars (Discovery) vs View Rentals (Tempat Rental)
  const isCarView = window.location.pathname.includes('/cars') || searchParams.has('search');

  const [rentals, setRentals] = useState([]);
  const [cars, setCars] = useState([]);

  /* =========================================================================
     FITUR FILTER DINONAKTIFKAN SEMENTARA (Dapat di-uncomment jika dibutuhkan)
     =========================================================================
  const [city, setCity] = useState(initialCity);
  const [query, setQuery] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedTransmission, setSelectedTransmission] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState('');

  const categories = [
    { id: 'ALL', label: 'Semua' },
    { id: 'MPV', label: 'MPV Family' },
    { id: 'SUV', label: 'SUV' },
    { id: 'Sedan', label: 'Sedan' },
    { id: 'City Car', label: 'City Car' },
  ];
  ========================================================================= */

  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    setLoading(true);
    try {
      if (isCarView) {
        const res = await publicCarService.searchCars({
          /* FITUR FILTER NONAKTIF
          type: selectedType !== 'ALL' ? selectedType : undefined,
          transmission: selectedTransmission !== 'ALL' ? selectedTransmission : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          search: query || undefined,
          */
        });
        setCars(res?.data || []);
      } else {
        const res = await publicRentalService.getActiveRentals({
          /* FITUR FILTER NONAKTIF
          city: city || undefined,
          query: query || undefined,
          */
        });
        setRentals(res?.data || []);
      }
    } catch (err) {
      console.error('Error fetching discovery data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [isCarView /*, selectedType, selectedTransmission */]);

  /* FITUR FILTER NONAKTIF
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (isCarView) {
      setSearchParams({ search: query, ...(city && { city }) });
    } else {
      setSearchParams({ query, city });
    }
    fetchContent();
  };

  const handleResetFilters = () => {
    setCity('');
    setQuery('');
    setSelectedType('ALL');
    setSelectedTransmission('ALL');
    setMaxPrice('');
    setSearchParams({});
  };
  */

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-warm-200 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">
            {isCarView ? 'Discover Armada Mobil' : 'Daftar Tempat Rental Terverifikasi'}
          </h1>
          <p className="text-xs text-ink-secondary">
            {isCarView 
              ? 'Temukan mobil pilihan dari puluhan tempat rental terpercaya dengan tarif harian transparan'
              : 'Pilih tempat rental resmi berizin usaha di kota tujuan Anda'}
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-warm-100 rounded-full border border-warm-200 self-start sm:self-auto text-xs font-bold">
          <Link
            to="/cars"
            className={`px-4 py-2 rounded-full transition ${
              isCarView 
                ? 'bg-midnight-900 text-white shadow-subtle' 
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            Armada Mobil
          </Link>
          <Link
            to="/rentals"
            className={`px-4 py-2 rounded-full transition ${
              !isCarView 
                ? 'bg-midnight-900 text-white shadow-subtle' 
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            Tempat Rental
          </Link>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 gap-8 items-start">
        
        {/* FITUR FILTER DINOAKTIFKAN SEMENTARA
        <div className="bg-white border border-warm-300 rounded-3xl p-6 space-y-6 shadow-subtle sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-warm-200">
            <span className="text-xs font-extrabold uppercase tracking-wider text-ink-primary flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-midnight-900" />
              Filter Pencarian
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-bold text-ink-secondary hover:text-midnight-900 flex items-center gap-1 transition"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>

          <form onSubmit={handleFilterSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-primary">Kata Kunci</label>
              <div className="relative">
                <Search className="h-4 w-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={isCarView ? "Merk / model mobil..." : "Nama tempat rental..."}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-ink-primary placeholder-ink-muted focus:outline-none focus:border-midnight-900 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-primary">Kota / Lokasi</label>
              <div className="relative">
                <MapPin className="h-4 w-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Jakarta, Denpasar, Bandung..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-ink-primary placeholder-ink-muted focus:outline-none focus:border-midnight-900 focus:bg-white transition"
                />
              </div>
            </div>

            {isCarView && (
              <>
                <div className="space-y-2 pt-2 border-t border-warm-200">
                  <label className="text-xs font-bold text-ink-primary block">Kategori Kendaraan</label>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedType(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          selectedType === cat.id
                            ? 'bg-midnight-900 text-white shadow-subtle'
                            : 'bg-warm-100 text-ink-secondary hover:bg-warm-200 hover:text-ink-primary border border-warm-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-warm-200">
                  <label className="text-xs font-bold text-ink-primary block">Transmisi</label>
                  <div className="space-y-1.5 text-xs text-ink-primary">
                    {['ALL', 'Automatic', 'Manual'].map((t) => (
                      <label key={t} className="flex items-center gap-2 cursor-pointer font-medium hover:text-midnight-900">
                        <input
                          type="radio"
                          name="transmission"
                          checked={selectedTransmission === t}
                          onChange={() => setSelectedTransmission(t)}
                          className="accent-midnight-900"
                        />
                        <span>{t === 'ALL' ? 'Semua Transmisi' : t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-warm-200">
                  <label className="text-xs font-bold text-ink-primary">Maks. Tarif Harian (Rp)</label>
                  <input
                    type="number"
                    placeholder="Contoh: 700000"
                    step="50000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-warm-50 border border-warm-300 rounded-xl px-3.5 py-2.5 text-xs text-ink-primary placeholder-ink-muted focus:outline-none focus:border-midnight-900 focus:bg-white transition"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-midnight-900 hover:bg-midnight-800 text-white font-bold text-xs py-3 rounded-xl shadow-card transition duration-200 flex items-center justify-center gap-2"
            >
              <Filter className="h-4 w-4" /> Terapkan Filter
            </button>
          </form>
        </div>
        */}

        {/* Right Content Area: Results Grid (diubah menjadi full width) */}
        <div className="w-full space-y-5">
          {/* Header count */}
          <div className="flex items-center justify-between text-xs text-ink-secondary bg-white p-4 rounded-2xl border border-warm-300 shadow-subtle">
            <span className="font-bold text-ink-primary">
              {isCarView ? `${cars.length} Mobil Ditemukan` : `${rentals.length} Tempat Rental Aktif`}
            </span>
            <span className="text-[11px] text-ink-muted">Urutan: Rekomendasi Terverifikasi</span>
          </div>

          {loading ? (
            <LoadingSpinner text="Memuat data..." />
          ) : isCarView ? (
            // CARS GRID
            cars.length === 0 ? (
              <EmptyState
                icon={Car}
                title="Tidak Ada Mobil Ditemukan"
                description="Belum ada data armada mobil yang tersedia saat ini."
                /* FITUR FILTER NONAKTIF: Action reset disembunyikan
                action={
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-midnight-900 bg-warm-100 hover:bg-warm-200 px-4 py-2 rounded-xl border border-warm-300"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Reset Filter
                  </button>
                }
                */
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cars.map((car) => (
                  <div
                    key={car.id}
                    className="bg-white border border-warm-300 rounded-2xl overflow-hidden hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Photo banner */}
                      <div className="h-48 bg-warm-100 relative overflow-hidden">
                        <img
                          src={car.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-700 border border-emerald-200 flex items-center gap-1 shadow-subtle">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Tersedia
                        </div>
                        <div className="absolute top-3 right-3 bg-midnight-900/80 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-bold text-white">
                          {car.type || 'Mobil'}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-extrabold text-ink-primary group-hover:text-midnight-900 transition">
                              {car.brand} {car.model}
                            </h3>
                            <p className="text-[11px] text-ink-secondary font-medium mt-0.5">
                              {car.year} · {car.type || 'MPV'}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-black text-midnight-900">
                              {formatRupiah(car.pricePerDay)}
                            </p>
                            <span className="text-[10px] text-ink-secondary font-medium block">/ hari</span>
                          </div>
                        </div>

                        {/* Specs */}
                        <div className="flex items-center gap-2 pt-1 text-[11px] text-ink-secondary font-semibold">
                          <span className="flex items-center gap-1 bg-warm-100 px-2 py-0.5 rounded-lg border border-warm-200">
                            <Users className="h-3 w-3 text-midnight-700" />
                            {car.seats} Kursi
                          </span>
                          <span className="flex items-center gap-1 bg-warm-100 px-2 py-0.5 rounded-lg border border-warm-200">
                            <Gauge className="h-3 w-3 text-midnight-700" />
                            {car.transmission}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card bottom */}
                    <div className="px-5 py-3.5 bg-warm-50/80 border-t border-warm-200 flex items-center justify-between">
                      <div className="space-y-0.5 max-w-[60%]">
                        <p className="text-xs font-bold text-ink-primary truncate">
                          {car.rentalPlaceName}
                        </p>
                        <p className="text-[11px] text-ink-secondary truncate">{car.rentalPlaceCity}</p>
                      </div>

                      <Link
                        to={`/cars/${car.id}`}
                        className="inline-flex items-center gap-1 bg-midnight-900 hover:bg-midnight-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-subtle transition"
                      >
                        Pesan
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // RENTALS GRID
            rentals.length === 0 ? (
              <EmptyState
                icon={Building2}
                title="Tidak Ada Tempat Rental Ditemukan"
                description="Belum ada data tempat rental yang terdaftar saat ini."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rentals.map((rental) => (
                  <div
                    key={rental.id}
                    className="bg-white border border-warm-300 hover:border-midnight-900 rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between space-y-4 group shadow-subtle hover:shadow-card"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="h-11 w-11 rounded-xl bg-warm-100 border border-warm-300 flex items-center justify-center text-midnight-900 group-hover:scale-105 transition">
                          <Building2 className="h-5 w-5 stroke-[2]" />
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          ✓ Mitra Resmi
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-extrabold text-ink-primary group-hover:text-midnight-900 transition leading-snug">
                          {rental.name}
                        </h3>
                        <p className="text-xs text-ink-secondary flex items-center gap-1 mt-1">
                          <MapPin className="h-3.5 w-3.5 text-ink-muted shrink-0" />
                          {rental.address}, {rental.city}
                        </p>
                      </div>

                      <p className="text-xs text-ink-secondary line-clamp-2 leading-relaxed">
                        {rental.description || 'Penyedia layanan rental mobil terpercaya dengan armada berkualitas prima.'}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-warm-200 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <RatingStars rating={rental.averageRating} count={rental.totalReviews} />
                        <span className="text-[11px] text-midnight-900 font-bold block">{rental.totalCars} Armada Siap Sewa</span>
                      </div>
                      <Link
                        to={`/rentals/${rental.id}`}
                        className="inline-flex items-center gap-1 bg-midnight-900 hover:bg-midnight-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-subtle transition"
                      >
                        Lihat <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
}