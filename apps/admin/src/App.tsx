import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AdminSidebar, AdminTab } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { MonitoringDashboard } from './features/monitoring/MonitoringDashboard';
import { SuppliersTable } from './features/suppliers/SuppliersTable';
import { PartnersManager } from './features/partners/PartnersManager';
import { FleetManager } from './features/logistics/FleetManager';
import { AuditLogsViewer } from './features/audit_logs/AuditLogsViewer';
import { FinancialLedger } from './features/financial/FinancialLedger';
import { DisputesManager } from './features/disputes/DisputesManager';
import { ProductCatalogManager } from './features/products/ProductCatalogManager';
import { OrdersManager } from './features/orders/OrdersManager';
import { SuperAdminHub } from './features/super_admin/SuperAdminHub';
import { OverviewStats } from './features/analytics/OverviewStats';

const AdminLayout: React.FC = () => {
  // Canonical default tab: 'monitoring' (TZ-5)
  const [activeTab, setActiveTab] = useState<AdminTab>('monitoring');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const getModuleTitle = (tab: AdminTab) => {
    switch (tab) {
      case 'monitoring':
        return 'BunkerStroy Real-Vaqt Monitoringi (KPI & E‘tibor Ro‘yxati)';
      case 'suppliers':
        return "Ta'minotchilar & STIR Verifikatsiyasi (Mahalliy vs Global)";
      case 'partners':
        return 'Hamkorlar & Tashqi Integratsiyalar (Payme, Click, Escrow, E-IMZO, SMS, GPS)';
      case 'logistics':
        return "Og'ir Maxsus Texnika & Avtopark Dispecherligi";
      case 'audit_logs':
        return 'Tizim Xavfsizlik Jurnali & Audit Trail';
      case 'financial':
        return 'Kassa, Escrow & Tranzaksiyalar (2-Kishi Tasdig‘i)';
      case 'disputes':
        return 'Nizolar Markazi & Arbitraj Qarorlari (Dalil & Qaytarim)';
      case 'orders':
        return 'Buyurtmalar & B2B Savdo Nazorati';
      case 'products':
        return 'Mahsulotlar Katalogi & Ombor Zaxiralari';
      case 'super_admin':
        return 'Super Admin Boshqaruv Markazi';
      case 'analytics':
        return 'Umumiy Tahlil & Savdo Ko‘rsatkichlari';
    }
  };

  return (
    <div className="min-h-screen bg-theme-main text-theme-main flex flex-col font-sans transition-colors duration-200">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        {/* Top Bar Header with Theme Switcher */}
        <AdminHeader
          moduleTitle={getModuleTitle(activeTab)}
          currentTime={currentTime}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* ==============================================================
              5 CANONICAL SCREENS ACCORDING TO TZ-5
              ============================================================== */}

          {/* 1. Monitoring (KPIs, Orders Table, Attention List) */}
          {activeTab === 'monitoring' && (
            <MonitoringDashboard
              onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
            />
          )}

          {/* 2. Suppliers (Filter, Table, Local vs Global, STIR Verification, Moderation) */}
          {activeTab === 'suppliers' && <SuppliersTable />}

          {/* 3. Partners (Payme, Click, Escrow, E-IMZO, SMS, GPS) */}
          {activeTab === 'partners' && <PartnersManager />}

          {/* 4. Logistics (Dispatch Queue, Unassigned Orders, Fleet, Shipments en route) */}
          {activeTab === 'logistics' && <FleetManager />}

          {/* 5. Audit Logs (Immutable security logs, filters, export) */}
          {activeTab === 'audit_logs' && <AuditLogsViewer />}

          {/* ==============================================================
              SECONDARY MODULES (Moliya & Nizolar)
              ============================================================== */}

          {/* Secondary 1: Financial & Escrow */}
          {activeTab === 'financial' && <FinancialLedger />}

          {/* Secondary 2: Disputes & Arbitration */}
          {activeTab === 'disputes' && <DisputesManager />}

          {/* ==============================================================
              OPERATIONS & CATALOG
              ============================================================== */}
          {activeTab === 'orders' && <OrdersManager />}
          {activeTab === 'products' && <ProductCatalogManager />}
          {activeTab === 'super_admin' && <SuperAdminHub />}
          {activeTab === 'analytics' && <OverviewStats />}
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-theme bg-theme-header p-4 text-xs font-mono text-theme-muted transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              &copy; {new Date().getFullYear()} <span className="text-theme-main font-bold">BUNKERSTROY</span> Heavy B2B Ecosystem.
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-[#F59E0B] font-bold">[TZ-5 INDUSTRIAL STANDARD]</span>
              <span className="text-theme-subtle">|</span>
              <span className="text-theme-muted">React 19 + TypeScript</span>
              <span className="text-theme-subtle">|</span>
              <span className="text-[#A6E3A1] font-bold">STIR &amp; E-IMZO</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AdminLayout />
    </ThemeProvider>
  );
};

export default App;
