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
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  X,
  Sparkles,
  Receipt
} from 'lucide-react';
import { Order, OrderStatus } from '@bunkerstroy/types';
import { Badge, Button, Card } from '@bunkerstroy/ui';

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
        setPaymentError(json.error?.message || json.message || 'To‘lovda xatolik yuz berdi');
      }
    } catch {
      setPaymentError('Server bilan aloqa uzildi');
    } finally {
      setSimulatingPayment(false);
    }
  };

  // Helper for Order Status Badge
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge variant="info" className="font-mono text-[10px]">TASDIQLANGAN</Badge>;
      case 'ASSIGNED_TO_FLEET':
        return <Badge variant="warning" className="font-mono text-[10px]">TRANSPORT BIRIKTIRILDI</Badge>;
      case 'IN_TRANSIT':
        return (
          <Badge variant="warning" className="font-mono text-[10px] gap-1">
            <Truck className="w-3 h-3 text-bunker-amber-500" />
            YUK YO‘LDA
          </Badge>
        );
      case 'DELIVERED':
        return (
          <Badge variant="success" className="font-mono text-[10px] gap-1">
            <CheckCircle2 className="w-3 h-3 text-bunker-status-green" />
            YETKAZILDI
          </Badge>
        );
      case 'CANCELLED':
        return <Badge variant="danger" className="font-mono text-[10px]">BEKOR QILINDI</Badge>;
      case 'PENDING':
      default:
        return <Badge variant="neutral" className="font-mono text-[10px]">KUTILMOQDA</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-bunker-border-strong">
        <div>
          <h2 className="text-xl font-black text-bunker-text-primary font-mono">Buyurtmalar Tarixi va Statusi</h2>
          <p className="text-xs text-bunker-text-secondary mt-0.5">
            Barcha buyurtmalar, transport jo‘natmalari va to‘lov holati
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="warning" className="font-mono text-xs">
            {orders.length} ta buyurtma
          </Badge>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fetchOrders(true)}
            isLoading={refreshing}
            className="text-xs"
          >
            <RotateCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Yangilash</span>
          </Button>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-20 text-bunker-text-secondary font-mono text-sm flex items-center justify-center gap-2">
          <RotateCw className="w-5 h-5 animate-spin text-bunker-amber-500" />
          Buyurtmalar yuklanmoqda...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-bunker-border-strong rounded-3xl space-y-3 text-bunker-text-secondary bg-bunker-surface-1/40">
          <Package className="w-12 h-12 mx-auto text-bunker-amber-500/50" />
          <p className="text-sm font-semibold text-bunker-text-primary">Hozircha buyurtmalar mavjud emas</p>
          <p className="text-xs max-w-sm mx-auto text-bunker-text-muted">
            Marketplacedan kerakli mollarni tanlab xarid savatiga qo'shing yoki logistika reysini band qiling.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const isExpanded = !!expandedOrderIds[o.id];
            const isPendingPayment = o.paymentStatus === 'PENDING';

            return (
              <Card
                key={o.id}
                className={`space-y-4 border transition-all ${
                  isPendingPayment
                    ? 'border-bunker-border-strong hover:border-bunker-amber-500/50'
                    : 'border-bunker-border-strong hover:border-bunker-border-active'
                }`}
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-bunker-border-subtle">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-bunker-amber-500/10 border border-bunker-amber-500/30 flex items-center justify-center">
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
                      <Badge variant="success" className="font-mono text-[10px]">
                        TO‘LANGAN
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="font-mono text-[10px]">
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
                    <p className="text-base font-black text-bunker-amber-500 font-mono mt-0.5">
                      {Number(o.finalAmount).toLocaleString()} so'm
                    </p>
                    <p className="text-[11px] text-bunker-text-muted font-mono">Usul: {o.paymentMethod}</p>
                  </div>
                </div>

                {/* PENDING PAYMENT ACTION BUTTONS */}
                {isPendingPayment && (
                  <div className="bg-bunker-base border border-bunker-amber-500/30 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 font-mono">
                    <div className="flex items-center gap-2 text-xs text-bunker-amber-500">
                      <CreditCard className="w-4 h-4 shrink-0" />
                      <span>Ushbu buyurtma to‘lovi kutilmoqda. Onlayn to‘lovni amalga oshiring:</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenPayment(o, 'PAYME')}
                        className="px-3 py-1.5 rounded-xl bg-bunker-status-cyan/15 border border-bunker-status-cyan/40 text-bunker-status-cyan hover:bg-bunker-status-cyan/25 font-bold text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Payme orqali to'lash</span>
                      </button>

                      <button
                        onClick={() => handleOpenPayment(o, 'CLICK')}
                        className="px-3 py-1.5 rounded-xl bg-bunker-amber-500/15 border border-bunker-amber-500/40 text-bunker-amber-500 hover:bg-bunker-amber-500/25 font-bold text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Click orqali to'lash</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* EXPANDABLE DETAILS ACCORDION */}
                <div className="pt-2 border-t border-bunker-border-subtle">
                  <button
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
                      {/* Items breakdown */}
                      <div className="bg-bunker-base p-3.5 rounded-2xl border border-bunker-border-subtle space-y-2">
                        <span className="text-[10px] text-bunker-text-muted uppercase block font-bold">
                          Buyurtma qilingan tovarlar:
                        </span>
                        <div className="divide-y divide-bunker-border-subtle">
                          {o.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2 text-xs">
                              <div>
                                <p className="font-semibold text-bunker-text-primary">{item.productTitle}</p>
                                <span className="text-[11px] text-bunker-text-muted">
                                  {item.quantity} {item.unit} x {Number(item.unitPrice).toLocaleString()} so'm
                                </span>
                              </div>
                              <span className="font-bold text-bunker-amber-500">
                                {Number(item.totalPrice).toLocaleString()} so'm
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery and Financial Breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-bunker-base p-3.5 rounded-2xl border border-bunker-border-subtle space-y-1.5">
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
                            <span className="text-bunker-amber-500">{o.trackingCode || o.orderNumber}</span>
                          </p>
                        </div>

                        <div className="bg-bunker-base p-3.5 rounded-2xl border border-bunker-border-subtle space-y-1.5">
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

      {/* INTERACTIVE PAYMENT GATEWAY MODAL */}
      {paymentModal.isOpen && paymentModal.order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-bunker-surface-1 border-2 border-bunker-border-strong rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl font-mono">
            <button
              onClick={() => setPaymentModal({ isOpen: false, order: null, provider: 'PAYME' })}
              className="absolute top-5 right-5 text-bunker-text-secondary hover:text-bunker-text-primary cursor-pointer p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  paymentModal.provider === 'PAYME'
                    ? 'bg-bunker-status-cyan/20 border border-bunker-status-cyan/50 text-bunker-status-cyan'
                    : 'bg-bunker-amber-500/20 border border-bunker-amber-500/50 text-bunker-amber-500'
                }`}
              >
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-bunker-text-primary text-base">
                  {paymentModal.provider} To‘lov Shlyuzi
                </h3>
                <p className="text-[11px] text-bunker-text-muted">Xavfsiz onlayn to‘lov tizimi (O‘zbekiston)</p>
              </div>
            </div>

            {/* Error / Success Alerts */}
            {paymentError && (
              <div className="p-3 rounded-xl bg-bunker-status-red/15 border border-bunker-status-red/30 text-xs text-bunker-status-red flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{paymentError}</span>
              </div>
            )}

            {paymentSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-bunker-status-green/20 border border-bunker-status-green/40 text-xs text-bunker-status-green flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{paymentSuccessMsg}</span>
              </div>
            )}

            {/* Invoice Summary */}
            <div className="bg-bunker-base border border-bunker-border-strong p-4 rounded-2xl space-y-2 text-xs">
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
                <span className="text-xl font-black text-bunker-amber-500">
                  {Number(paymentModal.order.finalAmount).toLocaleString()} so'm
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-1">
              <Button
                className="w-full"
                size="md"
                onClick={handleSimulatePayment}
                isLoading={simulatingPayment}
                disabled={!!paymentSuccessMsg}
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                <span>To‘lovni Amalga Oshirish (Instant Checkout)</span>
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
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-bunker-border-strong hover:border-bunker-amber-500 text-xs text-bunker-text-secondary hover:text-bunker-text-primary transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Rasmiy {paymentModal.provider} ilovasida ochish</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
