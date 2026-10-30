import React, { useState } from 'react';
import {
  Settings,
  MessageSquare,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Send,
  Save,
  Sliders,
  AlertCircle,
  Globe
} from 'lucide-react';
import { Card, Badge, Button } from '@bunkerstroy/ui';

export const PlatformSettings: React.FC = () => {
  // SMS Gateway state
  const [eskizEmail, setEskizEmail] = useState('admin@bunkerstroy.uz');
  const [eskizSmsBalance, setEskizSmsBalance] = useState(18450);
  const [testPhone, setTestPhone] = useState('+998 90 123 45 67');
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [smsTestSuccess, setSmsTestSuccess] = useState(false);

  // E-IMZO state
  const [eimzoPort, setEimzoPort] = useState('64443');
  const [soliqApiUrl, setSoliqApiUrl] = useState('https://soliq.uz/api/v1/inn');
  const [eimzoTimeout, setEimzoTimeout] = useState(300);

  // General settings state
  const [platformCommission, setPlatformCommission] = useState(1.5);
  const [vatRate, setVatRate] = useState(12);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  // 50/50 Escrow Rules (TZ-5 AD-12)
  const [splitMinAmount, setSplitMinAmount] = useState(5000000);
  const [splitWaitingMinutes, setSplitWaitingMinutes] = useState(30);
  const [splitPenaltyRate, setSplitPenaltyRate] = useState(2.0);
  const [autoConfirmHours, setAutoConfirmHours] = useState(24);
  const [returnDaysAllowed, setReturnDaysAllowed] = useState(14);

  // Logistics & Tariffs (TZ-4 LG-04, TZ-5 AD-12)
  const [logisticsSharePct, setLogisticsSharePct] = useState(10);
  const [baseDeliveryFee, setBaseDeliveryFee] = useState(150000);
  const [kmFeeCity, setKmFeeCity] = useState(12000);
  const [kmFeeIntercity, setKmFeeIntercity] = useState(9000);

  const handleSendTestSms = () => {
    setIsSendingSms(true);
    setTimeout(() => {
      setIsSendingSms(false);
      setSmsTestSuccess(true);
      setTimeout(() => setSmsTestSuccess(false), 3000);
    }, 800);
  };

  const handleSaveSettings = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-theme-card p-4 rounded-2xl border border-[#1E3A6D]">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#FFB800]" />
            <h1 className="text-xl font-black uppercase tracking-wider text-[#F5F5F2]">
              Platforma Sozlamalari &amp; Integratsiyalar
            </h1>
          </div>
          <p className="text-xs text-[#BAE6FD] font-mono mt-0.5">
            Eskiz SMS shlyuz, E-IMZO/Soliq GNK moduli va boshqaruv parametrlari
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedNotification && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 animate-pulse">
              <CheckCircle2 className="w-4 h-4" /> Sozlamalar saqlandi!
            </span>
          )}
          <Button variant="primary" size="sm" onClick={handleSaveSettings} className="h-9">
            <Save className="w-4 h-4 mr-1.5" />
            Barchasini Saqlash
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. SMS Gateway (Eskiz) */}
        <Card rivetAccents className="bg-[#0A1931] border-[#1E3A6D] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E3A6D] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#F5F5F2]">SMS Shlyuz (Eskiz.uz)</h3>
                <p className="text-[11px] text-[#6C7086] font-mono">OTP tasdiqlash va bildirishnomalar</p>
              </div>
            </div>
            <Badge variant="success">Ulanish Faol</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-xs font-mono text-[#BAE6FD] mb-1">
                Eskiz Hisob E-maili
              </label>
              <input
                type="email"
                value={eskizEmail}
                onChange={(e) => setEskizEmail(e.target.value)}
                className="w-full bg-[#071326] border border-[#1E3A6D] rounded-xl px-3 py-2 text-[#F5F5F2] font-mono focus:outline-none focus:border-[#FFB800]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#BAE6FD] mb-1">
                  Qoldiq SMS Balansi
                </label>
                <div className="bg-[#071326] border border-[#1E3A6D] rounded-xl px-3 py-2 font-mono font-bold text-emerald-400">
                  {eskizSmsBalance.toLocaleString()} ta SMS
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-[#BAE6FD] mb-1">
                  Token Holati
                </label>
                <div className="bg-[#071326] border border-[#1E3A6D] rounded-xl px-3 py-2 font-mono text-[#F5F5F2]">
                  2026-12-31 gacha
                </div>
              </div>
            </div>

            {/* Test SMS dispatch */}
            <div className="pt-2 border-t border-[#1E3A6D]">
              <label className="block text-xs font-mono text-[#BAE6FD] mb-1">
                Test SMS Yuborish (Sinov)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="flex-1 bg-[#071326] border border-[#1E3A6D] rounded-xl px-3 py-1.5 text-xs font-mono text-[#F5F5F2] focus:outline-none focus:border-[#FFB800]"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSendTestSms}
                  isLoading={isSendingSms}
                  className="text-xs"
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  Yuborish
                </Button>
              </div>
              {smsTestSuccess && (
                <div className="text-[11px] text-emerald-400 font-mono mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Test SMS muvaffaqiyatli jo'natildi!
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* 2. E-IMZO & Soliq GNK */}
        <Card rivetAccents className="bg-[#0A1931] border-[#1E3A6D] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E3A6D] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#F5F5F2]">E-IMZO &amp; Soliq Integratsiyasi</h3>
                <p className="text-[11px] text-[#6C7086] font-mono">B2B shartnomalar va STIR avtomatlashtirish</p>
              </div>
            </div>
            <Badge variant="success">E-IMZO v3.42</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#BAE6FD] mb-1">
                  E-IMZO Mahalliy Port
                </label>
                <input
                  type="text"
                  value={eimzoPort}
                  onChange={(e) => setEimzoPort(e.target.value)}
                  className="w-full bg-[#071326] border border-[#1E3A6D] rounded-xl px-3 py-2 text-[#F5F5F2] font-mono focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#BAE6FD] mb-1">
                  Challenge muddati (soniya)
                </label>
                <input
                  type="number"
                  value={eimzoTimeout}
                  onChange={(e) => setEimzoTimeout(Number(e.target.value))}
                  className="w-full bg-[#071326] border border-[#1E3A6D] rounded-xl px-3 py-2 text-[#F5F5F2] font-mono focus:outline-none focus:border-[#FFB800]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#BAE6FD] mb-1">
                Soliq Qo'mitasi STIR Gateway API
              </label>
              <input
                type="text"
                value={soliqApiUrl}
                onChange={(e) => setSoliqApiUrl(e.target.value)}
                className="w-full bg-[#071326] border border-[#1E3A6D] rounded-xl px-3 py-2 text-[#F5F5F2] font-mono focus:outline-none focus:border-[#FFB800]"
              />
            </div>

            <div className="p-3 bg-[#071326] rounded-xl border border-[#1E3A6D] flex items-center justify-between">
              <div>
                <div className="font-bold text-[#F5F5F2]">PKCS#7 Imzoni Avtomatik Tekshirish</div>
                <div className="text-[11px] text-[#6C7086]">
                  Har bir B2B buyurtma shartnomasi xesh qilinib tekshiriladi
                </div>
              </div>
              <Badge variant="success">Yoqilgan</Badge>
            </div>
          </div>
        </Card>

        {/* 3. Platform Parameters */}
        <Card rivetAccents className="bg-[#0A1931] border-[#1E3A6D] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E3A6D] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#FFB800] flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#F5F5F2]">Platforma Standartlari</h3>
                <p className="text-[11px] text-[#6C7086] font-mono">Komissiya, QQS va tizim rejimi</p>
              </div>
            </div>
            <Badge variant="neutral">Operatsion</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#BAE6FD] mb-1">
                  B2B Komissiya stavkasi (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={platformCommission}
                  onChange={(e) => setPlatformCommission(Number(e.target.value))}
                  className="w-full bg-[#071326] border border-[#1E3A6D] rounded-xl px-3 py-2 text-[#F5F5F2] font-mono focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#BAE6FD] mb-1">
                  Davlat QQS stavkasi (%)
                </label>
                <input
                  type="number"
                  value={vatRate}
                  onChange={(e) => setVatRate(Number(e.target.value))}
                  className="w-full bg-[#071326] border border-[#1E3A6D] rounded-xl px-3 py-2 text-[#F5F5F2] font-mono focus:outline-none focus:border-[#FFB800]"
                />
              </div>
            </div>

            <div className="p-3 bg-[#071326] rounded-xl border border-[#1E3A6D] flex items-center justify-between">
              <div>
                <div className="font-bold text-[#F5F5F2]">Texnik Xizmat Rejimi (Maintenance)</div>
                <div className="text-[11px] text-[#6C7086]">
                  Platformaga vaqtinchalik kirishni cheklash
                </div>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-5 h-5 accent-[#FFB800] rounded cursor-pointer"
              />
            </div>

            {maintenanceMode && (
              <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-[11px] text-red-400 font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Diqqat! Texnik xizmat rejimi yoqildi. Mijozlar vaqtinchalik kirishdan to'xtatiladi.
              </div>
            )}
          </div>
        </Card>

        {/* 5. 50/50 Escrow Rules (TZ-5 AD-12) */}
        <Card rivetAccents className="bg-[#0A1931] border-[#1E3A6D] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E3A6D] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#F5F5F2]">50/50 Escrow Qoidalari (AD-12)</h3>
                <p className="text-[11px] text-[#6C7086] font-mono">Bo‘lib to‘lash, taymer va jarima nazorati</p>
              </div>
            </div>
            <Badge variant="warning">B2B Qat'iy</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#BAE6FD] mb-1">
                  Minimal buyurtma summasi (so‘m)
                </label>
                <input
                  type="number"
                  value={splitMinAmount}
                  onChange={(e) => setSplitMinAmount(Number(e.target.value))}
                  className="w-full bg-[#071326] border border-[#1E3A6D] rounded-xl px-3 py-2 text-[#F5F5F2] font-mono focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#BAE6FD] mb-1">
                  Kutish vaqti taymeri (daqiqa)
                </label>
                <input
                  type="number"
                  value={splitWaitingMinutes}
                  onChange={(e) => setSplitWaitingMinutes(Number(e.target.value))}
                  className="w-full bg-[#071326] border border-[#1E3A6D] rounded-xl px-3 py-2 text-[#F5F5F2] font-mono focus:outline-none focus:border-[#FFB800]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#BAE6FD] mb-1">
                  Kechikish jarimasi (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={splitPenaltyRate}
                  onChange={(e) => setSplitPenaltyRate(Number(e.target.value))}
                  className="w-full bg-[#071326] border border-[#1E3A6D] rounded-xl px-3 py-2 text-[#F5F5F2] font-mono focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#BAE6FD] mb-1">
                  Avto-tasdiqlash (soat)
                </label>
                <input
                  type="number"
                  value={autoConfirmHours}
                  onChange={(e) => setAutoConfirmHours(Number(e.target.value))}
                  className="w-full bg-[#071326] border border-[#1E3A6D] rounded-xl px-3 py-2 text-[#F5F5F2] font-mono focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#BAE6FD] mb-1">
                  Qaytarish muddati (kun)
                </label>
                <input
                  type="number"
                  value={returnDaysAllowed}
                  onChange={(e) => setReturnDaysAllowed(Number(e.target.value))}
                  className="w-full bg-[#071326] border border-[#1E3A6D] rounded-xl px-3 py-2 text-[#F5F5F2] font-mono focus:outline-none focus:border-[#FFB800]"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* 6. Logistics & Tariffs (TZ-4 LG-04, TZ-5 AD-12) */}
        <Card rivetAccents className="bg-[#0A1931] border-[#1E3A6D] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E3A6D] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#F5F5F2]">Logistika &amp; Flot Tariflari</h3>
                <p className="text-[11px] text-[#6C7086] font-mono">Platforma ulushi va masofa koeffitsientlari</p>
              </div>
            </div>
            <Badge variant="success">Avtomatlashtirilgan</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#BAE6FD] mb-1">
                  Platforma logistika ulushi (%)
                </label>
                <input
                  type="number"
                  value={logisticsSharePct}
                  onChange={(e) => setLogisticsSharePct(Number(e.target.value))}
                  className="w-full bg-[#071326] border border-[#1E3A6D] rounded-xl px-3 py-2 text-[#F5F5F2] font-mono focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#BAE6FD] mb-1">
                  Baza yuklash to‘lovi (so‘m)
                </label>
                <input
                  type="number"
                  value={baseDeliveryFee}
                  onChange={(e) => setBaseDeliveryFee(Number(e.target.value))}
                  className="w-full bg-[#071326] border border-[#1E3A6D] rounded-xl px-3 py-2 text-[#F5F5F2] font-mono focus:outline-none focus:border-[#FFB800]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#BAE6FD] mb-1">
                  Shahar ichi 1 km stavkasi (so‘m)
                </label>
                <input
                  type="number"
                  value={kmFeeCity}
                  onChange={(e) => setKmFeeCity(Number(e.target.value))}
                  className="w-full bg-[#071326] border border-[#1E3A6D] rounded-xl px-3 py-2 text-[#F5F5F2] font-mono focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#BAE6FD] mb-1">
                  Viloyatlararo 1 km stavkasi (so‘m)
                </label>
                <input
                  type="number"
                  value={kmFeeIntercity}
                  onChange={(e) => setKmFeeIntercity(Number(e.target.value))}
                  className="w-full bg-[#071326] border border-[#1E3A6D] rounded-xl px-3 py-2 text-[#F5F5F2] font-mono focus:outline-none focus:border-[#FFB800]"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
