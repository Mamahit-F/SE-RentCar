import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Car, 
  Building2, 
  User, 
  CreditCard, 
  Search, 
  Clock,
  Filter
} from 'lucide-react';
import { adminService } from '../../services/api';
import Sidebar from '../../components/common/Sidebar';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllBookings({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      setBookings(res?.data || []);
    } catch (err) {
      console.error('Error fetching admin bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const filteredBookings = bookings.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.user?.name?.toLowerCase().includes(q) ||
      b.rentalPlace?.name?.toLowerCase().includes(q) ||
      b.car?.model?.toLowerCase().includes(q) ||
      String(b.id).includes(q)
    );
  });

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-warm-200 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-ink-primary tracking-tight">Audit Seluruh Pemesanan (Bookings)</h1>
            <p className="text-xs text-ink-secondary">Pantau seluruh siklus sewa, pembayaran, dan performa transaksi</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-48">
              <Search className="h-4 w-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari ID / penyewa / mobil..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-warm-300 rounded-xl pl-10 pr-3.5 py-2 text-xs text-ink-primary focus:outline-none focus:border-midnight-900"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 p-1 bg-warm-100 rounded-full border border-warm-200 text-xs font-bold">
              {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full transition ${
                    statusFilter === s
                      ? 'bg-midnight-900 text-white shadow-subtle'
                      : 'text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  {s === 'ALL' ? 'Semua' : s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Memuat seluruh data booking..." />
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="Tidak Ada Data Booking"
            description="Tidak ditemukan riwayat pemesanan yang sesuai dengan filter."
          />
        ) : (
          <div className="bg-white border border-warm-300 rounded-3xl overflow-hidden shadow-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-warm-50 text-ink-secondary font-bold uppercase tracking-wider text-[10px] border-b border-warm-200">
                  <tr>
                    <th className="p-4">ID & Status</th>
                    <th className="p-4">Pelanggan</th>
                    <th className="p-4">Armada Mobil</th>
                    <th className="p-4">Tempat Rental</th>
                    <th className="p-4">Jadwal Sewa</th>
                    <th className="p-4">Total Biaya</th>
                    <th className="p-4">Status Pembayaran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-200 text-ink-primary font-medium">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-warm-50/60 transition">
                      <td className="p-4">
                        <span className="font-mono font-bold text-midnight-900 block">#BOOK-{b.id}</span>
                        <div className="mt-1">
                          <Badge status={b.status} />
                        </div>
                      </td>
                      <td className="p-4">
                        <strong className="text-ink-primary font-bold block">{b.user?.name}</strong>
                        <span className="text-[10px] text-ink-secondary">{b.user?.email}</span>
                      </td>
                      <td className="p-4">
                        <strong className="text-ink-primary font-bold block">{b.car?.brand} {b.car?.model}</strong>
                        <span className="text-[10px] text-ink-secondary">{b.car?.transmission} · {b.car?.type}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold">{b.rentalPlace?.name}</span>
                        <span className="text-[10px] text-ink-secondary block">{b.rentalPlace?.city}</span>
                      </td>
                      <td className="p-4">
                        <span>{b.startDate} s/d {b.endDate}</span>
                        <span className="text-[10px] text-ink-secondary font-bold block">({b.durationDays} Hari)</span>
                      </td>
                      <td className="p-4 font-black text-midnight-900 text-sm">
                        {formatRupiah(b.totalPrice)}
                      </td>
                      <td className="p-4">
                        {b.payment ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CreditCard className="h-3 w-3" /> Lunas ({b.payment.method})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            <Clock className="h-3 w-3" /> Belum Bayar
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
