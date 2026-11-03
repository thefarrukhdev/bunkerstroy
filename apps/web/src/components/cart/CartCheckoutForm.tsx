import React, { useState } from 'react';
import {
  Truck,
  Building,
  CreditCard,
  Banknote,
  FileText,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  Bookmark,
  Check,
  Plus
} from 'lucide-react';
import { Input, Select } from '@bunkerstroy/ui';
import { UZBEKISTAN_REGIONS } from '../navbar/constants';
import type { ConstructionSite } from './types';

interface CartCheckoutFormProps {
  buyerName: string;
  setBuyerName: (val: string) => void;
  buyerPhone: string;
  setBuyerPhone: (val: string) => void;
  secondaryPhone: string;
  setSecondaryPhone: (val: string) => void;
  showSecondaryPhone: boolean;
  setShowSecondaryPhone: (val: boolean) => void;
  buyerInn: string;
  setBuyerInn: (val: string) => void;
  deliveryMethod: 'COURIER' | 'PICKUP';
  setDeliveryMethod: (val: 'COURIER' | 'PICKUP') => void;
  vehicleType: string;
  setVehicleType: (val: string) => void;
  region: string;
  setRegion: (val: string) => void;
  district: string;
  setDistrict: (val: string) => void;
  streetAddress: string;
  setStreetAddress: (val: string) => void;
  landmark: string;
  setLandmark: (val: string) => void;
  paymentMethod: 'CASH_ON_DELIVERY' | 'PAYME' | 'CLICK' | 'BANK_TRANSFER';
  setPaymentMethod: (val: 'CASH_ON_DELIVERY' | 'PAYME' | 'CLICK' | 'BANK_TRANSFER') => void;
  paymentMode: 'FULL_100' | 'SPLIT_50_50';
  setPaymentMode: (val: 'FULL_100' | 'SPLIT_50_50') => void;
  savedSites: ConstructionSite[];
  selectedSiteId: string;
  onSelectSite: (site: ConstructionSite) => void;
  onSaveCurrentSite: (name: string) => void;
  availableDistricts: string[];
}

