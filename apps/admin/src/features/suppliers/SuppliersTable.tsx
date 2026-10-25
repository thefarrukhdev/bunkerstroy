import React, { useState } from 'react';
import { SupplierCompany, INITIAL_SUPPLIERS } from '../../mocks/suppliersMock';
import { DataTable, Column } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { ConfirmModal } from '../../components/ConfirmModal';
import { KpiStatCard } from '../../components/KpiStatCard';
import { Select } from '../../components/Select';
import { StirVerificationDrawer } from './StirVerificationDrawer';
import { SupplierFormDrawer } from './SupplierFormDrawer';
import {
  Building2,
  Plus,
  Eye,
  Edit3,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  Phone,
  MapPin,
  Package
} from 'lucide-react';

export const SuppliersTable: React.FC = () => {
  const [suppliers, setSuppliers] = useState<SupplierCompany[]>(INITIAL_SUPPLIERS);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Drawer states
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierCompany | null>(null);
  const [selectedForDetails, setSelectedForDetails] = useState<SupplierCompany | null>(null);

  // Modal states
  const [suspendModalTarget, setSuspendModalTarget] = useState<SupplierCompany | null>(null);

  // Statistics calculation
  const totalCount = suppliers.length;
  const verifiedCount = suppliers.filter((s) => s.status === 'VERIFIED').length;
  const pendingCount = suppliers.filter((s) => s.status === 'PENDING').length;
  const vatPayersCount = suppliers.filter((s) => s.vatPayer).length;

  // Filter Data
  const filteredData = suppliers.filter((s) => {
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesRegion = regionFilter === 'ALL' || s.region === regionFilter;
    const matchesType = typeFilter === 'ALL' || s.supplierType === typeFilter;
    return matchesStatus && matchesRegion && matchesType;
  });

  // Save (Create or Edit)
  const handleSaveSupplier = (
    data: Omit<SupplierCompany, 'id' | 'productsCount' | 'totalTurnover' | 'rating' | 'registrationDate'>,
    id?: string
  ) => {
    if (id) {
      setSuppliers((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data } : item))
      );
    } else {
      const newSup: SupplierCompany = {
        id: `sup-${Date.now()}`,
        ...data,
        productsCount: 0,
        totalTurnover: 0,
        rating: 5.0,
        registrationDate: new Date().toISOString().split('T')[0]
      };
      setSuppliers((prev) => [newSup, ...prev]);
    }
  };

  // Update Status from Drawer
  const handleUpdateStatus = (
    id: string,
    newStatus: 'VERIFIED' | 'SUSPENDED' | 'PENDING',
    desc?: string
  ) => {
    setSuppliers((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          status: newStatus,
          statusDescription: desc || item.statusDescription,
          verifiedAt: newStatus === 'VERIFIED' ? new Date().toISOString().split('T')[0] : item.verifiedAt
        };
      })
    );

    if (selectedForDetails && selectedForDetails.id === id) {
      setSelectedForDetails((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              statusDescription: desc || prev.statusDescription
            }
          : null
      );
    }
  };

  // Toggle Suspend via Modal
  const handleConfirmToggleSuspend = () => {
    if (!suspendModalTarget) return;
    const newStatus = suspendModalTarget.status === 'VERIFIED' ? 'SUSPENDED' : 'VERIFIED';
    const desc = newStatus === 'SUSPENDED' ? 'Admin tomonidan to‘xtatildi' : 'Qayta faollashtirildi';
    handleUpdateStatus(suspendModalTarget.id, newStatus, desc);
    setSuspendModalTarget(null);
  };

  const statusOptions = [
    { value: 'ALL', label: 'Barcha holatlar' },
    { value: 'VERIFIED', label: 'Tasdiqlangan (VERIFIED)' },
    { value: 'PENDING', label: 'Kutilmoqda (PENDING)' },
    { value: 'SUSPENDED', label: 'To‘xtatilgan (SUSPENDED)' }
  ];

  const regionOptions = [
    { value: 'ALL', label: 'Barcha viloyatlar' },
    { value: 'Toshkent shahri', label: 'Toshkent shahri' },
    { value: 'Toshkent viloyati', label: 'Toshkent viloyati' },
    { value: 'Samarqand viloyati', label: 'Samarqand viloyati' },
    { value: 'Farg‘ona viloyati', label: 'Farg‘ona viloyati' }
  ];

  const typeOptions = [
    { value: 'ALL', label: 'Barcha turlar (Mahalliy & Global)' },
    { value: 'LOCAL', label: 'Mahalliy Zavodlar' },
    { value: 'GLOBAL', label: 'Global Importyorlar' }
  ];

  // Table Columns
  const columns: Column<SupplierCompany>[] = [
    {
      key: 'company',
      header: 'Korxona Nomi & STIR',
      render: (row) => (
        <div>
          <div className="font-bold text-sm text-[var(--color-text-primary)] flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[var(--color-accent-blue)] shrink-0" />
            <span>{row.companyName}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono text-xs text-[var(--color-accent-blue)] font-semibold">
              STIR: {row.inn}
            </span>
            {row.vatPayer && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--color-accent-green)]/15 text-[var(--color-accent-green)] font-bold">
                QQS
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'director',
      header: 'Rahbar & Aloqa',
      render: (row) => (
        <div>
          <div className="text-xs font-semibold text-[var(--color-text-primary)]">
            {row.director}
          </div>
          <div className="text-xs font-mono text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
            <Phone className="w-3 h-3 text-[var(--color-text-muted)]" />
            <span>{row.phone}</span>
          </div>
        </div>
      )
    },
    {
      key: 'region',
      header: 'Hudud & Manzil',
      render: (row) => (
        <div>
          <div className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[var(--color-text-muted)] shrink-0" />
            <span>{row.region}</span>
          </div>
          <div className="text-[11px] text-[var(--color-text-muted)] line-clamp-1 mt-0.5">
            {row.address}
          </div>
        </div>
      )
    },
    {
      key: 'supplierType',
      header: 'Turi (TZ-5)',
      render: (row) => (
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase border ${
            row.supplierType === 'GLOBAL'
              ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
              : 'bg-blue-500/15 text-blue-500 border-blue-500/30'
          }`}
        >
          {row.supplierType === 'GLOBAL' ? 'Global' : 'Mahalliy'}
        </span>
      )
    },
    {
      key: 'turnover',
      header: 'Tovarlar & Aylanma',
      render: (row) => (
        <div>
          <div className="text-xs font-bold font-mono text-[var(--color-text-primary)] flex items-center gap-1">
            <Package className="w-3.5 h-3.5 text-[var(--color-accent-blue)]" />
            <span>{row.productsCount} turdagi tovar</span>
          </div>
          <div className="text-[11px] font-mono text-[var(--color-text-secondary)] mt-0.5">
            {row.totalTurnover > 0 ? `${row.totalTurnover.toLocaleString()} so‘m` : 'Hali savdo yo‘q'}
          </div>
        </div>
      )
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
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedForDetails(row)}
            title="STIR Yuridik Pasporti & E-IMZO"
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-accent-blue)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setEditingSupplier(row);
              setIsFormDrawerOpen(true);
            }}
            title="Tahrirlash"
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSuspendModalTarget(row)}
            title={row.status === 'VERIFIED' ? 'Faoliyatni to‘xtatish' : 'Faollashtirish'}
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-accent-yellow)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
          >
            {row.status === 'VERIFIED' ? (
              <AlertTriangle className="w-4 h-4 text-[var(--color-accent-yellow)]" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[var(--color-accent-green)]" />
            )}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Sahifa sarlavhasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Ta’minotchilar & STIR Verifikatsiyasi
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Qurilish materiallari ishlab chiqaruvchi zavodlar, ulgurji bazalar va DSQ soliq reestri
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setEditingSupplier(null);
            setIsFormDrawerOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Yangi Ta’minotchi Qo‘shish
        </Button>
      </div>

      {/* KPI Kartochkalar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiStatCard
          title="Jami Ta’minotchilar"
          value={totalCount}
          icon={<Building2 className="w-5 h-5" />}
          change="+1 yangi ariza"
          changeType="positive"
        />
        <KpiStatCard
          title="Tasdiqlangan Korxonalar"
          value={verifiedCount}
          icon={<ShieldCheck className="w-5 h-5" />}
          change="Soliq & E-IMZO tekshirilgan"
          changeType="positive"
        />
        <KpiStatCard
          title="Kutilayotgan Arizalar"
          value={pendingCount}
          icon={<AlertTriangle className="w-5 h-5" />}
          change="Verifikatsiya talab etiladi"
          changeType="neutral"
        />
        <KpiStatCard
          title="QQS To‘lovchilari"
          value={vatPayersCount}
          icon={<FileCheck2 className="w-5 h-5" />}
          change="12% elektron hisob-faktura"
          changeType="positive"
        />
      </div>

      {/* Jadvallar va Filtrlar */}
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={filteredData}
          searchPlaceholder="Korxona nomi, STIR, rahbar yoki manzil bo‘yicha qidiruv..."
          emptyTitle="Hech qanday ta’minotchi korxona topilmadi"
          emptyDescription="Filtr parametrlarini o‘zgartiring yoki yangi korxona qo‘shing."
          actionsSlot={
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-44">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={statusOptions}
                />
              </div>
              <div className="w-52">
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  options={typeOptions}
                />
              </div>
              <div className="w-44">
                <Select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  options={regionOptions}
                />
              </div>
            </div>
          }
        />
      </div>

      {/* STIR & E-IMZO Batafsil Drawer */}
      <StirVerificationDrawer
        isOpen={Boolean(selectedForDetails)}
        onClose={() => setSelectedForDetails(null)}
        supplier={selectedForDetails}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Yangi qo'shish yoki tahrirlash Drawer */}
      <SupplierFormDrawer
        isOpen={isFormDrawerOpen}
        onClose={() => {
          setIsFormDrawerOpen(false);
          setEditingSupplier(null);
        }}
        onSave={handleSaveSupplier}
        initialData={editingSupplier}
      />

      {/* Faoliyatni to'xtatish yoki faollashtirish tasdiqlash modali */}
      <ConfirmModal
        isOpen={Boolean(suspendModalTarget)}
        title={
          suspendModalTarget?.status === 'VERIFIED'
            ? 'Ta’minotchi faoliyatini to‘xtatishni tasdiqlaysizmi?'
            : 'Ta’minotchini qayta faollashtirishni tasdiqlaysizmi?'
        }
        description={
          suspendModalTarget?.status === 'VERIFIED'
            ? `«${suspendModalTarget?.companyName}» korxonasi to‘xtatilganda uning tovarlari umumiy B2B katalogida vaqtincha yashiriladi.`
            : `«${suspendModalTarget?.companyName}» korxonasi qayta faollashtirilgach, uning tovarlari buyurtmalar uchun qayta ochiladi.`
        }
        confirmText={suspendModalTarget?.status === 'VERIFIED' ? 'Ha, to‘xtatilsin' : 'Ha, faollashtirilsin'}
        cancelText="Bekor qilish"
        isDangerous={suspendModalTarget?.status === 'VERIFIED'}
        onConfirm={handleConfirmToggleSuspend}
        onClose={() => setSuspendModalTarget(null)}
      />
    </div>
  );
};
