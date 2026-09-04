import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Car, 
  FileText, 
  ArrowLeft,
  Users,
  Gauge,
  Check
} from 'lucide-react';
import { publicRentalService, reviewService } from '../../services/api';
import RatingStars from '../../components/common/RatingStars';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function RentalDetailPage() {
  const { id } = useParams();
  const [rental, setRental] = useState(null);
  const [cars, setCars] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRentalData = async () => {
      setLoading(true);
      try {
        const [rentalRes, carsRes, reviewsRes] = await Promise.all([
          publicRentalService.getRentalById(id),
          publicRentalService.getRentalCars(id),
          reviewService.getRentalReviews(id),
        ]);
        setRental(rentalRes?.data || null);
        setCars(carsRes?.data || []);
        setReviews(reviewsRes?.data || []);
      } catch (err) {
        setError(err?.message || 'Gagal memuat detail tempat rental');
      } finally {
        setLoading(false);
      }
    };

    fetchRentalData();
  }, [id]);

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner text="Memuat informasi profil tempat rental..." />
      </div>
    );
  }

  if (error || !rental) {
    return (
      <div className="py-16 space-y-4 max-w-lg mx-auto text-center">
        <EmptyState
          icon={Building2}
          title="Tempat Rental Tidak Ditemukan"
          description={error || 'Rental mungkin sedang tidak aktif atau ID tidak valid.'}
          action={
            <Link to="/rentals" className="inline-flex items-center gap-2 text-xs font-bold text-midnight-900 bg-warm-100 px-4 py-2 rounded-xl border border-warm-300">
              <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Rental
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Link to="/rentals" className="inline-flex items-center gap-2 text-xs font-bold text-ink-secondary hover:text-midnight-900 transition">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Tempat Rental
      </Link>

      {/* Header Profile Card */}
      <div className="bg-white border border-warm-300 rounded-3xl p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-midnight-900 text-lime flex items-center justify-center shrink-0 shadow-subtle">
              <Building2 className="h-7 w-7 stroke-[2]" />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-ink-primary tracking-tight">{rental.name}</h1>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <Check className="h-3 w-3 stroke-[3]" /> Terverifikasi
                </span>
              </div>
              <p className="text-xs sm:text-sm text-ink-secondary flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-midnight-900 shrink-0" />
                {rental.address}, {rental.city}, {rental.province}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-warm-50 p-4 rounded-2xl border border-warm-200">
            <div className="text-right">
              <RatingStars rating={rental.averageRating} count={rental.totalReviews} size="md" />
              <span className="text-xs text-midnight-900 font-extrabold mt-1 block">{rental.totalCars} Armada Terdaftar</span>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed border-t border-warm-200 pt-4">
          {rental.description || 'Penyedia layanan rental mobil terpercaya dengan komitmen kebersihan unit dan kepuasan pelanggan.'}
        </p>

        {/* Contact info row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-ink-secondary font-medium">
          {rental.phone && (
            <div className="flex items-center gap-2 bg-warm-50 p-3 rounded-xl border border-warm-200">
              <Phone className="h-4 w-4 text-midnight-900 shrink-0" />
              <span>{rental.phone}</span>
            </div>
          )}
          {rental.email && (
            <div className="flex items-center gap-2 bg-warm-50 p-3 rounded-xl border border-warm-200">
              <Mail className="h-4 w-4 text-midnight-900 shrink-0" />
              <span>{rental.email}</span>
            </div>
          )}
          {rental.businessLicense && (
            <div className="flex items-center gap-2 bg-warm-50 p-3 rounded-xl border border-warm-200">
              <FileText className="h-4 w-4 text-midnight-900 shrink-0" />
              <span>Izin NIB: {rental.businessLicense}</span>
            </div>
          )}
        </div>
      </div>

      {/* Available Fleet Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-ink-primary tracking-tight">Armada Mobil Tersedia</h2>
          <p className="text-xs text-ink-secondary">Pilih armada mobil untuk melihat ketersediaan tanggal sewa</p>
        </div>

        {cars.length === 0 ? (
          <EmptyState
            icon={Car}
            title="Belum Ada Mobil Tersedia"
            description="Mitra ini belum mendaftarkan mobil yang siap disewa."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div 
                key={car.id} 
                className="bg-white border border-warm-300 rounded-2xl overflow-hidden hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
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

                    <div className="flex items-center gap-2 pt-1 text-[11px] text-ink-secondary font-semibold">
                      <span className="flex items-center gap-1 bg-warm-100 px-2.5 py-1 rounded-lg border border-warm-200">
                        <Users className="h-3 w-3 text-midnight-700" />
                        {car.seats} Kursi
                      </span>
                      <span className="flex items-center gap-1 bg-warm-100 px-2.5 py-1 rounded-lg border border-warm-200">
                        <Gauge className="h-3 w-3 text-midnight-700" />
                        {car.transmission}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3.5 bg-warm-50/80 border-t border-warm-200 flex items-center justify-between">
                  <span className="text-xs text-ink-secondary font-medium">Lepas Kunci / Supir</span>
                  <Link
                    to={`/cars/${car.id}`}
                    className="inline-flex items-center gap-1 bg-midnight-900 hover:bg-midnight-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-subtle transition"
                  >
                    Pesan
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer Reviews Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-ink-primary tracking-tight">Ulasan & Penilaian Pelanggan</h2>
          <p className="text-xs text-ink-secondary">Pengalaman nyata pelanggan yang telah menyelesaikan sewa di tempat ini</p>
        </div>

        {reviews.length === 0 ? (
          <div className="p-8 text-center bg-white border border-warm-300 rounded-3xl text-xs text-ink-secondary">
            Belum ada ulasan untuk tempat rental ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white border border-warm-300 p-5 rounded-2xl space-y-3 shadow-subtle">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-midnight-900 text-lime flex items-center justify-center text-xs font-extrabold">
                      {rev.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ink-primary">{rev.user?.name}</p>
                      <p className="text-[10px] text-ink-secondary">{new Date(rev.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <RatingStars rating={rev.rating} showNumber={false} />
                </div>
                <p className="text-xs text-ink-secondary leading-relaxed italic">
                  "{rev.comment || 'Pelayanan sangat memuaskan!'}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
