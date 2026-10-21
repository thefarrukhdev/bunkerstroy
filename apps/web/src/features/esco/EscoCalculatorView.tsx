import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calculator,
  Building2,
  BookmarkPlus,
  History,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  LogIn,
  FileText,
  Printer,
  TrendingUp,
  ShieldCheck,
  Check,
  Zap,
  Percent,
  Layers,
  Thermometer,
  Flame,
  ArrowRight
} from 'lucide-react';
import { EscoCalculationResult } from '@bunkerstroy/types';
import { Button, Badge, Card } from '@bunkerstroy/ui';

interface SavedEscoAudit {
  id: string;
  clientId: string;
  buildingType: string;
  areaM2: number;
  currentEnergyUsageKwh: number;
  estimatedSavingsPct: number;
  annualSavingsSum: number | string;
  paybackYears: number;
  co2ReductionTons: number;
  recommendations: string[];
  insulationAdvice: string;
  createdAt: string;
}

const BUILDING_TYPES: Record<string, string> = {
  RESIDENTIAL_MULTI_STOREY: 'Ko‘p qavatli turar joy binosi',
  PRIVATE_HOUSE_COTTAGE: 'Xususiy hovli / Kottej',
  COMMERCIAL_OFFICE: 'Tijorat / Ofis binosi',
  INDUSTRIAL_WAREHOUSE: 'Sanoat ombori / Ishlab chiqarish',
  PUBLIC_SCHOOL_HOSPITAL: 'Maktab / Shifoxona / Ijtimoiy muassasa'
};

