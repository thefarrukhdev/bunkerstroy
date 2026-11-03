import React, { useState } from 'react';
import { Modal, Input, Select, Button, Alert } from '@bunkerstroy/ui';
import { Send } from 'lucide-react';
import type { GlobalPartner } from './types';

interface GlobalInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: GlobalPartner | null;
  onSuccess: (message: string) => void;
}

export const GlobalInquiryModal: React.FC<GlobalInquiryModalProps> = ({
  isOpen,
  onClose,
  partner,
  onSuccess
}) => {
  const [companyName, setCompanyName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [customsStation, setCustomsStation] = useState('Toshkent-Tovarniy (TY: 722400)');
  const [globalMaterial, setGlobalMaterial] = useState(partner?.materials[0] || '');
  const [globalVolume, setGlobalVolume] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactPhone.trim() || !globalMaterial.trim() || !globalVolume.trim()) {
      setError("Iltimos, barcha maydonlarni (Kompaniya, Telefon, Xomashyo, Hajm) to'ldiring.");
      return;
    }

    onSuccess(
      `"${companyName}" kompaniyasining ${partner?.name} (${partner?.country}) korxonasiga to'g'ridan-to'g'ri xalqaro import va tranzit arizasi qabul qilindi. Bojxona stansiyasi: ${customsStation}. Xalqaro savdo departamenti 24 soat ichida bog'lanadi.`
    );
    onClose();
    setCompanyName('');
    setContactPhone('');
    setGlobalMaterial('');
    setGlobalVolume('');
    setError(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Global Bunker: Xalqaro Import &amp; Tranzit Shartnomasi So‘rovi"
      subtitle={
        partner
          ? `${partner.name} (${partner.country}) korxonasiga to‘g‘ridan-to‘g‘ri import arizasi`
          : undefined
      }
      size="lg"
      footer={
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 w-full font-sans">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            <Send className="w-3.5 h-3.5 mr-1.5" />
            <span>Arizani Tasdiqlash &amp; Yuborish</span>
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans">
        {error && <Alert variant="error" description={error} />}

        <Alert
          variant="info"
          title="Xalqaro Tranzit &amp; Bojxona Kafolati"
          description="BunkerStroy xalqaro savdo departamenti tovarlarni yuklash punktidan to O‘zbekiston bojxona postlarigacha temir yo‘l va avto tranzitini to‘liq nazorat qiladi."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Kompaniya yoki Buyurtmachi Nomi *"
            placeholder="Masalan: Tashkent Steel Trading MChJ"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            sizeVariant="sm"
          />

          <Input
            label="Mas'ul Shaxs Telefon Raqami *"
            placeholder="+998 (90) 123-45-67"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            sizeVariant="sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Talab Qilingan Xomashyo / Marka *"
            placeholder="Masalan: Shveller 20, Katanka 6.5mm"
            value={globalMaterial}
            onChange={(e) => setGlobalMaterial(e.target.value)}
            sizeVariant="sm"
          />

          <Input
            label="Talab Qilingan Partiya Hajmi *"
            placeholder="Masalan: 5 ta temir yo‘l vagoni (350 tonna)"
            value={globalVolume}
            onChange={(e) => setGlobalVolume(e.target.value)}
            sizeVariant="sm"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Qabul Qilish &amp; Bojxona Stansiyasi:
          </label>
          <Select
            sizeVariant="sm"
            value={customsStation}
            onChange={(e) => setCustomsStation(e.target.value)}
            options={[
              { value: 'Toshkent-Tovarniy (TY: 722400)', label: 'Toshkent-Tovarniy (TY kodi: 722400)' },
              { value: 'Chuqursoy Bojxona Posti (TY: 720000)', label: 'Chuqursoy Bojxona Posti (TY kodi: 720000)' },
              { value: 'Sergeli Logistika Markazi (TY: 723507)', label: 'Sergeli Logistika Markazi (TY kodi: 723507)' },
              { value: 'Samarqand Temir Yo‘l Stansiyasi', label: 'Samarqand Temir Yo‘l Stansiyasi' },
              { value: 'Navoiy EIZ Erkin Bojxona Hududi', label: 'Navoiy EIZ Erkin Bojxona Hududi' }
            ]}
          />
        </div>
      </form>
    </Modal>
  );
};
