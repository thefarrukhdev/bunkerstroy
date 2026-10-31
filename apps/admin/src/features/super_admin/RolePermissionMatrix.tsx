import React, { useState } from 'react';
import { RoleDefinition, INITIAL_ROLE_DEFINITIONS, RolePermission } from '../../mocks/superAdminMock';
import { Switch } from '../../components/Switch';
import { Button } from '../../components/Button';
import { Shield, ShieldCheck, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';

export const RolePermissionMatrix: React.FC = () => {
  const [roles, setRoles] = useState<RoleDefinition[]>(INITIAL_ROLE_DEFINITIONS);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(INITIAL_ROLE_DEFINITIONS[0].id);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const activeRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  const handleTogglePermission = (moduleKey: string, field: keyof Omit<RolePermission, 'moduleKey' | 'moduleName'>) => {
    if (activeRole.role === 'SUPER_ADMIN') {
      // Super Admin huquqlari tahrirlanmaydi (tizim xavfsizligi)
      return;
    }

    setRoles((prev) =>
      prev.map((role) => {
        if (role.id !== activeRole.id) return role;
        return {
          ...role,
          permissions: role.permissions.map((perm) => {
            if (perm.moduleKey !== moduleKey) return perm;
            return {
              ...perm,
              [field]: !perm[field]
            };
          })
        };
      })
    );
  };

  const handleSaveMatrix = () => {
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleResetToDefault = () => {
    const defaultRole = INITIAL_ROLE_DEFINITIONS.find((r) => r.id === activeRole.id);
    if (!defaultRole) return;
    setRoles((prev) =>
      prev.map((r) => (r.id === activeRole.id ? JSON.parse(JSON.stringify(defaultRole)) : r))
    );
  };

  return (
    <div className="space-y-6">
      {/* Yuqori panel: Rol tanlash tablari */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--color-border-subtle)]">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--color-accent-blue)]" />
            Rollar va Huquqlar Matritsasi (RBAC)
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Har bir lavozim uchun admin paneldagi amallar va ruxsatlarni boshqarish
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-accent-green)]/15 border border-[var(--color-accent-green)]/30 text-[var(--color-accent-green)] text-xs font-semibold animate-pulse">
              <CheckCircle2 className="w-4 h-4" />
              <span>Muvaffaqiyatli saqlandi!</span>
            </div>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleResetToDefault}
            disabled={activeRole.role === 'SUPER_ADMIN'}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Tiklash
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveMatrix}
            leftIcon={<ShieldCheck className="w-4 h-4" />}
          >
            Saqlash
          </Button>
        </div>
      </div>

      {/* Rol tanlash tugmalari */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {roles.map((r) => {
          const isSelected = r.id === activeRole.id;
          return (
            <button
              key={r.id}
              onClick={() => setSelectedRoleId(r.id)}
              className={`p-3.5 rounded-xl text-left transition-all border ${
                isSelected
                  ? 'bg-[var(--color-surface-hover)] border-[var(--color-accent-blue)] shadow-md shadow-[var(--color-accent-blue)]/5'
                  : 'bg-[var(--color-surface-card)] border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent-blue)]">
                  {r.role}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--color-surface-bg)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)]">
                  {r.usersCount} xodim
                </span>
              </div>
              <div className="text-sm font-semibold text-[var(--color-text-primary)]">
                {r.name}
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-1">
                {r.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Tanlangan rol haqida eslatma */}
      {activeRole.role === 'SUPER_ADMIN' ? (
        <div className="p-4 rounded-xl bg-[var(--color-accent-blue)]/10 border border-[var(--color-accent-blue)]/30 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[var(--color-accent-blue)] shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-semibold text-[var(--color-text-primary)]">
              Tizim Bosh Administratori (Super Admin)
            </div>
            <p className="text-[var(--color-text-secondary)] mt-0.5">
              Ushbu rol platformaning to‘liq boshqaruv yadrosi bo‘lib, barcha modullarga so‘zsiz to‘liq ruxsatga ega. Xavfsizlik qoidalariga ko‘ra uning huquqlarini cheklash taqiqlanadi.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-[var(--color-accent-yellow)]/10 border border-[var(--color-accent-yellow)]/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[var(--color-accent-yellow)] shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-semibold text-[var(--color-text-primary)]">
              {activeRole.name} huquqlarini o‘zgartirish
            </div>
            <p className="text-[var(--color-text-secondary)] mt-0.5">
              Ushbu roldagi xodimlarning paneldagi amallari darhol yangilanadi. O‘zgarishlarni kuchga kiritish uchun «Saqlash» tugmasini bosing.
            </p>
          </div>
        </div>
      )}

      {/* Ruxsatlar jadvali */}
      <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-bg)]/60 text-xs font-semibold text-[var(--color-text-secondary)]">
                <th className="py-3.5 px-4 font-medium">Boshqaruv Moduli</th>
                <th className="py-3.5 px-4 text-center font-medium">Ko‘rish (View)</th>
                <th className="py-3.5 px-4 text-center font-medium">Qo‘shish (Create)</th>
                <th className="py-3.5 px-4 text-center font-medium">Tahrirlash (Edit)</th>
                <th className="py-3.5 px-4 text-center font-medium">O‘chirish (Delete)</th>
                <th className="py-3.5 px-4 text-center font-medium">Tasdiqlash (Approve)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)] text-xs">
              {activeRole.permissions.map((perm) => (
                <tr
                  key={perm.moduleKey}
                  className="hover:bg-[var(--color-surface-hover)]/50 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-sm text-[var(--color-text-primary)]">
                      {perm.moduleName}
                    </div>
                    <div className="text-[11px] font-mono text-[var(--color-text-muted)]">
                      id: {perm.moduleKey}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center justify-center">
                      <Switch
                        checked={perm.canView}
                        disabled={activeRole.role === 'SUPER_ADMIN'}
                        onChange={() => handleTogglePermission(perm.moduleKey, 'canView')}
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center justify-center">
                      <Switch
                        checked={perm.canCreate}
                        disabled={activeRole.role === 'SUPER_ADMIN' || !perm.canView}
                        onChange={() => handleTogglePermission(perm.moduleKey, 'canCreate')}
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center justify-center">
                      <Switch
                        checked={perm.canEdit}
                        disabled={activeRole.role === 'SUPER_ADMIN' || !perm.canView}
                        onChange={() => handleTogglePermission(perm.moduleKey, 'canEdit')}
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center justify-center">
                      <Switch
                        checked={perm.canDelete}
                        disabled={activeRole.role === 'SUPER_ADMIN' || !perm.canView}
                        onChange={() => handleTogglePermission(perm.moduleKey, 'canDelete')}
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center justify-center">
                      <Switch
                        checked={perm.canApprove}
                        disabled={activeRole.role === 'SUPER_ADMIN' || !perm.canView}
                        onChange={() => handleTogglePermission(perm.moduleKey, 'canApprove')}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
