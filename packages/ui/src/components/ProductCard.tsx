import React from 'react';
import {
  ShoppingCart,
  Check,
  Truck,
  ShieldCheck,
  Factory,
  Plus,
  MapPin
} from 'lucide-react';
import { cn } from '../utils';
import { Badge } from './Badge';
import { Button } from './Button';

export interface ProductCardData {
  id: string;
  title: string;
  price: number | string;
  unit?: string;
  stock?: number;
  images?: string[];
  imageUrl?: string;
  supplierName?: string;
  supplierCabinetType?: 'manufacturer' | 'partner' | string | null;
  isB2B?: boolean;
  region?: string | null;
  hasDelivery?: boolean;
  vatRate?: number | string;
  tieredPrices?: Array<{
    minQty?: number;
    minQuantity?: number;
    price: number | string;
  }>;
  category?: string;
  [key: string]: any;
}

export type ProductCardVariant = 'catalog' | 'pos' | 'compact';

export interface ProductCardProps {
  product: ProductCardData;
  variant?: ProductCardVariant;
  className?: string;
  isAdded?: boolean;
  addedText?: string;
  actionText?: string;
  showEscrowBadge?: boolean;
  showSupplier?: boolean;
  showDelivery?: boolean;
  showVat?: boolean;
  showTieredPrice?: boolean;
  defaultImageFallback?: string;
  formatUnit?: (unit?: string) => string;
  formatPrice?: (price: number | string) => string;
  onAddToCart?: (e: React.MouseEvent<HTMLButtonElement>, product: ProductCardData) => void;
  onClick?: (product: ProductCardData) => void;
}

const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800';

export const defaultFormatUnit = (unit?: string): string => {
  if (!unit) return 'dona';
  switch (unit.toUpperCase()) {
    case 'TON':
      return 'tonna';
    case 'SQ_METER':
    case 'M2':
      return 'm²';
    case 'BAG_50KG':
      return 'qop (50kg)';
    case 'BAG_25KG':
      return 'qop (25kg)';
    case 'PIECE':
    case 'DONA':
      return 'dona';
    default:
      return unit.toLowerCase();
  }
};

export const defaultFormatPrice = (price: number | string): string => {
  const num = typeof price === 'number' ? price : Number(price) || 0;
  return num.toLocaleString();
};

