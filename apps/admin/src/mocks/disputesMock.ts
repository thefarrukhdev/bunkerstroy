export type DisputeStatus =
  | 'OPEN'
  | 'INVESTIGATING'
  | 'RESOLVED_REFUND'
  | 'RESOLVED_REPLACE'
  | 'REJECTED';

export type DisputeReason =
  | 'DAMAGED_CARGO'
  | 'QUANTITY_MISMATCH'
  | 'QUALITY_ISSUE'
  | 'LATE_DELIVERY'
  | 'PAYMENT_DISPUTE';

export interface DisputeRecord {
  id: string;
  disputeNumber: string;
  orderNumber: string;
  clientCompanyName: string;
  clientPhone: string;
  supplierName: string;
  driverName: string;
  driverPhone: string;
  reason: DisputeReason;
  reasonLabel: string;
  claimAmount: number;
  evidencePhotos: string[];
  evidenceNotes: string;
  status: DisputeStatus;
  operatorNotes?: string;
  resolutionDecision?: string;
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_DISPUTES: DisputeRecord[] = [
  {
    id: 'disp-101',
    disputeNumber: 'DISP-2026-0042',
    orderNumber: '#ORD-9021',
    clientCompanyName: '«GOLDEN HOUSE STROY» MChJ',
    clientPhone: '+998 90 111 22 33',
    supplierName: '«TOSHKENT G‘ISHT VA SEMENT SERVIS» MChJ',
    driverName: 'Sodiqov Murod',
    driverPhone: '+998 90 111 44 55',
    reason: 'DAMAGED_CARGO',
    reasonLabel: 'Yuk shikastlanishi (Qoplar yirtilishi)',
    claimAmount: 1650000,
    evidencePhotos: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80'
    ],
    evidenceNotes:
      'Tushirish paytida 15 ta sement qopi pastki burchakdan yirtilib, mahsulot to‘kilgan. Dalolatnoma ob‘ekt kran operatori tomonidan tuzildi.',
    status: 'OPEN',
    createdAt: '2026-10-24 11:20',
    updatedAt: '2026-10-24 11:45'
  },
  {
    id: 'disp-102',
    disputeNumber: 'DISP-2026-0039',
    orderNumber: '#ORD-9018',
    clientCompanyName: '«SAMARQAND CITY BUILD» XK',
    clientPhone: '+998 91 222 33 44',
    supplierName: '«BEKOBOD METALL INVEST» AJ',
    driverName: 'Qodirov Rustam',
    driverPhone: '+998 90 844 32 10',
    reason: 'QUANTITY_MISMATCH',
    reasonLabel: 'Mahsulot kamomadi (Tonnaj yetishmasligi)',
    claimAmount: 3400000,
    evidencePhotos: [
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80'
    ],
    evidenceNotes:
      'Avtotarozi ko‘rsatkichi bo‘yicha 20t o‘rniga 19.3t armatura yetib kelgan. 700 kg kamomad qayd etildi.',
    status: 'INVESTIGATING',
    operatorNotes: 'Zavod og‘irlik tarozisi xronometraji tekshirilmoqda.',
    createdAt: '2026-10-23 16:10',
    updatedAt: '2026-10-24 09:30'
  },
  {
    id: 'disp-103',
    disputeNumber: 'DISP-2026-0035',
    orderNumber: '#ORD-8994',
    clientCompanyName: '«MODERN ARCHITECTURE GROUP» MChJ',
    clientPhone: '+998 93 555 66 77',
    supplierName: '«ANDIJON AVTOBETON SERVIS» MChJ',
    driverName: 'Aliyev Botir',
    driverPhone: '+998 97 777 88 99',
    reason: 'LATE_DELIVERY',
    reasonLabel: 'Reys kechikishi (Beton quyish muddati buzilishi)',
    claimAmount: 2200000,
    evidencePhotos: [],
    evidenceNotes:
      'Beton mikseri 3.5 soatga kech yetib kelgani sababli quyish grafigi buzildi. Kompensatsiya talab qilinmoqda.',
    status: 'RESOLVED_REFUND',
    resolutionDecision:
      'Logistika depozitidan 1 800 000 so‘m xaridor hisobiga jarima sifatida qaytarildi. Ta‘minotchi bilan kelishildi.',
    operatorNotes: 'Yopilgan.',
    createdAt: '2026-10-22 14:00',
    updatedAt: '2026-10-23 10:15'
  }
];
