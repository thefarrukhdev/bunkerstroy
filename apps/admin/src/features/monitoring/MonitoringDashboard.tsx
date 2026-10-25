import React, { useState } from 'react';
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
  BellRing
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // KPIs
  const todayOrdersCount = orders.length;
  const escrowSumFormatted = '1 450 000 000';
  const enRouteCount = INITIAL_VEHICLES.filter((v) => v.status === 'ON_ROUTE').length;
  const openDisputesCount = disputes.filter((d) => d.status === 'OPEN' || d.status === 'INVESTIGATING').length;

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
          <span className="font-mono font-bold text-theme-main block">
            {row.orderNumber}
          </span>
          <span className="text-[11px] font-mono text-theme-muted">
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
          <span className="font-bold text-theme-main text-xs block">
            {row.companyName}
          </span>
          <span className="text-[11px] text-theme-muted flex items-center gap-1">
            <User className="w-3 h-3" />
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
          <span className="text-xs text-theme-main block max-w-xs truncate">
            {row.deliveryAddress}
          </span>
          <span className="text-[10px] font-mono text-amber-500 font-bold">
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
          <span className="font-bold text-xs text-emerald-500 block">
            {row.finalAmount.toLocaleString('uz-UZ')} so‘m
          </span>
          <span className="text-[10px] text-theme-muted">
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-theme-card p-4 rounded-2xl border border-theme">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] animate-pulse" />
            <h1 className="text-xl font-black uppercase tracking-wider text-theme-main">
              Monitoring &amp; Real-Vaqt Nazorati
            </h1>
          </div>
          <p className="text-xs text-theme-muted font-mono mt-0.5">
            TZ-5: Bugungi buyurtmalar, Escrow mablag‘lari, Yo‘ldagi transportlar va E‘tibor ro‘yxati
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="font-mono text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Yangilash
          </Button>
        </div>
      </div>

      {/* ====================================================================
          1. CANONICAL KPI CARDS (AD-02)
          ==================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Bugungi buyurtmalar */}
        <div className="bg-theme-card p-4 rounded-2xl border border-theme shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-theme-muted tracking-wider">
              Bugungi Buyurtmalar
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-theme-main">
              {todayOrdersCount} ta
            </span>
            <span className="text-xs font-mono font-bold text-emerald-500 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
            </span>
          </div>
          <span className="text-[11px] text-theme-muted block mt-1">
            Barcha faol savdo operatsiyalari
          </span>
        </div>

        {/* KPI 2: Escrow'dagi Summa */}
        <div className="bg-theme-card p-4 rounded-2xl border border-theme shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-theme-muted tracking-wider">
              Escrowdagi Summa
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-emerald-500">
              {escrowSumFormatted}
            </span>
            <span className="text-xs font-mono text-theme-muted">so‘m</span>
          </div>
          <span className="text-[11px] text-theme-muted block mt-1">
            Bankda bloklangan xavfsiz mablag‘
          </span>
        </div>

        {/* KPI 3: Yo'ldagi yuklar */}
        <div className="bg-theme-card p-4 rounded-2xl border border-theme shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-theme-muted tracking-wider">
              Yo‘ldagi Yuklar
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-amber-400">
              {enRouteCount} ta reys
            </span>
            <span className="text-xs font-mono font-bold text-emerald-500">
              Tranzitda
            </span>
          </div>
          <span className="text-[11px] text-theme-muted block mt-1">
            GPS kuzatuvdagi og‘ir transportlar
          </span>
        </div>

        {/* KPI 4: Ochiq nizolar */}
        <div className="bg-theme-card p-4 rounded-2xl border border-theme shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-theme-muted tracking-wider">
              Ochiq Nizolar
            </span>
            <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-red-500">
              {openDisputesCount} ta faol
            </span>
            <span className="text-xs font-mono font-bold text-red-400">
              Shoshilinch
            </span>
          </div>
          <span className="text-[11px] text-theme-muted block mt-1">
            Ko‘rib chiqilayotgan shikoyat va da‘volar
          </span>
        </div>
      </div>

      {/* ====================================================================
          2. E'TIBOR RO'YXATI / ATTENTION LIST (AD-02)
          ==================================================================== */}
      <div className="bg-theme-card rounded-2xl border border-theme p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-theme pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
              <BellRing className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-theme-main font-mono uppercase tracking-wide">
                E‘tibor Ro‘yxati (Attention List)
              </h3>
              <p className="text-[11px] text-theme-muted font-mono">
                Operatorning zudlik bilan aralashuvini talab qiladigan hodisalar
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
            {attentionList.length} ta ogohlantirish
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {attentionList.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 transition ${
                item.urgentLevel === 'CRITICAL'
                  ? 'bg-red-500/5 border-red-500/30 hover:border-red-500/60'
                  : item.urgentLevel === 'WARNING'
                  ? 'bg-amber-500/5 border-amber-500/30 hover:border-amber-500/60'
                  : 'bg-blue-500/5 border-blue-500/30 hover:border-blue-500/60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                      item.urgentLevel === 'CRITICAL'
                        ? 'bg-red-500 text-white'
                        : item.urgentLevel === 'WARNING'
                        ? 'bg-amber-500 text-black'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {item.urgentLevel}
                  </span>
                  <span className="text-[10px] font-mono text-theme-muted">
                    {item.timestamp}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-theme-main">
                  {item.title}
                </h4>
                <p className="text-[11px] text-theme-muted leading-relaxed">
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
                  className="px-3 py-1.5 rounded-lg bg-theme-card-subtle hover:bg-theme-main/10 text-theme-main border border-theme text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition active:scale-95"
                >
                  <span>{item.actionLabel}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ====================================================================
          3. BUYURTMALAR JADVALI (AD-02 / AD-03)
          ==================================================================== */}
      <div className="bg-theme-card rounded-2xl border border-theme p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-theme pb-3">
          <div>
            <h3 className="text-sm font-bold text-theme-main font-mono uppercase tracking-wide">
              Buyurtmalar Nazorati (Orders Table)
            </h3>
            <p className="text-[11px] text-theme-muted font-mono">
              Barcha partiyalar, yetkazish bosqichlari va Escrow statusi
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />
              <input
                type="text"
                placeholder="Raqam yoki xaridor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-theme-main/5 border border-theme text-theme-main placeholder:text-theme-muted focus:outline-hidden"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-theme-main/5 border border-theme rounded-xl px-2.5 py-1.5 text-theme-main focus:outline-hidden"
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
