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
  ArrowRight
} from 'lucide-react';
import { bookingService, paymentService, reviewService } from '../../services/api';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import RatingStars from '../../components/common/RatingStars';
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
      setSuccessMsg('Pembayaran simulasi berhasil! Pesanan Anda kini terkonfirmasi.');
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
      setSuccessMsg('Ulasan berhasil dikirim! Terima kasih.');
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
    <div className="space-y-8 py-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Pesanan Sewa Saya</h1>
        <p className="text-xs sm:text-sm text-slate-400">Pantau status pemesanan rental mobil, lakukan pembayaran, dan beri ulasan</p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-xs hover:underline">Tutup</button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-xs hover:underline">Tutup</button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Memuat daftar pesanan Anda..." />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="Belum Ada Pesanan"
          description="Anda belum memiliki riwayat pesanan rental mobil."
          action={
            <Link to="/cars" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md">
              Cari & Sewa Mobil <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">#BOOK-{b.id}</span>
                  <Badge status={b.status} />
                  {b.payment?.status === 'SUCCESS' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CreditCard className="h-3 w-3" /> LUNAS ({b.payment?.method})
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-16 w-24 bg-slate-900 rounded-xl overflow-hidden shrink-0 border border-slate-800">
                    <img
                      src={b.car?.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80'}
                      alt={b.car?.model}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">{b.car?.brand} {b.car?.model}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-slate-500" />
                      {b.rentalPlace?.name} ({b.rentalPlace?.city})
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      {b.startDate} s/d {b.endDate} ({b.durationDays} Hari)
                    </p>
                  </div>
                </div>
              </div>

              {/* Price & Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-900">
                <div className="text-left md:text-right">
                  <span className="text-xs text-slate-400 block">Total Tagihan</span>
                  <p className="text-lg font-extrabold text-emerald-400">{formatRupiah(b.totalPrice)}</p>
                </div>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  {b.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedBookingForPay(b);
                          setPayModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition"
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                        Bayar Sekarang
                      </button>
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="text-xs font-semibold text-rose-400 hover:bg-rose-500/10 px-3 py-2 rounded-xl border border-rose-500/20 transition"
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
                      className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition"
                    >
                      <Star className="h-3.5 w-3.5" />
                      Beri Ulasan
                    </button>
                  )}

                  {b.review && (
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                      <Star className="h-3.5 w-3.5 fill-amber-400" />
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
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>ID Pesanan:</span>
                <span className="font-mono text-white font-bold">#BOOK-{selectedBookingForPay.id}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Mobil:</span>
                <span className="text-white font-medium">{selectedBookingForPay.car?.brand} {selectedBookingForPay.car?.model}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Durasi:</span>
                <span className="text-white">{selectedBookingForPay.durationDays} Hari</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold">
                <span className="text-white">Jumlah Pembayaran:</span>
                <span className="text-emerald-400">{formatRupiah(selectedBookingForPay.totalPrice)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Pilih Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'TRANSFER', label: 'Transfer Bank' },
                  { id: 'E_WALLET', label: 'E-Wallet' },
                  { id: 'COD', label: 'Bayar Tunai (COD)' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPayMethod(m.id)}
                    className={`p-3 rounded-xl text-xs font-semibold border text-center transition ${
                      payMethod === m.id
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
              💡 Ini adalah simulasi pembayaran untuk keperluan tugas akhir. Mengklik tombol di bawah akan langsung memvalidasi pembayaran dan mengubah status booking menjadi <strong>CONFIRMED</strong>.
            </p>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition"
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
            <div className="space-y-1 text-xs text-slate-400">
              <p>Tempat Rental: <span className="font-bold text-white">{selectedBookingForReview.rentalPlace?.name}</span></p>
              <p>Mobil: <span className="font-bold text-white">{selectedBookingForReview.car?.brand} {selectedBookingForReview.car?.model}</span></p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Rating Kepuasan (1 - 5 Bintang)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1 ${
                      rating >= num
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    <Star className={`h-4 w-4 ${rating >= num ? 'fill-amber-400' : ''}`} />
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Komentar & Pengalaman Sewa</label>
              <textarea
                rows={4}
                required
                placeholder="Ceritakan kondisi mobil, keramahan staf rental, dan kenyamanan perjalanan Anda..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition"
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
