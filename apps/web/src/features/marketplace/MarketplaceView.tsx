import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Sparkles,
  ShoppingCart,
  Check,
  LayoutGrid,
  Table as TableIcon,
  Truck,
  FileSpreadsheet,
  Plus,
  Minus,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Product } from '@bunkerstroy/types';
import {
  Button,
  Badge,
  Input,
  Select,
  Alert,
  Skeleton,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty
} from '@bunkerstroy/ui';

interface MarketplaceViewProps {
  onAddToCart: (product: Product, quantity?: number) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onAddToCart }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [escoOnly, setEscoOnly] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  // Dual-mode view: Visual Cards vs Smeta Matrix Table
  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');
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
    if (text.includes('sement')) return 'GOST 31108-2020';
    if (text.includes('armatura')) return 'GOST 5781-82';
    if (text.includes('bazalt') || text.includes('izolyatsiya')) return 'GOST 9573-2012';
    if (text.includes('beton')) return 'GOST 7473-2010';
    if (text.includes('g\'isht') || text.includes('gisht')) return 'GOST 530-2012';
    return 'GOST 30244-94';
  };

  // Unit formatter
  const formatUnit = (unit: string): string => {
    switch (unit) {
      case 'TON':
        return 'tonna';
      case 'SQ_METER':
        return 'm²';
      case 'BAG_50KG':
        return 'qop (50kg)';
      case 'PIECE':
        return 'dona';
      default:
        return unit.toLowerCase();
    }
  };

  // Tiered wholesale pricing calculation
  const getTieredPrice = (basePrice: number, quantity: number): number => {
    if (quantity >= 50) return Math.round(basePrice * 0.90);
    if (quantity >= 10) return Math.round(basePrice * 0.95);
    return basePrice;
  };

  const handleAdd = (e: React.MouseEvent, product: Product, qty: number = 1) => {
    e.stopPropagation();
    onAddToCart(product, qty);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleMatrixQtyChange = (productId: string, val: number) => {
    setMatrixQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, isNaN(val) ? 1 : val)
    }));
  };

  const handleBatchAddMatrix = () => {
    let count = 0;
    products.forEach((p) => {
      const qty = matrixQuantities[p.id] || 0;
      if (qty > 0) {
        onAddToCart(p, qty);
        count++;
      }
    });

    if (count > 0) {
      setBatchSuccessNotice(true);
      setTimeout(() => setBatchSuccessNotice(false), 3000);
    }
  };

  const totalMatrixSum = products.reduce((sum, p) => {
    const qty = matrixQuantities[p.id] || 0;
    const unitPrice = getTieredPrice(Number(p.price), qty);
    return sum + unitPrice * qty;
  }, 0);

  return (
    <div className="space-y-6">
      {/* 1. Clean Minimalist Header */}
      <div className="bg-white border border-bunker-border-strong rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="mb-1.5">
            <span className="text-xs font-mono font-bold text-bunker-amber-500 uppercase tracking-wider">
              B2B Sanoat Xaridlari
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight text-bunker-text-primary">
            Sanoat Qurilish Materiallari &amp; Smeta
          </h1>
          <p className="text-xs sm:text-sm text-bunker-text-secondary mt-1 max-w-2xl">
            Zavod ulgurji narxlari, 12% QQS hisoblangan, GOST laboratoriya kafolati va to‘g‘ridan-to‘g‘ri ob'ektga yetkazish.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 font-mono text-xs">
          <Badge variant="neutral" size="sm" isMono>
            {products.length} ta mahsulot
          </Badge>
          <span className="text-bunker-border-strong">|</span>
          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold text-[11px]">
            QQS 12% Kiritilgan
          </span>
        </div>
      </div>

      {/* 2. Clean Command Filter Bar */}
      <div className="bg-white border border-bunker-border-strong p-3 rounded-xl flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between shadow-xs">
        {/* Search input */}
        <div className="w-full sm:flex-1 sm:min-w-[200px]">
          <Input
            leftIcon={<Search className="w-4 h-4 text-bunker-amber-500" />}
            placeholder="Mahsulot nomi yoki markasi bo'yicha qidiruv..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
            sizeVariant="sm"
          />
        </div>

        {/* Region selector & ESCO filter */}
        <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
          <div className="flex-1 sm:w-40 sm:flex-initial">
            <Select
              sizeVariant="sm"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="all">Barcha hududlar</option>
              <option value="Toshkent shahri">Toshkent shahri</option>
              <option value="Toshkent viloyati">Toshkent viloyati</option>
              <option value="Samarqand viloyati">Samarqand viloyati</option>
            </Select>
          </div>

          <button
            type="button"
            onClick={() => setEscoOnly(!escoOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
              escoOnly
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-bunker-border-strong text-bunker-text-secondary hover:text-bunker-text-primary'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden xs:inline">Faqat </span><span>ESCO</span>
          </button>

          {/* DUAL-MODE VIEW TOGGLE */}
          <div className="bg-slate-100 p-0.5 rounded-xl border border-bunker-border-strong flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-bunker-amber-500 shadow-xs border border-bunker-border-strong'
                  : 'text-bunker-text-secondary hover:text-bunker-text-primary'
              }`}
              title="Kartochkalar"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kartochkalar</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-white text-bunker-amber-500 shadow-xs border border-bunker-border-strong'
                  : 'text-bunker-text-secondary hover:text-bunker-text-primary'
              }`}
              title="Smeta Matritsasi"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Matritsa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Batch notice alert */}
      {batchSuccessNotice && (
        <Alert
          variant="success"
          title="Smeta Savatga Biriktirildi"
          description="Matritsadagi tovarlar xarid savatiga muvaffaqiyatli qo‘shildi."
          onDismiss={() => setBatchSuccessNotice(false)}
        />
      )}

      {/* 3. Products Rendering */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-bunker-border-strong rounded-2xl p-4 space-y-4 shadow-xs">
              <Skeleton variant="rect" height={190} className="rounded-xl" />
              <div className="space-y-2">
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="85%" height={24} />
              </div>
              <div className="pt-3 border-t border-bunker-border-subtle flex justify-between items-center">
                <Skeleton variant="text" width="35%" />
                <Skeleton variant="rect" width={90} height={34} className="rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-bunker-text-muted font-mono bg-white border border-bunker-border-strong rounded-2xl">
          So‘rovingiz bo‘yicha tovarlar topilmadi.
        </div>
      ) : viewMode === 'cards' ? (
        /* MODE A: MINIMALIST B2B CARDS */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => {
            const gost = getGostStandard(p);
            const priceNum = Number(p.price);

            return (
              <div
                key={p.id}
                onClick={() => navigate(`/products/${p.id}`)}
                className="bg-white border border-bunker-border-strong rounded-2xl p-4 flex flex-col justify-between hover:border-bunker-amber-500 hover:shadow-md transition-all group cursor-pointer"
              >
                <div>
                  {/* Clean Visual Image with Fallback */}
                  <div className="relative h-44 sm:h-48 rounded-xl overflow-hidden bg-slate-100 border border-bunker-border-subtle mb-3">
                    <img
                      src={p.images[0] || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800'}
                      alt={p.title}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800';
                      }}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />

                    {/* Single Minimal Standard Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="bg-white/95 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-bold text-slate-800 border border-slate-200 shadow-xs">
                        {gost}
                      </span>
                      {p.isEscoCertified && (
                        <span className="bg-emerald-500/90 text-white backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-bold shadow-xs">
                          ESCO
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Supplier & QQS label */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-bunker-text-muted mb-1">
                    <span className="truncate max-w-[180px]">{p.supplierName}</span>
                    <span className="text-emerald-700 font-bold shrink-0">12% QQS</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-bunker-text-primary text-base line-clamp-1 group-hover:text-bunker-amber-500 transition-colors">
                    {p.title}
                  </h3>
                </div>

                {/* Clean Bottom Price & Action Row */}
                <div className="pt-3.5 mt-3 border-t border-bunker-border-subtle flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-bunker-text-muted block">
                      Ulgurji narxi:
                    </span>
                    <p className="text-lg font-heading font-extrabold text-bunker-text-primary leading-tight">
                      {priceNum.toLocaleString()}{' '}
                      <span className="text-xs font-sans font-normal text-bunker-text-muted">
                        so'm / {formatUnit(p.unit)}
                      </span>
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant={addedId === p.id ? 'secondary' : 'primary'}
                    onClick={(e) => handleAdd(e, p)}
                    className="font-mono text-xs px-3"
                  >
                    {addedId === p.id ? (
                      <Check className="w-4 h-4 text-bunker-status-green" />
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 sm:mr-1.5" />
                        <span className="hidden sm:inline">Savatga</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* MODE B: PROCUREMENT SMETA MATRIX (Compact Industrial Table) */
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mahsulot &amp; GOST</TableHead>
                <TableHead>Birligi</TableHead>
                <TableHead className="text-center">1-9 dona</TableHead>
                <TableHead className="text-center text-bunker-amber-500">10-49 (-5%)</TableHead>
                <TableHead className="text-center text-emerald-700">50+ (-10%)</TableHead>
                <TableHead className="text-center">Hajm</TableHead>
                <TableHead className="text-right">Jami</TableHead>
                <TableHead className="text-right">Amal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableEmpty colSpan={8} title="Mahsulot topilmadi" />
              ) : (
                products.map((p) => {
                  const gost = getGostStandard(p);
                  const priceNum = Number(p.price);
                  const qty = matrixQuantities[p.id] || p.minOrder || 1;
                  const calculatedUnitPrice = getTieredPrice(priceNum, qty);
                  const rowTotal = calculatedUnitPrice * qty;

                  return (
                    <TableRow key={p.id}>
                      {/* Name and standard */}
                      <TableCell>
                        <Link
                          to={`/products/${p.id}`}
                          className="font-bold text-bunker-text-primary hover:text-bunker-amber-500 transition-colors block"
                        >
                          {p.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono">
                          <span className="text-bunker-amber-500 font-semibold">{gost}</span>
                          <span className="text-bunker-border-strong">|</span>
                          <span className="text-bunker-text-muted">{p.supplierName}</span>
                        </div>
                      </TableCell>

                      {/* Unit */}
                      <TableCell>
                        <span className="font-mono text-xs text-bunker-text-secondary">{formatUnit(p.unit)}</span>
                      </TableCell>

                      {/* Tier 1 */}
                      <TableCell className="text-center font-mono text-xs">
                        {priceNum.toLocaleString()} so'm
                      </TableCell>

                      {/* Tier 2 */}
                      <TableCell className="text-center text-bunker-amber-500 font-bold font-mono text-xs bg-orange-50/50">
                        {getTieredPrice(priceNum, 15).toLocaleString()} so'm
                      </TableCell>

                      {/* Tier 3 */}
                      <TableCell className="text-center text-emerald-700 font-bold font-mono text-xs bg-emerald-50/50">
                        {getTieredPrice(priceNum, 55).toLocaleString()} so'm
                      </TableCell>

                      {/* Quantity input */}
                      <TableCell className="text-center">
                        <div className="inline-flex items-center gap-1 bg-white border border-bunker-border-strong rounded-lg p-0.5 shadow-xs">
                          <button
                            type="button"
                            onClick={() => handleMatrixQtyChange(p.id, qty - 1)}
                            className="p-1 text-bunker-text-secondary hover:text-bunker-text-primary hover:bg-slate-100 rounded cursor-pointer transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={p.stock}
                            value={qty}
                            onChange={(e) => handleMatrixQtyChange(p.id, parseInt(e.target.value, 10))}
                            className="w-14 bg-transparent text-center font-bold text-bunker-text-primary outline-none text-xs font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => handleMatrixQtyChange(p.id, qty + 1)}
                            className="p-1 text-bunker-text-secondary hover:text-bunker-text-primary hover:bg-slate-100 rounded cursor-pointer transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </TableCell>

                      {/* Row total */}
                      <TableCell className="text-right font-extrabold text-bunker-amber-500 text-xs font-mono">
                        {rowTotal.toLocaleString()} so'm
                      </TableCell>

                      {/* Action */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/products/${p.id}`}
                            className="p-1.5 rounded-lg border border-bunker-border-strong hover:border-bunker-amber-500 text-bunker-text-secondary hover:text-bunker-text-primary text-xs transition-colors"
                            title="Batafsil ko'rish"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <Button
                            size="sm"
                            variant={addedId === p.id ? 'secondary' : 'primary'}
                            onClick={(e) => handleAdd(e, p, qty)}
                          >
                            {addedId === p.id ? (
                              <Check className="w-3.5 h-3.5 text-bunker-status-green" />
                            ) : (
                              <ShoppingCart className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Matrix Smeta Summary Bottom Bar */}
          <div className="bg-white border border-bunker-border-strong rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs font-mono">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4 text-bunker-amber-500" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-bunker-text-primary uppercase">
                  Smeta Matritsasi:
                </h4>
                <p className="text-[11px] text-bunker-text-muted">
                  {products.length} ta mahsulot | 12% QQS kiritilgan
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-bunker-text-muted uppercase block">Jami:</span>
                <p className="text-lg font-extrabold text-bunker-amber-500">
                  {totalMatrixSum.toLocaleString()} <span className="text-xs text-bunker-text-primary font-normal">so'm</span>
                </p>
              </div>

              <Button
                size="sm"
                variant="primary"
                onClick={handleBatchAddMatrix}
                className="w-full sm:w-auto justify-center"
              >
                <ShoppingCart className="w-4 h-4 mr-1.5" />
                <span>Smetani Savatga Biriktirish</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
