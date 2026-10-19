import React, { useState } from 'react';
import { Sparkles, TrendingDown, DollarSign, Leaf, CheckCircle, Calculator, Building2 } from 'lucide-react';
import { EscoCalculationResult } from '@bunkerstroy/types';
import { Button, Badge, Card } from '@bunkerstroy/ui';

export const EscoCalculatorView: React.FC = () => {
  const [buildingType, setBuildingType] = useState('RESIDENTIAL_MULTI_STOREY');
  const [areaM2, setAreaM2] = useState(450);
  const [energyUsageKwh, setEnergyUsageKwh] = useState(8500);
  const [wallMaterial, setWallMaterial] = useState("Pishiq g'isht 380mm");
  const [windowType, setWindowType] = useState('Oddiy ikki kamerali plastik');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EscoCalculationResult | null>(null);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/esco/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buildingType,
          areaM2,
          currentEnergyUsageKwh: energyUsageKwh,
          wallMaterial,
          windowType
        })
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (e) {
      console.error('ESCO calculation error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden border border-[#33373B] bg-gradient-to-r from-[#17231B] via-[#1A1D20] to-[#25281C] p-6 sm:p-10 shadow-2xl">
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-[#FFB800] to-emerald-400 absolute top-0 left-0" />
        <div className="max-w-3xl space-y-3">
          <Badge variant="success" className="gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            BunkerStroy ESCO — AI Energiya Servis Auditi
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black text-[#F5F5F2]">
            Binolar energiya tejamkorligini modellashtirish
          </h1>
          <p className="text-sm text-[#B8B8B3]">
            Binoning issiqlik yo‘qotish ko‘rsatkichlarini hisoblab, zamonaviy izolyatsiya orqali yillik tejamkorlik va xarajatlarning o‘zini oqlash muddatini (Payback Period) aniqlang.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters */}
        <div className="lg:col-span-6 bg-[#1A1D20] border border-[#33373B] p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-[#F5F5F2] flex items-center gap-2 border-b border-[#33373B] pb-3">
            <Building2 className="w-4 h-4 text-emerald-400" />
            Bino Parametrlari
          </h3>

          <div className="space-y-3.5 text-xs font-semibold text-[#B8B8B3]">
            <div>
              <label className="block mb-1">Bino turi:</label>
              <select
                value={buildingType}
                onChange={(e) => setBuildingType(e.target.value)}
                className="w-full bg-[#151719] border border-[#33373B] p-2.5 rounded-xl text-[#F5F5F2] outline-none"
              >
                <option value="RESIDENTIAL_MULTI_STOREY">Ko‘p qavatli turar joy binosi</option>
                <option value="PRIVATE_HOUSE_COTTAGE">Xususiy hovli / Kottej</option>
                <option value="COMMERCIAL_OFFICE">Tijorat / Ofis binosi</option>
                <option value="INDUSTRIAL_WAREHOUSE">Sanoat ombori / Ishlab chiqarish</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1">Umumiy maydon (m²):</label>
                <input
                  type="number"
                  value={areaM2}
                  onChange={(e) => setAreaM2(Number(e.target.value))}
                  className="w-full bg-[#151719] border border-[#33373B] p-2.5 rounded-xl text-[#F5F5F2] outline-none"
                />
              </div>
              <div>
                <label className="block mb-1">Yillik energiya sarfi (kVt/soat):</label>
                <input
                  type="number"
                  value={energyUsageKwh}
                  onChange={(e) => setEnergyUsageKwh(Number(e.target.value))}
                  className="w-full bg-[#151719] border border-[#33373B] p-2.5 rounded-xl text-[#F5F5F2] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1">Tashqi devor konstruksiyasi:</label>
              <input
                type="text"
                value={wallMaterial}
                onChange={(e) => setWallMaterial(e.target.value)}
                className="w-full bg-[#151719] border border-[#33373B] p-2.5 rounded-xl text-[#F5F5F2] outline-none"
              />
            </div>

            <div>
              <label className="block mb-1">Deraza va vitrina turlari:</label>
              <input
                type="text"
                value={windowType}
                onChange={(e) => setWindowType(e.target.value)}
                className="w-full bg-[#151719] border border-[#33373B] p-2.5 rounded-xl text-[#F5F5F2] outline-none"
              />
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
                <span className="text-xs font-bold font-mono uppercase text-[#B8B8B3]">Audit Natijasi</span>
                <Badge variant="success">Klass: {result.auditScore}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-[#151719] border border-[#33373B] p-3.5 rounded-2xl">
                  <span className="text-[10px] text-[#B8B8B3] uppercase font-mono block">Energiya tejamkorligi:</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">+{result.energySavingsPercent}%</span>
                </div>
                <div className="bg-[#151719] border border-[#33373B] p-3.5 rounded-2xl">
                  <span className="text-[10px] text-[#B8B8B3] uppercase font-mono block">O'zini oqlash muddati:</span>
                  <span className="text-2xl font-black text-[#FFB800] font-mono">{result.paybackYears} yil</span>
                </div>
                <div className="bg-[#151719] border border-[#33373B] p-3.5 rounded-2xl">
                  <span className="text-[10px] text-[#B8B8B3] uppercase font-mono block">Yillik tejalgan mablag':</span>
                  <span className="text-xl font-black text-[#F5F5F2] font-mono">{result.annualSavingsSum.toLocaleString()} so'm</span>
                </div>
                <div className="bg-[#151719] border border-[#33373B] p-3.5 rounded-2xl">
                  <span className="text-[10px] text-[#B8B8B3] uppercase font-mono block">CO2 Qisqarishi:</span>
                  <span className="text-xl font-black text-emerald-300 font-mono">-{result.co2ReductionTons} t/yil</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-[#F5F5F2] uppercase font-mono">Tavsiya etiladigan materiallar:</h4>
                <div className="space-y-1.5">
                  {result.recommendedMaterials.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#B8B8B3]">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs bg-[#151719] border border-[#33373B] p-3 rounded-xl text-[#B8B8B3] leading-relaxed">
                {result.insulationAdvice}
              </p>
            </div>
          ) : (
            <div className="h-full min-h-[300px] border border-dashed border-[#33373B] rounded-3xl flex flex-col items-center justify-center p-8 text-center space-y-3 text-[#B8B8B3]">
              <Sparkles className="w-10 h-10 text-[#FFB800]/50" />
              <p className="text-sm font-semibold text-[#F5F5F2]">Bino parametrlarini kiriting va tugmani bosing</p>
              <p className="text-xs max-w-sm">Gemini AI issiqlik muhandisi bino uchun eng maqbul izolyatsiya va tejamkorlik rejasini tuzib beradi.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
