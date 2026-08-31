import React, { useState, useEffect } from 'react';
import { Calendar, Car, Building2, User, CreditCard } from 'lucide-react';
import { adminService } from '../../services/api';
import Sidebar from '../../components/common/Sidebar';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await adminService.getAllBookings();
        setBookings(res?.data || []);
      } catch (err) {
        console.error('Error fetching admin bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">Monitoring Semua Pesanan Sewa</h1>
          <p className="text-xs text-slate-400">Pengawasan transaksi rental mobil yang berlangsung di platform</p>
        </div>

        {loading ? (
          <LoadingSpinner text="Memuat seluruh data pesanan..." />
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-400">
            Belum ada data pesanan sewa di platform.
          </div>
        ) : (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">ID & Tanggal</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Mobil & Rental</th>
                    <th className="p-4">Durasi Sewa</th>
                    <th className="p-4">Total Tarif</th>
                    <th className="p-4">Status Pesanan</th>
                    <th className="p-4">Pembayaran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-900/40 transition">
                      <td className="p-4 font-mono font-bold text-slate-300">
                        #BOOK-{b.id}
                        <span className="block text-[10px] text-slate-500 font-normal">{new Date(b.createdAt).toLocaleDateString('id-ID')}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-white block">{b.user?.name}</span>
                        <span className="text-[11px] text-slate-500">{b.user?.email}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-white block">{b.car?.brand} {b.car?.model}</span>
                        <span className="text-[11px] text-slate-400">{b.rentalPlace?.name}</span>
                      </td>
                      <td className="p-4">
                        <span>{b.startDate} s/d {b.endDate}</span>
                        <span className="block text-[11px] text-slate-500">({b.durationDays} Hari)</span>
                      </td>
                      <td className="p-4 font-bold text-emerald-400">{formatRupiah(b.totalPrice)}</td>
                      <td className="p-4"><Badge status={b.status} /></td>
                      <td className="p-4">
                        {b.payment ? (
                          <span className="text-emerald-400 font-semibold block text-[11px]">
                            Lunas ({b.payment.method})
                          </span>
                        ) : (
                          <span className="text-amber-400 font-semibold block text-[11px]">
                            Belum Bayar
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
