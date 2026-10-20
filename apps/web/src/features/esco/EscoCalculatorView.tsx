import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingDown,
  DollarSign,
  Leaf,
  CheckCircle,
  Calculator,
  Building2,
  BookmarkPlus,
  History,
  AlertCircle,
  CheckCircle2,
  Clock,
  Layers,
  RefreshCw,
  LogIn,
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
  PUBLIC_SCHOOL_HOSPITAL: 'Maktab / Shifoxona / Ijtimoiy ob’ekt',
};

export const EscoCalculatorView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'calculator' | 'saved'>('calculator');

  // Calculator input state
  const [buildingType, setBuildingType] = useState('RESIDENTIAL_MULTI_STOREY');
  const [areaM2, setAreaM2] = useState(450);
  const [energyUsageKwh, setEnergyUsageKwh] = useState(8500);
  const [wallMaterial, setWallMaterial] = useState("Pishiq g'isht 380mm");
  const [windowType, setWindowType] = useState('Oddiy ikki kamerali plastik');
  const [currentHeatingType, setCurrentHeatingType] = useState('Gaz qozoni');
  const [region, setRegion] = useState('Toshkent shahri');

  // Calculation state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EscoCalculationResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Saved audits state
  const [savedAudits, setSavedAudits] = useState<SavedEscoAudit[]>([]);
  const [loadingAudits, setLoadingAudits] = useState(false);
  const [savedError, setSavedError] = useState<string | null>(null);

  // Check login token
  const getToken = () => {
    return typeof window !== 'undefined' ? localStorage.getItem('bunkerstroy_token') : null;
  };

  const isLoggedIn = !!getToken();

  // Load saved audits when switching to saved tab or on mount
  const fetchSavedAudits = async () => {
    const token = getToken();
    if (!token) return;

    setLoadingAudits(true);
    setSavedError(null);

    try {
      const res = await fetch('/api/esco/audits', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  // Execute calculation
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
          region,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.data);
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
          Authorization: `Bearer ${token}`,
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
          insulationAdvice: result.insulationAdvice,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSaveSuccess(true);
        // Refresh saved audits
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

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden border border-[#33373B] bg-gradient-to-r from-[#17231B] via-[#1A1D20] to-[#25281C] p-6 sm:p-10 shadow-2xl">
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-[#FFB800] to-emerald-400 absolute top-0 left-0" />
        <div className="max-w-3xl space-y-3">
          <Badge variant="success" className="gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            BunkerStroy ESCO — AI Energiya Servis Auditi
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black text-[#F5F5F2]">
            Binolar energiya tejamkorligini modellashtirish
          </h1>
          <p className="text-sm text-[#B8B8B3]">
            Binoning issiqlik yo‘qotish ko‘rsatkichlarini hisoblab, zamonaviy izolyatsiya orqali yillik tejamkorlik va
            xarajatlarning o‘zini oqlash muddatini (Payback Period) aniqlang.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#33373B] pb-3">
        <button
          onClick={() => setActiveSubTab('calculator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
            activeSubTab === 'calculator'
              ? 'bg-[#FFB800] text-[#151719] shadow-md shadow-[#FFB800]/20'
              : 'bg-[#1A1D20] text-[#B8B8B3] border border-[#33373B] hover:text-[#F5F5F2]'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>AI ESCO Kalkulyatori</span>
        </button>

        <button
          onClick={() => setActiveSubTab('saved')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
            activeSubTab === 'saved'
              ? 'bg-[#FFB800] text-[#151719] shadow-md shadow-[#FFB800]/20'
              : 'bg-[#1A1D20] text-[#B8B8B3] border border-[#33373B] hover:text-[#F5F5F2]'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Mening Saqlangan Auditlarim</span>
          {savedAudits.length > 0 && (
            <span className="bg-[#151719] text-[#FFB800] text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
              {savedAudits.length}
            </span>
          )}
        </button>
      </div>

      {/* SUB-TAB 1: CALCULATOR */}
      {activeSubTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Parameters Form */}
          <div className="lg:col-span-6 bg-[#1A1D20] border border-[#33373B] p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-[#F5F5F2] flex items-center gap-2 border-b border-[#33373B] pb-3 text-sm">
              <Building2 className="w-4 h-4 text-emerald-400" />
              Bino Parametrlari va Energiya Ma’lumotlari
            </h3>

            {calcError && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{calcError}</span>
              </div>
            )}

            <div className="space-y-3.5 text-xs font-semibold text-[#B8B8B3]">
              <div>
                <label className="block mb-1">Bino turi:</label>
                <select
                  value={buildingType}
                  onChange={(e) => setBuildingType(e.target.value)}
                  className="w-full bg-[#151719] border border-[#33373B] focus:border-emerald-400 p-2.5 rounded-xl text-[#F5F5F2] outline-none transition-colors"
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
                  <label className="block mb-1">Umumiy maydon (m²):</label>
                  <input
                    type="number"
                    min="10"
                    max="100000"
                    value={areaM2}
                    onChange={(e) => setAreaM2(Number(e.target.value))}
                    className="w-full bg-[#151719] border border-[#33373B] focus:border-emerald-400 p-2.5 rounded-xl text-[#F5F5F2] font-mono outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block mb-1">Yillik energiya sarfi (kVt/soat):</label>
                  <input
                    type="number"
                    min="100"
                    max="5000000"
                    value={energyUsageKwh}
                    onChange={(e) => setEnergyUsageKwh(Number(e.target.value))}
                    className="w-full bg-[#151719] border border-[#33373B] focus:border-emerald-400 p-2.5 rounded-xl text-[#F5F5F2] font-mono outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Tashqi devor konstruksiyasi:</label>
                  <input
                    type="text"
                    value={wallMaterial}
                    onChange={(e) => setWallMaterial(e.target.value)}
                    placeholder="Pishiq g'isht 380mm"
                    className="w-full bg-[#151719] border border-[#33373B] focus:border-emerald-400 p-2.5 rounded-xl text-[#F5F5F2] outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block mb-1">Deraza va vitrina turlari:</label>
                  <input
                    type="text"
                    value={windowType}
                    onChange={(e) => setWindowType(e.target.value)}
                    placeholder="Oddiy 2 kamerali plastik"
                    className="w-full bg-[#151719] border border-[#33373B] focus:border-emerald-400 p-2.5 rounded-xl text-[#F5F5F2] outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Isitish tizimi turi:</label>
                  <select
                    value={currentHeatingType}
                    onChange={(e) => setCurrentHeatingType(e.target.value)}
                    className="w-full bg-[#151719] border border-[#33373B] focus:border-emerald-400 p-2.5 rounded-xl text-[#F5F5F2] outline-none transition-colors"
                  >
                    <option value="Gaz qozoni">Avtonom gaz qozoni</option>
                    <option value="Markaziy issiqlik">Markaziy shahar issiqlik tarmog‘i</option>
                    <option value="Elektr isitgich">Elektr qozoni / radiatorlar</option>
                    <option value="Issiqlik nasosi">Issiqlik nasosi (Heat Pump)</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Joylashgan hududi:</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-[#151719] border border-[#33373B] focus:border-emerald-400 p-2.5 rounded-xl text-[#F5F5F2] outline-none transition-colors"
                  >
                    <option value="Toshkent shahri">Toshkent shahri</option>
                    <option value="Toshkent viloyati">Toshkent viloyati</option>
                    <option value="Samarqand viloyati">Samarqand viloyati</option>
                    <option value="Farg‘ona viloyati">Farg‘ona viloyati</option>
                    <option value="Buxoro viloyati">Buxoro viloyati</option>
                    <option value="Andijon viloyati">Andijon viloyati</option>
                    <option value="Namangan viloyati">Namangan viloyati</option>
                    <option value="Qashqadaryo viloyati">Qashqadaryo viloyati</option>
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
              AI ESCO Auditini Hisoblash
            </Button>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-6 space-y-4">
            {result ? (
              <div className="bg-[#1A1D20] border border-emerald-500/40 p-6 rounded-3xl space-y-5 shadow-xl shadow-emerald-500/5">
                <div className="flex items-center justify-between border-b border-[#33373B] pb-3">
                  <div>
                    <span className="text-xs font-bold font-mono uppercase text-[#B8B8B3]">Audit Natijasi</span>
                    <h4 className="text-sm font-bold text-[#F5F5F2] mt-0.5">
                      {BUILDING_TYPES[buildingType] || buildingType} ({areaM2} m²)
                    </h4>
                  </div>
                  <Badge variant="success" className="font-mono text-xs">
                    Klass: {result.auditScore}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="bg-[#151719] border border-[#33373B] p-3.5 rounded-2xl">
                    <span className="text-[10px] text-[#B8B8B3] uppercase font-mono block">Energiya tejamkorligi:</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      +{result.energySavingsPercent}%
                    </span>
                  </div>
                  <div className="bg-[#151719] border border-[#33373B] p-3.5 rounded-2xl">
                    <span className="text-[10px] text-[#B8B8B3] uppercase font-mono block">O'zini oqlash muddati:</span>
                    <span className="text-2xl font-black text-[#FFB800] font-mono">
                      {result.paybackYears} yil
                    </span>
                  </div>
                  <div className="bg-[#151719] border border-[#33373B] p-3.5 rounded-2xl">
                    <span className="text-[10px] text-[#B8B8B3] uppercase font-mono block">Yillik tejalgan mablag':</span>
                    <span className="text-xl font-black text-[#F5F5F2] font-mono">
                      {Number(result.annualSavingsSum).toLocaleString()} so'm
                    </span>
                  </div>
                  <div className="bg-[#151719] border border-[#33373B] p-3.5 rounded-2xl">
                    <span className="text-[10px] text-[#B8B8B3] uppercase font-mono block">CO2 Qisqarishi:</span>
                    <span className="text-xl font-black text-emerald-300 font-mono">
                      -{result.co2ReductionTons} t/yil
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-[#F5F5F2] uppercase font-mono">
                    Tavsiya etiladigan materiallar va yechimlar:
                  </h4>
                  <div className="space-y-1.5">
                    {result.recommendedMaterials.map((m, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#B8B8B3]">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs bg-[#151719] border border-[#33373B] p-3.5 rounded-xl text-[#B8B8B3] leading-relaxed">
                  {result.insulationAdvice}
                </p>

                {/* Save Feedback Alerts */}
                {saveSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Audit hisoboti profilingizda saqlandi! Uni 'Mening Saqlangan Auditlarim' bo‘limida ko‘rishingiz mumkin.</span>
                  </div>
                )}

                {saveError && (
                  <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                    <span>{saveError}</span>
                  </div>
                )}

                {/* Save to Profile Button */}
                <Button
                  variant="secondary"
                  className="w-full border-emerald-500/40 hover:border-emerald-400"
                  size="md"
                  onClick={handleSaveAudit}
                  isLoading={isSaving}
                  disabled={saveSuccess}
                >
                  <BookmarkPlus className="w-4 h-4 mr-1.5 text-emerald-400" />
                  <span>Auditni Profilga Saqlash</span>
                </Button>
              </div>
            ) : (
              <div className="h-full min-h-[360px] border border-dashed border-[#33373B] rounded-3xl flex flex-col items-center justify-center p-8 text-center space-y-3 text-[#B8B8B3] bg-[#1A1D20]/40">
                <Sparkles className="w-12 h-12 text-[#FFB800]/50" />
                <p className="text-sm font-semibold text-[#F5F5F2]">Bino parametrlarini kiriting va tugmani bosing</p>
                <p className="text-xs max-w-sm text-[#777A7C]">
                  Gemini AI issiqlik muhandisi bino uchun eng maqbul izolyatsiya, mineral tosh qoplamalari va tejamkorlik
                  rejasini tuzib beradi.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SAVED AUDITS */}
      {activeSubTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#33373B]">
            <div>
              <h3 className="text-base font-bold text-[#F5F5F2]">Mening Saqlangan ESCO Auditlarim</h3>
              <p className="text-xs text-[#B8B8B3]">Shaxsiy profilga biriktirilgan energiya samaradorlik hisobotlari</p>
            </div>
            {isLoggedIn && (
              <Button variant="secondary" size="sm" onClick={fetchSavedAudits} isLoading={loadingAudits}>
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Yangilash
              </Button>
            )}
          </div>

          {!isLoggedIn ? (
            <div className="p-8 border border-dashed border-[#33373B] rounded-3xl text-center space-y-3 bg-[#1A1D20]/50">
              <LogIn className="w-10 h-10 mx-auto text-[#FFB800]" />
              <h4 className="text-sm font-bold text-[#F5F5F2]">Tizimga kirish talab etiladi</h4>
              <p className="text-xs text-[#B8B8B3] max-w-md mx-auto">
                Saqlangan auditlar tarixi va tavsiyalarni ko‘rish uchun SMS OTP yoki parolingiz orqali tizimga kiring.
              </p>
            </div>
          ) : loadingAudits ? (
            <div className="text-center py-16 text-[#B8B8B3] font-mono text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#FFB800]" />
              Saqlangan auditlar yuklanmoqda...
            </div>
          ) : savedError ? (
            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-xs text-red-400">
              {savedError}
            </div>
          ) : savedAudits.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[#33373B] rounded-3xl space-y-3 text-[#B8B8B3]">
              <Layers className="w-10 h-10 mx-auto text-[#FFB800]/50" />
              <p className="text-sm font-semibold text-[#F5F5F2]">Hozircha saqlangan auditlar mavjud emas</p>
              <p className="text-xs">
                'AI ESCO Kalkulyatori' yorlig'iga o‘ting, bino parametrlarini kiriting va 'Auditni Profilga Saqlash'
                tugmasini bosing.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedAudits.map((audit) => (
                <Card key={audit.id} className="space-y-4 border border-[#33373B] hover:border-[#51504A] transition-all">
                  <div className="flex items-center justify-between pb-3 border-b border-[#33373B]">
                    <div>
                      <Badge variant="success" className="font-mono text-[10px]">
                        {BUILDING_TYPES[audit.buildingType] || audit.buildingType}
                      </Badge>
                      <h4 className="font-bold text-sm text-[#F5F5F2] mt-1">Maydon: {audit.areaM2} m²</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#777A7C] font-mono block">
                        {new Date(audit.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs font-mono font-black text-emerald-400">
                        +{audit.estimatedSavingsPct}% tejamkorlik
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#151719] p-2.5 rounded-xl border border-[#33373B]">
                      <span className="text-[10px] text-[#777A7C] uppercase font-mono block">Yillik tejam:</span>
                      <span className="font-mono font-bold text-[#FFB800]">
                        {Number(audit.annualSavingsSum).toLocaleString()} so'm
                      </span>
                    </div>
                    <div className="bg-[#151719] p-2.5 rounded-xl border border-[#33373B]">
                      <span className="text-[10px] text-[#777A7C] uppercase font-mono block">Oqlash muddati:</span>
                      <span className="font-mono font-bold text-[#F5F5F2]">
                        {audit.paybackYears} yil
                      </span>
                    </div>
                    <div className="bg-[#151719] p-2.5 rounded-xl border border-[#33373B]">
                      <span className="text-[10px] text-[#777A7C] uppercase font-mono block">CO2 Qisqarishi:</span>
                      <span className="font-mono font-bold text-emerald-300">
                        -{audit.co2ReductionTons} t/yil
                      </span>
                    </div>
                    <div className="bg-[#151719] p-2.5 rounded-xl border border-[#33373B]">
                      <span className="text-[10px] text-[#777A7C] uppercase font-mono block">Joriy sarf:</span>
                      <span className="font-mono font-bold text-[#B8B8B3]">
                        {Number(audit.currentEnergyUsageKwh).toLocaleString()} kVt/soat
                      </span>
                    </div>
                  </div>

                  {audit.recommendations && audit.recommendations.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] text-[#777A7C] uppercase font-mono block">Tavsiya materiallar:</span>
                      <div className="space-y-1">
                        {audit.recommendations.slice(0, 3).map((rec, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs text-[#B8B8B3]">
                            <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="truncate">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {audit.insulationAdvice && (
                    <p className="text-[11px] text-[#B8B8B3] bg-[#151719] p-2.5 rounded-xl border border-[#33373B] leading-relaxed">
                      {audit.insulationAdvice}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
