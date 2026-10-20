import React, { useState } from 'react';
import { X, ShieldCheck, Phone, Building2, Fingerprint, Lock, CheckCircle2 } from 'lucide-react';
import { Button, Badge } from '@bunkerstroy/ui';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [authMode, setAuthMode] = useState<'login' | 'stir' | 'eimzo'>('login');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [inn, setInn] = useState('201122334');
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStirLookup = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/auth/stir-lookup?inn=${inn}`);
      const json = await res.json();
      if (json.success) {
        setCompanyInfo(json.data);
      } else {
        setError(json.error || 'STIR topilmadi');
      }
    } catch {
      setError('Soliq serveri bilan aloqa uzildi');
    } finally {
      setLoading(false);
    }
  };

  const handleEimzoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const chRes = await fetch('/api/auth/eimzo/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inn })
      });
      const chData = await chRes.json();

      const vfRes = await fetch('/api/auth/eimzo/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: chData.data.challengeId,
          pkcs7B64: 'MIAGCSqGSIb3DQEHAqCAMIACAQExCzAJBgUrDgMCGgUAMIAGCSqGSIb3DQEHAQAA',
          inn
        })
      });
      const vfData = await vfRes.json();
      if (vfData.success) {
        localStorage.setItem('bunkerstroy_token', vfData.data.token);
        const user = vfData.data.user || vfData.data.verification;
        onSuccess(user);
        onClose();
      } else {
        setError(vfData.error);
      }
    } catch {
      setError('E-IMZO tizimida xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      });
      const json = await res.json();
      if (json.success) {
        localStorage.setItem('bunkerstroy_token', json.data.token);
        onSuccess(json.data.user);
        onClose();
      } else {
        setError(json.error || 'Login yoki parol noto‘g‘ri');
      }
    } catch {
      setError('Server bilan ulanishda xato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#1A1D20] border border-[#33373B] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#B8B8B3] hover:text-[#F5F5F2] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <Badge variant="warning" className="gap-1.5 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            BunkerStroy B2B Identity
          </Badge>
          <h2 className="text-xl font-black text-[#F5F5F2]">Kabinetga Kirish</h2>
          <p className="text-xs text-[#B8B8B3]">Xarid qilish, omborni boshqarish yoki E-IMZO bilan tasdiqlash</p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-3 gap-1 bg-[#151719] p-1 rounded-xl border border-[#33373B] text-xs font-semibold text-[#B8B8B3]">
          <button
            onClick={() => setAuthMode('login')}
            className={`py-2 rounded-lg transition-all cursor-pointer ${authMode === 'login' ? 'bg-[#292C2F] text-[#FFB800]' : 'hover:text-[#F5F5F2]'}`}
          >
            Login / Parol
          </button>
          <button
            onClick={() => setAuthMode('stir')}
            className={`py-2 rounded-lg transition-all cursor-pointer ${authMode === 'stir' ? 'bg-[#292C2F] text-[#FFB800]' : 'hover:text-[#F5F5F2]'}`}
          >
            STIR Lookup
          </button>
          <button
            onClick={() => setAuthMode('eimzo')}
            className={`py-2 rounded-lg transition-all cursor-pointer ${authMode === 'eimzo' ? 'bg-[#292C2F] text-[#FFB800]' : 'hover:text-[#F5F5F2]'}`}
          >
            E-IMZO
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Content by mode */}
        {authMode === 'login' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#B8B8B3] mb-1">Login yoki Telefon:</label>
              <input
                type="text"
                placeholder="admin yoki telefon raqam"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full bg-[#151719] border border-[#33373B] p-3 rounded-xl text-sm text-[#F5F5F2] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#B8B8B3] mb-1">Parol:</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#151719] border border-[#33373B] p-3 rounded-xl text-sm text-[#F5F5F2] outline-none"
              />
            </div>
            <Button className="w-full" size="md" onClick={handlePasswordLogin} isLoading={loading}>
              Kirish
            </Button>
            <p className="text-[11px] text-[#777A7C] text-center">
              Demo admin: <span className="font-mono text-[#B8B8B3]">admin</span> / parol: <span className="font-mono text-[#B8B8B3]">bunker2026</span>
            </p>
          </div>
        )}

        {authMode === 'stir' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#B8B8B3] mb-1">Korxona STIR (INN):</label>
              <input
                type="text"
                maxLength={9}
                value={inn}
                onChange={(e) => setInn(e.target.value)}
                className="w-full bg-[#151719] border border-[#33373B] p-3 rounded-xl text-sm font-mono text-[#FFB800] outline-none"
              />
            </div>
            <Button variant="secondary" className="w-full" size="md" onClick={handleStirLookup} isLoading={loading}>
              <Building2 className="w-4 h-4" />
              <span>Soliq bazasidan tekshirish</span>
            </Button>

            {companyInfo && (
              <div className="bg-[#151719] border border-[#33373B] p-3.5 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#F5F5F2]">{companyInfo.companyName}</span>
                  <Badge variant="success">{companyInfo.status}</Badge>
                </div>
                <p className="text-[#B8B8B3]">Rahbar: {companyInfo.director}</p>
                <p className="text-[#B8B8B3]">Manzil: {companyInfo.address}</p>
              </div>
            )}
          </div>
        )}

        {authMode === 'eimzo' && (
          <div className="space-y-4 text-center">
            <div className="p-4 border border-[#33373B] rounded-2xl bg-[#151719] space-y-2">
              <Fingerprint className="w-10 h-10 mx-auto text-[#FFB800]" />
              <p className="text-xs font-semibold text-[#F5F5F2]">E-IMZO Kalitini Tasdiqlash</p>
              <p className="text-[11px] text-[#B8B8B3]">Kompyuteringizdagi E-IMZO moduli orqali bir marta bosish bilan kiring.</p>
            </div>
            <Button className="w-full" size="md" onClick={handleEimzoLogin} isLoading={loading}>
              <Fingerprint className="w-4 h-4 mr-1" />
              E-IMZO bilan Kirish
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
