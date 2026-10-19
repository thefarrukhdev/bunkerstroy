import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Package,
  Wallet,
  ShieldAlert,
  Settings,
  HardHat,
  LogOut,
  ChevronRight,
  Activity,
  Terminal,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Badge } from '@bunkerstroy/ui';

export type AdminTab =
  | 'analytics'
  | 'suppliers'
  | 'products'
  | 'financial'
  | 'audit_logs'
  | 'settings';

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
      id: 'analytics',
      label: 'Boshqaruv Paneli',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'suppliers',
      label: 'Ta\'minotchilar',
      icon: <Building2 className="w-5 h-5" />,
      badge: '28 ta'
    },
    {
      id: 'products',
      label: 'Tovar Katalogi',
      icon: <Package className="w-5 h-5" />,
      badge: 'ESCO'
    },
    {
      id: 'financial',
      label: 'Moliya & Kassa',
      icon: <Wallet className="w-5 h-5" />
    },
    {
      id: 'audit_logs',
      label: 'Xavfsizlik Jurnali',
      icon: <ShieldAlert className="w-5 h-5" />
    },
    {
      id: 'settings',
      label: 'Platforma Sozlamalari',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#151719] border-r border-[#33373B] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Hazard Accent */}
        <div className="h-1 w-full hazard-stripe-sm opacity-90" />

        {/* Brand Header */}
        <div className="p-5 border-b border-[#33373B] brushed-steel">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl bg-[#222528] border border-[#51504A] flex items-center justify-center shadow-lg group">
              <div className="absolute top-1 left-1 industrial-rivet" />
              <div className="absolute top-1 right-1 industrial-rivet" />
              <div className="absolute bottom-1 left-1 industrial-rivet" />
              <div className="absolute bottom-1 right-1 industrial-rivet" />
              <HardHat className="w-6 h-6 text-[#FFB800]" />
            </div>

            <div>
              <div className="text-lg font-black tracking-wider leading-none">
                <span className="text-[#FFB800]">BUNKER</span>
                <span className="text-[#F5F5F2]">STROY</span>
              </div>
              <div className="text-[10px] tracking-widest text-[#B8B8B3] uppercase font-mono mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Admin &amp; Supplier Hub
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-[#8E9094]">
            Boshqaruv Modullari
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
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? 'bg-[#222528] text-[#FFB800] border border-[#FFB800]/40 shadow-md font-bold'
                    : 'text-[#B8B8B3] hover:text-[#F5F5F2] hover:bg-[#1A1D20] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`transition-colors ${
                      isActive ? 'text-[#FFB800]' : 'text-[#8E9094] group-hover:text-[#F5F5F2]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        isActive
                          ? 'bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]/30'
                          : 'bg-[#292C2F] text-[#8E9094] border-[#33373B]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 text-[#FFB800]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom User & System Status Card */}
        <div className="p-3 border-t border-[#33373B] bg-[#1A1D20]/80">
          <div className="p-3 bg-[#151719] rounded-xl border border-[#33373B] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFB800] text-[#151719] font-black text-xs flex items-center justify-center font-mono shadow-sm">
                  FJ
                </div>
                <div>
                  <div className="text-xs font-bold text-[#F5F5F2] leading-tight">
                    Farrukh Jumayev
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400">
                    Bosh Administrator
                  </div>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE
              </span>
            </div>

            <div className="pt-2 border-t border-[#33373B]/50 flex items-center justify-between text-[10px] font-mono text-[#8E9094]">
              <span>v1.0.0 HEAVY CORE</span>
              <span className="flex items-center gap-1 text-[#FFB800]">
                <ShieldCheck className="w-3 h-3" /> E-IMZO Active
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
