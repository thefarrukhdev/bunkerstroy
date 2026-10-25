import React, { useState } from 'react';
import {
  AuditLogRecord,
  AuditLevel,
  AuditCategory,
  INITIAL_AUDIT_LOGS
} from '../../mocks/auditLogsMock';
import { DataTable, Column } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { KpiStatCard } from '../../components/KpiStatCard';
import { Select } from '../../components/Select';
import { Switch } from '../../components/Switch';
import { AuditDetailDrawer } from './AuditDetailDrawer';
import { maskInn, maskPhone } from '../../utils/security';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Eye,
  Globe,
  User,
  Clock,
  Terminal,
  Activity,
  CheckCircle2,
  Cpu,
  Download
} from 'lucide-react';

export const AuditLogsViewer: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogRecord[]>(INITIAL_AUDIT_LOGS);
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [maskPii, setMaskPii] = useState<boolean>(true);

  // Detail Drawer state
  const [selectedLog, setSelectedLog] = useState<AuditLogRecord | null>(null);

  // Statistics
  const totalLogs = logs.length;
  const criticalAndWarnCount = logs.filter(
    (l) => l.level === 'CRITICAL' || l.level === 'WARNING'
  ).length;
  const verifyCount = logs.filter((l) => l.action === 'EIMZO_VERIFY').length;
  const successCount = logs.filter((l) => l.level === 'SUCCESS').length;

  // Filtered Logs
  const filteredLogs = logs.filter((l) => {
    const matchesLevel = levelFilter === 'ALL' || l.level === levelFilter;
    const matchesCategory = categoryFilter === 'ALL' || l.category === categoryFilter;
    return matchesLevel && matchesCategory;
  });

  const levelOptions = [
    { value: 'ALL', label: 'Barcha xavfsizlik darajalari' },
    { value: 'CRITICAL', label: 'Kritik (CRITICAL)' },
    { value: 'WARNING', label: 'Ogohlantirish (WARNING)' },
    { value: 'INFO', label: 'Axborot (INFO)' },
    { value: 'SUCCESS', label: 'Muvaffaqiyatli (SUCCESS)' }
  ];

  const categoryOptions = [
    { value: 'ALL', label: 'Barcha kategoriyalar' },
    { value: 'SECURITY', label: 'Xavfsizlik & Autentifikatsiya' },
    { value: 'CATALOG', label: 'Katalog & Narxlar Nazorati' },
    { value: 'ORDERS', label: 'Buyurtmalar & Savdo' },
    { value: 'SYSTEM', label: 'Tizim & Zaxira Nusxalar' }
  ];

  // Table Columns
  const columns: Column<AuditLogRecord>[] = [
    {
      key: 'timestamp',
      header: 'Vaqti & Daraja',
      render: (row) => (
        <div>
          <StatusBadge status={row.level} />
          <div className="font-mono text-[11px] text-[var(--color-text-muted)] mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{row.timestamp}</span>
          </div>
        </div>
      )
    },
    {
      key: 'action',
      header: 'Hodisa & Kategoriya',
      render: (row) => (
        <div>
          <div className="font-bold text-xs text-[var(--color-text-primary)]">
            {row.actionName}
          </div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-accent-blue)] mt-0.5">
            {row.category} • {row.action}
          </div>
        </div>
      )
    },
    {
      key: 'actor',
      header: 'Ijrochi Ma’mur / Rol',
      render: (row) => {
        const displayInn = row.actorInn
          ? maskPii
            ? maskInn(row.actorInn)
            : row.actorInn
          : null;
        return (
          <div>
            <div className="text-xs font-semibold text-[var(--color-text-primary)] flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" />
              <span>{row.actorName}</span>
            </div>
            <div className="text-[11px] font-mono text-[var(--color-text-muted)] mt-0.5">
              <span className="font-semibold text-[var(--color-text-secondary)]">{row.actorRole}</span>
              {displayInn && ` • STIR: ${displayInn}`}
            </div>
          </div>
        );
      }
    },
    {
      key: 'ip',
      header: 'Manba IP Manzil',
      render: (row) => (
        <div>
          <div className="font-mono text-xs font-semibold text-[var(--color-text-primary)] flex items-center gap-1">
            <Globe className="w-3 h-3 text-[var(--color-text-muted)]" />
            <span>{row.ipAddress}</span>
          </div>
          <div className="text-[10px] text-[var(--color-text-muted)] truncate max-w-[140px] mt-0.5">
            {row.userAgent}
          </div>
        </div>
      )
    },
    {
      key: 'details',
      header: 'Audit Qayd Tafsilotlari',
      render: (row) => (
        <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 max-w-sm">
          {row.details}
        </p>
      )
    },
    {
      key: 'actions',
      header: 'Amallar',
      render: (row) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setSelectedLog(row)}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          Tafsilot
        </Button>
      )
    }
  ];

  const handleExportCsv = () => {
    const headers = ['Vaqt', 'Daraja', 'Hodisa', 'Kategoriya', 'Ijrochi', 'Rol', 'IP Manzil', 'Tafsilot'];
    const rows = filteredLogs.map((l) => [
      l.timestamp,
      l.level,
      `"${l.actionName}"`,
      l.category,
      `"${l.actorName}"`,
      l.actorRole,
      l.ipAddress,
      `"${l.details.replace(/"/g, '""')}"`
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `bunkerstroy_audit_logs_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Sarlavha va PII Himoyasi Switcheri */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Tizim Xavfsizlik Jurnali &amp; Audit Trail
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Kiberxavfsizlik hodisalari, nozik amallar xronologiyasi va PII ma’lumotlar himoyasi (O‘zgarmas loglar)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={handleExportCsv}
            leftIcon={<Download className="w-4 h-4" />}
          >
            CSV Eksport
          </Button>

          {/* PII Masking Toggle */}
          <div className="p-2.5 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[var(--color-accent-blue)]" />
              <div>
                <div className="text-xs font-bold text-[var(--color-text-primary)]">
                  PII Niqobi
                </div>
              </div>
            </div>
            <Switch checked={maskPii} onChange={setMaskPii} />
          </div>
        </div>
      </div>

      {/* KPI Kartochkalar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiStatCard
          title="Jami Audit Qaydlari"
          value={totalLogs}
          icon={<ShieldAlert className="w-5 h-5" />}
          change="Doimiy kiber-monitoring"
          changeType="positive"
        />
        <KpiStatCard
          title="Ogohlantirish & Kritik"
          value={criticalAndWarnCount}
          icon={<AlertTriangle className="w-5 h-5 text-[var(--color-accent-yellow)]" />}
          change="E’tibor talab qiluvchi"
          changeType={criticalAndWarnCount > 0 ? 'neutral' : 'positive'}
        />
        <KpiStatCard
          title="E-IMZO & STIR Tekshiruvlari"
          value={verifyCount}
          icon={<ShieldCheck className="w-5 h-5 text-[var(--color-accent-green)]" />}
          change="DSQ orqali tasdiqlangan"
          changeType="positive"
        />
        <KpiStatCard
          title="Muvaffaqiyatli Harakatlar"
          value={successCount}
          icon={<CheckCircle2 className="w-5 h-5 text-[var(--color-accent-green)]" />}
          change="Ma’muriy tasdiqlangan"
          changeType="positive"
        />
      </div>

      {/* Jadvallar va Filtrlar */}
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={filteredLogs}
          searchPlaceholder="Hodisa, ma’mur, IP manzil, STIR yoki tavsif bo‘yicha qidiruv..."
          emptyTitle="Hech qanday audit qaydi topilmadi"
          emptyDescription="Filtr parametrlarini o‘zgartiring yoki qidiruv so‘rovini tekshiring."
          actionsSlot={
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-56">
                <Select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  options={levelOptions}
                />
              </div>
              <div className="w-56">
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  options={categoryOptions}
                />
              </div>
            </div>
          }
        />
      </div>

      {/* Audit Detail Drawer */}
      <AuditDetailDrawer
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        log={selectedLog}
        maskPii={maskPii}
      />
    </div>
  );
};
