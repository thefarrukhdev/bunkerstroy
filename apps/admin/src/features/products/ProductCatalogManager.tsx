import React, { useState } from 'react';
import {
  Package,
  Search,
  Edit2,
  Sparkles,
  Check,
  Plus,
  Minus,
  AlertTriangle,
  Zap,
  Filter,
  CheckCircle2,
  X,
  Building,
  Tag,
  Boxes
} from 'lucide-react';
import { Card, Badge, Button } from '@bunkerstroy/ui';
import { MeasurementUnit, EnergyRating } from '@bunkerstroy/types';

export interface AdminProductItem {
  id: string;
  sku: string;
  title: string;
  category: string;
  supplierName: string;
  price: number;
  unit: MeasurementUnit;
  stock: number;
  isEscoCertified: boolean;
  energyRating: EnergyRating;
  minOrder: number;
  updatedAt: string;
}

const initialProducts: AdminProductItem[] = [
  {
    id: 'prod-1',
    sku: 'CEM-M500-QOP',
    title: 'Portlendsement M500 D0 (Bekobod)',
    category: 'Sement & Qorishmalar',
    supplierName: '«TOSHKENT G\'ISHT VA SEMENT SERVIS» MChJ',
    price: 68000,
    unit: 'BAG_50KG',
    stock: 4500,
    isEscoCertified: false,
    energyRating: 'STANDARD',
    minOrder: 20,
    updatedAt: '2026-10-19 14:30'
  },
  {
    id: 'prod-2',
    sku: 'ARM-A500C-D12',
    title: 'Armatura A500C Ø12 mm (11.7m O\'zmetkombinat)',
    category: 'Metall & Armatura',
    supplierName: '«BEKOBOD METALL INVEST» AJ Dileri',
    price: 9200000,
    unit: 'TON',
    stock: 120,
    isEscoCertified: false,
    energyRating: 'STANDARD',
    minOrder: 1,
    updatedAt: '2026-10-19 16:15'
  },
  {
    id: 'prod-3',
    sku: 'ESCO-MINVATA-100',
    title: 'Bazalt Mineral Paxta Plitasi 100 mm (ESCO A++)',
    category: 'Issiqlik Izolyatsiyasi',
    supplierName: '«ECO-PENOPLAST ENERGO» MChJ (ESCO)',
    price: 85000,
    unit: 'SQ_METER',
    stock: 2800,
    isEscoCertified: true,
    energyRating: 'A++',
    minOrder: 50,
    updatedAt: '2026-10-18 11:20'
  },
  {
    id: 'prod-4',
    sku: 'BLOK-GAZ-D500',
    title: 'Avtoklav Gazoblok D500 (600x300x200 mm)',
    category: 'G\'isht & Bloklar',
    supplierName: '«SAMARQAND CEMENT INDUSTRY» QK MChJ',
    price: 720000,
    unit: 'CUBIC_METER',
    stock: 350,
    isEscoCertified: true,
    energyRating: 'A+',
    minOrder: 10,
    updatedAt: '2026-10-19 09:40'
  },
  {
    id: 'prod-5',
    sku: 'PENOPLAST-EPS-25',
    title: 'Penopolistirol Fasad Plitasi EPS-25 (50 mm)',
    category: 'Issiqlik Izolyatsiyasi',
    supplierName: '«ECO-PENOPLAST ENERGO» MChJ (ESCO)',
    price: 42000,
    unit: 'SQ_METER',
    stock: 1900,
    isEscoCertified: true,
    energyRating: 'A',
    minOrder: 30,
    updatedAt: '2026-10-17 17:05'
  },
  {
    id: 'prod-6',
    sku: 'GISHT-PISTIK-M125',
    title: 'Pishiq G\'isht M125 standart (Zangiota)',
    category: 'G\'isht & Bloklar',
    supplierName: '«TOSHKENT G\'ISHT VA SEMENT SERVIS» MChJ',
    price: 1350,
    unit: 'PIECE',
    stock: 85000,
    isEscoCertified: false,
    energyRating: 'STANDARD',
    minOrder: 2000,
    updatedAt: '2026-10-19 12:00'
  }
];

