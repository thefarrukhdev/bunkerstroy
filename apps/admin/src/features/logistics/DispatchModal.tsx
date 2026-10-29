import React, { useState } from 'react';
import { VehicleItem, DispatchRecord } from '../../mocks/logisticsMock';
import { INITIAL_ORDERS } from '../../mocks/ordersMock';
import { Button } from '../../components/Button';
import { Select } from '../../components/Select';
import { Input } from '../../components/Input';
import {
  Truck,
  X,
  MapPin,
  Calculator,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Navigation
} from 'lucide-react';

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableVehicles: VehicleItem[];
  onConfirmDispatch: (dispatch: Omit<DispatchRecord, 'id' | 'assignedAt'>) => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  isOpen,
  onClose,
  availableVehicles,
  onConfirmDispatch
}) => {
  // Selectable orders that need logistics dispatch
  const pendingDispatchOrders = INITIAL_ORDERS.filter(
    (o) => o.status === 'CONFIRMED' || o.status === 'PENDING'
  );

  const [selectedOrderId, setSelectedOrderId] = useState(
    pendingDispatchOrders[0]?.id || ''
  );
  const [selectedVehicleId, setSelectedVehicleId] = useState(
    availableVehicles[0]?.id || ''
  );
  const [distanceKm, setDistanceKm] = useState<number>(25);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentOrder = pendingDispatchOrders.find((o) => o.id === selectedOrderId);
  const currentVehicle = availableVehicles.find((v) => v.id === selectedVehicleId);

  // Dynamic cost calculation
  const baseCost = currentVehicle?.basePrice || 0;
  const kmCost = (currentVehicle?.pricePerKm || 0) * distanceKm;
  const totalCalculatedFee = baseCost + kmCost;

  const handleDispatch = () => {
    if (!currentOrder) {
      setError('Buyurtma tanlanmagan');
      return;
    }
    if (!currentVehicle) {
      setError('Bo‘sh maxsus texnika topilmadi');
      return;
    }
    if (distanceKm <= 0) {
      setError('Yetkazib berish masofasi 0 dan katta bo‘lishi kerak');
      return;
    }

    onConfirmDispatch({
      orderNumber: currentOrder.orderNumber,
      clientCompanyName: currentOrder.companyName,
      destination: `${currentOrder.deliveryRegion}, ${currentOrder.deliveryDistrict}, ${currentOrder.deliveryAddress}`,
      vehicleId: currentVehicle.id,
      vehicleName: currentVehicle.name,
      plateNumber: currentVehicle.plateNumber,
      driverName: currentVehicle.driverName,
      driverPhone: currentVehicle.driverPhone,
      distanceKm,
      calculatedFee: totalCalculatedFee,
      status: 'EN_ROUTE'
    });

    onClose();
  };

  const orderOptions = pendingDispatchOrders.map((o) => ({
    value: o.id,
    label: `${o.orderNumber} • ${o.companyName} (${o.deliveryRegion})`
  }));

  const vehicleOptions = availableVehicles.map((v) => ({
    value: v.id,
    label: `${v.name} [${v.plateNumber}] - ${v.driverName} (${v.currentLocationName})`
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
            <div className="p-2.5 rounded-xl bg-[var(--color-accent-blue)]/15 text-[var(--color-accent-blue)] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[var(--color-text-primary)] truncate">
                Buyurtmaga Og‘ir Texnika Biriktirish
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 truncate">
                HOWO / Shacman avtoparkidan reysga chiqarish va masofa stavkasini hisoblash
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

        {error && (
          <div className="p-3 rounded-lg bg-[var(--color-accent-red)]/15 border border-[var(--color-accent-red)]/30 text-[var(--color-accent-red)] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Controls */}
        <div className="space-y-3.5 flex-1">
          {/* Order selection */}
          <Select
            label="Yetkazib beriladigan buyurtma *"
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            options={orderOptions}
          />

          {/* Vehicle selection */}
          <Select
            label="Bo‘sh maxsus texnika (Avtopark) *"
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            options={vehicleOptions}
          />

          {/* Distance input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Yetkazib berish masofasi (km) *"
              type="number"
              min={1}
              value={distanceKm}
              onChange={(e) => setDistanceKm(Math.max(1, Number(e.target.value)))}
              leftIcon={<Navigation className="w-4 h-4" />}
            />

            <div className="p-3 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border-subtle)] text-xs space-y-1">
              <span className="text-[var(--color-text-muted)]">Haydovchi bilan aloqa:</span>
              <div className="font-semibold text-[var(--color-text-primary)] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[var(--color-accent-blue)]" />
                <span>{currentVehicle?.driverName || '—'}</span>
              </div>
              <div className="font-mono text-[var(--color-accent-blue)] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>{currentVehicle?.driverPhone || '—'}</span>
              </div>
            </div>
          </div>

          {/* PostGIS Calculation Box */}
          <div className="p-4 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border-subtle)] space-y-2.5 text-xs font-mono">
            <div className="flex items-center gap-2 text-xs font-sans font-bold text-[var(--color-text-primary)] pb-1.5 border-b border-[var(--color-border-subtle)]">
              <Calculator className="w-4 h-4 text-[var(--color-accent-green)]" />
              <span>Avtomatlashtirilgan Transport Xarajati Hisobi (Tarif)</span>
            </div>
            <div className="flex items-center justify-between text-[var(--color-text-secondary)]">
              <span>Baza chiqish narxi:</span>
              <span>{baseCost.toLocaleString()} so‘m</span>
            </div>
            <div className="flex items-center justify-between text-[var(--color-text-secondary)]">
              <span>Masofa qiymati ({distanceKm} km x {currentVehicle?.pricePerKm.toLocaleString()} so‘m):</span>
              <span>+{kmCost.toLocaleString()} so‘m</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-subtle)] text-sm font-bold text-[var(--color-text-primary)]">
              <span className="font-sans">Jami Logistika To‘lovi:</span>
              <span className="text-[var(--color-accent-green)]">
                {totalCalculatedFee.toLocaleString()} so‘m
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 sm:gap-3 pt-3 border-t border-[var(--color-border-subtle)]">
          <Button variant="outline" size="md" onClick={onClose} className="w-full sm:w-auto">
            Bekor qilish
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleDispatch}
            disabled={!currentOrder || !currentVehicle}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Reysga Biriktirish va Yuborish
          </Button>
        </div>
      </div>
    </div>
  );
};
