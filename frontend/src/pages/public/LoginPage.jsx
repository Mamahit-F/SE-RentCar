import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, Lock, Mail, AlertCircle, LogIn, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await login(formData);
      // Redirect based on role
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'PARTNER') {
        navigate('/partner/dashboard', { replace: true });
      } else {
        navigate(from === '/login' || from === '/register' ? '/' : from, { replace: true });
      }
    } catch (err) {
      setError(err?.message || 'Login gagal. Periksa kembali email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (email, pass) => {
    setFormData({ email, password: pass });
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-blue-600 items-center justify-center text-white shadow-xl shadow-blue-600/30">
            <Car className="h-7 w-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Selamat Datang Kembali
          </h2>
          <p className="text-xs text-slate-400">
            Masuk ke akun Anda untuk mengelola pesanan sewa atau armada rental
          </p>
        </div>

        {/* Demo Accounts Quick Login Picker */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2.5">
          <p className="text-xs font-bold text-slate-300">🔑 Akun Demo (Klik untuk isi cepat):</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('user@rental.com', 'user123')}
              className="text-xs font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 p-2 rounded-xl border border-blue-500/20 transition text-center"
            >
              User Demo
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('partner@rental.com', 'partner123')}
              className="text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 p-2 rounded-xl border border-purple-500/20 transition text-center"
            >
              Mitra Rental
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin@rental.com', 'admin123')}
              className="text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 p-2 rounded-xl border border-amber-500/20 transition text-center"
            >
              Admin Sistem
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Alamat Email</label>
            <div className="relative">
              <Mail className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                placeholder="nama@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Kata Sandi (Password)</label>
            <div className="relative">
              <Lock className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-blue-600/20 transition mt-2"
          >
            <LogIn className="h-4 w-4" />
            {loading ? 'Memverifikasi...' : 'Masuk ke Akun'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Belum memiliki akun?{' '}
          <Link to="/register" className="font-semibold text-blue-400 hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
