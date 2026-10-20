import React, { useState } from 'react';
import { OrderRecord, OrderStatus } from '../../mocks/ordersMock';
import { SlideOverDrawer } from '../../components/SlideOverDrawer';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { CancelOrderModal } from './CancelOrderModal';
import {
  ShoppingCart,
  Building2,
  Phone,
  MapPin,
  Truck,
  CreditCard,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Package,
  Calendar,
  Download,
  XCircle
} from 'lucide-react';

interface OrderDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderRecord | null;
  onUpdateStatus: (id: string, newStatus: OrderStatus, cancelReason?: string) => void;
}

export const OrderDetailDrawer: React.FC<OrderDetailDrawerProps> = ({
  isOpen,
  onClose,
  order,
  onUpdateStatus
}) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  if (!order) return null;

  const handleConfirmOrder = () => {
    onUpdateStatus(order.id, 'CONFIRMED');
  };

  const handleAssignToFleet = () => {
    onUpdateStatus(order.id, 'ASSIGNED_TO_FLEET');
  };

  const handleMarkDelivered = () => {
    onUpdateStatus(order.id, 'DELIVERED');
  };

  const handleConfirmCancel = (reason: string) => {
    onUpdateStatus(order.id, 'CANCELLED', reason);
  };

  return (
    <>
      <SlideOverDrawer
        isOpen={isOpen}
        onClose={onClose}
        title={`Buyurtma ${order.orderNumber}`}
        subtitle={`Qabul qilingan vaqti: ${order.createdAt} • ${order.companyName}`}
        footer={
          <div className="flex items-center justify-between w-full">
            <div>
              <StatusBadge status={order.status} />
            </div>

            <div className="flex items-center gap-2">
              {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setIsCancelModalOpen(true)}
                  leftIcon={<XCircle className="w-4 h-4" />}
                >
                  Bekor qilish
                </Button>
              )}

              {order.status === 'PENDING' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleConfirmOrder}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Tasdiqlash (CONFIRMED)
                </Button>
              )}

              {order.status === 'CONFIRMED' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAssignToFleet}
                  leftIcon={<Truck className="w-4 h-4" />}
                >
                  Logistikaga yo‘naltirish
                </Button>
              )}

              {order.status === 'IN_TRANSIT' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleMarkDelivered}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Yetkazildi (DELIVERED)
                </Button>
              )}
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Bekor qilingan bo'lsa ogohlantirish */}
          {order.status === 'CANCELLED' && order.cancelReason && (
            <div className="p-4 rounded-xl bg-[var(--color-accent-red)]/10 border border-[var(--color-accent-red)]/30 text-xs space-y-1">
              <div className="font-bold text-[var(--color-accent-red)] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Buyurtma bekor qilingan</span>
              </div>
              <p className="text-[var(--color-text-primary)] pl-5.5">
                Sabab: {order.cancelReason}
              </p>
            </div>
          )}

          {/* Buyurtmachi korxona va Manzil */}
          <div className="p-4 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-lg bg-[var(--color-accent-blue)]/15 text-[var(--color-accent-blue)]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                    {order.companyName}
                  </h3>
                  <div className="text-xs font-mono text-[var(--color-text-muted)]">
                    Mas’ul: {order.buyerName} {order.buyerInn ? `(STIR: ${order.buyerInn})` : ''}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-[var(--color-border-subtle)]">
              <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                <Phone className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                <span className="font-mono">{order.buyerPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                <Truck className="w-3.5 h-3.5 text-[var(--color-accent-blue)]" />
                <span>Transport: {order.vehicleType}</span>
              </div>
              <div className="flex items-start gap-2 text-[var(--color-text-secondary)] sm:col-span-2">
                <MapPin className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0 mt-0.5" />
                <span>
                  {order.deliveryRegion}, {order.deliveryDistrict}, {order.deliveryAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Xarid qilingan tovarlar spetsifikatsiyasi */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] flex items-center gap-2">
                <Package className="w-4 h-4 text-[var(--color-accent-blue)]" />
                <span>Buyurtma Tarkibi & Tovar Spetsifikatsiyasi</span>
              </h4>
              <span className="text-xs font-mono text-[var(--color-text-muted)]">
                {order.items.length} xil mahsulot
              </span>
            </div>

            <div className="rounded-xl border border-[var(--color-border-subtle)] overflow-hidden bg-[var(--color-surface-card)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[var(--color-surface-bg)] text-[var(--color-text-secondary)] border-b border-[var(--color-border-subtle)]">
                      <th className="py-2.5 px-3 font-semibold">Mahsulot</th>
                      <th className="py-2.5 px-3 text-right font-semibold">Birlik narxi</th>
                      <th className="py-2.5 px-3 text-center font-semibold">Miqdor</th>
                      <th className="py-2.5 px-3 text-right font-semibold">Jami</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border-subtle)] font-mono">
                    {order.items.map((item) => (
                      <tr key={item.id} className="hover:bg-[var(--color-surface-hover)]/40 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-sans font-semibold text-[var(--color-text-primary)]">
                            {item.productTitle}
                          </div>
                          <div className="text-[10px] text-[var(--color-text-muted)]">
                            {item.sku}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right text-[var(--color-text-secondary)]">
                          {item.unitPrice.toLocaleString()} so‘m
                        </td>
                        <td className="py-3 px-3 text-center text-[var(--color-text-primary)] font-bold">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-3 px-3 text-right text-[var(--color-accent-blue)] font-bold">
                          {item.totalPrice.toLocaleString()} so‘m
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* To'lov va Moliyaviy Xulosa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* To'lov Ma'lumotlari */}
            <div className="p-4 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                <CreditCard className="w-4 h-4 text-[var(--color-accent-green)]" />
                <span>To‘lov Holati</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-secondary)]">To‘lov usuli:</span>
                  <span className="font-bold text-[var(--color-text-primary)]">
                    {order.payment.provider}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-secondary)]">Tranzaksiya holati:</span>
                  <StatusBadge status={order.payment.status} />
                </div>
                {order.payment.transactionId && (
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--color-text-secondary)]">Tranzaksiya ID:</span>
                    <span className="text-[var(--color-accent-blue)]">
                      {order.payment.transactionId}
                    </span>
                  </div>
                )}
                {order.payment.paidAt && (
                  <div className="flex items-center justify-between pt-1 border-t border-[var(--color-border-subtle)]">
                    <span className="text-[var(--color-text-secondary)]">To‘langan vaqt:</span>
                    <span className="text-[var(--color-text-primary)]">
                      {order.payment.paidAt}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Hisob-kitob Xulosasi */}
            <div className="p-4 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between text-[var(--color-text-secondary)]">
                <span>Tovarlar summasi:</span>
                <span>{order.totalAmount.toLocaleString()} so‘m</span>
              </div>
              <div className="flex items-center justify-between text-[var(--color-text-secondary)]">
                <span>Yetkazib berish (Logistika):</span>
                <span>+{order.deliveryFee.toLocaleString()} so‘m</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex items-center justify-between text-[var(--color-accent-green)]">
                  <span>B2B chegirma:</span>
                  <span>-{order.discountAmount.toLocaleString()} so‘m</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-subtle)] text-sm font-bold text-[var(--color-text-primary)]">
                <span>Jami Yakuniy:</span>
                <span className="text-[var(--color-accent-blue)]">
                  {order.finalAmount.toLocaleString()} so‘m
                </span>
              </div>
            </div>
          </div>

          {/* Elektron Hisob-faktura (Invoice) generatori tugmasi */}
          <div className="p-3.5 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-[var(--color-accent-blue)]" />
              <div>
                <div className="text-xs font-bold text-[var(--color-text-primary)]">
                  B2B Elektron Hisob-faktura (Invoice #{order.orderNumber.replace('#', '')})
                </div>
                <div className="text-[11px] text-[var(--color-text-muted)]">
                  Davlat Soliq Qo‘mitasi va E-Faktura PKCS#7 talablariga mos
                </div>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => alert(`Elektron hisob-faktura (${order.orderNumber}) PDF formatida generatsiya qilinmoqda.`)}
            >
              Fakturani yuklab olish
            </Button>
          </div>
        </div>
      </SlideOverDrawer>

      {/* Bekor qilish sababi modali */}
      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        orderNumber={order.orderNumber}
        onConfirmCancel={handleConfirmCancel}
      />
    </>
  );
};
