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
  Receipt
} from 'lucide-react';
import { Order, OrderStatus } from '@bunkerstroy/types';
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
  TableCell
} from '@bunkerstroy/ui';

interface PaymentModalState {
  isOpen: boolean;
  order: Order | null;
  provider: 'PAYME' | 'CLICK';
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

  const getToken = () => {
    return typeof window !== 'undefined' ? localStorage.getItem('bunkerstroy_token') : null;
  };

  // Fetch orders from API
  const fetchOrders = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch('/api/orders', { headers });
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

  // Simulate payment
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

      const res = await fetch(endpoint, {
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
        }, 1500);
      } else {
        setPaymentError(json.message || json.error_note || 'To‘lov jarayonida xatolik yuz berdi');
      }
    } catch (e: any) {
      console.error(e);
      setPaymentError('Server bilan aloqa uzildi');
    } finally {
      setSimulatingPayment(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning" className="bg-orange-50 text-orange-800 border-orange-200">KUTILMOQDA</Badge>;
      case 'CONFIRMED':
        return <Badge variant="info" className="bg-sky-50 text-sky-800 border-sky-200">TASDIQLANDI</Badge>;
      case 'ASSIGNED_TO_FLEET':
        return <Badge variant="warning" className="bg-amber-50 text-amber-800 border-amber-200">TRANSPORT BIRIKTIRILDI</Badge>;
      case 'IN_TRANSIT':
        return <Badge variant="info" className="bg-sky-50 text-sky-800 border-sky-200">YUK TASHINMOQDA (YO‘LDA)</Badge>;
      case 'DELIVERED':
        return <Badge variant="success" className="bg-emerald-50 text-emerald-800 border-emerald-200">YETKAZILDI</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger" className="bg-red-50 text-red-800 border-red-200">BEKOR QILINGAN</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Minimalist Orders Header */}
      <div className="bg-white border border-bunker-border-strong rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="mb-1.5">
            <span className="text-xs font-mono font-bold text-bunker-amber-500 uppercase tracking-wider">
              Xaridlar Tarixi
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-bunker-text-primary tracking-tight">
            Mening Buyurtmalarim &amp; Yetkazib Berish Holati
          </h1>
          <p className="text-xs sm:text-sm text-bunker-text-secondary mt-1">
            Sotib olingan qurilish mollari, buyurtma holati va yetkazib berish jarayoni.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge variant="neutral" size="sm" isMono>
            {orders.length} ta buyurtma
          </Badge>
        </div>
      </div>

      {/* 2. Control bar */}
      <div className="flex items-center justify-between bg-white border border-bunker-border-strong p-4 rounded-xl shadow-xs">
        <div className="flex items-center gap-2 font-mono">
          <span className="text-xs font-bold uppercase text-bunker-text-primary">
            Jami Buyurtmalar:
          </span>
          <span className="bg-slate-100 text-bunker-amber-500 px-2.5 py-0.5 rounded-lg text-xs font-bold border border-bunker-border-subtle">
            {orders.length}
          </span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => fetchOrders(true)}
          isLoading={refreshing}
        >
          <RotateCw className="w-3.5 h-3.5 mr-1" />
          <span>Yangilash</span>
        </Button>
      </div>

      {/* 3. Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="p-5 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-bunker-border-subtle">
                <div className="flex items-center gap-2.5">
                  <Skeleton variant="circle" width={32} height={32} />
                  <Skeleton variant="text" width={160} />
                </div>
                <Skeleton variant="rect" width={90} height={24} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="50%" />
              </div>
            </Card>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-bunker-border-strong rounded-2xl p-8 space-y-3 text-bunker-text-secondary font-mono shadow-xs">
          <Package className="w-12 h-12 mx-auto text-bunker-amber-500/50" />
          <h3 className="font-bold text-base text-bunker-text-primary">Hozircha buyurtmalar yo‘q</h3>
          <p className="text-xs max-w-sm mx-auto text-bunker-text-muted">
            Marketplacedan materiallarni tanlang va B2B shartnomani rasmiylashtiring.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const isExpanded = !!expandedOrderIds[o.id];
            const isPendingPayment = o.paymentStatus !== 'PAID';

            return (
              <Card
                key={o.id}
                className="space-y-4 border-bunker-border-strong hover:border-bunker-amber-500/60 transition-all shadow-xs hover:shadow-md"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-bunker-border-subtle">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
                      <Package className="w-4 h-4 text-bunker-amber-500" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-bunker-text-primary font-mono">{o.orderNumber}</span>
                      <span className="text-[11px] text-bunker-text-muted font-mono ml-2">
                        {new Date(o.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(o.status)}
                    {o.paymentStatus === 'PAID' ? (
                      <Badge variant="success" className="font-mono text-[10px] bg-emerald-50 text-emerald-800 border-emerald-200">
                        TO‘LANGAN
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="font-mono text-[10px] bg-orange-50 text-orange-800 border-orange-200">
                        TO‘LOV KUTILMOQDA
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Primary Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-bunker-text-secondary">
                  <div>
                    <span className="text-bunker-text-muted block uppercase font-mono text-[10px]">Qabul qiluvchi:</span>
                    <p className="font-semibold text-bunker-text-primary mt-0.5">{o.buyerName}</p>
                    <p className="font-mono text-[11px]">{o.buyerPhone}</p>
                  </div>

                  <div>
                    <span className="text-bunker-text-muted block uppercase font-mono text-[10px]">Yetkazish manzili:</span>
                    <p className="font-semibold text-bunker-text-primary mt-0.5">
                      {o.deliveryAddress?.region || 'Toshkent shahri'}, {o.deliveryAddress?.district || 'Chilonzor'}
                    </p>
                    <p className="truncate text-[11px] text-bunker-text-muted">{o.deliveryAddress?.street || 'Ob’ekt manzili'}</p>
                  </div>

                  <div>
                    <span className="text-bunker-text-muted block uppercase font-mono text-[10px]">Jami summa:</span>
                    <p className="text-base font-extrabold text-bunker-amber-500 font-mono mt-0.5">
                      {Number(o.finalAmount).toLocaleString()} so'm
                    </p>
                    <p className="text-[11px] text-bunker-text-muted font-mono">Usul: {o.paymentMethod}</p>
                  </div>
                </div>

                {/* PENDING PAYMENT ACTION BUTTONS */}
                {isPendingPayment && (
                  <div className="bg-orange-50/60 border border-orange-200/80 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 font-mono">
                    <div className="flex items-center gap-2 text-xs text-orange-800">
                      <CreditCard className="w-4 h-4 shrink-0 text-bunker-amber-500" />
                      <span>Ushbu buyurtma to‘lovi kutilmoqda. Onlayn to‘lovni amalga oshiring:</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => handleOpenPayment(o, 'PAYME')}
                        className="px-3 py-2 rounded-xl bg-white border border-sky-300 text-sky-800 hover:bg-sky-50 font-bold text-xs font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs w-full sm:w-auto"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-sky-600" />
                        <span>Payme orqali to'lash</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenPayment(o, 'CLICK')}
                        className="px-3 py-2 rounded-xl bg-white border border-orange-300 text-orange-800 hover:bg-orange-50 font-bold text-xs font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs w-full sm:w-auto"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-orange-600" />
                        <span>Click orqali to'lash</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* EXPANDABLE DETAILS ACCORDION */}
                <div className="pt-2 border-t border-bunker-border-subtle">
                  <button
                    type="button"
                    onClick={() => toggleExpand(o.id)}
                    className="flex items-center justify-between w-full text-xs text-bunker-text-secondary hover:text-bunker-text-primary font-semibold py-1 cursor-pointer transition-colors font-mono"
                  >
                    <span className="flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-bunker-amber-500" />
                      {isExpanded ? "Batafsil ma'lumotni yashirish" : "Buyurtma tafsilotlari va tovarlar ro'yxati"}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-3 pt-3 border-t border-bunker-border-subtle text-xs animate-in fade-in font-mono">
                      {/* Items breakdown using Table Component */}
                      <div className="space-y-2">
                        <span className="text-[10px] text-bunker-text-muted uppercase block font-bold">
                          Buyurtma qilingan tovarlar:
                        </span>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Mahsulot Nomi</TableHead>
                              <TableHead className="text-center">Miqdori &amp; Birligi</TableHead>
                              <TableHead className="text-right">Birlik Narxi</TableHead>
                              <TableHead className="text-right">Jami Summa</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {o.items.map((item, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="font-semibold text-bunker-text-primary">
                                  {item.productTitle}
                                </TableCell>
                                <TableCell className="text-center">
                                  {item.quantity} {item.unit}
                                </TableCell>
                                <TableCell className="text-right">
                                  {Number(item.unitPrice).toLocaleString()} so'm
                                </TableCell>
                                <TableCell className="text-right font-bold text-bunker-amber-500">
                                  {Number(item.totalPrice).toLocaleString()} so'm
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Delivery and Financial Breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-bunker-border-subtle space-y-1.5">
                          <span className="text-[10px] text-bunker-text-muted uppercase block font-bold">
                            Yetkazib berish parametrlari:
                          </span>
                          <p className="text-xs text-bunker-text-secondary">
                            <span className="text-bunker-text-muted">Manzil:</span> {o.deliveryAddress?.region},{' '}
                            {o.deliveryAddress?.district}, {o.deliveryAddress?.street || 'Ko‘rsatilmagan'}
                          </p>
                          <p className="text-xs text-bunker-text-secondary">
                            <span className="text-bunker-text-muted">Maxsus texnika:</span>{' '}
                            {o.vehicleType || 'Samosval HOWO Sinotruk'}
                          </p>
                          <p className="text-xs text-bunker-text-secondary">
                            <span className="text-bunker-text-muted">Kuzatuv kodi:</span>{' '}
                            <span className="text-bunker-amber-500 font-semibold">{o.trackingCode || o.orderNumber}</span>
                          </p>
                        </div>

                        <div className="bg-slate-50 p-3.5 rounded-xl border border-bunker-border-subtle space-y-1.5">
                          <span className="text-[10px] text-bunker-text-muted uppercase block font-bold">
                            To‘lov va hisob-kitob tafsilotlari:
                          </span>
                          <div className="flex justify-between text-bunker-text-secondary">
                            <span>Tovarlar narxi:</span>
                            <span>{Number(o.totalAmount).toLocaleString()} so'm</span>
                          </div>
                          <div className="flex justify-between text-bunker-text-secondary">
                            <span>Yetkazish narxi:</span>
                            <span>{Number(o.deliveryFee).toLocaleString()} so'm</span>
                          </div>
                          {Number(o.discountAmount) > 0 && (
                            <div className="flex justify-between text-bunker-status-green">
                              <span>Chegirma:</span>
                              <span>-{Number(o.discountAmount).toLocaleString()} so'm</span>
                            </div>
                          )}
                          <div className="flex justify-between pt-1 border-t border-bunker-border-subtle text-xs">
                            <span className="text-bunker-text-muted">Tranzaksiya ID:</span>
                            <span className="text-bunker-text-primary">
                              {o.paymentTransactionId || 'Tranzaksiya kutilmoqda'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* INTERACTIVE PAYMENT GATEWAY MODAL USING MODAL COMPONENT */}
      {paymentModal.isOpen && paymentModal.order && (
        <Modal
          isOpen={paymentModal.isOpen && !!paymentModal.order}
          onClose={() => setPaymentModal({ isOpen: false, order: null, provider: 'PAYME' })}
          size="sm"
          headerExtra={
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                paymentModal.provider === 'PAYME'
                  ? 'bg-sky-50 border border-sky-200 text-sky-700'
                  : 'bg-orange-50 border border-orange-200 text-orange-700'
              }`}
            >
              <CreditCard className="w-5 h-5" />
            </div>
          }
          title={`${paymentModal.provider} To‘lov Shlyuzi`}
          subtitle="Xavfsiz onlayn to‘lov tizimi (O‘zbekiston)"
        >
          {/* Error / Success Alerts */}
          {paymentError && (
            <Alert
              variant="error"
              description={paymentError}
              onDismiss={() => setPaymentError(null)}
            />
          )}

          {paymentSuccessMsg && (
            <Alert
              variant="success"
              description={paymentSuccessMsg}
            />
          )}

          {/* Invoice Summary */}
          <div className="bg-slate-50 border border-bunker-border-strong p-4 rounded-xl space-y-2 text-xs font-mono">
            <div className="flex justify-between text-bunker-text-secondary">
              <span>Buyurtma raqami:</span>
              <span className="text-bunker-text-primary font-bold">{paymentModal.order.orderNumber}</span>
            </div>
            <div className="flex justify-between text-bunker-text-secondary">
              <span>Qabul qiluvchi:</span>
              <span className="text-bunker-text-primary">{paymentModal.order.buyerName}</span>
            </div>
            <div className="flex justify-between text-bunker-text-secondary">
              <span>To‘lov oluvchi:</span>
              <span className="text-bunker-text-primary">«BUNKER STROY INVEST» MChJ</span>
            </div>
            <div className="pt-2 border-t border-bunker-border-subtle flex justify-between items-baseline">
              <span className="font-bold text-bunker-text-primary">Jami to‘lov summasi:</span>
              <span className="text-xl font-extrabold text-bunker-amber-500">
                {Number(paymentModal.order.finalAmount).toLocaleString()} so'm
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-1 font-mono">
            <Button
              className="w-full"
              size="md"
              onClick={handleSimulatePayment}
              isLoading={simulatingPayment}
              disabled={!!paymentSuccessMsg}
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">To‘lovni Amalga Oshirish (Instant Checkout)</span>
              <span className="sm:hidden">To‘lovni Amalga Oshirish</span>
            </Button>

            <a
              href={
                paymentModal.provider === 'PAYME'
                  ? `https://checkout.paycom.uz/${btoa(
                      `m=65c8f921a8d;ac.order_id=${paymentModal.order.id};a=${
                        Number(paymentModal.order.finalAmount) * 100
                      }`
                    )}`
                  : `https://my.click.uz/services/pay?service_id=12345&merchant_id=67890&amount=${paymentModal.order.finalAmount}&transaction_param=${paymentModal.order.id}`
              }
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-bunker-border-strong hover:border-bunker-amber-500 text-xs text-bunker-text-secondary hover:text-bunker-text-primary transition-colors cursor-pointer bg-white shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Rasmiy {paymentModal.provider} ilovasida ochish</span>
            </a>
          </div>
        </Modal>
      )}
    </div>
  );
};
