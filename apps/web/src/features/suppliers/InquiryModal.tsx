import React, { useState } from 'react';
import { Modal, Input, Button, Alert } from '@bunkerstroy/ui';
import { ShieldCheck, Send } from 'lucide-react';
import type { FactoryPartner } from './types';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  factory: FactoryPartner | null;
  onSuccess: (message: string) => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  factory,
  onSuccess
}) => {
  const [companyName, setCompanyName] = useState('');
  const [stir, setStir] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [estimatedMonthlyVolume, setEstimatedMonthlyVolume] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !stir.trim() || !contactPhone.trim() || !estimatedMonthlyVolume.trim()) {
      setError("Iltimos, barcha majburiy maydonlarni (Kompaniya, STIR, Telefon, Oylik hajm) to'ldiring.");
      return;
    }

    if (stir.replace(/\D/g, '').length !== 9) {
      setError("STIR 9 ta raqamdan iborat bo'lishi shart.");
      return;
    }

    onSuccess(
      `"${companyName}" kompaniyasining ${factory?.name} zavodiga to'g'ridan-to'g'ri ulgurji shartnoma so'rovi qabul qilindi. Zavod sotuv bo'limi 2 soat ichida tijoriy taklif va temir yo'l yuklash rejasini taqdim etadi.`
    );
    onClose();
    setCompanyName('');
    setStir('');
    setContactPhone('');
    setEstimatedMonthlyVolume('');
    setError(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={factory ? `«${factory.name}» Bilan To‘g‘ridan-to‘g‘ri Shartnoma So‘rovi` : 'Shartnoma So‘rovi'}
      subtitle={factory ? `Rasmiy ishlab chiqaruvchi: ${factory.brandName} (${factory.inn})` : undefined}
      size="lg"
      footer={
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 w-full font-sans">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            <Send className="w-3.5 h-3.5 mr-1.5" />
            <span>Rasmiy So‘rovni Yuborish</span>
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans">
        {error && <Alert variant="error" description={error} />}

        <Alert
          variant="info"
          title="To‘g‘ridan-to‘g‘ri Zavod Kafolati"
          description="Ushbu so'rov to'g'ridan-to'g'ri zavodning yirik korporativ mijozlar bo'limiga yuboriladi. Hech qanday vositachilik komissiyasi olinmaydi."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Kompaniya (Yuridik Shaxs) Nomi *"
            placeholder="Masalan: Discover Invest MChJ"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            sizeVariant="sm"
          />

          <Input
            label="Soliq To‘lovchi STIR (9 xonali) *"
            placeholder="304829102"
            value={stir}
            onChange={(e) => setStir(e.target.value.replace(/\D/g, '').slice(0, 9))}
            isMono
            sizeVariant="sm"
            helperText="Davlat Soliq Qo‘mitasi bazasi orqali QQS to‘lovchi ekanligi tasdiqlanadi"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Aloqa Uchun Telefon *"
            placeholder="+998 (90) 123-45-67"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            sizeVariant="sm"
          />

          <Input
            label="Kutilayotgan Oylik Xarid Hajmi *"
            placeholder="Masalan: 1,500 tonna / oy"
            value={estimatedMonthlyVolume}
            onChange={(e) => setEstimatedMonthlyVolume(e.target.value)}
            sizeVariant="sm"
            helperText="Minimal partiya: 1 samosval yoki 1 temir yo‘l vagoni"
          />
        </div>

        <Alert
          variant="warning"
          icon={<ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />}
          description="Barcha rasmiy shartnomalar E-IMZO raqamli elektron imzosi orqali DIDX.uz elektron hujjat aylanish tizimida yuridik kuchga ega bo‘ladi."
        />
      </form>
    </Modal>
  );
};
