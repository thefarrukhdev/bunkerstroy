import React, { useState } from 'react';
import { KpiStatCard } from '../../components/KpiStatCard';
import { StaffManager } from './StaffManager';
import { RolePermissionMatrix } from './RolePermissionMatrix';
import { SystemConfigHub } from './SystemConfigHub';
import { SubAdminPermissionsSection } from './SubAdminPermissionsSection';
import { INITIAL_STAFF_MEMBERS, INITIAL_ROLE_DEFINITIONS, INITIAL_SYSTEM_CONFIG } from '../../mocks/superAdminMock';
import { Users, Shield, Cpu, UserCheck, ShieldAlert, Activity, KeyRound } from 'lucide-react';

type SuperAdminTab = 'sub_admins' | 'staff' | 'roles' | 'system';

export const SuperAdminHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SuperAdminTab>('sub_admins');

  const totalStaff = INITIAL_STAFF_MEMBERS.length;
  const activeStaff = INITIAL_STAFF_MEMBERS.filter((s) => s.status === 'ACTIVE').length;
  const totalRoles = INITIAL_ROLE_DEFINITIONS.length;
  const operationalServices = INITIAL_SYSTEM_CONFIG.services.filter((s) => s.status === 'OPERATIONAL').length;
  const totalServices = INITIAL_SYSTEM_CONFIG.services.length;

  return (
    <div className="space-y-6">
      {/* Sahifa sarlavhasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0A1931] p-5 rounded-2xl border-2 border-[#1E3A6D] shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800] animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Super Admin Boshqaruv Markazi
            </h1>
          </div>
          <p className="text-xs text-sky-200 font-mono mt-1">
            BunkerStroy platformasi boshqaruvi, Sub-Adminlar ruxsatlar matritsasi va xavfsizlik rollari
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#071326] border border-[#FFB800]/50 text-[#FFB800] font-mono text-xs font-black">
          <ShieldAlert className="w-4 h-4" />
          <span>SUPER ADMIN LEVEL 10</span>
        </div>
      </div>

      {/* KPI Kartochkalar (Layer 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiStatCard
          title="Jami Tizim Xodimlari"
          value={totalStaff}
          icon={<Users className="w-5 h-5" />}
          change="+1 yangi bu oy"
          changeType="positive"
        />
        <KpiStatCard
          title="Faol Xodimlar"
          value={activeStaff}
          icon={<UserCheck className="w-5 h-5" />}
          change={`${totalStaff - activeStaff} ta bloklangan`}
          changeType="neutral"
        />
        <KpiStatCard
          title="RBAC Rollari"
          value={totalRoles}
          icon={<Shield className="w-5 h-5" />}
          change="5 ta bo‘limga biriktirilgan"
          changeType="neutral"
        />
        <KpiStatCard
          title="Tizim Integratsiyalari"
          value={`${operationalServices}/${totalServices}`}
          icon={<Activity className="w-5 h-5" />}
          change="100% barqaror ishlamoqda"
          changeType="positive"
        />
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap border-b-2 border-[#1E3A6D] gap-2 pb-1">
        <button
          onClick={() => setActiveTab('sub_admins')}
          className={`flex items-center gap-2 py-2.5 px-4 text-xs font-black rounded-xl transition-all cursor-pointer font-mono ${
            activeTab === 'sub_admins'
              ? 'bg-[#FFB800] text-[#071326] shadow-md shadow-[#FFB800]/20'
              : 'bg-[#0A1931] text-sky-200 hover:text-white border border-[#1E3A6D]'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Sub-Adminlar Ruxsatlar Matritsasi</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-2 py-2.5 px-4 text-xs font-black rounded-xl transition-all cursor-pointer font-mono ${
            activeTab === 'staff'
              ? 'bg-[#FFB800] text-[#071326] shadow-md shadow-[#FFB800]/20'
              : 'bg-[#0A1931] text-sky-200 hover:text-white border border-[#1E3A6D]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Xodimlar Ro‘yxati ({totalStaff})</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 py-2.5 px-4 text-xs font-black rounded-xl transition-all cursor-pointer font-mono ${
            activeTab === 'roles'
              ? 'bg-[#FFB800] text-[#071326] shadow-md shadow-[#FFB800]/20'
              : 'bg-[#0A1931] text-sky-200 hover:text-white border border-[#1E3A6D]'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Rollar &amp; Huquqlar Matritsasi (RBAC)</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 py-2.5 px-4 text-xs font-black rounded-xl transition-all cursor-pointer font-mono ${
            activeTab === 'system'
              ? 'bg-[#FFB800] text-[#071326] shadow-md shadow-[#FFB800]/20'
              : 'bg-[#0A1931] text-sky-200 hover:text-white border border-[#1E3A6D]'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Tizim Holati &amp; Xizmatlar</span>
        </button>
      </div>

      {/* Tab Mundarijasi */}
      <div className="pt-2">
        {activeTab === 'sub_admins' && <SubAdminPermissionsSection />}
        {activeTab === 'staff' && <StaffManager />}
        {activeTab === 'roles' && <RolePermissionMatrix />}
        {activeTab === 'system' && <SystemConfigHub />}
      </div>
    </div>
  );
};
