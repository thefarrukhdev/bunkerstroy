import React, { useState } from 'react';
import { KpiStatCard } from '../../components/KpiStatCard';
import { StaffManager } from './StaffManager';
import { RolePermissionMatrix } from './RolePermissionMatrix';
import { SystemConfigHub } from './SystemConfigHub';
import { INITIAL_STAFF_MEMBERS, INITIAL_ROLE_DEFINITIONS, INITIAL_SYSTEM_CONFIG } from '../../mocks/superAdminMock';
import { Users, Shield, Cpu, UserCheck, ShieldAlert, Activity } from 'lucide-react';

type SuperAdminTab = 'staff' | 'roles' | 'system';

export const SuperAdminHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SuperAdminTab>('staff');

  const totalStaff = INITIAL_STAFF_MEMBERS.length;
  const activeStaff = INITIAL_STAFF_MEMBERS.filter((s) => s.status === 'ACTIVE').length;
  const totalRoles = INITIAL_ROLE_DEFINITIONS.length;
  const operationalServices = INITIAL_SYSTEM_CONFIG.services.filter((s) => s.status === 'OPERATIONAL').length;
  const totalServices = INITIAL_SYSTEM_CONFIG.services.length;

  return (
    <div className="space-y-6">
      {/* Sahifa sarlavhasi */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Super Admin Boshqaruv Markazi
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Bunkerstroy platformasi xodimlari, RBAC xavfsizlik rollari va tizim integratsiyalarini boshqarish
        </p>
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
          change="7 ta modulga biriktirilgan"
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
      <div className="flex border-b border-[var(--color-border-subtle)] space-x-1">
        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'staff'
              ? 'border-[var(--color-accent-blue)] text-[var(--color-accent-blue)] bg-[var(--color-surface-hover)]/40 rounded-t-lg'
              : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-subtle)]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Xodimlar Ro‘yxati ({totalStaff})</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'roles'
              ? 'border-[var(--color-accent-blue)] text-[var(--color-accent-blue)] bg-[var(--color-surface-hover)]/40 rounded-t-lg'
              : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-subtle)]'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Rollar & Huquqlar Matritsasi</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'system'
              ? 'border-[var(--color-accent-blue)] text-[var(--color-accent-blue)] bg-[var(--color-surface-hover)]/40 rounded-t-lg'
              : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-subtle)]'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Tizim Holati & Integratsiyalar</span>
        </button>
      </div>

      {/* Tab Mundarijasi */}
      <div className="pt-2">
        {activeTab === 'staff' && <StaffManager />}
        {activeTab === 'roles' && <RolePermissionMatrix />}
        {activeTab === 'system' && <SystemConfigHub />}
      </div>
    </div>
  );
};
