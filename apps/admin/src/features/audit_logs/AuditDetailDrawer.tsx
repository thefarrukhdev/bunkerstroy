import React from 'react';
import { AuditLogRecord } from '../../mocks/auditLogsMock';
import { SlideOverDrawer } from '../../components/SlideOverDrawer';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { maskPhone, maskInn } from '../../utils/security';
import {
  ShieldAlert,
  Clock,
  User,
  Globe,
  Terminal,
  Copy,
  CheckCircle2,
  FileCode2,
  Cpu
} from 'lucide-react';

interface AuditDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  log: AuditLogRecord | null;
  maskPii: boolean;
}

export const AuditDetailDrawer: React.FC<AuditDetailDrawerProps> = ({
  isOpen,
  onClose,
  log,
  maskPii
}) => {
  if (!log) return null;

  const displayPhone = log.actorPhone
    ? maskPii
      ? maskPhone(log.actorPhone)
      : log.actorPhone
    : '—';

  const displayInn = log.actorInn
    ? maskPii
      ? maskInn(log.actorInn)
      : log.actorInn
    : undefined;

  const handleCopyPayload = () => {
    if (log.payloadJson) {
      navigator.clipboard.writeText(JSON.stringify(log.payloadJson, null, 2));
      alert('Kiberxavfsizlik payload ma’lumotlari clipboardga nusxalandi.');
    }
  };

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Xavfsizlik Qaydi #${log.id}`}
      subtitle={`Qayd vaqti: ${log.timestamp} • ${log.actionName}`}
      footer={
        <div className="flex items-center justify-between w-full">
          <div>
            <StatusBadge status={log.level} />
          </div>
          <Button
            variant="secondary"
            size="md"
            leftIcon={<Copy className="w-4 h-4" />}
            onClick={handleCopyPayload}
          >
            Payloadni Nusxalash
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Hodisa Sarlavhasi Kartochkasi */}
        <div className="p-4 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border-subtle)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-accent-blue)]">
              Kategoriya: {log.category}
            </span>
            <span className="text-xs font-mono text-[var(--color-text-muted)]">
              {log.timestamp}
            </span>
          </div>

          <h3 className="text-base font-bold text-[var(--color-text-primary)]">
            {log.actionName}
          </h3>

          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            {log.details}
          </p>
        </div>

        {/* Bajaruvchi Shaxs (Actor) Ma'lumotlari */}
        <div className="p-4 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--color-accent-blue)]" />
            <span>Ijrochi Ma’mur / Tizim Foydalanuvchisi</span>
          </h4>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Ism-sharif:</span>
              <span className="font-sans font-semibold text-[var(--color-text-primary)]">
                {log.actorName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">RBAC Huquq Roli:</span>
              <span className="px-2 py-0.5 rounded bg-[var(--color-surface-hover)] border border-[var(--color-border-subtle)] text-[var(--color-accent-blue)] font-bold">
                {log.actorRole}
              </span>
            </div>
            {displayInn && (
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">STIR (INN):</span>
                <span className="text-[var(--color-text-primary)] font-bold">
                  {displayInn} {maskPii && <span className="text-[10px] text-[var(--color-text-muted)] font-sans">(niqoblangan)</span>}
                </span>
              </div>
            )}
            {log.actorPhone && (
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">Telefon:</span>
                <span className="text-[var(--color-text-primary)]">
                  {displayPhone} {maskPii && <span className="text-[10px] text-[var(--color-text-muted)] font-sans">(niqoblangan)</span>}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tarmoq & Qurilma Ma'lumotlari (Network Telemetry) */}
        <div className="p-4 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[var(--color-accent-green)]" />
            <span>Tarmoq & Kiberxavfsizlik Telemetriyasi</span>
          </h4>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Manba IP Manzili:</span>
              <span className="px-2 py-0.5 rounded bg-[var(--color-surface-bg)] border border-[var(--color-border-subtle)] text-[var(--color-accent-green)] font-bold">
                {log.ipAddress}
              </span>
            </div>
            <div>
              <span className="text-[var(--color-text-secondary)] block mb-1">Mijoz Brauzeri (User Agent):</span>
              <div className="p-2.5 rounded-lg bg-[var(--color-surface-bg)] border border-[var(--color-border-subtle)] text-[11px] text-[var(--color-text-muted)] break-all leading-relaxed">
                {log.userAgent}
              </div>
            </div>
          </div>
        </div>

        {/* JSON Payload (Terminal) */}
        {log.payloadJson && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[var(--color-accent-yellow)]" />
                <span>Texnik Payload / Audit Tafsiloti (JSON)</span>
              </div>
              <button
                type="button"
                onClick={handleCopyPayload}
                className="text-[11px] font-sans font-medium text-[var(--color-accent-blue)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Nusxalash</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-[#11111B] text-[#A6E3A1] font-mono text-[11px] overflow-x-auto border border-[#313244] leading-relaxed">
              {JSON.stringify(log.payloadJson, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </SlideOverDrawer>
  );
};