export const CartCheckoutForm: React.FC<CartCheckoutFormProps> = ({
  buyerName,
  setBuyerName,
  buyerPhone,
  setBuyerPhone,
  secondaryPhone,
  setSecondaryPhone,
  showSecondaryPhone,
  setShowSecondaryPhone,
  buyerInn,
  setBuyerInn,
  deliveryMethod,
  setDeliveryMethod,
  vehicleType,
  setVehicleType,
  region,
  setRegion,
  district,
  setDistrict,
  streetAddress,
  setStreetAddress,
  landmark,
  setLandmark,
  paymentMethod,
  setPaymentMethod,
  paymentMode,
  setPaymentMode,
  savedSites,
  selectedSiteId,
  onSelectSite,
  onSaveCurrentSite,
  availableDistricts,
}) => {
  const [isAddingSite, setIsAddingSite] = useState(false);
  const [newSiteName, setNewSiteName] = useState('');
  const [siteSavedSuccess, setSiteSavedSuccess] = useState(false);

  const handleSaveSiteClick = () => {
    if (!newSiteName.trim()) return;
    onSaveCurrentSite(newSiteName.trim());
    setNewSiteName('');
    setIsAddingSite(false);
    setSiteSavedSuccess(true);
    setTimeout(() => setSiteSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-5 font-sans">
      {/* 1. Quick Construction Site Selector (MJ-02) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-[#D95D1E]" />
            <span>Qurilish Obyektini Tanlash:</span>
          </label>
          <button
            type="button"
            onClick={() => setIsAddingSite(!isAddingSite)}
            className="text-[11px] font-bold text-[#D95D1E] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Yangi Obyekt Qo‘shish</span>
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {savedSites.map((site) => {
            const isSelected = selectedSiteId === site.id;
            return (
              <button
                key={site.id}
                type="button"
                onClick={() => onSelectSite(site)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer border text-left ${
                  isSelected
                    ? 'bg-[#D95D1E] text-white border-[#B43B06] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold">{site.name}</div>
                <div className={`text-[10px] truncate max-w-[150px] ${isSelected ? 'text-orange-100' : 'text-slate-400'}`}>
                  {site.district}
                </div>
              </button>
            );
          })}
        </div>

        {isAddingSite && (
          <div className="p-3 bg-orange-50/60 border border-orange-200 rounded-xl space-y-2 animate-in fade-in-50 duration-150">
            <span className="text-[11px] font-bold text-slate-800 block">Joriy manzilni saqlash:</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Obyekt nomi (masalan: Chilonzor Blok 5)"
                value={newSiteName}
                onChange={(e) => setNewSiteName(e.target.value)}
                className="flex-1 h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#D95D1E]"
              />
              <button
                type="button"
                onClick={handleSaveSiteClick}
                className="px-3 h-9 bg-[#D95D1E] hover:bg-[#B43B06] text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                Saqlash
              </button>
            </div>
          </div>
        )}

        {siteSavedSuccess && (
          <div className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-lg flex items-center gap-1.5 font-medium animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Obyekt muvaffaqiyatli saqlandi!</span>
          </div>
        )}
      </div>

      {/* 2. Delivery Method (Yetkazib berish usuli) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-800 block">
          Yetkazib Berish Usuli *
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDeliveryMethod('COURIER')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
              deliveryMethod === 'COURIER'
                ? 'bg-orange-50/80 border-[#D95D1E] text-slate-900 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              deliveryMethod === 'COURIER' ? 'bg-[#D95D1E] text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold">Obyektgacha Yetkazish</div>
              <div className="text-[10px] text-slate-500">Zavod / Diler transporti</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDeliveryMethod('PICKUP')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
              deliveryMethod === 'PICKUP'
                ? 'bg-orange-50/80 border-[#D95D1E] text-slate-900 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              deliveryMethod === 'PICKUP' ? 'bg-[#D95D1E] text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              <Building className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold">O‘zi Olib Ketish</div>
              <div className="text-[10px] text-slate-500">Zavod omboridan (Samovivoz)</div>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Receiver Information */}
      <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-[#D95D1E]" />
          <span>Qabul Qiluvchi Ma’lumotlari</span>
        </h4>

        <div className="space-y-3">
          <Input
            label="F.I.O. yoki Korxona Nomi *"
            placeholder="Masalan: Jamshid Karimov yoki «Grand Qurilish» MCHJ"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Telefon Raqami *"
              placeholder="+998 90 123 45 67"
              value={buyerPhone}
              onChange={(e) => setBuyerPhone(e.target.value)}
              required
            />

            <Input
              label="STIR / INN (Yuridik shaxslar uchun)"
              placeholder="Masalan: 304819234"
              value={buyerInn}
              onChange={(e) => setBuyerInn(e.target.value)}
            />
          </div>

          {!showSecondaryPhone ? (
            <button
              type="button"
              onClick={() => setShowSecondaryPhone(true)}
              className="text-[11px] font-bold text-[#D95D1E] hover:underline cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Qo‘shimcha telefon raqami (Prorab / Dispetcher)</span>
            </button>
          ) : (
            <Input
              label="Qo‘shimcha Telefon Raqami (Prorab / Dispetcher)"
              placeholder="+998 93 987 65 43"
              value={secondaryPhone}
              onChange={(e) => setSecondaryPhone(e.target.value)}
            />
          )}
        </div>
      </div>

      {/* 4. Delivery Address Details (only if COURIER) */}
      {deliveryMethod === 'COURIER' && (
        <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#D95D1E]" />
            <span>Yetkazib Berish Manzili</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Viloyat / Shahar *"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              options={UZBEKISTAN_REGIONS.filter(r => r !== 'Barcha viloyatlar').map(r => ({ value: r, label: r }))}
            />

            <Select
              label="Tuman / Shahar *"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              options={availableDistricts.map(d => ({ value: d, label: d }))}
            />
          </div>

          <Input
            label="Ko‘cha, Bino / Uchastka Raqami *"
            placeholder="Masalan: Amir Temur shox ko‘chasi, 12-bino"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            required
          />

          <Input
            label="Mo‘ljal (Haydovchi tez topishi uchun)"
            placeholder="Masalan: Maktab yonidagi yangi ko‘p qavatli bino"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
          />

          <Select
            label="Tavsiya Qilinadigan Transport Turi"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            options={[
              { value: 'Standart Kuryer / Gazel', label: 'Gazel (3 tonnagacha)' },
              { value: 'Isuzu Bortli (10t)', label: 'Isuzu Bortli (10 tonnagacha)' },
              { value: 'HOWO Samosval (25t)', label: 'HOWO Samosval (25 tonna)' },
              { value: 'Fura / Tirkama (30+ tonna)', label: 'Fura / Tirkama (30+ tonna)' }
            ]}
          />
        </div>
      )}

      {/* 5. Payment Model: 100% vs 50/50 Escrow */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-800 block">
          To‘lov Shakli &amp; Escrow Xavfsizligi *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPaymentMode('SPLIT_50_50')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
              paymentMode === 'SPLIT_50_50'
                ? 'bg-emerald-50/80 border-emerald-400 text-slate-900 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>50/50 Xavfsiz Escrow (Tavsiya)</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              50% avans, qolgan 50% esa yuk yetib kelib, PIN-kod tasdiqlangach to‘lanadi.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMode('FULL_100')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
              paymentMode === 'FULL_100'
                ? 'bg-orange-50/80 border-[#D95D1E] text-slate-900 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="text-xs font-bold text-slate-900">100% Oldindan To‘lov</div>
            <p className="text-[11px] text-slate-500 leading-tight">
              To‘liq summa onlayn yechiladi va rasmiy elektron chek taqdim etiladi.
            </p>
          </button>
        </div>
      </div>

      {/* 6. Payment Instrument Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-800 block">
          To‘lov Usuli *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'PAYME', label: 'Payme', icon: CreditCard },
            { id: 'CLICK', label: 'Click', icon: CreditCard },
            { id: 'BANK_TRANSFER', label: 'Bank H/R', icon: FileText },
            { id: 'CASH_ON_DELIVERY', label: 'Naqd Pul', icon: Banknote },
          ].map((m) => {
            const isSelected = paymentMethod === m.id;
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaymentMethod(m.id as any)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-[#D95D1E] text-white border-[#B43B06] font-bold shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
