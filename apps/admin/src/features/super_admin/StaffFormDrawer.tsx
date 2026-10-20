import React, { useState, useEffect } from 'react';
import { SlideOverDrawer } from '../../components/SlideOverDrawer';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { StaffMember } from '../../mocks/superAdminMock';
import { User, Phone, Mail, Building, Shield } from 'lucide-react';

interface StaffFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (staff: Omit<StaffMember, 'id' | 'createdAt' | 'lastLogin'>, id?: string) => void;
  initialData?: StaffMember | null;
}

export const StaffFormDrawer: React.FC<StaffFormDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'SUPER_ADMIN' | 'ADMIN' | 'FINANCE' | 'LOGISTICS' | 'MODERATOR'>('ADMIN');
  const [department, setDepartment] = useState('');
  const [inn, setInn] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFullName(initialData.fullName);
      setPhone(initialData.phone);
      setEmail(initialData.email);
      setRole(initialData.role);
      setDepartment(initialData.department);
      setInn(initialData.inn || '');
    } else {
      setFullName('');
      setPhone('+998');
      setEmail('');
      setRole('ADMIN');
      setDepartment('');
      setInn('');
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Xodimning to'liq ism-sharifini kiriting");
      return;
    }
    if (!phone || phone.length < 9) {
      setError("Telefon raqami to'liq kiritilishi shart");
      return;
    }

    onSave(
      {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        role,
        department: department.trim() || 'Boshqaruv',
        inn: inn.trim() || undefined,
        status: initialData ? initialData.status : 'ACTIVE'
      },
      initialData?.id
    );

    onClose();
  };

  const roleOptions = [
    { value: 'SUPER_ADMIN', label: 'Super Administrator (To‘liq huquq)' },
    { value: 'ADMIN', label: 'Boshqaruvchi Administrator (B2B Savdo)' },
    { value: 'FINANCE', label: 'Moliyachi & Kassa Nazorati' },
    { value: 'LOGISTICS', label: 'Logistika Dispecheri (HOWO/Shacman)' },
    { value: 'MODERATOR', label: 'Muvofiqlik Moderatori (STIR/E-IMZO)' }
  ];

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Xodim Ma'lumotlarini Tahrirlash" : "Yangi Ma'mur / Xodim Qo'shish"}
      subtitle="BunkerStroy Enterprise RBAC ruxsatlar tizimi"
      footer={
        <div className="flex items-center justify-end gap-2.5 w-full">
          <Button variant="outline" size="md" onClick={onClose} type="button">
            Bekor qilish
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit} type="button">
            {initialData ? "Saqlash" : "Xodimni Yaratish"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-[#F38BA8]/15 border border-[#F38BA8]/30 text-[#F38BA8] text-xs font-mono">
            {error}
          </div>
        )}

        <Input
          label="To'liq Ism-Sharifi"
          placeholder="Farrukh Jumayev"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          leftIcon={<User className="w-4 h-4" />}
          required
        />

        <Input
          label="Telefon Raqami (Login)"
          placeholder="+998901234567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          leftIcon={<Phone className="w-4 h-4" />}
          required
        />

        <Input
          label="Elektron Pochta"
          type="email"
          placeholder="admin@bunkerstroy.uz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <Select
          label="Tizimdagi Roli (RBAC)"
          value={role}
          onChange={(e) => setRole(e.target.value as any)}
          options={roleOptions}
        />

        <Input
          label="Bo'lim / Vazifasi"
          placeholder="B2B Operatsiyalar & Savdo"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          leftIcon={<Building className="w-4 h-4" />}
        />

        <Input
          label="STIR / INN (Yuridik xodim bo'lsa)"
          placeholder="201122334 (9 ta raqam)"
          maxLength={9}
          value={inn}
          onChange={(e) => setInn(e.target.value)}
          leftIcon={<Shield className="w-4 h-4" />}
          helperText="Davlat soliq bazasi bilan avtomatik bog'lash uchun ixtiyoriy"
        />
      </form>
    </SlideOverDrawer>
  );
};
