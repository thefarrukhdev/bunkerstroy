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
  Sparkles,
  ChevronRight,
  MapPin,
  Tag
} from 'lucide-react';
import { Product } from '@bunkerstroy/types';
import { Skeleton } from '@bunkerstroy/ui';

/* ==========================================================================
   Types & Color Options Palette (BunkerStroy Industrial Standard)
   ========================================================================== */

export interface ColorOption {
  id: string;
  label: string;
  bg: string;
  border: string;
  text: string;
}

export const COLOR_OPTIONS: ColorOption[] = [
  { id: 'oq', label: 'Oq', bg: '#FFFFFF', border: '#cbd5e1', text: '#0f172a' },
  { id: 'kulrang', label: 'Kulrang', bg: '#64748b', border: '#475569', text: '#ffffff' },
  { id: 'qora', label: 'Qora', bg: '#0f172a', border: '#334155', text: '#ffffff' },
  { id: 'qizil', label: 'Qizil / G‘isht', bg: '#dc2626', border: '#ef4444', text: '#ffffff' },
  { id: 'jigarrang', label: 'Jigarrang', bg: '#78350f', border: '#92400e', text: '#ffffff' },
  { id: 'kok', label: 'Ko‘k / Moviy', bg: '#2563eb', border: '#3b82f6', text: '#ffffff' },
  { id: 'yashil', label: 'Yashil', bg: '#16a34a', border: '#22c55e', text: '#ffffff' },
  { id: 'sariq', label: 'Sariq', bg: '#eab308', border: '#facc15', text: '#0f172a' },
  { id: 'bej', label: 'Bej / Qum', bg: '#d4b996', border: '#bfa07a', text: '#0f172a' },
  { id: 'metall', label: 'Metall / Kumush', bg: '#94a3b8', border: '#cbd5e1', text: '#0f172a' }
];

