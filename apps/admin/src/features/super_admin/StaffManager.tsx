import React, { useState } from 'react';
import { StaffMember, INITIAL_STAFF_MEMBERS } from '../../mocks/superAdminMock';
import { DataTable, Column } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { ConfirmModal } from '../../components/ConfirmModal';
import { StaffFormDrawer } from './StaffFormDrawer';
import { UserPlus, Edit3, ShieldAlert, ShieldCheck, Trash2, Phone, Mail } from 'lucide-react';

export const StaffManager: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF_MEMBERS);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Modal states
  const [blockModalTarget, setBlockModalTarget] = useState<StaffMember | null>(null);
  const [deleteModalTarget, setDeleteModalTarget] = useState<StaffMember | null>(null);

  const handleSaveStaff = (data: Omit<StaffMember, 'id' | 'createdAt' | 'lastLogin'>, id?: string) => {
    if (id) {
      // Edit existing
      setStaffList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data } : item))
      );
    } else {
      // Create new
      const newStaff: StaffMember = {
        id: `staff-${Date.now()}`,
        ...data,
        lastLogin: 'Hali kirmagan',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setStaffList((prev) => [newStaff, ...prev]);
    }
  };

  const handleToggleBlock = () => {
    if (!blockModalTarget) return;
    const newStatus = blockModalTarget.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    setStaffList((prev) =>
      prev.map((item) =>
        item.id === blockModalTarget.id ? { ...item, status: newStatus } : item
      )
    );
    setBlockModalTarget(null);
  };

  const handleDeleteStaff = () => {
    if (!deleteModalTarget) return;
    setStaffList((prev) => prev.filter((item) => item.id !== deleteModalTarget.id));
    setDeleteModalTarget(null);
  };

  const columns: Column<StaffMember>[] = [
    {
      key: 'fullName',
      header: 'Xodim',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FFB800]/15 border border-[#FFB800]/40 text-[#FFB800] flex items-center justify-center font-bold font-mono text-xs">
            {row.fullName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-theme-main">{row.fullName}</div>
            <div className="text-[11px] text-theme-subtle flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <span>{row.email || 'Pochta yo‘q'}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Roli (RBAC)',
      sortable: true,
      render: (row) => {
        const roleLabels: Record<string, { label: string; color: string }> = {
          SUPER_ADMIN: { label: 'SUPER ADMIN', color: 'bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]/50 font-black' },
          ADMIN: { label: 'ADMIN', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
          FINANCE: { label: 'MOLIYA', color: 'bg-[#A6E3A1]/15 text-[#A6E3A1] border-[#A6E3A1]/30' },
          LOGISTICS: { label: 'LOGISTIKA', color: 'bg-[#FAB387]/15 text-[#FAB387] border-[#FAB387]/30' },
          MODERATOR: { label: 'MODERATOR', color: 'bg-[#F9E2AF]/15 text-[#F9E2AF] border-[#F9E2AF]/30' }
        };
        const config = roleLabels[row.role] || { label: row.role, color: 'bg-theme-card text-theme-muted' };

        return (
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border uppercase ${config.color}`}>
            {config.label}
          </span>
        );
      }
    },
    {
      key: 'department',
      header: 'Bo‘limi',
      sortable: true,
      render: (row) => <span className="text-theme-muted text-xs">{row.department}</span>
    },
    {
      key: 'phone',
      header: 'Telefon',
      render: (row) => (
        <span className="font-mono text-xs text-theme-main flex items-center gap-1.5">
          <Phone className="w-3 h-3 text-theme-subtle" />
          {row.phone}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Holati',
      sortable: true,
      render: (row) => (
        <StatusBadge
          status={row.status}
          customLabel={row.status === 'ACTIVE' ? 'FAOL' : 'BLOKLANGAN'}
        />
      )
    },
    {
      key: 'lastLogin',
      header: 'Oxirgi Kirish',
      sortable: true,
      render: (row) => <span className="text-theme-subtle text-xs font-mono">{row.lastLogin}</span>
    },
    {
      key: 'actions',
      header: 'Amallar',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setEditingStaff(row);
              setIsDrawerOpen(true);
            }}
            title="Tahrirlash"
            className="p-1.5 rounded-lg text-theme-subtle hover:text-[#FFB800] hover:bg-theme-card-subtle transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {row.role !== 'SUPER_ADMIN' && (
            <>
              <button
                onClick={() => setBlockModalTarget(row)}
                title={row.status === 'ACTIVE' ? 'Hisobni muzlatish' : 'Blokdan chiqarish'}
                className="p-1.5 rounded-lg text-theme-subtle hover:text-[#F9E2AF] hover:bg-theme-card-subtle transition-colors cursor-pointer"
              >
                {row.status === 'ACTIVE' ? (
                  <ShieldAlert className="w-4 h-4 text-[#F38BA8]" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-[#A6E3A1]" />
                )}
              </button>

              <button
                onClick={() => setDeleteModalTarget(row)}
                title="Xodimni o‘chirish"
                className="p-1.5 rounded-lg text-theme-subtle hover:text-[#F38BA8] hover:bg-theme-card-subtle transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Staff DataTable */}
      <DataTable
        columns={columns}
        data={staffList}
        searchPlaceholder="Ism, telefon, rol yoki bo‘lim bo‘yicha qidiruv..."
        emptyTitle="Hech qanday ma'mur yoki xodim topilmadi"
        emptyDescription="Yangi xodim qo'shish tugmasi orqali ma'murlarni ro'yxatga oling."
        actionsSlot={
          <Button
            variant="primary"
            size="md"
            leftIcon={<UserPlus className="w-4 h-4" />}
            onClick={() => {
              setEditingStaff(null);
              setIsDrawerOpen(true);
            }}
          >
            Yangi Xodim Qo‘shish
          </Button>
        }
      />

      {/* Staff Form Drawer */}
      <StaffFormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveStaff}
        initialData={editingStaff}
      />

      {/* Block/Unblock Confirm Modal */}
      <ConfirmModal
        isOpen={!!blockModalTarget}
        onClose={() => setBlockModalTarget(null)}
        onConfirm={handleToggleBlock}
        isDangerous={blockModalTarget?.status === 'ACTIVE'}
        title={
          blockModalTarget?.status === 'ACTIVE'
            ? "Xodim hisobini muzlatish"
            : "Xodimni blokdan chiqarish"
        }
        description={
          blockModalTarget?.status === 'ACTIVE'
            ? `${blockModalTarget?.fullName} nomli xodim tizimdan vaqtinchalik chetlatiladi va uning tokenlari bekor qilinadi. Ishonchingiz komilmi?`
            : `${blockModalTarget?.fullName} nomli xodimga qayta kirish huquqi tiklanadi.`
        }
        confirmText={
          blockModalTarget?.status === 'ACTIVE' ? "Hisobni Muzlatish" : "Faollashtirish"
        }
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteModalTarget}
        onClose={() => setDeleteModalTarget(null)}
        onConfirm={handleDeleteStaff}
        isDangerous={true}
        title="Xodimni Butunlay O‘chirish"
        description={`${deleteModalTarget?.fullName} xodimlar ro'yxatidan o'chiriladi. Bu amalni qaytarib bo'lmaydi.`}
        confirmText="O‘chirilsin"
      />
    </div>
  );
};
