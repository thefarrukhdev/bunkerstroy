import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  Lock,
  Smartphone,
  ArrowRight,
  RefreshCw,
  KeyRound,
  UserCheck
} from 'lucide-react';
import { Button, Badge, Modal, Input, Alert, Tabs, TabsList, TabTrigger } from '@bunkerstroy/ui';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

type AuthMode = 'otp' | 'login';

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

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      timerRef.current = setTimeout(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [cooldown]);

  const handleTabChange = (mode: AuthMode) => {
    setAuthMode(mode);
    setError(null);
    setInfoMessage(null);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const digitsOnly = rawValue.replace(/\D/g, '');

    let numbers = digitsOnly;
    if (numbers.startsWith('998')) {
      numbers = numbers.slice(3);
    }
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
      setError('Server bilan ulanishda xato yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  // 3. Password Login
  const handlePasswordLogin = async () => {
    if (!login.trim()) {
      setError('Login yoki telefon raqamingizni kiriting');
      return;
    }
    if (!password) {
      setError('Parolni kiriting');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let phonePayload = login.trim();
      if (phonePayload === 'admin') {
        phonePayload = '+998901234567';
      } else if (phonePayload === 'supplier') {
        phonePayload = '+998971112233';
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phonePayload,
          password,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success && json.data) {
        if (json.data.token) {
          localStorage.setItem('bunkerstroy_token', json.data.token);
        }
        onSuccess(json.data.user);
        onClose();
      } else {
        setError(json.message || json.error || 'Login yoki parol noto‘g‘ri');
      }
    } catch {
      setError('Server bilan ulanishda xato yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const headerBadge = (
    <Badge variant="warning" className="gap-1.5 font-mono">
      <UserCheck className="w-3.5 h-3.5" />
      Kirish
    </Badge>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      headerExtra={headerBadge}
      title="Kabinetga Kirish"
      subtitle="Xaridlarni boshqarish, buyurtmalar tarixi va sotuvchi kabineti"
    >
      {/* 2 Clean Tabs */}
      <Tabs
        variant="pills"
        value={authMode}
        onValueChange={(val) => handleTabChange(val as AuthMode)}
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabTrigger value="otp" className="justify-center">
            <Smartphone className="w-3.5 h-3.5 mr-1.5" />
            <span>SMS Kod</span>
          </TabTrigger>
          <TabTrigger value="login" className="justify-center">
            <Lock className="w-3.5 h-3.5 mr-1.5" />
            <span>Parol</span>
          </TabTrigger>
        </TabsList>
      </Tabs>

      {/* Error Alert */}
      {error && (
        <Alert
          variant="error"
          description={error}
          onDismiss={() => setError(null)}
          className="my-3"
        />
      )}

      {/* Info Alert */}
      {infoMessage && (
        <Alert
          variant="success"
          description={infoMessage}
          onDismiss={() => setInfoMessage(null)}
          className="my-3"
        />
      )}

      {/* TAB 1: SMS OTP Authentication */}
      {authMode === 'otp' && (
        <div className="space-y-4 pt-2">
          {!otpSent ? (
            <div className="space-y-4">
              <Input
                label="Telefon raqamingiz:"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+998 90 123-45-67"
                isMono
                helperText="SMS orqali 6 xonali tasdiqlash kodi yuboriladi."
              />

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
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-bunker-amber-500" />
                  <span className="text-xs font-mono font-bold text-slate-900">{phone}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtpCode('');
                    setError(null);
                    setInfoMessage(null);
                  }}
                  className="text-[11px] text-bunker-amber-500 hover:underline cursor-pointer font-mono font-medium"
                >
                  O‘zgartirish
                </button>
              </div>

              <div>
                <Input
                  label="SMS tasdiqlash kodi:"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  isMono
                  className="text-center text-xl tracking-[0.5em] text-bunker-amber-500 font-bold font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1 text-center font-mono">
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
                  <span className="text-xs text-slate-500 font-mono flex items-center justify-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-bunker-amber-500" />
                    Kodni qayta yuborish ({cooldown}s)
                  </span>
                ) : (
                  <button
                    type="button"
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
        <div className="space-y-4 pt-2 font-mono">
          <Input
            label="Login yoki Telefon:"
            type="text"
            placeholder="admin yoki telefon raqamingiz"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <Input
            label="Parol:"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePasswordLogin()}
          />
          <Button className="w-full" size="md" onClick={handlePasswordLogin} isLoading={loading}>
            <KeyRound className="w-4 h-4 mr-1.5" />
            <span>Kirish</span>
          </Button>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <p>
              Demo admin: <span className="font-bold text-slate-900">admin</span> / parol:{' '}
              <span className="font-bold text-bunker-amber-500">bunker2026</span>
            </p>
            <p>
              Demo sotuvchi: <span className="font-bold text-slate-900">supplier</span> / parol:{' '}
              <span className="font-bold text-bunker-amber-500">bunker2026</span>
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};
