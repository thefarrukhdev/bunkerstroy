import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  UserPlus,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  Edit3,
  Trash2,
  Copy,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Layers,
  Terminal,
  Activity,
  UserCheck
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Switch } from '../../components/Switch';

export type AdminPermissionSection =
  | 'reports'
  | 'suppliers'
  | 'requests_customers'
  | 'b2b_crm'
  | 'b2c_crm';

export interface SubAdminCabinetAccount {
  id: string;
  cabinetName: string;
  login: string;
  password: string;
  permissions: AdminPermissionSection[];
  createdAt: string;
  isActive: boolean;
  lastLogin?: string;
}

export const ADMIN_PERMISSION_META: {
  id: AdminPermissionSection;
  label: string;
  shortLabel: string;
  description: string;
}[] = [
  {
    id: 'reports',
    label: 'Monitoring & Hisobotlar',
    shortLabel: 'Monitoring',
    description: 'BunkerStroy 14 hudud monitoringi, kassa tushumi va tahliliy hisobotlar',
  },
  {
    id: 'suppliers',
    label: "Ta'minotchilar & STIR Nazorati",
    shortLabel: "Ta'minotchilar",
    description: "B2B va B2C ta'minotchilar verifikatsiyasi, litsenziyalar va moderatsiya",
  },
  {
    id: 'requests_customers',
    label: "So'rovlar & Mijozlar",
    shortLabel: "Mijozlar",
    description: "Buyurtmalar oqimi, xaridor tashkilotlar va Escrow hisob-kitoblar nazorati",
  },
  {
    id: 'b2b_crm',
    label: 'B2B CRM (Zavodlar)',
    shortLabel: 'B2B CRM',
    description: "Ishlab chiqaruvchi zavodlar ulgurji savdolari, shartnomalar va partiyalar",
  },
  {
    id: 'b2c_crm',
    label: 'B2C CRM (Distribyutorlar)',
    shortLabel: 'B2C CRM',
    description: "Hamkor do‘konlar, chakana savdo omborlari va yetkazib berish nazorati",
  },
];

const SUB_ADMINS_STORAGE_KEY = 'bunkerstroy_sub_admins_v1';

const INITIAL_SUB_ADMINS_SEED: SubAdminCabinetAccount[] = [
  {
    id: 'subadmin-tashkent-1',
    cabinetName: 'Toshkent Bosh Dispecherlik Markazi',
    login: 'ADMIN.TOSHKENT',
    password: 'BUNKER_TSH_2026',
    permissions: ['reports', 'suppliers', 'requests_customers', 'b2b_crm', 'b2c_crm'],
    createdAt: '2026-09-01T08:00:00Z',
    isActive: true,
    lastLogin: 'Bugun 14:20'
  },
  {
    id: 'subadmin-samarkand-2',
    cabinetName: 'Samarqand & Navoiy Mintaqaviy Nazorati',
    login: 'ADMIN.SAMARQAND',
    password: 'BUNKER_SAM_998',
    permissions: ['reports', 'suppliers', 'b2b_crm'],
    createdAt: '2026-09-15T09:30:00Z',
    isActive: true,
    lastLogin: 'Bugun 11:45'
  },
  {
    id: 'subadmin-fergana-3',
    cabinetName: 'Vodiy Hududiy Logistika Admini',
    login: 'ADMIN.VODIY',
    password: 'BUNKER_FER_445',
    permissions: ['reports', 'requests_customers', 'b2c_crm'],
    createdAt: '2026-10-02T12:00:00Z',
    isActive: true,
    lastLogin: 'Kecha 18:10'
  }
];

