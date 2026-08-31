import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Building2, MapPin, Search, ShieldCheck, ArrowRight } from 'lucide-react';
import { publicRentalService } from '../../services/api';
import RatingStars from '../../components/common/RatingStars';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function RentalListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCity = searchParams.get('city') || '';
  const initialQuery = searchParams.get('query') || '';

  const [rentals, setRentals] = useState([]);
  const [city, setCity] = useState(initialCity);
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(true);

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const res = await publicRentalService.getActiveRentals({
        city: city || undefined,
        query: query || undefined,
      });
      setRentals(res?.data || []);
    } catch (err) {
      console.error('Error fetching rentals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ city, query });
    fetchRentals();
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Tempat Rental Terverifikasi
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Daftar penyedia sewa mobil resmi dengan standar pelayanan dan dokumen legal teruji
        </p>
      </div>

      {/* Filter Bar */}
      <form onSubmit={handleFilterSubmit} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama rental atau deskripsi..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
        <div className="sm:w-64 relative">
          <MapPin className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter Kota (contoh: Jakarta, Denpasar)..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
        >
          <Search className="h-4 w-4" />
          Filter
        </button>
      </form>

      {/* Rentals Grid */}
      {loading ? (
        <LoadingSpinner text="Mencari tempat rental..." />
      ) : rentals.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Tidak Ada Tempat Rental Ditemukan"
          description="Coba ubah kata kunci pencarian atau bersihkan filter kota."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentals.map((rental) => (
            <div
              key={rental.id}
              className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition flex flex-col justify-between space-y-5 shadow-lg group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:scale-105 transition">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="h-3.5 w-3.5" /> Mitra Resmi
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition">{rental.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    {rental.address}, {rental.city}, {rental.province}
                  </p>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {rental.description || 'Penyedia layanan rental mobil terpercaya dengan armada berkualitas.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-900 flex items-center justify-between">
                <div className="space-y-1">
                  <RatingStars rating={rental.averageRating} count={rental.totalReviews} />
                  <span className="text-xs text-slate-400 block">{rental.totalCars} Armada Mobil Siap Sewa</span>
                </div>
                <Link
                  to={`/rentals/${rental.id}`}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-md shadow-blue-600/20"
                >
                  Lihat Armada <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
