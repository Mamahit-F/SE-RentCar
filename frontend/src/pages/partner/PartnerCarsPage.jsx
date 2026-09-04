import React, { useState, useEffect } from 'react';
import { 
  Car, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Gauge, 
  Users, 
  Save
} from 'lucide-react';
import { partnerService } from '../../services/api';
import Sidebar from '../../components/common/Sidebar';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function PartnerCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [error, setError] = useState(null);

  const initialForm = {
    brand: '',
    model: '',
    type: 'MPV',
    year: 2024,
    transmission: 'Automatic',
    seats: 7,
    color: 'Hitam',
    cc: 1500,
    pricePerDay: 450000,
    imageUrl: '',
    description: '',
    isAvailable: true,
    status: 'ACTIVE',
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await partnerService.getMyCars();
      setCars(res?.data || []);
    } catch (err) {
      setError(err?.message || 'Gagal memuat armada mobil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleOpenAddModal = () => {
    setEditingCar(null);
    setFormData(initialForm);
    setModalOpen(true);
    setError(null);
  };

  const handleOpenEditModal = (car) => {
    setEditingCar(car);
    setFormData({
      brand: car.brand || '',
      model: car.model || '',
      type: car.type || 'MPV',
      year: car.year || 2024,
      transmission: car.transmission || 'Automatic',
      seats: car.seats || 7,
      color: car.color || '',
      cc: car.cc || 1500,
      pricePerDay: car.pricePerDay || 0,
      imageUrl: car.imageUrl || '',
      description: car.description || '',
      isAvailable: car.isAvailable ?? true,
      status: car.status || 'ACTIVE',
    });
    setModalOpen(true);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);

    try {
      if (editingCar) {
        await partnerService.updateCar(editingCar.id, formData);
        setSuccessMsg('Mobil berhasil diperbarui!');
      } else {
        await partnerService.createCar(formData);
        setSuccessMsg('Mobil baru berhasil ditambahkan ke armada!');
      }
      setModalOpen(false);
      fetchCars();
    } catch (err) {
      setError(err?.message || 'Gagal menyimpan armada mobil');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm('Nonaktifkan mobil ini dari daftar rental?')) return;
    try {
      await partnerService.deleteCar(carId);
      setSuccessMsg('Mobil berhasil dinonaktifkan dari armada');
      fetchCars();
    } catch (err) {
      setError(err?.message || 'Gagal menonaktifkan mobil');
    }
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-warm-200 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-ink-primary tracking-tight">Manajemen Armada Mobil</h1>
            <p className="text-xs text-ink-secondary">Tambah, perbarui spesifikasi, dan kelola ketersediaan mobil rental</p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 bg-midnight-900 hover:bg-midnight-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-card transition duration-200 self-start sm:self-auto"
          >
            <PlusCircle className="h-4 w-4" />
            Tambah Mobil Baru
          </button>
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
          <LoadingSpinner text="Memuat daftar armada mobil..." />
        ) : cars.length === 0 ? (
          <EmptyState
            icon={Car}
            title="Belum Ada Mobil Terdaftar"
            description="Tambahkan mobil pertama Anda untuk mulai menerima pesanan sewa pelanggan."
            action={
              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-2 bg-midnight-900 hover:bg-midnight-800 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-card transition"
              >
                <PlusCircle className="h-4 w-4" /> Tambah Mobil Sekarang
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((c) => (
              <div 
                key={c.id} 
                className="bg-white border border-warm-300 rounded-3xl overflow-hidden shadow-subtle hover:shadow-card transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-48 bg-warm-100 relative overflow-hidden">
                    <img
                      src={c.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'}
                      alt={c.model}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge status={c.status} />
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${c.isAvailable ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                        {c.isAvailable ? 'Ready' : 'Disewa'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-xs font-bold text-ink-secondary">{c.brand} · {c.year}</span>
                      <h3 className="text-base font-extrabold text-ink-primary">{c.model}</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] text-ink-secondary bg-warm-50 p-2.5 rounded-xl border border-warm-200 font-semibold">
                      <div>Transmisi: <strong className="text-ink-primary block">{c.transmission}</strong></div>
                      <div>Kursi: <strong className="text-ink-primary block">{c.seats} Seat</strong></div>
                      <div>Tipe: <strong className="text-ink-primary block">{c.type || 'MPV'}</strong></div>
                    </div>

                    <p className="text-sm text-midnight-900 font-black">
                      {formatRupiah(c.pricePerDay)} <span className="text-xs font-normal text-ink-secondary">/hari</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-warm-200 bg-warm-50/50 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenEditModal(c)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white hover:bg-warm-100 text-ink-primary text-xs font-bold py-2 rounded-xl border border-warm-300 transition shadow-subtle"
                  >
                    <Edit3 className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="inline-flex items-center justify-center p-2 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
                    title="Nonaktifkan Mobil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Car Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingCar ? 'Edit Armada Mobil' : 'Tambah Mobil Baru'}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-primary">Merk / Brand Mobil *</label>
                <input
                  type="text"
                  name="brand"
                  required
                  placeholder="Contoh: Toyota, Honda, Mitsubishi"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl px-3.5 py-2.5 text-xs text-ink-primary font-medium focus:outline-none focus:border-midnight-900 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-primary">Model / Varian *</label>
                <input
                  type="text"
                  name="model"
                  required
                  placeholder="Contoh: Innova Zenix 2.0 V"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl px-3.5 py-2.5 text-xs text-ink-primary font-medium focus:outline-none focus:border-midnight-900 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-primary">Tipe Kendaraan</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl px-3 py-2.5 text-xs text-ink-primary font-medium focus:outline-none focus:border-midnight-900 focus:bg-white"
                >
                  <option value="MPV">MPV</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="City Car">City Car</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-primary">Transmisi</label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl px-3 py-2.5 text-xs text-ink-primary font-medium focus:outline-none focus:border-midnight-900 focus:bg-white"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-primary">Tahun Pembuatan</label>
                <input
                  type="number"
                  name="year"
                  min={2015}
                  max={2026}
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl px-3 py-2.5 text-xs text-ink-primary font-medium focus:outline-none focus:border-midnight-900 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-primary">Jumlah Kursi *</label>
                <input
                  type="number"
                  name="seats"
                  min={1}
                  max={15}
                  required
                  value={formData.seats}
                  onChange={handleChange}
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl px-3 py-2.5 text-xs text-ink-primary font-medium focus:outline-none focus:border-midnight-900 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-primary">Kapasitas Mesin (cc)</label>
                <input
                  type="number"
                  name="cc"
                  placeholder="1500"
                  value={formData.cc}
                  onChange={handleChange}
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl px-3 py-2.5 text-xs text-ink-primary font-medium focus:outline-none focus:border-midnight-900 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-primary">Tarif Sewa/Hari (Rp) *</label>
                <input
                  type="number"
                  name="pricePerDay"
                  min={100000}
                  step={10000}
                  required
                  value={formData.pricePerDay}
                  onChange={handleChange}
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl px-3 py-2.5 text-xs text-ink-primary font-bold focus:outline-none focus:border-midnight-900 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-primary">URL Gambar Mobil</label>
              <input
                type="url"
                name="imageUrl"
                placeholder="https://images.unsplash.com/photo-..."
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full bg-warm-50 border border-warm-300 rounded-xl px-3.5 py-2.5 text-xs text-ink-primary font-medium focus:outline-none focus:border-midnight-900 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-primary">Deskripsi & Catatan Unit</label>
              <textarea
                name="description"
                rows={2}
                placeholder="Kondisi interior, AC, fasilitas bluetooth..."
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-warm-50 border border-warm-300 rounded-xl p-3 text-xs text-ink-primary font-medium focus:outline-none focus:border-midnight-900 focus:bg-white"
              />
            </div>

            {editingCar && (
              <div className="flex gap-4 pt-2 border-t border-warm-200 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-ink-primary font-semibold">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    className="rounded text-midnight-900 accent-midnight-900"
                  />
                  <span>Mobil Tersedia (Ready)</span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={submitLoading}
              className="w-full inline-flex items-center justify-center gap-2 bg-midnight-900 hover:bg-midnight-800 disabled:opacity-50 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-card transition duration-200 mt-4"
            >
              <Save className="h-4 w-4" />
              {submitLoading ? 'Menyimpan...' : editingCar ? 'Simpan Perubahan' : 'Tambah Mobil ke Armada'}
            </button>
          </form>
        </Modal>
      </main>
    </div>
  );
}
