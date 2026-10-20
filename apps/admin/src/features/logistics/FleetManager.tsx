import React, { useState } from 'react';
import {
  VehicleItem,
  VehicleStatus,
  DispatchRecord,
  INITIAL_VEHICLES,
  INITIAL_DISPATCHES
} from '../../mocks/logisticsMock';
import { DataTable, Column } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { KpiStatCard } from '../../components/KpiStatCard';
import { Select } from '../../components/Select';
import { ConfirmModal } from '../../components/ConfirmModal';
import { DispatchModal } from './DispatchModal';
import { VehicleFormDrawer } from './VehicleFormDrawer';
import {
  Truck,
  Plus,
  Edit3,
  Trash2,
  Navigation,
  Phone,
  User,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Wrench,
  Gauge
} from 'lucide-react';

export const FleetManager: React.FC = () => {
  const [vehicles, setVehicles] = useState<VehicleItem[]>(INITIAL_VEHICLES);
  const [dispatches, setDispatches] = useState<DispatchRecord[]>(INITIAL_DISPATCHES);
  const [activeTab, setActiveTab] = useState<'fleet' | 'dispatches'>('fleet');

  // Filters
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals & Drawers
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isVehicleDrawerOpen, setIsVehicleDrawerOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleItem | null>(null);
  const [deleteVehicleTarget, setDeleteVehicleTarget] = useState<VehicleItem | null>(null);

  // Statistics
  const totalVehicles = vehicles.length;
  const availableVehiclesCount = vehicles.filter((v) => v.status === 'AVAILABLE').length;
  const onRouteVehiclesCount = vehicles.filter((v) => v.status === 'ON_ROUTE').length;
  const maintenanceVehiclesCount = vehicles.filter((v) => v.status === 'MAINTENANCE').length;

  // Filtered Vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchesType = typeFilter === 'ALL' || v.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesType && matchesStatus;
  });

  // Available vehicles for dispatch modal
  const availableVehicles = vehicles.filter((v) => v.status === 'AVAILABLE');

  // Type labels map
  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'DUMP_TRUCK_SAMOSVAL':
        return 'Og‘ir Samosval';
      case 'CONCRETE_MIXER':
        return 'Beton Mikser';
      case 'CRANE_MANIPULATOR':
        return 'Kran-Manipulyator';
      case 'GAZEL_LIGHT_TRUCK':
        return 'Yengil Yuk Transporti';
      case 'SEMI_TRAILER_FURA':
        return 'Yarim Tirkama (Fura)';
      default:
        return 'Maxsus Texnika';
    }
  };

  // Save Vehicle
  const handleSaveVehicle = (
    data: Omit<VehicleItem, 'id' | 'updatedAt' | 'typeLabel' | 'assignedOrderId'>,
    id?: string
  ) => {
    const typeLabel = getTypeLabel(data.type);
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (id) {
      setVehicles((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...data, typeLabel, updatedAt: dateStr } : item
        )
      );
    } else {
      const newVehicle: VehicleItem = {
        id: `veh-${Date.now()}`,
        ...data,
        typeLabel,
        updatedAt: dateStr
      };
      setVehicles((prev) => [newVehicle, ...prev]);
    }
  };

  // Dispatch Confirmation
  const handleConfirmDispatch = (newDispatchData: Omit<DispatchRecord, 'id' | 'assignedAt'>) => {
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newDispatch: DispatchRecord = {
      id: `disp-${Date.now()}`,
      ...newDispatchData,
      assignedAt: dateStr
    };

    setDispatches((prev) => [newDispatch, ...prev]);

    // Update vehicle status to ON_ROUTE
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === newDispatchData.vehicleId
          ? {
              ...v,
              status: 'ON_ROUTE',
              assignedOrderId: newDispatchData.orderNumber,
              currentLocationName: `${newDispatchData.destination} tomon yo‘lda`,
              updatedAt: dateStr
            }
          : v
      )
    );
  };

  // Complete Dispatch (Mark Delivered & Release Vehicle)
  const handleCompleteDispatch = (dispatchId: string) => {
    const target = dispatches.find((d) => d.id === dispatchId);
    if (!target) return;

    setDispatches((prev) =>
      prev.map((d) => (d.id === dispatchId ? { ...d, status: 'DELIVERED' } : d))
    );

    // Release vehicle back to AVAILABLE
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === target.vehicleId
          ? {
              ...v,
              status: 'AVAILABLE',
              assignedOrderId: undefined,
              currentLocationName: 'Baza hududiga qaytgan',
              updatedAt: 'Hozir'
            }
          : v
      )
    );
  };

  // Delete Vehicle
  const handleDeleteVehicle = () => {
    if (!deleteVehicleTarget) return;
    setVehicles((prev) => prev.filter((v) => v.id !== deleteVehicleTarget.id));
    setDeleteVehicleTarget(null);
  };

  // Filter options
  const typeOptions = [
    { value: 'ALL', label: 'Barcha texnika turlari' },
    { value: 'DUMP_TRUCK_SAMOSVAL', label: 'Og‘ir Samosvallar' },
    { value: 'CONCRETE_MIXER', label: 'Beton Mikserlar' },
    { value: 'CRANE_MANIPULATOR', label: 'Kran-Manipulyatorlar' },
    { value: 'GAZEL_LIGHT_TRUCK', label: 'Yengil Yuk Transportlari' }
  ];

  const statusOptions = [
    { value: 'ALL', label: 'Barcha holatlar' },
    { value: 'AVAILABLE', label: 'Bo‘sh va Tayyor (AVAILABLE)' },
    { value: 'ON_ROUTE', label: 'Marshrutda / Reysda (ON_ROUTE)' },
    { value: 'MAINTENANCE', label: 'Ta’mirda (MAINTENANCE)' }
  ];

  // Vehicles Columns
  const vehicleColumns: Column<VehicleItem>[] = [
    {
      key: 'name',
      header: 'Texnika Modeli & Raqami',
      render: (row) => (
        <div>
          <div className="font-bold text-sm text-[var(--color-text-primary)] flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[var(--color-accent-blue)] shrink-0" />
            <span>{row.name}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono text-xs font-semibold px-1.5 py-0.2 rounded bg-[var(--color-surface-hover)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)]">
              {row.plateNumber}
            </span>
            <span className="text-[11px] text-[var(--color-text-muted)]">
              • {row.typeLabel}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'capacity',
      header: 'Quvvati / Sig‘imi',
      render: (row) => (
        <div>
          <div className="font-mono font-bold text-xs text-[var(--color-text-primary)]">
            {row.capacityTons} tonna
          </div>
          {row.capacityVolumeM3 && (
            <div className="text-[11px] font-mono text-[var(--color-text-muted)]">
              {row.capacityVolumeM3} m³ hajm
            </div>
          )}
        </div>
      )
    },
    {
      key: 'driver',
      header: 'Haydovchi & Aloqa',
      render: (row) => (
        <div>
          <div className="text-xs font-semibold text-[var(--color-text-primary)] flex items-center gap-1">
            <User className="w-3 h-3 text-[var(--color-text-muted)]" />
            <span>{row.driverName}</span>
          </div>
          <div className="text-xs font-mono text-[var(--color-accent-blue)] flex items-center gap-1 mt-0.5">
            <Phone className="w-3 h-3" />
            <span>{row.driverPhone}</span>
          </div>
        </div>
      )
    },
    {
      key: 'location',
      header: 'Joriy Dislokatsiya',
      render: (row) => (
        <div>
          <div className="text-xs text-[var(--color-text-primary)] flex items-center gap-1 line-clamp-1">
            <MapPin className="w-3 h-3 text-[var(--color-text-muted)] shrink-0" />
            <span>{row.currentLocationName}</span>
          </div>
          {row.assignedOrderId && (
            <div className="text-[11px] font-mono text-[var(--color-accent-blue)] mt-0.5">
              Reys: {row.assignedOrderId}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'rates',
      header: 'Tariflar (Chiqish / km)',
      render: (row) => (
        <div className="font-mono text-xs">
          <div className="text-[var(--color-text-primary)] font-semibold">
            {row.basePrice.toLocaleString()} so‘m
          </div>
          <div className="text-[10px] text-[var(--color-text-muted)]">
            +{row.pricePerKm.toLocaleString()} so‘m/km
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
            onClick={() => {
              setEditingVehicle(row);
              setIsVehicleDrawerOpen(true);
            }}
            title="Tahrirlash"
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-accent-blue)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {row.status !== 'ON_ROUTE' && (
            <button
              onClick={() => setDeleteVehicleTarget(row)}
              title="O‘chirish"
              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-accent-red)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  // Dispatches Columns
  const dispatchColumns: Column<DispatchRecord>[] = [
    {
      key: 'orderNumber',
      header: 'Buyurtma & Xaridor',
      render: (row) => (
        <div>
          <div className="font-mono font-bold text-sm text-[var(--color-accent-blue)]">
            {row.orderNumber}
          </div>
          <div className="text-xs text-[var(--color-text-primary)] mt-0.5 line-clamp-1">
            {row.clientCompanyName}
          </div>
        </div>
      )
    },
    {
      key: 'vehicle',
      header: 'Biriktirilgan Texnika',
      render: (row) => (
        <div>
          <div className="text-xs font-semibold text-[var(--color-text-primary)] flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-[var(--color-accent-blue)]" />
            <span>{row.vehicleName}</span>
          </div>
          <div className="text-xs font-mono text-[var(--color-text-muted)] mt-0.5">
            {row.plateNumber} • {row.driverName}
          </div>
        </div>
      )
    },
    {
      key: 'destination',
      header: 'Yetkazish Manzili & Masofa',
      render: (row) => (
        <div>
          <div className="text-xs text-[var(--color-text-primary)] flex items-center gap-1 line-clamp-1">
            <MapPin className="w-3 h-3 text-[var(--color-text-muted)] shrink-0" />
            <span>{row.destination}</span>
          </div>
          <div className="text-[11px] font-mono text-[var(--color-accent-blue)] mt-0.5">
            Masofa: {row.distanceKm} km
          </div>
        </div>
      )
    },
    {
      key: 'fee',
      header: 'Logistika To‘lovi',
      render: (row) => (
        <div>
          <div className="font-mono font-bold text-xs text-[var(--color-accent-green)]">
            {row.calculatedFee.toLocaleString()} so‘m
          </div>
          <div className="text-[10px] font-mono text-[var(--color-text-muted)]">
            Chiqish + km stavkasi
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Reys Holati',
      render: (row) => <StatusBadge status={row.status === 'EN_ROUTE' ? 'ON_ROUTE' : row.status} />
    },
    {
      key: 'actions',
      header: 'Amallar',
      render: (row) => (
        <div>
          {row.status === 'EN_ROUTE' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleCompleteDispatch(row.id)}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Yetkazildi
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Sarlavha & Boshqaruv tugmalari */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Og‘ir Logistika & Avtopark Dispecherligi
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            HOWO 25t samosvallari, Shacman beton mikserlari, kranlar va PostGIS reyslar nazorati
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setIsDispatchModalOpen(true)}
            leftIcon={<Navigation className="w-4 h-4" />}
          >
            Reysga Biriktirish
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setEditingVehicle(null);
              setIsVehicleDrawerOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Yangi Texnika Qo‘shish
          </Button>
        </div>
      </div>

      {/* KPI Kartochkalar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiStatCard
          title="Jami Maxsus Texnikalar"
          value={totalVehicles}
          icon={<Truck className="w-5 h-5" />}
          change="Avtopark ro‘yxati"
          changeType="positive"
        />
        <KpiStatCard
          title="Bo‘sh va Tayyor"
          value={availableVehiclesCount}
          icon={<CheckCircle2 className="w-5 h-5" />}
          change="Reysga darhol chiqishi mumkin"
          changeType="positive"
        />
        <KpiStatCard
          title="Marshrutda / Yo‘lda"
          value={onRouteVehiclesCount}
          icon={<Navigation className="w-5 h-5" />}
          change="Mijozlarga yetkazilmoqda"
          changeType="positive"
        />
        <KpiStatCard
          title="Ta’mirda / Profilaktika"
          value={maintenanceVehiclesCount}
          icon={<Wrench className="w-5 h-5" />}
          change="Avtoservisda nazoratda"
          changeType={maintenanceVehiclesCount > 0 ? 'negative' : 'positive'}
        />
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-[var(--color-border-subtle)] space-x-1">
        <button
          onClick={() => setActiveTab('fleet')}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'fleet'
              ? 'border-[var(--color-accent-blue)] text-[var(--color-accent-blue)] bg-[var(--color-surface-hover)]/40 rounded-t-lg'
              : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Avtopark Ro‘yxati ({totalVehicles})</span>
        </button>

        <button
          onClick={() => setActiveTab('dispatches')}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'dispatches'
              ? 'border-[var(--color-accent-blue)] text-[var(--color-accent-blue)] bg-[var(--color-surface-hover)]/40 rounded-t-lg'
              : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>Jonli Dispecherlik & Reyslar ({dispatches.length})</span>
        </button>
      </div>

      {/* Tab 1: Avtopark Jadvali */}
      {activeTab === 'fleet' && (
        <DataTable
          columns={vehicleColumns}
          data={filteredVehicles}
          searchPlaceholder="Model, davlat raqami, haydovchi yoki manzil bo‘yicha qidiruv..."
          emptyTitle="Hech qanday maxsus texnika topilmadi"
          emptyDescription="Filtr parametrlarini o‘zgartiring yoki yangi texnika ro‘yxatga oling."
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={statusOptions}
                />
              </div>
            </div>
          }
        />
      )}

      {/* Tab 2: Reyslar Jadvali */}
      {activeTab === 'dispatches' && (
        <DataTable
          columns={dispatchColumns}
          data={dispatches}
          searchPlaceholder="Buyurtma raqami, xaridor yoki haydovchi bo‘yicha qidiruv..."
          emptyTitle="Faol reyslar mavjud emas"
          emptyDescription="«Reysga Biriktirish» tugmasi orqali yangi transport jo‘nating."
        />
      )}

      {/* Dispatch Modal */}
      <DispatchModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        availableVehicles={availableVehicles}
        onConfirmDispatch={handleConfirmDispatch}
      />

      {/* Vehicle Form Drawer */}
      <VehicleFormDrawer
        isOpen={isVehicleDrawerOpen}
        onClose={() => {
          setIsVehicleDrawerOpen(false);
          setEditingVehicle(null);
        }}
        onSave={handleSaveVehicle}
        initialData={editingVehicle}
      />

      {/* Delete Vehicle Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteVehicleTarget)}
        title="Texnikani ro‘yxatdan o‘chirishni tasdiqlaysizmi?"
        description={`«${deleteVehicleTarget?.name}» [${deleteVehicleTarget?.plateNumber}] avtopark bazasidan o‘chiriladi.`}
        confirmText="Ha, o‘chirilsin"
        cancelText="Bekor qilish"
        isDangerous={true}
        onConfirm={handleDeleteVehicle}
        onClose={() => setDeleteVehicleTarget(null)}
      />
    </div>
  );
};
