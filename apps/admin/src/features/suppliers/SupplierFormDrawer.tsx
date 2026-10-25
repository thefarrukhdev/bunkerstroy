import React, { useState, useEffect } from 'react';
import { SupplierCompany, MOCK_DSQ_DATABASE } from '../../mocks/suppliersMock';
import { SlideOverDrawer } from '../../components/SlideOverDrawer';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Switch } from '../../components/Switch';
import { Button } from '../../components/Button';
import { Building2, User, Phone, MapPin, Search, CheckCircle2, AlertCircle } from 'lucide-react';

interface SupplierFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<SupplierCompany, 'id' | 'productsCount' | 'totalTurnover' | 'rating' | 'registrationDate'>, id?: string) => void;
  initialData?: SupplierCompany | null;
}

const REGIONS = [
  { value: 'Toshkent shahri', label: 'Toshkent shahri' },
  { value: 'Toshkent viloyati', label: 'Toshkent viloyati' },
  { value: 'Samarqand viloyati', label: 'Samarqand viloyati' },
  { value: 'Farg‘ona viloyati', label: 'Farg‘ona viloyati' },
  { value: 'Andijon viloyati', label: 'Andijon viloyati' },
  { value: 'Namangan viloyati', label: 'Namangan viloyati' },
  { value: 'Buxoro viloyati', label: 'Buxoro viloyati' },
  { value: 'Navoiy viloyati', label: 'Navoiy viloyati' },
  { value: 'Qashqadaryo viloyati', label: 'Qashqadaryo viloyati' },
  { value: 'Surxondaryo viloyati', label: 'Surxondaryo viloyati' },
  { value: 'Xorazm viloyati', label: 'Xorazm viloyati' },
  { value: 'Jizzax viloyati', label: 'Jizzax viloyati' },
  { value: 'Sirdaryo viloyati', label: 'Sirdaryo viloyati' },
  { value: 'Qoraqalpog‘iston Respublikasi', label: 'Qoraqalpog‘iston Resp.' }
];