export const SubAdminPermissionsSection: React.FC = () => {
  const [subAdmins, setSubAdmins] = useState<SubAdminCabinetAccount[]>(() => {
    try {
      const raw = localStorage.getItem(SUB_ADMINS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_SUB_ADMINS_SEED;
  });

  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states for creating new Sub-Admin
  const [newCabinetName, setNewCabinetName] = useState('');
  const [newLogin, setNewLogin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPermissions, setNewPermissions] = useState<AdminPermissionSection[]>([
    'reports',
    'suppliers'
  ]);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  // Form states for editing existing Sub-Admin
  const [editingSubAdmin, setEditingSubAdmin] = useState<SubAdminCabinetAccount | null>(null);
  const [editName, setEditName] = useState('');
  const [editLogin, setEditLogin] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editPermissions, setEditPermissions] = useState<AdminPermissionSection[]>([]);
  const [editError, setEditError] = useState<string | null>(null);

  // Sync to storage
  const persistSubAdmins = (list: SubAdminCabinetAccount[]) => {
    try {
      localStorage.setItem(SUB_ADMINS_STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('bunkerstroy_sub_admins_updated', { detail: list }));
    } catch (e) {
      console.error('Failed to save sub-admins:', e);
    }
  };

  const handleTogglePassword = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyCredentials = (admin: SubAdminCabinetAccount) => {
    const text = `BunkerStroy Admin Kabinet:\nNomi: ${admin.cabinetName}\nLogin: ${admin.login}\nParol: ${admin.password}`;
    navigator.clipboard.writeText(text);
    setCopiedId(admin.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleTogglePermissionForAdmin = (adminId: string, section: AdminPermissionSection) => {
    const updated = subAdmins.map((item) => {
      if (item.id !== adminId) return item;
      const exists = item.permissions.includes(section);
      const newPerms = exists
        ? item.permissions.filter((p) => p !== section)
        : [...item.permissions, section];
      return { ...item, permissions: newPerms };
    });
    setSubAdmins(updated);
    persistSubAdmins(updated);
  };

  const handleToggleActiveStatus = (adminId: string) => {
    const updated = subAdmins.map((item) => {
      if (item.id !== adminId) return item;
      return { ...item, isActive: !item.isActive };
    });
    setSubAdmins(updated);
    persistSubAdmins(updated);
  };

  const handleCreateSubAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    const name = newCabinetName.trim();
    const login = newLogin.trim().toUpperCase();
    const password = newPassword.trim();

    if (!name || !login || !password) {
      setCreateError("Kabinet nomi, login va parol to'ldirilishi shart.");
      return;
    }

    if (newPermissions.length === 0) {
      setCreateError("Kamida 1 ta bo'lim uchun ruxsat tanlanishi shart.");
      return;
    }

    if (subAdmins.some((a) => a.login.toUpperCase() === login)) {
      setCreateError(`«${login}» logini bilan sub-admin allaqachon mavjud!`);
      return;
    }

    const newAccount: SubAdminCabinetAccount = {
      id: `subadmin-${Date.now().toString(36)}`,
      cabinetName: name,
      login,
      password,
      permissions: [...newPermissions],
      createdAt: new Date().toISOString(),
      isActive: true,
      lastLogin: 'Hozirgina yaratildi'
    };

    const nextList = [newAccount, ...subAdmins];
    setSubAdmins(nextList);
    persistSubAdmins(nextList);

    setNewCabinetName('');
    setNewLogin('');
    setNewPassword('');
    setNewPermissions(['reports', 'suppliers']);
    setIsCreateOpen(false);
    setCreateSuccess(`«${name}» sub-admin kabineti muvaffaqiyatli yaratildi!`);
    setTimeout(() => setCreateSuccess(null), 3500);
  };

  const handleOpenEdit = (admin: SubAdminCabinetAccount) => {
    setEditingSubAdmin(admin);
    setEditName(admin.cabinetName);
    setEditLogin(admin.login);
    setEditPassword(admin.password);
    setEditPermissions([...admin.permissions]);
    setEditError(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubAdmin) return;

    const name = editName.trim();
    const login = editLogin.trim().toUpperCase();
    const password = editPassword.trim();

    if (!name || !login || !password) {
      setEditError("Barcha maydonlar to'ldirilishi kerak.");
      return;
    }

    if (editPermissions.length === 0) {
      setEditError("Kamida 1 ta ruxsat bo'limi tanlanishi shart.");
      return;
    }

    if (subAdmins.some((a) => a.id !== editingSubAdmin.id && a.login.toUpperCase() === login)) {
      setEditError(`«${login}» logini boshqa admin tomonidan band qilingan.`);
      return;
    }

    const updated = subAdmins.map((a) => {
      if (a.id !== editingSubAdmin.id) return a;
      return {
        ...a,
        cabinetName: name,
        login,
        password,
        permissions: [...editPermissions]
      };
    });

    setSubAdmins(updated);
    persistSubAdmins(updated);
    setEditingSubAdmin(null);
  };

  const handleDeleteSubAdmin = (id: string) => {
    const nextList = subAdmins.filter((a) => a.id !== id);
    setSubAdmins(nextList);
    persistSubAdmins(nextList);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#D95D1E]" />
            <h2 className="text-lg font-black text-white uppercase tracking-tight">
              Sub-Adminlar &amp; Bo‘limlar Ruxsatlar Matritsasi
            </h2>
          </div>
          <p className="text-xs text-slate-600 font-mono">
            Bunker Admin boshqaruv kabineti: Hududiy va funksional sub-adminlar uchun bo‘limlar ruxsati (AdminPermissionSection)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {createSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-200 text-emerald-600 text-xs font-bold animate-pulse">
              <CheckCircle2 className="w-4 h-4" />
              <span>{createSuccess}</span>
            </div>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Yangi Sub-Admin Qo‘shish
          </Button>
        </div>
      </div>

      {/* Ruxsatlar Matritsasi Tavsifi (5 Bo'lim) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {ADMIN_PERMISSION_META.map((meta) => (
          <div
            key={meta.id}
            className="p-3.5 rounded-xl bg-white border border-slate-200 text-left space-y-1 hover:border-[#D95D1E]/50 transition-colors shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-black text-[#D95D1E] uppercase">
                {meta.shortLabel}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#D95D1E]" />
            </div>
            <div className="text-xs font-black text-white">{meta.label}</div>
            <p className="text-[10px] text-slate-600 line-clamp-2 leading-relaxed font-sans">
              {meta.description}
            </p>
          </div>
        ))}
      </div>

      {/* Asosiy Ruxsatlar Matritsasi Jadvali */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#D95D1E]" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Mavjud Sub-Adminlar Ro‘yxati &amp; Huquqlar Jadvali
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600">
            Jami: <strong className="text-[#D95D1E]">{subAdmins.length} ta</strong> sub-admin
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[11px]">
                <th className="py-3 px-4 font-bold">Admin Kabinet Nomi</th>
                <th className="py-3 px-4 font-bold">Login &amp; Parol</th>
                {ADMIN_PERMISSION_META.map((m) => (
                  <th key={m.id} className="py-3 px-2 text-center font-bold">
                    {m.shortLabel}
                  </th>
                ))}
                <th className="py-3 px-3 text-center font-bold">Holati</th>
                <th className="py-3 px-4 text-right font-bold">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-900 font-sans">
              {subAdmins.map((admin) => {
                const isPassVisible = !!visiblePasswords[admin.id];
                const isCopied = copiedId === admin.id;

                return (
                  <tr key={admin.id} className="hover:bg-slate-100/40 transition-colors">
                    {/* Kabinet nomi */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-xs">{admin.cabinetName}</div>
                      <div className="text-[10px] text-slate-600 font-mono mt-0.5">
                        Oxirgi kirish: {admin.lastLogin || '—'}
                      </div>
                    </td>

                    {/* Login va Parol */}
                    <td className="py-3 px-4 font-mono text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-[#D95D1E]">
                        <span>{admin.login}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyCredentials(admin)}
                          title="Nusxalash"
                          className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-600 mt-0.5">
                        <span>{isPassVisible ? admin.password : '••••••••'}</span>
                        <button
                          type="button"
                          onClick={() => handleTogglePassword(admin.id)}
                          className="p-0.5 hover:text-slate-900 cursor-pointer text-slate-600"
                        >
                          {isPassVisible ? (
                            <EyeOff className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* 5 ta Bo'lim ruxsatlari (Interactive Toggles) */}
                    {ADMIN_PERMISSION_META.map((meta) => {
                      const hasPerm = admin.permissions.includes(meta.id);
                      return (
                        <td key={meta.id} className="py-3 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleTogglePermissionForAdmin(admin.id, meta.id)}
                            title={`${admin.cabinetName} uchun ${meta.label} huquqini o‘zgartirish`}
                            className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all cursor-pointer ${
                              hasPerm
                                ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-200 shadow-sm'
                                : 'bg-slate-50 text-slate-500 border border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            {hasPerm ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      );
                    })}

                    {/* Status Toggle */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActiveStatus(admin.id)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase cursor-pointer transition-all ${
                          admin.isActive
                            ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-200'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {admin.isActive ? 'FAOL' : 'BLOK'}
                      </button>
                    </td>

                    {/* Amallar */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(admin)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-[#D95D1E] border border-slate-200 cursor-pointer transition-colors"
                          title="Tahrirlash"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSubAdmin(admin.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 cursor-pointer transition-colors"
                          title="O‘chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yangi Sub-Admin Qo'shish Modali */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border-2 border-[#D95D1E] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#D95D1E]" />
                <h3 className="text-base font-black text-white uppercase">
                  Yangi Sub-Admin Kabinet Yaratish
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg bg-slate-50 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubAdmin} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-600 font-bold block">Kabinet Nomi:</label>
                <input
                  type="text"
                  placeholder="Masalan: Farg‘ona Logistika Nazorati"
                  value={newCabinetName}
                  onChange={(e) => setNewCabinetName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-white focus:outline-none focus:border-[#D95D1E]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold block">Kirish Logini:</label>
                  <input
                    type="text"
                    placeholder="ADMIN.FARGONA"
                    value={newLogin}
                    onChange={(e) => setNewLogin(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-white uppercase focus:outline-none focus:border-[#D95D1E]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-bold block">Kirish Paroli:</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Parol kiriting"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-3.5 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-white focus:outline-none focus:border-[#D95D1E]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Bo'limlar ruxsati (AdminPermissionSection) */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="text-slate-600 font-bold block">
                  Biriktiriladigan Bo‘limlar (Ruxsatlar Matritsasi):
                </label>
                <div className="space-y-2">
                  {ADMIN_PERMISSION_META.map((meta) => {
                    const isChecked = newPermissions.includes(meta.id);
                    return (
                      <label
                        key={meta.id}
                        onClick={() => {
                          setNewPermissions((prev) =>
                            isChecked ? prev.filter((p) => p !== meta.id) : [...prev, meta.id]
                          );
                        }}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-slate-100 border-[#D95D1E] text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 accent-[#D95D1E]"
                        />
                        <div>
                          <div className="font-black text-xs">{meta.label}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 font-sans">
                            {meta.description}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Bekor qilish
                </Button>
                <Button type="submit" variant="primary" size="md">
                  Kabinetni Yaratish
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sub-Adminni Tahrirlash Modali */}
      {editingSubAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#D95D1E]" />
                <h3 className="text-base font-black text-white uppercase">
                  Sub-Adminni Tahrirlash
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingSubAdmin(null)}
                className="p-1 rounded-lg bg-slate-50 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-600 font-bold block">Kabinet Nomi:</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-white focus:outline-none focus:border-[#D95D1E]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold block">Login:</label>
                  <input
                    type="text"
                    value={editLogin}
                    onChange={(e) => setEditLogin(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-white uppercase focus:outline-none focus:border-[#D95D1E]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-bold block">Parol:</label>
                  <input
                    type="text"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-white focus:outline-none focus:border-[#D95D1E]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="text-slate-600 font-bold block">
                  Bo‘limlar Ruxsati:
                </label>
                <div className="space-y-2">
                  {ADMIN_PERMISSION_META.map((meta) => {
                    const isChecked = editPermissions.includes(meta.id);
                    return (
                      <label
                        key={meta.id}
                        onClick={() => {
                          setEditPermissions((prev) =>
                            isChecked ? prev.filter((p) => p !== meta.id) : [...prev, meta.id]
                          );
                        }}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-slate-100 border-[#D95D1E] text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 accent-[#D95D1E]"
                        />
                        <div>
                          <div className="font-black text-xs">{meta.label}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 font-sans">
                            {meta.description}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setEditingSubAdmin(null)}
                >
                  Bekor qilish
                </Button>
                <Button type="submit" variant="primary" size="md">
                  Saqlash
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
