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
  Layers,
  BarChart3,
  HardHat,
  MapPin,
  ShieldCheck,
  X
} from 'lucide-react';

export type AdminTab =
  | 'monitoring'
  | 'analytics'
  | 'suppliers'
  | 'partners'
  | 'logistics'
  | 'audit_logs'
  | 'financial'
  | 'disputes'
  | 'products'
  | 'orders'
  | 'super_admin';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isOpen: boolean;
  onClose: () => void;
  currentRole?: string;
  adminName?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  currentRole = 'SUPER ADMIN',
  adminName = 'ADMIN.'
}) => {
  // Primary Canonical TZ-5 Screens + BunkerStats 14 Hudud
  const primaryMenuItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'monitoring',
      label: 'Monitoring & Real-Time',
      icon: <Activity className="w-4 h-4" />,
      badge: 'LIVE'
    },
    {
      id: 'analytics',
      label: 'BunkerStats (14 Hudud)',
      icon: <BarChart3 className="w-4 h-4" />,
      badge: '14 VILOYAT'
    },
    {
      id: 'suppliers',
      label: "Ta'minotchilar (STIR)",
      icon: <Building2 className="w-4 h-4" />
    },
    {
      id: 'partners',
      label: 'Hamkorlar & API',
      icon: <Globe className="w-4 h-4" />,
      badge: 'ESCROW'
    },
    {
      id: 'logistics',
      label: "Og'ir Flot & Dispecherlik",
      icon: <Truck className="w-4 h-4" />
    },
    {
      id: 'audit_logs',
      label: 'Xavfsizlik & Audit',
      icon: <ShieldAlert className="w-4 h-4" />
    }
  ];

  // Secondary Modules (TZ-5: Moliya, Nizolar)
  const secondaryMenuItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'financial',
      label: 'Moliya & Escrow Kassa',
      icon: <Wallet className="w-4 h-4" />,
      badge: '2-KISHI'
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
      label: 'Buyurtmalar & B2B Nazorat',
      icon: <ShoppingCart className="w-4 h-4" />
    },
    {
      id: 'products',
      label: 'Mahsulotlar & Ombor',
      icon: <Package className="w-4 h-4" />
    },
    {
      id: 'super_admin',
      label: 'Super Admin & Sub-Adminlar',
      icon: <Users2 className="w-4 h-4" />
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200 bg-white relative overflow-hidden flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#D95D1E] text-white flex items-center justify-center font-bold tracking-widest shadow-xs shrink-0 border border-[#C2410C]">
              <Terminal className="w-5 h-5 stroke-[2.5]" />
            </div>

            <div className="min-w-0">
              <div className="text-base font-bold tracking-wider text-slate-900 font-mono uppercase flex items-center gap-1">
                BUNKER<span className="text-[#D95D1E]">STROY</span>
              </div>
              <div className="text-[10px] tracking-widest text-slate-500 uppercase font-mono mt-0.5 font-bold">
                ENTERPRISE ADMIN
              </div>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            aria-label="Menyuni yopish"
            className="lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 cursor-pointer transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-4">
          
          {/* Section 1: Asosiy Ekranlar (TZ-5 + BunkerStats) */}
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center justify-between">
              <span>Asosiy Ekranlar (Sanoat)</span>
              <span className="text-[9px] bg-orange-50 text-[#D95D1E] px-1.5 py-0.5 rounded border border-orange-200 font-bold">
                6 MODUL
              </span>
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all duration-150 cursor-pointer min-h-[44px] ${
                    isActive
                      ? 'bg-[#D95D1E] text-white font-bold shadow-xs border border-[#C2410C]'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-slate-500'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded-md border uppercase font-bold ${
                          isActive
                            ? 'bg-white/20 text-white border-white/30'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 stroke-[3] text-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Section 2: Secondary Financial & Disputes Screens */}
          <div className="space-y-1 pt-2 border-t border-slate-200">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all duration-150 cursor-pointer min-h-[44px] ${
                    isActive
                      ? 'bg-[#D95D1E] text-white font-bold shadow-xs border border-[#C2410C]'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-slate-500'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded-md border uppercase font-bold ${
                          isActive
                            ? 'bg-white/20 text-white border-white/30'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 stroke-[3] text-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Section 3: Operations & Catalog */}
          <div className="space-y-1 pt-2 border-t border-slate-200">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all duration-150 cursor-pointer min-h-[44px] ${
                    isActive
                      ? 'bg-[#D95D1E] text-white font-bold shadow-xs border border-[#C2410C]'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-slate-500'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {isActive && <ChevronRight className="w-3.5 h-3.5 stroke-[3] text-white" />}
                </button>
              );
            })}
          </div>

        </div>

        {/* Footer info: Staff Role and Cross-App Portal Links */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-xs font-mono space-y-1.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
            BunkerStroy Portallari:
          </div>

          <div className="grid grid-cols-3 gap-1">
            <a
              href={typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://bunkerstroy-web.vercel.app'}
              title="Bozor Vitrinasi & Marketplace"
              className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 transition-all text-[10px] font-mono font-bold select-none text-center"
            >
              <span>🏪 Vitrina</span>
            </a>
            <a
              href={typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://bunkerstroy-seller.vercel.app'}
              title="Sotuvchi & POS CRM"
              className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 transition-all text-[10px] font-mono font-bold select-none text-center"
            >
              <span>🏬 Sotuvchi</span>
            </a>
            <a
              href={typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3003' : 'https://bunkerstroy-driver.vercel.app'}
              title="Haydovchi PWA"
              className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 transition-all text-[10px] font-mono font-bold select-none text-center"
            >
              <span>🚛 Haydovchi</span>
            </a>
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 text-[#D95D1E] flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-900">{adminName}</div>
                <div className="text-[9px] text-[#D95D1E] font-bold">{currentRole}</div>
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">
              ONLINE
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
