import React from 'react';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  CreditCard,
  QrCode,
  KeyRound,
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  User,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Order, OrderStatus } from '@bunkerstroy/types';
import { Modal, Button, Badge } from '@bunkerstroy/ui';

interface OrderDetailModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onOpenPayment?: (order: Order, provider: 'PAYME' | 'CLICK') => void;
  onOpenDispute?: (order: Order) => void;
  onOpenB2bDocuments?: (order: Order) => void;
  onPaySecondHalf?: (orderId: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  order,
  onClose,
  onOpenPayment,
  onOpenDispute,
  onOpenB2bDocuments,
  onPaySecondHalf
}) => {
  if (!order) return null;

  const isPendingPayment = order.paymentStatus !== 'PAID' && order.status === 'PENDING_PAYMENT';
  const isArrivedWaitingSecondPayment =
    order.status === 'ARRIVED' && order.paymentMode === 'SPLIT_50_50' && !order.isSecondPaid;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'DRAFT':
        return <Badge variant="neutral">SAVATDA</Badge>;
      case 'PENDING_PAYMENT':
      case 'PENDING':
        return <Badge variant="warning">TO‘LOV KUTILMOQDA</Badge>;
      case 'PAID':
      case 'CONFIRMED':
        return <Badge variant="info">TO‘LANDI</Badge>;
      case 'ACCEPTED':
      case 'PACKING':
        return <Badge variant="info">TAYYORLANMOQDA</Badge>;
      case 'ASSIGNED':
      case 'ASSIGNED_TO_FLEET':
        return <Badge variant="purple">HAYDOVCHI TAYINLANDI</Badge>;
      case 'IN_TRANSIT':
        return <Badge variant="purple">🚚 YO‘LDA</Badge>;
      case 'ARRIVED':
        return <Badge variant="brand">MANZILGA YETDI</Badge>;
      case 'FULLY_PAID':
      case 'RECEIVED':
      case 'DELIVERED':
      case 'COMPLETED':
        return <Badge variant="success">YAKUNLANDI</Badge>;
      case 'DISPUTE':
        return <Badge variant="error">NIZO (DISPUTE)</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-[#D95D1E]" />
          <span>Buyurtma Tafsilotlari #{order.orderNumber}</span>
        </div>
      }
      subtitle={`Sana: ${new Date(order.createdAt).toLocaleString('uz-UZ')} | Rejim: ${
        order.paymentMode === 'SPLIT_50_50' ? '50/50 Bo‘lib to‘lash' : '100% Escrow'
      }`}
      headerExtra={
        <div className="flex items-center gap-2">
          {getStatusBadge(order.status)}
        </div>
      }
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2.5 w-full font-mono text-xs">
          <div className="flex items-center gap-2">
            <a
              href={`https://bunkerstroy.uz/receipt/${order.id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-colors cursor-pointer min-h-[44px]"
            >
              <QrCode className="w-4 h-4 text-[#D95D1E]" />
              <span>QR Chek</span>
            </a>

            {onOpenB2bDocuments && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenB2bDocuments(order);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-orange-200 bg-orange-50 text-[#D95D1E] hover:bg-orange-100 transition-colors cursor-pointer font-bold shadow-2xs min-h-[44px]"
              >
                <FileCheck className="w-4 h-4 text-[#D95D1E]" />
                <span>B2B Hujjatlar</span>
              </button>
            )}
          </div>

          <Button variant="ghost" size="sm" onClick={onClose} className="min-h-[44px]">
            Yopish
          </Button>
        </div>
      }
    >
      <div className="space-y-4 font-sans text-xs">
        {/* 1. Progress Step Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-700 mb-1.5">
            <span className="font-bold">Buyurtma Bosqichi:</span>
            <span className="text-[#D95D1E] font-black uppercase">{order.status}</span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#D95D1E] h-full transition-all duration-500"
              style={{
                width:
                  order.status === 'PENDING_PAYMENT' ? '12%'
                  : order.status === 'PAID' || order.status === 'CONFIRMED' ? '28%'
                  : order.status === 'ACCEPTED' || order.status === 'PACKING' ? '45%'
                  : order.status === 'ASSIGNED' || order.status === 'ASSIGNED_TO_FLEET' ? '60%'
                  : order.status === 'IN_TRANSIT' ? '75%'
                  : order.status === 'ARRIVED' ? '88%'
                  : '100%'
              }}
            />
          </div>
        </div>

        {/* 2. Revealed PIN Code Banner */}
        {order.isAcceptanceCodeRevealed && order.acceptanceCode && (
          <div className="bg-amber-50/70 border-2 border-dashed border-amber-300 rounded-xl p-4 text-center space-y-1 font-mono shadow-2xs">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#D95D1E] uppercase">
              <KeyRound className="w-4 h-4 text-[#D95D1E]" />
              <span>Maxfiy Qabul Kodi (Delivery PIN)</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-widest text-[#D95D1E] select-all font-mono-numbers py-1">
              {order.acceptanceCode}
            </div>
            <p className="text-[11px] text-slate-600 max-w-sm mx-auto">
              Yuk ob'ektda tekshirib qabul qilingach, ushbu kodni haydovchiga ayting.
            </p>
          </div>
        )}

        {/* 3. Waiting second payment prompt */}
        {isArrivedWaitingSecondPayment && onPaySecondHalf && (
          <div className="bg-amber-50/80 border-2 border-amber-400 p-3.5 rounded-xl space-y-2.5 font-mono">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#D95D1E]" />
                YUK MANZILGA YETIB KELDI!
              </span>
              <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                50% Qoldiq to‘lov
              </span>
            </div>
            <p className="text-xs text-slate-700 font-sans">
              Tushirishdan oldin ikkinchi 50% to‘lovni tasdiqlang. Shundan so‘ng ekranda haydovchiga aytiladigan Qabul Kodi ochiladi.
            </p>
            <button
              type="button"
              onClick={() => onPaySecondHalf(order.id)}
              className="w-full bg-[#D95D1E] hover:bg-[#B43B06] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[44px] transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              <span>Ikkinchi 50% to‘lovni tasdiqlash</span>
            </button>
          </div>
        )}

        {/* 4. Products List (Responsive mobile cards + table on desktop) */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-slate-700 uppercase block">
            Mahsulotlar ({order.items.length}):
          </span>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Mahsulot</th>
                  <th className="py-2.5 px-3 text-center">Miqdor</th>
                  <th className="py-2.5 px-3 text-right">Narxi</th>
                  <th className="py-2.5 px-3 text-right">Jami</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
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

          {/* Mobile Card List View (< 640px) */}
          <div className="sm:hidden space-y-2">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5 font-mono"
              >
                <div className="font-bold text-xs text-slate-900 leading-snug">
                  {item.productTitle}
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                  <span className="text-slate-600 text-[11px]">
                    {item.quantity} {item.unit} &times; {Number(item.unitPrice).toLocaleString()}
                  </span>
                  <span className="font-black text-[#D95D1E] font-mono-numbers">
                    {Number(item.totalPrice).toLocaleString()} so‘m
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Delivery and Financials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          {/* Delivery Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D95D1E]" />
              Yetkazib Berish Manzili
            </span>
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">
                {order.deliveryAddress?.region || 'Toshkent shahri'},{' '}
                {order.deliveryAddress?.district || 'Chilonzor tumani'}
              </p>
              <p className="text-slate-600 text-[11px]">
                {order.deliveryAddress?.street || 'Ko‘rsatilmagan'}
              </p>
              {order.deliveryAddress?.landmark && (
                <p className="text-[10px] text-slate-500">
                  Mo‘ljal: {order.deliveryAddress.landmark}
                </p>
              )}
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Transport:</span>
              <span className="text-slate-900 font-bold">{order.vehicleType || 'Standart Kuryer'}</span>
            </div>
          </div>

          {/* Financial Breakdown Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
              To‘lov Tafsilotlari (Escrow)
            </span>
            <div className="space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Mahsulotlar summasi:</span>
                <span>{Number(order.totalAmount).toLocaleString()} so‘m</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Yetkazish narxi:</span>
                <span>
                  {Number(order.deliveryFee || 0) === 0 ? 'BEPUL' : `${Number(order.deliveryFee).toLocaleString()} so‘m`}
                </span>
              </div>
              {order.paymentMode === 'SPLIT_50_50' && (
                <div className="pt-1 border-t border-slate-200 space-y-0.5 text-[11px]">
                  <div className="flex justify-between text-amber-800">
                    <span>1-bosqich (50% Avans):</span>
                    <span className="font-bold">
                      {(Number(order.firstPaymentAmount || order.finalAmount / 2)).toLocaleString()} so‘m
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>2-bosqich (50% Qoldiq):</span>
                    <span className="font-bold">
                      {(Number(order.secondPaymentAmount || order.finalAmount / 2)).toLocaleString()} so‘m
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="font-bold text-slate-900 uppercase text-xs">Jami To‘lov:</span>
              <span className="text-base font-black text-[#D95D1E] font-mono-numbers">
                {Number(order.finalAmount).toLocaleString()} so‘m
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
