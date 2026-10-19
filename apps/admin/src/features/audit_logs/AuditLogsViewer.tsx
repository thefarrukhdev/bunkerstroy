import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  Clock,
  Globe,
  UserCheck,
  Shield,
  FileCode2
} from 'lucide-react';
import { Card, Badge, Button } from '@bunkerstroy/ui';
import { LogLevel, LogCategory } from '@bunkerstroy/types';

export interface AuditLogItem {
  id: string;
  action: string;
  actor: string;
  category: LogCategory;
  details: string;
  ipAddress: string;
  level: LogLevel;
  timestamp: string;
}

const initialLogs: AuditLogItem[] = [
  {
    id: 'log-1',
    action: "Platformaga to'liq kirish (Admin Auth)",
    actor: 'Farrukh Jumayev (Admin)',
    category: 'AUTH',
    details: 'IP: 127.0.0.1 orqali tizimga muvaffaqiyatli kirildi. 2FA tasdiqlangan.',
    ipAddress: '127.0.0.1',
    level: 'SUCCESS',
    timestamp: '2026-10-19 18:20:45'
  },
  {
    id: 'log-2',
    action: "Yuridik STIR ma'lumoti tekshirildi (GNK API)",
    actor: 'Tizim / Soliq API Bot',
    category: 'SYSTEM_SECURITY',
    details: 'STIR: 201122334 «BUNKER STROY INVEST» MChJ muvaffaqiyatli tasdiqlandi. Faol QQS to\'lovchi.',
    ipAddress: '84.54.82.11',
    level: 'INFO',
    timestamp: '2026-10-19 18:15:10'
  },
  {
    id: 'log-3',
    action: "Narx manipulyatsiyasi aniqlandi",
    actor: 'Avtomatlashtirilgan Audit Filtrlari',
    category: 'PRODUCT',
    details: 'SKU: CEM-M500 narxi bozor o\'rtacha narxidan 45% past kiritildi. Moderatsiyaga yuborildi.',
    ipAddress: '213.230.100.4',
    level: 'WARNING',
    timestamp: '2026-10-19 17:58:22'
  },
  {
    id: 'log-4',
    action: "E-IMZO Raqamli Imzo Muvaffaqiyatli Tasdiqlandi",
    actor: 'Qodirov Alisher (Ta\'minotchi)',
    category: 'AUTH',
    details: 'Sertifikat: #9403819A E-IMZO PKCS#7 orqali B2B shartnoma raqamli imzolandi.',
    ipAddress: '195.158.12.90',
    level: 'SUCCESS',
    timestamp: '2026-10-19 17:40:02'
  },
  {
    id: 'log-5',
    action: "To'lov xavfsizlik cheklovi (Rate Limit)",
    actor: 'Payme Webhook API',
    category: 'PAYMENT',
    details: '1 daqiqa ichida bir xil IP manzilidan 8 ta muvaffaqiyatsiz so\'rov bloklandi.',
    ipAddress: '185.203.118.23',
    level: 'ERROR',
    timestamp: '2026-10-19 16:32:19'
  },
  {
    id: 'log-6',
    action: "ESCO Energiya Samaradorlik Auditi Generatsiya qilindi",
    actor: 'Gemini 2.5 Flash / AI Auditor',
    category: 'ESCO',
    details: 'Obyekt: Toshkent viloyati sanoat ombori uchun 18.4% gaz tejash bashorati yaratildi.',
    ipAddress: '127.0.0.1',
    level: 'INFO',
    timestamp: '2026-10-19 15:14:33'
  }
];