export const ProductCatalogManager: React.FC = () => {
  const [products, setProducts] = useState<AdminProductItem[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [escoFilter, setEscoFilter] = useState<'ALL' | 'ESCO_ONLY' | 'STANDARD'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Quick edit modal state
  const [editingProduct, setEditingProduct] = useState<AdminProductItem | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [editEsco, setEditEsco] = useState<boolean>(false);
  const [editEnergyRating, setEditEnergyRating] = useState<EnergyRating>('STANDARD');

  const categories = ['ALL', 'Sement & Qorishmalar', 'Metall & Armatura', 'Issiqlik Izolyatsiyasi', 'G\'isht & Bloklar'];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supplierName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEsco =
      escoFilter === 'ALL'
        ? true
        : escoFilter === 'ESCO_ONLY'
        ? p.isEscoCertified
        : !p.isEscoCertified;

    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;

    return matchesSearch && matchesEsco && matchesCategory;
  });

  const openEditModal = (p: AdminProductItem) => {
    setEditingProduct(p);
    setEditPrice(p.price);
    setEditStock(p.stock);
    setEditEsco(p.isEscoCertified);
    setEditEnergyRating(p.energyRating);
  };

  const saveProductChanges = () => {
    if (!editingProduct) return;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            price: editPrice,
            stock: editStock,
            isEscoCertified: editEsco,
            energyRating: editEnergyRating,
            updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          };
        }
        return p;
      })
    );
    setEditingProduct(null);
  };

  const quickStockAdjust = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStock = Math.max(0, p.stock + delta);
          return { ...p, stock: nextStock };
        }
        return p;
      })
    );
  };

  const toggleEscoInline = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextEsco = !p.isEscoCertified;
          return {
            ...p,
            isEscoCertified: nextEsco,
            energyRating: nextEsco ? 'A+' : 'STANDARD'
          };
        }
        return p;
      })
    );
  };

  const formatUnit = (unit: MeasurementUnit) => {
    switch (unit) {
      case 'BAG_50KG':
        return '50 kg qop';
      case 'TON':
        return 'tonna';
      case 'SQ_METER':
        return 'm²';
      case 'CUBIC_METER':
        return 'm³';
      case 'PIECE':
        return 'dona';
      default:
        return unit;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 brushed-steel p-4 rounded-2xl border border-[#33373B]">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#FFB800]" />
            <h1 className="text-xl font-black uppercase tracking-wider text-[#F5F5F2]">
              Tovar Katalogi &amp; Qoldiq Boshqaruvi
            </h1>
          </div>
          <p className="text-xs text-[#B8B8B3] font-mono mt-0.5">
            Real-vaqt narxlar, ombor zaxiralari va ESCO sertifikatlari boshqaruvi
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#8E9094]">Jami tovarlar:</span>
          <span className="text-[#FFB800] font-bold bg-[#FFB800]/10 px-2 py-1 rounded-lg border border-[#FFB800]/20">
            {products.length} ta SKU
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto flex-1">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#8E9094] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tovar nomi, SKU yoki ta'minotchi..."
              className="w-full bg-[#1A1D20] border border-[#33373B] rounded-xl pl-10 pr-4 py-2 text-sm text-[#F5F5F2] placeholder-[#8E9094] focus:outline-none focus:border-[#FFB800]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#1A1D20] border border-[#33373B] rounded-xl px-3 py-2 text-xs font-medium text-[#F5F5F2] focus:outline-none focus:border-[#FFB800]"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'Barcha Kategoriyalar' : c}
              </option>
            ))}
          </select>
        </div>

        {/* ESCO Filter Toggle */}
        <div className="flex items-center gap-1.5 self-start lg:self-auto">
          {(
            [
              { id: 'ALL', label: 'Barchasi' },
              { id: 'ESCO_ONLY', label: '⚡ ESCO Sertifikatlangan' },
              { id: 'STANDARD', label: 'Standart' }
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setEscoFilter(t.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                escoFilter === t.id
                  ? 'bg-[#FFB800] text-[#151719] border-[#FFB800]'
                  : 'bg-[#1A1D20] text-[#B8B8B3] border-[#33373B] hover:text-[#F5F5F2]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Table */}
      <Card className="p-0 overflow-hidden border-[#33373B] bg-[#1A1D20]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#33373B] bg-[#151719] text-[11px] font-mono uppercase tracking-wider text-[#B8B8B3]">
                <th className="py-3 px-4">Mahsulot & SKU</th>
                <th className="py-3 px-4">Ta'minotchi</th>
                <th className="py-3 px-4 text-right">Narxi (UZS)</th>
                <th className="py-3 px-4 text-center">Birlik</th>
                <th className="py-3 px-4 text-center">Ombor Qoldig'i</th>
                <th className="py-3 px-4 text-center">ESCO / Reyting</th>
                <th className="py-3 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#33373B]/60 text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#8E9094] font-mono text-xs">
                    Hech qanday mahsulot topilmadi
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#222528]/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#F5F5F2] hover:text-[#FFB800] transition-colors">
                        {p.title}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-mono text-[#8E9094]">SKU:</span>
                        <span className="text-[11px] font-mono font-bold text-[#B8B8B3] bg-[#292C2F] px-1.5 py-0.2 rounded">
                          {p.sku}
                        </span>
                        <span className="text-[10px] text-[#8E9094]">
                          {p.category}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs font-medium text-[#F5F5F2] max-w-[200px] truncate">
                        {p.supplierName}
                      </div>
                      <div className="text-[10px] text-[#8E9094] font-mono">
                        Min. buyurtma: {p.minOrder} {formatUnit(p.unit)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 text-sm">
                      {p.price.toLocaleString('uz-UZ')} UZS
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="text-xs font-mono text-[#B8B8B3] bg-[#292C2F] px-2 py-0.5 rounded border border-[#33373B]">
                        {formatUnit(p.unit)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => quickStockAdjust(p.id, -10)}
                          title="Kamaytirish (-10)"
                          className="w-6 h-6 rounded bg-[#292C2F] hover:bg-[#33373B] text-[#B8B8B3] hover:text-[#F5F5F2] flex items-center justify-center transition-colors text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold text-xs px-2 min-w-16 text-center text-[#F5F5F2]">
                          {p.stock.toLocaleString('uz-UZ')}
                        </span>
                        <button
                          onClick={() => quickStockAdjust(p.id, 10)}
                          title="Oshirish (+10)"
                          className="w-6 h-6 rounded bg-[#292C2F] hover:bg-[#33373B] text-[#B8B8B3] hover:text-[#F5F5F2] flex items-center justify-center transition-colors text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleEscoInline(p.id)}
                        title="ESCO holatini o'zgartirish"
                        className="cursor-pointer transition-transform hover:scale-105"
                      >
                        {p.isEscoCertified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <Zap className="w-3 h-3 fill-emerald-400" />
                            ESCO {p.energyRating}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-[#8E9094] bg-[#292C2F] border border-[#33373B]">
                            Standart
                          </span>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openEditModal(p)}
                        className="h-8 text-xs"
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        Tahrirlash
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#1A1D20] border border-[#33373B] rounded-2xl max-w-md w-full p-6 text-[#F5F5F2] shadow-2xl relative">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 text-[#8E9094] hover:text-[#F5F5F2] p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Package className="w-5 h-5 text-[#FFB800]" />
              <h3 className="font-bold text-lg">Mahsulotni Tahrirlash</h3>
            </div>
            <p className="text-xs text-[#8E9094] font-mono mb-4">
              {editingProduct.title} ({editingProduct.sku})
            </p>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-mono text-[#B8B8B3] mb-1">
                  Narx ({formatUnit(editingProduct.unit)} uchun, UZS) *
                </label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="w-full bg-[#151719] border border-[#33373B] rounded-xl px-3.5 py-2 text-sm font-mono text-emerald-400 font-bold focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#B8B8B3] mb-1">
                  Ombordagi qoldiq zaxirasi ({formatUnit(editingProduct.unit)}) *
                </label>
                <input
                  type="number"
                  value={editStock}
                  onChange={(e) => setEditStock(Number(e.target.value))}
                  className="w-full bg-[#151719] border border-[#33373B] rounded-xl px-3.5 py-2 text-sm font-mono text-[#F5F5F2] font-bold focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              {/* ESCO toggle in modal */}
              <div className="p-3 bg-[#151719] rounded-xl border border-[#33373B] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#F5F5F2] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      ESCO Energiya Samaradorligi
                    </div>
                    <div className="text-[11px] text-[#8E9094]">
                      Davlat standartlari bo'yicha subsidiya va sertifikat
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={editEsco}
                    onChange={(e) => setEditEsco(e.target.checked)}
                    className="w-5 h-5 accent-[#FFB800] rounded cursor-pointer"
                  />
                </div>

                {editEsco && (
                  <div>
                    <label className="block text-xs font-mono text-[#B8B8B3] mb-1">
                      Energiya reytingi (Energy Rating)
                    </label>
                    <select
                      value={editEnergyRating}
                      onChange={(e) => setEditEnergyRating(e.target.value as EnergyRating)}
                      className="w-full bg-[#222528] border border-[#33373B] rounded-lg px-3 py-1.5 text-xs font-mono text-[#F5F5F2] focus:outline-none focus:border-[#FFB800]"
                    >
                      <option value="A++">A++ (Maksimal tejovchi)</option>
                      <option value="A+">A+ (Yuqori daraja)</option>
                      <option value="A">A (Standart tejamkor)</option>
                      <option value="B">B (O'rtacha daraja)</option>
                      <option value="STANDARD">STANDARD</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-1/2"
                  onClick={() => setEditingProduct(null)}
                >
                  Bekor qilish
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="w-1/2"
                  onClick={saveProductChanges}
                >
                  Saqlash
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
