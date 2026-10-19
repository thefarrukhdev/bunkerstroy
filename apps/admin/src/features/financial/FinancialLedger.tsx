import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  RotateCcw,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building,
  FileSpreadsheet
} from 'lucide-react';
import { Card, Badge, Button } from '@bunkerstroy/ui';
import { PaymentMethod } from '@bunkerstroy/types';

export interface LedgerTransaction {
  id: string;
  trxNumber: string;
  type: 'INCOME' | 'EXPENSE' | 'REFUND';
  paymentMethod: PaymentMethod;
  amount: number;
  orderNumber: string;
  counterparty: string;
  description: string;
  status: 'COMPLETED' | 'PENDING' | 'REVERSED';
  createdAt: string;
}

const initialTransactions: LedgerTransaction[] = [
  {
    id: 'trx-1',
    trxNumber: 'TRX-2026-9041',
    type: 'INCOME',
    paymentMethod: 'PAYME',
    amount: 14500000,
    orderNumber: 'ORD-98421',
    counterparty: '«GOLDEN HOUSE CONSTRUCTION» MChJ',
    description: 'Portlendsement M500 partiyasi uchun to\'lov',
    status: 'COMPLETED',
    createdAt: '2026-10-19 17:42'
  },
  {
    id: 'trx-2',
    trxNumber: 'TRX-2026-9040',
    type: 'INCOME',
    paymentMethod: 'CLICK',
    amount: 6800000,
    orderNumber: 'ORD-98420',
    counterparty: 'Saidov Jamshid (Xususiy buyurtmachi)',
    description: 'Bazalt mineral paxta ESCO mahsulotlari',
    status: 'COMPLETED',
    createdAt: '2026-10-19 16:10'
  },
  {
    id: 'trx-3',
    trxNumber: 'TRX-2026-9039',
    type: 'EXPENSE',
    paymentMethod: 'BANK_TRANSFER',
    amount: 42000000,
    orderNumber: 'EXP-4410',
    counterparty: '«OG\'IR LOGISTIKA TRANS» MChJ',
    description: 'Toshkent - Samarqand 22t og\'ir yuk yetkazish xarajatlari',
    status: 'COMPLETED',
    createdAt: '2026-10-19 15:05'
  },
  {
    id: 'trx-4',
    trxNumber: 'TRX-2026-9038',
    type: 'INCOME',
    paymentMethod: 'BANK_TRANSFER',
    amount: 92000000,
    orderNumber: 'ORD-98415',
    counterparty: '«ORIENT GROUP STROY» QK MChJ',
    description: 'Armatura A500C 10 tonna ulgurji partiyasi',
    status: 'COMPLETED',
    createdAt: '2026-10-19 12:30'
  },
  {
    id: 'trx-5',
    trxNumber: 'TRX-2026-9037',
    type: 'REFUND',
    paymentMethod: 'PAYME',
    amount: 3200000,
    orderNumber: 'ORD-98402',
    counterparty: '«TOSHKENT CITY RESIDENCE»',
    description: 'Qaytgan tovar (brak g\'ishtlar partiyasi uchun kompensatsiya)',
    status: 'REVERSED',
    createdAt: '2026-10-19 11:15'
  },
  {
    id: 'trx-6',
    trxNumber: 'TRX-2026-9036',
    type: 'INCOME',
    paymentMethod: 'UZUM',
    amount: 8500000,
    orderNumber: 'ORD-98400',
    counterparty: '«MODERN STROY BIZNES» MChJ',
    description: 'Penopolistirol fasad plitalari buyurtmasi',
    status: 'COMPLETED',
    createdAt: '2026-10-18 18:00'
  }
];

