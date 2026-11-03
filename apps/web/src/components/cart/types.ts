import { Product } from '@bunkerstroy/types';

export interface ConstructionSite {
  id: string;
  name: string;
  region: string;
  district: string;
  street: string;
  landmark: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CurrentUserProfile {
  stir?: string;
  companyName?: string;
  displayName?: string;
  email?: string;
  role?: string;
  phone?: string;
  [key: string]: any;
}

export type CheckoutStep = 1 | 2 | 'success';

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
  onOrderSuccess: () => void;
  currentUser?: CurrentUserProfile | null;
}
