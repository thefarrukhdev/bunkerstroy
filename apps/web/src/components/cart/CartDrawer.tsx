import React, { useState, useMemo, useEffect } from 'react';
import {
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { Drawer, Button, Alert } from '@bunkerstroy/ui';
import { REGIONS_AND_DISTRICTS } from '@bunkerstroy/types';
import { apiFetch } from '../../services/apiClient';
import { CartItemList } from './CartItemList';
import { CartCheckoutForm } from './CartCheckoutForm';
import { OrderSuccessView } from './OrderSuccessView';
import { DEFAULT_CONSTRUCTION_SITES } from './constants';
import type { CartDrawerProps, CheckoutStep, ConstructionSite } from './types';

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemove,
  onClear,
  onOrderSuccess,
  currentUser,
}) => {
  const [step, setStep] = useState<CheckoutStep>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Step 2 state: Buyer & Delivery details
  const [buyerName, setBuyerName] = useState<string>(
    () => currentUser?.displayName || currentUser?.companyName || ''
  );
  const [buyerPhone, setBuyerPhone] = useState<string>(
    () => currentUser?.phone || ''
  );

  useEffect(() => {
    if (currentUser) {
      if (!buyerName && (currentUser.displayName || currentUser.companyName)) {
        setBuyerName(currentUser.displayName || currentUser.companyName || '');
      }
      if (!buyerPhone && currentUser.phone) {
        setBuyerPhone(currentUser.phone);
      }
    }
  }, [currentUser]);

  const [deliveryMethod, setDeliveryMethod] = useState<'COURIER' | 'PICKUP'>('COURIER');
  const [vehicleType, setVehicleType] = useState('Standart Kuryer / Gazel');
  const [region, setRegion] = useState('Toshkent shahri');
  const [district, setDistrict] = useState('Chilonzor tumani');
  const [streetAddress, setStreetAddress] = useState('Bunyodkor shox ko‘chasi, 42-uy');
  const [landmark, setLandmark] = useState('Novza metro bekati yaqinida');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  const [showSecondaryPhone, setShowSecondaryPhone] = useState(false);
  const [buyerInn, setBuyerInn] = useState(currentUser?.stir || '');
  const [paymentMethod, setPaymentMethod] = useState<'CASH_ON_DELIVERY' | 'PAYME' | 'CLICK' | 'BANK_TRANSFER'>('PAYME');
  const [paymentMode, setPaymentMode] = useState<'FULL_100' | 'SPLIT_50_50'>('SPLIT_50_50');
  const [securityPin] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');

  // Available districts
  const availableDistricts = useMemo(() => {
    return REGIONS_AND_DISTRICTS[region] || ['Chilonzor tumani', 'Yunusobod tumani', 'Mirzo Ulug‘bek tumani'];
  }, [region]);

  // Saved construction sites
  const [savedSites, setSavedSites] = useState<ConstructionSite[]>(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('bunkerstroy_saved_sites') : null;
      return stored ? JSON.parse(stored) : DEFAULT_CONSTRUCTION_SITES;
    } catch {
      return DEFAULT_CONSTRUCTION_SITES;
    }
  });
  const [selectedSiteId, setSelectedSiteId] = useState<string>('tc-lot4');

  const handleSelectSite = (site: ConstructionSite) => {
    setSelectedSiteId(site.id);
    setRegion(site.region);
    setDistrict(site.district);
    setStreetAddress(site.street);
    setLandmark(site.landmark);
  };

  const handleSaveCurrentSite = (name: string) => {
    const newSite: ConstructionSite = {
      id: `site-${Date.now()}`,
      name,
      region,
      district,
      street: streetAddress.trim(),
      landmark: landmark.trim(),
    };
    const updated = [...savedSites, newSite];
    setSavedSites(updated);
    setSelectedSiteId(newSite.id);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('bunkerstroy_saved_sites', JSON.stringify(updated));
      }
    } catch {}
  };

  // Calculations
  const totalItemsSum = useMemo(() => {
    return items.reduce((acc, it) => acc + Number(it.product.price) * it.quantity, 0);
  }, [items]);

  const totalWeightKg = useMemo(() => {
    return items.reduce((sum, it) => {
      const unit = (it.product.unit || '').toUpperCase();
      if (unit.includes('TON')) return sum + it.quantity * 1000;
      if (unit.includes('50KG')) return sum + it.quantity * 50;
      if (unit.includes('25KG')) return sum + it.quantity * 25;
      return sum + it.quantity * 15;
    }, 0);
  }, [items]);

  const totalTons = (totalWeightKg / 1000).toFixed(2);

  const recommendedVehicle = useMemo(() => {
    if (totalWeightKg <= 3000) return 'Gazel (3 tonnagacha)';
    if (totalWeightKg <= 10000) return 'Isuzu Bortli (10 tonnagacha)';
    if (totalWeightKg <= 25000) return 'HOWO Samosval (25 tonna)';
    return 'Fura / Tirkama (30+ tonna)';
  }, [totalWeightKg]);

  const deliveryFee = deliveryMethod === 'PICKUP' ? 0 : totalWeightKg > 10000 ? 150000 : 50000;
  const grandTotal = totalItemsSum + deliveryFee;

  // Handle Order Submit
  const handlePlaceOrder = async () => {
    if (!buyerName.trim()) {
      setErrorMsg('Iltimos, ismingizni yoki korxona nomini kiriting');
      return;
    }
    if (!buyerPhone.trim()) {
      setErrorMsg('Iltimos, telefon raqamingizni kiriting');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          buyerName: buyerName.trim(),
          buyerPhone: buyerPhone.trim(),
          buyerInn: buyerInn.trim() || undefined,
          secondaryPhone: secondaryPhone.trim() || undefined,
          items: items.map((it) => ({
            productId: it.product.id,
            quantity: it.quantity,
          })),
          deliveryAddress: {
            region,
            district,
            street: streetAddress.trim(),
            landmark: landmark.trim(),
          },
          vehicleType: deliveryMethod === 'PICKUP' ? 'O‘zi olib ketish (Samovivoz)' : vehicleType,
          paymentMethod,
          paymentMode,
          securityPin,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const orderNum = data.data?.orderNumber || `BS-${Math.floor(100000 + Math.random() * 900000)}`;
        setCreatedOrderNumber(orderNum);
        onClear();
        setStep('success');
      } else {
        setErrorMsg(data.message || 'Buyurtmani rasmiylashtirishda xatolik yuz berdi');
      }
    } catch {
      setErrorMsg('Server bilan aloqa uzildi. Iltimos qayta urinib ko‘ring.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinishAndNavigate = () => {
    onOrderSuccess();
    onClose();
    setStep(1);
  };

  if (!isOpen) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={
        step === 1
          ? 'Xarid Savatchasi'
          : step === 2
          ? 'Yetkazib Berish & Rasmiylashtirish'
          : 'Buyurtma Muvaffaqiyatli Qabul Qilindi'
      }
      subtitle={
        step === 1
          ? `${items.length} xil qurilish mahsulotlari tanlangan`
          : step === 2
          ? 'Manzilni ko‘rsating va yetkazib berish usulini tanlang'
          : 'Mahsulotlar to‘g‘ridan-to‘g‘ri sotuvchiga yo‘naltirildi'
      }
      headerExtra={
        <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
          <ShoppingBag className="w-5 h-5 text-[#D95D1E]" />
        </div>
      }
      footer={
        step !== 'success' && items.length > 0 ? (
          <div className="w-full space-y-3 font-sans">
            {/* Price Summary Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs shadow-2xs">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Mahsulotlar summasi:</span>
                <span className="text-slate-900 font-bold">{totalItemsSum.toLocaleString()} so‘m</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Yetkazib berish to‘lovi:</span>
                <span className={deliveryFee === 0 ? 'text-emerald-700 font-bold' : 'text-slate-900 font-bold'}>
                  {deliveryFee === 0 ? 'BEPUL (O‘zi olib ketish)' : `${deliveryFee.toLocaleString()} so‘m`}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900 items-baseline">
                <span>Jami to‘lov:</span>
                <span className="text-[#D95D1E] font-heading font-black text-base">
                  {grandTotal.toLocaleString()} so‘m
                </span>
              </div>

              {paymentMode === 'SPLIT_50_50' && (
                <div className="bg-white border border-slate-200 rounded-lg p-2.5 text-[11px] space-y-1 text-slate-700 shadow-2xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Avans to‘lovi (50%):</span>
                    <span className="text-[#D95D1E] font-bold">
                      {Math.round(grandTotal / 2).toLocaleString()} so‘m
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Qoldiq to‘lov (50%):</span>
                    <span className="text-slate-900 font-semibold">
                      {(grandTotal - Math.round(grandTotal / 2)).toLocaleString()} so‘m (yetib kelgach)
                    </span>
                  </div>
                  <p className="text-[10px] text-amber-700 pt-0.5">
                    * Qabul kodi yuk yetib kelib, 2-to‘lov tasdiqlangach ochiladi.
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {step === 2 && (
                <Button variant="secondary" size="md" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  <span>Ortga</span>
                </Button>
              )}

              {step === 1 ? (
                <Button
                  className="flex-1"
                  size="md"
                  variant="primary"
                  onClick={() => setStep(2)}
                >
                  <span>Yetkazib berishga o‘tish</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              ) : (
                <Button
                  className="flex-1"
                  size="md"
                  variant="primary"
                  isLoading={loading}
                  onClick={handlePlaceOrder}
                >
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  <span>Buyurtmani Tasdiqlash</span>
                </Button>
              )}
            </div>
          </div>
        ) : null
      }
    >
      {errorMsg && (
        <Alert variant="error" onDismiss={() => setErrorMsg(null)} className="mb-4">
          {errorMsg}
        </Alert>
      )}

      {step === 1 && (
        <CartItemList
          items={items}
          onUpdateQty={onUpdateQty}
          onRemove={onRemove}
          onClose={onClose}
          totalWeightKg={totalWeightKg}
          totalTons={totalTons}
          recommendedVehicle={recommendedVehicle}
        />
      )}

      {step === 2 && (
        <CartCheckoutForm
          buyerName={buyerName}
          setBuyerName={setBuyerName}
          buyerPhone={buyerPhone}
          setBuyerPhone={setBuyerPhone}
          secondaryPhone={secondaryPhone}
          setSecondaryPhone={setSecondaryPhone}
          showSecondaryPhone={showSecondaryPhone}
          setShowSecondaryPhone={setShowSecondaryPhone}
          buyerInn={buyerInn}
          setBuyerInn={setBuyerInn}
          deliveryMethod={deliveryMethod}
          setDeliveryMethod={setDeliveryMethod}
          vehicleType={vehicleType}
          setVehicleType={setVehicleType}
          region={region}
          setRegion={setRegion}
          district={district}
          setDistrict={setDistrict}
          streetAddress={streetAddress}
          setStreetAddress={setStreetAddress}
          landmark={landmark}
          setLandmark={setLandmark}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          paymentMode={paymentMode}
          setPaymentMode={setPaymentMode}
          savedSites={savedSites}
          selectedSiteId={selectedSiteId}
          onSelectSite={handleSelectSite}
          onSaveCurrentSite={handleSaveCurrentSite}
          availableDistricts={availableDistricts}
        />
      )}

      {step === 'success' && (
        <OrderSuccessView
          orderNumber={createdOrderNumber}
          securityPin={securityPin}
          onFinishAndNavigate={handleFinishAndNavigate}
          onClose={() => {
            onClose();
            setStep(1);
          }}
        />
      )}
    </Drawer>
  );
};
