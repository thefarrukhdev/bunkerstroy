import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  ShoppingCart,
  Check,
  ShieldCheck,
  Truck,
  Factory,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
  Package,
  Plus,
  Minus,
  ExternalLink,
  Award,
  Layers,
  PhoneCall
} from 'lucide-react';
import { Product } from '@bunkerstroy/types';
import { Badge, Button, B2BBadge } from '@bunkerstroy/ui';

export interface ProductPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenCart?: () => void;
  onViewFullPage?: (id: string) => void;
}

export const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
  onOpenCart,
  onViewFullPage
}) => {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedVariantIdx, setSelectedVariantIdx] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setActiveImgIdx(0);
      setSelectedVariantIdx(0);
      const minQty = Math.max(1, product.minOrder || 1);
      setQuantity(minQty);
      setIsAdded(false);
      setIsVideoModalOpen(false);

      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      } else {
        setSelectedColor('');
      }
    }
  }, [product]);

  // Keyboard navigation for escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isVideoModalOpen) {
          setIsVideoModalOpen(false);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, isVideoModalOpen, onClose]);

  if (!isOpen || !product) return null;

  const galleryImages =
    product.images && product.images.length > 0 ? product.images : [product.image];
  const variants =
    product.variants && product.variants.length > 0 ? product.variants : [];
  const activeVariant = variants[selectedVariantIdx];

  const currentPrice = activeVariant?.price ?? product.price;
  const currentUnit = activeVariant?.unit ?? product.unit ?? 'dona';
  const currentStock = typeof product.stock === 'number' ? product.stock : 0;
  const isOutOfStock = currentStock <= 0;

  // Wholesale tiered pricing calculation if applicable
  const effectivePrice = useMemo(() => {
    if (product.tieredPrices && product.tieredPrices.length > 0) {
      const match = product.tieredPrices.find(
        (t) => quantity >= (t.minQty || t.minQuantity || 1)
      );
      if (match) return match.price;
    }
    return currentPrice;
  }, [product, quantity, currentPrice]);

  const totalPrice = effectivePrice * quantity;

  const handleStepQty = (delta: number) => {
    setQuantity((prev) => {
      const next = prev + delta;
      const minLimit = Math.max(1, product.minOrder || 1);
      if (next < minLimit) return minLimit;
      if (currentStock > 0 && next > currentStock) return currentStock;
      return next;
    });
  };

  const handleAddToCartClick = () => {
    if (isOutOfStock) return;
    const customized: Product = {
      ...product,
      title: selectedColor ? `${product.title} (${selectedColor})` : product.title
    };
    onAddToCart(customized, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const formatPrice = (val: number | string): string => {
    const n = typeof val === 'number' ? val : Number(val) || 0;
    return n.toLocaleString();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-slate-900 transition-all"
      >
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-heading font-black text-sm sm:text-base text-slate-900 truncate">
              {product.title}
            </span>
            {(product.isB2B !== false && (product.isB2B || product.supplierCabinetType === 'manufacturer' || product.tieredPrices?.length)) && (
              <B2BBadge />
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onViewFullPage && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewFullPage(product.id);
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                title="Mahsulotning to‘liq sahifasiga o‘tish"
              >
                <span>Batafsil sahifa</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
              aria-label="Yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Two Column Responsive Grid */}
        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Column 1: Gallery & Visual Showcase */}
          <div className="space-y-3">
            {/* Main Stage Image */}
            <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shadow-2xs group">
              <img
                src={galleryImages[activeImgIdx] || product.image}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Gallery Image Index Pill */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs border border-slate-200 text-[10px] font-mono font-bold text-slate-700 shadow-2xs">
                  {activeImgIdx + 1} / {galleryImages.length}
                </div>
              )}

              {/* Video Play Trigger if video is present */}
              {product.videoUrl && (
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-[#D95D1E] hover:bg-[#B43B06] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Videoni ko‘rish</span>
                </button>
              )}

              {/* Stock status indicator */}
              <div className="absolute top-2.5 right-2.5">
                {isOutOfStock ? (
                  <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-mono font-bold uppercase shadow-2xs">
                    Tugagan
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs border border-emerald-300 text-emerald-700 text-[10px] font-mono font-bold shadow-2xs">
                    Omborda: {currentStock} {currentUnit}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImgIdx(idx)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      activeImgIdx === idx
                        ? 'border-[#D95D1E] ring-2 ring-orange-200 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.title}-${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Manufacturer & Dispatcher Badges */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span className="flex items-center gap-1.5 truncate">
                  <Factory className="w-4 h-4 text-[#D95D1E] shrink-0" />
                  <span className="truncate">{product.supplierName || 'Rasmiy Ishlab chiqaruvchi'}</span>
                </span>
                <span className="flex items-center gap-1 text-slate-500 font-mono text-[11px] shrink-0">
                  <MapPin className="w-3 h-3 text-[#D95D1E]" />
                  {product.region || 'O‘zbekiston'}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60 text-[11px] font-mono text-slate-600">
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                  50/50 Xavfsiz Escrow
                </span>
                {product.hasDelivery && (
                  <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded font-bold">
                    Yetkazib berish mavjud
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Specs, Variants, Stepper & Cart Action */}
          <div className="flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              
              {/* Title & Description */}
              <div>
                <h2 id="preview-modal-title" className="font-heading font-black text-xl text-slate-900 leading-tight">
                  {product.title}
                </h2>
                {product.description && (
                  <p className="text-xs text-slate-600 line-clamp-3 mt-1.5 leading-relaxed font-sans">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Variants / Fraction / Size Selection */}
              {variants.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                    Variant / O‘lcham:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v, vIdx) => (
                      <button
                        key={vIdx}
                        type="button"
                        onClick={() => setSelectedVariantIdx(vIdx)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                          selectedVariantIdx === vIdx
                            ? 'bg-orange-50 border-[#D95D1E] text-[#D95D1E] ring-1 ring-orange-300'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {v.specification || v.size || `${v.price} so‘m`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Swatches */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 uppercase tracking-wider font-mono">
                      Mavjud ranglar:
                    </span>
                    {selectedColor && (
                      <span className="font-mono text-slate-500 font-semibold">
                        Tanlandi: <strong className="text-slate-900">{selectedColor}</strong>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {product.colors.map((c, cIdx) => (
                      <button
                        key={cIdx}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
                          selectedColor === c
                            ? 'bg-[#D95D1E] text-white border-[#D95D1E] shadow-2xs font-bold'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Ladder (Tiered Pricing) */}
              {product.tieredPrices && product.tieredPrices.length > 0 && (
                <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/80 space-y-1.5 font-mono">
                  <div className="text-[11px] font-black uppercase text-[#D95D1E] tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Hajmiy ulgurji narxlar:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {product.tieredPrices.map((tier, tIdx) => {
                      const minQ = tier.minQty || tier.minQuantity || 1;
                      const isActiveTier = quantity >= minQ;
                      return (
                        <div
                          key={tIdx}
                          className={`p-2 rounded-lg border transition-all ${
                            isActiveTier
                              ? 'bg-white border-[#D95D1E] text-[#D95D1E] font-bold shadow-2xs'
                              : 'bg-white/60 border-orange-200 text-slate-600'
                          }`}
                        >
                          <div>≥ {minQ} {currentUnit}</div>
                          <div className="text-sm font-black mt-0.5">{formatPrice(tier.price)} so‘m</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  Buyurtma miqdori ({currentUnit}):
                </label>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      type="button"
                      onClick={() => handleStepQty(-1)}
                      disabled={quantity <= Math.max(1, product.minOrder || 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min={Math.max(1, product.minOrder || 1)}
                      max={currentStock > 0 ? currentStock : undefined}
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) {
                          const minL = Math.max(1, product.minOrder || 1);
                          setQuantity(Math.max(minL, currentStock > 0 ? Math.min(val, currentStock) : val));
                        }
                      }}
                      className="w-16 text-center font-mono font-bold text-sm bg-transparent border-none focus:outline-none text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleStepQty(1)}
                      disabled={currentStock > 0 && quantity >= currentStock}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-xs font-mono text-slate-500">
                    Min. partiya: {product.minOrder || 1} {currentUnit}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Total & Cart Button */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">
                    Jami hisob:
                  </span>
                  <div className="text-2xl font-heading font-black text-[#D95D1E] font-mono-numbers">
                    {formatPrice(totalPrice)}{' '}
                    <span className="text-xs font-sans font-normal text-slate-600">so‘m</span>
                  </div>
                </div>

                <div className="text-right text-[11px] font-mono text-slate-500">
                  {formatPrice(effectivePrice)} so‘m / {currentUnit}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Button
                  variant="primary"
                  size="md"
                  disabled={isOutOfStock}
                  onClick={handleAddToCartClick}
                  className="w-full justify-center"
                  leftIcon={
                    isAdded ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <ShoppingCart className="w-4 h-4" />
                    )
                  }
                >
                  {isOutOfStock
                    ? 'Zaxira tugagan'
                    : isAdded
                    ? '✓ Savatga qo‘shildi'
                    : 'Savatga qo‘shish'}
                </Button>

                {onOpenCart && (
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => {
                      onClose();
                      onOpenCart();
                    }}
                    className="w-full justify-center"
                  >
                    Savatni ochish
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Video Player Modal (if open) */}
        {isVideoModalOpen && product.videoUrl && (
          <div
            role="dialog"
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl"
            >
              <div className="p-3 border-b border-slate-800 flex items-center justify-between text-white">
                <span className="font-heading font-bold text-sm truncate">
                  {product.title} — Video lavha
                </span>
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={product.videoUrl}
                  title={product.title}
                  className="w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
