import React, { useState, useEffect } from 'react';
import { ProductItem, ProductUnit, CATEGORIES } from '../../mocks/productsMock';
import { INITIAL_SUPPLIERS } from '../../mocks/suppliersMock';
import { SlideOverDrawer } from '../../components/SlideOverDrawer';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Switch } from '../../components/Switch';
import { Button } from '../../components/Button';
import { Package, Tag, Building2, Layers, AlertCircle, ShieldCheck } from 'lucide-react';

interface ProductFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<ProductItem, 'id' | 'updatedAt' | 'categoryName' | 'supplierName' | 'unitLabel' | 'status'>, id?: string) => void;
  initialData?: ProductItem | null;
}

const UNIT_OPTIONS = [
  { value: 'QOP_50KG', label: 'qop (50 kg)' },
  { value: 'TONNA', label: 'tonna (tn)' },
  { value: 'KV_METR', label: 'kvadrat metr (m²)' },
  { value: 'KUB_METR', label: 'kub metr (m³)' },
  { value: 'DONA', label: 'dona (d)' }
];

const ENERGY_OPTIONS = [
  { value: 'STANDARD', label: 'Standart (Oddiy)' },
  { value: 'A+', label: 'A+ Energiya tejamkor' },
  { value: 'A++', label: 'A++ Yuqori tejamkorlik (ESCO)' },
  { value: 'A+++', label: 'A+++ Maksimal tejamkorlik' }
];

export const ProductFormDrawer: React.FC<ProductFormDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [sku, setSku] = useState('');
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const [supplierId, setSupplierId] = useState(INITIAL_SUPPLIERS[0].id);
  const [price, setPrice] = useState<number>(50000);
  const [unit, setUnit] = useState<ProductUnit>('QOP_50KG');
  const [stock, setStock] = useState<number>(100);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(20);
  const [minOrder, setMinOrder] = useState<number>(1);
  const [isEscoCertified, setIsEscoCertified] = useState<boolean>(false);
  const [energyRating, setEnergyRating] = useState<'A+++' | 'A++' | 'A+' | 'STANDARD'>('STANDARD');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setSku(initialData.sku);
      setTitle(initialData.title);
      setCategoryId(initialData.categoryId);
      setSupplierId(initialData.supplierId);
      setPrice(initialData.price);
      setUnit(initialData.unit);
      setStock(initialData.stock);
      setLowStockThreshold(initialData.lowStockThreshold);
      setMinOrder(initialData.minOrder);
      setIsEscoCertified(initialData.isEscoCertified);
      setEnergyRating(initialData.energyRating || 'STANDARD');
      setError(null);
    } else {
      setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
      setTitle('');
      setCategoryId(CATEGORIES[0].id);
      setSupplierId(INITIAL_SUPPLIERS[0].id);
      setPrice(50000);
      setUnit('QOP_50KG');
      setStock(100);
      setLowStockThreshold(20);
      setMinOrder(1);
      setIsEscoCertified(false);
      setEnergyRating('STANDARD');
      setError(null);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Mahsulot nomini kiritish majburiy');
      return;
    }
    if (!sku.trim()) {
      setError('SKU artikul raqami kiritilishi shart');
      return;
    }
    if (price <= 0) {
      setError('Mahsulot narxi 0 dan katta bo‘lishi kerak');
      return;
    }
    if (stock < 0) {
      setError('Ombor zaxirasi manfiy bo‘lishi mumkin emas');
      return;
    }
    if (minOrder < 1) {
      setError('Minimal buyurtma miqdori (MOQ) kamida 1 bo‘lishi shart');
      return;
    }

    onSave(
      {
        sku: sku.trim(),
        title: title.trim(),
        categoryId,
        supplierId,
        price,
        unit,
        stock,
        lowStockThreshold,
        minOrder,
        isEscoCertified,
        energyRating: isEscoCertified ? energyRating : 'STANDARD'
      },
      initialData?.id
    );

    onClose();
  };

  const categoryOptions = CATEGORIES.map((c) => ({
    value: c.id,
    label: c.name
  }));

  const supplierOptions = INITIAL_SUPPLIERS.map((s) => ({
    value: s.id,
    label: `${s.companyName} (STIR: ${s.inn})`
  }));

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Mahsulot Ma'lumotlarini Tahrirlash" : "Yangi Qurilish Tovarini Qo'shish"}
      subtitle="BunkerStroy Ulgurji Nomenklaturasi va Ombor Zaxiralari"
      footer={
        <div className="flex items-center justify-end gap-2.5 w-full">
          <Button variant="outline" size="md" onClick={onClose} type="button">
            Bekor qilish
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit} type="button">
            {initialData ? 'Saqlash' : 'Tovarni Qo‘shish'}
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

        {/* Mahsulot Nomi & SKU */}
        <Input
          label="Mahsulot nomi (Brend, marka, o‘lchami) *"
          placeholder="Masalan, Portlendsement M500 D0"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          leftIcon={<Package className="w-4 h-4" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="SKU Artikul kodi *"
            placeholder="CEM-M500-QOP"
            value={sku}
            onChange={(e) => setSku(e.target.value.toUpperCase())}
            leftIcon={<Tag className="w-4 h-4" />}
          />

          <Select
            label="Kategoriya *"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            options={categoryOptions}
          />
        </div>

        {/* Ta'minotchi korxona */}
        <Select
          label="Yetkazib beruvchi korxona (Ta’minotchi) *"
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
          options={supplierOptions}
        />

        {/* Narx & O'lchov birligi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Baza ulgurji narxi (so‘mda) *"
            type="number"
            min={1}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />

          <Select
            label="O‘lchov birligi *"
            value={unit}
            onChange={(e) => setUnit(e.target.value as ProductUnit)}
            options={UNIT_OPTIONS}
          />
        </div>

        {/* Zaxira & Low Stock & MOQ */}
        <div className="p-3.5 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border-subtle)] space-y-3">
          <div className="text-xs font-bold text-[var(--color-text-primary)]">
            Ombor Zaxiralari va Ulgurji MOQ Nazorati
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Hozirgi zaxira *"
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
            />

            <Input
              label="Xavfli minimum (Low Stock)"
              type="number"
              min={0}
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(Number(e.target.value))}
            />

            <Input
              label="MOQ (Minimal buyurtma) *"
              type="number"
              min={1}
              value={minOrder}
              onChange={(e) => setMinOrder(Number(e.target.value))}
            />
          </div>
          <p className="text-[11px] text-[var(--color-text-muted)]">
            Agar ombordagi tovar soni «Xavfli minimum»dan kamayib ketsa, tizim avtomatik ravishda LOW_STOCK ogohlantirishini yoqadi.
          </p>
        </div>

        {/* ESCO Energiya tejamkorlik */}
        <div className="p-3.5 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="text-xs font-bold text-[var(--color-text-primary)]">
                  ESCO Energiya Tejamkorlik Sertifikati
                </div>
                <div className="text-[11px] text-[var(--color-text-muted)]">
                  Yashil qurilish va energiya tejovchi materiallar reytingi
                </div>
              </div>
            </div>
            <Switch checked={isEscoCertified} onChange={setIsEscoCertified} />
          </div>

          {isEscoCertified && (
            <Select
              label="Energiya samaradorligi sinfi"
              value={energyRating}
              onChange={(e) => setEnergyRating(e.target.value as any)}
              options={ENERGY_OPTIONS}
            />
          )}
        </div>
      </form>
    </SlideOverDrawer>
  );
};
