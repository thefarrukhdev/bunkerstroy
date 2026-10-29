import React, { useState } from 'react';
import { INITIAL_SUPPLIERS } from '../../mocks/suppliersMock';
import { INITIAL_RECONCILIATIONS, ReconciliationReport } from '../../mocks/financialMock';
import { Button } from '../../components/Button';
import { Select } from '../../components/Select';
import {
  FileSpreadsheet,
  X,
  Building2,
  Calendar,
  Download,
  Calculator,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface ReconciliationExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportSuccess: (report: ReconciliationReport) => void;
}

const PERIOD_OPTIONS = [
  { value: '2026-yil 3-chorak (Iyul - Sentyabr)', label: '2026-yil 3-chorak (Iyul - Sentyabr)' },
  { value: '2026-yil 2-chorak (Aprel - Iyun)', label: '2026-yil 2-chorak (Aprel - Iyun)' },
  { value: '2026-yil 1-chorak (Yanvar - Mart)', label: '2026-yil 1-chorak (Yanvar - Mart)' },
  { value: '2026-yil 9 oylik aylanma', label: '2026-yil 9 oylik umumiy hisobot' }
];

export const ReconciliationExportModal: React.FC<ReconciliationExportModalProps> = ({
  isOpen,
  onClose,
  onExportSuccess
}) => {
  const [selectedSupplierInn, setSelectedSupplierInn] = useState(INITIAL_SUPPLIERS[0].inn);
  const [selectedPeriod, setSelectedPeriod] = useState(PERIOD_OPTIONS[0].value);
  const [exportFormat, setExportFormat] = useState<'EXCEL' | 'PDF'>('EXCEL');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const currentSupplier = INITIAL_SUPPLIERS.find((s) => s.inn === selectedSupplierInn) || INITIAL_SUPPLIERS[0];

  // Calculated dummy turnover for the selected supplier
  const openingBalance = 0;
  const debitTurnover = currentSupplier.totalTurnover;
  const creditTurnover = Math.round(currentSupplier.totalTurnover * 0.9);
  const closingBalance = debitTurnover - creditTurnover;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const newReport: ReconciliationReport = {
        id: `rec-${Date.now()}`,
        companyName: currentSupplier.companyName,
        inn: currentSupplier.inn,
        period: selectedPeriod,
        openingBalance,
        debitTurnover,
        creditTurnover,
        closingBalance,
        generatedAt: new Date().toISOString().split('T')[0]
      };

      onExportSuccess(newReport);
      setIsExporting(false);
      onClose();
      alert(`Solishtirma Dalolatnoma (Act Sverki) ${exportFormat} formatida muvaffaqiyatli yuklab olindi!`);
    }, 700);
  };

  const supplierOptions = INITIAL_SUPPLIERS.map((s) => ({
    value: s.inn,
    label: `${s.companyName} (STIR: ${s.inn})`
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] rounded-2xl shadow-2xl p-4 sm:p-6 z-10 text-[var(--color-text-primary)] space-y-4 animate-in fade-in zoom-in-95 duration-150 flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2.5 rounded-xl bg-[var(--color-accent-green)]/15 text-[var(--color-accent-green)] shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[var(--color-text-primary)] truncate">
                Solishtirma Dalolatnoma (Act Sverki) Eksporti
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 truncate">
                Buxgalteriya o‘zaro hisob-kitoblar balansi va aylanmasi akti
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Yopish"
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 flex-1">
          {/* Supplier selection */}
          <Select
            label="Hamkor korxona (Ta’minotchi / Xaridor) *"
            value={selectedSupplierInn}
            onChange={(e) => setSelectedSupplierInn(e.target.value)}
            options={supplierOptions}
          />

          {/* Period selection */}
          <Select
            label="Hisobot davri *"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            options={PERIOD_OPTIONS}
          />

          {/* Format Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[var(--color-text-secondary)]">
              Eksport fayl formati *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExportFormat('EXCEL')}
                className={`p-3 min-h-[44px] rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                  exportFormat === 'EXCEL'
                    ? 'border-[var(--color-accent-green)] bg-[var(--color-accent-green)]/10 text-[var(--color-text-primary)] font-semibold'
                    : 'border-[var(--color-border-subtle)] bg-[var(--color-surface-bg)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 text-[var(--color-accent-green)]" />
                <span className="text-xs font-medium">Excel jadvali (.xlsx)</span>
              </button>

              <button
                type="button"
                onClick={() => setExportFormat('PDF')}
                className={`p-3 min-h-[44px] rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                  exportFormat === 'PDF'
                    ? 'border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/10 text-[var(--color-text-primary)] font-semibold'
                    : 'border-[var(--color-border-subtle)] bg-[var(--color-surface-bg)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]'
                }`}
              >
                <FileText className="w-4 h-4 text-[var(--color-accent-blue)]" />
                <span className="text-xs font-medium">Chop etish hujjati (.pdf)</span>
              </button>
            </div>
          </div>

          {/* Balance Preview Card */}
          <div className="p-4 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border-subtle)] space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-xs font-sans font-bold text-[var(--color-text-primary)] pb-1.5 border-b border-[var(--color-border-subtle)]">
              <Calculator className="w-4 h-4 text-[var(--color-accent-blue)]" />
              <span>O‘zaro Hisob-kitoblar Qisqacha Xulosasi</span>
            </div>
            <div className="flex items-center justify-between text-[var(--color-text-secondary)]">
              <span>Boshlang‘ich qoldiq (Debet/Kredit):</span>
              <span>{openingBalance.toLocaleString()} so‘m</span>
            </div>
            <div className="flex items-center justify-between text-[var(--color-text-secondary)]">
              <span>Yetkazilgan tovarlar aylanmasi (Debet):</span>
              <span className="text-[var(--color-accent-blue)] font-bold">
                {debitTurnover.toLocaleString()} so‘m
              </span>
            </div>
            <div className="flex items-center justify-between text-[var(--color-text-secondary)]">
              <span>Amalga oshirilgan to‘lovlar (Kredit):</span>
              <span className="text-[var(--color-accent-green)] font-bold">
                {creditTurnover.toLocaleString()} so‘m
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-subtle)] text-sm font-bold text-[var(--color-text-primary)]">
              <span className="font-sans">Yakuniy Qoldiq Balans:</span>
              <span className="text-[var(--color-accent-yellow)]">
                {closingBalance.toLocaleString()} so‘m
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-border-subtle)]">
          <Button variant="outline" size="md" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button
            variant="primary"
            size="md"
            isLoading={isExporting}
            onClick={handleExport}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Aktni Yuklab Olish ({exportFormat})
          </Button>
        </div>
      </div>
    </div>
  );
};
