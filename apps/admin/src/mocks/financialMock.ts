export type TransactionType = 'INCOME' | 'OUTFLOW' | 'LOGISTICS_FEE' | 'REFUND';

export type PaymentGateway = 'PAYME' | 'CLICK' | 'BANK_TRANSFER' | 'CASH';

export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'REVERSED';

export interface LedgerTransactionItem {
  id: string;
  trxNumber: string;
  type: TransactionType;
  typeLabel: string;
  paymentMethod: PaymentGateway;
  amount: number;
  orderNumber: string;
  counterparty: string;
  counterpartyInn?: string;
  description: string;
  status: TransactionStatus;
  receiptUrl?: string;
  createdAt: string;
}

export interface ReconciliationReport {
  id: string;
  companyName: string;
  inn: string;
  period: string;
  openingBalance: number;
  debitTurnover: number;
  creditTurnover: number;
  closingBalance: number;
  generatedAt: string;
}

export const INITIAL_TRANSACTIONS: LedgerTransactionItem[] = [
  {
    id: 'trx-1',
    trxNumber: 'TRX-2026-9041',
    type: 'INCOME',
    typeLabel: 'B2B Savdo Tushumi',
    paymentMethod: 'PAYME',
    amount: 14500000,
    orderNumber: '#ORD-9021',
    counterparty: '«GOLDEN HOUSE STROY» MChJ',
    counterpartyInn: '308112233',
    description: 'Portlendsement M500 200 qop partiyasi to‘lovi',
    status: 'COMPLETED',
    createdAt: '2026-10-20 09:15'
  },
  {
    id: 'trx-2',
    trxNumber: 'TRX-2026-9040',
    type: 'INCOME',
    typeLabel: 'B2B Savdo Tushumi',
    paymentMethod: 'CLICK',
    amount: 13280000,
    orderNumber: '#ORD-9022',
    counterparty: '«SAMARQAND CITY BUILD» XK',
    counterpartyInn: '302998877',
    description: 'Tayyor Tovar Beton M350 24m³ uchun to‘lov',
    status: 'COMPLETED',
    createdAt: '2026-10-20 13:40'
  },
  {
    id: 'trx-3',
    trxNumber: 'TRX-2026-9039',
    type: 'OUTFLOW',
    typeLabel: 'Zavodga To‘lov',
    paymentMethod: 'BANK_TRANSFER',
    amount: 42000000,
    orderNumber: 'SUPP-PAY-104',
    counterparty: '«TOSHKENT G‘ISHT VA SEMENT SERVIS» MChJ',
    counterpartyInn: '201122334',
    description: 'Ulgurji sement zaxirasini to‘ldirish shartnomasi',
    status: 'COMPLETED',
    createdAt: '2026-10-20 11:30'
  },
  {
    id: 'trx-4',
    trxNumber: 'TRX-2026-9038',
    type: 'LOGISTICS_FEE',
    typeLabel: 'Transport Xarajati',
    paymentMethod: 'BANK_TRANSFER',
    amount: 1200000,
    orderNumber: '#ORD-9021',
    counterparty: 'BunkerStroy Avtopark Parki (HOWO 25t)',
    description: 'Toshkent sh., Yunusobod yo‘nalishida 38.5 km yuk yetkazish',
    status: 'COMPLETED',
    createdAt: '2026-10-20 10:00'
  },
  {
    id: 'trx-5',
    trxNumber: 'TRX-2026-9037',
    type: 'INCOME',
    typeLabel: 'B2B Savdo Tushumi',
    paymentMethod: 'BANK_TRANSFER',
    amount: 10650000,
    orderNumber: '#ORD-9024',
    counterparty: '«CHILONZOR B2B SERVIS» MChJ',
    counterpartyInn: '305544112',
    description: 'Bazalt Mineral Paxta 120m² (ESCO)',
    status: 'COMPLETED',
    createdAt: '2026-10-19 10:00'
  },
  {
    id: 'trx-6',
    trxNumber: 'TRX-2026-9036',
    type: 'REFUND',
    typeLabel: 'Mablag‘ Qaytarish',
    paymentMethod: 'BANK_TRANSFER',
    amount: 2500000,
    orderNumber: '#ORD-9019',
    counterparty: '«YANGI HAYOT INVEST» MChJ',
    counterpartyInn: '304499118',
    description: 'Ortiqcha to‘langan avans mablag‘ining qaytarilishi',
    status: 'COMPLETED',
    createdAt: '2026-10-19 15:45'
  },
  {
    id: 'trx-7',
    trxNumber: 'TRX-2026-9035',
    type: 'INCOME',
    typeLabel: 'B2B Savdo Tushumi',
    paymentMethod: 'CLICK',
    amount: 21000000,
    orderNumber: '#ORD-9023',
    counterparty: '«TOSHKENT MODERN QURILISH» MChJ',
    counterpartyInn: '301554433',
    description: 'Avtoklav Gazoblok D500 30m³ avans to‘lovi',
    status: 'PENDING',
    createdAt: '2026-10-20 14:05'
  }
];

export const INITIAL_RECONCILIATIONS: ReconciliationReport[] = [
  {
    id: 'rec-1',
    companyName: '«TOSHKENT G‘ISHT VA SEMENT SERVIS» MChJ',
    inn: '201122334',
    period: '2026-yil 3-chorak (Iyul - Sentyabr)',
    openingBalance: 0,
    debitTurnover: 480000000,
    creditTurnover: 438000000,
    closingBalance: 42000000,
    generatedAt: '2026-10-01'
  },
  {
    id: 'rec-2',
    companyName: '«BEKOBOD METALL INVEST» AJ Dileri',
    inn: '200889912',
    period: '2026-yil 3-chorak (Iyul - Sentyabr)',
    openingBalance: 12000000,
    debitTurnover: 520000000,
    creditTurnover: 532000000,
    closingBalance: 0,
    generatedAt: '2026-10-01'
  }
];
