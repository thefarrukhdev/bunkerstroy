import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calculator,
  Building2,
  BookmarkPlus,
  History,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Percent,
  Flame,
  Leaf
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

  const getToken = () => {
    return typeof window !== 'undefined' ? localStorage.getItem('bunkerstroy_token') : null;
  };

  const isLoggedIn = !!getToken();

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

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white border border-bunker-border-strong rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="mb-1.5">
            <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
              Energiya Samaradorligi Auditi
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-bunker-text-primary">
            Bino Energiya Samaradorligi &amp; Termal Audit
          </h1>
          <p className="text-xs sm:text-sm text-bunker-text-secondary mt-1">
            Issiqlik yo‘qotilishini tahlil qilish, bazalt izolyatsiyasi samarasi va ROI o‘zini oqlash muddati.
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
            <span>Energiya Kalkulyatori</span>
          </TabTrigger>

          <TabTrigger value="saved">
            <History className="w-4 h-4" />
            <span>Saqlangan Auditlar</span>
            {savedAudits.length > 0 && (
              <span className="bg-orange-100 text-orange-800 text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ml-1">
                {savedAudits.length}
              </span>
            )}
          </TabTrigger>
        </TabsList>
      </Tabs>

      {/* 3. CALCULATOR TAB */}
      {activeSubTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form (6 cols) */}
          <div className="lg:col-span-6 bg-white border border-bunker-border-strong p-6 rounded-2xl space-y-4 shadow-xs">
            <h3 className="font-bold text-bunker-text-primary flex items-center gap-2 border-b border-bunker-border-subtle pb-3 text-sm font-mono">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Bino Parametrlarini Kiriting
            </h3>

            {calcError && (
              <Alert variant="error" description={calcError} onDismiss={() => setCalcError(null)} />
            )}

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-bunker-text-muted block text-[10px] uppercase font-bold mb-1">
                  Bino Turi:
                </label>
                <Select value={buildingType} onChange={(e) => setBuildingType(e.target.value)} sizeVariant="sm">
                  <option value="RESIDENTIAL_MULTI_STOREY">Ko‘p qavatli turar joy binosi</option>
                  <option value="PRIVATE_HOUSE_COTTAGE">Xususiy hovli / Kottej</option>
                  <option value="COMMERCIAL_OFFICE">Tijorat / Ofis binosi</option>
                  <option value="INDUSTRIAL_WAREHOUSE">Sanoat ombori / Ishlab chiqarish</option>
                  <option value="PUBLIC_SCHOOL_HOSPITAL">Maktab / Shifoxona / Ijtimoiy muassasa</option>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-bunker-text-muted block text-[10px] uppercase font-bold mb-1">
                    Umumiy Maydon (m²):
                  </label>
                  <Input
                    type="number"
                    min="20"
                    max="100000"
                    value={areaM2}
                    onChange={(e) => setAreaM2(Math.max(1, parseInt(e.target.value) || 1))}
                    sizeVariant="sm"
                  />
                </div>

                <div>
                  <label className="text-bunker-text-muted block text-[10px] uppercase font-bold mb-1">
                    Oylik Sarf (kVt·soat):
                  </label>
                  <Input
                    type="number"
                    min="100"
                    max="500000"
                    value={energyUsageKwh}
                    onChange={(e) => setEnergyUsageKwh(Math.max(1, parseInt(e.target.value) || 1))}
                    sizeVariant="sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-bunker-text-muted block text-[10px] uppercase font-bold mb-1">
                  Devor Materiali:
                </label>
                <Select value={wallMaterial} onChange={(e) => setWallMaterial(e.target.value)} sizeVariant="sm">
                  <option value="Pishiq g'isht 380mm">Pishiq g‘isht 380mm (Izolyatsiyasiz)</option>
                  <option value="Pishiq g'isht 510mm">Pishiq g‘isht 510mm</option>
                  <option value="Gazoblok D500 300mm">Gazoblok D500 300mm (Energiya tejamkor)</option>
                  <option value="Beton panel 250mm">Temir-beton panel 250mm (Sovuq oqimi yuqori)</option>
                  <option value="Xom g'isht 400mm">Xom paxsa / somonli g‘isht</option>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-bunker-text-muted block text-[10px] uppercase font-bold mb-1">
                    Deraza Turi:
                  </label>
                  <Select value={windowType} onChange={(e) => setWindowType(e.target.value)} sizeVariant="sm">
                    <option value="Oddiy ikki kamerali plastik">Oddiy 2 kamerali plastik</option>
                    <option value="Uch kamerali Low-E shisha">3 kamerali Low-E termo oyna</option>
                    <option value="Eski yog'och romlar">Eski yog‘och rom (Zichlanmagan)</option>
                    <option value="Alyuminiy fasad vitrina">Alyuminiy termo-uzilishli vitrina</option>
                  </Select>
                </div>

                <div>
                  <label className="text-bunker-text-muted block text-[10px] uppercase font-bold mb-1">
                    Isitish Turi:
                  </label>
                  <Select value={currentHeatingType} onChange={(e) => setCurrentHeatingType(e.target.value)} sizeVariant="sm">
                    <option value="Gaz qozoni">Gaz qozoni (Avtonom)</option>
                    <option value="Markaziy issiqlik">Markaziy qozonxona</option>
                    <option value="Elektr isitish">Elektr qozon / Konditsioner</option>
                    <option value="Ko'mir / Qattiq yoqilg'i">Ko‘mir qozoni</option>
                  </Select>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={handleCalculate}
              isLoading={loading}
              className="w-full text-xs font-mono font-bold mt-2"
            >
              <Zap className="w-4 h-4 mr-2" />
              <span>Energiya Auditini Hisoblash</span>
            </Button>
          </div>

          {/* Right Results Deck (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {result ? (
              <div className="bg-white border-2 border-emerald-500 p-6 rounded-2xl space-y-5 shadow-xs font-mono animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-bunker-border-subtle">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-bunker-text-primary">Energetik Pasport Natijasi</h4>
                      <span className="text-[10px] text-bunker-text-muted">ShNQ 2.01.04-18 standarti bo‘yicha</span>
                    </div>
                  </div>

                  <Badge variant="success" size="md" isMono className="font-extrabold text-xs">
                    Sinf: {result.auditScore || 'A++'}
                  </Badge>
                </div>

                {/* KPI metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-bunker-border-subtle">
                    <span className="text-[10px] text-bunker-text-muted uppercase block">Kutilayotgan Tejamkorlik:</span>
                    <span className="text-xl font-extrabold text-emerald-700">
                      {result.energySavingsPercent}%
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-bunker-border-subtle">
                    <span className="text-[10px] text-bunker-text-muted uppercase block">Yillik Iqtisodiy Samara:</span>
                    <span className="text-base font-extrabold text-bunker-amber-500">
                      {Number(result.annualSavingsSum).toLocaleString()} so'm
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-bunker-border-subtle">
                    <span className="text-[10px] text-bunker-text-muted uppercase block">O‘zini Oqlash Muddati:</span>
                    <span className="text-lg font-bold text-bunker-text-primary">
                      {result.paybackYears} yil
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-bunker-border-subtle">
                    <span className="text-[10px] text-bunker-text-muted uppercase block">CO₂ Qisqarishi:</span>
                    <span className="text-lg font-bold text-emerald-700">
                      {result.co2ReductionTons} t / yil
                    </span>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-2 pt-1 text-xs">
                  <span className="text-[10px] uppercase font-bold text-bunker-text-muted block">
                    Tavsiya Etiladigan Materiallar:
                  </span>
                  <div className="space-y-1.5">
                    {result.recommendedMaterials.map((rec, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-bunker-border-subtle text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-bunker-text-primary">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {saveSuccess && (
                  <Alert variant="success" description="Audit profildagi saqlangan auditlar ro‘yxatiga biriktirildi!" />
                )}
                {saveError && (
                  <Alert variant="error" description={saveError} onDismiss={() => setSaveError(null)} />
                )}

                <div className="pt-2 flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveAudit}
                    isLoading={isSaving}
                    className="flex-1 text-xs"
                  >
                    <BookmarkPlus className="w-4 h-4 mr-1.5" />
                    <span>Natijani Saqlash</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-bunker-border-strong rounded-2xl p-10 text-center font-mono space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-bunker-border-subtle flex items-center justify-center mx-auto text-bunker-text-muted">
                  <Calculator className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-bunker-text-primary text-sm">
                  Bino parametrlarini kiriting
                </h4>
                <p className="text-xs text-bunker-text-muted max-w-sm mx-auto">
                  Maydon va devor parametrlarini to‘ldirib, "Energiya Auditini Hisoblash" tugmasini bosing.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. SAVED AUDITS TAB */}
      {activeSubTab === 'saved' && (
        <div className="bg-white border border-bunker-border-strong rounded-2xl p-6 shadow-xs space-y-4 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-bunker-border-subtle">
            <h3 className="font-bold text-sm text-bunker-text-primary">
              Mening Saqlangan ESCO Auditlarim
            </h3>
            <span className="text-xs text-bunker-text-muted">{savedAudits.length} ta yozuv</span>
          </div>

          {!isLoggedIn ? (
            <div className="text-center py-12 text-xs text-bunker-text-muted space-y-2">
              <p>Saqlangan auditlarni ko‘rish uchun tizimga kiring.</p>
            </div>
          ) : loadingAudits ? (
            <div className="text-center py-12 text-xs text-bunker-text-muted">
              Yuklanmoqda...
            </div>
          ) : savedAudits.length === 0 ? (
            <div className="text-center py-12 text-xs text-bunker-text-muted space-y-2">
              <p>Hozircha saqlangan auditlar mavjud emas.</p>
              <p className="text-[11px]">Kalkulyatorda hisoblab, natijani saqlang.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bino Turi &amp; Maydon</TableHead>
                  <TableHead className="text-center">Tejamkorlik</TableHead>
                  <TableHead className="text-right">Yillik Iqtisod</TableHead>
                  <TableHead className="text-center">O‘zini Oqlash</TableHead>
                  <TableHead>Sana</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {savedAudits.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="font-bold text-bunker-text-primary">
                        {BUILDING_TYPES[a.buildingType] || a.buildingType}
                      </div>
                      <span className="text-[11px] text-bunker-text-muted">{a.areaM2} m²</span>
                    </TableCell>
                    <TableCell className="text-center font-bold text-emerald-700">
                      {a.estimatedSavingsPct}%
                    </TableCell>
                    <TableCell className="text-right font-extrabold text-bunker-amber-500">
                      {Number(a.annualSavingsSum).toLocaleString()} so'm
                    </TableCell>
                    <TableCell className="text-center">
                      {a.paybackYears} yil
                    </TableCell>
                    <TableCell className="text-xs text-bunker-text-muted">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
};
