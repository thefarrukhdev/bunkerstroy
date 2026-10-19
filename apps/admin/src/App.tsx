import React, { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  Clock,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronRight,
  HardHat,
  Sparkles,
  Zap
} from 'lucide-react';
import { AdminSidebar, AdminTab } from './components/AdminSidebar';
import { OverviewStats } from './features/analytics/OverviewStats';
import { SuppliersTable } from './features/suppliers/SuppliersTable';
import { ProductCatalogManager } from './features/products/ProductCatalogManager';
import { FinancialLedger } from './features/financial/FinancialLedger';
import { AuditLogsViewer } from './features/audit_logs/AuditLogsViewer';
import { PlatformSettings } from './features/settings/PlatformSettings';
import { Badge } from '@bunkerstroy/ui';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('uz-UZ', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const getModuleTitle = (tab: AdminTab) => {
    switch (tab) {
      case 'analytics':
        return 'Boshqaruv Paneli & Aylanma Statistikasi';
      case 'suppliers':
        return 'Ta\'minotchilar & Hamkorlar Reyestri';
      case 'products':
        return 'Katalog, Zaxiralar & ESCO Standartlari';
      case 'financial':
        return 'Kassa, Kirim-Chiqim & To\'lov Shlyuzlari';
      case 'audit_logs':
        return 'Tizim Xavfsizlik Jurnali & STIR Monitoring';
      case 'settings':
        return 'Platforma Integratsiyalari & API Sozlamalari';
    }
  };

  return (
    <div className="min-h-screen bg-[#151719] text-[#F5F5F2] flex flex-col font-sans selection:bg-[#FFB800] selection:text-[#151719]">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        {/* Top Bar Header */}
        <header className="sticky top-0 z-30 brushed-steel border-b border-[#33373B] text-[#F5F5F2]">
          <div className="h-0.5 w-full hazard-stripe-sm opacity-90" />
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            {/* Left: Mobile hamburger & breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-xl bg-[#222528] text-[#B8B8B3] hover:text-[#F5F5F2] lg:hidden border border-[#51504A]"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#8E9094]">
                <span className="text-[#FFB800] font-bold flex items-center gap-1">
                  <HardHat className="w-3.5 h-3.5" />
                  BUNKERSTROY
                </span>
                <ChevronRight className="w-3 h-3 text-[#51504A]" />
                <span className="text-[#F5F5F2] font-semibold">{getModuleTitle(activeTab)}</span>
              </div>
            </div>

            {/* Right: Clock, Status, & Actions */}
            <div className="flex items-center gap-3 font-mono">
              {/* Tashkent Real-time Clock */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A1D20] border border-[#33373B] text-xs text-[#B8B8B3]">
                <Clock className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Toshkent:</span>
                <span className="font-bold text-[#F5F5F2]">{currentTime || '18:30:00'}</span>
              </div>

              {/* API Status Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A1D20] border border-[#33373B] text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[#8E9094] hidden sm:inline">KLASTER:</span>
                <span className="text-emerald-400 font-bold">STABLE 99.9%</span>
              </div>

              {/* Security Pill */}
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFB800]/10 border border-[#FFB800]/20 text-xs text-[#FFB800]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SOLIQ &amp; E-IMZO 256-BIT</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'analytics' && <OverviewStats />}
          {activeTab === 'suppliers' && <SuppliersTable />}
          {activeTab === 'products' && <ProductCatalogManager />}
          {activeTab === 'financial' && <FinancialLedger />}
          {activeTab === 'audit_logs' && <AuditLogsViewer />}
          {activeTab === 'settings' && <PlatformSettings />}
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-[#33373B] bg-[#1A1D20]/60 p-4 text-center text-xs font-mono text-[#8E9094]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              &copy; {new Date().getFullYear()} <span className="text-[#FFB800] font-bold">BUNKERSTROY</span> Heavy B2B Ecosystem. O'zbekiston Respublikasi Qurilish Vazirligi &amp; Soliq Qo'mitasi talablari asosida sertifikatlangan.
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-emerald-400">ESCO Standartlari A++</span>
              <span>•</span>
              <span className="text-[#B8B8B3]">Eskiz SMS Gateway</span>
              <span>•</span>
              <span className="text-[#FFB800]">Gemini 2.5 AI Core</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
