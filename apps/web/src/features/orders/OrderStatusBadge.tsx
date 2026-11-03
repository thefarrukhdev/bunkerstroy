import React from 'react';
import { OrderStatus } from '@bunkerstroy/types';
import { Badge } from '@bunkerstroy/ui';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'DRAFT':
      return <Badge variant="neutral">SAVATDA</Badge>;
    case 'PENDING_PAYMENT':
    case 'PENDING':
      return <Badge variant="warning">TO‘LOV KUTILMOQDA</Badge>;
    case 'PAID':
    case 'CONFIRMED':
      return <Badge variant="info">TO‘LANDI (TASDIQLANDI)</Badge>;
    case 'ACCEPTED':
      return <Badge variant="info">TA‘MINOTCHI TASDIQLADI</Badge>;
    case 'PACKING':
      return <Badge variant="warning">YIG‘ILMOQDA (OMBORDA)</Badge>;
    case 'ASSIGNED':
    case 'ASSIGNED_TO_FLEET':
      return <Badge variant="purple">HAYDOVCHI TAYINLANDI</Badge>;
    case 'IN_TRANSIT':
      return <Badge variant="purple">🚚 YO‘LDA</Badge>;
    case 'ARRIVED':
      return <Badge variant="brand">MANZILGA YETDI</Badge>;
    case 'FULLY_PAID':
      return <Badge variant="success">TO‘LIQ TO‘LANDI</Badge>;
    case 'RECEIVED':
    case 'DELIVERED':
      return <Badge variant="success">QABUL QILINDI</Badge>;
    case 'COMPLETED':
      return <Badge variant="success">YAKUNLANDI (ESCROW AJRATILDI)</Badge>;
    case 'DISPUTE':
      return <Badge variant="error">OCHIQ NIZO (DISPUTE)</Badge>;
    case 'CANCELLED':
      return <Badge variant="neutral">BEKOR QILINGAN</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};
