import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, Lock, Mail, AlertCircle, LogIn, Check } from 'lucide-react';
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

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
        navigate(
          from === '/login' || from === '/register' ? '/' : from,
          { replace: true }
        );
      }
    } catch (err) {
      setError(
        err?.message ||
        'Login gagal. Periksa kembali email dan password Anda.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 bg-white rounded-3xl overflow-hidden border border-warm-300 shadow-floating">

        {/* Left Side: Editorial Midnight Hero */}
        <div className="md:col-span-5 bg-midnight-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">

          <div className="absolute -right-16 -top-16 w-48 h-48 bg-lime/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">

            <div className="h-11 w-11 rounded-xl bg-white/10 flex items-center justify-center text-lime border border-white/20">
              <Car className="h-6 w-6 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-lime">
                Platform Kemitraan
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Move on <span className="text-lime">your</span> terms.
              </h2>

              <p className="text-xs text-warm-200/80 leading-relaxed">
                Akses akun Anda untuk mengelola pemesanan armada rental,
                verifikasi permohonan, atau melihat histori sewa mobil.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 space-y-2 text-[11px] text-warm-200/80 relative z-10">

            <p className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-lime" />
              Keamanan akun dengan JWT & BCrypt
            </p>

            <p className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-lime" />
              Akses terpadu untuk Pelanggan & Mitra
            </p>

          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:col-span-7 p-8 sm:p-10 space-y-6 bg-white">

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-ink-primary tracking-tight">
              Masuk ke Akun
            </h3>

            <p className="text-xs text-ink-secondary">
              Silakan masukkan email dan kata sandi Anda
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-primary">
                Alamat Email
              </label>

              <div className="relative">
                <Mail className="h-4 w-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />

                <input
                  type="email"
                  name="email"
                  required
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-ink-primary placeholder-ink-muted focus:outline-none focus:border-midnight-900 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-primary">
                Kata Sandi (Password)
              </label>

              <div className="relative">
                <Lock className="h-4 w-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />

                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-ink-primary placeholder-ink-muted focus:outline-none focus:border-midnight-900 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-midnight-900 hover:bg-midnight-800 disabled:opacity-50 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-card transition duration-200 mt-2"
            >
              <LogIn className="h-4 w-4" />

              {loading
                ? 'Memverifikasi...'
                : 'Masuk ke Akun'}
            </button>

          </form>

          {/* Register */}
          <p className="text-center text-xs text-ink-secondary">
            Belum memiliki akun?{' '}

            <Link
              to="/register"
              className="font-bold text-midnight-900 hover:underline"
            >
              Daftar Sekarang
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}