export const AuditLogsViewer: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>(initialLogs);
  const [levelFilter, setLevelFilter] = useState<'ALL' | LogLevel>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);

    const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
    const matchesCategory = categoryFilter === 'ALL' || log.category === categoryFilter;

    return matchesSearch && matchesLevel && matchesCategory;
  });

  const getLevelBadge = (level: LogLevel) => {
    switch (level) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> SUCCESS
          </span>
        );
      case 'INFO':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
            <Info className="w-3 h-3" /> INFO
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" /> WARNING
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/15 text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3" /> ERROR
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 brushed-steel p-4 rounded-2xl border border-[#33373B]">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#FFB800]" />
            <h1 className="text-xl font-black uppercase tracking-wider text-[#F5F5F2]">
              Xavfsizlik Jurnali &amp; Audit Logs
            </h1>
          </div>
          <p className="text-xs text-[#B8B8B3] font-mono mt-0.5">
            Autentifikatsiya, STIR/E-IMZO tekshiruvlari va xavfsizlik monitoringi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            isLoading={isRefreshing}
            className="h-9"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Yangilash
          </Button>
        </div>
      </div>

      {/* Security Quick Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#1A1D20] p-3 rounded-xl border border-[#33373B]">
          <div className="text-[11px] font-mono text-[#8E9094] uppercase">Tizim Kirishlari (Bugun)</div>
          <div className="text-lg font-mono font-black text-emerald-400 mt-1">128 ta</div>
          <div className="text-[10px] text-[#51504A] font-mono">100% muvaffaqiyatli</div>
        </div>

        <div className="bg-[#1A1D20] p-3 rounded-xl border border-[#33373B]">
          <div className="text-[11px] font-mono text-[#8E9094] uppercase">STIR So'rovlari</div>
          <div className="text-lg font-mono font-black text-sky-400 mt-1">42 ta</div>
          <div className="text-[10px] text-[#51504A] font-mono">GNK API integratsiyasi</div>
        </div>

        <div className="bg-[#1A1D20] p-3 rounded-xl border border-[#33373B]">
          <div className="text-[11px] font-mono text-[#8E9094] uppercase">Xavfsizlik Ogohlantirishlari</div>
          <div className="text-lg font-mono font-black text-amber-400 mt-1">1 ta</div>
          <div className="text-[10px] text-[#51504A] font-mono">Narx anomaliyasi</div>
        </div>

        <div className="bg-[#1A1D20] p-3 rounded-xl border border-[#33373B]">
          <div className="text-[11px] font-mono text-[#8E9094] uppercase">Bloklangan So'rovlar</div>
          <div className="text-lg font-mono font-black text-red-400 mt-1">1 ta IP</div>
          <div className="text-[10px] text-[#51504A] font-mono">Rate-limit triggered</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-[#8E9094] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Harakat, Aktyor, IP manzil yoki ma'lumot..."
            className="w-full bg-[#1A1D20] border border-[#33373B] rounded-xl pl-10 pr-4 py-2 text-sm text-[#F5F5F2] placeholder-[#8E9094] focus:outline-none focus:border-[#FFB800]"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap self-start lg:self-auto">
          {(
            [
              { id: 'ALL', label: 'Barchasi' },
              { id: 'SUCCESS', label: 'SUCCESS' },
              { id: 'INFO', label: 'INFO' },
              { id: 'WARNING', label: 'WARNING' },
              { id: 'ERROR', label: 'ERROR' }
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setLevelFilter(t.id)}
              className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                levelFilter === t.id
                  ? 'bg-[#FFB800] text-[#151719] border-[#FFB800]'
                  : 'bg-[#1A1D20] text-[#B8B8B3] border-[#33373B] hover:text-[#F5F5F2]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Console / Table */}
      <Card className="p-0 overflow-hidden border-[#33373B] bg-[#1A1D20]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#33373B] bg-[#151719] text-[11px] font-mono uppercase tracking-wider text-[#B8B8B3]">
                <th className="py-3 px-4">Vaqt &amp; Daraja</th>
                <th className="py-3 px-4">Harakat (Action)</th>
                <th className="py-3 px-4">Aktyor (Foydalanuvchi)</th>
                <th className="py-3 px-4">IP Manzil</th>
                <th className="py-3 px-4">Kategoriya</th>
                <th className="py-3 px-4">Tafsilotlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#33373B]/60 text-xs font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#8E9094]">
                    Xavfsizlik jurnali bo'yicha ma'lumot topilmadi
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-[#222528] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-[#8E9094] text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {log.timestamp}
                      </div>
                      <div className="mt-1">{getLevelBadge(log.level)}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-[#F5F5F2] hover:text-[#FFB800] transition-colors">
                        {log.action}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-[#F5F5F2] flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-[#FFB800]" />
                        {log.actor}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-[#8E9094] flex items-center gap-1 bg-[#151719] px-2 py-0.5 rounded border border-[#33373B] w-fit">
                        <Globe className="w-3 h-3 text-[#FFB800]" />
                        {log.ipAddress}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-[10px] text-[#B8B8B3] bg-[#292C2F] px-2 py-0.5 rounded border border-[#33373B]">
                        {log.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-xs truncate text-[#8E9094]">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#1A1D20] border border-[#33373B] rounded-2xl max-w-lg w-full p-6 text-[#F5F5F2] shadow-2xl relative font-mono text-xs">
            <button
              onClick={() => setSelectedLog(null)}
              className="absolute top-4 right-4 text-[#8E9094] hover:text-[#F5F5F2] p-1 rounded-lg"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-[#FFB800]" />
              <h3 className="font-bold text-sm text-[#F5F5F2]">Audit Jurnali Yozuvi</h3>
            </div>

            <div className="space-y-3 py-3 border-y border-[#33373B]">
              <div className="flex justify-between">
                <span className="text-[#8E9094]">Xavfsizlik Darajasi:</span>
                <div>{getLevelBadge(selectedLog.level)}</div>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E9094]">Vaqt:</span>
                <span className="text-[#F5F5F2]">{selectedLog.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E9094]">Harakat:</span>
                <span className="text-[#FFB800] font-bold">{selectedLog.action}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E9094]">Aktyor / Tizim:</span>
                <span className="text-[#F5F5F2]">{selectedLog.actor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E9094]">IP Manzil:</span>
                <span className="text-[#F5F5F2]">{selectedLog.ipAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E9094]">Kategoriya:</span>
                <span className="text-[#F5F5F2]">{selectedLog.category}</span>
              </div>
              <div>
                <span className="text-[#8E9094] block mb-1">To'liq Tafsilotlar:</span>
                <div className="bg-[#151719] p-3 rounded-xl border border-[#33373B] text-[#F5F5F2] leading-relaxed">
                  {selectedLog.details}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setSelectedLog(null)}>
                Yopish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
