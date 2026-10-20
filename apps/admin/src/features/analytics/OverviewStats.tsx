import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  BarChart3,
  Activity,
  Layers,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { Card, Badge, Button } from '@bunkerstroy/ui';

export const OverviewStats: React.FC = () => {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Mocked analytics data reflecting backend metrics
  const stats = {
    totalTurnover: 1485000000,
    turnoverChange: '+18.4%',
    netProfit: 143000000,
    profitMargin: '9.63%',
    profitChange: '+12.1%',
    ordersCount: 384,
    ordersToday: 24,
    ordersChange: '+8.5%',
    activeSuppliersCount: 28,
    suppliersVerifiedRate: '100%',
    totalIncome: 185000000,
    totalExpense: 42000000,
    returnsCount: 2,
    returnsSum: 3200000,
    returnsRate: '0.21%'
  };

  const categoryBreakdown = [
    { name: "Sement va Quruq aralashmalar", share: 38, amount: "564.3 mln", color: "bg-[#89B4FA]" },
    { name: "Metall va Armatura prokati", share: 29, amount: "430.6 mln", color: "bg-sky-500" },
    { name: "G'isht va Gazobloklar", share: 18, amount: "267.3 mln", color: "bg-amber-600" },
    { name: "ESCO Energotejamkor materiallar", share: 11, amount: "163.3 mln", color: "bg-emerald-500" },
    { name: "Og'ir texnika ijarasi & Logistika", share: 4, amount: "59.5 mln", color: "bg-purple-500" }
  ];

  const weeklyTrends = [
    { day: 'Dush', value: 165, orders: 48 },
    { day: 'Sesh', value: 198, orders: 56 },
    { day: 'Chor', value: 240, orders: 68 },
    { day: 'Pay', value: 215, orders: 61 },
    { day: 'Jum', value: 290, orders: 79 },
    { day: 'Shan', value: 235, orders: 52 },
    { day: 'Yak', value: 142, orders: 20 }
  ];

  const maxTrend = Math.max(...weeklyTrends.map((t) => t.value));

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-theme-card p-4 rounded-2xl border border-[#313244]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#89B4FA] animate-pulse" />
            <h1 className="text-xl font-black uppercase tracking-wider text-[#CDD6F4]">
              Tizim Boshqaruv Markazi (Overview)
            </h1>
          </div>
          <p className="text-xs text-[#A6ADC8] font-mono mt-0.5">
            BunkerStroy Real-vaqt B2B Aylanma, Marja va Buyurtmalar Tahlili
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex rounded-xl bg-[#181825] p-1 border border-[#313244]">
            {(
              [
                { id: 'today', label: 'Bugun' },
                { id: 'week', label: 'Hafta' },
                { id: 'month', label: 'Oy' },
                { id: 'year', label: 'Yil' }
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setPeriod(t.id)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  period === t.id
                    ? 'bg-[#89B4FA] text-[#181825] shadow-sm'
                    : 'text-[#A6ADC8] hover:text-[#CDD6F4]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            isLoading={isRefreshing}
            className="h-8"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Yangilash
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Turnover */}
        <Card rivetAccents className="bg-[#252538] border-[#313244]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-mono tracking-wider text-[#A6ADC8]">
              Jami Aylanma
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#89B4FA]/10 border border-[#89B4FA]/20 flex items-center justify-center text-[#89B4FA]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-[#CDD6F4]">
            {(stats.totalTurnover).toLocaleString('uz-UZ')} <span className="text-xs font-normal text-[#89B4FA]">UZS</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#313244]/60 text-xs">
            <span className="flex items-center text-emerald-400 font-semibold font-mono">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              {stats.turnoverChange}
            </span>
            <span className="text-[#6C7086] font-mono">o'tgan oyga nisbatan</span>
          </div>
        </Card>

        {/* Net Profit */}
        <Card rivetAccents className="bg-[#252538] border-[#313244]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-mono tracking-wider text-[#A6ADC8]">
              Sof Foyda (Marja)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            {(stats.netProfit).toLocaleString('uz-UZ')} <span className="text-xs font-normal text-emerald-300">UZS</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#313244]/60 text-xs">
            <span className="flex items-center text-emerald-400 font-semibold font-mono">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              {stats.profitChange}
            </span>
            <Badge variant="success">Marja: {stats.profitMargin}</Badge>
          </div>
        </Card>

        {/* Orders Count */}
        <Card rivetAccents className="bg-[#252538] border-[#313244]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-mono tracking-wider text-[#A6ADC8]">
              B2B Buyurtmalar
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-[#CDD6F4]">
            {stats.ordersCount} <span className="text-xs font-normal text-[#A6ADC8]">ta</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#313244]/60 text-xs">
            <span className="text-[#89B4FA] font-mono font-semibold">
              +{stats.ordersToday} ta bugun
            </span>
            <Badge variant="info">Faol ijro: 94%</Badge>
          </div>
        </Card>

        {/* Active Partners */}
        <Card rivetAccents className="bg-[#252538] border-[#313244]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-mono tracking-wider text-[#A6ADC8]">
              Faol Ta'minotchilar
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#89B4FA]">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-[#CDD6F4]">
            {stats.activeSuppliersCount} <span className="text-xs font-normal text-[#A6ADC8]">MChJ</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#313244]/60 text-xs">
            <span className="text-[#6C7086] font-mono">100% STIR tekshirilgan</span>
            <Badge variant="warning">Faol</Badge>
          </div>
        </Card>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#252538] p-4 rounded-xl border border-[#313244] flex items-center justify-between">
          <div>
            <div className="text-xs text-[#A6ADC8] uppercase font-mono">Platforma Kirimi</div>
            <div className="text-lg font-bold font-mono text-[#CDD6F4] mt-0.5">
              {(stats.totalIncome).toLocaleString('uz-UZ')} UZS
            </div>
          </div>
          <Badge variant="success">Kirim</Badge>
        </div>

        <div className="bg-[#252538] p-4 rounded-xl border border-[#313244] flex items-center justify-between">
          <div>
            <div className="text-xs text-[#A6ADC8] uppercase font-mono">Operatsion Chiqimlar</div>
            <div className="text-lg font-bold font-mono text-[#CDD6F4] mt-0.5">
              {(stats.totalExpense).toLocaleString('uz-UZ')} UZS
            </div>
          </div>
          <Badge variant="danger">Chiqim</Badge>
        </div>

        <div className="bg-[#252538] p-4 rounded-xl border border-[#313244] flex items-center justify-between">
          <div>
            <div className="text-xs text-[#A6ADC8] uppercase font-mono">Qaytarilgan Tovarlar (Returns)</div>
            <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
              {stats.returnsCount} ta / {(stats.returnsSum).toLocaleString('uz-UZ')} UZS
            </div>
          </div>
          <Badge variant="warning">Kafolat darajasi: {stats.returnsRate}</Badge>
        </div>
      </div>

      {/* Charts & Trends Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Turnover Bar Visualizer */}
        <Card className="lg:col-span-2 bg-[#252538] border-[#313244]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#CDD6F4] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#89B4FA]" />
                Haftalik Aylanma Dinamikasi (Mln UZS)
              </h2>
              <p className="text-xs text-[#6C7086] font-mono mt-0.5">
                Kunlik kassa tushumi va buyurtmalar oqimi
              </p>
            </div>
            <Badge variant="neutral">Oxirgi 7 kun</Badge>
          </div>

          <div className="pt-6 pb-2">
            <div className="flex items-end justify-between gap-3 h-48 px-2">
              {weeklyTrends.map((t, idx) => {
                const heightPercent = Math.round((t.value / maxTrend) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[10px] font-mono text-[#A6ADC8] opacity-0 group-hover:opacity-100 transition-opacity">
                      {t.value}m
                    </div>
                    <div className="w-full bg-[#252538] rounded-t-lg h-36 flex items-end p-1">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-[#89B4FA]/70 to-[#89B4FA] rounded-t group-hover:brightness-125 transition-all relative"
                      >
                        <div className="absolute -top-1 left-0 right-0 h-1 bg-white/40 rounded-t" />
                      </div>
                    </div>
                    <div className="text-xs font-mono text-[#6C7086] group-hover:text-[#89B4FA] transition-colors">
                      {t.day}
                    </div>
                    <span className="text-[10px] text-[#45475A] font-mono">
                      {t.orders} b.
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card className="bg-[#252538] border-[#313244]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#CDD6F4] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#89B4FA]" />
                Kategoriyalar Ulushi
              </h2>
              <p className="text-xs text-[#6C7086] font-mono mt-0.5">
                Tovarlar guruhi bo'yicha daromad
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#CDD6F4] font-medium truncate max-w-[190px]">
                    {cat.name}
                  </span>
                  <span className="text-[#A6ADC8] font-mono">
                    {cat.amount} <span className="text-[#89B4FA]">({cat.share}%)</span>
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#252538] overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                    style={{ width: `${cat.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-[#313244] flex items-center justify-between text-xs text-[#6C7086]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              ESCO tejamkorlik ulushi: 11%
            </span>
            <span className="text-[#89B4FA] font-mono font-bold">+4.2% o'sish</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
