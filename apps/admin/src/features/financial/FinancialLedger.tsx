import React, { useState } from 'react';
import {
  LedgerTransactionItem,
  TransactionType,
  ReconciliationReport,
  INITIAL_TRANSACTIONS,
  INITIAL_RECONCILIATIONS
} from '../../mocks/financialMock';
import { DataTable, Column } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { KpiStatCard } from '../../components/KpiStatCard';
import { Select } from '../../components/Select';
import { ReconciliationExportModal } from './ReconciliationExportModal';
import { TransactionDetailDrawer } from './TransactionDetailDrawer';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Building2,
  FileSpreadsheet,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  RotateCcw,
  Receipt,
  Scale
} from 'lucide-react';

export const FinancialLedger: React.FC = () => {
  const [transactions, setTransactions] = useState<LedgerTransactionItem[]>(INITIAL_TRANSACTIONS);
  const [reconciliations, setReconciliations] = useState<ReconciliationReport[]>(INITIAL_RECONCILIATIONS);

  // Filters
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals & Drawers
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<LedgerTransactionItem | null>(null);

  // Financial Statistics Calculation
  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME' && t.status === 'COMPLETED')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalSupplierOutflow = transactions
    .filter((t) => t.type === 'OUTFLOW' && t.status === 'COMPLETED')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalLogisticsFee = transactions
    .filter((t) => t.type === 'LOGISTICS_FEE' && t.status === 'COMPLETED')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netCashBalance = totalIncome - totalSupplierOutflow - totalLogisticsFee;

  // Filtered Transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
    const matchesMethod = methodFilter === 'ALL' || t.paymentMethod === methodFilter;
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesType && matchesMethod && matchesStatus;
  });

  const handleExportSuccess = (report: ReconciliationReport) => {
    setReconciliations((prev) => [report, ...prev]);
  };

  const typeOptions = [
    { value: 'ALL', label: 'Barcha operatsiyalar' },
    { value: 'INCOME', label: 'B2B Savdo Tushumi (Kirim)' },
    { value: 'OUTFLOW', label: 'Zavodga To‘lov (Chiqim)' },
    { value: 'LOGISTICS_FEE', label: 'Transport Xarajatlari' },
    { value: 'REFUND', label: 'Mablag‘ Qaytarish (Refund)' }
  ];

  const methodOptions = [
    { value: 'ALL', label: 'Barcha shlyuzlar' },
    { value: 'PAYME', label: 'Payme Shlyuzi' },
    { value: 'CLICK', label: 'Click Shlyuzi' },
    { value: 'BANK_TRANSFER', label: 'Bank Hisob-fakturasi' }
  ];

  const statusOptions = [
    { value: 'ALL', label: 'Barcha holatlar' },
    { value: 'COMPLETED', label: 'Muvaffaqiyatli (COMPLETED)' },
    { value: 'PENDING', label: 'Kutilmoqda (PENDING)' },
    { value: 'REVERSED', label: 'Bekor qilingan (REVERSED)' }
  ];

  // Table Columns
  const columns: Column<LedgerTransactionItem>[] = [
    {
      key: 'trxNumber',
      header: 'Tranzaksiya & Sana',
      render: (row) => (
        <div>
          <div className="font-mono font-bold text-sm text-[var(--color-accent-blue)]">
            {row.trxNumber}
          </div>
          <div className="text-[11px] font-mono text-[var(--color-text-muted)] mt-0.5">
            {row.createdAt}
          </div>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Amal Turi',
      render: (row) => {
        const isInc = row.type === 'INCOME';
        return (
          <div className="flex items-center gap-1.5">
            <span
              className={`p-1 rounded-md ${
                isInc
                  ? 'bg-[var(--color-accent-green)]/15 text-[var(--color-accent-green)]'
                  : 'bg-[var(--color-accent-red)]/15 text-[var(--color-accent-red)]'
              }`}
            >
              {isInc ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            </span>
            <span className="text-xs font-semibold text-[var(--color-text-primary)]">
              {row.typeLabel}
            </span>
          </div>
        );
      }
    },
    {
      key: 'counterparty',
      header: 'Kontragent & Hujjat',
      render: (row) => (
        <div>
          <div className="font-semibold text-xs text-[var(--color-text-primary)] flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" />
            <span className="line-clamp-1">{row.counterparty}</span>
          </div>
          <div className="text-[11px] font-mono text-[var(--color-text-muted)] mt-0.5">
            Hujjat: {row.orderNumber} {row.counterpartyInn ? `• STIR: ${row.counterpartyInn}` : ''}
          </div>
        </div>
      )
    },
    {
      key: 'method',
      header: 'To‘lov Shlyuzi',
      render: (row) => (
        <div className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[var(--color-surface-hover)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] inline-block">
          {row.paymentMethod}
        </div>
      )
    },
    {
      key: 'amount',
      header: 'Summa',
      render: (row) => {
        const isInc = row.type === 'INCOME';
        return (
          <div
            className={`font-mono font-bold text-xs ${
              isInc ? 'text-[var(--color-accent-green)]' : 'text-[var(--color-text-primary)]'
            }`}
          >
            {isInc ? '+' : '-'}{row.amount.toLocaleString()} so‘m
          </div>
        );
      }
    },
    {
      key: 'status',
      header: 'Holati',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      key: 'actions',
      header: 'Amallar',
      render: (row) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setSelectedTransaction(row)}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          Chek
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Sarlavha & Akt Eksport tugmasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Kassa, Moliya & Tranzaksiyalar
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            B2B to‘lov shlyuzlari (Payme, Click, Bank), solishtirma dalolatnomalar va buxgalteriya balansi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsExportModalOpen(true)}
            leftIcon={<FileSpreadsheet className="w-4 h-4" />}
          >
            Solishtirma Dalolatnoma (Act Sverki)
          </Button>
        </div>
      </div>

      {/* KPI Kartochkalar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiStatCard
          title="Jami B2B Tushum (Kirim)"
          value={`${(totalIncome / 1_000_000).toFixed(1)} mln`}
          icon={<ArrowUpRight className="w-5 h-5 text-[var(--color-accent-green)]" />}
          change="Savdo va avans to‘lovlari"
          changeType="positive"
        />
        <KpiStatCard
          title="Zavodlarga To‘lov (Chiqim)"
          value={`${(totalSupplierOutflow / 1_000_000).toFixed(1)} mln`}
          icon={<ArrowDownRight className="w-5 h-5 text-[var(--color-accent-red)]" />}
          change="Material xaridlari"
          changeType="neutral"
        />
        <KpiStatCard
          title="Logistika & Transport"
          value={`${(totalLogisticsFee / 1_000_000).toFixed(1)} mln`}
          icon={<CreditCard className="w-5 h-5" />}
          change="Avtopark xarajatlari"
          changeType="positive"
        />
        <KpiStatCard
          title="Kassa Sof Qoldig‘i"
          value={`${(netCashBalance / 1_000_000).toFixed(1)} mln`}
          icon={<Wallet className="w-5 h-5" />}
          change="Mavjud likvidlik"
          changeType="positive"
        />
      </div>

      {/* Jadvallar va Filtrlar */}
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={filteredTransactions}
          searchPlaceholder="Tranzaksiya ID, buyurtma, kontragent yoki STIR bo‘yicha..."
          emptyTitle="Hech qanday moliyaviy operatsiya topilmadi"
          emptyDescription="Filtr parametrlarini o‘zgartiring yoki qidiruv so‘rovini tekshiring."
          actionsSlot={
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-56">
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  options={typeOptions}
                />
              </div>
              <div className="w-48">
                <Select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  options={methodOptions}
                />
              </div>
              <div className="w-44">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={statusOptions}
                />
              </div>
            </div>
          }
        />
      </div>

      {/* Solishtirma Dalolatnoma Eksport Modali */}
      <ReconciliationExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExportSuccess={handleExportSuccess}
      />

      {/* Tranzaksiya Chek Drawer */}
      <TransactionDetailDrawer
        isOpen={Boolean(selectedTransaction)}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
      />
    </div>
  );
};
