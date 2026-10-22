import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Check,
  Truck,
  Plus,
  ArrowRight,
  Package
} from 'lucide-react';
import { Product } from '@bunkerstroy/types';
import {
  Button,
  Badge,
  Input,
  Select,
  Skeleton
} from '@bunkerstroy/ui';

interface MarketplaceViewProps {
  onAddToCart: (product: Product, quantity?: number) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onAddToCart }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [addedId, setAddedId] = useState<string | null>(null);

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
        return unit.toLowerCase();
    }
  };

  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Welcoming Marketplace Banner */}
      <div className="bg-white border border-bunker-border-strong rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold text-bunker-amber-500 uppercase tracking-wider">
              Qurilish Mollari Markazi
            </span>
            <Badge variant="success" size="sm" isMono>
              ZAVOD NARXLARIDA
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight text-bunker-text-primary">
            Sifatli Qurilish Materiallari Bozori
          </h1>
          <p className="text-xs sm:text-sm text-bunker-text-secondary mt-1 max-w-2xl">
            Ishlab chiqaruvchi va do‘konlardan to‘g‘ridan-to‘g‘ri xarid qiling. Tovarlar ombordan ob'ektingizgacha yetkazib beriladi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 font-mono text-xs">
          <Badge variant="neutral" size="sm" isMono>
            {products.length} ta mahsulot
          </Badge>
          <span className="text-bunker-border-strong">|</span>
          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold text-[11px] flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" /> Yetkazib berish xizmati
          </span>
        </div>
      </div>

      {/* 2. Search & Region Filter Bar */}
      <div className="bg-white border border-bunker-border-strong p-3 rounded-xl flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between shadow-xs">
        {/* Search input */}
        <div className="w-full sm:flex-1 sm:min-w-[240px]">
          <Input
            leftIcon={<Search className="w-4 h-4 text-bunker-amber-500" />}
            placeholder="Mahsulot nomi, markasi yoki ishlab chiqaruvchi bo‘yicha qidiruv..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
            sizeVariant="sm"
          />
        </div>

        {/* Region selector */}
        <div className="w-full sm:w-48 shrink-0">
          <Select
            sizeVariant="sm"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="all">Barcha viloyatlar</option>
            <option value="Toshkent shahri">Toshkent shahri</option>
            <option value="Toshkent viloyati">Toshkent viloyati</option>
            <option value="Samarqand viloyati">Samarqand viloyati</option>
            <option value="Farg‘ona viloyati">Farg‘ona viloyati</option>
            <option value="Andijon viloyati">Andijon viloyati</option>
            <option value="Namangan viloyati">Namangan viloyati</option>
            <option value="Buxoro viloyati">Buxoro viloyati</option>
          </Select>
        </div>
      </div>

      {/* 3. Horizontal Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl border font-bold transition-all whitespace-nowrap cursor-pointer shadow-xs ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-700 border-bunker-border-strong hover:border-slate-400'
          }`}
        >
          Barcha toifalar
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.slug || cat.id)}
            className={`px-3 py-1.5 rounded-xl border font-medium transition-all whitespace-nowrap cursor-pointer shadow-xs ${
              selectedCategory === cat.slug || selectedCategory === cat.id
                ? 'bg-bunker-amber-500 text-white border-bunker-amber-500 font-bold'
                : 'bg-white text-slate-700 border-bunker-border-strong hover:border-slate-400'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 4. Products Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-bunker-border-strong rounded-2xl p-4 space-y-3">
              <Skeleton variant="rect" height={180} className="rounded-xl" />
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-bunker-border-strong rounded-2xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base text-bunker-text-primary">
            Mahsulotlar topilmadi
          </h3>
          <p className="text-xs text-bunker-text-secondary max-w-sm mx-auto">
            Qidiruv so‘zini o‘zgartirib ko‘ring yoki toifalar bo‘yicha filtrni tozalang.
          </p>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedRegion('all');
            }}
          >
            Filtrni tozalash
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => {
            const priceNum = Number(p.price);

            return (
              <div
                key={p.id}
                onClick={() => navigate(`/products/${p.id}`)}
                className="group bg-white border border-bunker-border-strong hover:border-slate-300 rounded-2xl p-3.5 sm:p-4 transition-all duration-150 flex flex-col justify-between shadow-xs hover:shadow-sm cursor-pointer select-none"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-bunker-border-subtle mb-3">
                    <img
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800'}
                      alt={p.title}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800';
                      }}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />

                    {/* Stock badge */}
                    <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-bold text-slate-800 border border-slate-200 shadow-xs">
                      {p.stock > 0 ? `${p.stock} ${formatUnit(p.unit)}` : 'Zaxira tugagan'}
                    </div>
                  </div>

                  {/* Supplier & Delivery badge */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-bunker-text-muted mb-1">
                    <span className="truncate max-w-[170px] text-slate-700 font-medium">
                      {p.supplierName || 'Do‘kon'}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {p.hasDelivery && (
                        <span className="text-emerald-700 font-bold flex items-center gap-0.5 text-[10px]">
                          <Truck className="w-3 h-3" /> Yetkazish
                        </span>
                      )}
                      <span className="text-slate-300">•</span>
                      <span className="text-emerald-700 font-bold text-[10px]">12% QQS</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-bunker-text-primary text-base line-clamp-2 group-hover:text-bunker-amber-500 transition-colors">
                    {p.title}
                  </h3>
                </div>

                {/* Bottom Price & Action Row */}
                <div className="pt-3 mt-3 border-t border-bunker-border-subtle flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-bunker-text-muted block">
                      Narxi:
                    </span>
                    <p className="text-lg font-heading font-extrabold text-bunker-text-primary leading-tight">
                      {priceNum.toLocaleString()}{' '}
                      <span className="text-xs font-sans font-normal text-bunker-text-muted">
                        so‘m / {formatUnit(p.unit)}
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
      )}
    </div>
  );
};
