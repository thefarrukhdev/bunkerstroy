import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, CheckCircle, Package } from 'lucide-react';
import { Product } from '@bunkerstroy/types';
import { Button, Badge } from '@bunkerstroy/ui';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
  onOrderSuccess: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemove,
  onClear,
  onOrderSuccess
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [phone, setPhone] = useState('+998 ');
  const [name, setName] = useState('');
  const [region, setRegion] = useState('Toshkent shahri');
  const [district, setDistrict] = useState('Chilonzor tumani');
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const totalSum = items.reduce((acc, it) => acc + Number(it.product.price) * it.quantity, 0);
  const deliveryFee = 150000;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerName: name || 'Buyurtmachi',
          buyerPhone: phone,
          items: items.map((it) => ({
            productId: it.product.id,
            title: it.product.title,
            supplierId: it.product.supplierId,
            price: it.product.price,
            quantity: it.quantity,
            unit: it.product.unit
          })),
          deliveryAddress: { region, district },
          paymentMethod
        })
      });

      const data = await res.json();
      if (data.success) {
        onClear();
        setStep('success');
        setTimeout(() => {
          onOrderSuccess();
          onClose();
          setStep('cart');
        }, 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#1A1D20] border-l border-[#33373B] h-full flex flex-col justify-between p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#33373B]">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#FFB800]" />
            <h3 className="font-bold text-[#F5F5F2]">Xarid Savati ({items.length})</h3>
          </div>
          <button onClick={onClose} className="text-[#B8B8B3] hover:text-[#F5F5F2] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {step === 'cart' && (
            items.length === 0 ? (
              <div className="text-center py-20 text-[#B8B8B3] space-y-2">
                <p className="text-sm">Savat bo'sh</p>
                <p className="text-xs">Marketplacedan tovarlarni tanlang</p>
              </div>
            ) : (
              items.map((it) => (
                <div key={it.product.id} className="bg-[#151719] border border-[#33373B] p-3.5 rounded-2xl flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-[#F5F5F2] truncate">{it.product.title}</h4>
                    <p className="text-[11px] font-mono text-[#FFB800] mt-0.5">
                      {Number(it.product.price).toLocaleString()} so'm
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-[#222528] border border-[#33373B] rounded-xl px-2 py-1">
                    <button onClick={() => onUpdateQty(it.product.id, -1)} className="text-[#B8B8B3] hover:text-[#F5F5F2] cursor-pointer">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-mono font-bold text-[#F5F5F2] px-1">{it.quantity}</span>
                    <button onClick={() => onUpdateQty(it.product.id, 1)} className="text-[#B8B8B3] hover:text-[#F5F5F2] cursor-pointer">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button onClick={() => onRemove(it.product.id)} className="text-[#777A7C] hover:text-red-400 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )
          )}

          {step === 'checkout' && (
            <div className="space-y-4 text-xs font-semibold text-[#B8B8B3]">
              <div>
                <label className="block mb-1">Ism va familiya:</label>
                <input
                  type="text"
                  placeholder="Farrukh Jumayev"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#151719] border border-[#33373B] p-2.5 rounded-xl text-[#F5F5F2] outline-none"
                />
              </div>
              <div>
                <label className="block mb-1">Telefon raqam:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#151719] border border-[#33373B] p-2.5 rounded-xl text-[#F5F5F2] font-mono outline-none"
                />
              </div>
              <div>
                <label className="block mb-1">Yetkazish viloyati:</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-[#151719] border border-[#33373B] p-2.5 rounded-xl text-[#F5F5F2] outline-none"
                >
                  <option value="Toshkent shahri">Toshkent shahri</option>
                  <option value="Toshkent viloyati">Toshkent viloyati</option>
                  <option value="Samarqand viloyati">Samarqand viloyati</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">To'lov turi:</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-[#151719] border border-[#33373B] p-2.5 rounded-xl text-[#F5F5F2] outline-none"
                >
                  <option value="CASH_ON_DELIVERY">Yetkazilganda naqd / karta</option>
                  <option value="PAYME">Payme orqali onlayn</option>
                  <option value="CLICK">Click orqali onlayn</option>
                  <option value="BANK_TRANSFER">Bank hisob-raqami orqali (B2B)</option>
                </select>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-20 space-y-3">
              <CheckCircle className="w-16 h-16 mx-auto text-emerald-400" />
              <h4 className="text-lg font-bold text-[#F5F5F2]">Buyurtma qabul qilindi!</h4>
              <p className="text-xs text-[#B8B8B3]">Menejerimiz tez orada telefon orqali aloqaga chiqadi.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 'success' && items.length > 0 && (
          <div className="pt-4 border-t border-[#33373B] space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-[#B8B8B3]">Jami summa:</span>
              <span className="text-xl font-black text-[#FFB800] font-mono">
                {(totalSum + (step === 'checkout' ? deliveryFee : 0)).toLocaleString()} so'm
              </span>
            </div>

            {step === 'cart' ? (
              <Button className="w-full" size="md" onClick={() => setStep('checkout')}>
                Buyurtmani Rasmiylashtirish
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="secondary" size="md" onClick={() => setStep('cart')}>
                  Ortga
                </Button>
                <Button className="flex-1" size="md" onClick={handlePlaceOrder} isLoading={loading}>
                  Tasdiqlash
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