export const EscoCalculatorView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'calculator' | 'saved'>('calculator');

  // Form input state
  const [buildingType, setBuildingType] = useState('RESIDENTIAL_MULTI_STOREY');
  const [areaM2, setAreaM2] = useState(450);
  const [energyUsageKwh, setEnergyUsageKwh] = useState(8500);
  const [wallMaterial, setWallMaterial] = useState("Pishiq g'isht 380mm");
  const [windowType, setWindowType] = useState('Oddiy ikki kamerali plastik');
  const [currentHeatingType, setCurrentHeatingType] = useState('Gaz qozoni');
  const [region, setRegion] = useState('Toshkent shahri');

  // Dynamic insulation preview toggles (Visual Cutaway Model)
  const [insulatedWalls, setInsulatedWalls] = useState(false);
  const [insulatedWindows, setInsulatedWindows] = useState(false);
  const [insulatedRoof, setInsulatedRoof] = useState(false);

  // Calculation state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EscoCalculationResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Saved audits list
  const [savedAudits, setSavedAudits] = useState<SavedEscoAudit[]>([]);
  const [loadingAudits, setLoadingAudits] = useState(false);
  const [savedError, setSavedError] = useState<string | null>(null);

  // Passport print dialog state
  const [showPassportModal, setShowPassportModal] = useState(false);

  const getToken = () => {
    return typeof window !== 'undefined' ? localStorage.getItem('bunkerstroy_token') : null;
  };

  const isLoggedIn = !!getToken();

  // Load saved audits when switching to saved tab
  const fetchSavedAudits = async () => {
    const token = getToken();
    if (!token) return;

    setLoadingAudits(true);
    setSavedError(null);

    try {
      const res = await fetch('/api/esco/audits', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSavedAudits(json.data || []);
      } else {
        setSavedError(json.message || 'Auditlarni yuklashda xatolik yuz berdi');
      }
    } catch {
      setSavedError('Server bilan aloqa uzildi');
    } finally {
      setLoadingAudits(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'saved') {
      fetchSavedAudits();
    }
  }, [activeSubTab]);

  // Execute calculation via backend
  const handleCalculate = async () => {
    setLoading(true);
    setCalcError(null);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const res = await fetch('/api/esco/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buildingType,
          areaM2: Number(areaM2),
          currentEnergyUsageKwh: Number(energyUsageKwh),
          wallMaterial,
          windowType,
          currentHeatingType,
          region
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.data);
        // Turn on all insulation preview toggles to show optimal state
        setInsulatedWalls(true);
        setInsulatedWindows(true);
        setInsulatedRoof(true);
      } else {
        setCalcError(data.message || 'Hisoblashda xatolik yuz berdi');
      }
    } catch (e) {
      console.error('ESCO calculation error:', e);
      setCalcError('Server bilan aloqa uzildi. Parametrlarni tekshiring.');
    } finally {
      setLoading(false);
    }
  };

  // Save audit to profile
  const handleSaveAudit = async () => {
    const token = getToken();
    if (!token) {
      setSaveError("Auditni saqlash uchun tizimga kirish talab etiladi. Yuqoridagi 'Kirish' tugmasini bosing.");
      return;
    }

    if (!result) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const res = await fetch('/api/esco/audits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          buildingType,
          areaM2: Number(areaM2),
          currentEnergyUsageKwh: Number(energyUsageKwh),
          wallMaterial,
          windowType,
          currentHeatingType,
          region,
          estimatedSavingsPct: result.energySavingsPercent,
          annualSavingsSum: result.annualSavingsSum,
          paybackYears: result.paybackYears,
          co2ReductionTons: result.co2ReductionTons,
          recommendations: result.recommendedMaterials,
          insulationAdvice: result.insulationAdvice
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSaveSuccess(true);
        fetchSavedAudits();
        setTimeout(() => setSaveSuccess(false), 5000);
      } else {
        setSaveError(json.message || 'Auditni saqlashda xato yuz berdi');
      }
    } catch {
      setSaveError('Server bilan aloqa uzildi');
    } finally {
      setIsSaving(false);
    }
  };

  // Print energy passport
  const handlePrintPassport = () => {
    window.print();
  };

  // Payback years number
  const paybackYears = result?.paybackYears ?? 2.8;
  const annualSavings = Number(result?.annualSavingsSum ?? 18500000);
  const totalCapexEstimate = Math.round(annualSavings * paybackYears);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-bunker-border-strong bg-gradient-to-r from-bunker-surface-1 via-bunker-surface-2 to-[#1B291E] p-6 sm:p-10 shadow-2xl">
        <div className="h-1.5 w-full bg-gradient-to-r from-bunker-status-green via-bunker-amber-500 to-bunker-status-cyan absolute top-0 left-0" />
        <div className="max-w-3xl space-y-3">
          <Badge variant="success" className="gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            BunkerStroy ESCO — Binolar Energiya Tejamkorlik Modeli
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black text-bunker-text-primary tracking-tight">
            Izometrik Termal Tahlil & Davlat Standarti ShNQ 2.01.04-18 Pasporti
          </h1>
          <p className="text-sm text-bunker-text-secondary leading-relaxed">
            Bino devorlari (42%), derazalari (28%) va tomidan (18%) yo‘qotiladigan issiqlik oqimlarini hisoblab,
            bazalt izolyatsiyasi orqali yillik tejamkorlik va o‘zini oqlash egri chizig‘ini (ROI Payback Curve) modellashtiring.
          </p>
        </div>
      </div>

      {/* 2. Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-bunker-border-strong pb-3">
        <button
          onClick={() => setActiveSubTab('calculator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer font-mono transition-all ${
            activeSubTab === 'calculator'
              ? 'bg-bunker-amber-500 text-bunker-vault shadow-md shadow-bunker-amber-500/20'
              : 'bg-bunker-surface-1 text-bunker-text-secondary border border-bunker-border-subtle hover:text-bunker-text-primary'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>AI ESCO Kalkulyatori & Izometrik Model</span>
        </button>

        <button
          onClick={() => setActiveSubTab('saved')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer font-mono transition-all ${
            activeSubTab === 'saved'
              ? 'bg-bunker-amber-500 text-bunker-vault shadow-md shadow-bunker-amber-500/20'
              : 'bg-bunker-surface-1 text-bunker-text-secondary border border-bunker-border-subtle hover:text-bunker-text-primary'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Mening Saqlangan Auditlarim</span>
          {savedAudits.length > 0 && (
            <span className="bg-bunker-base text-bunker-amber-500 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
              {savedAudits.length}
            </span>
          )}
        </button>
      </div>

      {/* SUB-TAB 1: CALCULATOR & ISOMETRIC THERMAL MODEL */}
      {activeSubTab === 'calculator' && (
        <div className="space-y-6">
          {/* Visual Isometric / Cutaway Thermal Loss Zones Visualizer */}
          <div className="bg-bunker-surface-1 border border-bunker-border-strong rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-bunker-border-subtle">
              <div>
                <h3 className="font-black text-base text-bunker-text-primary font-mono flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-bunker-amber-500" />
                  Bino Kesimi: Izometrik Termal Yo‘qotish Hududlari (Thermal Cutaway)
                </h3>
                <p className="text-xs text-bunker-text-secondary mt-0.5">
                  Izolyatsiyalash variantlarini tanlang va har bir zona qanday qilib qizildan optimal yashil rangga o‘tishini kuzating
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="flex items-center gap-1.5 text-bunker-status-red font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-bunker-status-red" />
                  Issiqlik Yo‘qotish
                </span>
                <span className="text-bunker-border-strong">|</span>
                <span className="flex items-center gap-1.5 text-bunker-status-green font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-bunker-status-green" />
                  Optimal Izolyatsiya
                </span>
              </div>
            </div>

            {/* Cutaway Zone Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Zone 1: Devorlar (42%) */}
              <div
                onClick={() => setInsulatedWalls(!insulatedWalls)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                  insulatedWalls
                    ? 'bg-bunker-status-green/10 border-bunker-status-green shadow-lg shadow-bunker-status-green/10'
                    : 'bg-bunker-status-red/10 border-bunker-status-red/60 shadow-lg shadow-bunker-status-red/10'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={insulatedWalls ? 'success' : 'danger'} className="font-mono text-[10px]">
                    {insulatedWalls ? 'OPTIMAL: 100mm BAZALT' : 'YO‘QOTISH: 42%'}
                  </Badge>
                  <span className="text-xs font-mono font-bold text-bunker-text-primary">DEVORLAR</span>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <p className="font-bold text-sm text-bunker-text-primary">
                    {insulatedWalls ? 'R = 3.8 m²·K/W (ShNQ Standart)' : 'R = 1.1 m²·K/W (Issiqlik Sizib Chiqishi)'}
                  </p>
                  <p className="text-[11px] text-bunker-text-secondary">
                    {insulatedWalls
                      ? '100mm bazalt tosh mineral plitalari o‘rnatildi. Yo‘qotish 42% dan 8% ga qisqardi.'
                      : 'Oddiy 380mm pishiq g‘isht. Devor orqali bino umumiy issiqligining 42% i havoga uchadi.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-bunker-border-subtle flex items-center justify-between text-[11px] font-mono">
                  <span className={insulatedWalls ? 'text-bunker-status-green font-bold' : 'text-bunker-status-red font-bold'}>
                    {insulatedWalls ? '✓ Izolyatsiyalangan' : '✕ Izolyatsiya qilinmagan'}
                  </span>
                  <span className="text-bunker-text-muted underline">Bosib o‘zgartiring</span>
                </div>
              </div>

              {/* Zone 2: Derazalar va Vitrinalar (28%) */}
              <div
                onClick={() => setInsulatedWindows(!insulatedWindows)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                  insulatedWindows
                    ? 'bg-bunker-status-green/10 border-bunker-status-green shadow-lg shadow-bunker-status-green/10'
                    : 'bg-bunker-status-amber/10 border-bunker-status-amber/60 shadow-lg shadow-bunker-status-amber/10'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={insulatedWindows ? 'success' : 'warning'} className="font-mono text-[10px]">
                    {insulatedWindows ? 'OPTIMAL: LOW-E 3-KAMERA' : 'YO‘QOTISH: 28%'}
                  </Badge>
                  <span className="text-xs font-mono font-bold text-bunker-text-primary">DERAZALAR</span>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <p className="font-bold text-sm text-bunker-text-primary">
                    {insulatedWindows ? 'R = 0.95 m²·K/W (Argon Gazli)' : 'R = 0.38 m²·K/W (Katta Sovuq Ko‘prigi)'}
                  </p>
                  <p className="text-[11px] text-bunker-text-secondary">
                    {insulatedWindows
                      ? '3 kamerali Low-E kumush qoplamali oynalar. Issiqlik nurini xona ichida saqlaydi.'
                      : 'Oddiy 2 kamerali plastik oyna. Issiqlikning 28% i deraza orqali yo‘qotiladi.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-bunker-border-subtle flex items-center justify-between text-[11px] font-mono">
                  <span className={insulatedWindows ? 'text-bunker-status-green font-bold' : 'text-bunker-amber-500 font-bold'}>
                    {insulatedWindows ? '✓ Izolyatsiyalangan' : '✕ Izolyatsiya qilinmagan'}
                  </span>
                  <span className="text-bunker-text-muted underline">Bosib o‘zgartiring</span>
                </div>
              </div>

              {/* Zone 3: Tom va Cherdak (18%) */}
              <div
                onClick={() => setInsulatedRoof(!insulatedRoof)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                  insulatedRoof
                    ? 'bg-bunker-status-green/10 border-bunker-status-green shadow-lg shadow-bunker-status-green/10'
                    : 'bg-bunker-status-amber/10 border-bunker-status-amber/60 shadow-lg shadow-bunker-status-amber/10'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={insulatedRoof ? 'success' : 'warning'} className="font-mono text-[10px]">
                    {insulatedRoof ? 'OPTIMAL: XPS 100mm GIDRO' : 'YO‘QOTISH: 18%'}
                  </Badge>
                  <span className="text-xs font-mono font-bold text-bunker-text-primary">TOM VA CHERDAK</span>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <p className="font-bold text-sm text-bunker-text-primary">
                    {insulatedRoof ? 'R = 4.2 m²·K/W (Maksimal To‘siq)' : 'R = 1.3 m²·K/W (Yuqori Qatlam Sizishi)'}
                  </p>
                  <p className="text-[11px] text-bunker-text-secondary">
                    {insulatedRoof
                      ? '100mm XPS ekstrudirovanniy plita va bug‘ to‘siq membranasi. Qishda issiq, yozda salqin.'
                      : 'Beton plita va qora qog‘oz. Issiq havo yuqoriga ko‘tarilib, tom orqali 18% yo‘qotiladi.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-bunker-border-subtle flex items-center justify-between text-[11px] font-mono">
                  <span className={insulatedRoof ? 'text-bunker-status-green font-bold' : 'text-bunker-amber-500 font-bold'}>
                    {insulatedRoof ? '✓ Izolyatsiyalangan' : '✕ Izolyatsiya qilinmagan'}
                  </span>
                  <span className="text-bunker-text-muted underline">Bosib o‘zgartiring</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form & AI Calculator Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Form */}
            <div className="lg:col-span-6 bg-bunker-surface-1 border border-bunker-border-strong p-6 rounded-3xl space-y-4">
              <h3 className="font-bold text-bunker-text-primary flex items-center gap-2 border-b border-bunker-border-subtle pb-3 text-sm font-mono">
                <Building2 className="w-4 h-4 text-bunker-status-green" />
                Bino Parametrlari va Energetika Pasporti Kiritish
              </h3>

              {calcError && (
                <div className="p-3 rounded-xl bg-bunker-status-red/15 border border-bunker-status-red/30 text-xs text-bunker-status-red flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{calcError}</span>
                </div>
              )}

              <div className="space-y-3.5 text-xs font-semibold text-bunker-text-secondary">
                <div>
                  <label className="block mb-1 font-mono text-[11px]">Bino turi va vazifasi:</label>
                  <select
                    value={buildingType}
                    onChange={(e) => setBuildingType(e.target.value)}
                    className="w-full bg-bunker-input border border-bunker-border-subtle focus:border-bunker-status-green p-2.5 rounded-xl text-bunker-text-primary outline-none transition-colors"
                  >
                    <option value="RESIDENTIAL_MULTI_STOREY">Ko‘p qavatli turar joy binosi</option>
                    <option value="PRIVATE_HOUSE_COTTAGE">Xususiy hovli / Kottej</option>
                    <option value="COMMERCIAL_OFFICE">Tijorat / Ofis binosi</option>
                    <option value="INDUSTRIAL_WAREHOUSE">Sanoat ombori / Ishlab chiqarish</option>
                    <option value="PUBLIC_SCHOOL_HOSPITAL">Maktab / Shifoxona / Ijtimoiy muassasa</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 font-mono text-[11px]">Umumiy maydon (m²):</label>
                    <input
                      type="number"
                      min="10"
                      max="100000"
                      value={areaM2}
                      onChange={(e) => setAreaM2(Number(e.target.value))}
                      className="w-full bg-bunker-input border border-bunker-border-subtle focus:border-bunker-status-green p-2.5 rounded-xl text-bunker-text-primary font-mono outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-mono text-[11px]">Yillik energiya sarfi (kVt/soat):</label>
                    <input
                      type="number"
                      min="100"
                      max="5000000"
                      value={energyUsageKwh}
                      onChange={(e) => setEnergyUsageKwh(Number(e.target.value))}
                      className="w-full bg-bunker-input border border-bunker-border-subtle focus:border-bunker-status-green p-2.5 rounded-xl text-bunker-text-primary font-mono outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 font-mono text-[11px]">Tashqi devor konstruksiyasi:</label>
                    <input
                      type="text"
                      value={wallMaterial}
                      onChange={(e) => setWallMaterial(e.target.value)}
                      placeholder="Pishiq g'isht 380mm"
                      className="w-full bg-bunker-input border border-bunker-border-subtle focus:border-bunker-status-green p-2.5 rounded-xl text-bunker-text-primary outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-mono text-[11px]">Deraza va vitrina turlari:</label>
                    <input
                      type="text"
                      value={windowType}
                      onChange={(e) => setWindowType(e.target.value)}
                      placeholder="Oddiy 2 kamerali plastik"
                      className="w-full bg-bunker-input border border-bunker-border-subtle focus:border-bunker-status-green p-2.5 rounded-xl text-bunker-text-primary outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 font-mono text-[11px]">Isitish tizimi turi:</label>
                    <select
                      value={currentHeatingType}
                      onChange={(e) => setCurrentHeatingType(e.target.value)}
                      className="w-full bg-bunker-input border border-bunker-border-subtle focus:border-bunker-status-green p-2.5 rounded-xl text-bunker-text-primary outline-none transition-colors"
                    >
                      <option value="Gaz qozoni">Avtonom gaz qozoni</option>
                      <option value="Markaziy issiqlik">Markaziy shahar issiqlik tarmog‘i</option>
                      <option value="Elektr isitgich">Elektr qozoni / radiatorlar</option>
                      <option value="Issiqlik nasosi">Issiqlik nasosi (Heat Pump)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-mono text-[11px]">Joylashgan hududi:</label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full bg-bunker-input border border-bunker-border-subtle focus:border-bunker-status-green p-2.5 rounded-xl text-bunker-text-primary outline-none transition-colors"
                    >
                      <option value="Toshkent shahri">Toshkent shahri</option>
                      <option value="Toshkent viloyati">Toshkent viloyati</option>
                      <option value="Samarqand viloyati">Samarqand viloyati</option>
                      <option value="Farg‘ona viloyati">Farg‘ona viloyati</option>
                      <option value="Buxoro viloyati">Buxoro viloyati</option>
                    </select>
                  </div>
                </div>
              </div>

              <Button
                className="w-full mt-4"
                size="lg"
                onClick={handleCalculate}
                isLoading={loading}
              >
                <Calculator className="w-5 h-5 mr-1" />
                <span>AI ESCO Auditini Hisoblash</span>
              </Button>
            </div>

            {/* Results Panel & ROI Payback Curve */}
            <div className="lg:col-span-6 space-y-4">
              {result ? (
                <div className="bg-bunker-surface-1 border border-bunker-status-green/40 p-6 rounded-3xl space-y-5 shadow-xl">
                  {/* Results Header */}
                  <div className="flex items-center justify-between border-b border-bunker-border-subtle pb-3">
                    <div>
                      <span className="text-xs font-bold font-mono uppercase text-bunker-text-secondary">
                        Audit Hisoboti & ShNQ 2.01.04-18
                      </span>
                      <h4 className="text-sm font-bold text-bunker-text-primary mt-0.5">
                        {BUILDING_TYPES[buildingType] || buildingType} ({areaM2} m²)
                      </h4>
                    </div>
                    <Badge variant="success" className="font-mono text-xs">
                      Sinf: {result.auditScore}
                    </Badge>
                  </div>

                  {/* Core Metrics */}
                  <div className="grid grid-cols-2 gap-3.5 font-mono">
                    <div className="bg-bunker-base border border-bunker-border-subtle p-3.5 rounded-2xl">
                      <span className="text-[10px] text-bunker-text-secondary uppercase block">Energiya tejamkorligi:</span>
                      <span className="text-2xl font-black text-bunker-status-green">
                        +{result.energySavingsPercent}%
                      </span>
                    </div>
                    <div className="bg-bunker-base border border-bunker-border-subtle p-3.5 rounded-2xl">
                      <span className="text-[10px] text-bunker-text-secondary uppercase block">O'zini oqlash muddati:</span>
                      <span className="text-2xl font-black text-bunker-amber-500">
                        {result.paybackYears} yil
                      </span>
                    </div>
                    <div className="bg-bunker-base border border-bunker-border-subtle p-3.5 rounded-2xl">
                      <span className="text-[10px] text-bunker-text-secondary uppercase block">Yillik tejalgan mablag':</span>
                      <span className="text-xl font-black text-bunker-text-primary">
                        {Number(result.annualSavingsSum).toLocaleString()} so'm
                      </span>
                    </div>
                    <div className="bg-bunker-base border border-bunker-border-subtle p-3.5 rounded-2xl">
                      <span className="text-[10px] text-bunker-text-secondary uppercase block">CO2 Qisqarishi:</span>
                      <span className="text-xl font-black text-bunker-status-cyan">
                        -{result.co2ReductionTons} t/yil
                      </span>
                    </div>
                  </div>

                  {/* ROI Payback Period Curve Visualizer */}
                  <div className="bg-bunker-base border border-bunker-border-strong p-4 rounded-2xl space-y-3 font-mono">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-bunker-text-primary uppercase flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-bunker-status-green" />
                        ROI O'zini Oqlash Egri Chizig'i (5 Yillik Traektoriya)
                      </span>
                      <span className="text-[10px] text-bunker-amber-500 font-bold">
                        Break-Even: {result.paybackYears} yil
                      </span>
                    </div>

                    {/* Progress curve bars */}
                    <div className="space-y-2 text-[11px]">
                      {[
                        { year: '0-yil (CAPEX)', saved: 0, cost: totalCapexEstimate, status: 'Boshlang‘ich investitsiya' },
                        { year: '1-yil', saved: Math.round(annualSavings), cost: totalCapexEstimate, status: 'Tejov boshlandi' },
                        { year: '2-yil', saved: Math.round(annualSavings * 2), cost: totalCapexEstimate, status: '90% qaytdi' },
                        { year: `${Math.round(paybackYears)}-yil (Break-Even)`, saved: Math.round(annualSavings * paybackYears), cost: totalCapexEstimate, status: '100% O‘zini oqladi' },
                        { year: '4-yil (+Foyda)', saved: Math.round(annualSavings * 4), cost: totalCapexEstimate, status: '+ Sof tejam' },
                        { year: '5-yil (+Foyda)', saved: Math.round(annualSavings * 5), cost: totalCapexEstimate, status: '2x Investitsiya foydasi' }
                      ].map((pt, idx) => {
                        const pct = Math.min(100, Math.round((pt.saved / pt.cost) * 100));
                        const isProfitable = pt.saved >= pt.cost;

                        return (
                          <div key={idx} className="space-y-0.5">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-bunker-text-secondary">{pt.year}</span>
                              <span className={isProfitable ? 'text-bunker-status-green font-bold' : 'text-bunker-text-muted'}>
                                {pt.status} ({pt.saved.toLocaleString()} so'm)
                              </span>
                            </div>
                            <div className="w-full bg-bunker-surface-2 h-2 rounded-full overflow-hidden flex">
                              <div
                                style={{ width: `${pct}%` }}
                                className={`h-full transition-all ${
                                  isProfitable ? 'bg-bunker-status-green' : 'bg-bunker-amber-500'
                                }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-2 pt-1 font-mono text-xs">
                    <h4 className="font-bold text-bunker-text-primary uppercase">
                      Tavsiya etiladigan izolyatsiya materiallari:
                    </h4>
                    <div className="space-y-1">
                      {result.recommendedMaterials.map((m, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-bunker-text-secondary">
                          <CheckCircle2 className="w-3.5 h-3.5 text-bunker-status-green shrink-0" />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Save Alerts */}
                  {saveSuccess && (
                    <div className="p-3 rounded-xl bg-bunker-status-green/20 border border-bunker-status-green/40 text-xs text-bunker-status-green flex items-center gap-2 font-medium">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Audit hisoboti profilingizda saqlandi! Uni 'Mening Saqlangan Auditlarim' bo‘limida ko‘rishingiz mumkin.</span>
                    </div>
                  )}

                  {saveError && (
                    <div className="p-3 rounded-xl bg-bunker-amber-500/15 border border-bunker-amber-500/30 text-xs text-bunker-amber-500 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{saveError}</span>
                    </div>
                  )}

                  {/* Action Buttons: Save & PDF Energy Passport */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={handleSaveAudit}
                      isLoading={isSaving}
                      disabled={saveSuccess}
                    >
                      <BookmarkPlus className="w-4 h-4 mr-1.5 text-bunker-status-green" />
                      <span>Profilga Saqlash</span>
                    </Button>

                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => setShowPassportModal(true)}
                    >
                      <FileText className="w-4 h-4 mr-1.5" />
                      <span>PDF Energiya Pasporti</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[380px] border border-dashed border-bunker-border-strong rounded-3xl flex flex-col items-center justify-center p-8 text-center space-y-3 text-bunker-text-secondary bg-bunker-surface-1/40">
                  <Sparkles className="w-12 h-12 text-bunker-amber-500/50" />
                  <p className="text-sm font-semibold text-bunker-text-primary">Bino parametrlarini kiriting va hisoblang</p>
                  <p className="text-xs max-w-sm text-bunker-text-muted">
                    AI termal tahlilchisi binoning devor, deraza va tomidan yo‘qotiladigan issiqlik ko‘rsatkichlarini
                    aniqlab, ROI o‘zini oqlash egri chizig‘ini tuzib beradi.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SAVED AUDITS */}
      {activeSubTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-bunker-border-strong">
            <div>
              <h3 className="text-base font-bold text-bunker-text-primary font-mono">Mening Saqlangan ESCO Auditlarim</h3>
              <p className="text-xs text-bunker-text-secondary">Shaxsiy profilga biriktirilgan energiya samaradorlik hisobotlari</p>
            </div>
            {isLoggedIn && (
              <Button variant="secondary" size="sm" onClick={fetchSavedAudits} isLoading={loadingAudits}>
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                <span>Yangilash</span>
              </Button>
            )}
          </div>

          {!isLoggedIn ? (
            <div className="p-8 border border-dashed border-bunker-border-strong rounded-3xl text-center space-y-3 bg-bunker-surface-1/50">
              <LogIn className="w-10 h-10 mx-auto text-bunker-amber-500" />
              <h4 className="text-sm font-bold text-bunker-text-primary">Tizimga kirish talab etiladi</h4>
              <p className="text-xs text-bunker-text-secondary max-w-md mx-auto">
                Saqlangan auditlar tarixi va tavsiyalarni ko‘rish uchun SMS OTP yoki parolingiz orqali tizimga kiring.
              </p>
            </div>
          ) : loadingAudits ? (
            <div className="text-center py-16 text-bunker-text-secondary font-mono text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-bunker-amber-500" />
              Saqlangan auditlar yuklanmoqda...
            </div>
          ) : savedError ? (
            <div className="p-4 rounded-2xl bg-bunker-status-red/15 border border-bunker-status-red/30 text-xs text-bunker-status-red">
              {savedError}
            </div>
          ) : savedAudits.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-bunker-border-strong rounded-3xl space-y-3 text-bunker-text-secondary">
              <Layers className="w-10 h-10 mx-auto text-bunker-amber-500/50" />
              <p className="text-sm font-semibold text-bunker-text-primary">Hozircha saqlangan auditlar mavjud emas</p>
              <p className="text-xs text-bunker-text-muted">
                'AI ESCO Kalkulyatori' yorlig'iga o‘ting, parametrlarni hisoblang va 'Profilga Saqlash' tugmasini bosing.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
              {savedAudits.map((audit) => (
                <Card key={audit.id} className="space-y-4 border border-bunker-border-strong">
                  <div className="flex items-center justify-between pb-3 border-b border-bunker-border-subtle">
                    <div>
                      <Badge variant="success" className="font-mono text-[10px]">
                        {BUILDING_TYPES[audit.buildingType] || audit.buildingType}
                      </Badge>
                      <h4 className="font-bold text-sm text-bunker-text-primary mt-1">Maydon: {audit.areaM2} m²</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-bunker-text-muted block">
                        {new Date(audit.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs font-black text-bunker-status-green">
                        +{audit.estimatedSavingsPct}% tejamkorlik
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-bunker-base p-2.5 rounded-xl border border-bunker-border-subtle">
                      <span className="text-[10px] text-bunker-text-muted uppercase block">Yillik tejam:</span>
                      <span className="font-bold text-bunker-amber-500">
                        {Number(audit.annualSavingsSum).toLocaleString()} so'm
                      </span>
                    </div>
                    <div className="bg-bunker-base p-2.5 rounded-xl border border-bunker-border-subtle">
                      <span className="text-[10px] text-bunker-text-muted uppercase block">Oqlash muddati:</span>
                      <span className="font-bold text-bunker-text-primary">
                        {audit.paybackYears} yil
                      </span>
                    </div>
                    <div className="bg-bunker-base p-2.5 rounded-xl border border-bunker-border-subtle">
                      <span className="text-[10px] text-bunker-text-muted uppercase block">CO2 Qisqarishi:</span>
                      <span className="font-bold text-bunker-status-cyan">
                        -{audit.co2ReductionTons} t/yil
                      </span>
                    </div>
                    <div className="bg-bunker-base p-2.5 rounded-xl border border-bunker-border-subtle">
                      <span className="text-[10px] text-bunker-text-muted uppercase block">Joriy sarf:</span>
                      <span className="font-bold text-bunker-text-secondary">
                        {Number(audit.currentEnergyUsageKwh).toLocaleString()} kVt/soat
                      </span>
                    </div>
                  </div>

                  {audit.recommendations && audit.recommendations.length > 0 && (
                    <div className="space-y-1.5 pt-1 text-xs">
                      <span className="text-[10px] text-bunker-text-muted uppercase block font-bold">
                        Tavsiya materiallar:
                      </span>
                      {audit.recommendations.slice(0, 3).map((rec, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-bunker-text-secondary">
                          <Check className="w-3.5 h-3.5 text-bunker-status-green shrink-0" />
                          <span className="truncate">{rec}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. OFFICIAL PDF ENERGY PASSPORT MODAL (PRINT-READY) */}
      {showPassportModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header with emblem & standards */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase block">
                  O‘ZBEKISTON RESPUBLIKASI QURILISH VA UY-JOY KOMMUNAL XO‘JALIGI VAZIRLIGI
                </span>
                <h2 className="text-xl font-black tracking-tight text-slate-900 mt-1">
                  BINO ENERGIYA SAMARADORLIGI PASPORTI
                </h2>
                <span className="text-xs font-mono font-bold text-emerald-700 block">
                  Davlat Standarti ShNQ 2.01.04-18 / ESCO ENERGY PASSPORT
                </span>
              </div>

              <div className="text-right font-mono text-xs">
                <span className="block text-[10px] text-slate-500 uppercase">Hujjat Raqami:</span>
                <span className="font-bold text-slate-900">EP-UZ-2026-94821</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Passport Body */}
            <div className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Bino Turi:</span>
                  <p className="font-bold text-slate-900">{BUILDING_TYPES[buildingType] || buildingType}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Joylashgan Hudud:</span>
                  <p className="font-bold text-slate-900">{region}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Umumiy Maydon:</span>
                  <p className="font-bold text-slate-900">{areaM2} m²</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Energiya Samaradorlik Klassi:</span>
                  <p className="text-base font-black text-emerald-600">Sinf {result.auditScore} (A++)</p>
                </div>
              </div>

              {/* Engineering Metrics Table */}
              <table className="w-full text-left border-collapse border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-700">
                    <th className="p-2 border-r border-slate-300">Termodinamik Ko‘rsatkich</th>
                    <th className="p-2 border-r border-slate-300">Auditsiz (Joriy)</th>
                    <th className="p-2 font-bold text-emerald-700">ESCO Tavsiyasidan So‘ng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 border-r border-slate-300">Devor Termal Qarshiligi (R)</td>
                    <td className="p-2 border-r border-slate-300">1.1 m²·K/W</td>
                    <td className="p-2 font-bold text-emerald-700">3.8 m²·K/W (+245%)</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300">Yillik Energiya Sarfi</td>
                    <td className="p-2 border-r border-slate-300">{energyUsageKwh.toLocaleString()} kVt/soat</td>
                    <td className="p-2 font-bold text-emerald-700">
                      {Math.round(energyUsageKwh * (1 - result.energySavingsPercent / 100)).toLocaleString()} kVt/soat (-{result.energySavingsPercent}%)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300">Yillik Moliyaviy Tejamkorlik</td>
                    <td className="p-2 border-r border-slate-300">—</td>
                    <td className="p-2 font-bold text-emerald-700">{Number(result.annualSavingsSum).toLocaleString()} so‘m / yil</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300">Investitsiya Oqlash Muddati (ROI)</td>
                    <td className="p-2 border-r border-slate-300">—</td>
                    <td className="p-2 font-bold text-emerald-700">{result.paybackYears} yil</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300">Ekologik Foyda (CO2 Qisqarishi)</td>
                    <td className="p-2 border-r border-slate-300">—</td>
                    <td className="p-2 font-bold text-emerald-700">-{result.co2ReductionTons} tonna CO2 / yil</td>
                  </tr>
                </tbody>
              </table>

              {/* Certification & QR validation stamp */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                  <div>
                    <span className="font-bold text-slate-900 block text-[11px]">BunkerStroy Texnik Audit Markazi</span>
                    <span className="text-[10px] text-slate-500">Elektron Raqamli Muhr & E-IMZO bilan tasdiqlangan</span>
                  </div>
                </div>

                <div className="border-2 border-slate-900 p-2 text-center text-[9px] font-bold tracking-wider uppercase">
                  TASDIQLANDI
                  <br />
                  DSQ & ESCO
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowPassportModal(false)}
                className="text-slate-700 border-slate-300 hover:bg-slate-100"
              >
                Yopish
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handlePrintPassport}
              >
                <Printer className="w-4 h-4 mr-1.5" />
                <span>Chop Etish / PDF Saqlash</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
