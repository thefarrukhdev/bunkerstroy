import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Eye,
  FileText,
  DollarSign,
  Camera,
  User,
  Phone,
  Building2,
  Clock,
  Check,
  Scale
} from 'lucide-react';
import { INITIAL_DISPUTES, DisputeRecord, DisputeStatus } from '../../mocks/disputesMock';
import { DataTable, Column } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { KpiStatCard } from '../../components/KpiStatCard';
import { Select } from '../../components/Select';
import { SlideOverDrawer } from '../../components/SlideOverDrawer';

export const DisputesManager: React.FC = () => {
  const [disputes, setDisputes] = useState<DisputeRecord[]>(INITIAL_DISPUTES);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedDispute, setSelectedDispute] = useState<DisputeRecord | null>(null);

  // Decision form state inside drawer
  const [decisionType, setDecisionType] = useState<'REFUND' | 'REPLACE' | 'REJECT'>('REFUND');
  const [refundSum, setRefundSum] = useState<number>(0);
  const [decisionReason, setDecisionReason] = useState<string>('');
  const [isApplyingDecision, setIsApplyingDecision] = useState<boolean>(false);

  const handleOpenDispute = (dispute: DisputeRecord) => {
    setSelectedDispute(dispute);
    setRefundSum(dispute.claimAmount);
    setDecisionReason('');
    setDecisionType('REFUND');
  };

  const handleApplyDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute) return;
    if (!decisionReason.trim()) {
      alert('Iltimos, qabul qilingan qaror asosini (sababini) yozing!');
      return;
    }

    setIsApplyingDecision(true);
    setTimeout(() => {
      const newStatus: DisputeStatus =
        decisionType === 'REFUND'
          ? 'RESOLVED_REFUND'
          : decisionType === 'REPLACE'
          ? 'RESOLVED_REPLACE'
          : 'REJECTED';

      const decisionText =
        decisionType === 'REFUND'
          ? `Xaridor hisobiga ${refundSum.toLocaleString()} so‘m qaytarildi. Asos: ${decisionReason}`
          : decisionType === 'REPLACE'
          ? `Ta‘minotchi tomonidan mahsulot almashtirib beriladi. Asos: ${decisionReason}`
          : `Da‘vo rad etildi. Asos: ${decisionReason}`;

      setDisputes((prev) =>
        prev.map((d) =>
          d.id === selectedDispute.id
            ? {
                ...d,
                status: newStatus,
                resolutionDecision: decisionText,
                operatorNotes: decisionReason,
                updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
              }
            : d
        )
      );

      setSelectedDispute((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              resolutionDecision: decisionText,
              operatorNotes: decisionReason
            }
          : null
      );

      setIsApplyingDecision(false);
    }, 600);
  };

  // KPIs
  const totalDisputes = disputes.length;
  const openDisputes = disputes.filter((d) => d.status === 'OPEN').length;
  const investigating = disputes.filter((d) => d.status === 'INVESTIGATING').length;
  const totalClaimedAmount = disputes.reduce((acc, curr) => acc + curr.claimAmount, 0);

  const filteredDisputes = disputes.filter((d) => {
    if (statusFilter === 'ALL') return true;
    return d.status === statusFilter;
  });

  const statusOptions = [
    { value: 'ALL', label: 'Barcha nizolar holati' },
    { value: 'OPEN', label: 'Ochiq (Yangi kelgan)' },
    { value: 'INVESTIGATING', label: 'O‘rganilmoqda' },
    { value: 'RESOLVED_REFUND', label: 'Mablag‘ qaytarildi' },
    { value: 'RESOLVED_REPLACE', label: 'Almashtirildi' },
    { value: 'REJECTED', label: 'Rad etildi' }
  ];

  const columns: Column<DisputeRecord>[] = [
    {
      key: 'disputeNumber',
      header: 'Nizo & Buyurtma',
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-xs text-theme-main block">
            {row.disputeNumber}
          </span>
          <span className="font-mono text-[11px] text-[#FFB800] font-semibold">
            {row.orderNumber}
          </span>
          <div className="text-[10px] font-mono text-theme-muted mt-0.5">
            {row.createdAt}
          </div>
        </div>
      )
    },
    {
      key: 'reason',
      header: 'Nizo Sababi & Da‘vo',
      render: (row) => (
        <div>
          <span className="font-bold text-xs text-theme-main block">
            {row.reasonLabel}
          </span>
          <span className="font-mono text-xs font-bold text-red-500 mt-0.5 block">
            {row.claimAmount.toLocaleString()} so‘m
          </span>
        </div>
      )
    },
    {
      key: 'parties',
      header: 'Tomonlar (Xaridor / Ta‘minotchi)',
      render: (row) => (
        <div className="space-y-0.5 text-xs">
          <div className="text-theme-main font-semibold truncate max-w-xs">
            Xaridor: {row.clientCompanyName}
          </div>
          <div className="text-theme-muted text-[11px] truncate max-w-xs">
            Ta‘minotchi: {row.supplierName}
          </div>
          <div className="text-[10px] font-mono text-amber-500">
            Haydovchi: {row.driverName} ({row.driverPhone})
          </div>
        </div>
      )
    },
    {
      key: 'evidence',
      header: 'Dalillar',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.evidencePhotos.length > 0 ? (
            <div className="flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs font-mono font-bold text-theme-main">
                {row.evidencePhotos.length} ta foto
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-theme-muted font-mono">Suratsiz</span>
          )}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Holati',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      key: 'action',
      header: 'Amal',
      render: (row) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleOpenDispute(row)}
          className="text-xs font-mono"
        >
          <Scale className="w-3.5 h-3.5 mr-1" />
          Qaror
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-theme-card p-4 rounded-2xl border border-theme">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <h1 className="text-xl font-black uppercase tracking-wider text-theme-main">
              Nizolar Markazi &amp; Arbitraj (AD-10)
            </h1>
          </div>
          <p className="text-xs text-theme-muted font-mono mt-0.5">
            TZ-5: Foto/video dalillar ekspertizasi, ta‘minotchi va haydovchi xulosasi, qaytarim va kompensatsiya qarorlari
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiStatCard
          title="Jami Nizolar"
          value={totalDisputes}
          icon={<ShieldAlert className="w-5 h-5" />}
          change="Barcha holatlar"
          changeType="positive"
        />
        <KpiStatCard
          title="Ochiq Nizolar"
          value={openDisputes}
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
          change="Zudlik bilan ko‘rilishi shart"
          changeType={openDisputes > 0 ? 'negative' : 'positive'}
        />
        <KpiStatCard
          title="O‘rganilmoqda"
          value={investigating}
          icon={<Clock className="w-5 h-5 text-amber-500" />}
          change="Ekspertiza jarayonida"
          changeType="neutral"
        />
        <KpiStatCard
          title="Da‘vo Summasi"
          value={`${(totalClaimedAmount / 1000000).toFixed(1)} mln`}
          icon={<DollarSign className="w-5 h-5 text-emerald-500" />}
          change="Umumiy e‘tiroz summasi"
          changeType="neutral"
        />
      </div>

      {/* Table */}
      <div className="bg-theme-card rounded-2xl border border-theme p-4 space-y-4">
        <DataTable
          columns={columns}
          data={filteredDisputes}
          searchPlaceholder="Nizo raqami, buyurtma yoki korxona bo‘yicha qidiruv..."
          emptyTitle="Faol nizolar yo‘q"
          emptyDescription="Mijozlar tomonidan e‘tiroz yoki shikoyat kelib tushmagan."
          actionsSlot={
            <div className="w-56">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusOptions}
              />
            </div>
          }
        />
      </div>

      {/* Dispute Decision Drawer */}
      {selectedDispute && (
        <SlideOverDrawer
          isOpen={!!selectedDispute}
          onClose={() => setSelectedDispute(null)}
          title={`Nizo ${selectedDispute.disputeNumber}`}
          subtitle={`Buyurtma: ${selectedDispute.orderNumber} • ${selectedDispute.reasonLabel}`}
          footer={
            <div className="flex items-center justify-end gap-2.5 w-full">
              <Button
                variant="outline"
                size="md"
                onClick={() => setSelectedDispute(null)}
              >
                Yopish
              </Button>
            </div>
          }
        >
          <div className="space-y-5 font-sans">
            {/* Status & Claim Amount banner */}
            <div className="p-4 rounded-xl bg-theme-main/5 border border-theme flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-theme-muted block">Talab qilingan summa</span>
                <span className="text-lg font-black font-mono text-red-500">
                  {selectedDispute.claimAmount.toLocaleString()} so‘m
                </span>
              </div>
              <StatusBadge status={selectedDispute.status} />
            </div>

            {/* Parties info */}
            <div className="p-3.5 rounded-xl bg-theme-card-subtle border border-theme space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-theme-muted font-mono">Xaridor:</span>
                <span className="text-theme-main font-bold">{selectedDispute.clientCompanyName} ({selectedDispute.clientPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-theme-muted font-mono">Ta‘minotchi:</span>
                <span className="text-theme-main font-bold">{selectedDispute.supplierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-theme-muted font-mono">Haydovchi:</span>
                <span className="text-theme-main font-bold">{selectedDispute.driverName} ({selectedDispute.driverPhone})</span>
              </div>
            </div>

            {/* Evidence & Notes */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-theme-muted">
                Da‘vo Tafsilotlari &amp; Dalillar
              </h4>
              <p className="text-xs text-theme-main bg-theme-main/5 p-3 rounded-xl border border-theme leading-relaxed">
                {selectedDispute.evidenceNotes}
              </p>

              {/* Photos grid */}
              {selectedDispute.evidencePhotos.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-mono text-theme-muted block mb-1.5">
                    Yuklangan fotosuratlar ({selectedDispute.evidencePhotos.length}):
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedDispute.evidencePhotos.map((url, i) => (
                      <div key={i} className="rounded-xl overflow-hidden border border-theme h-28 bg-black/30">
                        <img src={url} alt={`Dalil ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Existing resolution decision if resolved */}
            {selectedDispute.resolutionDecision && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 space-y-1">
                <span className="font-bold block uppercase font-mono text-[10px]">Qabul Qilingan Qaror:</span>
                <p>{selectedDispute.resolutionDecision}</p>
              </div>
            )}

            {/* Resolution Form (if open or investigating) */}
            {selectedDispute.status !== 'RESOLVED_REFUND' &&
              selectedDispute.status !== 'RESOLVED_REPLACE' &&
              selectedDispute.status !== 'REJECTED' && (
                <form onSubmit={handleApplyDecision} className="space-y-3 pt-3 border-t border-theme">
                  <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-theme-main flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-[#F59E0B]" />
                    <span>Arbitraj Qarorini Chiqarish (AD-10)</span>
                  </h4>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setDecisionType('REFUND')}
                      className={`p-2 rounded-xl border text-xs font-bold transition ${
                        decisionType === 'REFUND'
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                          : 'bg-theme-main/5 border-theme text-theme-muted'
                      }`}
                    >
                      Mablag‘ Qaytarish
                    </button>
                    <button
                      type="button"
                      onClick={() => setDecisionType('REPLACE')}
                      className={`p-2 rounded-xl border text-xs font-bold transition ${
                        decisionType === 'REPLACE'
                          ? 'bg-blue-500/15 border-blue-500 text-blue-400'
                          : 'bg-theme-main/5 border-theme text-theme-muted'
                      }`}
                    >
                      Almashtirish
                    </button>
                    <button
                      type="button"
                      onClick={() => setDecisionType('REJECT')}
                      className={`p-2 rounded-xl border text-xs font-bold transition ${
                        decisionType === 'REJECT'
                          ? 'bg-red-500/15 border-red-500 text-red-400'
                          : 'bg-theme-main/5 border-theme text-theme-muted'
                      }`}
                    >
                      Rad Etish
                    </button>
                  </div>

                  {decisionType === 'REFUND' && (
                    <div>
                      <label className="block text-xs font-mono text-theme-muted mb-1">
                        Qaytariladigan summa (so‘m):
                      </label>
                      <input
                        type="number"
                        value={refundSum}
                        onChange={(e) => setRefundSum(Number(e.target.value))}
                        className="w-full text-xs font-mono py-2 px-3 rounded-xl bg-theme-main/5 border border-theme text-theme-main focus:outline-hidden"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-mono text-theme-muted mb-1">
                      Qaror Asosi &amp; Izoh (Majburiy):
                    </label>
                    <textarea
                      rows={3}
                      value={decisionReason}
                      onChange={(e) => setDecisionReason(e.target.value)}
                      placeholder="Qarorning huquqiy va faktik asosini yozing..."
                      className="w-full text-xs py-2 px-3 rounded-xl bg-theme-main/5 border border-theme text-theme-main placeholder:text-theme-muted focus:outline-hidden"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={isApplyingDecision || !decisionReason.trim()}
                    className="w-full font-mono text-xs"
                  >
                    {isApplyingDecision ? 'Qaror rasmiylashtirilmoqda...' : 'Qarorni Tasdiqlash & Ijroga Yuborish'}
                  </Button>
                </form>
              )}
          </div>
        </SlideOverDrawer>
      )}
    </div>
  );
};

export default DisputesManager;