export const SupplierFormDrawer: React.FC<SupplierFormDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [inn, setInn] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [shortName, setShortName] = useState('');
  const [director, setDirector] = useState('');
  const [phone, setPhone] = useState('+998');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('Toshkent viloyati');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [vatPayer, setVatPayer] = useState(true);
  const [vatRegCode, setVatRegCode] = useState('');
  const [supplierType, setSupplierType] = useState<'LOCAL' | 'GLOBAL'>('LOCAL');
  const [error, setError] = useState<string | null>(null);
  const [isDsqAutoFilling, setIsDsqAutoFilling] = useState(false);

  useEffect(() => {
    if (initialData) {
      setInn(initialData.inn);
      setCompanyName(initialData.companyName);
      setShortName(initialData.shortName || '');
      setDirector(initialData.director);
      setPhone(initialData.phone);
      setEmail(initialData.email || '');
      setRegion(initialData.region);
      setDistrict(initialData.district || '');
      setAddress(initialData.address);
      setVatPayer(initialData.vatPayer);
      setVatRegCode(initialData.vatRegCode || '');
      setSupplierType(initialData.supplierType || 'LOCAL');
      setError(null);
    } else {
      setInn('');
      setCompanyName('');
      setShortName('');
      setDirector('');
      setPhone('+998');
      setEmail('');
      setRegion('Toshkent viloyati');
      setDistrict('');
      setAddress('');
      setVatPayer(true);
      setVatRegCode('');
      setSupplierType('LOCAL');
      setError(null);
    }
  }, [initialData, isOpen]);

  // STIR orqali DSQ dan avtomatik to'ldirish
  const handleAutoFillFromDsq = () => {
    const cleanInn = inn.trim();
    if (cleanInn.length !== 9) {
      setError('DSQ qidiruvi uchun 9 xonali STIR raqamini kiriting');
      return;
    }

    setIsDsqAutoFilling(true);
    setError(null);

    setTimeout(() => {
      const match = MOCK_DSQ_DATABASE[cleanInn];
      if (match) {
        setCompanyName(match.companyName);
        setDirector(match.director);
        setAddress(match.address);
        setVatPayer(match.vatPayer);
        setVatRegCode(match.vatRegCode || '');
      } else {
        setError('Ushbu STIR bo‘yicha DSQ bazasidan korxona topilmadi. Ma’lumotlarni qo‘lda kiriting.');
      }
      setIsDsqAutoFilling(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inn.trim() || inn.trim().length !== 9) {
      setError('STIR 9 ta raqamdan iborat bo‘lishi shart');
      return;
    }
    if (!companyName.trim()) {
      setError('Korxona nomini kiriting');
      return;
    }
    if (!director.trim()) {
      setError('Direktor / Rahbar ism-sharifini kiriting');
      return;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      setError('Bog‘lanish telefon raqamini to‘liq kiriting');
      return;
    }

    onSave(
      {
        inn: inn.trim(),
        companyName: companyName.trim(),
        shortName: shortName.trim() || undefined,
        director: director.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        region,
        district: district.trim() || undefined,
        address: address.trim() || 'Kiritilmagan',
        vatPayer,
        vatRegCode: vatPayer ? (vatRegCode.trim() || undefined) : undefined,
        supplierType,
        status: initialData ? initialData.status : 'PENDING',
        statusDescription: initialData ? initialData.statusDescription : 'Yangi ro‘yxatga olingan ta’minotchi (tekshiruvda)'
      },
      initialData?.id
    );

    onClose();
  };

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Ta'minotchi Ma'lumotlarini Tahrirlash" : "Yangi B2B Ta'minotchi Qo'shish"}
      subtitle="Davlat Soliq Qo‘mitasi va E-IMZO reestri"
      footer={
        <div className="flex items-center justify-end gap-2.5 w-full">
          <Button variant="outline" size="md" onClick={onClose} type="button">
            Bekor qilish
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit} type="button">
            {initialData ? 'Saqlash' : 'Ta’minotchini Qo‘shish'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-[var(--color-accent-red)]/15 border border-[var(--color-accent-red)]/30 text-[var(--color-accent-red)] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STIR & DSQ Fetch */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[var(--color-text-secondary)]">
            STIR / INN (9 xonali soliq raqami) *
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                placeholder="Masalan, 201122334"
                value={inn}
                maxLength={9}
                onChange={(e) => setInn(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            {!initialData && (
              <Button
                variant="secondary"
                size="md"
                type="button"
                isLoading={isDsqAutoFilling}
                onClick={handleAutoFillFromDsq}
                leftIcon={<Search className="w-4 h-4" />}
              >
                DSQ dan Qidirish
              </Button>
            )}
          </div>
          <p className="text-[11px] text-[var(--color-text-muted)]">
            STIR raqamini kiritib «DSQ dan Qidirish» tugmasini bossangiz, korxona nomi va rahbari avtomatik to‘ldiriladi.
          </p>
        </div>

        {/* Korxona Nomi */}
        <Input
          label="Korxona to‘liq yuridik nomi *"
          placeholder="«NOM» MChJ / AJ / QK"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          leftIcon={<Building2 className="w-4 h-4" />}
        />

        {/* Qisqa Nomi */}
        <Input
          label="Brend yoki qisqartirilgan nomi"
          placeholder="Masalan, TGSS MChJ"
          value={shortName}
          onChange={(e) => setShortName(e.target.value)}
        />

        {/* Rahbar */}
        <Input
          label="Direktor / Rahbar F.I.Sh. *"
          placeholder="Familiya Ism Sharif"
          value={director}
          onChange={(e) => setDirector(e.target.value)}
          leftIcon={<User className="w-4 h-4" />}
        />

        {/* Telefon & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Aloqa telefoni *"
            placeholder="+998 90 123 45 67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftIcon={<Phone className="w-4 h-4" />}
          />
          <Input
            label="Elektron pochta (Email)"
            placeholder="office@company.uz"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Viloyat & Aniq Manzil */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Viloyat"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            options={REGIONS}
          />
          <Input
            label="Tuman / Sh芸har"
            placeholder="Masalan, Zangiota tumani"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />
        </div>

        <Input
          label="Yuridik manzil (Ko‘cha, uy)"
          placeholder="Quruvchilar ko‘chasi, 45-uy"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          leftIcon={<MapPin className="w-4 h-4" />}
        />

        {/* Ta'minotchi Turi: Mahalliy vs Global (GT-09 / TZ-5) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[var(--color-text-secondary)]">
            Ta‘minotchi Turi (BunkerStroy Standarti) *
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSupplierType('LOCAL')}
              className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                supplierType === 'LOCAL'
                  ? 'bg-blue-500/15 border-blue-500 text-blue-400'
                  : 'bg-[var(--color-surface-hover)] border-[var(--color-border-subtle)] text-[var(--color-text-muted)]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Mahalliy Zavod</span>
            </button>
            <button
              type="button"
              onClick={() => setSupplierType('GLOBAL')}
              className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                supplierType === 'GLOBAL'
                  ? 'bg-amber-500/15 border-amber-500 text-amber-400'
                  : 'bg-[var(--color-surface-hover)] border-[var(--color-border-subtle)] text-[var(--color-text-muted)]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Global Importyor</span>
            </button>
          </div>
        </div>

        {/* QQS to'lovchisi */}
        <div className="p-3.5 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border-subtle)] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[var(--color-text-primary)]">
                QQS To‘lovchisi Maqomi
              </div>
              <div className="text-[11px] text-[var(--color-text-muted)]">
                Korxona 12% qo‘shilgan qiymat solig‘i to‘lovchisi hisoblanadimi?
              </div>
            </div>
            <Switch checked={vatPayer} onChange={setVatPayer} />
          </div>

          {vatPayer && (
            <Input
              label="QQS Ro‘yxat K审查 / Guvohnoma Raqami"
              placeholder="Masalan, 324001928374"
              value={vatRegCode}
              onChange={(e) => setVatRegCode(e.target.value)}
            />
          )}
        </div>
      </form>
    </SlideOverDrawer>
  );
};
