import React, { useState, useEffect } from 'react';
import { Search, MapPin, Sparkles, ShoppingCart, Check, Filter } from 'lucide-react';
import { Product } from '@bunkerstroy/types';
import { Button, Badge, Card } from '@bunkerstroy/ui';

interface MarketplaceViewProps {
  onAddToCart: (product: Product) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onAddToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [escoOnly, setEscoOnly] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

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
      if (json.success) {
        setProducts(json.data);
      }
    } catch (e) {
      console.error('Failed to fetch products:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (product: Product) => {
    onAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-[#33373B] bg-gradient-to-r from-[#1E2226] via-[#1A1D20] to-[#292215] p-6 sm:p-10 shadow-2xl">
        <div className="h-1.5 w-full hazard-stripe-sm absolute top-0 left-0" />
        <div className="max-w-3xl space-y-3">
          <Badge variant="warning" className="gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            BunkerStroy B2B Qurilish Mollari & Omborlar
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#F5F5F2]">
            Qurilish ob'ektlari uchun ulgurji narxlar va kafolatlangan zaxira
          </h1>
          <p className="text-sm text-[#B8B8B3] leading-relaxed">
            Sement, armatura, g‘isht va ESCO energiya tejamkor izolyatsiya materiallarini to‘g‘ridan-to‘g‘ri ishlab chiqaruvchilardan buyurtma qiling.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#1A1D20] border border-[#33373B] p-4 rounded-2xl flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] bg-[#151719] border border-[#33373B] rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-[#B8B8B3]" />
          <input
            type="text"
            placeholder="Mahsulot nomi yoki markasi bo'yicha qidiruv..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
            className="w-full bg-transparent text-sm text-[#F5F5F2] outline-none placeholder-[#777A7C]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-[#151719] border border-[#33373B] text-xs font-semibold text-[#F5F5F2] rounded-xl px-3 py-2.5 outline-none cursor-pointer"
          >
            <option value="all">Barcha hududlar</option>
            <option value="Toshkent shahri">Toshkent shahri</option>
            <option value="Toshkent viloyati">Toshkent viloyati</option>
            <option value="Samarqand viloyati">Samarqand viloyati</option>
          </select>

          <button
            onClick={() => setEscoOnly(!escoOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              escoOnly
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                : 'bg-[#151719] border-[#33373B] text-[#B8B8B3] hover:text-[#F5F5F2]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Faqat ESCO</span>
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-20 text-[#B8B8B3] font-mono text-sm">
          Mahsulotlar katalogi yuklanmoqda...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-[#B8B8B3]">
          So‘rovingiz bo‘yicha tovarlar topilmadi.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <Card key={p.id} rivetAccents className="flex flex-col justify-between hover:border-[#FFB800]/50 transition-colors group">
              <div className="space-y-3">
                <div className="relative h-44 rounded-xl overflow-hidden bg-[#222528]">
                  <img
                    src={p.images[0] || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800'}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {p.isEscoCertified && (
                    <div className="absolute top-2.5 left-2.5">
                      <Badge variant="success">ESCO {p.energyEfficiencyRating}</Badge>
                    </div>
                  )}
                  <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[11px] font-mono text-[#F5F5F2]">
                    Omborda: {p.stock} {p.unit}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-mono text-[#FFB800] tracking-wider uppercase">{p.supplierName}</p>
                  <h3 className="font-bold text-[#F5F5F2] text-base line-clamp-1 group-hover:text-[#FFB800] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#B8B8B3] mt-1 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#33373B] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#777A7C]">Ulgurji narx:</span>
                  <p className="text-lg font-black text-[#FFB800] font-mono">
                    {Number(p.price).toLocaleString()} <span className="text-xs text-[#F5F5F2]">so'm</span>
                  </p>
                </div>

                <Button
                  size="sm"
                  variant={addedId === p.id ? 'secondary' : 'primary'}
                  onClick={() => handleAdd(p)}
                >
                  {addedId === p.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Qo'shildi</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Savatga</span>
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