export const FinancialLedger: React.FC = () => {
  const [transactions, setTransactions] = useState<LedgerTransaction[]>(initialTransactions);
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE' | 'REFUND' | 'ONLINE_PAY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Financial aggregates
  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME' && t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE' && t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunds = transactions
    .filter((t) => t.type === 'REFUND')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense - totalRefunds;

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.trxNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.counterparty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'ALL') return true;
    if (filterType === 'ONLINE_PAY') return t.paymentMethod === 'PAYME' || t.paymentMethod === 'CLICK' || t.paymentMethod === 'UZUM';
    return t.type === filterType;
  });

  const getMethodBadge = (method: PaymentMethod) => {
    switch (method) {
      case 'PAYME':
        return <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-sky-500/15 text-sky-400 border border-sky-500/30">PAYME</span>;
      case 'CLICK':
        return <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/30">CLICK</span>;
      case 'UZUM':
        return <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-purple-500/15 text-purple-400 border border-purple-500/30">UZUM</span>;
      case 'BANK_TRANSFER':
        return <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30">BANK O'TKAZMASI</span>;
      default:
        return <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#292C2F] text-[#B8B8B3]">{method}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 brushed-steel p-4 rounded-2xl border border-[#33373B]">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#FFB800]" />
            <h1 className="text-xl font-black uppercase tracking-wider text-[#F5F5F2]">
              Moliya &amp; Kirim-Chiqim Daftari (Financial Ledger)
            </h1>
          </div>
          <p className="text-xs text-[#B8B8B3] font-mono mt-0.5">
            B2B To'lov shlyuzlari, hisob-kitoblar va qaytgan tovarlar kassa jurnali
          </p>
        </div>

        <Button variant="secondary" size="sm" className="h-9">
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Hisobot (Excel / 1C)
        </Button>
      </div>

      {/* KPI Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card rivetAccents className="bg-[#1A1D20] border-[#33373B]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-[#B8B8B3]">Kassa Kirimi</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black font-mono text-emerald-400">
            +{totalIncome.toLocaleString('uz-UZ')} <span className="text-xs">UZS</span>
          </div>
          <div className="text-[11px] text-[#8E9094] font-mono mt-2">
            Buyurtmalar &amp; Payme/Click
          </div>
        </Card>

        <Card rivetAccents className="bg-[#1A1D20] border-[#33373B]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-[#B8B8B3]">Operatsion Chiqim</span>
            <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black font-mono text-red-400">
            -{totalExpense.toLocaleString('uz-UZ')} <span className="text-xs">UZS</span>
          </div>
          <div className="text-[11px] text-[#8E9094] font-mono mt-2">
            Logistika &amp; Ta'minot to'lovlari
          </div>
        </Card>

        <Card rivetAccents className="bg-[#1A1D20] border-[#33373B]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-[#B8B8B3]">Qaytgan Tovarlar</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black font-mono text-amber-400">
            {totalRefunds.toLocaleString('uz-UZ')} <span className="text-xs">UZS</span>
          </div>
          <div className="text-[11px] text-[#8E9094] font-mono mt-2">
            Kafolat &amp; Brak hisob-kitobi
          </div>
        </Card>

        <Card rivetAccents className="bg-[#1A1D20] border-[#33373B]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-[#B8B8B3]">Joriy Sof Balans</span>
            <div className="w-7 h-7 rounded-lg bg-[#FFB800]/10 text-[#FFB800] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black font-mono text-[#FFB800]">
            {netBalance.toLocaleString('uz-UZ')} <span className="text-xs">UZS</span>
          </div>
          <div className="text-[11px] text-[#8E9094] font-mono mt-2">
            Platforma hisob raqamida
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8E9094] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="TRX, Buyurtma, Kontragent..."
            className="w-full bg-[#1A1D20] border border-[#33373B] rounded-xl pl-10 pr-4 py-2 text-sm text-[#F5F5F2] placeholder-[#8E9094] focus:outline-none focus:border-[#FFB800]"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto">
          {(
            [
              { id: 'ALL', label: 'Barchasi' },
              { id: 'INCOME', label: 'Kirimlar' },
              { id: 'EXPENSE', label: 'Chiqimlar' },
              { id: 'ONLINE_PAY', label: 'Payme / Click' },
              { id: 'REFUND', label: 'Qaytgan tovarlar' }
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setFilterType(t.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                filterType === t.id
                  ? 'bg-[#FFB800] text-[#151719] border-[#FFB800]'
                  : 'bg-[#1A1D20] text-[#B8B8B3] border-[#33373B] hover:text-[#F5F5F2]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <Card className="p-0 overflow-hidden border-[#33373B] bg-[#1A1D20]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#33373B] bg-[#151719] text-[11px] font-mono uppercase tracking-wider text-[#B8B8B3]">
                <th className="py-3 px-4">TRX ID &amp; Sana</th>
                <th className="py-3 px-4">Turi</th>
                <th className="py-3 px-4">To'lov Tizimi</th>
                <th className="py-3 px-4">Kontragent / Buyurtma</th>
                <th className="py-3 px-4 text-right">Summa (UZS)</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#33373B]/60 text-sm">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#8E9094] font-mono text-xs">
                    Hech qanday tranzaksiya topilmadi
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-[#222528]/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-xs text-[#FFB800]">
                        {t.trxNumber}
                      </div>
                      <div className="text-[11px] text-[#8E9094] font-mono flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {t.createdAt}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {t.type === 'INCOME' && <Badge variant="success">Kirim</Badge>}
                      {t.type === 'EXPENSE' && <Badge variant="danger">Chiqim</Badge>}
                      {t.type === 'REFUND' && <Badge variant="warning">Vozvrat</Badge>}
                    </td>

                    <td className="py-3.5 px-4">
                      {getMethodBadge(t.paymentMethod)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-xs text-[#F5F5F2] max-w-[240px] truncate">
                        {t.counterparty}
                      </div>
                      <div className="text-[11px] text-[#8E9094] font-mono">
                        {t.orderNumber} • {t.description}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-sm">
                      {t.type === 'INCOME' && (
                        <span className="text-emerald-400">
                          +{t.amount.toLocaleString('uz-UZ')} UZS
                        </span>
                      )}
                      {t.type === 'EXPENSE' && (
                        <span className="text-red-400">
                          -{t.amount.toLocaleString('uz-UZ')} UZS
                        </span>
                      )}
                      {t.type === 'REFUND' && (
                        <span className="text-amber-400">
                          -{t.amount.toLocaleString('uz-UZ')} UZS
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {t.status === 'COMPLETED' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Bajarildi
                        </span>
                      )}
                      {t.status === 'REVERSED' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400">
                          <RotateCcw className="w-3.5 h-3.5" />
                          Qaytarilgan
                        </span>
                      )}
                      {t.status === 'PENDING' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-sky-400">
                          <Clock className="w-3.5 h-3.5" />
                          Kutilmoqda
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
