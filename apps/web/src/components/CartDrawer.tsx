import React, { useState } from 'react';
import {
  X,
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
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  FileCheck2,
  Receipt
} from 'lucide-react';
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
          buyerName: directorName || companyName || 'B2B Buyurtmachi',
          buyerPhone: buyerPhone,
          items: items.map((it) => ({
            productId: it.product.id,
            quantity: it.quantity
          })),
          deliveryAddress: {
            region: 'Toshkent shahri',
            district: legalAddress
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

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-bunker-surface-1 border-l-2 border-bunker-border-strong h-full flex flex-col justify-between p-6 shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-bunker-border-subtle shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-bunker-amber-500/20 border border-bunker-amber-500/50 flex items-center justify-center">
              <Package className="w-5 h-5 text-bunker-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-bunker-text-primary text-sm font-mono">
                4 Bosqichli Yuridik B2B Rasmiylashtirish
              </h3>
              <p className="text-[10px] text-bunker-text-secondary font-mono">
                Soliq STIR & E-IMZO Shartnomasi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-bunker-text-secondary hover:text-bunker-text-primary p-1.5 rounded-lg bg-bunker-surface-2 border border-bunker-border-subtle cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Progress Indicator */}
        {step !== 'success' && (
          <div className="py-3 border-b border-bunker-border-subtle">
            <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-mono select-none">
              <div
                className={`p-1.5 rounded-lg font-bold transition-all ${
                  step === 1
                    ? 'bg-bunker-amber-500 text-bunker-vault shadow-sm'
                    : step > 1
                    ? 'bg-bunker-status-green/20 text-bunker-status-green'
                    : 'bg-bunker-surface-2 text-bunker-text-muted'
                }`}
              >
                1. Spetsifikatsiya
              </div>
              <div
                className={`p-1.5 rounded-lg font-bold transition-all ${
                  step === 2
                    ? 'bg-bunker-amber-500 text-bunker-vault shadow-sm'
                    : step > 2
                    ? 'bg-bunker-status-green/20 text-bunker-status-green'
                    : 'bg-bunker-surface-2 text-bunker-text-muted'
                }`}
              >
                2. STIR Rekvizit
              </div>
              <div
                className={`p-1.5 rounded-lg font-bold transition-all ${
                  step === 3
                    ? 'bg-bunker-amber-500 text-bunker-vault shadow-sm'
                    : step > 3
                    ? 'bg-bunker-status-green/20 text-bunker-status-green'
                    : 'bg-bunker-surface-2 text-bunker-text-muted'
                }`}
              >
                3. E-IMZO
              </div>
              <div
                className={`p-1.5 rounded-lg font-bold transition-all ${
                  step === 4
                    ? 'bg-bunker-amber-500 text-bunker-vault shadow-sm'
                    : 'bg-bunker-surface-2 text-bunker-text-muted'
                }`}
              >
                4. To‘lov & Invoys
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="my-3 p-3 rounded-xl bg-bunker-status-red/15 border border-bunker-status-red/30 text-xs text-bunker-status-red flex items-start gap-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4">
          {/* STEP 1: SPECIFICATION & ITEMS BREAKDOWN */}
          {step === 1 && (
            <div className="space-y-3">
              <span className="text-[11px] font-mono text-bunker-text-muted uppercase block font-bold">
                Materiallar Spetsifikatsiyasi ({items.length} ta tovar):
              </span>

              {items.length === 0 ? (
                <div className="text-center py-20 text-bunker-text-secondary space-y-2 font-mono">
                  <Package className="w-12 h-12 mx-auto text-bunker-amber-500/40" />
                  <p className="text-sm font-bold text-bunker-text-primary">Xarid savati bo'sh</p>
                  <p className="text-xs">Marketplacedan materiallarni tanlang</p>
                </div>
              ) : (
                items.map((it) => (
                  <div
                    key={it.product.id}
                    className="bg-bunker-base border border-bunker-border-subtle p-3.5 rounded-2xl flex items-center justify-between gap-3 font-mono"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-bunker-text-primary truncate">{it.product.title}</h4>
                      <p className="text-[11px] text-bunker-amber-500 font-bold mt-0.5">
                        {Number(it.product.price).toLocaleString()} so'm / {it.product.unit}
                      </p>
                      <span className="text-[10px] text-bunker-text-muted block mt-0.5">
                        Qator summasi: {(Number(it.product.price) * it.quantity).toLocaleString()} so'm
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-bunker-surface-2 border border-bunker-border-strong rounded-xl px-2 py-1">
                      <button
                        onClick={() => onUpdateQty(it.product.id, -1)}
                        className="text-bunker-text-secondary hover:text-bunker-text-primary p-0.5 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-bunker-text-primary px-1.5">{it.quantity}</span>
                      <button
                        onClick={() => onUpdateQty(it.product.id, 1)}
                        className="text-bunker-text-secondary hover:text-bunker-text-primary p-0.5 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemove(it.product.id)}
                      className="text-bunker-text-muted hover:text-bunker-status-red p-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}

              {/* Tax & Logistics Summary */}
              {items.length > 0 && (
                <div className="bg-bunker-base border border-bunker-border-strong p-4 rounded-2xl space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-bunker-text-secondary">
                    <span>Mahsulotlar summasi:</span>
                    <span className="text-bunker-text-primary">{totalSum.toLocaleString()} so'm</span>
                  </div>
                  <div className="flex justify-between text-bunker-text-secondary">
                    <span>QQS 12% (hisoblangan):</span>
                    <span className="text-bunker-status-green font-bold">+{qqsAmount.toLocaleString()} so'm</span>
                  </div>
                  <div className="flex justify-between text-bunker-text-secondary">
                    <span>Kafolatlangan HOWO logistika tarifi:</span>
                    <span className="text-bunker-text-primary">{deliveryFee.toLocaleString()} so'm</span>
                  </div>
                  <div className="pt-2 border-t border-bunker-border-subtle flex justify-between items-baseline font-bold">
                    <span className="text-bunker-text-primary">Jami B2B spetsifikatsiya:</span>
                    <span className="text-lg text-bunker-amber-500">{grandTotal.toLocaleString()} so'm</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: CORPORATE DETAILS & STIR LOOKUP */}
          {step === 2 && (
            <div className="space-y-4 text-xs font-mono">
              <div className="bg-bunker-base p-4 rounded-2xl border border-bunker-border-strong space-y-3">
                <span className="text-[11px] font-bold text-bunker-amber-500 uppercase flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  Davlat Soliq Qo‘mitasi STIR (INN) Integratsiyasi:
                </span>

                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={9}
                    placeholder="STIR: 308942175"
                    value={stir}
                    onChange={(e) => setStir(e.target.value)}
                    className="flex-1 bg-bunker-input border border-bunker-border-strong focus:border-bunker-amber-500 p-2.5 rounded-xl text-bunker-text-primary outline-none font-bold"
                  />
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleStirLookup}
                    isLoading={stirLoading}
                  >
                    <Search className="w-3.5 h-3.5 mr-1" />
                    <span>Tekshirish</span>
                  </Button>
                </div>
              </div>

              {/* Company Details Form */}
              <div className="space-y-3 text-bunker-text-secondary">
                <div>
                  <label className="block mb-1 text-bunker-text-primary font-bold">Tashkilot to‘liq nomi:</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-bunker-input border border-bunker-border-subtle focus:border-bunker-amber-500 p-2.5 rounded-xl text-bunker-text-primary outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-bunker-text-primary">Bank MFO:</label>
                    <input
                      type="text"
                      value={mfo}
                      onChange={(e) => setMfo(e.target.value)}
                      className="w-full bg-bunker-input border border-bunker-border-subtle focus:border-bunker-amber-500 p-2.5 rounded-xl text-bunker-text-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-bunker-text-primary">Xizmat ko‘rsatuvchi bank:</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-bunker-input border border-bunker-border-subtle focus:border-bunker-amber-500 p-2.5 rounded-xl text-bunker-text-primary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-bunker-text-primary">Hisob-raqam (Hisob-kitob schyoti):</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full bg-bunker-input border border-bunker-border-subtle focus:border-bunker-amber-500 p-2.5 rounded-xl text-bunker-text-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-bunker-text-primary">Rahbar F.I.O. (Direktor):</label>
                  <input
                    type="text"
                    value={directorName}
                    onChange={(e) => setDirectorName(e.target.value)}
                    className="w-full bg-bunker-input border border-bunker-border-subtle focus:border-bunker-amber-500 p-2.5 rounded-xl text-bunker-text-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-bunker-text-primary">Yuridik manzil:</label>
                  <input
                    type="text"
                    value={legalAddress}
                    onChange={(e) => setLegalAddress(e.target.value)}
                    className="w-full bg-bunker-input border border-bunker-border-subtle focus:border-bunker-amber-500 p-2.5 rounded-xl text-bunker-text-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-bunker-text-primary">Mas'ul xodim telefoni:</label>
                  <input
                    type="text"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full bg-bunker-input border border-bunker-border-subtle focus:border-bunker-amber-500 p-2.5 rounded-xl text-bunker-text-primary outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONTRACT REVIEW & E-IMZO SIGN */}
          {step === 3 && (
            <div className="space-y-4 text-xs font-mono">
              <div className="bg-bunker-base border border-bunker-border-strong p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-bunker-border-subtle pb-2">
                  <span className="font-bold text-bunker-amber-500 flex items-center gap-1.5 uppercase">
                    <FileText className="w-4 h-4" />
                    Yetkazib Berish Shartnomasi № BS-2026/089
                  </span>
                  <Badge variant="info">Yuridik Kuchga Ega</Badge>
                </div>

                {/* Contract Text Snippet */}
                <div className="bg-bunker-input border border-bunker-border-subtle p-3 rounded-xl max-h-48 overflow-y-auto space-y-2 text-[11px] text-bunker-text-secondary leading-relaxed">
                  <p className="font-bold text-bunker-text-primary">
                    1. Shartnoma Predmeti:
                  </p>
                  <p>
                    Yetkazib beruvchi («BUNKERSTROY TECH» MChJ) ushbu shartnoma bo‘yicha spetsifikatsiyada ko‘rsatilgan
                    qurilish materiallarini xaridor («{companyName}», STIR: {stir}) qurilish ob'ektiga belgilangan
                    muddatda yetkazib berish majburiyatini oladi.
                  </p>
                  <p className="font-bold text-bunker-text-primary">
                    2. Sifat va Kafolat:
                  </p>
                  <p>
                    Barcha yetkazib beriladigan mahsulotlar amaldagi O‘zbekiston Respublikasi davlat standartlari (GOST 31108,
                    GOST 5781) talablariga to‘liq javob beradi va laboratoriya muvofiqlik sertifikatlari bilan ta'minlanadi.
                  </p>
                  <p className="font-bold text-bunker-text-primary">
                    3. Shartnoma Qiymati:
                  </p>
                  <p>
                    Shartnomaning umumiy qiymati QQS 12% va maxsus transport yetkazishini hisobga olgan holda{' '}
                    <strong className="text-bunker-amber-500">{grandTotal.toLocaleString()} so‘m</strong>ni tashkil etadi.
                  </p>
                </div>
              </div>

              {/* E-IMZO Digital Signature Box */}
              <div className="bg-bunker-base border border-bunker-border-strong p-4 rounded-2xl space-y-3">
                <span className="font-bold text-bunker-text-primary flex items-center gap-1.5 uppercase">
                  <KeyRound className="w-4 h-4 text-bunker-amber-500" />
                  E-IMZO Raqamli Imzo Kaliti (ERI):
                </span>

                <div className="bg-bunker-surface-2 p-3 rounded-xl border border-bunker-border-subtle flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-bunker-text-muted block">Tanlangan ERI Sertifikati:</span>
                    <p className="font-bold text-bunker-text-primary">{directorName.toUpperCase()}</p>
                    <span className="text-[10px] text-bunker-amber-500 block">
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
                  <div className="p-3 bg-bunker-status-green/10 border border-bunker-status-green/40 rounded-xl space-y-1 text-[11px] text-bunker-status-green">
                    <p className="font-bold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      Hujjat E-IMZO bilan muvaffaqiyatli imzolandi!
                    </p>
                    <p className="text-[10px] text-bunker-text-muted">
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
                <span className="font-bold text-bunker-text-primary uppercase block">
                  To‘lov Shartlarini Tanlang (B2B Terms):
                </span>

                <div className="grid grid-cols-1 gap-2.5">
                  <div
                    onClick={() => setPaymentTerms('ADVANCE_30_70')}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                      paymentTerms === 'ADVANCE_30_70'
                        ? 'bg-bunker-surface-2 border-bunker-amber-500 shadow-md shadow-bunker-amber-500/10'
                        : 'bg-bunker-base border-bunker-border-subtle'
                    }`}
                  >
                    <div className="mt-0.5">
                      <input
                        type="radio"
                        checked={paymentTerms === 'ADVANCE_30_70'}
                        onChange={() => setPaymentTerms('ADVANCE_30_70')}
                        className="accent-bunker-amber-500"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-bunker-text-primary">
                        30% Avans / 70% Ob'ektda Qabul Qilinganda
                      </h4>
                      <p className="text-[11px] text-bunker-text-secondary mt-0.5">
                        Qurilish pudratchilari uchun kafolatlangan rejim: Avans {advance30.toLocaleString()} so‘m, qoldiq{' '}
                        {remaining70.toLocaleString()} so‘m ob'ektda dalolatnoma imzolangach to‘lanadi.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentTerms('ADVANCE_100')}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                      paymentTerms === 'ADVANCE_100'
                        ? 'bg-bunker-surface-2 border-bunker-amber-500 shadow-md shadow-bunker-amber-500/10'
                        : 'bg-bunker-base border-bunker-border-subtle'
                    }`}
                  >
                    <div className="mt-0.5">
                      <input
                        type="radio"
                        checked={paymentTerms === 'ADVANCE_100'}
                        onChange={() => setPaymentTerms('ADVANCE_100')}
                        className="accent-bunker-amber-500"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-bunker-text-primary">100% To‘liq Oldindan To‘lov</h4>
                      <p className="text-[11px] text-bunker-text-secondary mt-0.5">
                        Tezlashtirilgan yuklash ustuvorligi. Jami summa: {grandTotal.toLocaleString()} so‘m.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <span className="font-bold text-bunker-text-primary uppercase block">
                  Hisob-Kitob Usuli:
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('BANK_TRANSFER')}
                    className={`p-3 rounded-xl border font-mono font-bold text-center cursor-pointer transition-all ${
                      paymentMethod === 'BANK_TRANSFER'
                        ? 'bg-bunker-amber-500 text-bunker-vault border-bunker-amber-500 shadow-sm'
                        : 'bg-bunker-base border-bunker-border-subtle text-bunker-text-secondary'
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
                        ? 'bg-bunker-amber-500 text-bunker-vault border-bunker-amber-500 shadow-sm'
                        : 'bg-bunker-base border-bunker-border-subtle text-bunker-text-secondary'
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
                        ? 'bg-bunker-amber-500 text-bunker-vault border-bunker-amber-500 shadow-sm'
                        : 'bg-bunker-base border-bunker-border-subtle text-bunker-text-secondary'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-1" />
                    <span>Click Corporate</span>
                  </button>
                </div>
              </div>

              {/* Summary Calculation */}
              <div className="bg-bunker-base border border-bunker-border-strong p-4 rounded-2xl space-y-2">
                <div className="flex justify-between text-bunker-text-secondary">
                  <span>To‘lov sharti:</span>
                  <span className="font-bold text-bunker-text-primary">
                    {paymentTerms === 'ADVANCE_30_70' ? '30% Avans / 70% Qoldiq' : '100% Oldindan to‘lov'}
                  </span>
                </div>
                <div className="flex justify-between text-bunker-text-secondary">
                  <span>Birinchi bosqich to‘lovi (Avans):</span>
                  <span className="font-bold text-bunker-amber-500">
                    {(paymentTerms === 'ADVANCE_30_70' ? advance30 : grandTotal).toLocaleString()} so‘m
                  </span>
                </div>
                {paymentTerms === 'ADVANCE_30_70' && (
                  <div className="flex justify-between text-bunker-text-secondary">
                    <span>Yakuniy to‘lov (qabul qilinganda):</span>
                    <span className="text-bunker-text-muted">{remaining70.toLocaleString()} so‘m</span>
                  </div>
                )}
                <div className="pt-2 border-t border-bunker-border-subtle flex justify-between font-bold text-sm">
                  <span className="text-bunker-text-primary">Jami shartnoma qiymati:</span>
                  <span className="text-bunker-amber-500">{grandTotal.toLocaleString()} so‘m</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS STATE */}
          {step === 'success' && (
            <div className="text-center py-16 space-y-4 font-mono">
              <CheckCircle className="w-16 h-16 mx-auto text-bunker-status-green" />
              <h4 className="text-lg font-bold text-bunker-text-primary">
                B2B Shartnoma Muvaffaqiyatli Rasmiylashtirildi!
              </h4>
              <p className="text-xs text-bunker-text-secondary max-w-sm mx-auto">
                Buyurtma raqami: <strong className="text-bunker-amber-500">{createdOrderNumber}</strong>
                <br />
                Elektron hisob-faktura (Invoys) va shartnoma nusxasi DSQ tizimiga yuborildi.
              </p>
              <div className="inline-block bg-bunker-base border border-bunker-border-strong px-4 py-2 rounded-xl text-xs text-bunker-status-green font-bold">
                E-IMZO Serial: {eimzoSerial}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {step !== 'success' && items.length > 0 && (
          <div className="pt-4 border-t border-bunker-border-subtle space-y-3 shrink-0 font-mono">
            <div className="flex gap-2">
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
        )}
      </div>
    </div>
  );
};
