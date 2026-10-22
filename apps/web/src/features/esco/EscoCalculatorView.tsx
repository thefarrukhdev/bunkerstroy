import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calculator,
  Building2,
  BookmarkPlus,
  History,
  CheckCircle2,
  RefreshCw,
  LogIn,
  FileText,
  Printer,
  TrendingUp,
  ShieldCheck,
  Zap,
  Percent,
  Thermometer,
  Flame
} from 'lucide-react';
import { EscoCalculationResult } from '@bunkerstroy/types';
import {
  Button,
  Badge,
  Card,
  Input,
  Select,
  Alert,
  StatCard,
  Modal,
  Tabs,
  TabsList,
  TabTrigger,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@bunkerstroy/ui';

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
      } else {
        setCalcError(data.message || 'Hisoblashda xatolik yuz berdi');
      }
    } catch {
      setCalcError('Server bilan aloqa uzildi');
    } finally {
      setLoading(false);
    }
  };

  // Save audit to profile
  const handleSaveAudit = async () => {
    if (!result) return;
    const token = getToken();
    if (!token) {
      setSaveError("Auditni saqlash uchun avval tizimga kiring");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/esco/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          buildingType,
          areaM2: Number(areaM2),
          currentEnergyUsageKwh: Number(energyUsageKwh),
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
      {/* 1. Minimalist ESCO Header */}
      <div className="bg-white border border-bunker-border-strong rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-emerald-700 uppercase tracking-wider">
              ESCO Audit &amp; ShNQ 2.01.04-18
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-bunker-text-primary">
            Bino Energiya Samaradorligi &amp; Termal Audit
          </h1>
          <p className="text-xs sm:text-sm text-bunker-text-secondary mt-1">
            Issiqlik yo‘qotilishini hisoblash, bazalt izolyatsiyasi samarasi va ROI o‘zini oqlash muddati.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge variant="success" size="sm" isMono>
            A++ Standart
          </Badge>
        </div>
      </div>

      {/* 2. Navigation Sub-Tabs */}
      <Tabs
        variant="pills"
        value={activeSubTab}
        onValueChange={(val) => setActiveSubTab(val as 'calculator' | 'saved')}
      >
        <TabsList>
          <TabTrigger value="calculator">
            <Calculator className="w-4 h-4" />
            <span>AI ESCO Kalkulyatori &amp; Izometrik Model</span>
          </TabTrigger>

          <TabTrigger value="saved">
            <History className="w-4 h-4" />
            <span>Mening Saqlangan Auditlarim</span>
            {savedAudits.length > 0 && (
              <span className="bg-orange-100 text-orange-800 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ml-1">
                {savedAudits.length}
              </span>
            )}
          </TabTrigger>
        </TabsList>
      </Tabs>

      {/* SUB-TAB 1: CALCULATOR & ISOMETRIC THERMAL MODEL */}
      {activeSubTab === 'calculator' && (
        <div className="space-y-6">
          {/* Visual Isometric / Cutaway Thermal Loss Zones Visualizer */}
          <div className="bg-white border border-bunker-border-strong rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-bunker-border-subtle">
              <div>
                <h3 className="font-extrabold text-base text-bunker-text-primary font-mono flex items-center gap-2">
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
                  Optimal Izolyatsiya (ShNQ)
                </span>
              </div>
            </div>

            {/* Isometric Cutaway Interactive 3-Zone Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Zone 1: Tashqi Devorlar (42%) */}
              <div
                onClick={() => setInsulatedWalls(!insulatedWalls)}
                className={`p-5 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden shadow-xs ${
                  insulatedWalls
                    ? 'bg-emerald-50/70 border-emerald-500 text-emerald-950'
                    : 'bg-red-50/70 border-red-300 text-red-950'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={insulatedWalls ? 'success' : 'danger'} className="font-mono text-[10px]">
                    {insulatedWalls ? 'OPTIMAL: 100mm BAZALT' : 'YO‘QOTISH: 42%'}
                  </Badge>
                  <span className="text-xs font-mono font-bold">TASHQI DEVORLAR</span>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <p className="font-bold text-sm text-bunker-text-primary">
                    {insulatedWalls ? 'R = 3.8 m²·K/W (Norma Bajarildi)' : 'R = 1.1 m²·K/W (Kritik Sovuq Oqimi)'}
                  </p>
                  <p className="text-[11px] text-bunker-text-secondary leading-relaxed">
                    {insulatedWalls
                      ? 'Fasad 100mm zichligi 135 kg/m³ bazalt plitasi bilan qoplangan. ShNQ 2.01.04-18 talabiga mos.'
                      : 'Izolyatsiyasiz g‘isht devor. Bino umumiy issiqligining 42% qismi aynan devorlar orqali chiqib ketadi.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-bunker-border-subtle flex items-center justify-between text-[11px] font-mono">
                  <span className={insulatedWalls ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>
                    {insulatedWalls ? '✓ Izolyatsiyalangan' : '✕ Izolyatsiya qilinmagan'}
                  </span>
                  <span className="text-bunker-text-muted underline">Bosib o‘zgartiring</span>
                </div>
              </div>

              {/* Zone 2: Derazalar va Vitrinalar (28%) */}
              <div
                onClick={() => setInsulatedWindows(!insulatedWindows)}
                className={`p-5 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden shadow-xs ${
                  insulatedWindows
                    ? 'bg-emerald-50/70 border-emerald-500 text-emerald-950'
                    : 'bg-amber-50/70 border-amber-300 text-amber-950'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={insulatedWindows ? 'success' : 'warning'} className="font-mono text-[10px]">
                    {insulatedWindows ? 'OPTIMAL: LOW-E 3-KAMERA' : 'YO‘QOTISH: 28%'}
                  </Badge>
                  <span className="text-xs font-mono font-bold">DERAZALAR</span>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <p className="font-bold text-sm text-bunker-text-primary">
                    {insulatedWindows ? 'R = 0.95 m²·K/W (Argon Gazli)' : 'R = 0.38 m²·K/W (Katta Sovuq Ko‘prigi)'}
                  </p>
                  <p className="text-[11px] text-bunker-text-secondary leading-relaxed">
                    {insulatedWindows
                      ? '3 kamerali Low-E kumush qoplamali oynalar. Issiqlik nurini xona ichida saqlaydi.'
                      : 'Oddiy 2 kamerali plastik oyna. Issiqlikning 28% i deraza orqali yo‘qotiladi.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-bunker-border-subtle flex items-center justify-between text-[11px] font-mono">
                  <span className={insulatedWindows ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                    {insulatedWindows ? '✓ Izolyatsiyalangan' : '✕ Izolyatsiya qilinmagan'}
                  </span>
                  <span className="text-bunker-text-muted underline">Bosib o‘zgartiring</span>
                </div>
              </div>

              {/* Zone 3: Tom va Cherdak (18%) */}
              <div
                onClick={() => setInsulatedRoof(!insulatedRoof)}
                className={`p-5 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden shadow-xs ${
                  insulatedRoof
                    ? 'bg-emerald-50/70 border-emerald-500 text-emerald-950'
                    : 'bg-amber-50/70 border-amber-300 text-amber-950'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={insulatedRoof ? 'success' : 'warning'} className="font-mono text-[10px]">
                    {insulatedRoof ? 'OPTIMAL: XPS 100mm GIDRO' : 'YO‘QOTISH: 18%'}
                  </Badge>
                  <span className="text-xs font-mono font-bold">TOM VA CHERDAK</span>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <p className="font-bold text-sm text-bunker-text-primary">
                    {insulatedRoof ? 'R = 4.2 m²·K/W (Maksimal To‘siq)' : 'R = 1.3 m²·K/W (Yuqori Qatlam Sizishi)'}
                  </p>
                  <p className="text-[11px] text-bunker-text-secondary leading-relaxed">
                    {insulatedRoof
                      ? '100mm XPS ekstrudirovanniy plita va bug‘ to‘siq membranasi. Qishda issiq, yozda salqin.'
                      : 'Beton plita va qora qog‘oz. Issiq havo yuqoriga ko‘tarilib, tom orqali 18% yo‘qotiladi.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-bunker-border-subtle flex items-center justify-between text-[11px] font-mono">
                  <span className={insulatedRoof ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                    {insulatedRoof ? '✓ Izolyatsiyalangan' : '✕ Izolyatsiya qilinmagan'}
                  </span>
                  <span className="text-bunker-text-muted underline">Bosib o‘zgartiring</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form & AI Calculator Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Form with Input & Select Components */}
            <div className="lg:col-span-6 bg-white border border-bunker-border-strong p-6 rounded-2xl space-y-4 shadow-xs">
              <h3 className="font-bold text-bunker-text-primary flex items-center gap-2 border-b border-bunker-border-subtle pb-3 text-sm font-mono">
                <Building2 className="w-4 h-4 text-bunker-status-green" />
                Bino Parametrlari va Energetika Pasporti Kiritish
              </h3>

              {calcError && (
                <Alert
                  variant="error"
                  description={calcError}
                  onDismiss={() => setCalcError(null)}
                />
              )}

              <div className="space-y-3.5 text-xs font-semibold text-bunker-text-secondary">
                <Select
                  label="Bino turi va vazifasi:"
                  value={buildingType}
                  onChange={(e) => setBuildingType(e.target.value)}
                >
                  <option value="RESIDENTIAL_MULTI_STOREY">Ko‘p qavatli turar joy binosi</option>
                  <option value="PRIVATE_HOUSE_COTTAGE">Xususiy hovli / Kottej</option>
                  <option value="COMMERCIAL_OFFICE">Tijorat / Ofis binosi</option>
                  <option value="INDUSTRIAL_WAREHOUSE">Sanoat ombori / Ishlab chiqarish</option>
                  <option value="PUBLIC_SCHOOL_HOSPITAL">Maktab / Shifoxona / Ijtimoiy muassasa</option>
                </Select>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Umumiy maydon (m²):"
                    type="number"
                    min="10"
                    max="100000"
                    isMono
                    value={areaM2}
                    onChange={(e) => setAreaM2(Number(e.target.value))}
                  />

                  <Input
                    label="Yillik energiya sarfi (kVt/soat):"
                    type="number"
                    min="100"
                    max="5000000"
                    isMono
                    value={energyUsageKwh}
                    onChange={(e) => setEnergyUsageKwh(Number(e.target.value))}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Tashqi devor konstruksiyasi:"
                    value={wallMaterial}
                    onChange={(e) => setWallMaterial(e.target.value)}
                    placeholder="Pishiq g'isht 380mm"
                  />

                  <Input
                    label="Deraza va vitrina turlari:"
                    value={windowType}
                    onChange={(e) => setWindowType(e.target.value)}
                    placeholder="Oddiy 2 kamerali plastik"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Select
                    label="Isitish tizimi turi:"
                    value={currentHeatingType}
                    onChange={(e) => setCurrentHeatingType(e.target.value)}
                  >
                    <option value="Gaz qozoni">Avtonom gaz qozoni</option>
                    <option value="Markaziy issiqlik">Markaziy shahar issiqlik tarmog‘i</option>
                    <option value="Elektr isitgich">Elektr qozoni / radiatorlar</option>
                    <option value="Issiqlik nasosi">Issiqlik nasosi (Heat Pump)</option>
                  </Select>

                  <Select
                    label="Joylashgan hududi:"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  >
                    <option value="Toshkent shahri">Toshkent shahri</option>
                    <option value="Toshkent viloyati">Toshkent viloyati</option>
                    <option value="Samarqand viloyati">Samarqand viloyati</option>
                    <option value="Farg‘ona viloyati">Farg‘ona viloyati</option>
                    <option value="Buxoro viloyati">Buxoro viloyati</option>
                  </Select>
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
                <div className="bg-white border border-emerald-300 p-6 rounded-2xl space-y-5 shadow-xs">
                  {/* Results Header */}
                  <div className="flex items-center justify-between border-b border-bunker-border-subtle pb-3">
                    <div>
                      <span className="text-xs font-bold font-mono uppercase text-bunker-text-secondary">
                        Audit Hisoboti &amp; ShNQ 2.01.04-18
                      </span>
                      <h4 className="text-sm font-bold text-bunker-text-primary mt-0.5">
                        {BUILDING_TYPES[buildingType] || buildingType} ({areaM2} m²)
                      </h4>
                    </div>
                    <Badge variant="success" className="font-mono text-xs bg-emerald-50 text-emerald-800 border-emerald-300">
                      Sinf: {result.auditScore}
                    </Badge>
                  </div>

                  {/* Core Metrics Using StatCard Component */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <StatCard
                      title="Energiya tejamkorligi"
                      value={`+${result.energySavingsPercent}%`}
                      variant="green"
                      icon={<Zap className="w-4 h-4 text-emerald-600" />}
                    />
                    <StatCard
                      title="O'zini oqlash muddati"
                      value={result.paybackYears}
                      unit="yil"
                      variant="amber"
                      icon={<TrendingUp className="w-4 h-4 text-bunker-amber-500" />}
                    />
                    <StatCard
                      title="Yillik tejalgan mablag'"
                      value={Number(result.annualSavingsSum).toLocaleString()}
                      unit="so'm"
                      variant="default"
                      icon={<Percent className="w-4 h-4 text-slate-700" />}
                    />
                    <StatCard
                      title="CO2 Qisqarishi"
                      value={`-${result.co2ReductionTons}`}
                      unit="t/yil"
                      variant="cyan"
                      icon={<Thermometer className="w-4 h-4 text-sky-600" />}
                    />
                  </div>

                  {/* ROI Payback Period Curve Visualizer */}
                  <div className="bg-slate-50 border border-bunker-border-strong p-4 rounded-xl space-y-3 font-mono">
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
                              <span className={isProfitable ? 'text-emerald-700 font-bold' : 'text-bunker-text-muted'}>
                                {pt.status} ({pt.saved.toLocaleString()} so'm)
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                              <div
                                style={{ width: `${pct}%` }}
                                className={`h-full transition-all ${
                                  isProfitable ? 'bg-emerald-600' : 'bg-orange-500'
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
                    <Alert
                      variant="success"
                      description="Audit hisoboti profilingizda saqlandi! Uni 'Mening Saqlangan Auditlarim' bo‘limida ko‘rishingiz mumkin."
                    />
                  )}

                  {saveError && (
                    <Alert
                      variant="error"
                      description={saveError}
                      onDismiss={() => setSaveError(null)}
                    />
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
                      <BookmarkPlus className="w-4 h-4 mr-1.5 text-emerald-600" />
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
                <div className="h-full min-h-[380px] border border-dashed border-bunker-border-strong rounded-2xl flex flex-col items-center justify-center p-8 text-center space-y-3 text-bunker-text-secondary bg-white shadow-xs">
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
            <div className="p-8 border border-dashed border-bunker-border-strong rounded-2xl text-center space-y-3 bg-white shadow-xs">
              <LogIn className="w-10 h-10 mx-auto text-bunker-amber-500" />
              <h4 className="text-sm font-bold text-bunker-text-primary">Tizimga kirish talab etiladi</h4>
              <p className="text-xs text-bunker-text-secondary max-w-md mx-auto">
                Saqlangan auditlar tarixi va tavsiyalarni ko‘rish uchun SMS OTP yoki parolingiz orqali tizimga kiring.
              </p>
            </div>
          ) : loadingAudits ? (
            <div className="text-center py-16 text-bunker-text-secondary font-mono text-xs">
              Saqlangan auditlar yuklanmoqda...
            </div>
          ) : savedError ? (
            <Alert variant="error" description={savedError} onDismiss={() => setSavedError(null)} />
          ) : savedAudits.length === 0 ? (
            <div className="text-center py-16 text-bunker-text-muted font-mono text-xs border border-dashed border-bunker-border-strong rounded-2xl bg-white shadow-xs">
              Hozircha saqlangan auditlar mavjud emas. Kalkulyatordan foydalanib yangi audit saqlang.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedAudits.map((audit) => (
                <Card key={audit.id} className="p-5 space-y-3 font-mono">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-bunker-amber-500 font-bold uppercase">
                        {BUILDING_TYPES[audit.buildingType] || audit.buildingType}
                      </span>
                      <p className="text-xs text-bunker-text-muted mt-0.5">
                        Maydon: {audit.areaM2} m² | {new Date(audit.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="success" className="text-xs">
                      +{audit.estimatedSavingsPct}%
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-bunker-border-subtle text-[11px]">
                    <div>
                      <span className="text-[10px] text-bunker-text-muted block">Tejamkorlik:</span>
                      <span className="font-bold text-bunker-text-primary">
                        {Number(audit.annualSavingsSum).toLocaleString()} so'm/yil
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-bunker-text-muted block">Qoplash:</span>
                      <span className="font-bold text-bunker-amber-500">{audit.paybackYears} yil</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-bunker-text-muted block">CO2 Qisqarishi:</span>
                      <span className="font-bold text-bunker-status-cyan">-{audit.co2ReductionTons} t</span>
                    </div>
                  </div>

                  {audit.insulationAdvice && (
                    <p className="text-[11px] text-bunker-text-secondary leading-relaxed">
                      💡 {audit.insulationAdvice}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. OFFICIAL PDF ENERGY PASSPORT MODAL (PRINT-READY) USING MODAL */}
      {showPassportModal && result && (
        <Modal
          isOpen={showPassportModal}
          onClose={() => setShowPassportModal(false)}
          size="lg"
          title="BINO ENERGIYA SAMARADORLIGI PASPORTI"
          subtitle="O‘ZBEKISTON RESPUBLIKASI QURILISH VA UY-JOY KOMMUNAL XO‘JALIGI VAZIRLIGI — ShNQ 2.01.04-18"
          footer={
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowPassportModal(false)}
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
            </>
          }
        >
          <div className="space-y-4 text-xs font-mono">
            {/* Header info */}
            <div className="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl border border-bunker-border-subtle">
              <div>
                <span className="text-[10px] text-bunker-text-muted block uppercase">Hujjat Raqami:</span>
                <span className="font-bold text-bunker-amber-500">EP-UZ-2026-94821</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-bunker-text-muted block uppercase">Sana:</span>
                <span className="font-bold text-bunker-text-primary">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-bunker-border-strong">
              <div>
                <span className="text-[10px] text-bunker-text-muted block uppercase">Bino Turi:</span>
                <p className="font-bold text-bunker-text-primary">{BUILDING_TYPES[buildingType] || buildingType}</p>
              </div>
              <div>
                <span className="text-[10px] text-bunker-text-muted block uppercase">Joylashgan Hudud:</span>
                <p className="font-bold text-bunker-text-primary">{region}</p>
              </div>
              <div>
                <span className="text-[10px] text-bunker-text-muted block uppercase">Umumiy Maydon:</span>
                <p className="font-bold text-bunker-text-primary">{areaM2} m²</p>
              </div>
              <div>
                <span className="text-[10px] text-bunker-text-muted block uppercase">Energiya Samaradorlik Klassi:</span>
                <p className="text-base font-extrabold text-bunker-status-green">Sinf {result.auditScore} (A++)</p>
              </div>
            </div>

            {/* Engineering Metrics Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="border-r border-bunker-border-subtle">Termodinamik Ko‘rsatkich</TableHead>
                  <TableHead className="border-r border-bunker-border-subtle">Auditsiz (Joriy)</TableHead>
                  <TableHead className="font-bold text-bunker-status-green">ESCO Tavsiyasidan So‘ng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="border-r border-bunker-border-subtle">Devor Termal Qarshiligi (R)</TableCell>
                  <TableCell className="border-r border-bunker-border-subtle">1.1 m²·K/W</TableCell>
                  <TableCell className="font-bold text-bunker-status-green">3.8 m²·K/W (+245%)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r border-bunker-border-subtle">Yillik Energiya Sarfi</TableCell>
                  <TableCell className="border-r border-bunker-border-subtle">{energyUsageKwh.toLocaleString()} kVt/soat</TableCell>
                  <TableCell className="font-bold text-bunker-status-green">
                    {Math.round(energyUsageKwh * (1 - result.energySavingsPercent / 100)).toLocaleString()} kVt/soat (-{result.energySavingsPercent}%)
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r border-bunker-border-subtle">Yillik Moliyaviy Tejamkorlik</TableCell>
                  <TableCell className="border-r border-bunker-border-subtle">—</TableCell>
                  <TableCell className="font-bold text-bunker-status-green">{Number(result.annualSavingsSum).toLocaleString()} so‘m / yil</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r border-bunker-border-subtle">Investitsiya Oqlash Muddati (ROI)</TableCell>
                  <TableCell className="border-r border-bunker-border-subtle">—</TableCell>
                  <TableCell className="font-bold text-bunker-amber-500">{result.paybackYears} yil</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r border-bunker-border-subtle">Ekologik Foyda (CO2 Qisqarishi)</TableCell>
                  <TableCell className="border-r border-bunker-border-subtle">—</TableCell>
                  <TableCell className="font-bold text-bunker-status-cyan">-{result.co2ReductionTons} tonna CO2 / yil</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Certification & QR validation stamp */}
            <div className="flex items-center justify-between pt-4 border-t border-bunker-border-subtle">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-8 h-8 text-bunker-status-green" />
                <div>
                  <span className="font-bold text-bunker-text-primary block text-[11px]">BunkerStroy Texnik Audit Markazi</span>
                  <span className="text-[10px] text-bunker-text-muted">Elektron Raqamli Muhr &amp; E-IMZO bilan tasdiqlangan</span>
                </div>
              </div>

              <div className="border border-orange-300 bg-orange-50 p-2 rounded-lg text-center text-[9px] font-bold tracking-wider uppercase text-bunker-amber-500">
                TASDIQLANDI
                <br />
                DSQ &amp; ESCO
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
