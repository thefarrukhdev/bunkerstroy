import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShieldCheck,
  Phone,
  Building2,
  Fingerprint,
  Lock,
  Smartphone,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { Button, Badge } from '@bunkerstroy/ui';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

type AuthMode = 'otp' | 'login' | 'stir' | 'eimzo';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('otp');

  // OTP state
  const [phone, setPhone] = useState('+998 ');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Password state
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  // STIR state
  const [inn, setInn] = useState('201122334');
  const [companyInfo, setCompanyInfo] = useState<any>(null);

  // Common status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 60-second cooldown timer for SMS OTP
  useEffect(() => {
    if (cooldown > 0) {
      timerRef.current = setTimeout(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [cooldown]);

  // Clean error when changing tab
  const handleTabChange = (mode: AuthMode) => {
    setAuthMode(mode);
    setError(null);
    setInfoMessage(null);
  };

  // Phone input mask / formatter (+998 XX XXX-XX-XX)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const digitsOnly = rawValue.replace(/\D/g, '');

    // Always maintain Uzbekistan prefix +998
    let numbers = digitsOnly;
    if (numbers.startsWith('998')) {
      numbers = numbers.slice(3);
    }

    // Limit to 9 local digits
    numbers = numbers.slice(0, 9);

    let formatted = '+998';
    if (numbers.length > 0) formatted += ' ' + numbers.slice(0, 2);
    if (numbers.length > 2) formatted += ' ' + numbers.slice(2, 5);
    if (numbers.length > 5) formatted += '-' + numbers.slice(5, 7);
    if (numbers.length > 7) formatted += '-' + numbers.slice(7, 9);

    setPhone(formatted);
  };

  const getCleanPhone = () => {
    const clean = phone.replace(/[^\d+]/g, '');
    return clean.startsWith('+') ? clean : `+${clean}`;
  };

  // 1. Send SMS OTP
  const handleSendOtp = async () => {
    const cleanPhone = getCleanPhone();
    if (cleanPhone.length < 13) {
      setError("Iltimos, to'liq telefon raqamingizni kiriting (+998 XX XXX-XX-XX)");
      return;
    }

    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setOtpSent(true);
        setCooldown(60);
        setInfoMessage('SMS tasdiqlash kodi telefoningizga yuborildi');
      } else {
        setError(json.message || json.error || 'SMS kod yuborishda xatolik yuz berdi');
      }
    } catch {
      setError('Server bilan ulanishda xato. Qayta urinib ko‘ring.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify SMS OTP
  const handleVerifyOtp = async () => {
    const cleanPhone = getCleanPhone();
    const cleanCode = otpCode.trim();

    if (cleanCode.length !== 6) {
      setError('Iltimos, 6 xonali tasdiqlash kodini to‘liq kiriting');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone, code: cleanCode }),
      });

      const json = await res.json();
      if (res.ok && json.success && json.data) {
        const token = json.data.token;
        if (token) {
          localStorage.setItem('bunkerstroy_token', token);
        }
        onSuccess(json.data.user);
        onClose();
      } else {
        setError(json.message || json.error || 'Tasdiqlash kodi noto‘g‘ri yoki muddati o‘tgan');
      }
    } catch {
      setError('Tasdiqlashda xatolik yuz berdi. Internet aloqasini tekshiring.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Password Login
  const handlePasswordLogin = async () => {
    if (!login.trim() || !password.trim()) {
      setError('Login va parol kiritilishi shart');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: login.trim(), password }),
      });

      const json = await res.json();
      if (res.ok && json.success && json.data) {
        localStorage.setItem('bunkerstroy_token', json.data.token);
        onSuccess(json.data.user);
        onClose();
      } else {
        setError(json.message || json.error || 'Login yoki parol noto‘g‘ri');
      }
    } catch {
      setError('Server bilan ulanishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  // 4. STIR Lookup
  const handleStirLookup = async () => {
    if (!inn || inn.length < 9) {
      setError('9 xonali STIR (INN) raqamini kiriting');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/auth/stir-lookup?inn=${encodeURIComponent(inn)}`);
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setCompanyInfo(json.data);
      } else {
        setError(json.message || json.error || 'Soliq bazasida ushbu STIR topilmadi');
      }
    } catch {
      setError('Soliq serveri bilan aloqa uzildi');
    } finally {
      setLoading(false);
    }
  };

  // 5. E-IMZO Login
  const handleEimzoLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const chRes = await fetch('/api/auth/eimzo/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inn }),
      });
      const chData = await chRes.json();

      if (!chRes.ok || !chData.success) {
        throw new Error(chData.message || 'Challenge yaratib bo‘lmadi');
      }

      const vfRes = await fetch('/api/auth/eimzo/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: chData.data.challengeId,
          pkcs7B64: 'MIAGCSqGSIb3DQEHAqCAMIACAQExCzAJBgUrDgMCGgUAMIAGCSqGSIb3DQEHAQAA',
          inn,
        }),
      });

      const vfData = await vfRes.json();
      if (vfRes.ok && vfData.success && vfData.data) {
        localStorage.setItem('bunkerstroy_token', vfData.data.token);
        const user = vfData.data.user || vfData.data.verification;
        onSuccess(user);
        onClose();
      } else {
        setError(vfData.message || vfData.error || 'E-IMZO imzosini tekshirish muvaffaqiyatsiz tugadi');
      }
    } catch (err: any) {
      setError(err?.message || 'E-IMZO tizimida xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-bunker-surface-1 border border-bunker-border-strong rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-bunker-text-secondary hover:text-bunker-text-primary cursor-pointer transition-colors"
          aria-label="Yopish"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <Badge variant="warning" className="gap-1.5 mb-2 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            BunkerStroy B2B Identity
          </Badge>
          <h2 className="text-xl font-black text-bunker-text-primary">Kabinetga Kirish</h2>
          <p className="text-xs text-bunker-text-secondary mt-1">
            Xarid qilish, buyurtmalar tarixi, transport dispetcherligi va ESCO auditi
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 bg-bunker-base p-1 rounded-xl border border-bunker-border-strong text-[11px] font-semibold text-bunker-text-secondary font-mono">
          <button
            onClick={() => handleTabChange('otp')}
            className={`py-2 px-1 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
              authMode === 'otp' ? 'bg-bunker-surface-2 text-bunker-amber-500 shadow-sm font-bold' : 'hover:text-bunker-text-primary'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>SMS OTP</span>
          </button>
          <button
            onClick={() => handleTabChange('login')}
            className={`py-2 px-1 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
              authMode === 'login' ? 'bg-bunker-surface-2 text-bunker-amber-500 shadow-sm font-bold' : 'hover:text-bunker-text-primary'
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>Parol</span>
          </button>
          <button
            onClick={() => handleTabChange('stir')}
            className={`py-2 px-1 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
              authMode === 'stir' ? 'bg-bunker-surface-2 text-bunker-amber-500 shadow-sm font-bold' : 'hover:text-bunker-text-primary'
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span>STIR</span>
          </button>
          <button
            onClick={() => handleTabChange('eimzo')}
            className={`py-2 px-1 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
              authMode === 'eimzo' ? 'bg-bunker-surface-2 text-bunker-amber-500 shadow-sm font-bold' : 'hover:text-bunker-text-primary'
            }`}
          >
            <Fingerprint className="w-3 h-3" />
            <span>E-IMZO</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Info Alert */}
        {infoMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-400 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* TAB 1: SMS OTP Authentication */}
        {authMode === 'otp' && (
          <div className="space-y-4">
            {!otpSent ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-bunker-text-secondary mb-1.5 font-mono">
                    Telefon raqamingiz:
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="+998 90 123-45-67"
                      className="w-full bg-bunker-base border border-bunker-border-strong focus:border-bunker-amber-500 p-3 rounded-xl text-sm font-mono text-bunker-text-primary outline-none tracking-wide transition-colors"
                    />
                  </div>
                  <p className="text-[11px] text-bunker-text-muted mt-1.5 font-mono">
                    SMS orqali 6 xonali bir martalik tasdiqlash kodi yuboriladi.
                  </p>
                </div>

                <Button
                  className="w-full"
                  size="md"
                  onClick={handleSendOtp}
                  isLoading={loading}
                >
                  <Smartphone className="w-4 h-4 mr-1.5" />
                  <span>SMS Kodni Yuborish</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-bunker-base border border-bunker-border-strong p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-bunker-amber-500" />
                    <span className="text-xs font-mono font-bold text-bunker-text-primary">{phone}</span>
                  </div>
                  <button
                    onClick={() => {
                      setOtpSent(false);
                      setOtpCode('');
                      setError(null);
                      setInfoMessage(null);
                    }}
                    className="text-[11px] text-bunker-amber-500 hover:underline cursor-pointer font-mono"
                  >
                    O'zgartirish
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-bunker-text-secondary mb-1.5 font-mono">
                    SMS tasdiqlash kodi:
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="w-full bg-bunker-base border border-bunker-border-strong focus:border-bunker-amber-500 p-3 rounded-xl text-center text-xl font-mono text-bunker-amber-500 tracking-[0.5em] outline-none transition-colors"
                  />
                  <p className="text-[11px] text-bunker-text-muted mt-1 text-center font-mono">
                    💡 Test kodi: <span className="text-bunker-amber-500 font-bold">123456</span>
                  </p>
                </div>

                <Button
                  className="w-full"
                  size="md"
                  onClick={handleVerifyOtp}
                  isLoading={loading}
                  disabled={otpCode.length !== 6}
                >
                  <ArrowRight className="w-4 h-4 mr-1.5" />
                  <span>Tasdiqlash va Kirish</span>
                </Button>

                <div className="text-center">
                  {cooldown > 0 ? (
                    <span className="text-xs text-bunker-text-muted font-mono flex items-center justify-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-bunker-amber-500" />
                      Kodni qayta yuborish ({cooldown}s)
                    </span>
                  ) : (
                    <button
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="text-xs text-bunker-amber-500 hover:underline cursor-pointer font-semibold flex items-center justify-center gap-1 mx-auto font-mono"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Kodni qayta yuborish</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Password Login */}
        {authMode === 'login' && (
          <div className="space-y-4 font-mono">
            <div>
              <label className="block text-xs font-semibold text-bunker-text-secondary mb-1">Login yoki Telefon:</label>
              <input
                type="text"
                placeholder="admin yoki telefon raqam"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full bg-bunker-base border border-bunker-border-strong focus:border-bunker-amber-500 p-3 rounded-xl text-sm text-bunker-text-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-bunker-text-secondary mb-1">Parol:</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePasswordLogin()}
                className="w-full bg-bunker-base border border-bunker-border-strong focus:border-bunker-amber-500 p-3 rounded-xl text-sm text-bunker-text-primary outline-none transition-colors"
              />
            </div>
            <Button className="w-full" size="md" onClick={handlePasswordLogin} isLoading={loading}>
              <KeyRound className="w-4 h-4 mr-1.5" />
              <span>Kirish</span>
            </Button>
            <p className="text-[11px] text-bunker-text-muted text-center font-mono">
              Demo admin: <span className="font-mono text-bunker-amber-500 font-bold">admin</span> / parol:{' '}
              <span className="font-mono text-bunker-amber-500 font-bold">bunker2026</span>
            </p>
          </div>
        )}

        {/* TAB 3: STIR (INN) Lookup */}
        {authMode === 'stir' && (
          <div className="space-y-4 font-mono">
            <div>
              <label className="block text-xs font-semibold text-bunker-text-secondary mb-1">Korxona STIR (INN):</label>
              <input
                type="text"
                maxLength={9}
                value={inn}
                onChange={(e) => setInn(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-bunker-base border border-bunker-border-strong focus:border-bunker-amber-500 p-3 rounded-xl text-sm font-mono text-bunker-amber-500 outline-none transition-colors font-bold"
              />
            </div>
            <Button variant="secondary" className="w-full" size="md" onClick={handleStirLookup} isLoading={loading}>
              <Building2 className="w-4 h-4 mr-1.5 text-bunker-amber-500" />
              <span>Soliq bazasidan tekshirish</span>
            </Button>

            {companyInfo && (
              <div className="bg-bunker-base border border-bunker-border-strong p-4 rounded-xl space-y-2.5 text-xs">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-bold text-bunker-text-primary text-sm leading-snug">{companyInfo.companyName}</span>
                  <Badge variant="success" className="shrink-0">{companyInfo.status}</Badge>
                </div>
                <div className="space-y-1 text-bunker-text-secondary pt-1 border-t border-bunker-border-subtle">
                  <p><span className="text-bunker-text-muted">Rahbar:</span> {companyInfo.director}</p>
                  <p><span className="text-bunker-text-muted">Manzil:</span> {companyInfo.address}</p>
                  <p><span className="text-bunker-text-muted">Faoliyat:</span> {companyInfo.activityType || 'Qurilish va ta’minot'}</p>
                  <p><span className="text-bunker-text-muted">QQS to‘lovchisi:</span> {companyInfo.vatPayer ? 'Ha (Faol)' : 'Yo‘q'}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: E-IMZO */}
        {authMode === 'eimzo' && (
          <div className="space-y-4 text-center font-mono">
            <div className="p-5 border border-bunker-border-strong rounded-2xl bg-bunker-base space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-bunker-amber-500/10 border border-bunker-amber-500/30 flex items-center justify-center">
                <Fingerprint className="w-6 h-6 text-bunker-amber-500" />
              </div>
              <h4 className="text-sm font-bold text-bunker-text-primary">E-IMZO Kalitini Tasdiqlash</h4>
              <p className="text-xs text-bunker-text-secondary leading-relaxed">
                Yuridik shaxs yoki yakka tartibdagi tadbirkorlik elektron raqamli imzosi orqali xavfsiz autentifikatsiya.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-mono text-bunker-amber-500 font-bold">STIR: {inn}</span>
              </div>
            </div>
            <Button className="w-full" size="md" onClick={handleEimzoLogin} isLoading={loading}>
              <Fingerprint className="w-4 h-4 mr-1.5" />
              <span>E-IMZO bilan Kirish</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
