import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Car, 
  ShieldCheck, 
  Power, 
  CheckCircle2, 
  AlertCircle,
  Search
} from 'lucide-react';
import { adminService } from '../../services/api';
import Sidebar from '../../components/common/Sidebar';
import Badge from '../../components/common/Badge';
import RatingStars from '../../components/common/RatingStars';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [successMsg, setSuccessMsg] = useState(null);
  const [error, setError] = useState(null);

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllRentals();
      setRentals(res?.data || []);
    } catch (err) {
      setError(err?.message || 'Gagal memuat daftar tempat rental');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleToggleStatus = async (rentalId) => {
    setActionLoading(true);
    setError(null);
    try {
      await adminService.toggleRentalStatus(rentalId);
      setSuccessMsg('Status tempat rental berhasil diubah!');
      fetchRentals();
    } catch (err) {
      setError(err?.message || 'Gagal mengubah status rental');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRentals = rentals.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.name?.toLowerCase().includes(q) ||
      r.city?.toLowerCase().includes(q) ||
      r.partner?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-warm-200 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-ink-primary tracking-tight">Semua Tempat Rental Mitra</h1>
            <p className="text-xs text-ink-secondary">Kelola dan moderasi status operasional tempat rental di seluruh platform</p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="h-4 w-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari rental / kota..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-warm-300 rounded-xl pl-10 pr-3.5 py-2 text-xs text-ink-primary focus:outline-none focus:border-midnight-900"
            />
          </div>
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
          <LoadingSpinner text="Memuat data rental..." />
        ) : filteredRentals.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Tidak Ada Tempat Rental"
            description="Tidak ditemukan tempat rental yang sesuai dengan kata kunci pencarian."
          />
        ) : (
          <div className="bg-white border border-warm-300 rounded-3xl overflow-hidden shadow-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-warm-50 text-ink-secondary font-bold uppercase tracking-wider text-[10px] border-b border-warm-200">
                  <tr>
                    <th className="p-4">Nama Rental</th>
                    <th className="p-4">Lokasi</th>
                    <th className="p-4">Mitra Pemilik</th>
                    <th className="p-4">Armada</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Aksi Moderasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-200 text-ink-primary font-medium">
                  {filteredRentals.map((r) => (
                    <tr key={r.id} className="hover:bg-warm-50/60 transition">
                      <td className="p-4">
                        <strong className="text-ink-primary font-bold block">{r.name}</strong>
                        <span className="text-[10px] text-ink-secondary">Izin: {r.businessLicense || '-'}</span>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-midnight-900" />
                          {r.city}, {r.province}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-bold">{r.partner?.name}</p>
                        <p className="text-[10px] text-ink-secondary">{r.partner?.email}</p>
                      </td>
                      <td className="p-4 font-bold text-midnight-900">
                        {r.totalCars || 0} Mobil
                      </td>
                      <td className="p-4">
                        <RatingStars rating={r.averageRating} count={r.totalReviews} />
                      </td>
                      <td className="p-4">
                        <Badge status={r.status} />
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(r.id)}
                          disabled={actionLoading}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                            r.status === 'ACTIVE'
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          <Power className="h-3.5 w-3.5" />
                          {r.status === 'ACTIVE' ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
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
