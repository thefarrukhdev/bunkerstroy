import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  ShoppingCart,
  Check,
  LayoutGrid,
  Table,
  Truck,
  ShieldCheck,
  FileSpreadsheet,
  Plus,
  Minus,
  CheckCircle2,
  Percent,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { Product } from '@bunkerstroy/types';
import { Button, Badge, Card } from '@bunkerstroy/ui';

interface MarketplaceViewProps {
  onAddToCart: (product: Product, quantity?: number) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onAddToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [escoOnly, setEscoOnly] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  // Dual-mode view: Visual Spec Cards vs Procurement Smeta Matrix
  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');
  // Fast volume entry state for Procurement Smeta Matrix
  const [matrixQuantities, setMatrixQuantities] = useState<Record<string, number>>({});
  const [batchSuccessNotice, setBatchSuccessNotice] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedRegion, escoOnly]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedRegion !== 'all') params.append('region', selectedRegion);
      if (escoOnly) params.append('isEscoOnly', 'true');
      if (searchQuery) params.append('query', searchQuery);

      const res = await fetch(`/api/catalog/products?${params.toString()}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProducts(json.data);
        // Initialize default matrix quantities
        const initQtys: Record<string, number> = {};
        json.data.forEach((p: Product) => {
          initQtys[p.id] = p.minOrder || 1;
        });
        setMatrixQuantities(initQtys);
      }
    } catch (e) {
      console.error('Failed to fetch products:', e);
    } finally {
      setLoading(false);
    }
  };

  // Helper for GOST standards
  const getGostStandard = (p: Product): string => {
    const text = (p.title + ' ' + p.description).toLowerCase();
    if (text.includes('sement')) return 'GOST 31108-2020 (M500 D0)';
    if (text.includes('armatura')) return 'GOST 5781-82 / A500C';
    if (text.includes('bazalt') || text.includes('izolyatsiya')) return 'GOST 9573-2012 / O‘zDSt 2826';
    if (text.includes('beton')) return 'GOST 7473-2010 (B25)';
    if (text.includes('g\'isht') || text.includes('gisht')) return 'GOST 530-2012 (M150)';
    return 'GOST 30244-94 / ISO 9001';
  };

  // Helper for recommended logistics transport
  const getRecommendedVehicle = (p: Product): { name: string; capacity: string } => {
    const text = (p.title + ' ' + p.description).toLowerCase();
    if (text.includes('sement') || p.unit === 'TON') {
      return { name: 'HOWO 25t Samosval', capacity: '25 tonnagacha' };
    }
    if (text.includes('armatura') || text.includes('metall')) {
      return { name: 'Isuzu 10t Manipulyator', capacity: '10t bort + 4.5t kran' };
    }
    if (text.includes('beton')) {
      return { name: 'Shacman 10m³ Mikser', capacity: '10 m³ suyuq beton' };
    }
    return { name: 'TIR 35t Fura', capacity: '35 tonna / 86 m³' };
  };

  // Tiered wholesale pricing calculation
  const getTieredPrice = (basePrice: number, quantity: number): number => {
    if (quantity >= 50) return Math.round(basePrice * 0.90); // 10% corporate discount
    if (quantity >= 10) return Math.round(basePrice * 0.95); // 5% bulk discount
    return basePrice;
  };

  const handleAdd = (product: Product, qty: number = 1) => {
    for (let i = 0; i < qty; i++) {
      onAddToCart(product);
    }
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  // Matrix quantity updater
  const handleMatrixQtyChange = (productId: string, val: number) => {
    setMatrixQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, isNaN(val) ? 1 : val)
    }));
  };

  // Batch add all products from Smeta Matrix
  const handleBatchAddMatrix = () => {
    let count = 0;
    products.forEach((p) => {
      const qty = matrixQuantities[p.id] || 0;
      if (qty > 0) {
        for (let i = 0; i < qty; i++) {
          onAddToCart(p);
        }
        count++;
      }
    });

    if (count > 0) {
      setBatchSuccessNotice(true);
      setTimeout(() => setBatchSuccessNotice(false), 3000);
    }
  };

  // Total calculation for Smeta Matrix
  const totalMatrixSum = products.reduce((sum, p) => {
    const qty = matrixQuantities[p.id] || 0;
    const unitPrice = getTieredPrice(Number(p.price), qty);
    return sum + unitPrice * qty;
  }, 0);

  return (
    <div className="space-y-6">
      {/* 1. Industrial Tactical Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-bunker-border-strong bg-gradient-to-r from-bunker-surface-1 via-bunker-surface-2 to-[#2E2412] p-6 sm:p-10 shadow-2xl">
        <div className="h-1.5 w-full hazard-stripe-sm absolute top-0 left-0" />
        <div className="max-w-3xl space-y-3">
          <Badge variant="warning" className="gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            BunkerStroy B2B Ulgurji Xaridlar Tizimi
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-bunker-text-primary">
            Sanoat Ob'ektlari Uchun Kafolatlangan Materiallar & Smeta Matritsasi
          </h1>
          <p className="text-sm text-bunker-text-secondary leading-relaxed">
            Qizilqum Sement M500, Bekobod A500C armaturasi va energiya tejamkor bazalt plitalarini to‘g‘ridan-to‘g‘ri
            zavod ulgurji narxlarida xarid qiling. QQS 12% hisoblangan, GOST sertifikatlangan va HOWO maxsus parki bilan yetkaziladi.
          </p>
        </div>
      </div>

      {/* 2. Command Filter Bar & Dual-Mode Toggle */}
      <div className="bg-bunker-surface-1 border border-bunker-border-subtle p-4 rounded-2xl flex flex-wrap gap-3 items-center justify-between">
        {/* Search input */}
        <div className="flex items-center gap-2 flex-1 min-w-[240px] bg-bunker-input border border-bunker-border-subtle focus-within:border-bunker-amber-500 rounded-xl px-3 py-2 transition-colors">
          <Search className="w-4 h-4 text-bunker-text-muted" />
          <input
            type="text"
            placeholder="Mahsulot nomi, GOST yoki markasi bo'yicha qidiruv..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
            className="w-full bg-transparent text-sm text-bunker-text-primary outline-none placeholder-bunker-text-muted"
          />
        </div>

        {/* Region selector & ESCO filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-bunker-surface-2 border border-bunker-border-subtle text-xs font-semibold text-bunker-text-primary rounded-xl px-3 py-2.5 outline-none cursor-pointer focus:border-bunker-amber-500"
          >
            <option value="all">Barcha hududlar</option>
            <option value="Toshkent shahri">Toshkent shahri</option>
            <option value="Toshkent viloyati">Toshkent viloyati</option>
            <option value="Samarqand viloyati">Samarqand viloyati</option>
          </select>

          <button
            onClick={() => setEscoOnly(!escoOnly)}
            className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              escoOnly
                ? 'bg-bunker-status-green/20 border-bunker-status-green text-bunker-status-green'
                : 'bg-bunker-surface-2 border-bunker-border-subtle text-bunker-text-secondary hover:text-bunker-text-primary'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Faqat ESCO</span>
          </button>

          {/* DUAL-MODE VIEW TOGGLE */}
          <div className="bg-bunker-surface-2 p-1 rounded-xl border border-bunker-border-subtle flex items-center gap-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-bunker-amber-500 text-bunker-vault shadow-sm'
                  : 'text-bunker-text-secondary hover:text-bunker-text-primary'
              }`}
              title="Vizual Texnik Kartochkalar"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kartochkalar</span>
            </button>

            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-bunker-amber-500 text-bunker-vault shadow-sm'
                  : 'text-bunker-text-secondary hover:text-bunker-text-primary'
              }`}
              title="Smeta Matritsasi (B2B Jadval Rejimi)"
            >
              <Table className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Smeta Matritsasi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Batch notice alert */}
      {batchSuccessNotice && (
        <div className="bg-bunker-status-green/20 border border-bunker-status-green text-bunker-status-green p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-mono animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Smeta matritsasidagi barcha tanlangan tovarlar xarid savatiga muvaffaqiyatli qo‘shildi!</span>
        </div>
      )}

      {/* 3. Products Rendering */}
      {loading ? (
        <div className="text-center py-20 text-bunker-text-secondary font-mono text-sm">
          BunkerStroy katalogi yuklanmoqda...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-bunker-text-muted">
          So‘rovingiz bo‘yicha tovarlar topilmadi.
        </div>
      ) : viewMode === 'cards' ? (
        /* MODE A: VISUAL SPEC CARDS */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => {
            const gost = getGostStandard(p);
            const vehicle = getRecommendedVehicle(p);
            const priceNum = Number(p.price);

            return (
              <Card
                key={p.id}
                className="flex flex-col justify-between hover:border-bunker-amber-500/60 transition-all group shadow-md"
              >
                <div className="space-y-3">
                  {/* Image & Badges */}
                  <div className="relative h-44 rounded-xl overflow-hidden bg-bunker-surface-2 border border-bunker-border-subtle">
                    <img
                      src={p.images[0] || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800'}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      {p.isEscoCertified && (
                        <Badge variant="success">ESCO {p.energyEfficiencyRating}</Badge>
                      )}
                      <span className="bg-bunker-vault/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-bold text-bunker-amber-500 border border-bunker-border-strong">
                        {gost}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 bg-bunker-vault/80 backdrop-blur-md px-2 py-1 rounded text-[11px] font-mono text-bunker-text-primary border border-bunker-border-subtle">
                      Omborda: <strong>{p.stock}</strong> {p.unit}
                    </div>
                  </div>

                  {/* Info Header */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-bunker-amber-500 uppercase font-semibold">{p.supplierName}</span>
                      <span className="text-bunker-status-green font-bold">QQS 12% kiritilgan</span>
                    </div>
                    <h3 className="font-bold text-bunker-text-primary text-base line-clamp-1 group-hover:text-bunker-amber-500 transition-colors mt-0.5">
                      {p.title}
                    </h3>
                    <p className="text-xs text-bunker-text-secondary mt-1 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* Tiered Wholesale Pricing Matrix Chips */}
                  <div className="bg-bunker-base p-2.5 rounded-xl border border-bunker-border-subtle space-y-1.5 text-[11px] font-mono">
                    <span className="text-[10px] uppercase text-bunker-text-muted block font-bold">
                      Ulgurji Narxlar Pog'onasi:
                    </span>
                    <div className="grid grid-cols-3 gap-1 text-center">
                      <div className="bg-bunker-surface-1 p-1 rounded border border-bunker-border-subtle">
                        <span className="text-[9px] text-bunker-text-muted block">1-10 dona/t</span>
                        <span className="font-bold text-bunker-text-primary">{priceNum.toLocaleString()}</span>
                      </div>
                      <div className="bg-bunker-surface-1 p-1 rounded border border-bunker-border-subtle">
                        <span className="text-[9px] text-bunker-amber-500 block">10-50 t (-5%)</span>
                        <span className="font-bold text-bunker-amber-500">{getTieredPrice(priceNum, 15).toLocaleString()}</span>
                      </div>
                      <div className="bg-bunker-surface-1 p-1 rounded border border-bunker-border-subtle">
                        <span className="text-[9px] text-bunker-status-green block">&gt;50 t (-10%)</span>
                        <span className="font-bold text-bunker-status-green">{getTieredPrice(priceNum, 55).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Vehicle */}
                  <div className="flex items-center gap-2 text-[11px] font-mono text-bunker-text-secondary bg-bunker-surface-2 px-2.5 py-1.5 rounded-lg border border-bunker-border-subtle">
                    <Truck className="w-3.5 h-3.5 text-bunker-amber-500 shrink-0" />
                    <span className="truncate">Tavsiya: <strong className="text-bunker-text-primary">{vehicle.name}</strong></span>
                  </div>
                </div>

                {/* Card Action & Price */}
                <div className="pt-4 mt-4 border-t border-bunker-border-subtle flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-bunker-text-muted">Baza ulgurji narxi:</span>
                    <p className="text-lg font-black text-bunker-amber-500 font-mono">
                      {priceNum.toLocaleString()} <span className="text-xs text-bunker-text-primary">so'm</span>
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant={addedId === p.id ? 'secondary' : 'primary'}
                    onClick={() => handleAdd(p)}
                  >
                    {addedId === p.id ? (
                      <>
                        <Check className="w-4 h-4 text-bunker-status-green mr-1" />
                        <span>Qo'shildi</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        <span>Savatga</span>
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* MODE B: PROCUREMENT SMETA MATRIX (Compact Excel-like Table) */
        <div className="space-y-4">
          <div className="bg-bunker-surface-1 border border-bunker-border-strong rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-bunker-surface-2 border-b border-bunker-border-strong text-bunker-text-secondary uppercase text-[10px] tracking-wider select-none">
                    <th className="py-3.5 px-4 font-bold">Mahsulot & Standart</th>
                    <th className="py-3.5 px-3 font-bold">Ombor & Birligi</th>
                    <th className="py-3.5 px-3 font-bold">Transport Tavsiyasi</th>
                    <th className="py-3.5 px-3 font-bold text-center">1-10 t (Baza)</th>
                    <th className="py-3.5 px-3 font-bold text-center text-bunker-amber-500">10-50 t (-5%)</th>
                    <th className="py-3.5 px-3 font-bold text-center text-bunker-status-green">&gt;50 t (-10%)</th>
                    <th className="py-3.5 px-3 font-bold text-center">Buyurtma Hajmi</th>
                    <th className="py-3.5 px-3 font-bold text-right">Qator Jami (QQS 12%)</th>
                    <th className="py-3.5 px-4 font-bold text-right">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bunker-border-subtle">
                  {products.map((p) => {
                    const gost = getGostStandard(p);
                    const vehicle = getRecommendedVehicle(p);
                    const priceNum = Number(p.price);
                    const qty = matrixQuantities[p.id] || p.minOrder || 1;
                    const calculatedUnitPrice = getTieredPrice(priceNum, qty);
                    const rowTotal = calculatedUnitPrice * qty;

                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-bunker-surface-hover/60 transition-colors group"
                      >
                        {/* Name and standard */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-bunker-text-primary group-hover:text-bunker-amber-500 transition-colors">
                            {p.title}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                            <span className="text-bunker-amber-500">{gost}</span>
                            <span className="text-bunker-border-strong">|</span>
                            <span className="text-bunker-text-muted">{p.supplierName}</span>
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="font-bold text-bunker-text-primary">{p.stock.toLocaleString()}</span>{' '}
                          <span className="text-bunker-text-muted">{p.unit}</span>
                        </td>

                        {/* Transport */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-bunker-text-secondary text-[11px]">
                            <Truck className="w-3.5 h-3.5 text-bunker-amber-500 shrink-0" />
                            <span>{vehicle.name}</span>
                          </div>
                        </td>

                        {/* Tier 1 */}
                        <td className="py-3 px-3 text-center text-bunker-text-primary whitespace-nowrap">
                          {priceNum.toLocaleString()} so'm
                        </td>

                        {/* Tier 2 */}
                        <td className="py-3 px-3 text-center text-bunker-amber-500 font-bold whitespace-nowrap bg-bunker-amber-500/5">
                          {getTieredPrice(priceNum, 20).toLocaleString()} so'm
                        </td>

                        {/* Tier 3 */}
                        <td className="py-3 px-3 text-center text-bunker-status-green font-bold whitespace-nowrap bg-bunker-status-green/5">
                          {getTieredPrice(priceNum, 60).toLocaleString()} so'm
                        </td>

                        {/* Quantity input */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1 bg-bunker-input border border-bunker-border-strong rounded-xl p-1">
                            <button
                              onClick={() => handleMatrixQtyChange(p.id, qty - 1)}
                              className="p-1 text-bunker-text-secondary hover:text-bunker-text-primary hover:bg-bunker-surface-2 rounded cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <input
                              type="number"
                              min="1"
                              max={p.stock}
                              value={qty}
                              onChange={(e) => handleMatrixQtyChange(p.id, parseInt(e.target.value, 10))}
                              className="w-14 bg-transparent text-center font-bold text-bunker-text-primary outline-none text-xs"
                            />
                            <button
                              onClick={() => handleMatrixQtyChange(p.id, qty + 1)}
                              className="p-1 text-bunker-text-secondary hover:text-bunker-text-primary hover:bg-bunker-surface-2 rounded cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        {/* Row total */}
                        <td className="py-3 px-3 text-right whitespace-nowrap font-bold text-bunker-amber-500 text-sm">
                          {rowTotal.toLocaleString()} so'm
                        </td>

                        {/* Action */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <Button
                            size="sm"
                            variant={addedId === p.id ? 'secondary' : 'primary'}
                            onClick={() => handleAdd(p, qty)}
                          >
                            {addedId === p.id ? (
                              <Check className="w-3.5 h-3.5 text-bunker-status-green" />
                            ) : (
                              <ShoppingCart className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Matrix Smeta Summary Bottom Bar */}
            <div className="bg-bunker-surface-2 border-t border-bunker-border-strong p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-bunker-amber-500/20 border border-bunker-amber-500/40 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-bunker-amber-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-bunker-text-primary uppercase font-mono">
                    Smeta Matritsasi Jamlanmasi:
                  </h4>
                  <p className="text-[11px] text-bunker-text-secondary font-mono">
                    Jami qatorlar: <strong className="text-bunker-text-primary">{products.length} ta</strong> | B2B Ulgurji
                    Chegirmalar hisoblandi
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-bunker-text-muted uppercase font-mono block">Jami Smeta Qiymati:</span>
                  <p className="text-xl font-black text-bunker-amber-500 font-mono">
                    {totalMatrixSum.toLocaleString()} <span className="text-xs text-bunker-text-primary">so'm</span>
                  </p>
                </div>

                <Button
                  size="md"
                  variant="primary"
                  onClick={handleBatchAddMatrix}
                >
                  <ShoppingCart className="w-4 h-4 mr-1.5" />
                  <span>Smetani Savatga Biriktirish</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
