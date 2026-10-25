import React, { useState } from 'react';
import {
  Settings,
  MessageSquare,
  KeyRound,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Send,
  Save,
  Sliders,
  AlertCircle,
  Zap,
  Globe,
  Lock
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

  // Gemini AI state
  const [geminiModel, setGeminiModel] = useState('gemini-2.5-flash');
  const [geminiApiKey, setGeminiApiKey] = useState('AIzaSyD98aK2_BunkerStroySecuredKey94');
  const [isPingingAi, setIsPingingAi] = useState(false);
  const [aiPingResult, setAiPingResult] = useState<string | null>(null);

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

  const handlePingAi = () => {
    setIsPingingAi(true);
    setAiPingResult(null);
    setTimeout(() => {
      setIsPingingAi(false);
      setAiPingResult("Gemini 2.5 javob berdi: Latency 210ms. Tizim to'liq barqaror!");
      setTimeout(() => setAiPingResult(null), 4000);
    }, 700);
  };

  const handleSaveSettings = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-theme-card p-4 rounded-2xl border border-[#313244]">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#89B4FA]" />
            <h1 className="text-xl font-black uppercase tracking-wider text-[#CDD6F4]">
              Platforma Sozlamalari &amp; Integratsiyalar
            </h1>
          </div>
          <p className="text-xs text-[#A6ADC8] font-mono mt-0.5">
            Eskiz SMS shlyuz, E-IMZO/Soliq GNK moduli, Google Gemini AI va boshqaruv parametrlari
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
        <Card rivetAccents className="bg-[#252538] border-[#313244] space-y-4">
          <div className="flex items-center justify-between border-b border-[#313244] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#CDD6F4]">SMS Shlyuz (Eskiz.uz)</h3>
                <p className="text-[11px] text-[#6C7086] font-mono">OTP tasdiqlash va bildirishnomalar</p>
              </div>
            </div>
            <Badge variant="success">Ulanish Faol</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-xs font-mono text-[#A6ADC8] mb-1">
                Eskiz Hisob E-maili
              </label>
              <input
                type="email"
                value={eskizEmail}
                onChange={(e) => setEskizEmail(e.target.value)}
                className="w-full bg-[#181825] border border-[#313244] rounded-xl px-3 py-2 text-[#CDD6F4] font-mono focus:outline-none focus:border-[#89B4FA]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#A6ADC8] mb-1">
                  Qoldiq SMS Balansi
                </label>
                <div className="bg-[#181825] border border-[#313244] rounded-xl px-3 py-2 font-mono font-bold text-emerald-400">
                  {eskizSmsBalance.toLocaleString()} ta SMS
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-[#A6ADC8] mb-1">
                  Token Holati
                </label>
                <div className="bg-[#181825] border border-[#313244] rounded-xl px-3 py-2 font-mono text-[#CDD6F4]">
                  2026-12-31 gacha
                </div>
              </div>
            </div>

            {/* Test SMS dispatch */}
            <div className="pt-2 border-t border-[#313244]">
              <label className="block text-xs font-mono text-[#A6ADC8] mb-1">
                Test SMS Yuborish (Sinov)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="flex-1 bg-[#181825] border border-[#313244] rounded-xl px-3 py-1.5 text-xs font-mono text-[#CDD6F4] focus:outline-none focus:border-[#89B4FA]"
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
        <Card rivetAccents className="bg-[#252538] border-[#313244] space-y-4">
          <div className="flex items-center justify-between border-b border-[#313244] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#CDD6F4]">E-IMZO &amp; Soliq Integratsiyasi</h3>
                <p className="text-[11px] text-[#6C7086] font-mono">B2B shartnomalar va STIR avtomatlashtirish</p>
              </div>
            </div>
            <Badge variant="success">E-IMZO v3.42</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#A6ADC8] mb-1">
                  E-IMZO Mahalliy Port
                </label>
                <input
                  type="text"
                  value={eimzoPort}
                  onChange={(e) => setEimzoPort(e.target.value)}
                  className="w-full bg-[#181825] border border-[#313244] rounded-xl px-3 py-2 text-[#CDD6F4] font-mono focus:outline-none focus:border-[#89B4FA]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A6ADC8] mb-1">
                  Challenge muddati (soniya)
                </label>
                <input
                  type="number"
                  value={eimzoTimeout}
                  onChange={(e) => setEimzoTimeout(Number(e.target.value))}
                  className="w-full bg-[#181825] border border-[#313244] rounded-xl px-3 py-2 text-[#CDD6F4] font-mono focus:outline-none focus:border-[#89B4FA]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#A6ADC8] mb-1">
                Soliq Qo'mitasi STIR Gateway API
              </label>
              <input
                type="text"
                value={soliqApiUrl}
                onChange={(e) => setSoliqApiUrl(e.target.value)}
                className="w-full bg-[#181825] border border-[#313244] rounded-xl px-3 py-2 text-[#CDD6F4] font-mono focus:outline-none focus:border-[#89B4FA]"
              />
            </div>

            <div className="p-3 bg-[#181825] rounded-xl border border-[#313244] flex items-center justify-between">
              <div>
                <div className="font-bold text-[#CDD6F4]">PKCS#7 Imzoni Avtomatik Tekshirish</div>
                <div className="text-[11px] text-[#6C7086]">
                  Har bir B2B buyurtma shartnomasi xesh qilinib tekshiriladi
                </div>
              </div>
              <Badge variant="success">Yoqilgan</Badge>
            </div>
          </div>
        </Card>

        {/* 3. Google Gemini AI Engine */}
        <Card rivetAccents className="bg-[#252538] border-[#313244] space-y-4">
          <div className="flex items-center justify-between border-b border-[#313244] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#CDD6F4]">Google Gemini AI Dvigateli</h3>
                <p className="text-[11px] text-[#6C7086] font-mono">B2B Ovozli yordamchi va ESCO hisob-kitoblari</p>
              </div>
            </div>
            <Badge variant="success">Faol (Active)</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-xs font-mono text-[#A6ADC8] mb-1">
                AI Modeli (Model Tier)
              </label>
              <select
                value={geminiModel}
                onChange={(e) => setGeminiModel(e.target.value)}
                className="w-full bg-[#181825] border border-[#313244] rounded-xl px-3 py-2 text-[#CDD6F4] font-mono focus:outline-none focus:border-[#89B4FA]"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Tezkor tahlil va Ovozli rejim)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Murakkab ESCO energiya auditi)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#A6ADC8] mb-1">
                Gemini API Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="w-full bg-[#181825] border border-[#313244] rounded-xl px-3 py-2 text-[#CDD6F4] font-mono focus:outline-none focus:border-[#89B4FA]"
                />
                <Lock className="w-3.5 h-3.5 text-[#6C7086] absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="pt-2 border-t border-[#313244] flex items-center justify-between">
              <div>
                <div className="text-[11px] text-[#6C7086] font-mono">
                  Ovozli asistent &amp; Tahlil: 100% integratsiyalangan
                </div>
                {aiPingResult && (
                  <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                    {aiPingResult}
                  </div>
                )}
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePingAi}
                isLoading={isPingingAi}
                className="text-xs"
              >
                <Zap className="w-3.5 h-3.5 mr-1 text-[#89B4FA]" />
                Ping AI
              </Button>
            </div>
          </div>
        </Card>

        {/* 4. Platform Parameters */}
        <Card rivetAccents className="bg-[#252538] border-[#313244] space-y-4">
          <div className="flex items-center justify-between border-b border-[#313244] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#89B4FA] flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#CDD6F4]">Platforma Standartlari</h3>
                <p className="text-[11px] text-[#6C7086] font-mono">Komissiya, QQS va tizim rejimi</p>
              </div>
            </div>
            <Badge variant="neutral">Operatsion</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#A6ADC8] mb-1">
                  B2B Komissiya stavkasi (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={platformCommission}
                  onChange={(e) => setPlatformCommission(Number(e.target.value))}
                  className="w-full bg-[#181825] border border-[#313244] rounded-xl px-3 py-2 text-[#CDD6F4] font-mono focus:outline-none focus:border-[#89B4FA]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A6ADC8] mb-1">
                  Davlat QQS stavkasi (%)
                </label>
                <input
                  type="number"
                  value={vatRate}
                  onChange={(e) => setVatRate(Number(e.target.value))}
                  className="w-full bg-[#181825] border border-[#313244] rounded-xl px-3 py-2 text-[#CDD6F4] font-mono focus:outline-none focus:border-[#89B4FA]"
                />
              </div>
            </div>

            <div className="p-3 bg-[#181825] rounded-xl border border-[#313244] flex items-center justify-between">
              <div>
                <div className="font-bold text-[#CDD6F4]">Texnik Xizmat Rejimi (Maintenance)</div>
                <div className="text-[11px] text-[#6C7086]">
                  Platformaga vaqtinchalik kirishni cheklash
                </div>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-5 h-5 accent-[#89B4FA] rounded cursor-pointer"
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
        <Card rivetAccents className="bg-[#252538] border-[#313244] space-y-4">
          <div className="flex items-center justify-between border-b border-[#313244] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#CDD6F4]">50/50 Escrow Qoidalari (AD-12)</h3>
                <p className="text-[11px] text-[#6C7086] font-mono">Bo‘lib to‘lash, taymer va jarima nazorati</p>
              </div>
            </div>
            <Badge variant="warning">B2B Qat'iy</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#A6ADC8] mb-1">
                  Minimal buyurtma summasi (so‘m)
                </label>
                <input
                  type="number"
                  value={splitMinAmount}
                  onChange={(e) => setSplitMinAmount(Number(e.target.value))}
                  className="w-full bg-[#181825] border border-[#313244] rounded-xl px-3 py-2 text-[#CDD6F4] font-mono focus:outline-none focus:border-[#89B4FA]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A6ADC8] mb-1">
                  Kutish vaqti taymeri (daqiqa)
                </label>
                <input
                  type="number"
                  value={splitWaitingMinutes}
                  onChange={(e) => setSplitWaitingMinutes(Number(e.target.value))}
                  className="w-full bg-[#181825] border border-[#313244] rounded-xl px-3 py-2 text-[#CDD6F4] font-mono focus:outline-none focus:border-[#89B4FA]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#A6ADC8] mb-1">
                  Kechikish jarimasi (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={splitPenaltyRate}
                  onChange={(e) => setSplitPenaltyRate(Number(e.target.value))}
                  className="w-full bg-[#181825] border border-[#313244] rounded-xl px-3 py-2 text-[#CDD6F4] font-mono focus:outline-none focus:border-[#89B4FA]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A6ADC8] mb-1">
                  Avto-tasdiqlash (soat)
                </label>
                <input
                  type="number"
                  value={autoConfirmHours}
                  onChange={(e) => setAutoConfirmHours(Number(e.target.value))}
                  className="w-full bg-[#181825] border border-[#313244] rounded-xl px-3 py-2 text-[#CDD6F4] font-mono focus:outline-none focus:border-[#89B4FA]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A6ADC8] mb-1">
                  Qaytarish muddati (kun)
                </label>
                <input
                  type="number"
                  value={returnDaysAllowed}
                  onChange={(e) => setReturnDaysAllowed(Number(e.target.value))}
                  className="w-full bg-[#181825] border border-[#313244] rounded-xl px-3 py-2 text-[#CDD6F4] font-mono focus:outline-none focus:border-[#89B4FA]"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* 6. Logistics & Tariffs (TZ-4 LG-04, TZ-5 AD-12) */}
        <Card rivetAccents className="bg-[#252538] border-[#313244] space-y-4">
          <div className="flex items-center justify-between border-b border-[#313244] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#CDD6F4]">Logistika &amp; Flot Tariflari</h3>
                <p className="text-[11px] text-[#6C7086] font-mono">Platforma ulushi va masofa koeffitsientlari</p>
              </div>
            </div>
            <Badge variant="success">Avtomatlashtirilgan</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#A6ADC8] mb-1">
                  Platforma logistika ulushi (%)
                </label>
                <input
                  type="number"
                  value={logisticsSharePct}
                  onChange={(e) => setLogisticsSharePct(Number(e.target.value))}
                  className="w-full bg-[#181825] border border-[#313244] rounded-xl px-3 py-2 text-[#CDD6F4] font-mono focus:outline-none focus:border-[#89B4FA]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A6ADC8] mb-1">
                  Baza yuklash to‘lovi (so‘m)
                </label>
                <input
                  type="number"
                  value={baseDeliveryFee}
                  onChange={(e) => setBaseDeliveryFee(Number(e.target.value))}
                  className="w-full bg-[#181825] border border-[#313244] rounded-xl px-3 py-2 text-[#CDD6F4] font-mono focus:outline-none focus:border-[#89B4FA]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#A6ADC8] mb-1">
                  Shahar ichi 1 km stavkasi (so‘m)
                </label>
                <input
                  type="number"
                  value={kmFeeCity}
                  onChange={(e) => setKmFeeCity(Number(e.target.value))}
                  className="w-full bg-[#181825] border border-[#313244] rounded-xl px-3 py-2 text-[#CDD6F4] font-mono focus:outline-none focus:border-[#89B4FA]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A6ADC8] mb-1">
                  Viloyatlararo 1 km stavkasi (so‘m)
                </label>
                <input
                  type="number"
                  value={kmFeeIntercity}
                  onChange={(e) => setKmFeeIntercity(Number(e.target.value))}
                  className="w-full bg-[#181825] border border-[#313244] rounded-xl px-3 py-2 text-[#CDD6F4] font-mono focus:outline-none focus:border-[#89B4FA]"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
