export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'ASSIGNED_TO_FLEET'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PAID' | 'PREAUTHORIZED' | 'PENDING' | 'FAILED';

export type PaymentMethod = 'PAYME' | 'CLICK' | 'BANK_TRANSFER' | 'CASH';

export interface OrderItemDetail {
  id: string;
  productId: string;
  productTitle: string;
  sku: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderPaymentInfo {
  provider: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  buyerName: string;
  buyerPhone: string;
  buyerInn?: string;
  companyName: string;
  deliveryRegion: string;
  deliveryDistrict: string;
  deliveryAddress: string;
  vehicleType: string;
  items: OrderItemDetail[];
  totalAmount: number;
  deliveryFee: number;
  discountAmount: number;
  finalAmount: number;
  status: OrderStatus;
  payment: OrderPaymentInfo;
  createdAt: string;
  updatedAt: string;
  cancelReason?: string;
}

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ord-1',
    orderNumber: '#ORD-9021',
    buyerName: 'Azizov Jahongir',
    buyerPhone: '+998901112233',
    buyerInn: '308112233',
    companyName: '«GOLDEN HOUSE STROY» MChJ',
    deliveryRegion: 'Toshkent shahri',
    deliveryDistrict: 'Yunusobod tumani',
    deliveryAddress: 'Amir Temur shoh ko‘chasi 107',
    vehicleType: 'DUMP_TRUCK_SAMOSVAL',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        productTitle: 'Portlendsement M500 D0 (Bekobod)',
        sku: 'CEM-M500-QOP',
        unit: 'qop (50 kg)',
        unitPrice: 68000,
        quantity: 200,
        totalPrice: 13600000
      },
      {
        id: 'item-2',
        productId: 'prod-2',
        productTitle: 'Armatura A500C Ø12 mm',
        sku: 'ARM-A500C-D12',
        unit: 'tonna',
        unitPrice: 9200000,
        quantity: 2,
        totalPrice: 18400000
      }
    ],
    totalAmount: 32000000,
    deliveryFee: 1200000,
    discountAmount: 0,
    finalAmount: 33200000,
    status: 'IN_TRANSIT',
    payment: {
      provider: 'BANK_TRANSFER',
      status: 'PAID',
      transactionId: 'TX-INV-88192',
      paidAt: '2026-10-20 09:15'
    },
    createdAt: '2026-10-20 08:30',
    updatedAt: '2026-10-20 11:20'
  },
  {
    id: 'ord-2',
    orderNumber: '#ORD-9022',
    buyerName: 'Karimov Jamshid',
    buyerPhone: '+998934445566',
    buyerInn: '302998877',
    companyName: '«SAMARQAND CITY BUILD» XK',
    deliveryRegion: 'Samarqand viloyati',
    deliveryDistrict: 'Samarqand shahri',
    deliveryAddress: 'Universitet xiyoboni 14',
    vehicleType: 'CONCRETE_MIXER',
    items: [
      {
        id: 'item-3',
        productId: 'prod-5',
        productTitle: 'Tayyor Tovar Beton M350 B25',
        sku: 'BET-M350-B25',
        unit: 'm³',
        unitPrice: 520000,
        quantity: 24,
        totalPrice: 12480000
      }
    ],
    totalAmount: 12480000,
    deliveryFee: 800000,
    discountAmount: 0,
    finalAmount: 13280000,
    status: 'CONFIRMED',
    payment: {
      provider: 'PAYME',
      status: 'PAID',
      transactionId: 'PAYME-991208',
      paidAt: '2026-10-20 13:40'
    },
    createdAt: '2026-10-20 13:10',
    updatedAt: '2026-10-20 13:45'
  },
  {
    id: 'ord-3',
    orderNumber: '#ORD-9023',
    buyerName: 'Rustamov Bobur',
    buyerPhone: '+998977771122',
    buyerInn: '301554433',
    companyName: '«TOSHKENT MODERN QURILISH» MChJ',
    deliveryRegion: 'Toshkent viloyati',
    deliveryDistrict: 'Qibray tumani',
    deliveryAddress: 'Baynalmilal ko‘chasi 2',
    vehicleType: 'DUMP_TRUCK_SAMOSVAL',
    items: [
      {
        id: 'item-4',
        productId: 'prod-4',
        productTitle: 'Avtoklav Gazoblok D500 (600x300x200 mm)',
        sku: 'GAZO-D500-600',
        unit: 'm³',
        unitPrice: 680000,
        quantity: 30,
        totalPrice: 20400000
      }
    ],
    totalAmount: 20400000,
    deliveryFee: 1100000,
    discountAmount: 500000,
    finalAmount: 21000000,
    status: 'PENDING',
    payment: {
      provider: 'CLICK',
      status: 'PENDING'
    },
    createdAt: '2026-10-20 14:05',
    updatedAt: '2026-10-20 14:05'
  },
  {
    id: 'ord-4',
    orderNumber: '#ORD-9024',
    buyerName: 'Yoqubov Dilshod',
    buyerPhone: '+998998889900',
    companyName: '«CHILONZOR B2B SERVIS» MChJ',
    deliveryRegion: 'Toshkent shahri',
    deliveryDistrict: 'Chilonzor tumani',
    deliveryAddress: 'Qatortol 23-bino',
    vehicleType: 'GAZEL_LIGHT_TRUCK',
    items: [
      {
        id: 'item-5',
        productId: 'prod-3',
        productTitle: 'Bazalt Mineral Paxta Plitasi 100 mm (ESCO)',
        sku: 'ESCO-MINVATA-100',
        unit: 'm²',
        unitPrice: 85000,
        quantity: 120,
        totalPrice: 10200000
      }
    ],
    totalAmount: 10200000,
    deliveryFee: 450000,
    discountAmount: 0,
    finalAmount: 10650000,
    status: 'DELIVERED',
    payment: {
      provider: 'BANK_TRANSFER',
      status: 'PAID',
      transactionId: 'TX-INV-88150',
      paidAt: '2026-10-19 10:00'
    },
    createdAt: '2026-10-19 09:20',
    updatedAt: '2026-10-19 16:30'
  },
  {
    id: 'ord-5',
    orderNumber: '#ORD-9025',
    buyerName: 'Sobirov Ulug‘bek',
    buyerPhone: '+998912223344',
    companyName: '«YANGI HAYOT INVEST» MChJ',
    deliveryRegion: 'Farg‘ona viloyati',
    deliveryDistrict: 'Qo‘qon shahri',
    deliveryAddress: 'G‘ishtko‘prik 8',
    vehicleType: 'DUMP_TRUCK_SAMOSVAL',
    items: [
      {
        id: 'item-6',
        productId: 'prod-6',
        productTitle: 'Pishgan Qizil G‘isht M100',
        sku: 'GISHT-PISHGAN-M100',
        unit: 'dona',
        unitPrice: 1100,
        quantity: 15000,
        totalPrice: 16500000
      }
    ],
    totalAmount: 16500000,
    deliveryFee: 1500000,
    discountAmount: 0,
    finalAmount: 18000000,
    status: 'CANCELLED',
    cancelReason: 'Buyurtmachi to‘lov muddatini kechiktirdi va shartnomani bekor qildi.',
    payment: {
      provider: 'BANK_TRANSFER',
      status: 'FAILED'
    },
    createdAt: '2026-10-18 11:00',
    updatedAt: '2026-10-18 15:45'
  }
];
