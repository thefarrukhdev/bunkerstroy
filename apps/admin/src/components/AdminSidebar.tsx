import React from 'react';
import {
  Activity,
  ShieldAlert,
  Building2,
  Package,
  Wallet,
  LayoutDashboard,
  Truck,
  ShoppingCart,
  Users2,
  Terminal,
  ChevronRight,
  Globe,
  Scale,
  Layers
} from 'lucide-react';

export type AdminTab =
  | 'monitoring'
  | 'suppliers'
  | 'partners'
  | 'logistics'
  | 'audit_logs'
  | 'financial'
  | 'disputes'
  | 'products'
  | 'orders'
  | 'super_admin'
  | 'analytics';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose
}) => {
  // 5 Canonical TZ-5 Screens
  const primaryMenuItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'monitoring',
      label: 'Monitoring',
      icon: <Activity className="w-4 h-4" />,
      badge: 'REAL-TIME'
    },
    {
      id: 'suppliers',
      label: "Ta'minotchilar",
      icon: <Building2 className="w-4 h-4" />
    },
    {
      id: 'partners',
      label: 'Hamkorlar',
      icon: <Globe className="w-4 h-4" />,
      badge: 'API'
    },
    {
      id: 'logistics',
      label: 'Logistika',
      icon: <Truck className="w-4 h-4" />
    },
    {
      id: 'audit_logs',
      label: 'Audit Loglar',
      icon: <ShieldAlert className="w-4 h-4" />
    }
  ];

  // Secondary Modules (TZ-5: Moliya, Nizolar)
  const secondaryMenuItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'financial',
      label: 'Moliya & Escrow',
      icon: <Wallet className="w-4 h-4" />,
      badge: '2-MAN'
    },
    {
      id: 'disputes',
      label: 'Nizolar & Arbitraj',
      icon: <Scale className="w-4 h-4" />
    }
  ];

  // Platform Operations
  const operationsMenuItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'orders',
      label: 'Buyurtmalar Ro‘yxati',
      icon: <ShoppingCart className="w-4 h-4" />
    },
    {
      id: 'products',
      label: 'Mahsulotlar Katalogi',
      icon: <Package className="w-4 h-4" />
    },
    {
      id: 'super_admin',
      label: 'Super Admin Boshqaruvi',
      icon: <Users2 className="w-4 h-4" />
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-theme-sidebar border-r border-theme flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-theme bg-theme-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B] text-black flex items-center justify-center font-black tracking-widest shadow-xs">
              <Terminal className="w-5 h-5 stroke-[2.5]" />
            </div>

            <div>
              <div className="text-base font-black tracking-wider text-theme-main font-mono uppercase">
                BUNKERSTROY
              </div>
              <div className="text-[10px] tracking-widest text-theme-muted uppercase font-mono flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                ENTERPRISE ADMIN
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-4">
          
          {/* Section 1: Canonical 5 TZ-5 Screens */}
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold flex items-center justify-between">
              <span>Asosiy Ekranlar (TZ-5)</span>
              <span className="text-[9px] bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">5 TA</span>
            </div>

            {primaryMenuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#F59E0B] text-black font-black shadow-md shadow-amber-500/20'
                      : 'text-theme-muted hover:text-theme-main hover:bg-theme-card-subtle'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-black' : 'text-theme-subtle'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase ${
                          isActive
                            ? 'bg-black/20 text-black border-black/30'
                            : 'bg-theme-card-subtle text-theme-muted border-theme'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Section 2: Secondary Financial & Disputes Screens */}
          <div className="space-y-1 pt-1 border-t border-theme/60">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-theme-subtle">
              Moliya &amp; Nizolar
            </div>

            {secondaryMenuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#F59E0B] text-black font-black shadow-md shadow-amber-500/20'
                      : 'text-theme-muted hover:text-theme-main hover:bg-theme-card-subtle'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-black' : 'text-theme-subtle'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase ${
                          isActive
                            ? 'bg-black/20 text-black border-black/30'
                            : 'bg-theme-card-subtle text-theme-muted border-theme'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Section 3: Operations & Catalog */}
          <div className="space-y-1 pt-1 border-t border-theme/60">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-theme-subtle">
              Katalog &amp; Ma’murlar
            </div>

            {operationsMenuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#F59E0B] text-black font-black shadow-md shadow-amber-500/20'
                      : 'text-theme-muted hover:text-theme-main hover:bg-theme-card-subtle'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-black' : 'text-theme-subtle'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {isActive && <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              );
            })}
          </div>

        </div>

        {/* Footer info (Pill Widget) */}
        <div className="p-3 border-t border-theme bg-theme-header text-theme-muted text-[11px] font-mono">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-theme-card-subtle border border-theme">
            <span className="text-theme-subtle">Tizim holati:</span>
            <span className="text-emerald-400 font-bold tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
