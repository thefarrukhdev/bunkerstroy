import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Building2,
  Layers,
  Zap,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  Package,
  ShoppingCart,
  RotateCcw,
  Sparkles,
  Flame,
  Leaf,
  Info,
  ArrowRight
} from 'lucide-react';
import { cn } from '@bunkerstroy/ui';
import { triggerHaptic } from '../../services/mobileBridge';

type CalculatorTab = 'concrete' | 'brick' | 'rebar' | 'esco';

export const CalculatorsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('concrete');

  // =========================================================================
  // 1. Concrete & Cement Calculator State
  // =========================================================================
  const [concreteMode, setConcreteMode] = useState<'volume' | 'area'>('volume');
  const [concreteVolumeM3, setConcreteVolumeM3] = useState<number>(10);
  const [concreteAreaM2, setConcreteAreaM2] = useState<number>(50);
  const [concreteThicknessCm, setConcreteThicknessCm] = useState<number>(15);
  const [concreteGrade, setConcreteGrade] = useState<'M150' | 'M200' | 'M250' | 'M300' | 'M350'>('M250');

  // Concrete calculation formulas
  const calculatedVolume = useMemo(() => {
    if (concreteMode === 'volume') return concreteVolumeM3;
    return Math.round((concreteAreaM2 * (concreteThicknessCm / 100)) * 100) / 100;
  }, [concreteMode, concreteVolumeM3, concreteAreaM2, concreteThicknessCm]);

  const concreteResults = useMemo(() => {
    // Proportions per 1 m3 based on grade (Cement kg, Sand tons, Gravel tons, Water L)
    const gradeRatios = {
      M150: { cementKg: 260, sandTons: 0.85, gravelTons: 1.25, waterL: 190, pricePerM3: 650000 },
      M200: { cementKg: 300, sandTons: 0.80, gravelTons: 1.20, waterL: 195, pricePerM3: 720000 },
      M250: { cementKg: 340, sandTons: 0.75, gravelTons: 1.18, waterL: 200, pricePerM3: 790000 },
      M300: { cementKg: 380, sandTons: 0.70, gravelTons: 1.15, waterL: 205, pricePerM3: 860000 },
      M350: { cementKg: 420, sandTons: 0.65, gravelTons: 1.10, waterL: 210, pricePerM3: 940000 }
    };

    const ratio = gradeRatios[concreteGrade];
    const totalCementKg = Math.round(ratio.cementKg * calculatedVolume);
    const cementBags50kg = Math.ceil(totalCementKg / 50);
    const cementTons = Math.round((totalCementKg / 1000) * 10) / 10;
    const sandTons = Math.round(ratio.sandTons * calculatedVolume * 10) / 10;
    const gravelTons = Math.round(ratio.gravelTons * calculatedVolume * 10) / 10;
    const waterLiters = Math.round(ratio.waterL * calculatedVolume);
    const estimatedCost = Math.round(ratio.pricePerM3 * calculatedVolume);

    return {
      volume: calculatedVolume,
      totalCementKg,
      cementBags50kg,
      cementTons,
      sandTons,
      gravelTons,
      waterLiters,
      estimatedCost
    };
  }, [calculatedVolume, concreteGrade]);

  // =========================================================================
  // 2. Brick & Gas Block Calculator State
  // =========================================================================
  const [wallLengthM, setWallLengthM] = useState<number>(20);
  const [wallHeightM, setWallHeightM] = useState<number>(3.0);
  const [openingsAreaM2, setOpeningsAreaM2] = useState<number>(8); // doors + windows
  const [materialType, setMaterialType] = useState<'brick_standard' | 'gasblock_200' | 'gasblock_300'>('brick_standard');
  const [wallThicknessType, setWallThicknessType] = useState<'half' | 'single' | 'one_and_half'>('single');

  const brickResults = useMemo(() => {
    const grossArea = Math.max(1, wallLengthM * wallHeightM);
    const netArea = Math.max(0.5, grossArea - openingsAreaM2);

    if (materialType === 'brick_standard') {
      // Standard fired brick (250 x 120 x 65 mm):
      // Half brick (12cm): ~51 bricks/m2 + mortar
      // Single brick (25cm): ~102 bricks/m2 + mortar
      // 1.5 brick (38cm): ~153 bricks/m2 + mortar
      const multiplier = wallThicknessType === 'half' ? 51 : wallThicknessType === 'single' ? 102 : 153;
      const exactBricks = Math.ceil(netArea * multiplier);
      const totalWithReserve = Math.ceil(exactBricks * 1.05); // 5% reserve
      const mortarM3 = Math.round(netArea * (wallThicknessType === 'half' ? 0.025 : wallThicknessType === 'single' ? 0.055 : 0.085) * 100) / 100;
      const unitPrice = 1450; // so'm per brick
      const estimatedCost = totalWithReserve * unitPrice + mortarM3 * 650000;

      return {
        netArea: Math.round(netArea * 10) / 10,
        unitCount: totalWithReserve,
        unitLabel: 'dona pishgan g‘isht',
        reserveCount: totalWithReserve - exactBricks,
        mortarM3,
        estimatedCost: Math.round(estimatedCost)
      };
    } else {
      // Gasblock (600 x 300 x 200 mm): ~8.33 blocks/m2 for 200mm wall, or 11.1 for 300mm
      const is300 = materialType === 'gasblock_300';
      const blocksPerM2 = is300 ? 11.1 : 8.33;
      const exactBlocks = Math.ceil(netArea * blocksPerM2);
      const totalBlocks = Math.ceil(exactBlocks * 1.04);
      const glueBags25kg = Math.ceil(netArea * 0.25);
      const unitPrice = is300 ? 32000 : 24000;
      const estimatedCost = totalBlocks * unitPrice + glueBags25kg * 55000;

      return {
        netArea: Math.round(netArea * 10) / 10,
        unitCount: totalBlocks,
        unitLabel: is300 ? 'dona gazoblok (D500 300mm)' : 'dona gazoblok (D500 200mm)',
        reserveCount: totalBlocks - exactBlocks,
        mortarM3: Math.round((glueBags25kg * 25) / 1000 * 100) / 100,
        estimatedCost: Math.round(estimatedCost)
      };
    }
  }, [wallLengthM, wallHeightM, openingsAreaM2, materialType, wallThicknessType]);

  // =========================================================================
  // 3. Rebar & Steel Calculator State
  // =========================================================================
  const [rebarDiameter, setRebarDiameter] = useState<number>(12); // mm
  const [rebarLengthMeters, setRebarLengthMeters] = useState<number>(500);

  const rebarResults = useMemo(() => {
    // Linear mass in kg/meter by diameter (GOST 5781-82):
    const linearMassMap: Record<number, number> = {
      8: 0.395,
      10: 0.617,
      12: 0.888,
      14: 1.21,
      16: 1.58,
      18: 2.0,
      20: 2.47,
      25: 3.85,
      32: 6.31
    };

    const massPerMeter = linearMassMap[rebarDiameter] || 0.888;
    const totalWeightKg = Math.round(massPerMeter * rebarLengthMeters * 10) / 10;
    const totalWeightTons = Math.round((totalWeightKg / 1000) * 1000) / 1000;
    const standardBars117m = Math.ceil(rebarLengthMeters / 11.7);
    const pricePerTon = 9400000; // so'm per ton Bekobod A500C
    const estimatedCost = Math.round(totalWeightTons * pricePerTon);

    return {
      massPerMeter,
      totalWeightKg,
      totalWeightTons,
      standardBars117m,
      estimatedCost
    };
  }, [rebarDiameter, rebarLengthMeters]);

  // =========================================================================
  // 4. ESCO Energy Efficiency & Thermal Insulation State
  // =========================================================================
  const [buildingType, setBuildingType] = useState('residential');
  const [heatedAreaM2, setHeatedAreaM2] = useState<number>(240);
  const [existingWall, setExistingWall] = useState('brick');
  const [insulationThicknessMm, setInsulationThicknessMm] = useState<number>(100);

  const escoResults = useMemo(() => {
    // Baseline annual gas/electricity heating cost ~45,000 UZS/m2/year for uninsulated
    const baselineHeatingCost = heatedAreaM2 * 52000;
    // Energy savings 38% for 50mm basalt, 48% for 100mm basalt
    const savingsPercent = insulationThicknessMm === 100 ? 46 : 36;
    const annualSavingsUzs = Math.round(baselineHeatingCost * (savingsPercent / 100));
    // CO2 reduction: approx 0.035 tons CO2 per m2 saved
    const co2Tons = Math.round(heatedAreaM2 * (savingsPercent / 100) * 0.045 * 10) / 10;
    // Required basalt insulation volume (m3) and cost
    const wallAreaEstimate = heatedAreaM2 * 1.35;
    const basaltVolumeM3 = Math.round(wallAreaEstimate * (insulationThicknessMm / 1000) * 10) / 10;
    const investmentCost = Math.round(basaltVolumeM3 * 1150000 + wallAreaEstimate * 65000);
    const paybackYears = Math.round((investmentCost / annualSavingsUzs) * 10) / 10;

    return {
      savingsPercent,
      annualSavingsUzs,
      co2Tons,
      basaltVolumeM3,
      investmentCost,
      paybackYears
    };
  }, [heatedAreaM2, insulationThicknessMm]);

  return (
    <div className="space-y-6 text-slate-900 pb-16 font-sans">
      {/* 1. Industrial Header Banner */}
      <div className="relative bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-[#D95D1E] uppercase tracking-wider">
                Sanoat Muhandislik Kalkulyatorlari
              </span>
              <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                GOST &amp; ShNQ Standart
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-slate-900">
              Qurilish Materiallari &amp; ESCO Hisoblagichi
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Beton, sement, g‘isht, armatura va energiya tejamkor bazalt izolyatsiyasini aniq muhandislik formulalari asosida bir zumda hisoblang.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs shrink-0">
            <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-slate-700 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#D95D1E]" />
              <span className="font-semibold">4 xil ixtisoslashgan modul</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Calculator Module Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none pb-1 font-mono text-xs touch-pan-x">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('concrete');
          }}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold transition-all whitespace-nowrap cursor-pointer shadow-xs min-h-[44px]',
            activeTab === 'concrete'
              ? 'bg-[#D95D1E] text-white border-[#D95D1E]'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900'
          )}
        >
          <Building2 className="w-4 h-4 shrink-0" />
          <span>1. Beton &amp; Sement Sarfi</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('brick');
          }}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold transition-all whitespace-nowrap cursor-pointer shadow-xs min-h-[44px]',
            activeTab === 'brick'
              ? 'bg-[#D95D1E] text-white border-[#D95D1E]'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900'
          )}
        >
          <Layers className="w-4 h-4 shrink-0" />
          <span>2. G‘isht &amp; Gazoblok</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('rebar');
          }}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold transition-all whitespace-nowrap cursor-pointer shadow-xs min-h-[44px]',
            activeTab === 'rebar'
              ? 'bg-[#D95D1E] text-white border-[#D95D1E]'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900'
          )}
        >
          <Zap className="w-4 h-4 shrink-0" />
          <span>3. Armatura &amp; Metall</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('esco');
          }}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold transition-all whitespace-nowrap cursor-pointer shadow-xs min-h-[44px]',
            activeTab === 'esco'
              ? 'bg-[#D95D1E] text-white border-[#D95D1E]'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900'
          )}
        >
          <Leaf className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>4. ESCO &amp; Termoizolyatsiya</span>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: BETON VA SEMENT SARFI KALKULYATORI
          ===================================================================== */}
      {activeTab === 'concrete' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono">
          {/* Input controls (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-sm text-slate-900 uppercase flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#D95D1E]" />
                Beton Parametrlari
              </span>
              <span className="text-[10px] text-slate-500 font-medium">GOST 7473-2010</span>
            </div>

            {/* Mode switcher: By Volume vs By Area & Thickness */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setConcreteMode('volume')}
                className={cn(
                  'py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[40px]',
                  concreteMode === 'volume'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                Hajm bo‘yicha (m³)
              </button>
              <button
                type="button"
                onClick={() => setConcreteMode('area')}
                className={cn(
                  'py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[40px]',
                  concreteMode === 'area'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                Maydon &times; Qalinlik
              </button>
            </div>

            {/* Inputs based on mode */}
            {concreteMode === 'volume' ? (
              <div className="space-y-1">
                <label className="text-xs text-slate-700 block font-medium">Jami beton hajmi (m³):</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={concreteVolumeM3}
                  onChange={(e) => setConcreteVolumeM3(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:border-[#D95D1E] outline-none"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-700 block font-medium">Maydon (m²):</label>
                  <input
                    type="number"
                    min="1"
                    value={concreteAreaM2}
                    onChange={(e) => setConcreteAreaM2(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:border-[#D95D1E] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-700 block font-medium">Qalinlik (sm):</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={concreteThicknessCm}
                    onChange={(e) => setConcreteThicknessCm(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:border-[#D95D1E] outline-none"
                  />
                </div>
              </div>
            )}

            {/* Concrete Grade Selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-700 block font-medium">Beton markasi (Sinf):</label>
              <div className="grid grid-cols-5 gap-1.5">
                {(['M150', 'M200', 'M250', 'M300', 'M350'] as const).map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setConcreteGrade(grade)}
                    className={cn(
                      'py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[44px]',
                      concreteGrade === grade
                        ? 'bg-orange-50/50 border-[#D95D1E] text-[#D95D1E] ring-1 ring-[#D95D1E]'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    )}
                  >
                    {grade}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-500 block pt-0.5">
                {concreteGrade === 'M200' && 'Tasma fundament, pol styajkasi uchun'}
                {concreteGrade === 'M250' && 'Monolit fundament, zinalar, plitalar'}
                {concreteGrade === 'M300' && 'Monolit karkas, ustun va og‘ir yukbop konstruksiyalar'}
                {concreteGrade === 'M350' && 'Ko‘p qavatli binolar, gidro-inshootlar'}
                {concreteGrade === 'M150' && 'Yengil tayyorgarlik qatlami (podgotovka)'}
              </span>
            </div>
          </div>

          {/* Results Display (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Hisoblangan Hajm:</span>
                <span className="text-xl sm:text-2xl font-black text-[#D95D1E] font-mono-numbers">
                  {concreteResults.volume} m³ beton ({concreteGrade})
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Taxminiy Qiymat:</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono-numbers">
                  {concreteResults.estimatedCost.toLocaleString()} so‘m
                </span>
              </div>
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-700 uppercase font-bold">Portlendsement M500</span>
                <p className="text-base font-black text-slate-900 font-mono-numbers">
                  {concreteResults.cementBags50kg} qop
                </p>
                <p className="text-[10px] text-slate-500">({concreteResults.cementTons} tonna)</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-700 uppercase font-bold">Yuvilgan Qum</span>
                <p className="text-base font-black text-slate-900 font-mono-numbers">
                  {concreteResults.sandTons} t
                </p>
                <p className="text-[10px] text-slate-500">Fraksiya 0-5mm</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-700 uppercase font-bold">Sheben / Shag‘al</span>
                <p className="text-base font-black text-slate-900 font-mono-numbers">
                  {concreteResults.gravelTons} t
                </p>
                <p className="text-[10px] text-slate-500">Fraksiya 5-20mm</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-700 uppercase font-bold">Texnik Suv</span>
                <p className="text-base font-black text-slate-900 font-mono-numbers">
                  {concreteResults.waterLiters} L
                </p>
                <p className="text-[10px] text-slate-500">Optimal nisbat</p>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs font-sans">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-800 font-medium">
                  Ushbu materiallar to‘g‘ridan-to‘g‘ri BunkerStroy hamkor karer va sement zavodlaridan 50/50 Escrow bilan yetkazib beriladi.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: G'ISHT VA GAZOBLOK KALKULYATORI
          ===================================================================== */}
      {activeTab === 'brick' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-sm text-slate-900 uppercase flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#D95D1E]" />
                Devor Parametrlari
              </span>
              <span className="text-[10px] text-slate-500 font-medium">GOST 530-2012</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-700 block font-medium">Devor uzunligi (m):</label>
                <input
                  type="number"
                  min="1"
                  value={wallLengthM}
                  onChange={(e) => setWallLengthM(Math.max(1, parseFloat(e.target.value) || 1))}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:border-[#D95D1E] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-700 block font-medium">Devor balandligi (m):</label>
                <input
                  type="number"
                  min="1"
                  value={wallHeightM}
                  onChange={(e) => setWallHeightM(Math.max(1, parseFloat(e.target.value) || 1))}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:border-[#D95D1E] outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-700 block font-medium">Eshik va romlar maydoni (m²):</label>
              <input
                type="number"
                min="0"
                value={openingsAreaM2}
                onChange={(e) => setOpeningsAreaM2(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:border-[#D95D1E] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-700 block font-medium">Material turi:</label>
              <select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value as any)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono outline-none cursor-pointer focus:border-[#D95D1E]"
              >
                <option value="brick_standard">Standart pishgan qizil g‘isht (250x120x65 mm)</option>
                <option value="gasblock_200">Avtoklav Gazoblok D500 (600x300x200 mm)</option>
                <option value="gasblock_300">Avtoklav Gazoblok D500 (600x300x300 mm)</option>
              </select>
            </div>

            {materialType === 'brick_standard' && (
              <div className="space-y-1.5">
                <label className="text-xs text-slate-700 block font-medium">Devor qalinligi:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setWallThicknessType('half')}
                    className={cn(
                      'py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[44px]',
                      wallThicknessType === 'half'
                        ? 'bg-orange-50/50 border-[#D95D1E] text-[#D95D1E] ring-1 ring-[#D95D1E]'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    )}
                  >
                    0.5 g‘isht (12 sm)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWallThicknessType('single')}
                    className={cn(
                      'py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[44px]',
                      wallThicknessType === 'single'
                        ? 'bg-orange-50/50 border-[#D95D1E] text-[#D95D1E] ring-1 ring-[#D95D1E]'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    )}
                  >
                    1 g‘isht (25 sm)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWallThicknessType('one_and_half')}
                    className={cn(
                      'py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[44px]',
                      wallThicknessType === 'one_and_half'
                        ? 'bg-orange-50/50 border-[#D95D1E] text-[#D95D1E] ring-1 ring-[#D95D1E]'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    )}
                  >
                    1.5 g‘isht (38 sm)
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Sof Devor Maydoni:</span>
                <span className="text-xl sm:text-2xl font-black text-[#D95D1E] font-mono-numbers">
                  {brickResults.netArea} m²
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Taxminiy Material Narxi:</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono-numbers">
                  {brickResults.estimatedCost.toLocaleString()} so‘m
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-700 uppercase font-bold">Kerakli Miqdor</span>
                <p className="text-xl font-black text-slate-900 font-mono-numbers">
                  {brickResults.unitCount.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-500">{brickResults.unitLabel}</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] text-emerald-600 uppercase font-bold">5% Zaxira (Sinish)</span>
                <p className="text-xl font-black text-emerald-600 font-mono-numbers">
                  +{brickResults.reserveCount.toLocaleString()} dona
                </p>
                <p className="text-[10px] text-slate-500">Zaxira kiritilgan</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-700 uppercase font-bold">Qorishma / Yelim</span>
                <p className="text-xl font-black text-slate-900 font-mono-numbers">
                  ~{brickResults.mortarM3} m³
                </p>
                <p className="text-[10px] text-slate-500">Sement-qum qorishmasi</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: ARMATURA VA METALL KALKULYATORI
          ===================================================================== */}
      {activeTab === 'rebar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-sm text-slate-900 uppercase flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#D95D1E]" />
                Armatura Parametrlari
              </span>
              <span className="text-[10px] text-slate-500 font-medium">GOST 5781-82 / A500C</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-700 block font-medium">Armatura diametri (mm):</label>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                {[8, 10, 12, 14, 16, 18, 20, 25, 32].map((diam) => (
                  <button
                    key={diam}
                    type="button"
                    onClick={() => setRebarDiameter(diam)}
                    className={cn(
                      'py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[44px]',
                      rebarDiameter === diam
                        ? 'bg-orange-50/50 border-[#D95D1E] text-[#D95D1E] ring-1 ring-[#D95D1E]'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    )}
                  >
                    d{diam}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-700 block font-medium">Umumiy uzunlik (metr):</label>
              <input
                type="number"
                min="1"
                step="10"
                value={rebarLengthMeters}
                onChange={(e) => setRebarLengthMeters(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:border-[#D95D1E] outline-none"
              />
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Jami Og‘irlik:</span>
                <span className="text-xl sm:text-2xl font-black text-[#D95D1E] font-mono-numbers">
                  {rebarResults.totalWeightTons} tonna ({rebarResults.totalWeightKg.toLocaleString()} kg)
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Zavod Ulgurji Narxi:</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono-numbers">
                  {rebarResults.estimatedCost.toLocaleString()} so‘m
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-700 uppercase font-bold">1 Metr Vazni</span>
                <p className="text-lg font-black text-slate-900 font-mono-numbers">
                  {rebarResults.massPerMeter} kg/m
                </p>
                <p className="text-[10px] text-slate-500">Standart GOST</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-700 uppercase font-bold">11.7m Xodalar Soni</span>
                <p className="text-lg font-black text-slate-900 font-mono-numbers">
                  ~{rebarResults.standardBars117m} dona
                </p>
                <p className="text-[10px] text-slate-500">Standart uzunlik</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-emerald-600 uppercase font-bold">Yuk Tashish</span>
                <p className="text-lg font-black text-emerald-600 font-mono-numbers">
                  {rebarResults.totalWeightTons <= 4 ? 'ISUZU Bortli' : 'Fura 20t'}
                </p>
                <p className="text-[10px] text-slate-500">Og‘irlikka mos</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: ESCO ENERGIYA TEJAMKORLIK & TERMOIZOLYATSIYA
          ===================================================================== */}
      {activeTab === 'esco' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-sm text-slate-900 uppercase flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                ESCO Bino Parametrlari
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">ShNQ 2.01.04-18</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-700 block font-medium">Isitiladigan maydon (m²):</label>
              <input
                type="number"
                min="20"
                step="10"
                value={heatedAreaM2}
                onChange={(e) => setHeatedAreaM2(Math.max(10, parseFloat(e.target.value) || 10))}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:border-[#D95D1E] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-700 block font-medium">Bazalt plita qalinligi:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInsulationThicknessMm(50)}
                  className={cn(
                    'py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[44px]',
                    insulationThicknessMm === 50
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800 ring-1 ring-emerald-600'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  )}
                >
                  50 mm Bazalt (Standart)
                </button>
                <button
                  type="button"
                  onClick={() => setInsulationThicknessMm(100)}
                  className={cn(
                    'py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[44px]',
                    insulationThicknessMm === 100
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800 ring-1 ring-emerald-600'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  )}
                >
                  100 mm Bazalt (Energiya A+)
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] text-emerald-600 uppercase font-bold block">Energiya Tejash Salohiyati:</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono-numbers">
                  -{escoResults.savingsPercent}% Issiqlik Yo‘qotilishi
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Yillik Iqtisod (Gaz/Tok):</span>
                <span className="text-xl sm:text-2xl font-black text-[#D95D1E] font-mono-numbers">
                  {escoResults.annualSavingsUzs.toLocaleString()} so‘m / yil
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-700 uppercase font-bold">Xarajat Qoplanishi</span>
                <p className="text-xl font-black text-slate-900 font-mono-numbers">
                  ~{escoResults.paybackYears} yil
                </p>
                <p className="text-[10px] text-slate-500">Tejamkorlik hisobiga</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] text-emerald-600 uppercase font-bold">CO₂ Kamayishi</span>
                <p className="text-xl font-black text-emerald-600 font-mono-numbers">
                  {escoResults.co2Tons} tonna/yil
                </p>
                <p className="text-[10px] text-slate-500">Ekologik sertifikat</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-700 uppercase font-bold">Bazalt Hajmi</span>
                <p className="text-xl font-black text-slate-900 font-mono-numbers">
                  {escoResults.basaltVolumeM3} m³
                </p>
                <p className="text-[10px] text-slate-500">NG yong‘inga chidamli</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
