import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Clock,
  Eye
} from 'lucide-react';
import { adminService } from '../../services/api';
import Sidebar from '../../components/common/Sidebar';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function AdminApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [error, setError] = useState(null);

  // Rejection Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRentalForReject, setSelectedRentalForReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Detail Inspection Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRentalDetail, setSelectedRentalDetail] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await adminService.getApplications(statusFilter);
      setApplications(res?.data || []);
    } catch (err) {
      setError(err?.message || 'Gagal memuat daftar pengajuan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleApprove = async (rentalId) => {
    if (!window.confirm('Apakah Anda yakin ingin menyetujui tempat rental ini? Setelah disetujui, mitra dapat mengunggah mobil dan tampil di pencarian publik.')) return;
    
    setActionLoading(true);
    setError(null);
    try {
      await adminService.approveRental(rentalId);
      setSuccessMsg('Pengajuan tempat rental berhasil DISETUJUI!');
      fetchApplications();
    } catch (err) {
      setError(err?.message || 'Gagal menyetujui tempat rental');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRentalForReject) return;
    setActionLoading(true);
    setError(null);

    try {
      await adminService.rejectRental(selectedRentalForReject.id, rejectionReason);
      setRejectModalOpen(false);
      setSuccessMsg('Pengajuan tempat rental telah DITOLAK.');
      setRejectionReason('');
      fetchApplications();
    } catch (err) {
      setError(err?.message || 'Gagal menolak pengajuan');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">Verifikasi Pengajuan Mitra Rental</h1>
          <p className="text-xs text-slate-400">Tinjau kelengkapan berkas izin usaha dan lakukan verifikasi mitra baru</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 p-1 bg-slate-950 border border-slate-800 rounded-2xl w-fit">
          {[
            { id: 'PENDING', label: 'Menunggu Verifikasi (Pending)' },
            { id: 'ACTIVE', label: 'Telah Disetujui (Active)' },
            { id: 'REJECTED', label: 'Ditolak (Rejected)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                statusFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
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
          <LoadingSpinner text="Memuat pengajuan mitra..." />
        ) : applications.length === 0 ? (
          <EmptyState
            icon={Building2}
            title={`Tidak Ada Pengajuan Berstatus ${statusFilter}`}
            description="Semua permohonan pada kategori ini telah selesai ditinjau."
          />
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">#PARTNER-{app.id}</span>
                    <Badge status={app.status} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">{app.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      {app.address}, {app.city}, {app.province}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <div>Penanggung Jawab: <strong className="text-white">{app.partner?.name}</strong></div>
                    <div>Email: <strong className="text-white">{app.email || app.partner?.email}</strong></div>
                    <div>No. Telepon: <strong className="text-white">{app.phone || app.partner?.phone || '-'}</strong></div>
                    <div>No. Izin Usaha: <strong className="text-white">{app.businessLicense || 'Belum disertakan'}</strong></div>
                  </div>

                  {app.rejectionReason && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300">
                      <strong>Alasan Penolakan:</strong> {app.rejectionReason}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-900">
                  <button
                    onClick={() => {
                      setSelectedRentalDetail(app);
                      setDetailModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700 transition"
                  >
                    <Eye className="h-4 w-4 text-blue-400" />
                    Lihat Berkas & Detail
                  </button>

                  {app.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(app.id)}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Setujui (Approve)
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRentalForReject(app);
                          setRejectModalOpen(true);
                        }}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold px-3 py-2 rounded-xl border border-rose-500/20 transition"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Tolak
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed Inspection Modal */}
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title="Detail Berkas & Profil Mitra Rental"
          maxWidth="max-w-xl"
        >
          {selectedRentalDetail && (
            <div className="space-y-4 text-xs">
              <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white">{selectedRentalDetail.name}</h4>
                  <Badge status={selectedRentalDetail.status} />
                </div>
                <p className="text-slate-400">{selectedRentalDetail.description || 'Tidak ada deskripsi usaha.'}</p>
              </div>

              <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <h5 className="font-bold text-white">Data Lokasi & Legalitas Usaha</h5>
                <div className="space-y-1.5 text-slate-300">
                  <p><strong>Alamat:</strong> {selectedRentalDetail.address}</p>
                  <p><strong>Kota / Provinsi:</strong> {selectedRentalDetail.city}, {selectedRentalDetail.province}</p>
                  <p><strong>Nomor Izin NIB/SIUP:</strong> {selectedRentalDetail.businessLicense || 'N/A'}</p>
                </div>
              </div>

              {selectedRentalDetail.documentUrl ? (
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-300">
                    <FileText className="h-4 w-4 text-blue-400" />
                    <span>Dokumen Izin Usaha Terlampir</span>
                  </div>
                  <a
                    href={selectedRentalDetail.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:underline"
                  >
                    Buka Dokumen <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ) : (
                <p className="text-slate-500 italic">Mitra belum mengunggah tautan dokumen legalitas.</p>
              )}

              {selectedRentalDetail.status === 'PENDING' && (
                <div className="flex gap-2 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setDetailModalOpen(false);
                      handleApprove(selectedRentalDetail.id);
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-center"
                  >
                    Setujui Permohonan
                  </button>
                  <button
                    onClick={() => {
                      setDetailModalOpen(false);
                      setSelectedRentalForReject(selectedRentalDetail);
                      setRejectModalOpen(true);
                    }}
                    className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl text-center"
                  >
                    Tolak Permohonan
                  </button>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Rejection Reason Modal */}
        <Modal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title="Tolak Pengajuan Tempat Rental"
        >
          {selectedRentalForReject && (
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <p className="text-xs text-slate-300">
                Anda akan menolak pengajuan untuk tempat rental <strong className="text-white">{selectedRentalForReject.name}</strong>. Silakan berikan alasan penolakan agar mitra dapat memperbaikinya.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Alasan Penolakan *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Contoh: Nomor izin usaha tidak valid / Alamat operasional tidak sesuai data perizinan..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition"
              >
                {actionLoading ? 'Memproses...' : 'Konfirmasi Penolakan'}
              </button>
            </form>
          )}
        </Modal>
      </main>
    </div>
  );
}
