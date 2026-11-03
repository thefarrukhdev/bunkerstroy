import React, { useState, useEffect } from 'react';
import { Package, RotateCw } from 'lucide-react';
import { Order } from '@bunkerstroy/types';
import { Alert, Skeleton } from '@bunkerstroy/ui';
import { apiFetch } from '../../services/apiClient';
import { OrderCard } from './OrderCard';
import { PaymentSimulationModal } from './PaymentSimulationModal';
import { DisputeModal } from './DisputeModal';
import { B2bDocumentsModal } from './B2bDocumentsModal';
import type { PaymentModalState, DisputeModalState } from './types';

export const OrdersView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Payment modal state
  const [paymentModal, setPaymentModal] = useState<PaymentModalState>({
    isOpen: false,
    order: null,
    provider: 'PAYME',
  });
  const [simulatingPayment, setSimulatingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Dispute modal state
  const [disputeModal, setDisputeModal] = useState<DisputeModalState>({
    isOpen: false,
    orderId: null,
    orderNumber: null,
    reason: '',
    evidenceUrl: '',
  });
  const [disputeLoading, setDisputeLoading] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // B2B Documents modal state
  const [selectedB2bOrder, setSelectedB2bOrder] = useState<Order | null>(null);

  const fetchOrders = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await apiFetch('/orders');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setOrders(json.data);
      }
    } catch {
      // Keep empty or fallback
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirmPayment = async () => {
    if (!paymentModal.order) return;
    setSimulatingPayment(true);
    setPaymentError(null);

    try {
      const isSecondPart =
        paymentModal.order.status === 'ARRIVED' &&
        paymentModal.order.paymentMode === 'SPLIT_50_50' &&
        !paymentModal.order.isSecondPaid;

      const endpoint = isSecondPart
        ? `/orders/${paymentModal.order.id}/pay-second`
        : `/orders/${paymentModal.order.id}/pay`;

      const res = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          provider: paymentModal.provider,
          paidAt: new Date().toISOString(),
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setPaymentModal({ isOpen: false, order: null, provider: 'PAYME' });
        setActionSuccessMsg('To‘lov muvaffaqiyatli qabul qilindi va Escrow hisobiga joylashtirildi.');
        fetchOrders(true);
      } else {
        setPaymentError(json.message || 'To‘lovda xatolik yuz berdi');
      }
    } catch {
      setPaymentError('Server bilan aloqa uzildi');
    } finally {
      setSimulatingPayment(false);
    }
  };

  const handleSubmitDispute = async () => {
    if (!disputeModal.orderId || !disputeModal.reason.trim()) return;
    setDisputeLoading(true);

    try {
      const res = await apiFetch(`/orders/${disputeModal.orderId}/dispute`, {
        method: 'POST',
        body: JSON.stringify({
          reason: disputeModal.reason.trim(),
          evidenceUrls: disputeModal.evidenceUrl ? [disputeModal.evidenceUrl.trim()] : [],
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setDisputeModal({ isOpen: false, orderId: null, orderNumber: null, reason: '', evidenceUrl: '' });
        setActionSuccessMsg('Nizo arizangiz muvaffaqiyatli qabul qilindi. Operatorlar ko‘rib chiqadi.');
        fetchOrders(true);
      }
    } catch {
      // handle error
    } finally {
      setDisputeLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-900 pb-12 font-sans">
      {/* 1. Header Banner */}
      <div className="relative bg-white rounded-2xl p-5 sm:p-7 shadow-2xs border border-slate-200 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-[#D95D1E] uppercase tracking-wider">
                BunkerStroy Mijoz Kabineti
              </span>
              <span className="bg-orange-50 text-[#D95D1E] border border-orange-200 px-2 py-0.5 rounded text-[10px] font-bold">
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
          <div className="flex items-center gap-2 shrink-0 text-xs">
            <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-slate-700 flex items-center gap-2 shadow-2xs">
              <span className="text-[#D95D1E] font-black">{orders.length}</span>
              <span>ta faol buyurtma</span>
            </div>
          </div>
        </div>
      </div>

      {actionSuccessMsg && (
        <Alert variant="success" onDismiss={() => setActionSuccessMsg(null)}>
          {actionSuccessMsg}
        </Alert>
      )}

      {/* 2. Control bar */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-3.5 sm:p-4 rounded-2xl shadow-2xs">
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
          className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors"
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
                <Skeleton variant="circle" width={32} height={32} className="bg-slate-100" />
                <Skeleton variant="rect" width={90} height={24} className="bg-slate-100" />
              </div>
              <Skeleton variant="text" width="80%" className="bg-slate-100" />
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
          {orders.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              onOpenPayment={(ord, provider) =>
                setPaymentModal({ isOpen: true, order: ord, provider })
              }
              onOpenDispute={(ord) =>
                setDisputeModal({
                  isOpen: true,
                  orderId: ord.id,
                  orderNumber: ord.orderNumber,
                  reason: '',
                  evidenceUrl: '',
                })
              }
              onOpenB2bDocs={(ord) => setSelectedB2bOrder(ord)}
            />
          ))}
        </div>
      )}

      {/* Payment simulation modal */}
      <PaymentSimulationModal
        state={paymentModal}
        onClose={() => setPaymentModal({ isOpen: false, order: null, provider: 'PAYME' })}
        onConfirm={handleConfirmPayment}
        isLoading={simulatingPayment}
        errorMsg={paymentError}
      />

      {/* Dispute modal */}
      <DisputeModal
        state={disputeModal}
        onClose={() =>
          setDisputeModal({ isOpen: false, orderId: null, orderNumber: null, reason: '', evidenceUrl: '' })
        }
        onSubmit={handleSubmitDispute}
        isLoading={disputeLoading}
        onChangeReason={(val) => setDisputeModal((p) => ({ ...p, reason: val }))}
        onChangeEvidence={(val) => setDisputeModal((p) => ({ ...p, evidenceUrl: val }))}
      />

      {/* B2B Documents Modal */}
      {selectedB2bOrder && (
        <B2bDocumentsModal
          order={selectedB2bOrder}
          isOpen={!!selectedB2bOrder}
          onClose={() => setSelectedB2bOrder(null)}
        />
      )}
    </div>
  );
};
