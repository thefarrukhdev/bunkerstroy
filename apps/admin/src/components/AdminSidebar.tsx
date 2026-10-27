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
  ShieldCheck
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0A1931] border-r-2 border-[#1E3A6D] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header with Industrial Rivets & Hazard Stripe Accent */}
        <div className="p-4 border-b-2 border-[#1E3A6D] bg-[#071326] relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#FFB800] text-[#071326] flex items-center justify-center font-black tracking-widest shadow-md shadow-[#FFB800]/25 shrink-0 border border-[#E5A600]">
              <Terminal className="w-6 h-6 stroke-[3]" />
            </div>

            <div>
              <div className="text-base font-black tracking-wider text-white font-mono uppercase flex items-center gap-1">
                BUNKER<span className="text-[#FFB800]">STROY</span>
              </div>
              <div className="text-[10px] tracking-widest text-sky-200 uppercase font-mono flex items-center gap-1.5 mt-0.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-[#FFB800] animate-pulse" />
                ENTERPRISE INDUSTRIAL
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 left-0 h-[2px] hazard-stripe-sm" />
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-4">
          
          {/* Section 1: Asosiy Ekranlar (TZ-5 + BunkerStats) */}
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-[#FFB800] font-black flex items-center justify-between">
              <span>Asosiy Ekranlar (Sanoat)</span>
              <span className="text-[9px] bg-[#FFB800]/15 text-[#FFB800] px-1.5 py-0.5 rounded border border-[#FFB800]/30 font-bold">
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#FFB800] text-[#071326] font-black shadow-lg shadow-[#FFB800]/30 border border-[#E5A600]'
                      : 'text-sky-100 hover:text-white hover:bg-[#0F2547] border border-transparent hover:border-[#1E3A6D]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-[#071326]' : 'text-[#FFB800]'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded-md border uppercase font-bold ${
                          isActive
                            ? 'bg-[#071326]/20 text-[#071326] border-[#071326]/30'
                            : 'bg-[#071326] text-sky-200 border-[#1E3A6D]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 stroke-[3] text-[#071326]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Section 2: Secondary Financial & Disputes Screens */}
          <div className="space-y-1 pt-2 border-t border-[#1E3A6D]">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-sky-300 font-bold">
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
                      ? 'bg-[#FFB800] text-[#071326] font-black shadow-lg shadow-[#FFB800]/30 border border-[#E5A600]'
                      : 'text-sky-100 hover:text-white hover:bg-[#0F2547] border border-transparent hover:border-[#1E3A6D]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-[#071326]' : 'text-[#FFB800]'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded-md border uppercase font-bold ${
                          isActive
                            ? 'bg-[#071326]/20 text-[#071326] border-[#071326]/30'
                            : 'bg-[#071326] text-sky-200 border-[#1E3A6D]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 stroke-[3] text-[#071326]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Section 3: Operations & Catalog */}
          <div className="space-y-1 pt-2 border-t border-[#1E3A6D]">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-sky-300 font-bold">
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
                      ? 'bg-[#FFB800] text-[#071326] font-black shadow-lg shadow-[#FFB800]/30 border border-[#E5A600]'
                      : 'text-sky-100 hover:text-white hover:bg-[#0F2547] border border-transparent hover:border-[#1E3A6D]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-[#071326]' : 'text-[#FFB800]'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {isActive && <ChevronRight className="w-3.5 h-3.5 stroke-[3] text-[#071326]" />}
                </button>
              );
            })}
          </div>

        </div>

        {/* Footer info: Staff Role and Cross-App Portal Links */}
        <div className="p-3 border-t-2 border-[#1E3A6D] bg-[#071326] text-xs font-mono space-y-1.5">
          <div className="text-[10px] font-bold text-[#FFB800] uppercase tracking-wider px-1">
            BunkerStroy Portallari:
          </div>

          <div className="grid grid-cols-3 gap-1">
            <a
              href={typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://bunkerstroy-web.vercel.app'}
              title="Bozor Vitrinasi & Marketplace"
              className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg bg-[#0F2547] hover:bg-[#132C54] border border-[#1E3A6D] hover:border-[#FFB800] text-sky-200 hover:text-white transition-all text-[10px] font-mono font-bold select-none text-center"
            >
              <span>🏪 Vitrina</span>
            </a>
            <a
              href={typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://bunkerstroy-seller.vercel.app'}
              title="Sotuvchi & POS CRM"
              className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg bg-[#0F2547] hover:bg-[#132C54] border border-[#1E3A6D] hover:border-[#FFB800] text-sky-200 hover:text-white transition-all text-[10px] font-mono font-bold select-none text-center"
            >
              <span>🏬 Sotuvchi</span>
            </a>
            <a
              href={typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3003' : 'https://bunkerstroy-driver.vercel.app'}
              title="Haydovchi PWA"
              className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg bg-[#0F2547] hover:bg-[#132C54] border border-[#1E3A6D] hover:border-[#FFB800] text-sky-200 hover:text-white transition-all text-[10px] font-mono font-bold select-none text-center"
            >
              <span>🚛 Haydovchi</span>
            </a>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0A1931] border border-[#1E3A6D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FFB800]/20 border border-[#FFB800]/50 text-[#FFB800] flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-black text-white">{adminName}</div>
                <div className="text-[9px] text-[#FFB800] font-bold">{currentRole}</div>
              </div>
            </div>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-black px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
