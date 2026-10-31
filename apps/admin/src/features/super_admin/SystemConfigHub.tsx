import React, { useState } from 'react';
import { INITIAL_SYSTEM_CONFIG, SystemConfig, SystemServiceStatus } from '../../mocks/superAdminMock';
import { Switch } from '../../components/Switch';
import { Button } from '../../components/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { ConfirmModal } from '../../components/ConfirmModal';
import {
  Server,
  Activity,
  Database,
  RefreshCw,
  HardDriveDownload,
  AlertOctagon,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers
} from 'lucide-react';

export const SystemConfigHub: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig>(INITIAL_SYSTEM_CONFIG);
  const [isPinging, setIsPinging] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);

  // Ping all services
  const handlePingServices = () => {
    setIsPinging(true);
    setTimeout(() => {
      setConfig((prev) => ({
        ...prev,
        services: prev.services.map((svc) => ({
          ...svc,
          latencyMs: Math.floor(Math.random() * 80) + 15,
          lastChecked: 'Hozir'
        }))
      }));
      setIsPinging(false);
    }, 800);
  };

  // Trigger manual backup
  const handleTriggerBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      const now = new Date();
      const dateStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setConfig((prev) => ({
        ...prev,
        lastBackupDate: dateStr,
        backupSizeMb: +(prev.backupSizeMb + 0.4).toFixed(1)
      }));
      setIsBackingUp(false);
      setBackupSuccess(true);
      setTimeout(() => setBackupSuccess(false), 4000);
    }, 1500);
  };

  const handleMaintenanceToggle = () => {
    if (!config.maintenanceMode) {
      // Yoqishdan oldin tasdiqlash modalini ko'rsatamiz
      setMaintenanceModalOpen(true);
    } else {
      // O'chirish to'g'ridan-to'g'ri
      setConfig((prev) => ({ ...prev, maintenanceMode: false }));
    }
  };

  const confirmEnableMaintenance = () => {
    setConfig((prev) => ({ ...prev, maintenanceMode: true }));
    setMaintenanceModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Yuqori sarlavha */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--color-border-subtle)]">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[var(--color-accent-blue)]" />
            Tizim Konfiguratsiyasi & Xizmatlar Monitoringi
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            B2B ekotizim shlyuzlari, tashqi API integratsiyalari va PostgreSQL zaxira arxivi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePingServices}
            isLoading={isPinging}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />}
          >
            Solishtirib yangilash (Ping)
          </Button>
        </div>
      </div>

      {/* Global rejimlar va sozlamalar kartochkalari */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Texnik tanaffus (Maintenance mode) */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            config.maintenanceMode
              ? 'bg-[var(--color-accent-red)]/10 border-[var(--color-accent-red)]/40 shadow-sm'
              : 'bg-[var(--color-surface-card)] border-[var(--color-border-subtle)]'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2 rounded-lg ${
                  config.maintenanceMode
                    ? 'bg-[var(--color-accent-red)]/20 text-[var(--color-accent-red)]'
                    : 'bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]'
                }`}
              >
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--color-text-primary)]">
                  Texnik Tanaffus
                </div>
                <div className="text-xs text-[var(--color-text-muted)]">Maintenance Mode</div>
              </div>
            </div>
            <Switch checked={config.maintenanceMode} onChange={handleMaintenanceToggle} />
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-3 leading-relaxed">
            Yoqilganda ommaviy veb-sayt va mobil foydalanuvchilar uchun vaqtinchalik 503 sahifasi ko‘rsatiladi. Admin panel ochiq qoladi.
          </p>
        </div>

        {/* Ro'yxatdan o'tish holati */}
        <div className="p-4 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[var(--color-accent-green)]/15 text-[var(--color-accent-green)]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--color-text-primary)]">
                  B2B Registratsiya
                </div>
                <div className="text-xs text-[var(--color-text-muted)]">Ochiq ariza qabuli</div>
              </div>
            </div>
            <Switch
              checked={config.registrationOpen}
              onChange={(checked) => setConfig((prev) => ({ ...prev, registrationOpen: checked }))}
            />
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-3 leading-relaxed">
            Yangi pudratchi va ta’minotchilarning mustaqil ro‘yxatdan o‘tish va STIR tekshiruv formasini yuborish huquqi.
          </p>
        </div>

        {/* E-IMZO & SMS shlyuz limiti */}
        <div className="p-4 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-lg bg-[var(--color-accent-blue)]/15 text-[var(--color-accent-blue)]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--color-text-primary)]">
                E-IMZO Shlyuzi
              </div>
              <div className="text-xs text-[var(--color-text-muted)] font-mono">
                {config.activeEimzoVersion}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--color-border-subtle)] mt-2">
            <span className="text-[var(--color-text-secondary)]">SMS OTP limiti:</span>
            <span className="font-mono font-semibold text-[var(--color-accent-yellow)]">
              {config.maxSmsPerHour} sms/soat
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1.5 mt-1">
            <span className="text-[var(--color-text-secondary)]">Kriptografik algoritm:</span>
            <span className="font-mono text-[var(--color-text-primary)]">O‘zDSt 1092:2009</span>
          </div>
        </div>
      </div>

      {/* Tashqi Xizmatlar Monitoringi (Integrations Status) */}
      <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[var(--color-accent-green)]" />
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
              Tashqi Integratsiyalar Holati (Live Health)
            </h3>
          </div>
          <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1.5 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-accent-green)]" />
            Barcha tizimlar barqaror
          </span>
        </div>

        <div className="divide-y divide-[var(--color-border-subtle)]">
          {config.services.map((svc) => (
            <div
              key={svc.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--color-surface-hover)]/40 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[var(--color-surface-bg)] border border-[var(--color-border-subtle)] shrink-0">
                  <Server className="w-4 h-4 text-[var(--color-accent-blue)]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {svc.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]">
                      {svc.provider}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[var(--color-text-muted)] mt-0.5">
                    {svc.endpoint}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-[var(--color-text-primary)] flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3 text-[var(--color-text-muted)]" />
                    <span>{svc.latencyMs} ms</span>
                  </div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">
                    Tekshirildi: {svc.lastChecked}
                  </div>
                </div>
                <div>
                  <StatusBadge status={svc.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PostgreSQL Zaxira Nusxasi (Backup Management) */}
      <div className="p-5 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-[var(--color-accent-blue)]/15 text-[var(--color-accent-blue)]">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold text-[var(--color-text-primary)]">
                PostgreSQL & PostGIS Ma’lumotlar Bazasi Zaxirasi
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                So‘nggi muvaffaqiyatli avtomatik nusxa:{' '}
                <span className="font-mono font-semibold text-[var(--color-text-primary)]">
                  {config.lastBackupDate}
                </span>{' '}
                (Hajmi: <span className="font-mono text-[var(--color-accent-blue)]">{config.backupSizeMb} MB</span>)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {backupSuccess && (
              <span className="text-xs text-[var(--color-accent-green)] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Nusxa olindi!
              </span>
            )}
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<HardDriveDownload className="w-4 h-4" />}
              onClick={() => alert(`Zaxira nusxasi yuklab olinmoqda (hajmi: ${config.backupSizeMb} MB)`)}
            >
              Yuklab olish
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isBackingUp}
              onClick={handleTriggerBackup}
              leftIcon={<Database className="w-4 h-4" />}
            >
              Hozir zaxira olish
            </Button>
          </div>
        </div>
      </div>

      {/* Texnik tanaffusni yoqish tasdiqlash modali */}
      <ConfirmModal
        isOpen={maintenanceModalOpen}
        title="Texnik tanaffus rejimini yoqishni tasdiqlaysizmi?"
        description="Diqqat! Texnik tanaffus yoqilganda barcha xaridorlar va pudratchilar platforma saytiga vaqtincha kira olmaydilar. Admin panel barcha xodimlar uchun ochiq qoladi."
        confirmText="Ha, yoqilsin"
        cancelText="Bekor qilish"
        isDangerous={true}
        onConfirm={confirmEnableMaintenance}
        onClose={() => setMaintenanceModalOpen(false)}
      />
    </div>
  );
};
