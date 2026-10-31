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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D95D1E] text-white flex items-center justify-center font-black shadow-md shadow-[#D95D1E]/20 shrink-0">
            <BarChart3 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider text-slate-900">
              Tizim Boshqaruv &amp; Tahlil Markazi
            </h1>
            <p className="text-xs text-slate-600 font-mono">
              BunkerStroy 14 ta hudud monitoringi, kassa tushumi va marjalar
            </p>
          </div>
        </div>

        <div className="inline-flex rounded-xl bg-slate-50 p-1 border border-slate-200">
          <button
            onClick={() => setActiveSubTab('bunker_stats')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'bunker_stats'
                ? 'bg-[#D95D1E] text-white font-black shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>14 Hudud BunkerStats</span>
          </button>
          <button
            onClick={() => setActiveSubTab('categories')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'categories'
                ? 'bg-[#D95D1E] text-white font-black shadow-md'
                : 'text-slate-600 hover:text-slate-900'
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
            <div className="p-5 rounded-2xl bg-white border border-slate-200 text-slate-900">
              <div className="flex items-center justify-between text-xs font-mono text-slate-600 mb-2">
                <span>Sement va Quruq aralashmalar</span>
                <span className="text-[#D95D1E] font-black">38%</span>
              </div>
              <div className="text-xl font-black font-mono">564.3 mln UZS</div>
              <div className="w-full bg-slate-100 h-2 rounded-sm mt-3 overflow-hidden">
                <div className="bg-[#D95D1E] h-full w-[38%]" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 text-slate-900">
              <div className="flex items-center justify-between text-xs font-mono text-slate-600 mb-2">
                <span>Metall va Armatura prokati</span>
                <span className="text-blue-600 font-black">29%</span>
              </div>
              <div className="text-xl font-black font-mono">430.6 mln UZS</div>
              <div className="w-full bg-slate-100 h-2 rounded-sm mt-3 overflow-hidden">
                <div className="bg-blue-600 h-full w-[29%]" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 text-slate-900">
              <div className="flex items-center justify-between text-xs font-mono text-slate-600 mb-2">
                <span>G'isht va Gazobloklar</span>
                <span className="text-amber-600 font-black">18%</span>
              </div>
              <div className="text-xl font-black font-mono">267.3 mln UZS</div>
              <div className="w-full bg-slate-100 h-2 rounded-sm mt-3 overflow-hidden">
                <div className="bg-amber-600 h-full w-[18%]" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 text-slate-900">
              <div className="flex items-center justify-between text-xs font-mono text-slate-600 mb-2">
                <span>ESCO Energotejamkor materiallar</span>
                <span className="text-emerald-700 font-black">11%</span>
              </div>
              <div className="text-xl font-black font-mono">163.3 mln UZS</div>
              <div className="w-full bg-slate-100 h-2 rounded-sm mt-3 overflow-hidden">
                <div className="bg-emerald-600 h-full w-[11%]" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
