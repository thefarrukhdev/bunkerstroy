import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Search,
  Building2,
  FileText,
  User,
  Phone,
  MapPin,
  ChevronRight,
  BellRing,
  BarChart3,
  Layers
} from 'lucide-react';
import { INITIAL_ORDERS, OrderRecord, OrderStatus } from '../../mocks/ordersMock';
import { INITIAL_DISPUTES, DisputeRecord } from '../../mocks/disputesMock';
import { INITIAL_VEHICLES } from '../../mocks/logisticsMock';
import { INITIAL_PARTNERS } from '../../mocks/partnersMock';
import { DataTable, Column } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { KpiStatCard } from '../../components/KpiStatCard';
import { OrderDetailDrawer } from '../orders/OrderDetailDrawer';
import { BunkerStatsDashboard } from './BunkerStatsDashboard';
import { apiClient } from '../../services/apiClient';

interface AttentionItem {
  id: string;
  type: 'PAYMENT_50_50' | 'SUPPLIER_MODERATION' | 'DRIVER_DELAY' | 'OPEN_DISPUTE' | 'INTEGRATION_WARN';
  title: string;
  subtitle: string;
  urgentLevel: 'CRITICAL' | 'WARNING' | 'INFO';
  timestamp: string;
  actionLabel: string;
  linkTab?: string;
  targetId?: string;
}

