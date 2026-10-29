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
        return <span className="bg-[#0F2547] text-sky-300 border border-[#1E3A6D] px-2 py-0.5 rounded text-[10px] font-mono font-bold">SAVATDA</span>;
      case 'PENDING_PAYMENT':
      case 'PENDING':
        return <span className="bg-amber-950/80 text-[#FFB800] border border-[#FFB800]/50 px-2 py-0.5 rounded text-[10px] font-mono font-bold">TO‘LOV KUTILMOQDA</span>;
      case 'PAID':
      case 'CONFIRMED':
        return <span className="bg-sky-950/80 text-sky-300 border border-sky-500/40 px-2 py-0.5 rounded text-[10px] font-mono font-bold">TO‘LANDI</span>;
      case 'ACCEPTED':
      case 'PACKING':
        return <span className="bg-blue-950/80 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded text-[10px] font-mono font-bold">TAYYORLANMOQDA</span>;
      case 'ASSIGNED':
      case 'ASSIGNED_TO_FLEET':
        return <span className="bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded text-[10px] font-mono font-bold">HAYDOVCHI TAYINLANDI</span>;
      case 'IN_TRANSIT':
        return <span className="bg-purple-950/80 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded text-[10px] font-mono font-bold">🚚 YO‘LDA</span>;
      case 'ARRIVED':
        return <span className="bg-[#132C54] text-[#FFB800] border-2 border-[#FFB800] px-2 py-0.5 rounded text-[10px] font-mono font-black animate-pulse">MANZILGA YETDI</span>;
      case 'FULLY_PAID':
      case 'RECEIVED':
      case 'DELIVERED':
      case 'COMPLETED':
        return <span className="bg-emerald-950/90 text-emerald-400 border border-emerald-500/60 px-2 py-0.5 rounded text-[10px] font-mono font-black">YAKUNLANDI</span>;
      case 'DISPUTE':
        return <span className="bg-red-950/90 text-rose-300 border border-rose-500 px-2 py-0.5 rounded text-[10px] font-mono font-black">NIZO (DISPUTE)</span>;
      default:
        return <span className="bg-[#0F2547] text-sky-200 border border-[#1E3A6D] px-2 py-0.5 rounded text-[10px] font-mono font-bold">{status}</span>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-[#FFB800]" />
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
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#1E3A6D] bg-[#071326] text-sky-200 hover:text-white hover:border-[#FFB800] transition-colors cursor-pointer min-h-[44px]"
            >
              <QrCode className="w-4 h-4 text-[#FFB800]" />
              <span>QR Chek</span>
            </a>

            {onOpenB2bDocuments && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenB2bDocuments(order);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#254B85] bg-[#0F2547] text-white hover:border-[#FFB800] transition-colors cursor-pointer font-bold shadow-xs min-h-[44px]"
              >
                <FileCheck className="w-4 h-4 text-[#FFB800]" />
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
        <div className="bg-[#071326] border border-[#1E3A6D] rounded-xl p-3 font-mono text-xs">
          <div className="flex items-center justify-between text-sky-200 mb-1.5">
            <span className="font-bold">Buyurtma Bosqichi:</span>
            <span className="text-[#FFB800] font-black uppercase">{order.status}</span>
          </div>
          <div className="w-full bg-[#0F2547] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#FFB800] h-full transition-all duration-500 shadow-[0_0_8px_rgba(255,184,0,0.5)]"
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
          <div className="bg-gradient-to-r from-[#FFB800]/15 via-[#FFB800]/25 to-[#FFB800]/15 border-2 border-dashed border-[#FFB800] rounded-xl p-4 text-center space-y-1 font-mono shadow-md">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#FFB800] uppercase">
              <KeyRound className="w-4 h-4 text-[#FFB800]" />
              <span>Maxfiy Qabul Kodi (Delivery PIN)</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-widest text-[#FFB800] select-all font-mono-numbers py-1">
              {order.acceptanceCode}
            </div>
            <p className="text-[11px] text-sky-200 max-w-sm mx-auto">
              Yuk ob'ektda tekshirib qabul qilingach, ushbu kodni haydovchiga ayting.
            </p>
          </div>
        )}

        {/* 3. Waiting second payment prompt */}
        {isArrivedWaitingSecondPayment && onPaySecondHalf && (
          <div className="bg-[#071326] border-2 border-[#FFB800] p-3.5 rounded-xl space-y-2.5 font-mono">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-white flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#FFB800]" />
                YUK MANZILGA YETIB KELDI!
              </span>
              <span className="bg-amber-950 text-[#FFB800] border border-[#FFB800]/50 px-2 py-0.5 rounded text-[10px] font-bold">
                50% Qoldiq to‘lov
              </span>
            </div>
            <p className="text-xs text-sky-200 font-sans">
              Tushirishdan oldin ikkinchi 50% to‘lovni tasdiqlang. Shundan so‘ng ekranda haydovchiga aytiladigan Qabul Kodi ochiladi.
            </p>
            <button
              type="button"
              onClick={() => onPaySecondHalf(order.id)}
              className="w-full btn-industrial-yellow py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md min-h-[44px]"
            >
              <CreditCard className="w-4 h-4" />
              <span>Ikkinchi 50% to‘lovni tasdiqlash</span>
            </button>
          </div>
        )}

        {/* 4. Products List (Responsive mobile cards + table on desktop) */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-sky-300 uppercase block">
            Mahsulotlar ({order.items.length}):
          </span>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-[#1E3A6D]">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#071326] text-sky-300 border-b border-[#1E3A6D]">
                <tr>
                  <th className="py-2.5 px-3">Mahsulot</th>
                  <th className="py-2.5 px-3 text-center">Miqdor</th>
                  <th className="py-2.5 px-3 text-right">Narxi</th>
                  <th className="py-2.5 px-3 text-right">Jami</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3A6D] bg-[#0A1931]">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-3 font-semibold text-white">
                      {item.productTitle}
                    </td>
                    <td className="py-2.5 px-3 text-center text-sky-200">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-2.5 px-3 text-right text-sky-300 font-mono-numbers">
                      {Number(item.unitPrice).toLocaleString()} so‘m
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-[#FFB800] font-mono-numbers">
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
                className="bg-[#0F2547] border border-[#1E3A6D] rounded-xl p-3 space-y-1.5 font-mono"
              >
                <div className="font-bold text-xs text-white leading-snug">
                  {item.productTitle}
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#1E3A6D]">
                  <span className="text-sky-300 text-[11px]">
                    {item.quantity} {item.unit} &times; {Number(item.unitPrice).toLocaleString()}
                  </span>
                  <span className="font-black text-[#FFB800] font-mono-numbers">
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
          <div className="bg-[#071326] border border-[#1E3A6D] rounded-xl p-3.5 space-y-2">
            <span className="text-[10px] text-sky-400 uppercase font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FFB800]" />
              Yetkazib Berish Manzili
            </span>
            <div className="space-y-1">
              <p className="font-semibold text-white">
                {order.deliveryAddress?.region || 'Toshkent shahri'},{' '}
                {order.deliveryAddress?.district || 'Chilonzor tumani'}
              </p>
              <p className="text-sky-300 text-[11px]">
                {order.deliveryAddress?.street || 'Ko‘rsatilmagan'}
              </p>
              {order.deliveryAddress?.landmark && (
                <p className="text-[10px] text-sky-400">
                  Mo‘ljal: {order.deliveryAddress.landmark}
                </p>
              )}
            </div>
            <div className="pt-2 border-t border-[#1E3A6D] flex items-center justify-between text-[11px]">
              <span className="text-sky-400">Transport:</span>
              <span className="text-white font-bold">{order.vehicleType || 'Standart Kuryer'}</span>
            </div>
          </div>

          {/* Financial Breakdown Card */}
          <div className="bg-[#071326] border border-[#1E3A6D] rounded-xl p-3.5 space-y-2">
            <span className="text-[10px] text-sky-400 uppercase font-bold flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              To‘lov Tafsilotlari (Escrow)
            </span>
            <div className="space-y-1">
              <div className="flex justify-between text-sky-300">
                <span>Mahsulotlar summasi:</span>
                <span>{Number(order.totalAmount).toLocaleString()} so‘m</span>
              </div>
              <div className="flex justify-between text-sky-300">
                <span>Yetkazish narxi:</span>
                <span>
                  {Number(order.deliveryFee || 0) === 0 ? 'BEPUL' : `${Number(order.deliveryFee).toLocaleString()} so‘m`}
                </span>
              </div>
              {order.paymentMode === 'SPLIT_50_50' && (
                <div className="pt-1 border-t border-[#1E3A6D] space-y-0.5 text-[11px]">
                  <div className="flex justify-between text-amber-300">
                    <span>1-bosqich (50% Avans):</span>
                    <span className="font-bold">
                      {(Number(order.firstPaymentAmount || order.finalAmount / 2)).toLocaleString()} so‘m
                    </span>
                  </div>
                  <div className="flex justify-between text-sky-300">
                    <span>2-bosqich (50% Qoldiq):</span>
                    <span className="font-bold">
                      {(Number(order.secondPaymentAmount || order.finalAmount / 2)).toLocaleString()} so‘m
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="pt-2 border-t border-[#1E3A6D] flex justify-between items-baseline">
              <span className="font-bold text-white uppercase text-xs">Jami To‘lov:</span>
              <span className="text-base font-black text-[#FFB800] font-mono-numbers">
                {Number(order.finalAmount).toLocaleString()} so‘m
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
