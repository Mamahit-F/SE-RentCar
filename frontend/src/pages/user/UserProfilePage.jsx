import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, ShieldCheck, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { userService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';

export default function UserProfilePage() {
  const { user, setUser, role } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccessMsg(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setError(null);

    try {
      const res = await userService.updateProfile(formData);
      setUser(res.data);
      localStorage.setItem('rental_user', JSON.stringify(res.data));
      setSuccessMsg('Profil berhasil diperbarui!');
    } catch (err) {
      setError(err?.message || 'Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-ink-primary tracking-tight">Pengaturan Profil Pengguna</h1>
        <p className="text-xs text-ink-secondary">Kelola data identitas akun dan informasi kontak Anda</p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 shadow-subtle">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 shadow-subtle">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      <div className="bg-white border border-warm-300 rounded-3xl p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-warm-200">
          <div className="h-16 w-16 rounded-2xl bg-midnight-900 text-lime flex items-center justify-center text-xl font-black shadow-subtle">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-ink-primary">{user?.name}</h2>
              <Badge status={role} />
            </div>
            <p className="text-xs text-ink-secondary mt-0.5">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink-primary">Nama Lengkap</label>
            <div className="relative">
              <User className="h-4 w-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-warm-50 border border-warm-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-ink-primary font-medium focus:outline-none focus:border-midnight-900 focus:bg-white transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink-primary">Alamat Email (Tidak dapat diubah)</label>
            <div className="relative">
              <Mail className="h-4 w-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-warm-100 border border-warm-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-ink-secondary cursor-not-allowed font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink-primary">Nomor Telepon / WhatsApp</label>
            <div className="relative">
              <Phone className="h-4 w-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                name="phone"
                placeholder="081234567890"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-warm-50 border border-warm-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-ink-primary font-medium focus:outline-none focus:border-midnight-900 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-midnight-900 hover:bg-midnight-800 disabled:opacity-50 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-card transition duration-200"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
}
