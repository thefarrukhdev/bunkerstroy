import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AdminSidebar, AdminTab } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { OverviewStats } from './features/analytics/OverviewStats';
import { SuperAdminHub } from './features/super_admin/SuperAdminHub';
import { SuppliersTable } from './features/suppliers/SuppliersTable';
import { ProductCatalogManager } from './features/products/ProductCatalogManager';
import { FinancialLedger } from './features/financial/FinancialLedger';
import { AuditLogsViewer } from './features/audit_logs/AuditLogsViewer';
import {
  Users2,
  ShoppingCart,
  Truck
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('super_admin');
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
      case 'super_admin':
        return 'Super Admin Boshqaruv Markazi';
      case 'analytics':
        return 'Umumiy Tahlil & Savdo Ko‘rsatkichlari';
      case 'suppliers':
        return "Ta'minotchilar & STIR Verifikatsiyasi";
      case 'products':
        return 'Mahsulotlar Katalogi & Ombor Zaxiralari';
      case 'orders':
        return 'Buyurtmalar & B2B Savdo Nazorati';
      case 'logistics':
        return "Og'ir Maxsus Texnika & Avtopark Dispecherligi";
      case 'financial':
        return 'Kassa, Moliya & Tranzaksiyalar';
      case 'audit_logs':
        return 'Tizim Xavfsizlik Jurnali & Audit Trail';
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
          {/* 1. Super Admin Katalogi & Xodimlar */}
          {activeTab === 'super_admin' && <SuperAdminHub />}

          {/* 2. Analytics */}
          {activeTab === 'analytics' && <OverviewStats />}

          {/* 3. Suppliers */}
          {activeTab === 'suppliers' && <SuppliersTable />}

          {/* 4. Products */}
          {activeTab === 'products' && <ProductCatalogManager />}

          {/* 5. Orders Placeholder for Step 5 */}
          {activeTab === 'orders' && (
            <div className="p-8 rounded-2xl border border-theme bg-theme-card text-theme-main shadow-sm transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl dark:bg-[#89B4FA]/15 dark:border dark:border-[#89B4FA]/30 dark:text-[#89B4FA] bg-[#1E66F5] text-white">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-theme-main font-mono uppercase tracking-wide">
                    Buyurtmalar va Savdo Boshqaruvi
                  </h2>
                  <p className="text-xs text-theme-muted mt-1">
                    B2B buyurtmalar hayotiy zanjiri (NEW ➡️ COMPLETED), server narx tekshiruvi va hisob-faktura (Invoice) generatori.
                  </p>
                </div>
              </div>
              <div className="mt-6 text-xs font-mono text-theme-subtle">
                [5-Qadam doirasida to'liq amalga oshiriladi]
              </div>
            </div>
          )}

          {/* 6. Logistics Placeholder for Step 6 */}
          {activeTab === 'logistics' && (
            <div className="p-8 rounded-2xl border border-theme bg-theme-card text-theme-main shadow-sm transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl dark:bg-[#89B4FA]/15 dark:border dark:border-[#89B4FA]/30 dark:text-[#89B4FA] bg-[#1E66F5] text-white">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-theme-main font-mono uppercase tracking-wide">
                    Og'ir Maxsus Texnika &amp; Avtopark Dispecherligi
                  </h2>
                  <p className="text-xs text-theme-muted mt-1">
                    HOWO 25t samosvallari, Shacman 10m³ beton mikserlari, kranlar monitoringi va PostGIS masofa kalkulyatori.
                  </p>
                </div>
              </div>
              <div className="mt-6 text-xs font-mono text-theme-subtle">
                [6-Qadam doirasida to'liq amalga oshiriladi]
              </div>
            </div>
          )}

          {/* 7. Financial */}
          {activeTab === 'financial' && <FinancialLedger />}

          {/* 8. Audit Logs */}
          {activeTab === 'audit_logs' && <AuditLogsViewer />}
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-theme bg-theme-header p-4 text-xs font-mono text-theme-muted transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              &copy; {new Date().getFullYear()} <span className="text-theme-main font-bold">BUNKERSTROY</span> Heavy B2B Ecosystem.
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-[#89B4FA] font-bold">[ARCH LINUX PALETTE]</span>
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
