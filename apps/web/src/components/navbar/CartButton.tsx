import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { cn } from '@bunkerstroy/ui';
import { CartButtonProps } from './types';

export const CartButton: React.FC<CartButtonProps> = ({ count, onClick, className }) => {
  const hasItems = count > 0;

  return (
    <button
      type="button"
      data-cart-button="true"
      onClick={onClick}
      title={hasItems ? `${count} ta mahsulot xarid savatida` : "Xarid savati bo'sh"}
      aria-label={hasItems ? `Xarid savati, ${count} ta mahsulot` : 'Xarid savati'}
      className={cn(
        'group relative flex items-center gap-2 h-9 sm:h-9 min-h-[38px] px-2.5 sm:px-3 rounded-xl border transition-all text-xs font-semibold cursor-pointer shadow-2xs select-none shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#D95D1E]/40 active:scale-98',
        hasItems
          ? 'bg-[#D95D1E] hover:bg-[#B43B06] border-[#C2410C] text-white shadow-xs'
          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700',
        className
      )}
    >
      <ShoppingCart
        className={cn(
          'w-4 h-4 transition-transform duration-200 group-hover:scale-110 shrink-0',
          hasItems ? 'text-white' : 'text-slate-600'
        )}
      />
      <span className="hidden sm:inline font-bold">Savat</span>
      {hasItems && (
        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-mono font-black rounded-full bg-white text-[#D95D1E] shadow-2xs transition-transform duration-200">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};
