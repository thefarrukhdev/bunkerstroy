import React, { useState, useEffect } from 'react';
import { VehicleItem, VehicleType, VehicleStatus } from '../../mocks/logisticsMock';
import { SlideOverDrawer } from '../../components/SlideOverDrawer';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { Truck, User, Phone, MapPin, Tag, AlertCircle } from 'lucide-react';

interface VehicleFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<VehicleItem, 'id' | 'updatedAt' | 'typeLabel' | 'assignedOrderId'>, id?: string) => void;
  initialData?: VehicleItem | null;
}

const VEHICLE_TYPES = [
  { value: 'DUMP_TRUCK_SAMOSVAL', label: 'Og‘ir Samosval (HOWO/Shacman 25-35t)' },
  { value: 'CONCRETE_MIXER', label: 'Beton Mikser (Avtobetonosmesitel 8-12m³)' },
  { value: 'CRANE_MANIPULATOR', label: 'Kran-Manipulyator (Bortli kran)' },
  { value: 'GAZEL_LIGHT_TRUCK', label: 'Yengil Yuk Avtomobili (Isuzu/Gazel 3-5t)' },
  { value: 'SEMI_TRAILER_FURA', label: 'Yarim Tirkama / Fura (Armatura va g‘isht uchun)' }
];

const VEHICLE_STATUSES = [
  { value: 'AVAILABLE', label: 'Bo‘sh va Tayyor (AVAILABLE)' },
  { value: 'MAINTENANCE', label: 'Ta’mirda / Profilaktika (MAINTENANCE)' }
];

export const VehicleFormDrawer: React.FC<VehicleFormDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<VehicleType>('DUMP_TRUCK_SAMOSVAL');
  const [plateNumber, setPlateNumber] = useState('');
  const [capacityTons, setCapacityTons] = useState<number>(25);
  const [capacityVolumeM3, setCapacityVolumeM3] = useState<number>(18);
  const [basePrice, setBasePrice] = useState<number>(500000);
  const [pricePerKm, setPricePerKm] = useState<number>(18000);
  const [status, setStatus] = useState<VehicleStatus>('AVAILABLE');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('+998');
  const [currentLocationName, setCurrentLocationName] = useState('Toshkent, Sergeli Bazasi');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setType(initialData.type);
      setPlateNumber(initialData.plateNumber);
      setCapacityTons(initialData.capacityTons);
      setCapacityVolumeM3(initialData.capacityVolumeM3 || 0);
      setBasePrice(initialData.basePrice);
      setPricePerKm(initialData.pricePerKm);
      setStatus(initialData.status === 'ON_ROUTE' ? 'AVAILABLE' : initialData.status);
      setDriverName(initialData.driverName);
      setDriverPhone(initialData.driverPhone);
      setCurrentLocationName(initialData.currentLocationName);
      setError(null);
    } else {
      setName('');
      setType('DUMP_TRUCK_SAMOSVAL');
      setPlateNumber('');
      setCapacityTons(25);
      setCapacityVolumeM3(18);
      setBasePrice(500000);
      setPricePerKm(18000);
      setStatus('AVAILABLE');
      setDriverName('');
      setDriverPhone('+998');
      setCurrentLocationName('Toshkent, Sergeli Bazasi');
      setError(null);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Texnika nomini kiriting (masalan, HOWO Sinotruk 25t)');
      return;
    }
    if (!plateNumber.trim()) {
      setError('Davlat raqamini kiriting (masalan, 01 777 AAA)');
      return;
    }
    if (!driverName.trim()) {
      setError('Haydovchi ism-sharifini kiriting');
      return;
    }
    if (!driverPhone.trim() || driverPhone.trim().length < 9) {
      setError('Haydovchi telefon raqamini to‘liq kiriting');
      return;
    }
    if (basePrice < 0 || pricePerKm <= 0) {
      setError('Chiqish va kilometr stavkalari 0 dan katta bo‘lishi lozim');
      return;
    }

    onSave(
      {
        name: name.trim(),
        type,
        plateNumber: plateNumber.trim().toUpperCase(),
        capacityTons,
        capacityVolumeM3: capacityVolumeM3 > 0 ? capacityVolumeM3 : undefined,
        basePrice,
        pricePerKm,
        status,
        driverName: driverName.trim(),
        driverPhone: driverPhone.trim(),
        currentLocationName: currentLocationName.trim()
      },
      initialData?.id
    );

    onClose();
  };

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Texnika Ma'lumotlarini Tahrirlash" : "Yangi Maxsus Texnika Qo'shish"}
      subtitle="BunkerStroy Og‘ir Avtopark Logistika Nazorati"
      footer={
        <div className="flex items-center justify-end gap-2.5 w-full">
          <Button variant="outline" size="md" onClick={onClose} type="button">
            Bekor qilish
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit} type="button">
            {initialData ? 'Saqlash' : 'Texnikani Qo‘shish'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-[var(--color-accent-red)]/15 border border-[var(--color-accent-red)]/30 text-[var(--color-accent-red)] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Texnika nomi & Davlat raqami */}
        <Input
          label="Texnika modeli va markasi *"
          placeholder="Masalan, HOWO Sinotruk 25t Samosval"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<Truck className="w-4 h-4" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Davlat raqami *"
            placeholder="01 777 AAA"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
            leftIcon={<Tag className="w-4 h-4" />}
          />

          <Select
            label="Texnika turi *"
            value={type}
            onChange={(e) => setType(e.target.value as VehicleType)}
            options={VEHICLE_TYPES}
          />
        </div>

        {/* Yuk ko'tarish va sig'im */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Yuk ko‘tarish quvvati (Tonna) *"
            type="number"
            min={1}
            value={capacityTons}
            onChange={(e) => setCapacityTons(Number(e.target.value))}
          />

          <Input
            label="Kuzov / Mikser sig‘imi (m³)"
            type="number"
            min={0}
            value={capacityVolumeM3}
            onChange={(e) => setCapacityVolumeM3(Number(e.target.value))}
          />
        </div>

        {/* Haydovchi ma'lumotlari */}
        <div className="p-3.5 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border-subtle)] space-y-3">
          <div className="text-xs font-bold text-[var(--color-text-primary)]">
            Biriktirilgan Haydovchi Rekvizitlari
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Haydovchi F.I.Sh. *"
              placeholder="Familiya Ism Sharif"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Telefon raqami *"
              placeholder="+998 90 123 45 67"
              value={driverPhone}
              onChange={(e) => setDriverPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Tarif va Joylashuv */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Baza chiqish narxi (so‘m) *"
            type="number"
            min={0}
            value={basePrice}
            onChange={(e) => setBasePrice(Number(e.target.value))}
          />

          <Input
            label="1 km uchun stavka (so‘m/km) *"
            type="number"
            min={1}
            value={pricePerKm}
            onChange={(e) => setPricePerKm(Number(e.target.value))}
          />
        </div>

        <Input
          label="Joriy dislokatsiya bazasi / manzil *"
          placeholder="Toshkent, Sergeli Maxsus Texnika Parki"
          value={currentLocationName}
          onChange={(e) => setCurrentLocationName(e.target.value)}
          leftIcon={<MapPin className="w-4 h-4" />}
        />

        <Select
          label="Texnika holati"
          value={status}
          onChange={(e) => setStatus(e.target.value as VehicleStatus)}
          options={VEHICLE_STATUSES}
        />
      </form>
    </SlideOverDrawer>
  );
};
