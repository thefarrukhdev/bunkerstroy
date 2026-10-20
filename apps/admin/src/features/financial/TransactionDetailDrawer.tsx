import React from 'react';
import { LedgerTransactionItem } from '../../mocks/financialMock';
import { SlideOverDrawer } from '../../components/SlideOverDrawer';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import {
  CreditCard,
  Building2,
  Calendar,
  CheckCircle2,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Clock,
  ShieldCheck,
  Receipt
} from 'lucide-react';

interface TransactionDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: LedgerTransactionItem | null;
}

export const TransactionDetailDrawer: React.FC<TransactionDetailDrawerProps> = ({
  isOpen,
  onClose,
  transaction
}) => {
  if (!transaction) return null;

  const isIncome = transaction.type === 'INCOME';

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Tranzaksiya ${transaction.trxNumber}`}
      subtitle={`Qayd etilgan vaqt: ${transaction.createdAt}`}
      footer={
        <div className="flex items-center justify-between w-full">
          <div>
            <StatusBadge status={transaction.status} />
          </div>
          <Button
            variant="secondary"
            size="md"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => alert(`Kassa cheki (${transaction.trxNumber}) PDF formatida yuklab olinmoqda.`)}
          >
            Chekni Yuklab Olish
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Summa kartochkasi */}
        <div className="p-5 rounded-2xl bg-[var(--color-surface-hover)] border border-[var(--color-border-subtle)] text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div
              className={`p-2 rounded-xl ${
                isIncome
                  ? 'bg-[var(--color-accent-green)]/15 text-[var(--color-accent-green)]'
                  : 'bg-[var(--color-accent-red)]/15 text-[var(--color-accent-red)]'
              }`}
            >
              {isIncome ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
            </div>
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              {transaction.typeLabel}
            </span>
          </div>

          <div className="text-3xl font-black font-mono tracking-tight text-[var(--color-text-primary)]">
            {isIncome ? '+' : '-'}{transaction.amount.toLocaleString()} so‘m
          </div>

          <div className="text-xs font-mono text-[var(--color-text-muted)] flex items-center justify-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" />
            <span>To‘lov shlyuzi: {transaction.paymentMethod}</span>
          </div>
        </div>

        {/* Kontragent va Buyurtma Rekvizitlari */}
        <div className="p-4 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[var(--color-accent-blue)]" />
            <span>Kontragent & Tranzaksiya Maqsadi</span>
          </h4>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Kontragent Korxona:</span>
              <span className="font-sans font-semibold text-[var(--color-text-primary)] text-right">
                {transaction.counterparty}
              </span>
            </div>
            {transaction.counterpartyInn && (
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">STIR (INN):</span>
                <span className="text-[var(--color-accent-blue)] font-bold">
                  {transaction.counterpartyInn}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Bog‘langan Hujjat / Buyurtma:</span>
              <span className="text-[var(--color-text-primary)] font-bold">
                {transaction.orderNumber}
              </span>
            </div>
            <div className="pt-2 border-t border-[var(--color-border-subtle)]">
              <span className="text-[var(--color-text-secondary)] block mb-1">To‘lov maqsadi:</span>
              <p className="font-sans text-[var(--color-text-primary)] leading-relaxed">
                {transaction.description}
              </p>
            </div>
          </div>
        </div>

        {/* Kassa va Fiskal Xavfsizlik Nishoni */}
        <div className="p-4 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border-subtle)] flex items-start gap-3">
          <Receipt className="w-5 h-5 text-[var(--color-accent-green)] shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-semibold text-[var(--color-text-primary)]">
              Fiskal Ro‘yxatdan O‘tgan Elektron Kassa Hujjati
            </div>
            <p className="text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
              Ushbu tranzaksiya Davlat Soliq Qo‘mitasi fiskal moduliga avtomatik qayd etilgan va B2B buxgalteriya balansi bilan to‘liq muvofiqlashtirilgan.
            </p>
          </div>
        </div>
      </div>
    </SlideOverDrawer>
  );
};
