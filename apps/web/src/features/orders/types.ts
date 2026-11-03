import { Order } from '@bunkerstroy/types';

export interface PaymentModalState {
  isOpen: boolean;
  order: Order | null;
  provider: 'PAYME' | 'CLICK';
}

export interface DisputeModalState {
  isOpen: boolean;
  orderId: string | null;
  orderNumber: string | null;
  reason: string;
  evidenceUrl: string;
}
