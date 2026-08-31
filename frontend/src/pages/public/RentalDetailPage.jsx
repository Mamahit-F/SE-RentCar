import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Car, 
  Star, 
  FileText, 
  ExternalLink,
  MessageSquare,
  ArrowLeft
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
    return <LoadingSpinner text="Memuat informasi tempat rental..." />;
  }

  if (error || !rental) {
    return (
      <div className="py-12 space-y-4 max-w-lg mx-auto text-center">
        <EmptyState
          icon={Building2}
          title="Tempat Rental Tidak Ditemukan"
          description={error || 'Rental mungkin tidak aktif atau ID tidak valid.'}
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
    <div className="space-y-10 py-6">
      <Link to="/rentals" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Tempat Rental
      </Link>

      {/* Header Profile Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 shrink-0">
              <Building2 className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{rental.name}</h1>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="h-3.5 w-3.5" /> Terverifikasi
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
                {rental.address}, {rental.city}, {rental.province}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="text-right">
              <RatingStars rating={rental.averageRating} count={rental.totalReviews} size="md" />
              <span className="text-xs text-slate-400 mt-0.5 block">{rental.totalCars} Armada Terdaftar</span>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-900 pt-4">
          {rental.description || 'Penyedia layanan rental mobil terpercaya dengan komitmen kebersihan dan kepuasan pelanggan.'}
        </p>

        {/* Contact info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-400">
          {rental.phone && (
            <div className="flex items-center gap-2 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
              <Phone className="h-4 w-4 text-blue-400 shrink-0" />
              <span>{rental.phone}</span>
            </div>
          )}
          {rental.email && (
            <div className="flex items-center gap-2 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
              <Mail className="h-4 w-4 text-purple-400 shrink-0" />
              <span>{rental.email}</span>
            </div>
          )}
          {rental.businessLicense && (
            <div className="flex items-center gap-2 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
              <FileText className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Izin: {rental.businessLicense}</span>
            </div>
          )}
        </div>
      </div>

      {/* Available Fleet Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Armada Mobil Tersedia</h2>
          <p className="text-xs text-slate-400">Pilih armada favorit Anda untuk melihat ketersediaan tanggal sewa</p>
        </div>

        {cars.length === 0 ? (
          <EmptyState
            icon={Car}
            title="Belum Ada Mobil Tersedia"
            description="Mitra ini belum mendaftarkan mobil yang siap jalan."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div key={car.id} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition flex flex-col justify-between group shadow-lg">
                <div className="h-44 bg-slate-900 relative overflow-hidden">
                  <img
                    src={car.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-blue-400 border border-slate-800">
                    {car.type}
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 border border-slate-800">
                    {car.transmission}
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>{car.brand} • {car.year}</span>
                      <span>{car.seats} Kursi</span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition">{car.model}</h3>
                  </div>

                  <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Tarif Sewa</span>
                      <p className="text-sm font-extrabold text-emerald-400">{formatRupiah(car.pricePerDay)}<span className="text-xs text-slate-400 font-normal"> /hari</span></p>
                    </div>
                    <Link
                      to={`/cars/${car.id}`}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-md shadow-blue-600/20"
                    >
                      Pesan Sekarang
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer Reviews Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Ulasan & Penilaian Pelanggan</h2>
          <p className="text-xs text-slate-400">Pengalaman nyata pelanggan yang telah menyelesaikan sewa di rental ini</p>
        </div>

        {reviews.length === 0 ? (
          <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-400">
            Belum ada ulasan untuk tempat rental ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400">
                      {rev.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{rev.user?.name}</p>
                      <p className="text-[10px] text-slate-500">{new Date(rev.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <RatingStars rating={rev.rating} showNumber={false} />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
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
