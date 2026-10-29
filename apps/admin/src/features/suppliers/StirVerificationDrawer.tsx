import React, { useState } from 'react';
import { SupplierCompany, MOCK_DSQ_DATABASE, DSQTaxpayerInfo } from '../../mocks/suppliersMock';
import { SlideOverDrawer } from '../../components/SlideOverDrawer';
import { Button } from '../../components/Button';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Building2,
  FileCheck2,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  BadgeCheck
} from 'lucide-react';

interface StirVerificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: SupplierCompany | null;
  onUpdateStatus: (id: string, newStatus: 'VERIFIED' | 'SUSPENDED' | 'PENDING', desc?: string) => void;
}

export const StirVerificationDrawer: React.FC<StirVerificationDrawerProps> = ({
  isOpen,
  onClose,
  supplier,
  onUpdateStatus
}) => {
  const [isCheckingDsq, setIsCheckingDsq] = useState(false);
  const [dsqData, setDsqData] = useState<DSQTaxpayerInfo | null>(null);
  const [hasCheckedDsq, setHasCheckedDsq] = useState(false);

  if (!supplier) return null;

  const handleCheckDsq = () => {
    setIsCheckingDsq(true);
    setTimeout(() => {
      const match = MOCK_DSQ_DATABASE[supplier.inn] || {
        inn: supplier.inn,
        companyName: supplier.companyName,
        director: supplier.director,
        address: supplier.address,
        status: 'ACTIVE',
        statusDescription: 'DSQ bazasidan topildi',
        vatPayer: supplier.vatPayer,
        vatRegCode: supplier.vatRegCode,
        registrationDate: supplier.registrationDate,
        taxDebtSum: 0
      };
      setDsqData(match);
      setIsCheckingDsq(false);
      setHasCheckedDsq(true);
    }, 700);
  };

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Ta’minotchi Yuridik Pasporti & STIR"
      subtitle={`STIR (INN): ${supplier.inn} • ${supplier.companyName}`}
      footer={
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 w-full">
          <div>
            <StatusBadge status={supplier.status} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {supplier.status === 'PENDING' && (
              <>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    onUpdateStatus(supplier.id, 'SUSPENDED', 'Moderator tomonidan rad etildi');
                    onClose();
                  }}
                  leftIcon={<XCircle className="w-4 h-4" />}
                >
                  Rad etish
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    onUpdateStatus(supplier.id, 'VERIFIED', 'STIR va E-IMZO to‘liq tasdiqlandi');
                    onClose();
                  }}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Tasdiqlash (VERIFIED)
                </Button>
              </>
            )}

            {supplier.status === 'VERIFIED' && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  onUpdateStatus(supplier.id, 'SUSPENDED', 'Faoliyati vaqtincha to‘xtatildi');
                  onClose();
                }}
                leftIcon={<AlertTriangle className="w-4 h-4" />}
              >
                Hamkorlikni To‘xtatish
              </Button>
            )}

            {supplier.status === 'SUSPENDED' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onUpdateStatus(supplier.id, 'VERIFIED', 'Qayta faollashtirildi');
                  onClose();
                }}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Qayta Faollashtirish
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Korxona Asosiy Ma'lumotlari */}
        <div className="p-4 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border-subtle)] space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[var(--color-accent-blue)]/15 text-[var(--color-accent-blue)]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                  {supplier.companyName}
                </h3>
                <div className="text-xs font-mono text-[var(--color-accent-blue)] mt-0.5">
                  STIR (INN): {supplier.inn}
                </div>
              </div>
            </div>
            {supplier.vatPayer && (
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[var(--color-accent-green)]/15 text-[var(--color-accent-green)] border border-[var(--color-accent-green)]/30">
                QQS To‘lovchi
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              <span className="font-semibold text-[var(--color-text-primary)]">Rahbar:</span>
              <span>{supplier.director}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              <Phone className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
              <span className="font-mono">{supplier.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              <MapPin className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
              <span>{supplier.region}, {supplier.address}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              <Calendar className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
              <span>Ro‘yxatdan o‘tgan: {supplier.registrationDate}</span>
            </div>
          </div>
        </div>

        {/* DSQ (Davlat Soliq Qo'mitasi) Bazasidan Jonli Tekshirish */}
        <div className="p-4 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-[var(--color-accent-blue)]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                Davlat Soliq Qo‘mitasi (DSQ) API Solishtiruvi
              </h4>
            </div>
            <Button
              variant="secondary"
              size="sm"
              isLoading={isCheckingDsq}
              onClick={handleCheckDsq}
              leftIcon={<RefreshCw className={`w-3 h-3 ${isCheckingDsq ? 'animate-spin' : ''}`} />}
            >
              DSQ dan Tekshirish
            </Button>
          </div>

          {hasCheckedDsq && dsqData ? (
            <div className="p-3 rounded-lg bg-[var(--color-surface-bg)] border border-[var(--color-border-subtle)] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">DSQ Yuridik Holati:</span>
                <span className="font-semibold text-[var(--color-accent-green)] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {dsqData.statusDescription}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">Soliq Qarzdorligi:</span>
                {dsqData.taxDebtSum > 0 ? (
                  <span className="font-mono font-bold text-[var(--color-accent-red)]">
                    {dsqData.taxDebtSum.toLocaleString()} so‘m (Mavjud!)
                  </span>
                ) : (
                  <span className="font-mono text-[var(--color-accent-green)]">
                    0 so‘m (Qarzdorlik yo‘q)
                  </span>
                )}
              </div>
              {dsqData.vatRegCode && (
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-secondary)]">QQS Ro‘yxat K审查:</span>
                  <span className="font-mono text-[var(--color-text-primary)]">{dsqData.vatRegCode}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-[var(--color-text-muted)]">
              Korxonaning soliq qarzdorligi, QQS sertifikati va amaldagi faolligini tekshirish uchun «DSQ dan Tekshirish» tugmasini bosing.
            </p>
          )}
        </div>

        {/* E-IMZO Shartnomasi va Raqamli Sertifikat */}
        <div className="p-4 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--color-accent-green)]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              E-IMZO Bosh Kelishuvi & PKCS#7 Sertifikati
            </h4>
          </div>

          <div className="p-3.5 rounded-lg bg-[var(--color-surface-bg)] border border-[var(--color-border-subtle)] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Shartnoma Raqami:</span>
              <span className="font-mono font-semibold text-[var(--color-text-primary)]">
                {supplier.contractNumber || 'Shartnoma kutilmoqda'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">E-IMZO Seriya Raqami:</span>
              <span className="font-mono text-[var(--color-accent-blue)]">
                {supplier.eimzoSerialNumber || 'Imzolanmagan'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Kripto Standart:</span>
              <span className="font-mono text-[var(--color-text-primary)]">O‘zDSt 1092:2009 (DSQ)</span>
            </div>
            {supplier.eimzoVerifiedAt && (
              <div className="flex items-center justify-between pt-1 border-t border-[var(--color-border-subtle)]">
                <span className="text-[var(--color-text-secondary)]">Imzolangan Sana:</span>
                <span className="font-mono text-[var(--color-accent-green)]">
                  {supplier.eimzoVerifiedAt}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Statistik Ko'rsatkichlar */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)]">
            <div className="text-xs text-[var(--color-text-muted)]">Nomenklatura Mahsulotlari</div>
            <div className="text-lg font-bold font-mono text-[var(--color-text-primary)] mt-1">
              {supplier.productsCount} turdagi tovar
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)]">
            <div className="text-xs text-[var(--color-text-muted)]">Jami B2B Aylanmasi</div>
            <div className="text-lg font-bold font-mono text-[var(--color-accent-blue)] mt-1">
              {supplier.totalTurnover.toLocaleString()} so‘m
            </div>
          </div>
        </div>
      </div>
    </SlideOverDrawer>
  );
};
