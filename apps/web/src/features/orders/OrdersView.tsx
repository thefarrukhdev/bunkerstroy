import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, Truck, MapPin } from 'lucide-react';
import { Order } from '@bunkerstroy/types';
import { Badge, Card } from '@bunkerstroy/ui';

export const OrdersView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('bunkerstroy_token') : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch('/api/orders', { headers })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#33373B]">
        <div>
          <h2 className="text-xl font-black text-[#F5F5F2]">Buyurtmalar Tarixi va Statusi</h2>
          <p className="text-xs text-[#B8B8B3]">Barcha buyurtmalar va transport jo‘natmalarining holati</p>
        </div>
        <Badge variant="warning">{orders.length} ta buyurtma</Badge>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#B8B8B3] font-mono text-sm">
          Buyurtmalar yuklanmoqda...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#33373B] rounded-3xl space-y-3 text-[#B8B8B3]">
          <Package className="w-10 h-10 mx-auto text-[#FFB800]/50" />
          <p className="text-sm font-semibold text-[#F5F5F2]">Hozircha buyurtmalar mavjud emas</p>
          <p className="text-xs">Marketplacedan kerakli mollarni savatga qo'shing va buyurtma bering.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Card key={o.id} className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#33373B]">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#FFB800]" />
                  <span className="font-bold text-[#F5F5F2] font-mono">{o.orderNumber}</span>
                  <span className="text-xs text-[#777A7C] font-mono">({new Date(o.createdAt).toLocaleDateString()})</span>
                </div>
                <Badge variant={o.status === 'DELIVERED' ? 'success' : 'warning'}>
                  {o.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#B8B8B3]">
                <div>
                  <span className="text-[#777A7C] block uppercase font-mono text-[10px]">Qabul qiluvchi:</span>
                  <p className="font-semibold text-[#F5F5F2]">{o.buyerName}</p>
                  <p>{o.buyerPhone}</p>
                </div>

                <div>
                  <span className="text-[#777A7C] block uppercase font-mono text-[10px]">Yetkazish manzili:</span>
                  <p className="font-semibold text-[#F5F5F2]">{o.deliveryAddress.region}, {o.deliveryAddress.district}</p>
                  <p>{o.deliveryAddress.street || 'Markaz'}</p>
                </div>

                <div>
                  <span className="text-[#777A7C] block uppercase font-mono text-[10px]">Jami to'lov:</span>
                  <p className="text-base font-black text-[#FFB800] font-mono">
                    {Number(o.finalAmount).toLocaleString()} so'm
                  </p>
                  <p className="text-[11px] text-emerald-400 font-mono">{o.paymentMethod}</p>
                </div>
              </div>

              <div className="bg-[#151719] p-3 rounded-xl space-y-1.5 border border-[#33373B]">
                {o.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-[#F5F5F2]">{item.productTitle} x {item.quantity} {item.unit}</span>
                    <span className="font-mono text-[#B8B8B3]">{Number(item.totalPrice).toLocaleString()} so'm</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
