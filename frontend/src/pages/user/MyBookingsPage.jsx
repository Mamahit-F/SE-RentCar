import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Car, 
  Building2, 
  CreditCard, 
  Star, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { bookingService, paymentService, reviewService } from '../../services/api';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Payment Modal State
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedBookingForPay, setSelectedBookingForPay] = useState(null);
  const [payMethod, setPayMethod] = useState('TRANSFER');

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getMyBookings();
      setBookings(res?.data || []);
    } catch (err) {
      setError(err?.message || 'Gagal memuat daftar booking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleSimulatePayment = async (e) => {
    e.preventDefault();
    if (!selectedBookingForPay) return;
    setActionLoading(true);
    setError(null);

    try {
      await paymentService.simulatePayment({
        bookingId: selectedBookingForPay.id,
        method: payMethod,
      });
      setPayModalOpen(false);
      setSuccessMsg('Pembayaran simulasi berhasil diverifikasi! Status pesanan kini CONFIRMED.');
      fetchMyBookings();
    } catch (err) {
      setError(err?.message || 'Simulasi pembayaran gagal');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) return;
    setActionLoading(true);
    try {
      await bookingService.cancelBooking(bookingId);
      setSuccessMsg('Pesanan berhasil dibatalkan');
      fetchMyBookings();
    } catch (err) {
      setError(err?.message || 'Gagal membatalkan pesanan');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedBookingForReview) return;
    setActionLoading(true);
    setError(null);

    try {
      await reviewService.createReview({
        bookingId: selectedBookingForReview.id,
        rating: Number(rating),
        comment: comment,
      });
      setReviewModalOpen(false);
      setSuccessMsg('Ulasan berhasil dikirim! Terima kasih atas masukan Anda.');
      setComment('');
      fetchMyBookings();
    } catch (err) {
      setError(err?.message || 'Gagal mengirim ulasan');
    } finally {
      setActionLoading(false);
    }
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-1 border-b border-warm-200 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">Pesanan Sewa Saya</h1>
        <p className="text-xs text-ink-secondary">Pantau status pemesanan kendaraan, lakukan pembayaran, dan beri ulasan mitra</p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-subtle">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-xs font-bold hover:underline">Tutup</button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between shadow-subtle">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-xs font-bold hover:underline">Tutup</button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Memuat riwayat pesanan Anda..." />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="Belum Ada Riwayat Pesanan"
          description="Anda belum memesan kendaraan rental. Temukan mobil impian untuk perjalanan Anda sekarang."
          action={
            <Link to="/cars" className="inline-flex items-center gap-2 bg-midnight-900 hover:bg-midnight-800 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-card transition">
              Cari & Sewa Mobil <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div 
              key={b.id} 
              className="bg-white border border-warm-300 rounded-3xl p-6 shadow-subtle hover:shadow-card transition-all duration-200 space-y-4 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                {/* Status bar */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-midnight-900 bg-warm-100 px-2.5 py-0.5 rounded-lg border border-warm-200">
                    #BOOK-{b.id}
                  </span>
                  <Badge status={b.status} />
                  {b.payment?.status === 'SUCCESS' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CreditCard className="h-3 w-3" /> LUNAS ({b.payment?.method})
                    </span>
                  )}
                </div>

                {/* Car Thumbnail & Details */}
                <div className="flex items-start gap-4">
                  <div className="h-20 w-28 bg-warm-100 rounded-2xl overflow-hidden shrink-0 border border-warm-200">
                    <img
                      src={b.car?.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80'}
                      alt={b.car?.model}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-ink-primary">
                      {b.car?.brand} {b.car?.model}
                    </h3>
                    <p className="text-xs text-ink-secondary flex items-center gap-1.5 font-medium">
                      <Building2 className="h-3.5 w-3.5 text-midnight-900 shrink-0" />
                      {b.rentalPlace?.name} ({b.rentalPlace?.city})
                    </p>
                    <p className="text-xs text-ink-secondary flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-ink-muted shrink-0" />
                      {b.startDate} s/d {b.endDate} <span className="font-bold text-ink-primary">({b.durationDays} Hari)</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Price & Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-warm-200">
                <div className="text-left md:text-right">
                  <span className="text-[11px] font-bold text-ink-secondary uppercase tracking-wider block">Total Tagihan</span>
                  <p className="text-xl font-black text-midnight-900">{formatRupiah(b.totalPrice)}</p>
                </div>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  {b.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedBookingForPay(b);
                          setPayModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 bg-midnight-900 hover:bg-midnight-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-subtle transition"
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                        Bayar Sekarang
                      </button>
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-2.5 rounded-xl border border-rose-200 transition"
                      >
                        Batalkan
                      </button>
                    </>
                  )}

                  {b.status === 'COMPLETED' && !b.review && (
                    <button
                      onClick={() => {
                        setSelectedBookingForReview(b);
                        setReviewModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-subtle transition"
                    >
                      <Star className="h-3.5 w-3.5" />
                      Beri Ulasan
                    </button>
                  )}

                  {b.review && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-800 font-bold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      Sudah Diulas ({b.review.rating}/5)
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Simulation Modal */}
      <Modal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        title="Simulasi Pembayaran Rental"
      >
        {selectedBookingForPay && (
          <form onSubmit={handleSimulatePayment} className="space-y-4">
            <div className="bg-warm-50 p-4 rounded-2xl border border-warm-200 space-y-2 text-xs">
              <div className="flex justify-between text-ink-secondary">
                <span>ID Pemesanan:</span>
                <span className="font-mono text-ink-primary font-bold">#BOOK-{selectedBookingForPay.id}</span>
              </div>
              <div className="flex justify-between text-ink-secondary">
                <span>Mobil:</span>
                <span className="text-ink-primary font-bold">{selectedBookingForPay.car?.brand} {selectedBookingForPay.car?.model}</span>
              </div>
              <div className="flex justify-between text-ink-secondary">
                <span>Durasi:</span>
                <span className="text-ink-primary font-bold">{selectedBookingForPay.durationDays} Hari</span>
              </div>
              <div className="pt-2 border-t border-warm-200 flex justify-between text-sm font-black">
                <span className="text-ink-primary">Jumlah Tagihan:</span>
                <span className="text-midnight-900">{formatRupiah(selectedBookingForPay.totalPrice)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-ink-primary">Pilih Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'TRANSFER', label: 'Transfer Bank' },
                  { id: 'E_WALLET', label: 'E-Wallet' },
                  { id: 'COD', label: 'Bayar Tunai' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPayMethod(m.id)}
                    className={`p-3 rounded-xl text-xs font-bold border text-center transition ${
                      payMethod === m.id
                        ? 'bg-midnight-900 text-white border-midnight-900 shadow-subtle'
                        : 'bg-warm-50 text-ink-secondary border-warm-200 hover:border-warm-300'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-ink-secondary bg-warm-100 p-3 rounded-xl border border-warm-200 leading-relaxed">
              💡 Ini adalah simulasi transaksi pembayaran. Klik tombol di bawah untuk menyelesaikan simulasi dan mengubah status pesanan menjadi <strong>CONFIRMED</strong>.
            </p>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full inline-flex items-center justify-center gap-2 bg-midnight-900 hover:bg-midnight-800 disabled:opacity-50 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-card transition"
            >
              <CheckCircle2 className="h-4 w-4" />
              {actionLoading ? 'Memproses...' : `Simulasikan Bayar ${formatRupiah(selectedBookingForPay.totalPrice)}`}
            </button>
          </form>
        )}
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Beri Ulasan Rental Mobil"
      >
        {selectedBookingForReview && (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="space-y-1 text-xs text-ink-secondary bg-warm-50 p-3 rounded-xl border border-warm-200">
              <p>Tempat Rental: <span className="font-bold text-ink-primary">{selectedBookingForReview.rentalPlace?.name}</span></p>
              <p>Mobil: <span className="font-bold text-ink-primary">{selectedBookingForReview.car?.brand} {selectedBookingForReview.car?.model}</span></p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-ink-primary">Rating Kepuasan (1 - 5 Bintang)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1 ${
                      rating >= num
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : 'bg-warm-50 border-warm-200 text-ink-muted'
                    }`}
                  >
                    <Star className={`h-4 w-4 ${rating >= num ? 'fill-amber-400 text-amber-400' : ''}`} />
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-primary">Komentar & Pengalaman Sewa</label>
              <textarea
                rows={4}
                required
                placeholder="Ceritakan kondisi mobil, kebersihan unit, dan keramahan staf rental..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-warm-50 border border-warm-300 rounded-xl p-3 text-xs text-ink-primary placeholder-ink-muted focus:outline-none focus:border-midnight-900 focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full inline-flex items-center justify-center gap-2 bg-midnight-900 hover:bg-midnight-800 disabled:opacity-50 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-card transition"
            >
              <Star className="h-4 w-4" />
              {actionLoading ? 'Mengirim...' : 'Kirim Ulasan Sekarang'}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
