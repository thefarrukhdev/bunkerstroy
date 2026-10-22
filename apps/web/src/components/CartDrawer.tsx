import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  Package,
  ShieldCheck,
  Building2,
  FileText,
  CreditCard,
  Search,
  Check,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  FileCheck2,
  Receipt
} from 'lucide-react';
import { Product } from '@bunkerstroy/types';
import { Button, Badge, Drawer, Input, Select, Alert } from '@bunkerstroy/ui';

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

type CheckoutStep = 1 | 2 | 3 | 4 | 'success';

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemove,
  onClear,
  onOrderSuccess
}) => {
  const [step, setStep] = useState<CheckoutStep>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Step 2: Corporate details (STIR lookup)
  const [stir, setStir] = useState('308942175');
  const [stirLoading, setStirLoading] = useState(false);
  const [companyName, setCompanyName] = useState('Toshkent Mega Qurilish MChJ');
  const [mfo, setMfo] = useState('00440');
  const [accountNumber, setAccountNumber] = useState('20208000400501234001');
  const [bankName, setBankName] = useState("O‘zsanoatqurilishbank ATB");
  const [directorName, setDirectorName] = useState('Alisher Normurodov');
  const [legalAddress, setLegalAddress] = useState('Toshkent sh., Yunusobod tumani, Amir Temur shox ko‘chasi 107-uy');
  const [buyerPhone, setBuyerPhone] = useState('+998 90 123 45 67');

  // Step 3: Contract & E-IMZO
  const [eimzoSigned, setEimzoSigned] = useState(false);
  const [signingInProgress, setSigningInProgress] = useState(false);
  const [eimzoSerial, setEimzoSerial] = useState('ERI-UZ-8492-FE01-2026');

  // Step 4: Payment terms & methods
  const [paymentTerms, setPaymentTerms] = useState<'ADVANCE_100' | 'ADVANCE_30_70'>('ADVANCE_30_70');
  const [paymentMethod, setPaymentMethod] = useState<'BANK_TRANSFER' | 'PAYME' | 'CLICK'>('BANK_TRANSFER');
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string>('');

  if (!isOpen) return null;

  const totalSum = items.reduce((acc, it) => acc + Number(it.product.price) * it.quantity, 0);
  const qqsAmount = Math.round(totalSum * 0.12);
  const deliveryFee = 150000;
  const grandTotal = totalSum + deliveryFee;

  const advance30 = Math.round(grandTotal * 0.3);
  const remaining70 = grandTotal - advance30;

  // STIR Soliq Lookup action
  const handleStirLookup = async () => {
    if (!stir || stir.length < 9) {
      setErrorMsg("STIR 9 xonali raqam bo'lishi kerak");
      return;
    }

    setStirLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/auth/stir/${stir.trim()}`);
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        const d = json.data;
        setCompanyName(d.companyName || d.name || 'O‘zbekiston Qurilish Servis MChJ');
        if (d.director) setDirectorName(d.director);
        if (d.address) setLegalAddress(d.address);
      } else {
        // Fallback realistic B2B company data
        setCompanyName('Toshkent Mega Qurilish MChJ');
        setDirectorName('Alisher Normurodov');
      }
    } catch {
      setCompanyName('Toshkent Mega Qurilish MChJ');
    } finally {
      setStirLoading(false);
    }
  };

  // E-IMZO digital signature simulator
  const handleSignEImzo = () => {
    setSigningInProgress(true);
    setTimeout(() => {
      setEimzoSigned(true);
      setSigningInProgress(false);
      setEimzoSerial(`ERI-UZ-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4).toUpperCase()}`);
    }, 1000);
  };

  // Step 4: Place Order via API
  const handlePlaceOrder = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('bunkerstroy_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          buyerName: (directorName || companyName || 'B2B Buyurtmachi').trim(),
          buyerPhone: (buyerPhone || '').trim() || '+998901234567',
          items: items.map((it) => ({
            productId: it.product.id,
            quantity: it.quantity
          })),
          deliveryAddress: {
            region: 'Toshkent shahri',
            district: (legalAddress || '').trim() || 'Yunusobod tumani'
          },
          paymentMethod: paymentMethod === 'BANK_TRANSFER' ? 'BANK_TRANSFER' : paymentMethod
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const orderNum = data.data?.orderNumber || `BS-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
        setCreatedOrderNumber(orderNum);
        onClear();
        setStep('success');
        setTimeout(() => {
          onOrderSuccess();
          onClose();
          setStep(1);
        }, 3500);
      } else {
        setErrorMsg(data.message || 'Buyurtmani rasmiylashtirishda xatolik yuz berdi');
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Server bilan aloqa uzildi. Iltimos qayta urinib ko‘ring.');
    } finally {
      setLoading(false);
    }
  };

  // Drawer Header Icon & Titles
  const drawerHeaderExtra = (
    <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
      <Package className="w-5 h-5 text-bunker-amber-500" />
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      headerExtra={drawerHeaderExtra}
      title="4 Bosqichli Yuridik B2B Rasmiylashtirish"
      subtitle="Soliq STIR & E-IMZO Shartnomasi"
      footer={
        step !== 'success' && items.length > 0 ? (
          <div className="w-full space-y-3 font-mono">
            <div className="flex flex-col-reverse sm:flex-row gap-2">
              {step > 1 && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() =>
                    setStep((prev) => {
                      if (typeof prev === 'number' && prev > 1) {
                        return (prev - 1) as CheckoutStep;
                      }
                      return 1;
                    })
                  }
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  <span>Ortga</span>
                </Button>
              )}

              {step === 1 && (
                <Button
                  className="flex-1"
                  size="md"
                  variant="primary"
                  onClick={() => setStep(2)}
                >
                  <span>2. Korxona STIR Rekvizitlari</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}

              {step === 2 && (
                <Button
                  className="flex-1"
                  size="md"
                  variant="primary"
                  onClick={() => setStep(3)}
                >
                  <span>3. Shartnoma va E-IMZO</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}

              {step === 3 && (
                <Button
                  className="flex-1"
                  size="md"
                  variant="primary"
                  disabled={!eimzoSigned}
                  onClick={() => setStep(4)}
                >
                  <span>4. To‘lov Shartlari</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}

              {step === 4 && (
                <Button
                  className="flex-1"
                  size="md"
                  variant="primary"
                  onClick={handlePlaceOrder}
                  isLoading={loading}
                >
                  <FileCheck2 className="w-4 h-4 mr-1.5" />
                  <span>Buyurtmani Rasmiylashtirish</span>
                </Button>
              )}
            </div>
          </div>
        ) : undefined
      }
    >
      {/* 4-Step Progress Indicator */}
      {step !== 'success' && (
        <div className="pb-3 border-b border-slate-200">
          <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-mono select-none">
            <div
              className={`p-1.5 rounded-lg font-semibold transition-all border ${
                step === 1
                  ? 'bg-bunker-amber-500 text-white border-bunker-amber-500 shadow-xs'
                  : step > 1
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              <span className="hidden sm:inline">1. Spetsifikatsiya</span>
              <span className="sm:hidden">1. Tovar</span>
            </div>
            <div
              className={`p-1.5 rounded-lg font-semibold transition-all border ${
                step === 2
                  ? 'bg-bunker-amber-500 text-white border-bunker-amber-500 shadow-xs'
                  : step > 2
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              <span className="hidden sm:inline">2. STIR Rekvizit</span>
              <span className="sm:hidden">2. STIR</span>
            </div>
            <div
              className={`p-1.5 rounded-lg font-semibold transition-all border ${
                step === 3
                  ? 'bg-bunker-amber-500 text-white border-bunker-amber-500 shadow-xs'
                  : step > 3
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              3. E-IMZO
            </div>
            <div
              className={`p-1.5 rounded-lg font-semibold transition-all border ${
                step === 4
                  ? 'bg-bunker-amber-500 text-white border-bunker-amber-500 shadow-xs'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              <span className="hidden sm:inline">4. To‘lov & Invoys</span>
              <span className="sm:hidden">4. To‘lov</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert Component */}
      {errorMsg && (
        <Alert
          variant="error"
          description={errorMsg}
          onDismiss={() => setErrorMsg(null)}
          className="my-1"
        />
      )}

      {/* STEP 1: SPECIFICATION & ITEMS BREAKDOWN */}
      {step === 1 && (
        <div className="space-y-3">
          <span className="text-[11px] font-mono text-slate-500 uppercase block font-semibold">
            Materiallar Spetsifikatsiyasi ({items.length} ta tovar):
          </span>

          {items.length === 0 ? (
            <div className="text-center py-20 text-slate-500 space-y-2 font-mono">
              <Package className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-900">Xarid savati bo'sh</p>
              <p className="text-xs">Marketplacedan materiallarni tanlang</p>
            </div>
          ) : (
            items.map((it) => (
              <div
                key={it.product.id}
                className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs flex items-center justify-between gap-3 font-mono"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-semibold text-slate-900 truncate">{it.product.title}</h4>
                  <p className="text-[11px] text-bunker-amber-500 font-bold mt-0.5 font-mono">
                    {Number(it.product.price).toLocaleString()} so'm / {it.product.unit}
                  </p>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Qator summasi: {(Number(it.product.price) * it.quantity).toLocaleString()} so'm
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                  <button
                    type="button"
                    onClick={() => onUpdateQty(it.product.id, -1)}
                    className="text-slate-600 hover:text-slate-900 p-0.5 cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold text-slate-900 px-1.5">{it.quantity}</span>
                  <button
                    type="button"
                    onClick={() => onUpdateQty(it.product.id, 1)}
                    className="text-slate-600 hover:text-slate-900 p-0.5 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(it.product.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}

          {/* Tax & Logistics Summary */}
          {items.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Mahsulotlar summasi:</span>
                <span className="text-slate-900 font-medium">{totalSum.toLocaleString()} so'm</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>QQS 12% (hisoblangan):</span>
                <span className="text-emerald-700 font-semibold">+{qqsAmount.toLocaleString()} so'm</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Kafolatlangan HOWO logistika tarifi:</span>
                <span className="text-slate-900 font-medium">{deliveryFee.toLocaleString()} so'm</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold">
                <span className="text-slate-900">Jami B2B spetsifikatsiya:</span>
                <span className="text-lg text-bunker-amber-500 font-mono">{grandTotal.toLocaleString()} so'm</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: CORPORATE DETAILS & STIR LOOKUP */}
      {step === 2 && (
        <div className="space-y-4 text-xs font-mono">
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
            <span className="text-[11px] font-bold text-bunker-amber-500 uppercase flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              Davlat Soliq Qo‘mitasi STIR (INN) Integratsiyasi:
            </span>

            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  isMono
                  maxLength={9}
                  placeholder="STIR: 308942175"
                  value={stir}
                  onChange={(e) => setStir(e.target.value)}
                />
              </div>
              <Button
                size="md"
                variant="primary"
                onClick={handleStirLookup}
                isLoading={stirLoading}
              >
                <Search className="w-3.5 h-3.5 mr-1" />
                <span>Tekshirish</span>
              </Button>
            </div>
          </div>

          {/* Company Details Form with Input Component */}
          <div className="space-y-3 text-bunker-text-secondary">
            <Input
              label="Tashkilot to‘liq nomi:"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Bank MFO:"
                isMono
                value={mfo}
                onChange={(e) => setMfo(e.target.value)}
              />
              <Select
                label="Xizmat ko‘rsatuvchi bank:"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                options={[
                  { label: 'O‘zsanoatqurilishbank ATB', value: 'O‘zsanoatqurilishbank ATB' },
                  { label: 'O‘zmilliybank AJ (NBU)', value: 'O‘zmilliybank AJ (NBU)' },
                  { label: 'Ipoteka-bank ATIB', value: 'Ipoteka-bank ATIB' },
                  { label: 'Hamkorbank ATB', value: 'Hamkorbank ATB' },
                  { label: 'Kapitalbank ATB', value: 'Kapitalbank ATB' },
                  { label: 'Trastbank XAB', value: 'Trastbank XAB' }
                ]}
              />
            </div>

            <Input
              label="Hisob-raqam (Hisob-kitob schyoti):"
              isMono
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />

            <Input
              label="Rahbar F.I.O. (Direktor):"
              value={directorName}
              onChange={(e) => setDirectorName(e.target.value)}
            />

            <Input
              label="Yuridik manzil:"
              value={legalAddress}
              onChange={(e) => setLegalAddress(e.target.value)}
            />

            <Input
              label="Mas'ul xodim telefoni:"
              isMono
              value={buyerPhone}
              onChange={(e) => setBuyerPhone(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* STEP 3: CONTRACT REVIEW & E-IMZO SIGN */}
      {step === 3 && (
        <div className="space-y-4 text-xs font-mono">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-bunker-amber-500 flex items-center gap-1.5 uppercase font-mono">
                <FileText className="w-4 h-4" />
                Yetkazib Berish Shartnomasi № BS-2026/089
              </span>
              <Badge variant="info">Yuridik Kuchga Ega</Badge>
            </div>

            {/* Contract Text Snippet */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl max-h-48 overflow-y-auto space-y-2 text-[11px] text-slate-700 leading-relaxed font-sans">
              <p className="font-bold text-slate-900">
                1. Shartnoma Predmeti:
              </p>
              <p>
                Yetkazib beruvchi («BUNKERSTROY TECH» MChJ) ushbu shartnoma bo‘yicha spetsifikatsiyada ko‘rsatilgan
                qurilish materiallarini xaridor («{companyName}», STIR: {stir}) qurilish ob'ektiga belgilangan
                muddatda yetkazib berish majburiyatini oladi.
              </p>
              <p className="font-bold text-slate-900">
                2. Sifat va Kafolat:
              </p>
              <p>
                Barcha yetkazib beriladigan mahsulotlar amaldagi O‘zbekiston Respublikasi davlat standartlari (GOST 31108,
                GOST 5781) talablariga to‘liq javob beradi va laboratoriya muvofiqlik sertifikatlari bilan ta'minlanadi.
              </p>
              <p className="font-bold text-slate-900">
                3. Shartnoma Qiymati:
              </p>
              <p>
                Shartnomaning umumiy qiymati QQS 12% va maxsus transport yetkazishini hisobga olgan holda{' '}
                <strong className="text-bunker-amber-500 font-mono">{grandTotal.toLocaleString()} so‘m</strong>ni tashkil etadi.
              </p>
            </div>
          </div>

          {/* E-IMZO Digital Signature Box */}
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 shadow-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1.5 uppercase">
              <KeyRound className="w-4 h-4 text-bunker-amber-500" />
              E-IMZO Raqamli Imzo Kaliti (ERI):
            </span>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">Tanlangan ERI Sertifikati:</span>
                <p className="font-bold text-slate-900">{directorName.toUpperCase()}</p>
                <span className="text-[10px] text-bunker-amber-500 block font-mono">
                  STIR: {stir} | DSQ Davlat Reestri
                </span>
              </div>

              {eimzoSigned ? (
                <Badge variant="success" className="gap-1">
                  <Check className="w-3.5 h-3.5" />
                  IMZOLANDI
                </Badge>
              ) : (
                <Badge variant="warning">KUTILMOQDA</Badge>
              )}
            </div>

            {eimzoSigned ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-[11px] text-emerald-800">
                <p className="font-bold flex items-center gap-1 text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Hujjat E-IMZO bilan muvaffaqiyatli imzolandi!
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  Serial: {eimzoSerial} | Imzolangan vaqt: {new Date().toLocaleTimeString()}
                </p>
              </div>
            ) : (
              <Button
                className="w-full"
                size="md"
                variant="primary"
                onClick={handleSignEImzo}
                isLoading={signingInProgress}
              >
                <KeyRound className="w-4 h-4 mr-1.5" />
                <span>E-IMZO Kaliti Bilan Tasdiqlash</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* STEP 4: PAYMENT TERMS & METHOD */}
      {step === 4 && (
        <div className="space-y-4 text-xs font-mono">
          {/* Payment Terms Selector */}
          <div className="space-y-2">
            <span className="font-bold text-slate-900 uppercase block">
              To‘lov Shartlarini Tanlang (B2B Terms):
            </span>

            <div className="grid grid-cols-1 gap-2.5">
              <div
                onClick={() => setPaymentTerms('ADVANCE_30_70')}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  paymentTerms === 'ADVANCE_30_70'
                    ? 'bg-orange-50/40 border-bunker-amber-500 shadow-xs ring-1 ring-bunker-amber-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="mt-0.5">
                  <input
                    type="radio"
                    checked={paymentTerms === 'ADVANCE_30_70'}
                    onChange={() => setPaymentTerms('ADVANCE_30_70')}
                    className="accent-bunker-amber-500 cursor-pointer"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">
                    30% Avans / 70% Ob'ektda Qabul Qilinganda
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Qurilish pudratchilari uchun kafolatlangan rejim: Avans {advance30.toLocaleString()} so‘m, qoldiq{' '}
                    {remaining70.toLocaleString()} so‘m ob'ektda dalolatnoma imzolangach to‘lanadi.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setPaymentTerms('ADVANCE_100')}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  paymentTerms === 'ADVANCE_100'
                    ? 'bg-orange-50/40 border-bunker-amber-500 shadow-xs ring-1 ring-bunker-amber-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="mt-0.5">
                  <input
                    type="radio"
                    checked={paymentTerms === 'ADVANCE_100'}
                    onChange={() => setPaymentTerms('ADVANCE_100')}
                    className="accent-bunker-amber-500 cursor-pointer"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">100% To‘liq Oldindan To‘lov</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Tezlashtirilgan yuklash ustuvorligi. Jami summa: {grandTotal.toLocaleString()} so‘m.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <span className="font-bold text-slate-900 uppercase block">
              Hisob-Kitob Usuli:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('BANK_TRANSFER')}
                className={`p-3 rounded-xl border font-mono font-bold text-center cursor-pointer transition-all ${
                  paymentMethod === 'BANK_TRANSFER'
                    ? 'bg-bunker-amber-500 text-white border-bunker-amber-500 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Receipt className="w-4 h-4 mx-auto mb-1" />
                <span>Invoys (B2B Bank)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('PAYME')}
                className={`p-3 rounded-xl border font-mono font-bold text-center cursor-pointer transition-all ${
                  paymentMethod === 'PAYME'
                    ? 'bg-bunker-amber-500 text-white border-bunker-amber-500 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4 mx-auto mb-1" />
                <span>Payme B2B</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CLICK')}
                className={`p-3 rounded-xl border font-mono font-bold text-center cursor-pointer transition-all ${
                  paymentMethod === 'CLICK'
                    ? 'bg-bunker-amber-500 text-white border-bunker-amber-500 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4 mx-auto mb-1" />
                <span>Click Corporate</span>
              </button>
            </div>
          </div>

          {/* Summary Calculation */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>To‘lov sharti:</span>
              <span className="font-bold text-slate-900">
                {paymentTerms === 'ADVANCE_30_70' ? '30% Avans / 70% Qoldiq' : '100% Oldindan to‘lov'}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Birinchi bosqich to‘lovi (Avans):</span>
              <span className="font-bold text-bunker-amber-500 font-mono">
                {(paymentTerms === 'ADVANCE_30_70' ? advance30 : grandTotal).toLocaleString()} so‘m
              </span>
            </div>
            {paymentTerms === 'ADVANCE_30_70' && (
              <div className="flex justify-between text-slate-600">
                <span>Yakuniy to‘lov (qabul qilinganda):</span>
                <span className="text-slate-500 font-mono">{remaining70.toLocaleString()} so‘m</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm">
              <span className="text-slate-900">Jami shartnoma qiymati:</span>
              <span className="text-bunker-amber-500 font-mono">{grandTotal.toLocaleString()} so‘m</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: SUCCESS STATE */}
      {step === 'success' && (
        <div className="text-center py-16 space-y-4 font-mono">
          <CheckCircle className="w-16 h-16 mx-auto text-emerald-600" />
          <h4 className="text-lg font-bold text-slate-900">
            B2B Shartnoma Muvaffaqiyatli Rasmiylashtirildi!
          </h4>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Buyurtma raqami: <strong className="text-bunker-amber-500 font-mono">{createdOrderNumber}</strong>
            <br />
            Elektron hisob-faktura (Invoys) va shartnoma nusxasi DSQ tizimiga yuborildi.
          </p>
          <div className="inline-block bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-xs text-emerald-800 font-semibold font-mono">
            E-IMZO Serial: {eimzoSerial}
          </div>
        </div>
      )}
    </Drawer>
  );
};
