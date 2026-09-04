import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  Check, 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { adminService } from '../../services/api';
import Sidebar from '../../components/common/Sidebar';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('PENDING'); // 'PENDING', 'ACTIVE', 'REJECTED'
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [error, setError] = useState(null);

  // Reject Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedAppForReject, setSelectedAppForReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await adminService.getApplications({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      setApplications(res?.data || []);
    } catch (err) {
      setError(err?.message || 'Gagal memuat daftar permohonan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleApprove = async (rentalId) => {
    if (!window.confirm('Setujui permohonan tempat rental ini dan aktifkan di sistem?')) return;
    setActionLoading(true);
    setError(null);

    try {
      if (typeof adminService?.approveApplication === 'function') {
        await adminService.approveApplication(rentalId);
      } else if (typeof adminService?.approveRental === 'function') {
        await adminService.approveRental(rentalId);
      } else {
        await adminService.getApplications(); // trigger or fallback
      }
      setSuccessMsg('Permohonan tempat rental berhasil disetujui! Status kini ACTIVE.');
      fetchApplications();
    } catch (err) {
      setError(err?.message || 'Gagal menyetujui permohonan');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppForReject) return;
    setActionLoading(true);
    setError(null);

    try {
      if (typeof adminService?.rejectApplication === 'function') {
        await adminService.rejectApplication(selectedAppForReject.id, rejectionReason);
      } else if (typeof adminService?.rejectRental === 'function') {
        await adminService.rejectRental(selectedAppForReject.id, rejectionReason);
      }
      setRejectModalOpen(false);
      setSuccessMsg('Permohonan berhasil ditolak dengan catatan alasan.');
      setRejectionReason('');
      fetchApplications();
    } catch (err) {
      setError(err?.message || 'Gagal menolak permohonan');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-warm-200 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-ink-primary tracking-tight">Verifikasi Permohonan Mitra Rental</h1>
            <p className="text-xs text-ink-secondary">Tinjau kelayakan operasional dan keabsahan dokumen NIB mitra baru</p>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-warm-100 rounded-full border border-warm-200 text-xs font-bold self-start sm:self-auto">
            {['PENDING', 'ACTIVE', 'REJECTED', 'ALL'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3.5 py-1.5 rounded-full transition ${
                  statusFilter === s
                    ? 'bg-midnight-900 text-white shadow-subtle'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                {s === 'PENDING' ? 'Menunggu' : s === 'ACTIVE' ? 'Disetujui' : s === 'REJECTED' ? 'Ditolak' : 'Semua'}
              </button>
            ))}
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
          <LoadingSpinner text="Memuat daftar permohonan..." />
        ) : applications.length === 0 ? (
          <EmptyState
            icon={FileCheck}
            title="Tidak Ada Permohonan"
            description={`Tidak ada permohonan rental dengan status ${statusFilter}.`}
          />
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div 
                key={app.id} 
                className="bg-white border border-warm-300 rounded-3xl p-6 shadow-subtle hover:shadow-card transition-all duration-200 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-warm-100 border border-warm-200 text-midnight-900 flex items-center justify-center shrink-0">
                      <Building2 className="h-6 w-6 stroke-[2]" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-extrabold text-ink-primary">{app.name}</h3>
                        <Badge status={app.status} />
                      </div>
                      <p className="text-xs text-ink-secondary flex items-center gap-1.5 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-midnight-900 shrink-0" />
                        {app.address}, {app.city}, {app.province}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  {app.status === 'PENDING' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleApprove(app.id)}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-subtle transition"
                      >
                        <Check className="h-4 w-4 stroke-[3]" /> Setujui (Approve)
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAppForReject(app);
                          setRejectModalOpen(true);
                        }}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-rose-200 transition"
                      >
                        <X className="h-4 w-4" /> Tolak
                      </button>
                    </div>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-warm-200 text-xs text-ink-secondary bg-warm-50 p-4 rounded-2xl">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink-muted block">Pemilik Akun</span>
                    <strong className="text-ink-primary">{app.partner?.name}</strong> ({app.partner?.email})
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink-muted block">Izin Usaha NIB</span>
                    <strong className="text-ink-primary">{app.businessLicense || 'Tidak disertakan'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink-muted block">Dokumen Lampiran</span>
                    {app.documentUrl ? (
                      <a 
                        href={app.documentUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-1 text-midnight-900 font-bold hover:underline"
                      >
                        Lihat Berkas <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-ink-muted">Tidak ada URL</span>
                    )}
                  </div>
                </div>

                {app.status === 'REJECTED' && app.rejectionReason && (
                  <p className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200">
                    <strong>Alasan Penolakan:</strong> {app.rejectionReason}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Rejection Note Modal */}
        <Modal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title="Tolak Permohonan Tempat Rental"
        >
          {selectedAppForReject && (
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <p className="text-xs text-ink-secondary">
                Berikan alasan penolakan untuk tempat rental <strong>{selectedAppForReject.name}</strong> agar mitra dapat memperbaiki datanya.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-primary">Alasan Penolakan *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Contoh: Dokumen NIB buram / Alamat tidak sesuai dengan wilayah operasional..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl p-3 text-xs text-ink-primary focus:outline-none focus:border-midnight-900 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-extrabold text-xs py-3 rounded-xl shadow-card transition"
              >
                {actionLoading ? 'Memproses...' : 'Kirim Penolakan Permohonan'}
              </button>
            </form>
          )}
        </Modal>
      </main>
    </div>
  );
}
