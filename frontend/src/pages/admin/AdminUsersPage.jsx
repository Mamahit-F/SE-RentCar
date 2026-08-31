import React, { useState, useEffect } from 'react';
import { Users, Power, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { adminService } from '../../services/api';
import Sidebar from '../../components/common/Sidebar';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState(null);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let res;
      if (roleFilter === 'ALL') {
        res = await adminService.getAllUsers();
      } else {
        res = await adminService.getUsersByRole(roleFilter);
      }
      setUsers(res?.data || []);
    } catch (err) {
      setError(err?.message || 'Gagal memuat pengguna');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleToggleStatus = async (id) => {
    try {
      await adminService.toggleUserStatus(id);
      setSuccessMsg('Status akun pengguna berhasil diubah');
      fetchUsers();
    } catch (err) {
      setError(err?.message || 'Gagal mengubah status pengguna');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">Manajemen Pengguna Platform</h1>
          <p className="text-xs text-slate-400">Daftar akun pelanggan, mitra rental, dan administrator sistem</p>
        </div>

        {/* Role Filter */}
        <div className="flex gap-2 p-1 bg-slate-950 border border-slate-800 rounded-2xl w-fit text-xs">
          {[
            { id: 'ALL', label: 'Semua Role' },
            { id: 'USER', label: 'Customer (User)' },
            { id: 'PARTNER', label: 'Mitra Rental (Partner)' },
            { id: 'ADMIN', label: 'Admin' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-bold transition ${
                roleFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
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
          <LoadingSpinner text="Memuat data pengguna..." />
        ) : (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Nama Lengkap</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">No. Telepon</th>
                    <th className="p-4">Role Akses</th>
                    <th className="p-4">Status Akun</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/40 transition">
                      <td className="p-4 font-bold text-white">{u.name}</td>
                      <td className="p-4 font-mono">{u.email}</td>
                      <td className="p-4">{u.phone || '-'}</td>
                      <td className="p-4"><Badge status={u.role} /></td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${u.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                          {u.isActive ? 'Aktif' : 'Dinonaktifkan'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleToggleStatus(u.id)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-semibold transition ${
                              u.isActive
                                ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                            }`}
                          >
                            <Power className="h-3 w-3" />
                            {u.isActive ? 'Suspend' : 'Aktifkan'}
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
