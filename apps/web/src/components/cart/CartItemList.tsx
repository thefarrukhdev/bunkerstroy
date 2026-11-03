import React from 'react';
import {
  Trash2,
  Plus,
  Minus,
  Package,
  Truck,
  ShieldCheck,
  ShoppingBag,
  Factory
} from 'lucide-react';
import { Button } from '@bunkerstroy/ui';
import type { CartItem } from './types';

interface CartItemListProps {
  items: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemove: (productId: string) => void;
  onClose: () => void;
  totalWeightKg: number;
  totalTons: string;
  recommendedVehicle: string;
}

export const CartItemList: React.FC<CartItemListProps> = ({
  items,
  onUpdateQty,
  onRemove,
  onClose,
  totalWeightKg,
  totalTons,
  recommendedVehicle,
}) => {
  if (items.length === 0) {
    return (
      <div className="py-16 text-center space-y-4 font-sans">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 text-[#D95D1E] mx-auto flex items-center justify-center shadow-xs">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="font-heading font-black text-slate-900 text-lg">
            Savatchangiz bo‘sh
          </h3>
          <p className="text-slate-500 text-xs max-w-xs mx-auto">
            Qurilish mollari katalogidan kerakli mahsulotlarni tanlab, buyurtma bering.
          </p>
        </div>
        <div className="pt-2">
          <Button variant="primary" size="md" onClick={onClose}>
            Katalogga o‘tish
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans">
      {/* 50/50 Escrow & Logistics Guarantee Notice */}
      <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 text-slate-800 text-xs space-y-1.5 shadow-2xs">
        <div className="flex items-center gap-2 font-bold text-[#D95D1E]">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>50/50 Xavfsiz Escrow &amp; Zavod Yetkazib Berishi</span>
        </div>
        <p className="text-slate-600 leading-relaxed text-[11px]">
          Mahsulotlar to‘g‘ridan-to‘g‘ri ishlab chiqaruvchi yoki uning rasmiy dileridan yetkaziladi. 
          To‘lovning 50% qismi faqat yuk ob’yektga yetib kelib, qabul PIN-kodi kiritilgach sotuvchiga o‘tkaziladi.
        </p>
      </div>

      {/* Cart Items List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-100">
          <span className="font-semibold">Mahsulot</span>
          <span className="font-semibold">Soni / Summasi</span>
        </div>

        {items.map(({ product, quantity }) => {
          const itemTotal = Number(product.price) * quantity;
          return (
            <div
              key={product.id}
              className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs space-y-3 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="font-heading font-black text-slate-900 text-xs leading-tight line-clamp-2">
                      {product.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                      <Factory className="w-3 h-3 text-[#D95D1E] shrink-0" />
                      <span>{product.supplierName || 'Rasmiy Ishlab chiqaruvchi'}</span>
                    </p>
                    <p className="text-[11px] font-bold text-[#D95D1E]">
                      {Number(product.price).toLocaleString()} so‘m / {product.unit || 'dona'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(product.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                  aria-label={`${product.title}ni savatdan o‘chirish`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Quantity Stepper & Subtotal */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => onUpdateQty(product.id, -1)}
                    className="p-1.5 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    aria-label="Kamaytirish"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center font-bold text-slate-900 text-xs select-none">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQty(product.id, 1)}
                    className="p-1.5 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    aria-label="Ko‘paytirish"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Jami:</span>
                  <span className="font-heading font-black text-slate-900 text-xs text-[#D95D1E]">
                    {itemTotal.toLocaleString()} so‘m
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Heavy Cargo & Transport Estimate Notice */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600 shadow-2xs">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#D95D1E] shrink-0" />
          <div>
            <span className="font-bold text-slate-800">Yuk hajmi: ~{totalTons} tonna</span>
            <span className="text-slate-400 text-[10px] block">Tavsiya qilinadi: {recommendedVehicle}</span>
          </div>
        </div>
        <span className="text-[11px] font-bold text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">
          {(totalWeightKg).toLocaleString()} kg
        </span>
      </div>
    </div>
  );
};
