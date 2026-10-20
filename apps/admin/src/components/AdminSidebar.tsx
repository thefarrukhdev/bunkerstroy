import React from 'react';
import {
  ShieldAlert,
  Building2,
  Package,
  Wallet,
  LayoutDashboard,
  Truck,
  ShoppingCart,
  Users2,
  Terminal,
  ChevronRight
} from 'lucide-react';

export type AdminTab =
  | 'super_admin'
  | 'analytics'
  | 'suppliers'
  | 'products'
  | 'orders'
  | 'logistics'
  | 'financial'
  | 'audit_logs';

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
  const menuItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'super_admin',
      label: 'Super Admin Katalogi',
      icon: <Users2 className="w-4 h-4" />,
      badge: 'BOSHQARUV'
    },
    {
      id: 'analytics',
      label: 'Boshqaruv Paneli',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'suppliers',
      label: "Ta'minotchilar & STIR",
      icon: <Building2 className="w-4 h-4" />
    },
    {
      id: 'products',
      label: 'Mahsulotlar & Zaxira',
      icon: <Package className="w-4 h-4" />
    },
    {
      id: 'orders',
      label: 'Buyurtmalar & Savdo',
      icon: <ShoppingCart className="w-4 h-4" />
    },
    {
      id: 'logistics',
      label: "Og'ir Logistika",
      icon: <Truck className="w-4 h-4" />
    },
    {
      id: 'financial',
      label: 'Kassa & Moliya',
      icon: <Wallet className="w-4 h-4" />
    },
    {
      id: 'audit_logs',
      label: 'Xavfsizlik Jurnali',
      icon: <ShieldAlert className="w-4 h-4" />
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
            <div className="w-10 h-10 rounded-xl dark:bg-[#89B4FA]/15 dark:border dark:border-[#89B4FA]/30 dark:text-[#89B4FA] bg-[#1E66F5] text-white flex items-center justify-center font-black tracking-widest shadow-xs">
              <Terminal className="w-5 h-5" />
            </div>

            <div>
              <div className="text-base font-black tracking-wider text-theme-main font-mono uppercase">
                BUNKERSTROY
              </div>
              <div className="text-[10px] tracking-widest text-theme-muted uppercase font-mono flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A6E3A1]" />
                ENTERPRISE ADMIN
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-theme-subtle">
            Asosiy Modullar
          </div>

          {menuItems.map((item) => {
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
                    ? 'dark:bg-[#89B4FA] dark:text-[#11111B] bg-[#1E66F5] text-white font-bold shadow-sm'
                    : 'text-theme-muted hover:text-theme-main hover:bg-theme-card-subtle'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'dark:text-[#11111B] text-white' : 'text-theme-subtle'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase ${
                        isActive
                          ? 'dark:bg-[#11111B]/20 dark:text-[#11111B] dark:border-[#11111B]/30 bg-white/20 text-white border-white/30'
                          : 'bg-theme-card-subtle text-theme-muted border-theme'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info (Pill Widget) */}
        <div className="p-3 border-t border-theme bg-theme-header text-theme-muted text-[11px] font-mono">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-theme-card-subtle border border-theme">
            <span className="text-theme-subtle">Tizim holati:</span>
            <span className="text-[#A6E3A1] font-bold tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A6E3A1] animate-pulse" />
              ONLINE
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
