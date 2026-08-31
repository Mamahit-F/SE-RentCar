import React, { useState, useEffect } from 'react';
import { Building2, CheckCircle2, XCircle, MapPin, Power, ShieldCheck, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/api';
import Sidebar from '../../components/common/Sidebar';
import Badge from '../../components/common/Badge';
import RatingStars from '../../components/common/RatingStars';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState(null);
  const [error, setError] = useState(null);

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllRentals();
      setRentals(res?.data || []);
    } catch (err) {
      setError(err?.message || 'Gagal memuat daftar rental');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await adminService.toggleRentalStatus(id);
      setSuccessMsg('Status operasional tempat rental berhasil diubah!');
      fetchRentals();
    } catch (err) {
      setError(err?.message || 'Gagal mengubah status rental');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">Semua Tempat Rental Mitra</h1>
          <p className="text-xs text-slate-400">Pengawasan operasional seluruh tempat rental di platform</p>
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
          <LoadingSpinner text="Memuat semua data tempat rental..." />
        ) : rentals.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Belum Ada Tempat Rental"
            description="Belum ada mitra yang mendaftarkan tempat rental."
          />
        ) : (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Nama Rental</th>
                    <th className="p-4">Mitra / Partner</th>
                    <th className="p-4">Kota / Lokasi</th>
                    <th className="p-4">Armada</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {rentals.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-900/40 transition">
                      <td className="p-4 font-bold text-white">
                        {r.name}
                        <span className="block text-[11px] text-slate-500 font-normal">NIB: {r.businessLicense || '-'}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-200 block">{r.partner?.name}</span>
                        <span className="text-[11px] text-slate-500">{r.partner?.email}</span>
                      </td>
                      <td className="p-4">{r.city}, {r.province}</td>
                      <td className="p-4 font-semibold text-blue-400">{r.totalCars} Mobil</td>
                      <td className="p-4"><Badge status={r.status} /></td>
                      <td className="p-4 text-right">
                        {(r.status === 'ACTIVE' || r.status === 'INACTIVE') && (
                          <button
                            onClick={() => handleToggleStatus(r.id)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-semibold transition ${
                              r.status === 'ACTIVE'
                                ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                            }`}
                          >
                            <Power className="h-3 w-3" />
                            {r.status === 'ACTIVE' ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>
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
