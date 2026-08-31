import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Car, 
  User, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  CreditCard, 
  AlertCircle,
  Flag
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

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await partnerService.getPartnerBookings();
      setBookings(res?.data || []);
    } catch (err) {
      setError(err?.message || 'Gagal memuat pesanan masuk');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setActionLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await partnerService.updateBookingStatus(bookingId, newStatus);
      setSuccessMsg(`Status pesanan #BOOK-${bookingId} berhasil diubah menjadi ${newStatus}`);
      fetchBookings();
    } catch (err) {
      setError(err?.message || 'Gagal memperbarui status booking');
    } finally {
      setActionLoading(false);
    }
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">Kelola Pesanan Masuk</h1>
          <p className="text-xs text-slate-400">Konfirmasi pemesanan, verifikasi serah terima, dan selesaikan sewa mobil</p>
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
          <LoadingSpinner text="Memuat pesanan masuk..." />
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
                className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">#BOOK-{b.id}</span>
                    <Badge status={b.status} />
                    {b.payment?.status === 'SUCCESS' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CreditCard className="h-3 w-3" /> LUNAS ({b.payment?.method})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        <Clock className="h-3 w-3" /> Menunggu Bayar
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-400">Mobil Yang Disewa:</p>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Car className="h-4 w-4 text-blue-400" />
                        {b.car?.brand} {b.car?.model} ({b.car?.transmission})
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        {b.startDate} s/d {b.endDate} ({b.durationDays} Hari)
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-slate-400">Informasi Pelanggan:</p>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <User className="h-4 w-4 text-purple-400" />
                        {b.user?.name}
                      </h4>
                      <p className="text-xs text-slate-400">{b.user?.email} • {b.user?.phone || '-'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-900">
                  <div className="text-left md:text-right">
                    <span className="text-xs text-slate-400 block">Total Pembayaran</span>
                    <p className="text-lg font-extrabold text-emerald-400">{formatRupiah(b.totalPrice)}</p>
                  </div>

                  {/* Partner Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {b.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md transition"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Konfirmasi
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'REJECTED')}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold px-3 py-1.5 rounded-xl border border-rose-500/20 transition"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Tolak
                        </button>
                      </>
                    )}

                    {b.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'COMPLETED')}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition"
                      >
                        <Flag className="h-3.5 w-3.5" /> Selesaikan Sewa
                      </button>
                    )}

                    {b.status === 'COMPLETED' && (
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                        ✓ Sewa Telah Selesai
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