export const MonitoringDashboard: React.FC<{
  onNavigateTab?: (tab: string) => void;
}> = ({ onNavigateTab }) => {
  const [viewMode, setViewMode] = useState<'realtime' | 'bunker_stats'>('realtime');
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [disputes] = useState<DisputeRecord[]>(INITIAL_DISPUTES);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Attention List Data (TZ-5: E'tibor ro'yxati)
  const [attentionList, setAttentionList] = useState<AttentionItem[]>([
    {
      id: 'att-1',
      type: 'PAYMENT_50_50',
      title: 'Buyurtma #ORD-9021: 50/50 2-to‘lov kutilmoqda',
      subtitle: 'Haydovchi ob‘ekt darvozasida kutmoqda (Taymer tugashiga 14 daqiqa qoldi)',
      urgentLevel: 'CRITICAL',
      timestamp: '14 daqiqa oldin',
      actionLabel: 'Mijozga qo‘ng‘iroq',
      targetId: 'ord-1'
    },
    {
      id: 'att-2',
      type: 'OPEN_DISPUTE',
      title: 'Nizo #DISP-2026-0042: Sement qoplari yirtilishi',
      subtitle: '15 ta qop shikastlangan, dalolatnoma va fotosuratlar yuklangan',
      urgentLevel: 'WARNING',
      timestamp: '45 daqiqa oldin',
      actionLabel: 'Nizoni ko‘rish',
      linkTab: 'disputes'
    },
    {
      id: 'att-3',
      type: 'SUPPLIER_MODERATION',
      title: 'Yangi Ta‘minotchi arizasi: «BEKOBOD METALL INVEST»',
      subtitle: 'Global importyor arizasi va STIR hujjati moderatsiya navbatida',
      urgentLevel: 'INFO',
      timestamp: '1 soat oldin',
      actionLabel: 'Tekshirish',
      linkTab: 'suppliers'
    },
    {
      id: 'att-4',
      type: 'INTEGRATION_WARN',
      title: 'Eskiz SMS Gateway: 2 ta SMS yetkazilmadi',
      subtitle: 'Handset off statusi tufayli SMS takroriy yuborish navbatiga qo‘yildi',
      urgentLevel: 'INFO',
      timestamp: 'Bugun 15:05',
      actionLabel: 'Hamkorlar',
      linkTab: 'partners'
    }
  ]);

  const [liveKpi, setLiveKpi] = useState<{
    todayOrdersCount: number;
    escrowTotalSum: number;
    inTransitLoadsCount: number;
    openDisputesCount: number;
  } | null>(null);

  const fetchMonitoringData = async () => {
    try {
      const res = await apiClient.get<any>('/admin/monitoring');
      if (res && res.data) {
        if (res.data.kpis) {
          setLiveKpi(res.data.kpis);
        }
        if (res.data.recentOrders && res.data.recentOrders.length > 0) {
          const mapped: OrderRecord[] = res.data.recentOrders.map((o: any) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            buyerName: o.buyerName || 'Mijoz',
            buyerPhone: '+998 (90) 123-45-67',
            companyName: o.buyerName || 'Korxona',
            deliveryRegion: o.deliveryRegion || 'Toshkent shahri',
            deliveryDistrict: 'Toshkent',
            deliveryAddress: o.deliveryRegion || 'Toshkent sh.',
            vehicleType: 'HOWO Samosval 25t',
            items: [],
            totalAmount: o.finalAmount || 0,
            deliveryFee: 150000,
            discountAmount: 0,
            finalAmount: o.finalAmount || 0,
            status: (o.status === 'ARRIVED' ? 'DELIVERED' : o.status === 'IN_TRANSIT' ? 'IN_TRANSIT' : 'CONFIRMED') as OrderStatus,
            payment: {
              provider: 'PAYME',
              status: 'PAID'
            },
            createdAt: new Date(o.createdAt).toLocaleDateString('uz-UZ'),
            updatedAt: new Date(o.createdAt).toLocaleDateString('uz-UZ')
          }));
          setOrders(mapped);
        }
        if (res.data.attentionList && res.data.attentionList.length > 0) {
          const mappedAtt: AttentionItem[] = res.data.attentionList.map((a: any) => ({
            id: a.id,
            type: a.type === 'LOGISTICS' ? 'DRIVER_DELAY' : a.type === 'SUPPLIER_VERIFICATION' ? 'SUPPLIER_MODERATION' : 'OPEN_DISPUTE',
            title: a.title,
            subtitle: a.description,
            urgentLevel: a.severity === 'CRITICAL' ? 'CRITICAL' : a.severity === 'HIGH' ? 'WARNING' : 'INFO',
            timestamp: 'Hozirgina',
            actionLabel: 'Ko‘rib chiqish',
            targetId: a.targetId,
            linkTab: a.type === 'LOGISTICS' ? 'logistics' : a.type === 'SUPPLIER_VERIFICATION' ? 'suppliers' : 'disputes'
          }));
          setAttentionList(mappedAtt);
        }
      }
    } catch (err) {
      console.warn('Live monitoring maʼlumotlarini yuklashda xatolik:', err);
    }
  };

  useEffect(() => {
    fetchMonitoringData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchMonitoringData();
    setIsRefreshing(false);
  };

  // KPIs
  const todayOrdersCount = liveKpi ? liveKpi.todayOrdersCount : orders.length;
  const escrowSumFormatted = liveKpi
    ? liveKpi.escrowTotalSum.toLocaleString('uz-UZ')
    : '1 450 000 000';
  const enRouteCount = liveKpi ? liveKpi.inTransitLoadsCount : INITIAL_VEHICLES.filter((v) => v.status === 'ON_ROUTE').length;
  const openDisputesCount = liveKpi ? liveKpi.openDisputesCount : disputes.filter((d) => d.status === 'OPEN' || d.status === 'INVESTIGATING').length;

  // Filtered Orders for the table
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchesSearch =
      searchTerm === '' ||
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const orderColumns: Column<OrderRecord>[] = [
    {
      key: 'orderNumber',
      header: 'Buyurtma',
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-white block">
            {row.orderNumber}
          </span>
          <span className="text-[11px] font-mono text-sky-200">
            {row.createdAt}
          </span>
        </div>
      )
    },
    {
      key: 'companyName',
      header: 'Xaridor & Korxona',
      render: (row) => (
        <div>
          <span className="font-bold text-white text-xs block">
            {row.companyName}
          </span>
          <span className="text-[11px] text-sky-200 flex items-center gap-1">
            <User className="w-3 h-3 text-[#FFB800]" />
            {row.buyerName} ({row.buyerPhone})
          </span>
        </div>
      )
    },
    {
      key: 'deliveryAddress',
      header: 'Manzil & Texnika',
      render: (row) => (
        <div>
          <span className="text-xs text-white block max-w-xs truncate">
            {row.deliveryAddress}
          </span>
          <span className="text-[10px] font-mono text-[#FFB800] font-bold">
            {row.vehicleType}
          </span>
        </div>
      )
    },
    {
      key: 'finalAmount',
      header: 'Summa (Escrow)',
      render: (row) => (
        <div className="font-mono">
          <span className="font-bold text-xs text-emerald-400 block font-mono-numbers">
            {row.finalAmount.toLocaleString('uz-UZ')} so‘m
          </span>
          <span className="text-[10px] text-sky-200">
            To‘lov: {row.payment.provider} ({row.payment.status})
          </span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Holati',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      key: 'actions',
      header: 'Amallar',
      render: (row) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setSelectedOrder(row)}
          className="text-xs font-mono"
        >
          <Eye className="w-3.5 h-3.5 mr-1" />
          Ko‘rish
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#0A1931] p-4 rounded-2xl border-2 border-[#1E3A6D] shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800] animate-pulse" />
            <h1 className="text-xl font-black uppercase tracking-wider text-white">
              BunkerStroy Real-Vaqt Monitoringi
            </h1>
          </div>
          <p className="text-xs text-sky-200 font-mono mt-0.5">
            TZ-5 Sanoat Standarti: Buyurtmalar oqimi, Escrow mablag‘lari, Og'ir transportlar va E‘tibor ro‘yxati
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View mode toggle: Real-Vaqt Oqimi vs 14 Hudud BunkerStats */}
          <div className="inline-flex rounded-xl bg-[#071326] p-1 border border-[#1E3A6D]">
            <button
              onClick={() => setViewMode('realtime')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                viewMode === 'realtime'
                  ? 'bg-[#FFB800] text-[#071326] font-black shadow-md'
                  : 'text-sky-200 hover:text-white'
              }`}
            >
              Real-Vaqt Oqimi
            </button>
            <button
              onClick={() => setViewMode('bunker_stats')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'bunker_stats'
                  ? 'bg-[#FFB800] text-[#071326] font-black shadow-md'
                  : 'text-sky-200 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>14 Hudud BunkerStats</span>
            </button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="font-mono text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin text-[#FFB800]' : ''}`} />
            Yangilash
          </Button>
        </div>
      </div>

      {/* Conditionally Render BunkerStats 14 Hudud Dashboard */}
      {viewMode === 'bunker_stats' ? (
        <BunkerStatsDashboard onNavigateTab={onNavigateTab} />
      ) : (
        <>
          {/* ====================================================================
              1. CANONICAL KPI CARDS (AD-02)
              ==================================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Bugungi buyurtmalar */}
            <div className="bg-[#0A1931] p-4 rounded-2xl border border-[#1E3A6D] shadow-md hover:border-[#2E5A9C] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-sky-200 tracking-wider">
                  Bugungi Buyurtmalar
                </span>
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-white font-mono-numbers">
                  {todayOrdersCount} ta
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
                </span>
              </div>
              <span className="text-[11px] text-sky-300/80 block mt-1">
                Barcha faol savdo operatsiyalari
              </span>
            </div>

            {/* KPI 2: Escrow'dagi Summa */}
            <div className="bg-[#0A1931] p-4 rounded-2xl border border-[#1E3A6D] shadow-md hover:border-[#2E5A9C] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-sky-200 tracking-wider">
                  Escrowdagi Summa
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono text-emerald-400 font-mono-numbers">
                  {escrowSumFormatted}
                </span>
                <span className="text-xs font-mono text-sky-200">so‘m</span>
              </div>
              <span className="text-[11px] text-sky-300/80 block mt-1">
                Bankda bloklangan xavfsiz mablag‘
              </span>
            </div>

            {/* KPI 3: Yo'ldagi yuklar */}
            <div className="bg-[#0A1931] p-4 rounded-2xl border border-[#1E3A6D] shadow-md hover:border-[#2E5A9C] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-sky-200 tracking-wider">
                  Yo‘ldagi Yuklar
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#FFB800]/15 border border-[#FFB800]/40 text-[#FFB800] flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-[#FFB800] font-mono-numbers">
                  {enRouteCount} ta reys
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  Tranzitda
                </span>
              </div>
              <span className="text-[11px] text-sky-300/80 block mt-1">
                GPS kuzatuvdagi HOWO &amp; Shacman flot
              </span>
            </div>

            {/* KPI 4: Ochiq nizolar */}
            <div className="bg-[#0A1931] p-4 rounded-2xl border border-[#1E3A6D] shadow-md hover:border-[#2E5A9C] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-sky-200 tracking-wider">
                  Ochiq Nizolar
                </span>
                <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-rose-400 font-mono-numbers">
                  {openDisputesCount} ta faol
                </span>
                <span className="text-xs font-mono font-bold text-rose-300">
                  Shoshilinch
                </span>
              </div>
              <span className="text-[11px] text-sky-300/80 block mt-1">
                Ko‘rib chiqilayotgan shikoyat va da‘volar
              </span>
            </div>
          </div>

          {/* ====================================================================
              2. E'TIBOR RO'YXATI / ATTENTION LIST (AD-02)
              ==================================================================== */}
          <div className="bg-[#0A1931] rounded-2xl border-2 border-[#1E3A6D] p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#1E3A6D] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <BellRing className="w-4 h-4 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white font-mono uppercase tracking-wide">
                    E‘tibor Ro‘yxati (Attention List)
                  </h3>
                  <p className="text-[11px] text-sky-200 font-mono">
                    Operatorning zudlik bilan aralashuvini talab qiladigan operatsiyalar
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-black px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40">
                {attentionList.length} ta ogohlantirish
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {attentionList.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border-2 flex flex-col justify-between gap-2.5 transition-all shadow-md ${
                    item.urgentLevel === 'CRITICAL'
                      ? 'bg-[#071326] border-rose-500/50 hover:border-rose-400'
                      : item.urgentLevel === 'WARNING'
                      ? 'bg-[#071326] border-[#FFB800]/50 hover:border-[#FFB800]'
                      : 'bg-[#071326] border-blue-500/50 hover:border-blue-400'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md uppercase ${
                          item.urgentLevel === 'CRITICAL'
                            ? 'bg-rose-500 text-white'
                            : item.urgentLevel === 'WARNING'
                            ? 'bg-[#FFB800] text-[#071326]'
                            : 'bg-blue-500 text-white'
                        }`}
                      >
                        {item.urgentLevel}
                      </span>
                      <span className="text-[10px] font-mono text-sky-200">
                        {item.timestamp}
                      </span>
                    </div>
                    <h4 className="text-xs font-black text-white">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-sky-200 leading-relaxed font-sans">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    <button
                      onClick={() => {
                        if (item.linkTab && onNavigateTab) {
                          onNavigateTab(item.linkTab);
                        } else if (item.targetId) {
                          const found = orders.find((o) => o.id === item.targetId);
                          if (found) setSelectedOrder(found);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#0F2547] hover:bg-[#132C54] text-white hover:text-[#FFB800] border border-[#1E3A6D] text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition active:scale-95"
                    >
                      <span>{item.actionLabel}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#FFB800]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ====================================================================
              3. BUYURTMALAR JADVALI (AD-02 / AD-03)
              ==================================================================== */}
          <div className="bg-[#0A1931] rounded-2xl border-2 border-[#1E3A6D] p-4 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#1E3A6D] pb-3">
              <div>
                <h3 className="text-sm font-black text-white font-mono uppercase tracking-wide">
                  Buyurtmalar Nazorati (Orders Table)
                </h3>
                <p className="text-[11px] text-sky-200 font-mono">
                  Barcha partiyalar, yetkazish bosqichlari va Escrow statusi
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-sky-300" />
                  <input
                    type="text"
                    placeholder="Raqam yoki xaridor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#071326] border border-[#1E3A6D] text-white placeholder:text-sky-300/50 focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs bg-[#071326] border border-[#1E3A6D] rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-[#FFB800]"
                >
                  <option value="ALL">Barcha holatlar</option>
                  <option value="PENDING">Kutilmoqda</option>
                  <option value="CONFIRMED">Tasdiqlangan</option>
                  <option value="ASSIGNED_TO_FLEET">Avtoparkka biriktirilgan</option>
                  <option value="IN_TRANSIT">Yo‘lda</option>
                  <option value="DELIVERED">Yetkazildi</option>
                </select>
              </div>
            </div>

            <DataTable
              columns={orderColumns}
              data={filteredOrders}
              pageSize={6}
            />
          </div>
        </>
      )}

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <OrderDetailDrawer
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          order={selectedOrder}
          onUpdateStatus={(id: string, newStatus: OrderStatus) => {
            setOrders((prev) =>
              prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
            );
            setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
          }}
        />
      )}
    </div>
  );
};

export default MonitoringDashboard;
