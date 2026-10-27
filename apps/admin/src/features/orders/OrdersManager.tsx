import React, { useState, useEffect } from 'react';
import { OrderRecord, OrderStatus, INITIAL_ORDERS } from '../../mocks/ordersMock';
import { DataTable, Column } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { KpiStatCard } from '../../components/KpiStatCard';
import { Select } from '../../components/Select';
import { OrderDetailDrawer } from './OrderDetailDrawer';
import { apiClient } from '../../services/apiClient';
import {
  ShoppingCart,
  Building2,
  Phone,
  MapPin,
  Truck,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CreditCard,
  Layers,
  TrendingUp,
  XCircle
} from 'lucide-react';

export const OrdersManager: React.FC = () => {
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [regionFilter, setRegionFilter] = useState<string>('ALL');

  // Detail Drawer state
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiClient.get<any>('/orders');
        if (res && res.data && res.data.length > 0) {
          const mapped: OrderRecord[] = res.data.map((o: any) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            buyerName: o.buyer?.displayName || 'Xaridor',
            buyerPhone: o.buyer?.phone || '+998901234567',
            buyerInn: o.buyer?.inn,
            companyName: o.buyer?.companyName || 'B2B Qurilish',
            deliveryRegion: o.deliveryRegion || 'Toshkent shahri',
            deliveryDistrict: o.deliveryDistrict || 'Yunusobod tumani',
            deliveryAddress: o.deliveryAddress || 'Amir Temur shoh ko‘chasi',
            vehicleType: 'HOWO Samosval 25t',
            items: (o.items || []).map((i: any) => ({
              id: i.id,
              productId: i.productId,
              productTitle: i.product?.title || 'Mahsulot',
              sku: 'SKU-001',
              unit: 'TON',
              unitPrice: Number(i.unitPrice),
              quantity: i.quantity,
              totalPrice: Number(i.totalPrice)
            })),
            totalAmount: Number(o.totalAmount),
            deliveryFee: Number(o.deliveryFee) || 150000,
            discountAmount: 0,
            finalAmount: Number(o.finalAmount),
            status: (o.status === 'ARRIVED' ? 'DELIVERED' : o.status === 'IN_TRANSIT' ? 'IN_TRANSIT' : 'CONFIRMED') as OrderStatus,
            payment: {
              provider: 'PAYME',
              status: 'PAID'
            },
            createdAt: new Date(o.createdAt).toLocaleDateString('uz-UZ'),
            updatedAt: new Date(o.updatedAt || o.createdAt).toLocaleDateString('uz-UZ')
          }));
          setOrders(mapped);
        }
      } catch (err) {
        console.warn('Buyurtmalarni yuklashda xatolik:', err);
      }
    };
    fetchOrders();
  }, []);

  // Statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;
  const inTransitOrders = orders.filter((o) => o.status === 'IN_TRANSIT' || o.status === 'ASSIGNED_TO_FLEET').length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((acc, curr) => acc + curr.finalAmount, 0);

  // Filter Data
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchesPayment = paymentFilter === 'ALL' || o.payment.status === paymentFilter;
    const matchesRegion = regionFilter === 'ALL' || o.deliveryRegion === regionFilter;
    return matchesStatus && matchesPayment && matchesRegion;
  });

  // Update order status
  const handleUpdateStatus = async (id: string, newStatus: OrderStatus, cancelReason?: string) => {
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setOrders((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          status: newStatus,
          cancelReason: cancelReason || item.cancelReason,
          updatedAt: dateStr
        };
      })
    );

    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              cancelReason: cancelReason || prev.cancelReason,
              updatedAt: dateStr
            }
          : null
      );
    }

    try {
      if (id && !id.startsWith('ord-')) {
        await apiClient.patch(`/orders/${id}/status`, {
          status: newStatus,
          reason: cancelReason
        });
      }
    } catch (err) {
      console.warn('Buyurtma statusini yangilashda xatolik:', err);
    }
  };

  const statusOptions = [
    { value: 'ALL', label: 'Barcha holatlar' },
    { value: 'PENDING', label: 'Kutilmoqda (PENDING)' },
    { value: 'CONFIRMED', label: 'Tasdiqlangan (CONFIRMED)' },
    { value: 'ASSIGNED_TO_FLEET', label: 'Texnika biriktirilgan' },
    { value: 'IN_TRANSIT', label: 'Yo‘lda (IN_TRANSIT)' },
    { value: 'DELIVERED', label: 'Yetkazildi (DELIVERED)' },
    { value: 'CANCELLED', label: 'Bekor qilingan (CANCELLED)' }
  ];

  const paymentOptions = [
    { value: 'ALL', label: 'Barcha to‘lovlar' },
    { value: 'PAID', label: 'To‘langan (PAID)' },
    { value: 'PENDING', label: 'Kutilmoqda (PENDING)' },
    { value: 'FAILED', label: 'To‘lanmagan (FAILED)' }
  ];

  const regionOptions = [
    { value: 'ALL', label: 'Barcha hududlar' },
    { value: 'Toshkent shahri', label: 'Toshkent shahri' },
    { value: 'Toshkent viloyati', label: 'Toshkent viloyati' },
    { value: 'Samarqand viloyati', label: 'Samarqand viloyati' },
    { value: 'Farg‘ona viloyati', label: 'Farg‘ona viloyati' }
  ];

  // Table Columns
  const columns: Column<OrderRecord>[] = [
    {
      key: 'orderNumber',
      header: 'Buyurtma & Sana',
      render: (row) => (
        <div>
          <div className="font-mono font-bold text-sm text-[var(--color-accent-blue)]">
            {row.orderNumber}
          </div>
          <div className="text-[11px] font-mono text-[var(--color-text-muted)] mt-0.5">
            {row.createdAt}
          </div>
        </div>
      )
    },
    {
      key: 'buyer',
      header: 'Buyurtmachi Korxona',
      render: (row) => (
        <div>
          <div className="font-bold text-xs text-[var(--color-text-primary)] flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" />
            <span className="line-clamp-1">{row.companyName}</span>
          </div>
          <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5 flex items-center gap-2">
            <span>{row.buyerName}</span>
            {row.buyerInn && <span className="font-mono">STIR: {row.buyerInn}</span>}
          </div>
        </div>
      )
    },
    {
      key: 'destination',
      header: 'Yetkazish Manzili & Transport',
      render: (row) => (
        <div>
          <div className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[var(--color-text-muted)] shrink-0" />
            <span>{row.deliveryRegion}, {row.deliveryDistrict}</span>
          </div>
          <div className="text-[11px] font-mono text-[var(--color-text-muted)] mt-0.5 flex items-center gap-1">
            <Truck className="w-3 h-3 text-[var(--color-accent-blue)]" />
            <span>{row.vehicleType}</span>
          </div>
        </div>
      )
    },
    {
      key: 'finalAmount',
      header: 'Jami Summa',
      render: (row) => (
        <div>
          <div className="font-mono font-bold text-xs text-[var(--color-text-primary)]">
            {row.finalAmount.toLocaleString()} so‘m
          </div>
          <div className="text-[10px] font-mono text-[var(--color-text-muted)] mt-0.5">
            {row.items.length} xil tovar
          </div>
        </div>
      )
    },
    {
      key: 'payment',
      header: 'To‘lov Holati',
      render: (row) => (
        <div>
          <StatusBadge status={row.payment.status} />
          <div className="text-[10px] font-mono text-[var(--color-text-muted)] mt-1">
            {row.payment.provider}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Buyurtma Holati',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      key: 'actions',
      header: 'Amallar',
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedOrder(row)}
            leftIcon={<Eye className="w-3.5 h-3.5" />}
          >
            Spetsifikatsiya
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Sahifa sarlavhasi */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Buyurtmalar & B2B Savdo Nazorati
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          B2B xaridlarning to‘liq hayotiy zanjiri, hisob-fakturalar va to‘lov monitoringi
        </p>
      </div>

      {/* KPI Kartochkalar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiStatCard
          title="Jami Buyurtmalar"
          value={totalOrders}
          icon={<ShoppingCart className="w-5 h-5" />}
          change="+2 ta yangi bugun"
          changeType="positive"
        />
        <KpiStatCard
          title="Kutilayotgan Arizalar"
          value={pendingOrders}
          icon={<Clock className="w-5 h-5" />}
          change="Tasdiqlash talab etiladi"
          changeType={pendingOrders > 0 ? 'neutral' : 'positive'}
        />
        <KpiStatCard
          title="Yo‘lda / Logistikada"
          value={inTransitOrders}
          icon={<Truck className="w-5 h-5" />}
          change="Avtopark yetkazmoqda"
          changeType="positive"
        />
        <KpiStatCard
          title="Jami Savdo Tushumi"
          value={`${(totalRevenue / 1_000_000).toFixed(1)} mln`}
          icon={<CreditCard className="w-5 h-5" />}
          change="To‘langan & tasdiqlangan"
          changeType="positive"
        />
      </div>

      {/* Jadvallar va Filtrlar */}
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={filteredOrders}
          searchPlaceholder="Buyurtma raqami, xaridor korxona, STIR yoki manzil bo‘yicha..."
          emptyTitle="Hech qanday buyurtma topilmadi"
          emptyDescription="Filtr parametrlarini o‘zgartiring yoki qidiruv so‘rovini tekshiring."
          actionsSlot={
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-48">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={statusOptions}
                />
              </div>
              <div className="w-44">
                <Select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  options={paymentOptions}
                />
              </div>
              <div className="w-44">
                <Select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  options={regionOptions}
                />
              </div>
            </div>
          }
        />
      </div>

      {/* Buyurtma Spetsifikatsiyasi va Holat boshqaruvi Drawer */}
      <OrderDetailDrawer
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};
