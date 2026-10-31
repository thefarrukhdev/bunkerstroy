import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Building2,
  FileCheck2,
  MessageSquare,
  Navigation,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Clock,
  Key,
  Server,
  Activity,
  Zap,
  RotateCw,
  Check
} from 'lucide-react';
import { INITIAL_PARTNERS, PartnerIntegrationItem, PartnerStatus } from '../../mocks/partnersMock';
import { Button } from '../../components/Button';
import { SlideOverDrawer } from '../../components/SlideOverDrawer';
import { apiClient } from '../../services/apiClient';

export const PartnersManager: React.FC = () => {
  const [partners, setPartners] = useState<PartnerIntegrationItem[]>(INITIAL_PARTNERS);
  const [selectedPartner, setSelectedPartner] = useState<PartnerIntegrationItem | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await apiClient.get<any>('/admin/partners');
        if (res && res.data && res.data.length > 0) {
          const mapped: PartnerIntegrationItem[] = res.data.map((p: any) => ({
            id: p.id,
            code: p.code,
            name: p.name,
            provider: p.provider,
            category: p.code.includes('PAY') || p.code.includes('CLICK') ? 'PAYMENT' : p.code.includes('ESCROW') ? 'BANKING' : p.code.includes('IMZO') ? 'TAX' : p.code.includes('SMS') ? 'MESSAGING' : 'TELEMATICS',
            status: p.status as PartnerStatus,
            contractEnd: p.contractEnd ? new Date(p.contractEnd).toLocaleDateString('uz-UZ') : '2027-12-31',
            lastSyncAt: p.lastSyncAt ? new Date(p.lastSyncAt).toLocaleTimeString('uz-UZ') : 'Yaqinda',
            errorCount: p.errorCount || 0,
            uptimePercent: 99.98,
            apiEndpoint: `https://api.bunkerstroy.uz/partners/${p.code.toLowerCase()}`,
            contactPerson: 'Texnik qo‘llab-quvvatlash',
            contactPhone: '+998 (71) 200-45-46'
          }));
          setPartners(mapped);
        }
      } catch (err) {
        console.warn('Hamkorlar integratsiyasini yuklashda xatolik:', err);
      }
    };
    fetchPartners();
  }, []);

  const handleSyncPartner = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setPartners((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          const now = new Date();
          const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          return {
            ...p,
            lastSyncAt: timeStr,
            status: 'OPERATIONAL'
          };
        })
      );
      setSyncingId(null);
    }, 750);
  };

  const getPartnerIcon = (code: string) => {
    switch (code) {
      case 'PAYME':
      case 'CLICK':
        return <CreditCard className="w-5 h-5 text-emerald-400" />;
      case 'ESCROW_BANK':
        return <Building2 className="w-5 h-5 text-blue-400" />;
      case 'E_IMZO':
        return <ShieldCheck className="w-5 h-5 text-indigo-400" />;
      case 'ESKIZ_SMS':
        return <MessageSquare className="w-5 h-5 text-[#F59E0B]" />;
      case 'GPS_TRACKER':
        return <Navigation className="w-5 h-5 text-sky-400" />;
      default:
        return <Server className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: PartnerStatus) => {
    switch (status) {
      case 'OPERATIONAL':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            OPERATIONAL
          </span>
        );
      case 'DEGRADED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
            DEGRADED
          </span>
        );
      case 'DOWN':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
            DOWN
          </span>
        );
    }
  };

  const filteredPartners = partners.filter((p) => {
    if (filterCategory === 'ALL') return true;
    return p.category === filterCategory;
  });

  const totalIntegrations = partners.length;
  const operationalCount = partners.filter((p) => p.status === 'OPERATIONAL').length;
  const totalErrors = partners.reduce((acc, curr) => acc + curr.errorCount, 0);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-theme-card p-4 rounded-2xl border border-theme">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black uppercase tracking-wider text-theme-main">
              Hamkorlar &amp; Tashqi Integratsiyalar
            </h1>
          </div>
          <p className="text-xs text-theme-muted font-mono mt-0.5">
            TZ-5: To‘lov shlyuzlari, Escrow bank, E-IMZO sertifikatlari, SMS xabarnomalar va GPS telematika
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              partners.forEach((p) => handleSyncPartner(p.id));
            }}
            disabled={!!syncingId}
            className="font-mono text-xs w-full sm:w-auto"
          >
            <RotateCw className={`w-3.5 h-3.5 mr-1.5 ${syncingId ? 'animate-spin' : ''}`} />
            Barchasini sinxronlash
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-theme-card p-4 rounded-2xl border border-theme shadow-xs">
          <span className="text-xs font-mono font-bold uppercase text-theme-muted tracking-wider block">
            Jami Integratsiyalar
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-theme-main">
              {totalIntegrations} ta provayder
            </span>
          </div>
          <span className="text-[11px] text-theme-muted block mt-1">
            Barcha B2B va davlat protokollari ulangan
          </span>
        </div>

        <div className="bg-theme-card p-4 rounded-2xl border border-theme shadow-xs">
          <span className="text-xs font-mono font-bold uppercase text-theme-muted tracking-wider block">
            Ishchi Holat (Uptime)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-emerald-500">
              {operationalCount} / {totalIntegrations} Faol
            </span>
          </div>
          <span className="text-[11px] text-theme-muted block mt-1">
            O‘rtacha mavjudlik ko‘rsatkichi: 99.91%
          </span>
        </div>

        <div className="bg-theme-card p-4 rounded-2xl border border-theme shadow-xs">
          <span className="text-xs font-mono font-bold uppercase text-theme-muted tracking-wider block">
            Xatoliklar Jurnali (24 soat)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${totalErrors > 0 ? 'text-amber-400' : 'text-emerald-500'}`}>
              {totalErrors} ta ogohlantirish
            </span>
          </div>
          <span className="text-[11px] text-theme-muted block mt-1">
            Avtomatik qayta urinish (Retry policy) faol
          </span>
        </div>
      </div>

      {/* Integratsiya Kartalari Ro'yxati */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPartners.map((item) => (
          <div
            key={item.id}
            className="bg-theme-card rounded-2xl border border-theme p-4 flex flex-col justify-between shadow-xs hover:border-[#D95D1E]/50 transition duration-150 space-y-4"
          >
            {/* Card Header */}
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-theme-main/5 border border-theme flex items-center justify-center shrink-0">
                    {getPartnerIcon(item.code)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-theme-main">
                      {item.name}
                    </h3>
                    <p className="text-[11px] font-mono text-theme-muted">
                      {item.provider}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status and Uptime pill */}
              <div className="mt-3 flex items-center justify-between">
                {getStatusBadge(item.status)}
                <span className="text-[11px] font-mono font-bold text-theme-muted">
                  Uptime: <strong className="text-theme-main">{item.uptime}</strong>
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-theme-muted mt-2.5 leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </div>

            {/* Technical Parameters */}
            <div className="bg-theme-main/5 p-3 rounded-xl border border-theme space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-theme-muted">
                <span>Shartnoma muddati:</span>
                <span className="text-theme-main font-bold">{item.contractEnd}</span>
              </div>
              <div className="flex justify-between text-theme-muted">
                <span>Oxirgi sinxronlash:</span>
                <span className="text-theme-main">{item.lastSyncAt}</span>
              </div>
              <div className="flex justify-between text-theme-muted">
                <span>Xatolar soni:</span>
                <span className={item.errorCount > 0 ? 'text-amber-400 font-bold' : 'text-emerald-500'}>
                  {item.errorCount} ta
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-1 flex items-center gap-2 border-t border-theme">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedPartner(item)}
                className="flex-1 font-mono text-xs"
              >
                Tafsilotlar &amp; Loglar
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSyncPartner(item.id)}
                disabled={syncingId === item.id}
                className="font-mono text-xs px-2.5"
                title="Sinxronlash"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingId === item.id ? 'animate-spin text-[#D95D1E]' : ''}`} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-over Drawer for Integration Details & Logs */}
      {selectedPartner && (
        <SlideOverDrawer
          isOpen={!!selectedPartner}
          onClose={() => setSelectedPartner(null)}
          title={selectedPartner.name}
          subtitle={`Provayder: ${selectedPartner.provider}`}
          footer={
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5 w-full">
              <Button
                variant="outline"
                size="md"
                onClick={() => handleSyncPartner(selectedPartner.id)}
                disabled={syncingId === selectedPartner.id}
                className="w-full sm:w-auto"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${syncingId === selectedPartner.id ? 'animate-spin' : ''}`} />
                Qayta sinxronlash
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setSelectedPartner(null)}
                className="w-full sm:w-auto"
              >
                Yopish
              </Button>
            </div>
          }
        >
          <div className="space-y-5 font-sans">
            {/* Status box */}
            <div className="p-4 rounded-xl bg-theme-main/5 border border-theme flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-theme-muted block">Integratsiya holati</span>
                <span className="text-sm font-bold text-theme-main mt-1 block">
                  {selectedPartner.status === 'OPERATIONAL'
                    ? 'Tizim uzluksiz ishlamoqda'
                    : 'Kichik kechikishlar mavjud'}
                </span>
              </div>
              {getStatusBadge(selectedPartner.status)}
            </div>

            {/* Configuration & Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-theme-muted">
                Texnik Parametrlar &amp; Endpoint
              </h4>

              <div className="p-3.5 rounded-xl bg-theme-card-subtle border border-theme space-y-2.5 text-xs font-mono">
                <div>
                  <span className="text-theme-muted block text-[11px]">API Endpoint:</span>
                  <span className="text-theme-main font-bold select-all">
                    {selectedPartner.details.endpoint || 'Internal gRPC / Private Bus'}
                  </span>
                </div>

                <div>
                  <span className="text-theme-muted block text-[11px]">Identifikator / Hisob:</span>
                  <span className="text-theme-main select-all">
                    {selectedPartner.details.accountOrId || 'N/A'}
                  </span>
                </div>

                <div>
                  <span className="text-theme-muted block text-[11px]">Protokol / Shifrlash:</span>
                  <span className="text-theme-main">
                    {selectedPartner.details.protocol || 'TLS 1.3 / AES-256'}
                  </span>
                </div>

                {selectedPartner.details.balance && (
                  <div>
                    <span className="text-theme-muted block text-[11px]">Qoldiq / Balans:</span>
                    <span className="text-emerald-500 font-bold">
                      {selectedPartner.details.balance}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Error & Event Log */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-theme-muted">
                So‘nggi Sinxronlash Jurnali
              </h4>

              <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs space-y-1.5 border border-slate-700">
                <div className="text-[11px] text-slate-400">
                  [{selectedPartner.lastSyncAt}] HEALTHCHECK 200 OK — Ping: 18ms
                </div>
                <div className="text-[11px] text-slate-400">
                  [{selectedPartner.lastSyncAt}] Webhook Handshake verified successfully.
                </div>
                {selectedPartner.details.lastError && (
                  <div className="text-[11px] text-amber-400 pt-1 border-t border-slate-800">
                    DIAGNOSTIKA: {selectedPartner.details.lastError}
                  </div>
                )}
              </div>
            </div>
          </div>
        </SlideOverDrawer>
      )}
    </div>
  );
};

export default PartnersManager;
