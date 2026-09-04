import React, { useState, useEffect } from 'react';
import { 
  Users, 
  User, 
  Mail, 
  Phone, 
  Power, 
  CheckCircle2, 
  AlertCircle,
  Search,
  ShieldCheck
} from 'lucide-react';
import { adminService } from '../../services/api';
import Sidebar from '../../components/common/Sidebar';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllUsers({
        role: roleFilter !== 'ALL' ? roleFilter : undefined,
      });
      setUsers(res?.data || []);
    } catch (err) {
      setError(err?.message || 'Gagal memuat data pengguna');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleToggleStatus = async (userId) => {
    setActionLoading(true);
    setError(null);
    try {
      await adminService.toggleUserStatus(userId);
      setSuccessMsg('Status akun pengguna berhasil diperbarui!');
      fetchUsers();
    } catch (err) {
      setError(err?.message || 'Gagal mengubah status pengguna');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-warm-200 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-ink-primary tracking-tight">Manajemen Pengguna Platform</h1>
            <p className="text-xs text-ink-secondary">Daftar seluruh akun pelanggan, mitra rental, dan administrator</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Box */}
            <div className="relative w-full sm:w-48">
              <Search className="h-4 w-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama / email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-warm-300 rounded-xl pl-10 pr-3.5 py-2 text-xs text-ink-primary focus:outline-none focus:border-midnight-900"
              />
            </div>

            {/* Role Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-warm-100 rounded-full border border-warm-200 text-xs font-bold">
              {['ALL', 'USER', 'PARTNER', 'ADMIN'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-full transition ${
                    roleFilter === r
                      ? 'bg-midnight-900 text-white shadow-subtle'
                      : 'text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  {r === 'ALL' ? 'Semua' : r}
                </button>
              ))}
            </div>
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
          <LoadingSpinner text="Memuat daftar pengguna..." />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Tidak Ada Pengguna"
            description="Tidak ada pengguna yang cocok dengan filter atau pencarian."
          />
        ) : (
          <div className="bg-white border border-warm-300 rounded-3xl overflow-hidden shadow-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-warm-50 text-ink-secondary font-bold uppercase tracking-wider text-[10px] border-b border-warm-200">
                  <tr>
                    <th className="p-4">Pengguna</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Telepon</th>
                    <th className="p-4">Peran (Role)</th>
                    <th className="p-4">Status Akun</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-200 text-ink-primary font-medium">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-warm-50/60 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-midnight-900 text-lime flex items-center justify-center font-bold text-xs">
                            {u.name?.charAt(0) || 'U'}
                          </div>
                          <span className="font-bold text-ink-primary">{u.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-ink-secondary">{u.email}</td>
                      <td className="p-4 text-ink-secondary">{u.phone || '-'}</td>
                      <td className="p-4">
                        <Badge status={u.role} />
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${u.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${u.active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {u.active ? 'Aktif' : 'Diblokir'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleToggleStatus(u.id)}
                            disabled={actionLoading}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                              u.active
                                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                          >
                            <Power className="h-3 w-3" />
                            {u.active ? 'Blokir' : 'Aktifkan'}
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
