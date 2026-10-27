import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Building2,
  ArrowUpRight,
  RefreshCw,
  BarChart3,
  Layers,
  MapPin,
  PieChart
} from 'lucide-react';
import { BunkerStatsDashboard } from '../monitoring/BunkerStatsDashboard';

export const OverviewStats: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'bunker_stats' | 'categories'>('bunker_stats');

  return (
    <div className="space-y-6">
      {/* Overview Navigation Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#0A1931] p-3 sm:p-4 rounded-2xl border-2 border-[#1E3A6D] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFB800] text-[#071326] flex items-center justify-center font-black shadow-md shadow-[#FFB800]/20 shrink-0">
            <BarChart3 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
              Tizim Boshqaruv &amp; Tahlil Markazi
            </h1>
            <p className="text-xs text-sky-200 font-mono">
              BunkerStroy 14 ta hudud monitoringi, kassa tushumi va marjalar
            </p>
          </div>
        </div>

        <div className="inline-flex rounded-xl bg-[#071326] p-1 border border-[#1E3A6D]">
          <button
            onClick={() => setActiveSubTab('bunker_stats')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'bunker_stats'
                ? 'bg-[#FFB800] text-[#071326] font-black shadow-md'
                : 'text-sky-200 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>14 Hudud BunkerStats</span>
          </button>
          <button
            onClick={() => setActiveSubTab('categories')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'categories'
                ? 'bg-[#FFB800] text-[#071326] font-black shadow-md'
                : 'text-sky-200 hover:text-white'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Kategoriyalar Tahlili</span>
          </button>
        </div>
      </div>

      {/* Main View: BunkerStats 14 Hudud Dashboard */}
      {activeSubTab === 'bunker_stats' && (
        <BunkerStatsDashboard />
      )}

      {/* Secondary View: Material Categories & Structural Analytics */}
      {activeSubTab === 'categories' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0A1931] border border-[#1E3A6D] text-white">
              <div className="flex items-center justify-between text-xs font-mono text-sky-200 mb-2">
                <span>Sement va Quruq aralashmalar</span>
                <span className="text-[#FFB800] font-black">38%</span>
              </div>
              <div className="text-xl font-black font-mono">564.3 mln UZS</div>
              <div className="w-full bg-[#071326] h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#FFB800] h-full w-[38%]" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0A1931] border border-[#1E3A6D] text-white">
              <div className="flex items-center justify-between text-xs font-mono text-sky-200 mb-2">
                <span>Metall va Armatura prokati</span>
                <span className="text-blue-400 font-black">29%</span>
              </div>
              <div className="text-xl font-black font-mono">430.6 mln UZS</div>
              <div className="w-full bg-[#071326] h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-blue-500 h-full w-[29%]" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0A1931] border border-[#1E3A6D] text-white">
              <div className="flex items-center justify-between text-xs font-mono text-sky-200 mb-2">
                <span>G'isht va Gazobloklar</span>
                <span className="text-amber-500 font-black">18%</span>
              </div>
              <div className="text-xl font-black font-mono">267.3 mln UZS</div>
              <div className="w-full bg-[#071326] h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-amber-500 h-full w-[18%]" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0A1931] border border-[#1E3A6D] text-white">
              <div className="flex items-center justify-between text-xs font-mono text-sky-200 mb-2">
                <span>ESCO Energotejamkor materiallar</span>
                <span className="text-emerald-400 font-black">11%</span>
              </div>
              <div className="text-xl font-black font-mono">163.3 mln UZS</div>
              <div className="w-full bg-[#071326] h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-emerald-500 h-full w-[11%]" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
