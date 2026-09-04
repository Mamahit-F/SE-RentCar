import React, { useState, useEffect } from 'react';
import { Building2, Save, MapPin, Phone, Mail, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { partnerService } from '../../services/api';
import Sidebar from '../../components/common/Sidebar';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function PartnerRentalPage() {
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    province: '',
    phone: '',
    email: '',
    businessLicense: '',
    documentUrl: '',
  });

  const fetchRental = async () => {
    setLoading(true);
    try {
      const res = await partnerService.getMyRentals();
      if (res?.data && res.data.length > 0) {
        const r = res.data[0];
        setRental(r);
        setFormData({
          name: r.name || '',
          description: r.description || '',
          address: r.address || '',
          city: r.city || '',
          province: r.province || '',
          phone: r.phone || '',
          email: r.email || '',
          businessLicense: r.businessLicense || '',
          documentUrl: r.documentUrl || '',
        });
      }
    } catch (err) {
      console.error('Error fetching partner rental:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRental();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccessMsg(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSuccessMsg(null);
    setError(null);

    try {
      if (rental) {
        // Update existing rental place
        await partnerService.updateMyRental(rental.id, formData);
        setSuccessMsg('Data tempat rental berhasil diperbarui!');
      } else {
        // Create new rental place application
        const res = await partnerService.submitRental(formData);
        setRental(res.data);
        setSuccessMsg('Pengajuan tempat rental berhasil dikirim dan menunggu verifikasi Admin!');
      }
      fetchRental();
    } catch (err) {
      setError(err?.message || 'Gagal menyimpan data rental');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-6 overflow-y-auto max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-warm-200 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-ink-primary tracking-tight">
              {rental ? 'Kelola Profil Tempat Rental' : 'Pengajuan Tempat Rental Baru'}
            </h1>
            <p className="text-xs text-ink-secondary">
              Lengkapi informasi usaha, alamat operasional, dan berkas perizinan NIB Anda
            </p>
          </div>
          {rental && <Badge status={rental.status} />}
        </div>

        {rental?.status === 'REJECTED' && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1 shadow-subtle">
            <p className="font-bold">Catatan Penolakan dari Admin:</p>
            <p>{rental.rejectionReason || 'Mohon lengkapi izin usaha dan alamat operasional yang valid.'}</p>
          </div>
        )}

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

        {loading ? (
          <LoadingSpinner text="Memuat profil rental..." />
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-warm-300 rounded-3xl p-6 sm:p-8 shadow-subtle space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-primary">Nama Tempat Rental *</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Contoh: Nusantara Jaya Rent Car"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-warm-50 border border-warm-300 rounded-xl px-4 py-2.5 text-xs text-ink-primary font-medium focus:outline-none focus:border-midnight-900 focus:bg-white transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-primary">Deskripsi Rental & Layanan</label>
              <textarea
                name="description"
                rows={3}
                placeholder="Jelaskan jenis armada, kelebihan layanan, sistem lepas kunci / dengan supir..."
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-warm-50 border border-warm-300 rounded-xl p-3 text-xs text-ink-primary font-medium focus:outline-none focus:border-midnight-900 focus:bg-white transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-primary">Kota Operasional *</label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="Contoh: Jakarta Selatan"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl px-4 py-2.5 text-xs text-ink-primary font-medium focus:outline-none focus:border-midnight-900 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-primary">Provinsi *</label>
                <input
                  type="text"
                  name="province"
                  required
                  placeholder="Contoh: DKI Jakarta"
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl px-4 py-2.5 text-xs text-ink-primary font-medium focus:outline-none focus:border-midnight-900 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-primary">Alamat Lengkap Kantor / Garasi *</label>
              <input
                type="text"
                name="address"
                required
                placeholder="Jl. Raya Utama No. 123"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-warm-50 border border-warm-300 rounded-xl px-4 py-2.5 text-xs text-ink-primary font-medium focus:outline-none focus:border-midnight-900 focus:bg-white transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-primary">Nomor Telepon CS / Kantor</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="0217654321"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl px-4 py-2.5 text-xs text-ink-primary font-medium focus:outline-none focus:border-midnight-900 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-primary">Email Operasional</label>
                <input
                  type="email"
                  name="email"
                  placeholder="cs@nusantararental.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl px-4 py-2.5 text-xs text-ink-primary font-medium focus:outline-none focus:border-midnight-900 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-warm-200">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-primary">Nomor Izin Usaha (NIB / SIUP)</label>
                <input
                  type="text"
                  name="businessLicense"
                  placeholder="NIB-9120038472910"
                  value={formData.businessLicense}
                  onChange={handleChange}
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl px-4 py-2.5 text-xs text-ink-primary font-medium focus:outline-none focus:border-midnight-900 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-primary">URL Dokumen Legalitas (PDF / Link Gambar)</label>
                <input
                  type="url"
                  name="documentUrl"
                  placeholder="https://example.com/dokumen-nib.pdf"
                  value={formData.documentUrl}
                  onChange={handleChange}
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl px-4 py-2.5 text-xs text-ink-primary font-medium focus:outline-none focus:border-midnight-900 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saveLoading}
              className="inline-flex items-center gap-2 bg-midnight-900 hover:bg-midnight-800 disabled:opacity-50 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-card transition duration-200 mt-2"
            >
              <Save className="h-4 w-4" />
              {saveLoading ? 'Menyimpan...' : rental ? 'Simpan Perubahan' : 'Ajukan Tempat Rental'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
