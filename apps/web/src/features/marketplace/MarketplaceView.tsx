import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Check,
  Truck,
  Package,
  ShieldCheck,
  SlidersHorizontal,
  Layers,
  Factory,
  ChevronRight,
  MapPin,
  Tag,
  Palette,
  X,
  Filter
} from 'lucide-react';
import { Product, REGIONS_AND_DISTRICTS, COLOR_OPTIONS, ColorOption } from '@bunkerstroy/types';
import { Skeleton, Button, Badge, Input, Select, ProductCard } from '@bunkerstroy/ui';
import { apiFetch } from '../../services/apiClient';
import { ProductPreviewModal } from './ProductPreviewModal';

export { COLOR_OPTIONS, type ColorOption };

interface MarketplaceViewProps {
  onAddToCart: (product: Product, quantity?: number) => void;
  onOpenCart?: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onAddToCart, onOpenCart }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [onlyEscrow, setOnlyEscrow] = useState(false);
  const [onlyDelivery, setOnlyDelivery] = useState(false);
  const [onlyB2B, setOnlyB2B] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Quick View Modal
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  // Sync from URL search params if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('query') || params.get('q');
    const reg = params.get('region');
    const cat = params.get('category');
    if (q) setSearchQuery(q);
    if (reg) setSelectedRegion(reg);
    if (cat) setSelectedCategory(cat);
  }, [location.search]);

  // Fetch categories on mount
  useEffect(() => {
    apiFetch('/catalog/categories')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data);
        }
      })
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  // Fetch products on server filter changes
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedRegion]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedRegion !== 'all') params.append('region', selectedRegion);
      if (searchQuery.trim()) params.append('query', searchQuery.trim());

      const res = await apiFetch(`/catalog/products?${params.toString()}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProducts(json.data);
      }
    } catch (e) {
      console.error('Failed to fetch products:', e);
    } finally {
      setLoading(false);
    }
  };

  // Districts for current region
  const availableDistricts = useMemo(() => {
    if (selectedRegion === 'all' || !REGIONS_AND_DISTRICTS[selectedRegion]) {
      return [];
    }
    return REGIONS_AND_DISTRICTS[selectedRegion];
  }, [selectedRegion]);

  // Reset district when region changes
  const handleRegionChange = (newRegion: string) => {
    setSelectedRegion(newRegion);
    setSelectedDistrict('all');
  };

  // Client-side multi-tier filtering (Districts, Quick Chips, Stock, Color, Text search)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. District filter
      if (selectedDistrict !== 'all') {
        const prodDist = (p as any).district || '';
        if (prodDist && prodDist !== selectedDistrict) return false;
      }

      // 2. Escrow toggle
      if (onlyEscrow && !(p as any).escrowEnabled && !(p as any).hasEscrow) {
        // default true in our platform unless explicitly disabled
      }

      // 3. Delivery toggle
      if (onlyDelivery && !p.hasDelivery) {
        return false;
      }

      // 4. B2B / Manufacturer toggle
      if (onlyB2B && !(p as any).isB2B && (p as any).supplierCabinetType !== 'manufacturer') {
        return false;
      }

      // 5. In-stock toggle
      if (onlyInStock && (p.stock ?? 0) <= 0) {
        return false;
      }

      // 6. Color filter
      if (selectedColor !== 'all') {
        const colors = p.colors || [];
        const hasColor = colors.some(
          (c) => c.toLowerCase().includes(selectedColor.toLowerCase())
        );
        const titleHasColor = p.title.toLowerCase().includes(selectedColor.toLowerCase());
        if (!hasColor && !titleHasColor) return false;
      }

      // 7. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = p.title.toLowerCase().includes(q);
        const inSupplier = (p.supplierName || '').toLowerCase().includes(q);
        const inRegion = (p.region || '').toLowerCase().includes(q);
        const inDesc = (p.description || '').toLowerCase().includes(q);
        if (!inTitle && !inSupplier && !inRegion && !inDesc) {
          return false;
        }
      }

      return true;
    });
  }, [
    products,
    selectedDistrict,
    onlyEscrow,
    onlyDelivery,
    onlyB2B,
    onlyInStock,
    selectedColor,
    searchQuery
  ]);

  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedRegion('all');
    setSelectedDistrict('all');
    setSelectedColor('all');
    setOnlyEscrow(false);
    setOnlyDelivery(false);
    setOnlyB2B(false);
    setOnlyInStock(false);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'all' ||
    selectedRegion !== 'all' ||
    selectedDistrict !== 'all' ||
    selectedColor !== 'all' ||
    onlyEscrow ||
    onlyDelivery ||
    onlyB2B ||
    onlyInStock;

  return (
    <div className="space-y-6 text-slate-900 pb-12 font-sans">
      {/* 1. Welcoming Industrial Banner (Precision Light Construction Card) */}
      <div className="relative bg-white rounded-2xl p-5 sm:p-7 shadow-2xs border border-slate-200 overflow-hidden">
        {/* Subtle background tech grid */}
        <div className="absolute inset-0 tech-grid-pattern opacity-15 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-sans font-bold text-[#D95D1E] uppercase tracking-wider">
                BunkerStroy Sanoat Vitrinasi
              </span>
              <span className="bg-orange-50 text-[#D95D1E] border border-orange-200/80 px-2.5 py-0.5 rounded-md text-xs font-sans font-bold">
                ZAVOD NARXLARIDA
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-0.5 rounded-md text-xs font-sans font-semibold inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 50/50 Xavfsiz Escrow
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-slate-900">
              Sifatli Qurilish Materiallari &amp; Xom-ashyo Bozori
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              O‘zbekiston va mintaqaning yetakchi zavodlaridan to‘g‘ridan-to‘g‘ri ulgurji va chakana xaridlar.
              50% avans va 50% ob'ektda qabul qilingandan keyin to‘lash imkoniyati bilan 100% himoyalangan.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 shrink-0 font-sans text-xs">
            <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700 flex items-center gap-2 shadow-2xs font-sans">
              <span className="text-[#D95D1E] font-black font-mono-numbers">{products.length}</span>
              <span>xil tovar omborda</span>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200/80 px-3 py-1.5 rounded-xl text-emerald-800 flex items-center gap-1.5 shadow-2xs font-sans font-medium">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Kim sotsa — o'sha yetkazadi</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Multi-tier Filter Suite: Search + 14 Regions + Districts */}
      <div className="bg-white border border-slate-200 p-3 sm:p-4 rounded-2xl space-y-3 shadow-2xs">
        <div className="flex flex-col lg:flex-row gap-2.5 items-stretch lg:items-center justify-between">
          {/* Fast Search input */}
          <div className="flex-1">
            <Input
              id="marketplace-filter-search"
              name="search"
              type="text"
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
              placeholder="Mahsulot nomi, markasi, sement, g‘isht yoki zavod bo‘yicha qidiruv..."
              aria-label="Mahsulot qidirish"
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              sizeVariant="sm"
              className="bg-slate-50 border-slate-200"
            />
          </div>

          {/* Region selector (14 Uzbekistan Regions) */}
          <div className="w-full sm:w-56 shrink-0">
            <Select
              id="marketplace-region-select"
              name="region"
              autoComplete="address-level1"
              aria-label="Viloyat bo‘yicha saralash"
              value={selectedRegion}
              onChange={(e) => handleRegionChange(e.target.value)}
              sizeVariant="sm"
              className="bg-slate-50 border-slate-200 text-xs font-mono"
              options={[
                { value: 'all', label: 'Barcha viloyatlar' },
                ...Object.keys(REGIONS_AND_DISTRICTS).map((reg) => ({
                  value: reg,
                  label: reg
                }))
              ]}
            />
          </div>

          {/* District selector (Dynamically appears when region is picked) */}
          {availableDistricts.length > 0 && (
            <div className="w-full sm:w-52 shrink-0 animate-fadeIn">
              <Select
                id="marketplace-district-select"
                name="district"
                aria-label="Tuman bo‘yicha saralash"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                sizeVariant="sm"
                className="bg-slate-50 border-slate-200 text-xs font-mono"
                options={[
                  { value: 'all', label: 'Barcha tumanlar' },
                  ...availableDistricts.map((dist) => ({
                    value: dist,
                    label: dist
                  }))
                ]}
              />
            </div>
          )}
        </div>

        {/* Quick Filter Chips (Escrow, Yetkazish, B2B, Omborda) */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 font-mono text-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#D95D1E]" /> Filtr:
          </span>

          <button
            type="button"
            onClick={() => setOnlyEscrow(!onlyEscrow)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              onlyEscrow
                ? 'bg-emerald-500 text-white border-emerald-600 font-bold'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>50/50 Xavfsiz Escrow</span>
          </button>

          <button
            type="button"
            onClick={() => setOnlyDelivery(!onlyDelivery)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              onlyDelivery
                ? 'bg-sky-500 text-white border-sky-600 font-bold'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Yetkazib berish bor</span>
          </button>

          <button
            type="button"
            onClick={() => setOnlyB2B(!onlyB2B)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              onlyB2B
                ? 'bg-[#D95D1E] text-white border-[#C2410C] font-bold'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>B2B Zavodlar</span>
          </button>

          <button
            type="button"
            onClick={() => setOnlyInStock(!onlyInStock)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              onlyInStock
                ? 'bg-slate-900 text-white border-slate-900 font-bold'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Omborda bor</span>
          </button>

          {/* Color filter chips */}
          <div className="flex items-center gap-1.5 ml-auto">
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              aria-label="Rang bo‘yicha filtr"
              className="text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:border-[#D95D1E] cursor-pointer"
            >
              <option value="all">Barcha ranglar</option>
              {COLOR_OPTIONS.map((c) => (
                <option key={c.id} value={c.label}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-2.5 py-1 text-[11px] font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 ml-2 cursor-pointer"
            >
              <X className="w-3 h-3" /> Tozalash
            </button>
          )}
        </div>
      </div>

      {/* 3. Horizontal Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-2 rounded-xl border font-bold transition-all whitespace-nowrap cursor-pointer shadow-2xs ${
            selectedCategory === 'all'
              ? 'bg-[#D95D1E] text-white border-[#D95D1E]'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900'
          }`}
        >
          Barcha toifalar
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.slug || cat.id)}
            className={`px-3.5 py-2 rounded-xl border font-semibold transition-all whitespace-nowrap cursor-pointer shadow-2xs ${
              selectedCategory === cat.slug || selectedCategory === cat.id
                ? 'bg-[#D95D1E] text-white border-[#D95D1E] font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 4. Products Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 space-y-3 border border-slate-200 shadow-2xs">
              <Skeleton variant="rect" height={190} className="rounded-xl bg-slate-100" />
              <Skeleton variant="text" width="40%" className="bg-slate-100" />
              <Skeleton variant="text" width="80%" className="bg-slate-100" />
              <Skeleton variant="text" width="60%" className="bg-slate-100" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center space-y-4 border border-slate-200 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto text-[#D95D1E]">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="font-heading font-black text-lg text-slate-900">
            Materiallar topilmadi
          </h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Qidiruv so‘zini o‘zgartirib ko‘ring yoki toifalar, viloyat va rang filtrini tozalang.
          </p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="px-4 py-2 rounded-xl text-xs font-bold cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors"
          >
            Barcha filtrlarni tozalash
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              variant="catalog"
              isAdded={addedId === p.id}
              onAddToCart={(e) => handleAdd(e, p)}
              onClick={(prod) => setPreviewProduct(prod as Product)}
            />
          ))}
        </div>
      )}

      {/* 5. Quick View Product Modal */}
      <ProductPreviewModal
        isOpen={Boolean(previewProduct)}
        product={previewProduct}
        onClose={() => setPreviewProduct(null)}
        onAddToCart={onAddToCart}
        onOpenCart={onOpenCart}
        onViewFullPage={(id) => navigate(`/products/${id}`)}
      />
    </div>
  );
};