interface MarketplaceViewProps {
  onAddToCart: (product: Product, quantity?: number) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onAddToCart }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
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
    fetch('/api/catalog/categories')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data);
        }
      })
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  // Fetch products on filter changes
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

      const res = await fetch(`/api/catalog/products?${params.toString()}`);
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

  // Filter products locally by selected color if active
  const filteredProducts = useMemo(() => {
    if (!selectedColor) return products;
    return products.filter((p) => {
      // Check variants
      if (p.variants && p.variants.length > 0) {
        const matchesVariant = p.variants.some(
          (v) => v.color && v.color.toLowerCase().includes(selectedColor.toLowerCase())
        );
        if (matchesVariant) return true;
      }
      // Check title and description
      const text = `${p.title} ${p.description || ''}`.toLowerCase();
      const col = COLOR_OPTIONS.find((c) => c.id === selectedColor);
      if (col && text.includes(col.label.toLowerCase().split('/')[0].trim())) {
        return true;
      }
      return false;
    });
  }, [products, selectedColor]);

  // Unit formatter
  const formatUnit = (unit: string): string => {
    switch (unit) {
      case 'TON':
        return 'tonna';
      case 'SQ_METER':
        return 'm²';
      case 'BAG_50KG':
        return 'qop (50kg)';
      case 'BAG_25KG':
        return 'qop (25kg)';
      case 'PIECE':
        return 'dona';
      default:
        return unit?.toLowerCase() || 'dona';
    }
  };

  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="space-y-6 text-white pb-12 font-sans">
      {/* 1. Welcoming Industrial Banner (Brushed Steel & Rivets) */}
      <div className="relative brushed-steel rounded-2xl p-5 sm:p-7 shadow-[0_8px_24px_rgba(7,19,38,0.5)] border border-[#1E3A6D] overflow-hidden">
        <div className="absolute top-2 left-2 industrial-rivet" />
        <div className="absolute top-2 right-2 industrial-rivet" />
        <div className="absolute bottom-2 left-2 industrial-rivet" />
        <div className="absolute bottom-2 right-2 industrial-rivet" />

        {/* Subtle background tech grid */}
        <div className="absolute inset-0 tech-grid-pattern opacity-40 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#FFB800] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FFB800] animate-ping" />
                BunkerStroy Sanoat Vitrinasi
              </span>
              <span className="bg-[#132C54] text-[#FFB800] border border-[#254B85] px-2.5 py-0.5 rounded-md text-[10px] font-mono font-black">
                ZAVOD NARXLARIDA
              </span>
              <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-black flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#FFB800]" /> 50/50 Xavfsiz Escrow
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white">
              Sifatli Qurilish Materiallari &amp; Xom-ashyo Bozori
            </h1>
            <p className="text-xs sm:text-sm text-sky-200/90 max-w-2xl leading-relaxed">
              O‘zbekiston va mintaqaning yetakchi zavodlaridan to‘g‘ridan-to‘g‘ri ulgurji va chakana xaridlar.
              50% avans va 50% ob'ektda qabul qilingandan keyin to‘lash imkoniyati bilan 100% himoyalangan.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 shrink-0 font-mono text-xs">
            <div className="bg-[#071326] border border-[#1E3A6D] px-3 py-1.5 rounded-xl text-sky-200 flex items-center gap-2">
              <span className="text-[#FFB800] font-black">{products.length}</span>
              <span>xil tovar omborda</span>
            </div>
            <div className="bg-[#071326] border border-[#1E3A6D] px-3 py-1.5 rounded-xl text-emerald-400 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>Obyektgacha yetkazib berish</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search & Region Filter Bar */}
      <div className="bg-[#0A1931] border border-[#1E3A6D] p-3 rounded-2xl flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between shadow-md">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 w-4 h-4 text-[#FFB800] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
            placeholder="Mahsulot nomi, markasi, sement, g‘isht yoki zavod bo‘yicha qidiruv..."
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#071326] border border-[#1E3A6D] focus:border-[#FFB800] text-xs sm:text-sm text-white placeholder-sky-300/50 outline-none transition-colors"
          />
        </div>

        {/* Region selector */}
        <div className="w-full sm:w-56 shrink-0">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-[#071326] border border-[#1E3A6D] focus:border-[#FFB800] text-xs font-mono text-sky-100 outline-none cursor-pointer"
          >
            <option value="all">Barcha viloyatlar</option>
            <option value="Toshkent shahri">Toshkent shahri</option>
            <option value="Toshkent viloyati">Toshkent viloyati</option>
            <option value="Samarqand viloyati">Samarqand viloyati</option>
            <option value="Farg‘ona viloyati">Farg‘ona viloyati</option>
            <option value="Andijon viloyati">Andijon viloyati</option>
            <option value="Namangan viloyati">Namangan viloyati</option>
            <option value="Buxoro viloyati">Buxoro viloyati</option>
            <option value="Qashqadaryo viloyati">Qashqadaryo viloyati</option>
            <option value="Surxondaryo viloyati">Surxondaryo viloyati</option>
            <option value="Xorazm viloyati">Xorazm viloyati</option>
            <option value="Navoiy viloyati">Navoiy viloyati</option>
          </select>
        </div>
      </div>

      {/* 3. Horizontal Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-2 rounded-xl border font-bold transition-all whitespace-nowrap cursor-pointer shadow-xs ${
            selectedCategory === 'all'
              ? 'bg-[#FFB800] text-[#071326] border-[#FFC928]'
              : 'bg-[#0A1931] text-sky-200 border-[#1E3A6D] hover:border-[#2E5A9C] hover:text-white'
          }`}
        >
          Barcha toifalar
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.slug || cat.id)}
            className={`px-3.5 py-2 rounded-xl border font-semibold transition-all whitespace-nowrap cursor-pointer shadow-xs ${
              selectedCategory === cat.slug || selectedCategory === cat.id
                ? 'bg-[#FFB800] text-[#071326] border-[#FFC928] font-black'
                : 'bg-[#0A1931] text-sky-200 border-[#1E3A6D] hover:border-[#2E5A9C] hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 4. COLOR_OPTIONS Palette Filter Bar */}
      <div className="bg-[#0A1931] border border-[#1E3A6D] p-3 rounded-2xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-[#FFB800] uppercase tracking-wider">
              Ranglar Bo‘yicha Filtr (Palette):
            </span>
            {selectedColor && (
              <span className="text-[10px] font-mono bg-[#132C54] text-sky-200 px-2 py-0.5 rounded">
                Tanlangan: {COLOR_OPTIONS.find((c) => c.id === selectedColor)?.label}
              </span>
            )}
          </div>
          {selectedColor && (
            <button
              type="button"
              onClick={() => setSelectedColor(null)}
              className="text-[10px] font-mono text-[#FFB800] hover:underline cursor-pointer"
            >
              Rang filtrini tozalash
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedColor(null)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
              selectedColor === null
                ? 'bg-[#132C54] text-white border-[#FFB800]'
                : 'bg-[#071326] text-sky-300 border-[#1E3A6D] hover:border-[#2E5A9C]'
            }`}
          >
            Barchasi
          </button>

          {COLOR_OPTIONS.map((col) => {
            const isSelected = selectedColor === col.id;
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => setSelectedColor(isSelected ? null : col.id)}
                title={col.label}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border shrink-0 ${
                  isSelected
                    ? 'bg-[#132C54] border-[#FFB800] text-white shadow-[0_0_10px_rgba(255,184,0,0.3)] ring-1 ring-[#FFB800]'
                    : 'bg-[#071326] border-[#1E3A6D] text-sky-200 hover:border-[#2E5A9C] hover:text-white'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border shrink-0 shadow-inner"
                  style={{ backgroundColor: col.bg, borderColor: col.border }}
                />
                <span className="text-[11px]">{col.label.split('/')[0].trim()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Products Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="industrial-card rounded-2xl p-4 space-y-3 bg-[#0A1931]">
              <Skeleton variant="rect" height={190} className="rounded-xl bg-[#0F2547]" />
              <Skeleton variant="text" width="40%" className="bg-[#0F2547]" />
              <Skeleton variant="text" width="80%" className="bg-[#0F2547]" />
              <Skeleton variant="text" width="60%" className="bg-[#0F2547]" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="industrial-card rounded-2xl p-12 text-center space-y-4 bg-[#0A1931]">
          <div className="w-14 h-14 rounded-2xl bg-[#0F2547] border border-[#1E3A6D] flex items-center justify-center mx-auto text-[#FFB800]">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="font-heading font-black text-lg text-white">
            Materiallar topilmadi
          </h3>
          <p className="text-xs text-sky-200/80 max-w-sm mx-auto">
            Qidiruv so‘zini o‘zgartirib ko‘ring yoki toifalar va rang filtrini tozalang.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedRegion('all');
              setSelectedColor(null);
            }}
            className="btn-industrial-dark px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
          >
            Barcha filtrlarni tozalash
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((p) => {
            const priceNum = Number(p.price);

            // Extract variant colors or assign standard preview colors
            const variantColors = p.variants?.map((v) => v.color).filter(Boolean) || [];

            return (
              <div
                key={p.id}
                onClick={() => navigate(`/products/${p.id}`)}
                className="industrial-card group relative rounded-2xl p-4 flex flex-col justify-between border border-[#1E3A6D] hover:border-[#2E5A9C] bg-[#0A1931] shadow-lg cursor-pointer select-none transition-all duration-200"
              >
                {/* Corner Industrial Rivets */}
                <div className="absolute top-2.5 left-2.5 industrial-rivet opacity-70" />
                <div className="absolute top-2.5 right-2.5 industrial-rivet opacity-70" />

                <div>
                  {/* Product Image Box */}
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[#071326] border border-[#1E3A6D] mb-3 group-hover:border-[#2E5A9C] transition-colors">
                    <img
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800'}
                      alt={p.title}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Stock badge */}
                    <div className="absolute bottom-2.5 right-2.5 bg-[#071326]/90 backdrop-blur-md px-2.5 py-0.5 rounded text-[10px] font-mono font-bold text-sky-200 border border-[#1E3A6D] shadow-sm">
                      {p.stock > 0 ? `${p.stock} ${formatUnit(p.unit)}` : 'Zaxira tugagan'}
                    </div>

                    {/* 50/50 Escrow Pill on Image */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#071326]/90 backdrop-blur-md border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-400 shadow-xs">
                      <ShieldCheck className="w-3 h-3 text-[#FFB800]" />
                      <span>50/50 Escrow</span>
                    </div>
                  </div>

                  {/* Supplier & Delivery Badges */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-sky-300/80 mb-1.5">
                    <span className="truncate max-w-[170px] text-sky-200 font-semibold flex items-center gap-1">
                      <Factory className="w-3 h-3 text-[#FFB800] shrink-0" />
                      {p.supplierName || 'Rasmiy Ishlab chiqaruvchi'}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {p.hasDelivery && (
                        <span className="text-emerald-400 font-bold flex items-center gap-0.5 text-[10px]">
                          <Truck className="w-3 h-3" /> Yetkazish bor
                        </span>
                      )}
                      <span className="text-sky-600">•</span>
                      <span className="text-emerald-400 font-bold text-[10px]">12% QQS</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-black text-white text-base line-clamp-2 group-hover:text-[#FFB800] transition-colors leading-snug">
                    {p.title}
                  </h3>

                  {/* Variants / Color Swatches Preview if available */}
                  {variantColors.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[10px] font-mono text-sky-400">Ranglar:</span>
                      <div className="flex items-center gap-1">
                        {variantColors.slice(0, 5).map((cName, idx) => {
                          const opt = COLOR_OPTIONS.find((c) =>
                            cName?.toLowerCase().includes(c.id) || cName?.toLowerCase().includes(c.label.toLowerCase())
                          );
                          return (
                            <span
                              key={idx}
                              title={cName || ''}
                              className="w-3 h-3 rounded-full border border-sky-400/50"
                              style={{ backgroundColor: opt?.bg || '#64748b' }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Price & Action Row */}
                <div className="pt-3 mt-3 border-t border-[#1E3A6D] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-sky-400/80 block">
                      Zavod Narxi:
                    </span>
                    <p className="text-lg font-heading font-black text-[#FFB800] leading-tight font-mono-numbers">
                      {priceNum.toLocaleString()}{' '}
                      <span className="text-xs font-sans font-normal text-sky-200">
                        so‘m / {formatUnit(p.unit)}
                      </span>
                    </p>
                    {p.tieredPrices && p.tieredPrices.length > 0 && (
                      <span className="text-[10px] font-mono font-bold text-[#FFB800] bg-[#132C54] border border-[#254B85] px-1.5 py-0.5 rounded mt-0.5 inline-block">
                        Ulgurji: {Number(p.tieredPrices[p.tieredPrices.length - 1].price).toLocaleString()} so‘mdan
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleAdd(e, p)}
                    className="btn-industrial-yellow px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md select-none"
                  >
                    {addedId === p.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-800 stroke-[3]" />
                        <span>Savatda</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span className="hidden sm:inline">Savatga</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
