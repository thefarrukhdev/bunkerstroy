import React, { useState, useMemo } from 'react';
import { Layers } from 'lucide-react';
import { cn } from '@bunkerstroy/ui';
import type { BrickMaterialType, WallThicknessType, BrickResult } from './types';

export const BrickCalculator: React.FC = () => {
  const [wallLengthM, setWallLengthM] = useState<number>(20);
  const [wallHeightM, setWallHeightM] = useState<number>(3.0);
  const [openingsAreaM2, setOpeningsAreaM2] = useState<number>(8);
  const [materialType, setMaterialType] = useState<BrickMaterialType>('brick_standard');
  const [wallThicknessType, setWallThicknessType] = useState<WallThicknessType>('single');

  const results: BrickResult = useMemo(() => {
    const grossArea = Math.max(1, wallLengthM * wallHeightM);
    const netArea = Math.max(0.5, grossArea - openingsAreaM2);

    if (materialType === 'brick_standard') {
      const multiplier = wallThicknessType === 'half' ? 51 : wallThicknessType === 'single' ? 102 : 153;
      const exactBricks = Math.ceil(netArea * multiplier);
      const totalWithReserve = Math.ceil(exactBricks * 1.05);
      const mortarM3 = Math.round(netArea * (wallThicknessType === 'half' ? 0.025 : wallThicknessType === 'single' ? 0.055 : 0.085) * 100) / 100;
      const unitPrice = 1450;
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono">
      {/* Input controls (5 cols) */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm font-sans">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="font-bold text-sm text-slate-900 uppercase flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#D95D1E]" />
            Devor Parametrlari
          </span>
          <span className="text-xs text-slate-500 font-medium">GOST 530-2012</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-700 block font-medium">Devor uzunligi (m):</label>
            <input
              type="number"
              min="1"
              value={wallLengthM}
              onChange={(e) => setWallLengthM(Math.max(1, parseFloat(e.target.value) || 1))}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm font-mono-numbers focus:border-[#D95D1E] outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-700 block font-medium">Devor balandligi (m):</label>
            <input
              type="number"
              min="1"
              value={wallHeightM}
              onChange={(e) => setWallHeightM(Math.max(1, parseFloat(e.target.value) || 1))}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm font-mono-numbers focus:border-[#D95D1E] outline-none"
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
            className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm font-mono-numbers focus:border-[#D95D1E] outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-700 block font-medium">Material turi:</label>
          <select
            value={materialType}
            onChange={(e) => setMaterialType(e.target.value as BrickMaterialType)}
            className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-sans outline-none cursor-pointer focus:border-[#D95D1E]"
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
                    ? 'bg-orange-50 border-[#D95D1E] text-[#D95D1E] ring-1 ring-[#D95D1E]'
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
                    ? 'bg-orange-50 border-[#D95D1E] text-[#D95D1E] ring-1 ring-[#D95D1E]'
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
                    ? 'bg-orange-50 border-[#D95D1E] text-[#D95D1E] ring-1 ring-[#D95D1E]'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                )}
              >
                1.5 g‘isht (38 sm)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Display (7 cols) */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm font-sans">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Sof Devor Maydoni:</span>
            <span className="text-xl sm:text-2xl font-black text-[#D95D1E]">
              {results.netArea} m²
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Taxminiy Material Narxi:</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono-numbers">
              {results.estimatedCost.toLocaleString()} so‘m
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-700 uppercase font-bold">Kerakli Miqdor</span>
            <p className="text-xl font-black text-slate-900 font-mono-numbers">
              {results.unitCount.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">{results.unitLabel}</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] text-emerald-600 uppercase font-bold">5% Zaxira (Sinish)</span>
            <p className="text-xl font-black text-emerald-600 font-mono-numbers">
              +{results.reserveCount.toLocaleString()} dona
            </p>
            <p className="text-xs text-slate-500">Zaxira kiritilgan</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-700 uppercase font-bold">Qorishma / Yelim</span>
            <p className="text-xl font-black text-slate-900 font-mono-numbers">
              ~{results.mortarM3} m³
            </p>
            <p className="text-xs text-slate-500">Sement-qum qorishmasi</p>
          </div>
        </div>
      </div>
    </div>
  );
};
