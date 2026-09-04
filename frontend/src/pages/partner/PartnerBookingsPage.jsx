import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Car, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  User, 
  CreditCard,
  Building2,
  Check
} from 'lucide-react';
import { partnerService } from '../../services/api';
import Sidebar from '../../components/common/Sidebar';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function PartnerBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [error, setError] = useState(null);

  const fetchPartnerBookings = async () => {
    setLoading(true);
    try {
      const res = await partnerService.getMyRentalBookings();
      setBookings(res?.data || []);
    } catch (err) {
      setError(err?.message || 'Gagal memuat daftar pesanan masuk');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnerBookings();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    if (!window.confirm(`Ubah status booking #${bookingId} menjadi ${newStatus}?`)) return;
    setActionLoading(true);
    setError(null);

    try {
      await partnerService.updateBookingStatus(bookingId, newStatus);
      setSuccessMsg(`Status booking berhasil diubah menjadi ${newStatus}`);
      fetchPartnerBookings();
    } catch (err) {
      setError(err?.message || `Gagal mengubah status booking ke ${newStatus}`);
    } finally {
      setActionLoading(false);
    }
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-6 overflow-y-auto">
        <div className="space-y-1 border-b border-warm-200 pb-6">
          <h1 className="text-2xl font-black text-ink-primary tracking-tight">Pesanan Masuk Pelanggan</h1>
          <p className="text-xs text-ink-secondary">Konfirmasi pesanan sewa baru, verifikasi pembayaran, dan selesaikan transaksi</p>
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
          <LoadingSpinner text="Memuat daftar pesanan..." />
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="Belum Ada Pesanan Masuk"
            description="Pesanan dari pelanggan yang menyewa armada Anda akan muncul di sini."
          />
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div 
                key={b.id} 
                className="bg-white border border-warm-300 rounded-3xl p-6 shadow-subtle hover:shadow-card transition-all duration-200 space-y-4 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Details */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-midnight-900 bg-warm-100 px-2.5 py-0.5 rounded-lg border border-warm-200">
                      #BOOK-{b.id}
                    </span>
                    <Badge status={b.status} />
                    {b.payment && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CreditCard className="h-3 w-3" /> LUNAS ({b.payment.method})
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <h4 className="text-sm font-extrabold text-ink-primary flex items-center gap-1.5">
                        <Car className="h-4 w-4 text-midnight-900" />
                        {b.car?.brand} {b.car?.model}
                      </h4>
                      <p className="text-xs text-ink-secondary mt-1">
                        Jadwal: <strong>{b.startDate}</strong> s/d <strong>{b.endDate}</strong> ({b.durationDays} Hari)
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-ink-primary flex items-center gap-1.5">
                        <User className="h-4 w-4 text-midnight-900" />
                        Pelanggan: {b.user?.name}
                      </h4>
                      <p className="text-xs text-ink-secondary mt-0.5">
                        Email: {b.user?.email} | Telp: {b.user?.phone || '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-warm-200">
                  <div className="text-left lg:text-right">
                    <span className="text-[11px] font-bold text-ink-secondary uppercase tracking-wider block">Total Pendapatan</span>
                    <p className="text-xl font-black text-midnight-900">{formatRupiah(b.totalPrice)}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    {b.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-subtle transition"
                        >
                          <Check className="h-3.5 w-3.5" /> Konfirmasi
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'REJECTED')}
                          disabled={actionLoading}
                          className="text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-2.5 rounded-xl border border-rose-200 transition"
                        >
                          Tolak
                        </button>
                      </>
                    )}

                    {b.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'COMPLETED')}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1.5 bg-midnight-900 hover:bg-midnight-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-subtle transition"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-lime" />
                        Selesaikan Rental
                      </button>
                    )}

                    {b.status === 'COMPLETED' && (
                      <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Transaksi Selesai
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
