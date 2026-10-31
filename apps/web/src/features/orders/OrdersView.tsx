import React, { useState, useEffect } from 'react';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  ChevronDown,
  ChevronUp,
  CreditCard,
  RotateCw,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Receipt,
  AlertTriangle,
  QrCode,
  KeyRound,
  FileText,
  FileCheck
} from 'lucide-react';
import { B2bDocumentsModal } from './B2bDocumentsModal';
import { Order, OrderStatus } from '@bunkerstroy/types';
import { apiFetch, resolveApiUrl } from '../../services/apiClient';
import {
  Badge,
  Button,
  Card,
  Modal,
  Alert,
  Skeleton,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Input
} from '@bunkerstroy/ui';

interface PaymentModalState {
  isOpen: boolean;
  order: Order | null;
  provider: 'PAYME' | 'CLICK';
}

interface DisputeModalState {
  isOpen: boolean;
  orderId: string | null;
  orderNumber: string | null;
  reason: string;
  evidenceUrl: string;
}

export const OrdersView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedOrderIds, setExpandedOrderIds] = useState<Record<string, boolean>>({});

  // Payment modal state
  const [paymentModal, setPaymentModal] = useState<PaymentModalState>({
    isOpen: false,
    order: null,
    provider: 'PAYME'
  });
  const [simulatingPayment, setSimulatingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  // Dispute modal state
  const [disputeModal, setDisputeModal] = useState<DisputeModalState>({
    isOpen: false,
    orderId: null,
    orderNumber: null,
    reason: '',
    evidenceUrl: ''
  });
  const [disputeLoading, setDisputeLoading] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // B2B Documents modal state (MJ-03, MJ-04)
  const [selectedB2bOrder, setSelectedB2bOrder] = useState<Order | null>(null);

  const getToken = () => {
    return typeof window !== 'undefined' ? localStorage.getItem('bunkerstroy_token') : null;
  };

  const fetchOrders = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await apiFetch('/orders');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setOrders(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderIds((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleOpenPayment = (order: Order, provider: 'PAYME' | 'CLICK') => {
    setPaymentModal({
      isOpen: true,
      order,
      provider
    });
    setPaymentError(null);
    setPaymentSuccessMsg(null);
  };

  const handleSimulatePayment = async () => {
    if (!paymentModal.order) return;

    setSimulatingPayment(true);
    setPaymentError(null);
    setPaymentSuccessMsg(null);

    const token = getToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      let endpoint = '';
      let body: any = {};

      if (paymentModal.provider === 'PAYME') {
        endpoint = '/api/payments/payme';
        body = {
          method: 'PerformTransaction',
          params: {
            id: `payme-tx-${Date.now()}`,
            time: Date.now(),
            amount: Number(paymentModal.order.finalAmount) * 100,
            account: { order_id: paymentModal.order.id }
          }
        };
      } else {
        endpoint = '/api/payments/click';
        body = {
          click_trans_id: Date.now(),
          service_id: 12345,
          merchant_trans_id: paymentModal.order.id,
          amount: Number(paymentModal.order.finalAmount),
          action: 1,
          error: 0,
          error_note: 'Success',
          sign_time: new Date().toISOString(),
          sign_string: 'md5_mock'
        };
      }

      const res = await apiFetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      const json = await res.json();
      if (res.ok) {
        setPaymentSuccessMsg(`${paymentModal.provider} orqali to‘lov muvaffaqiyatli amalga oshirildi!`);
        setTimeout(() => {
          setPaymentModal({ isOpen: false, order: null, provider: 'PAYME' });
          fetchOrders(true);
        }, 1200);
      } else {
        setPaymentError(json.message || json.error_note || 'To‘lov jarayonida xatolik yuz berdi');
      }
    } catch {
      setPaymentError('Server bilan aloqa uzildi');
    } finally {
      setSimulatingPayment(false);
    }
  };

  // Pay second 50% for arrived orders
  const handlePaySecondHalf = async (orderId: string) => {
    try {
      const res = await apiFetch(`/orders/${orderId}/pay-second-half`, {
        method: 'POST'
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setActionSuccessMsg('Ikkinchi 50% to‘lov qabul qilindi! Qabul kodi ochildi.');
        fetchOrders(true);
      } else {
        alert(json.message || 'Xatolik yuz berdi');
      }
    } catch {
      alert('Server bilan aloqa uzildi');
    }
  };

  // Submit dispute
  const handleSubmitDispute = async () => {
    if (!disputeModal.orderId || !disputeModal.reason.trim()) {
      alert('Iltimos, e‘tiroz sababini kiriting');
      return;
    }

    setDisputeLoading(true);

    try {
      const res = await apiFetch(`/orders/${disputeModal.orderId}/dispute`, {
        method: 'POST',
        body: JSON.stringify({
          reason: disputeModal.reason.trim(),
          evidenceUrls: disputeModal.evidenceUrl ? [disputeModal.evidenceUrl.trim()] : []
        })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setDisputeModal({ isOpen: false, orderId: null, orderNumber: null, reason: '', evidenceUrl: '' });
        setActionSuccessMsg('Nizo arizangiz muvaffaqiyatli qabul qilindi. Operatorlar ko‘rib chiqadi.');
        fetchOrders(true);
      } else {
        alert(json.message || 'Nizo ochishda xatolik yuz berdi');
      }
    } catch {
      alert('Server bilan aloqa uzildi');
    } finally {
      setDisputeLoading(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'DRAFT':
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold">SAVATDA</span>;
      case 'PENDING_PAYMENT':
      case 'PENDING':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold">TO‘LOV KUTILMOQDA</span>;
      case 'PAID':
      case 'CONFIRMED':
        return <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold">TO‘LANDI (TASDIQLANDI)</span>;
      case 'ACCEPTED':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold">TA‘MINOTCHI TASDIQLADI</span>;
      case 'PACKING':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold">YIG‘ILMOQDA (OMBORDA)</span>;
      case 'ASSIGNED':
      case 'ASSIGNED_TO_FLEET':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold">HAYDOVCHI TAYINLANDI</span>;
      case 'IN_TRANSIT':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1">🚚 YO‘LDA</span>;
      case 'ARRIVED':
        return <span className="bg-orange-50 text-[#D95D1E] border border-orange-200 px-2.5 py-0.5 rounded text-[10px] font-mono font-black animate-pulse">MANZILGA YETDI</span>;
      case 'FULLY_PAID':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold">TO‘LIQ TO‘LANDI</span>;
      case 'RECEIVED':
      case 'DELIVERED':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold">QABUL QILINDI</span>;
      case 'COMPLETED':
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded text-[10px] font-mono font-black">YAKUNLANDI (ESCROW AJRATILDI)</span>;
      case 'DISPUTE':
        return <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded text-[10px] font-mono font-black">OCHIQ NIZO (DISPUTE)</span>;
      case 'CANCELLED':
        return <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold">BEKOR QILINGAN</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 text-slate-900 pb-12 font-sans">
      {/* 1. Header Banner */}
      <div className="relative bg-white rounded-2xl p-5 sm:p-7 shadow-2xs border border-slate-200 overflow-hidden">
        <div className="absolute inset-0 tech-grid-pattern opacity-15 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-[#D95D1E] uppercase tracking-wider">
                BunkerStroy Mijoz Kabineti
              </span>
              <span className="bg-orange-50 text-[#D95D1E] border border-orange-200 px-2 py-0.5 rounded text-[10px] font-mono font-black">
                ESCROW HIMOYA
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-slate-900">
              Mening Buyurtmalarim &amp; Yetkazib Berish Nazorati
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Escrow kafolati, 50/50 to‘lov boshqaruvi va qabul kodi orqali yuklarni xavfsiz qabul qilish.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
            <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-slate-700 flex items-center gap-2 shadow-2xs">
              <span className="text-[#D95D1E] font-black">{orders.length}</span>
              <span>ta faol buyurtma</span>
            </div>
          </div>
        </div>
      </div>

      {actionSuccessMsg && (
        <Alert variant="success" description={actionSuccessMsg} onDismiss={() => setActionSuccessMsg(null)} />
      )}

      {/* 2. Control bar */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-3.5 sm:p-4 rounded-2xl shadow-2xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-slate-700">
            Jami Buyurtmalar:
          </span>
          <span className="bg-orange-50 text-[#D95D1E] px-2.5 py-0.5 rounded-lg text-xs font-bold border border-orange-200">
            {orders.length} ta
          </span>
        </div>

        <button
          type="button"
          onClick={() => fetchOrders(true)}
          className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors"
        >
          <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#D95D1E]' : ''}`} />
          <span>Yangilash</span>
        </button>
      </div>

      {/* 3. Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-5 space-y-4 border border-slate-200 shadow-2xs">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Skeleton variant="circle" width={32} height={32} className="bg-slate-100" />
                  <Skeleton variant="text" width={160} className="bg-slate-100" />
                </div>
                <Skeleton variant="rect" width={90} height={24} className="bg-slate-100" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Skeleton variant="text" width="80%" className="bg-slate-100" />
                <Skeleton variant="text" width="60%" className="bg-slate-100" />
                <Skeleton variant="text" width="50%" className="bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 rounded-2xl p-8 space-y-4 bg-white border border-dashed border-slate-200 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto text-[#D95D1E]">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="font-heading font-black text-lg text-slate-900">Hozircha buyurtmalar mavjud emas</h3>
          <p className="text-xs max-w-sm mx-auto text-slate-600">
            Katalogdan kerakli materiallarni savatchaga qo‘shing va Escrow himoyasi ostida buyurtma bering.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const isExpanded = !!expandedOrderIds[o.id];
            const isPendingPayment = o.paymentStatus !== 'PAID' && o.status === 'PENDING_PAYMENT';
            const isArrivedWaitingSecondPayment = o.status === 'ARRIVED' && o.paymentMode === 'SPLIT_50_50' && !o.isSecondPaid;

            return (
              <div
                key={o.id}
                className="group relative rounded-2xl p-5 border border-slate-200 hover:border-slate-300 bg-white shadow-2xs hover:shadow-md text-slate-900 space-y-4 transition-all duration-200"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 font-mono">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
                      <Package className="w-4 h-4 text-[#D95D1E]" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-900">{o.orderNumber}</span>
                      <span className="text-[11px] text-slate-500 ml-2">
                        {new Date(o.createdAt).toLocaleString('uz-UZ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(o.status)}
                    <span className="bg-orange-50 text-[#D95D1E] border border-orange-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                      {o.paymentMode === 'SPLIT_50_50' ? '50/50 BO‘LIB TO‘LASH' : '100% ESCROW'}
                    </span>
                  </div>
                </div>

                {/* Status Progress Line */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-slate-700 font-bold mb-2">
                    <span>Buyurtma bosqichi:</span>
                    <span className="text-[#D95D1E] uppercase">{o.status}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#D95D1E] h-full transition-all duration-500"
                      style={{
                        width:
                          o.status === 'PENDING_PAYMENT' ? '10%'
                          : o.status === 'PAID' || o.status === 'CONFIRMED' ? '25%'
                          : o.status === 'ACCEPTED' || o.status === 'PACKING' ? '40%'
                          : o.status === 'ASSIGNED' || o.status === 'ASSIGNED_TO_FLEET' ? '55%'
                          : o.status === 'IN_TRANSIT' ? '70%'
                          : o.status === 'ARRIVED' ? '85%'
                          : o.status === 'FULLY_PAID' || o.status === 'RECEIVED' ? '95%'
                          : o.status === 'COMPLETED' ? '100%'
                          : '5%'
                      }}
                    />
                  </div>
                </div>

                {/* Primary Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] block">Qabul qiluvchi:</span>
                    <p className="font-semibold text-slate-900 mt-0.5">{o.buyerName}</p>
                    <p className="text-[11px] text-slate-500">{o.buyerPhone}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 uppercase text-[10px] block">Yetkazish manzili:</span>
                    <p className="font-semibold text-slate-900 mt-0.5">
                      {o.deliveryAddress?.region || 'Toshkent shahri'}, {o.deliveryAddress?.district || 'Chilonzor'}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">{o.deliveryAddress?.street || 'Ko‘rsatilmagan'}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 uppercase text-[10px] block">Jami summa:</span>
                    <p className="text-base font-black text-[#D95D1E] mt-0.5 font-mono-numbers">
                      {Number(o.finalAmount).toLocaleString()} so‘m
                    </p>
                    <p className="text-[11px] text-slate-500">Rejim: {o.paymentMode}</p>
                  </div>
                </div>

                {/* 1. INITIAL PAYMENT BUTTON (If pending payment) */}
                {isPendingPayment && (
                  <div className="bg-orange-50/50 border border-orange-200 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 font-mono">
                    <div className="flex items-center gap-2 text-xs text-slate-800">
                      <CreditCard className="w-4 h-4 shrink-0 text-[#D95D1E]" />
                      <span>
                        {o.paymentMode === 'SPLIT_50_50'
                          ? `Birinchi 50% avans to‘lovi (${(Number(o.firstPaymentAmount || o.finalAmount / 2)).toLocaleString()} so‘m) kutilmoqda:`
                          : `To‘liq to‘lov (${Number(o.finalAmount).toLocaleString()} so‘m) kutilmoqda:`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenPayment(o, 'PAYME')}
                        className="px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-300 text-sky-800 hover:bg-sky-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-sky-600" />
                        <span>Payme</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenPayment(o, 'CLICK')}
                        className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-[#D95D1E]" />
                        <span>Click</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. 50/50 SECOND PAYMENT PROMPT (When arrived) */}
                {isArrivedWaitingSecondPayment && (
                  <div className="bg-amber-50/80 border-2 border-amber-400 p-4 rounded-xl space-y-3 font-mono">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="w-5 h-5 text-[#D95D1E]" />
                        <span className="font-extrabold text-xs text-slate-900">
                          YUK MANZILINGIZGA YETIB KELDI!
                        </span>
                      </div>
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                        30 DAQIQA KUTISH TAYMERI
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-sans leading-relaxed">
                      Qurilish mollari manzilga yetkazildi. Tushirishdan oldin ikkinchi 50% to‘lovni (
                      <strong className="text-[#D95D1E]">{(Number(o.secondPaymentAmount || o.finalAmount / 2)).toLocaleString()} so‘m</strong>
                      ) amalga oshiring. To‘lov o‘tgach, haydovchiga aytish uchun <strong>Qabul Kodi</strong> ekranda paydo bo‘ladi.
                    </p>

                    <button
                      type="button"
                      onClick={() => handlePaySecondHalf(o.id)}
                      className="bg-[#D95D1E] hover:bg-[#B43B06] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Ikkinchi 50% to‘lovni tasdiqlash</span>
                    </button>
                  </div>
                )}

                {/* 3. REVEALED ACCEPTANCE PIN CODE BOX */}
                {o.isAcceptanceCodeRevealed && o.acceptanceCode && (
                  <div className="bg-amber-50/70 border-2 border-dashed border-amber-300 rounded-xl p-5 text-center space-y-2 font-mono shadow-2xs">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#D95D1E] uppercase">
                      <KeyRound className="w-4 h-4 text-[#D95D1E]" />
                      <span>Maxfiy Qabul Kodi (Delivery PIN)</span>
                    </div>

                    <div className="text-4xl font-extrabold tracking-widest text-[#D95D1E] py-1 select-all font-mono-numbers">
                      {o.acceptanceCode}
                    </div>

                    <p className="text-xs text-slate-600 font-sans max-w-md mx-auto">
                      Ushbu 4-xonali PIN kodni haydovchiga ayting. Haydovchi uni kiritgach yuk topshirilgan hisoblanadi va Escrowdan mablag‘ ajratiladi.
                    </p>
                  </div>
                )}

                {/* Bottom action row: Chek, B2B Hujjatlar, Nizo ochish, Expand */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://bunkerstroy.uz/receipt/${o.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5 text-[#D95D1E]" />
                      <span>QR Chek</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setSelectedB2bOrder(o)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-orange-200 bg-orange-50 text-[#D95D1E] hover:bg-orange-100 transition-colors cursor-pointer font-bold shadow-2xs"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-[#D95D1E]" />
                      <span>B2B Hujjatlar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDisputeModal({
                          isOpen: true,
                          orderId: o.id,
                          orderNumber: o.orderNumber,
                          reason: '',
                          evidenceUrl: ''
                        })
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Nizo ochish</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExpand(o.id)}
                    className="flex items-center gap-1 text-slate-600 hover:text-[#D95D1E] cursor-pointer font-semibold py-1 transition-colors"
                  >
                    <span>{isExpanded ? "Tafsilotni yashirish" : "Tovarlar ro‘yxati"}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* EXPANDABLE ACCORDION CONTENT */}
                {isExpanded && (
                  <div className="mt-3 space-y-3 pt-3 border-t border-slate-100 text-xs animate-in fade-in font-mono">
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3">Mahsulot Nomi</th>
                            <th className="py-2.5 px-3 text-center">Miqdori &amp; Birligi</th>
                            <th className="py-2.5 px-3 text-right">Birlik Narxi</th>
                            <th className="py-2.5 px-3 text-right">Jami Summa</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {o.items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className="py-2.5 px-3 font-semibold text-slate-900">
                                {item.productTitle}
                              </td>
                              <td className="py-2.5 px-3 text-center text-slate-700">
                                {item.quantity} {item.unit}
                              </td>
                              <td className="py-2.5 px-3 text-right text-slate-600 font-mono-numbers">
                                {Number(item.unitPrice).toLocaleString()} so‘m
                              </td>
                              <td className="py-2.5 px-3 text-right font-black text-[#D95D1E] font-mono-numbers">
                                {Number(item.totalPrice).toLocaleString()} so‘m
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* DISPUTE MODAL */}
      {disputeModal.isOpen && (
        <Modal
          isOpen={disputeModal.isOpen}
          onClose={() => setDisputeModal({ isOpen: false, orderId: null, orderNumber: null, reason: '', evidenceUrl: '' })}
          size="sm"
          title="Buyurtma Bo‘yicha Nizo Ochish"
          subtitle={`Buyurtma #${disputeModal.orderNumber} bo‘yicha e‘tiroz bildirish`}
        >
          <div className="space-y-3 font-mono text-xs">
            <div>
              <label htmlFor="dispute-reason-text" className="block text-slate-700 font-bold mb-1">
                E‘tiroz sababi * (sifat, yetishmovchilik, shikastlanish)
              </label>
              <textarea
                id="dispute-reason-text"
                name="reason"
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 text-xs font-sans focus:outline-none focus:border-[#D95D1E]"
                placeholder="Yuk shikastlangan holda yetib keldi yoki miqdori kam..."
                value={disputeModal.reason}
                onChange={(e) => setDisputeModal((prev) => ({ ...prev, reason: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="dispute-evidence-url" className="block text-slate-700 font-bold mb-1">
                Foto yoki video dalil havolasi (ixtiyoriy)
              </label>
              <Input
                id="dispute-evidence-url"
                name="evidenceUrl"
                sizeVariant="sm"
                placeholder="https://t.me/... yoki rasm havolasi"
                value={disputeModal.evidenceUrl}
                onChange={(e) => setDisputeModal((prev) => ({ ...prev, evidenceUrl: e.target.value }))}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                className="px-3 py-2 rounded-xl flex-1 text-xs font-bold cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors"
                onClick={() => setDisputeModal({ isOpen: false, orderId: null, orderNumber: null, reason: '', evidenceUrl: '' })}
              >
                Bekor qilish
              </button>
              <button
                type="button"
                className="bg-[#D95D1E] hover:bg-[#B43B06] text-white px-3 py-2 rounded-xl flex-1 text-xs font-bold cursor-pointer shadow-xs transition-colors"
                onClick={handleSubmitDispute}
              >
                {disputeLoading ? 'Yuborilmoqda...' : 'Nizo Arizasini Yuborish'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* PAYMENT MODAL */}
      {paymentModal.isOpen && paymentModal.order && (
        <Modal
          isOpen={paymentModal.isOpen && !!paymentModal.order}
          onClose={() => setPaymentModal({ isOpen: false, order: null, provider: 'PAYME' })}
          size="sm"
          headerExtra={
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                paymentModal.provider === 'PAYME'
                  ? 'bg-sky-50 border border-sky-300 text-sky-600'
                  : 'bg-orange-50 border border-orange-300 text-[#D95D1E]'
              }`}
            >
              <CreditCard className="w-5 h-5" />
            </div>
          }
          title={`${paymentModal.provider} To‘lov Shlyuzi`}
          subtitle="Xavfsiz onlayn to‘lov tizimi (Escrow)"
        >
          {paymentError && <Alert variant="error" description={paymentError} onDismiss={() => setPaymentError(null)} />}
          {paymentSuccessMsg && <Alert variant="success" description={paymentSuccessMsg} />}

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs font-mono text-slate-900">
            <div className="flex justify-between text-slate-600">
              <span>Buyurtma raqami:</span>
              <span className="text-slate-900 font-bold">{paymentModal.order.orderNumber}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>To‘lov turi:</span>
              <span className="text-slate-900 font-bold">
                {paymentModal.order.paymentMode === 'SPLIT_50_50' ? '50% Avans To‘lovi' : '100% To‘lov'}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="font-bold text-slate-800">To‘lanadigan summa:</span>
              <span className="text-xl font-black text-[#D95D1E] font-mono-numbers">
                {(paymentModal.order.paymentMode === 'SPLIT_50_50'
                  ? Number(paymentModal.order.firstPaymentAmount || paymentModal.order.finalAmount / 2)
                  : Number(paymentModal.order.finalAmount)
                ).toLocaleString()} so‘m
              </span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2 font-mono">
            <button
              type="button"
              className="w-full bg-[#D95D1E] hover:bg-[#B43B06] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              onClick={handleSimulatePayment}
              disabled={simulatingPayment || !!paymentSuccessMsg}
            >
              <Sparkles className="w-4 h-4" />
              <span>{simulatingPayment ? 'To‘lov amalga oshirilmoqda...' : 'To‘lovni Tasdiqlash'}</span>
            </button>
          </div>
        </Modal>
      )}

      {/* B2B ELECTRONIC DOCUMENTS MODAL (MJ-03, MJ-04) */}
      {selectedB2bOrder && (
        <B2bDocumentsModal
          isOpen={!!selectedB2bOrder}
          order={selectedB2bOrder}
          onClose={() => setSelectedB2bOrder(null)}
        />
      )}
    </div>
  );
};