export const B2BBadge: React.FC<{ className?: string }> = ({ className }) => (
  <span
    className={cn(
      'inline-flex items-center justify-center px-2 py-0.5 rounded-md border border-[#E26625]/60 bg-[#FFF6F0] text-[#D95D1E] font-black text-xs leading-none tracking-normal font-sans shadow-2xs select-none',
      className
    )}
  >
    B2B
  </span>
);

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'catalog',
  className,
  isAdded = false,
  addedText = 'Savatda',
  actionText = 'Savatga',
  showEscrowBadge = true,
  showSupplier = true,
  showDelivery = true,
  showVat = true,
  showTieredPrice = true,
  defaultImageFallback = DEFAULT_FALLBACK_IMAGE,
  formatUnit = defaultFormatUnit,
  formatPrice = defaultFormatPrice,
  onAddToCart,
  onClick
}) => {
  const imageSrc =
    product.images?.[0] || product.imageUrl || defaultImageFallback;
  const stockCount = typeof product.stock === 'number' ? product.stock : 0;
  const unitLabel = formatUnit(product.unit);
  const formattedPrice = formatPrice(product.price);

  // Lowest wholesale price from tiered prices (if available)
  const lowestTier =
    product.tieredPrices && product.tieredPrices.length > 0
      ? product.tieredPrices[product.tieredPrices.length - 1]
      : null;
  const lowestTierPrice = lowestTier ? formatPrice(lowestTier.price) : null;

  // Wholesale B2B classification
  const isB2B =
    product.isB2B !== false &&
    (Boolean(product.isB2B) ||
      product.supplierCabinetType === 'manufacturer' ||
      Boolean(product.tieredPrices && product.tieredPrices.length > 0) ||
      Boolean(product.b2bPrice) ||
      Boolean(product.supplierName?.toLowerCase().includes('mchj')) ||
      Boolean(product.supplierName?.toLowerCase().includes('zavod')) ||
      Boolean(product.supplierName?.toLowerCase().includes('servis')) ||
      Boolean(product.supplierName?.toLowerCase().includes('standart')) ||
      Boolean(product.supplierName?.toLowerCase().includes('sanoat')));

  // Handle card level click
  const handleCardClick = () => {
    onClick?.(product);
  };

  // Handle add button click with event isolation
  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onAddToCart?.(e, product);
  };

  // 1. POS VARIANT (Compact grid for cashier, fast counter POS, quick add)
  if (variant === 'pos') {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
        className={cn(
          'industrial-card rounded-xl p-3 bg-white border border-slate-200 hover:border-[#D95D1E] cursor-pointer transition-all flex flex-col justify-between select-none group outline-none focus-visible:ring-2 focus-visible:ring-[#D95D1E]/40',
          className
        )}
      >
        <div>
          <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-50 mb-2 border border-slate-200">
            <img
              src={imageSrc}
              alt={product.title}
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== defaultImageFallback) {
                  target.src = defaultImageFallback;
                }
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <span className="absolute bottom-1 right-1 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-slate-700 border border-slate-200">
              {stockCount > 0 ? `${stockCount} ${unitLabel}` : 'Tugagan'}
            </span>
          </div>

          <h4 className="font-heading font-bold text-slate-900 text-xs line-clamp-2 leading-tight group-hover:text-[#D95D1E] transition-colors">
            {product.title}
          </h4>
        </div>

        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-black text-[#D95D1E] font-mono-numbers">
            {formattedPrice} so‘m
          </span>
          {onAddToCart && (
            <button
              type="button"
              onClick={handleAddClick}
              aria-label={`${product.title}ni kassaga qo‘shish`}
              className="w-6 h-6 rounded bg-[#D95D1E] hover:bg-[#B43B06] active:scale-95 text-white flex items-center justify-center font-black transition-all cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. COMPACT VARIANT (For dashboards, sidebar recommendations, modal previews)
  if (variant === 'compact') {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
        className={cn(
          'group flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#D95D1E]/40',
          className
        )}
      >
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
          <img
            src={imageSrc}
            alt={product.title}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== defaultImageFallback) {
                target.src = defaultImageFallback;
              }
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-heading font-bold text-slate-900 text-xs truncate group-hover:text-[#D95D1E] transition-colors">
            {product.title}
          </h4>
          <p className="text-[11px] font-mono text-slate-500 mt-0.5">
            {stockCount > 0 ? `${stockCount} ${unitLabel}` : 'Zaxira yo‘q'}
          </p>
          <p className="text-xs font-black text-[#D95D1E] font-mono-numbers mt-0.5">
            {formattedPrice} so‘m
          </p>
        </div>

        {onAddToCart && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAddClick}
            className="shrink-0 p-2 min-h-[32px] h-8"
            aria-label={`${product.title}ni savatga qo‘shish`}
          >
            {isAdded ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Plus className="w-3.5 h-3.5" />}
          </Button>
        )}
      </div>
    );
  }

  // 3. CATALOG VARIANT (Flagship B2B Marketplace & Showcase Card)
  return (
    <div
      role="article"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className={cn(
        'group relative rounded-2xl p-4 flex flex-col justify-between border border-slate-200 hover:border-slate-300 bg-white shadow-2xs hover:shadow-md cursor-pointer select-none transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#D95D1E]/40',
        className
      )}
    >
      <div>
        {/* Product Image Box (4:3 aspect ratio) */}
        <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 mb-3 group-hover:border-slate-200 transition-colors">
          <img
            src={imageSrc}
            alt={product.title}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== defaultImageFallback) {
                target.src = defaultImageFallback;
              }
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Stock badge */}
          <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded text-[10px] font-mono font-bold text-slate-700 border border-slate-200 shadow-2xs">
            {stockCount > 0 ? `${stockCount} ${unitLabel}` : 'Zaxira tugagan'}
          </div>

          {/* Badges on Image (50/50 Escrow and B2B Pill) */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap z-10">
            {showEscrowBadge && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-sans font-semibold bg-white/95 text-emerald-800 border border-slate-200/90 shadow-2xs backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>50/50 Escrow</span>
              </span>
            )}
            {isB2B && <B2BBadge />}
          </div>
        </div>

        {/* Supplier & Delivery Badges */}
        <div className="flex items-center justify-between gap-2 text-xs font-sans text-slate-500 mb-2">
          {showSupplier && (
            <span className="min-w-0 flex-1 truncate text-slate-700 font-semibold flex items-center gap-1 text-[11px]">
              <Factory className="w-3.5 h-3.5 text-[#D95D1E] shrink-0" />
              <span className="truncate">{product.supplierName || 'Rasmiy Ishlab chiqaruvchi'}</span>
            </span>
          )}
          <div className="flex items-center gap-1.5 shrink-0">
            {showDelivery && product.hasDelivery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-sans font-medium bg-slate-100 text-slate-700 border border-slate-200">
                <Truck className="w-3 h-3 text-[#D95D1E] shrink-0" />
                <span>Yetkazish bor</span>
              </span>
            )}
            {showVat && (
              <span className="text-slate-500 font-medium text-[11px]">
                {product.vatRate !== undefined ? `${product.vatRate}% QQS` : '12% QQS'}
              </span>
            )}
          </div>
        </div>

        {/* Region / Location if available */}
        {product.region && (
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium truncate mb-1">
            <MapPin className="w-3 h-3 text-[#D95D1E] shrink-0" />
            <span className="truncate">{product.region}</span>
          </div>
        )}

        {/* Title */}
        <h3 className="font-heading font-black text-slate-900 text-base line-clamp-2 group-hover:text-[#D95D1E] transition-colors leading-snug">
          {product.title}
        </h3>
      </div>

      {/* Bottom Price & Action Row */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-mono text-slate-500 block">
            Zavod Narxi:
          </span>
          <p className="text-lg font-heading font-black text-[#D95D1E] leading-tight font-mono-numbers">
            {formattedPrice}{' '}
            <span className="text-xs font-sans font-normal text-slate-600">
              so‘m / {unitLabel}
            </span>
          </p>
          {showTieredPrice && lowestTierPrice && (
            <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded mt-0.5 inline-block">
              Ulgurji: {lowestTierPrice} so‘mdan
            </span>
          )}
        </div>

        {onAddToCart && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddClick}
            leftIcon={
              isAdded ? (
                <Check className="w-4 h-4 stroke-[3]" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )
            }
          >
            {isAdded ? addedText : <span className="hidden sm:inline">{actionText}</span>}
          </Button>
        )}
      </div>
    </div>
  );
};
