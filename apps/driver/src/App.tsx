import React, { useState, useEffect, useRef } from 'react';
import {
  Truck,
  ShieldCheck,
  AlertTriangle,
  Camera,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Navigation,
  User,
  Check,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  KeyRound,
  AlertOctagon,
  Volume2,
  Store,
  Shield,
  Layers,
  ArrowUpRight,
  Wifi,
  Sparkles
} from 'lucide-react';

/* ==========================================================================
   Types & Enums
   ========================================================================== */

export type DriverTaskStage =
  | 'PENDING_ACCEPTANCE' // 1. Vazifani qabul qilish / rad etish
  | 'LOADING'            // 2. Yukladim (foto biriktirish)
  | 'IN_TRANSIT'          // 3. Yo'ldaman (manzil, mijoz telefoni)
  | 'ARRIVED'             // 4. Yetib keldim (30 daqiqalik 50/50 kutish taymeri)
  | 'DELIVERED'           // 5. Qabul kodi (PIN) kiritildi va topshirildi + foto
  | 'COMPLETED';          // 6. Yakunlangan / hisob-kitob

export type ProblemType =
  | 'DELAY'
  | 'CARGO_DAMAGE'
  | 'CLIENT_UNREACHABLE'
  | 'ROAD_BLOCKED'
  | 'VEHICLE_BREAKDOWN'
  | 'OTHER';

export interface DriverTask {
  id: string;
  orderNumber: string;
  driverName: string;
  driverPhone: string;
  plateNumber: string;
  vehicleModel: string;
  cargoTitle: string;
  cargoWeightTons: number;
  cargoVolumeM3: number;
  cargoQuantity: string;
  originName: string;
  originAddress: string;
  destinationName: string;
  destinationAddress: string;
  clientName: string;
  clientPhone: string;
  paymentMode: '50_50' | 'FULL_ESCROW' | 'CASH_ON_DELIVERY';
  totalFreightFee: number;
  driverShareFee: number;
  distanceKm: number;
  estimatedMinutes: number;
  correctPin: string;
}

export interface ReportedIssue {
  id: string;
  type: ProblemType;
  typeLabel: string;
  description: string;
  photoUrl?: string;
  reportedAt: string;
  status: 'SUBMITTED' | 'RESOLVED';
}

const DEFAULT_TASK: DriverTask = {
  id: 'TASK-BS-8492',
  orderNumber: 'ORD-2026-9041',
  driverName: 'Rustam Qodirov',
  driverPhone: '+998 (90) 844-32-10',
  plateNumber: '01 | 742 VAA',
  vehicleModel: 'HOWO Sinotruk 25t Samosval',
  cargoTitle: 'Portlendsement M-500 (Oliy sifat, qopda)',
  cargoWeightTons: 18.5,
  cargoVolumeM3: 14.0,
  cargoQuantity: '370 qop (50 kg)',
  originName: 'Ohangaron Sement Zavodi',
  originAddress: 'Ohangaron sh., Sanoat hududi 4-blok, 2-darvoza',
  destinationName: 'BunkerStroy Ob‘ekt #14 (Turar-joy majmuasi)',
  destinationAddress: 'Toshkent sh., Mirzo Ulug‘bek tumani, Yangi O‘zbekiston ko‘chasi 18-uy',
  clientName: 'Farrux Rahimov (Qurilish uchastka boshlig‘i)',
  clientPhone: '+998901234567',
  paymentMode: '50_50',
  totalFreightFee: 850000,
  driverShareFee: 765000, // 90% after 10% platform commission
  distanceKm: 34.5,
  estimatedMinutes: 48,
  correctPin: '7492'
};

/* ==========================================================================
   Sound / Audio chime generator (Web Audio API)
   ========================================================================== */
function playIndustrialBeep(type: 'success' | 'alert' | 'click' = 'click') {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'alert') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(330, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch {
    // Ignore audio permission or context restrictions
  }
}

export const App: React.FC = () => {
  const [task, setTask] = useState<DriverTask>(DEFAULT_TASK);
  const [stage, setStage] = useState<DriverTaskStage>('PENDING_ACCEPTANCE');
  const [isShiftActive, setIsShiftActive] = useState<boolean>(true);
  const [isPortalMenuOpen, setIsPortalMenuOpen] = useState<boolean>(false);

  // External Portal URLs
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const webMarketplaceUrl = isLocal ? 'http://localhost:3000' : 'https://bunkerstroy-web.vercel.app';
  const adminPanelUrl = isLocal ? 'http://localhost:3002' : 'https://bunkerstroy-admin.vercel.app';

  // Photos
  const [loadingPhoto, setLoadingPhoto] = useState<string | null>(null);
  const [deliveryPhoto, setDeliveryPhoto] = useState<string | null>(null);
  const loadingInputRef = useRef<HTMLInputElement>(null);
  const deliveryInputRef = useRef<HTMLInputElement>(null);

  // 30-min Countdown Timer for 50/50 Payment when arrived
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState<number>(30 * 60); // 30 minutes
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // PIN verification
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isPinVerified, setIsPinVerified] = useState<boolean>(false);

  // Problem Modal / Drawer
  const [isProblemModalOpen, setIsProblemModalOpen] = useState<boolean>(false);
  const [problemType, setProblemType] = useState<ProblemType>('DELAY');
  const [problemNotes, setProblemNotes] = useState<string>('');
  const [problemPhoto, setProblemPhoto] = useState<string | null>(null);
  const problemInputRef = useRef<HTMLInputElement>(null);
  const [reportedIssues, setReportedIssues] = useState<ReportedIssue[]>([]);
  const [showIssueAlert, setShowIssueAlert] = useState<boolean>(false);

  // Rejection modal
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('Mashina nosozligi');

  // Arrived notification banner state
  const [arrivedNotified, setArrivedNotified] = useState<boolean>(false);

  // Sound effect / Haptic simulation
  const triggerHaptic = (type: 'success' | 'alert' | 'click' = 'click') => {
    playIndustrialBeep(type);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(type === 'alert' ? [60, 80, 60] : [40, 60, 40]);
      } catch {
        // ignore
      }
    }
  };

  // Fetch active driver dispatch from backend
  useEffect(() => {
    const fetchActiveTask = async () => {
      try {
        let token = localStorage.getItem('bunkerstroy_token');
        if (!token) {
          // Attempt automatic demo login as driver if not yet authenticated
          const loginRes = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login: 'driver.sherzod@bunkerstroy.uz', password: 'bunker2026' })
          });
          const loginData = await loginRes.json();
          if (loginData.success && loginData.data?.token) {
            token = loginData.data.token;
            localStorage.setItem('bunkerstroy_token', token as string);
          }
        }

        if (token) {
          const res = await fetch('/api/logistics/dispatches', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const result = await res.json();
            const list = result.data || [];
            if (list.length > 0) {
              const active = list[0];
              setTask((prev) => ({
                ...prev,
                id: active.id,
                orderNumber: active.order?.orderNumber || prev.orderNumber,
                originAddress: active.origin || prev.originAddress,
                destinationAddress: active.destination || prev.destinationAddress,
                distanceKm: active.distanceKm || prev.distanceKm,
                totalFreightFee: Number(active.totalCost) || prev.totalFreightFee,
                driverShareFee: Math.round((Number(active.totalCost) || prev.totalFreightFee) * 0.9),
                correctPin: active.acceptanceCode || '7492',
                plateNumber: active.vehicle?.plateNumber || prev.plateNumber,
                vehicleModel: active.vehicle?.name || prev.vehicleModel
              }));

              if (active.status === 'ASSIGNED') setStage('PENDING_ACCEPTANCE');
              else if (active.status === 'LOADED' || active.status === 'IN_TRANSIT') setStage('IN_TRANSIT');
              else if (active.status === 'ARRIVED') {
                setStage('ARRIVED');
                setIsTimerRunning(true);
              } else if (active.status === 'DELIVERED') {
                setStage('COMPLETED');
              }
            }
          }
        }
      } catch (err) {
        console.warn('Haydovchi dispetcherligini yuklashda xatolik:', err);
      }
    };
    fetchActiveTask();
  }, []);

  // Timer effect when arrived
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && timerSecondsRemaining > 0) {
      interval = setInterval(() => {
        setTimerSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            triggerHaptic('alert');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSecondsRemaining]);

  // Format seconds to MM:SS
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Handle stage transitions
  const handleAcceptTask = () => {
    triggerHaptic('success');
    setStage('LOADING');
  };

  const handleRejectTask = () => {
    triggerHaptic('alert');
    setIsRejectModalOpen(false);
    alert(`Vazifa rad etildi (${rejectReason}). Yangi vazifalar kutilmoqda...`);
    setStage('PENDING_ACCEPTANCE');
  };

  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setter(reader.result as string);
        triggerHaptic('success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoadingComplete = async () => {
    const photoToUse =
      loadingPhoto ||
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80';
    if (!loadingPhoto) {
      setLoadingPhoto(photoToUse);
    }
    triggerHaptic('success');
    setStage('IN_TRANSIT');

    // Sync to backend
    const token = localStorage.getItem('bunkerstroy_token');
    if (token && task.id && !task.id.startsWith('TASK-')) {
      try {
        await fetch(`/api/logistics/dispatches/${task.id}/driver-loaded`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ photoUrl: photoToUse })
        });
      } catch (e) {
        console.warn('API driver-loaded sync error:', e);
      }
    }
  };

  const handleMarkArrived = async () => {
    triggerHaptic('success');
    setStage('ARRIVED');
    setIsTimerRunning(true);
    setTimerSecondsRemaining(30 * 60);
    setArrivedNotified(true);
    console.log('[LOGISTICS SMS] Mijozga xabar yuborildi: Haydovchi manzilga yetib keldi.');

    // Sync to backend
    const token = localStorage.getItem('bunkerstroy_token');
    if (token && task.id && !task.id.startsWith('TASK-')) {
      try {
        await fetch(`/api/logistics/dispatches/${task.id}/driver-arrived`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
      } catch (e) {
        console.warn('API driver-arrived sync error:', e);
      }
    }
  };

  const handlePinSubmit = () => {
    if (pinInput.trim() === task.correctPin) {
      triggerHaptic('success');
      setIsPinVerified(true);
      setPinError(null);
    } else {
      triggerHaptic('alert');
      setPinError(`Noto‘g‘ri PIN-kod! (Demo sinov kodi: ${task.correctPin})`);
    }
  };

  const handleDeliverComplete = async () => {
    const photoToUse =
      deliveryPhoto ||
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80';
    if (!deliveryPhoto) {
      setDeliveryPhoto(photoToUse);
    }
    triggerHaptic('success');
    setStage('COMPLETED');
    setIsTimerRunning(false);

    // Sync to backend
    const token = localStorage.getItem('bunkerstroy_token');
    if (token && task.id && !task.id.startsWith('TASK-')) {
      try {
        await fetch(`/api/logistics/dispatches/${task.id}/driver-verify-code`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ code: pinInput || task.correctPin, photoUrl: photoToUse })
        });
      } catch (e) {
        console.warn('API driver-verify-code sync error:', e);
      }
    }
  };

  const handleResetDemo = () => {
    triggerHaptic('click');
    setStage('PENDING_ACCEPTANCE');
    setLoadingPhoto(null);
    setDeliveryPhoto(null);
    setPinInput('');
    setIsPinVerified(false);
    setPinError(null);
    setArrivedNotified(false);
    setTimerSecondsRemaining(30 * 60);
    setIsTimerRunning(false);
  };

  const handleSubmitIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('alert');
    const typeLabels: Record<ProblemType, string> = {
      DELAY: 'Kechikish (Yo‘l tirbandligi)',
      CARGO_DAMAGE: 'Yuk shikastlanishi / Kamomad',
      CLIENT_UNREACHABLE: 'Mijoz topilmadi / Telefon o‘chiq',
      ROAD_BLOCKED: 'Manzilga kirish yo‘li to‘silgan',
      VEHICLE_BREAKDOWN: 'Avtomashina nosozligi',
      OTHER: 'Boshqa kutilmagan holat'
    };

    const newIssue: ReportedIssue = {
      id: `ISSUE-${Date.now()}`,
      type: problemType,
      typeLabel: typeLabels[problemType],
      description: problemNotes || 'Tafsilotlar kiritilmadi',
      photoUrl: problemPhoto || undefined,
      reportedAt: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      status: 'SUBMITTED'
    };

    setReportedIssues((prev) => [newIssue, ...prev]);
    setIsProblemModalOpen(false);
    setShowIssueAlert(true);

    // Sync to backend
    const token = localStorage.getItem('bunkerstroy_token');
    if (token && task.id && !task.id.startsWith('TASK-')) {
      try {
        await fetch(`/api/logistics/dispatches/${task.id}/driver-report-issue`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            reason: `${typeLabels[problemType]}: ${problemNotes || 'Tafsilotlar yo‘q'}`,
            photoUrl: problemPhoto || undefined
          })
        });
      } catch (err) {
        console.warn('API driver-report-issue sync error:', err);
      }
    }

    setProblemNotes('');
    setProblemPhoto(null);
  };

  return (
    <div className="min-h-screen bg-[#071326] text-slate-100 flex flex-col items-center justify-start py-0 sm:py-6 px-0 sm:px-4 font-sans selection:bg-[#FFB800] selection:text-black">
      {/* Top Global Portal Cross-Links Bar for desktop/tablet */}
      <div className="w-full max-w-[460px] hidden sm:flex items-center justify-between pb-2 px-2 text-xs font-mono text-sky-200/70">
        <span className="flex items-center gap-1.5 text-slate-400">
          <Truck className="w-3.5 h-3.5 text-[#FFB800]" />
          <span>BunkerStroy Flot Portali</span>
        </span>
        <div className="flex items-center gap-2">
          <a
            href={webMarketplaceUrl}
            className="hover:text-amber-300 flex items-center gap-1 transition"
            target="_blank"
            rel="noreferrer"
          >
            <Store className="w-3 h-3" />
            <span>Bozor</span>
            <ArrowUpRight className="w-2.5 h-2.5" />
          </a>
          <span className="text-slate-600">|</span>
          <a
            href={adminPanelUrl}
            className="hover:text-amber-300 flex items-center gap-1 transition"
            target="_blank"
            rel="noreferrer"
          >
            <Shield className="w-3 h-3" />
            <span>Admin</span>
            <ArrowUpRight className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Main Container simulating a mobile viewport (360px - 460px) */}
      <div className="w-full max-w-[460px] bg-[#0A1931] sm:rounded-3xl border-0 sm:border-2 border-[#1E3A6D] shadow-2xl overflow-hidden flex flex-col min-h-screen sm:min-h-[880px] relative">
        
        {/* ==================================================================
            1. MOBILE DRIVER HEADER
            Vehicle plate, driver info, shift indicator, quick problem action
            ================================================================== */}
        <header className="bg-[#071326] border-b border-[#1E3A6D] px-4 pt-3.5 pb-3 sticky top-0 z-30 shadow-md">
          {/* Top Hazard Accent Stripe */}
          <div className="h-1 -mt-3.5 -mx-4 mb-2.5 hazard-stripe-sm opacity-80" />

          <div className="flex items-center justify-between gap-2">
            {/* Left: Portal Switcher Menu Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsPortalMenuOpen(!isPortalMenuOpen)}
                className="p-1.5 -ml-1 text-slate-300 hover:text-white rounded-lg hover:bg-[#0F2547] border border-transparent hover:border-[#1E3A6D] transition flex items-center gap-1"
                title="Boshqa portallarga o‘tish"
                aria-label="Portallarni almashtirish"
              >
                <Layers className="w-4 h-4 text-[#FFB800]" />
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Portal Dropdown Menu */}
              {isPortalMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsPortalMenuOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-52 bg-[#0F2547] border border-[#1E3A6D] rounded-xl shadow-2xl py-1.5 z-50 text-xs font-mono animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-[#1E3A6D]">
                      BunkerStroy Tizimlari
                    </div>
                    <a
                      href={webMarketplaceUrl}
                      className="flex items-center justify-between px-3 py-2 text-slate-200 hover:bg-[#1E3A6D] hover:text-[#FFB800] transition"
                    >
                      <div className="flex items-center gap-2">
                        <Store className="w-3.5 h-3.5 text-[#FFB800]" />
                        <span>Bozor Vitrinasi</span>
                      </div>
                      <ArrowUpRight className="w-3 h-3 text-slate-400" />
                    </a>
                    <a
                      href={adminPanelUrl}
                      className="flex items-center justify-between px-3 py-2 text-slate-200 hover:bg-[#1E3A6D] hover:text-[#FFB800] transition"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-sky-400" />
                        <span>Admin Boshqaruvi</span>
                      </div>
                      <ArrowUpRight className="w-3 h-3 text-slate-400" />
                    </a>
                    <a
                      href={`${webMarketplaceUrl}/logistics`}
                      className="flex items-center justify-between px-3 py-2 text-slate-200 hover:bg-[#1E3A6D] hover:text-[#FFB800] transition border-t border-[#1E3A6D]/60"
                    >
                      <div className="flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Logistika Markazi</span>
                      </div>
                      <ArrowUpRight className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                </>
              )}
            </div>

            {/* Middle: Brand & Vehicle Plate Badge */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FFB800] flex items-center justify-center text-[#071326] font-black text-xs shadow-sm">
                BS
              </div>
              <div>
                <div className="text-xs font-mono font-bold tracking-tight text-white flex items-center gap-1.5">
                  <span>BUNKERSTROY</span>
                  <span className="text-[10px] bg-[#FFB800]/20 text-[#FFB800] px-1.5 py-0.2 rounded font-mono font-black border border-[#FFB800]/30">
                    HAYDOVCHI
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Truck className="w-3 h-3 text-[#FFB800]" />
                  <span className="font-bold text-amber-300">{task.plateNumber}</span>
                </div>
              </div>
            </div>

            {/* Right: Emergency / Report Problem button */}
            <button
              onClick={() => {
                triggerHaptic('alert');
                setIsProblemModalOpen(true);
              }}
              className="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 px-2.5 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>Muammo</span>
            </button>
          </div>

          {/* Driver identity & shift sub-bar */}
          <div className="mt-2.5 pt-2 border-t border-[#1E3A6D] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#0F2547] border border-[#1E3A6D] flex items-center justify-center text-slate-300">
                <User className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-semibold text-slate-200">{task.driverName}</span>
                <span className="text-[10px] text-amber-400 font-mono ml-1.5 font-bold">★ 4.9</span>
              </div>
            </div>

            <button
              onClick={() => {
                triggerHaptic('click');
                setIsShiftActive(!isShiftActive);
              }}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition cursor-pointer ${
                isShiftActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isShiftActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
                }`}
              />
              {isShiftActive ? 'Smenada (Faol)' : 'Dam olishda'}
            </button>
          </div>
        </header>

        {/* ==================================================================
            ALERT NOTIFICATIONS (Issue submitted / Arrived notice)
            ================================================================== */}
        {showIssueAlert && (
          <div className="bg-red-500/15 border-b border-red-500/30 px-4 py-2.5 flex items-center justify-between text-xs text-red-200">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
              <span>
                <strong>Muammo dispetcherga uzatildi.</strong> Xavfsiz joyda kuting yoki qayta qo‘ng‘iroq qiling.
              </span>
            </div>
            <button
              onClick={() => setShowIssueAlert(false)}
              className="text-red-400 hover:text-white ml-2 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {arrivedNotified && stage === 'ARRIVED' && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-4 py-2 flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Mijozga SMS xabar yuborildi: Haydovchi ob‘ekt darvozasida kutmoqda.</span>
          </div>
        )}

        {/* ==================================================================
            MAIN CONTENT SCROLL AREA
            ================================================================== */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          
          {/* Active Task Summary Card */}
          <div className="bg-[#071326] rounded-2xl p-4 border border-[#1E3A6D] shadow-md">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1E3A6D]/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FFB800]" />
                <span className="font-mono text-xs font-bold text-slate-300">
                  {task.id}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  ({task.orderNumber})
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                50/50 ESCROW
              </span>
            </div>

            {/* Cargo highlight */}
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{task.cargoTitle}</span>
              </h3>
              <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                <div className="bg-[#0F2547] p-2 rounded-xl border border-[#1E3A6D] text-center">
                  <span className="text-slate-400 block text-[9px] uppercase">Og‘irlik</span>
                  <span className="font-bold text-white text-xs">{task.cargoWeightTons} t</span>
                </div>
                <div className="bg-[#0F2547] p-2 rounded-xl border border-[#1E3A6D] text-center">
                  <span className="text-slate-400 block text-[9px] uppercase">Hajm</span>
                  <span className="font-bold text-white text-xs">{task.cargoVolumeM3} m³</span>
                </div>
                <div className="bg-[#0F2547] p-2 rounded-xl border border-[#1E3A6D] text-center">
                  <span className="text-slate-400 block text-[9px] uppercase">Qoplarda</span>
                  <span className="font-bold text-amber-400 text-xs">{task.cargoQuantity}</span>
                </div>
              </div>
            </div>

            {/* Route summary */}
            <div className="mt-3 pt-3 border-t border-[#1E3A6D]/80 space-y-2 text-xs">
              {/* Pickup */}
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-slate-400 block">Yuklash manzili</span>
                  <p className="text-slate-200 font-medium truncate">{task.originName}</p>
                  <p className="text-[11px] text-slate-400 leading-tight">{task.originAddress}</p>
                </div>
              </div>

              {/* Destination */}
              <div className="flex items-start gap-2.5 pt-1">
                <div className="w-4 h-4 rounded-full bg-[#FFB800]/20 border border-[#FFB800]/40 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-2.5 h-2.5 text-[#FFB800]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-slate-400 block">Tushirish manzili</span>
                  <p className="text-amber-200 font-medium">{task.destinationName}</p>
                  <p className="text-[11px] text-slate-400 leading-tight">{task.destinationAddress}</p>
                </div>
              </div>
            </div>

            {/* Fee summary footer */}
            <div className="mt-3 pt-2.5 border-t border-[#1E3A6D] flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Haydovchi haqi:</span>
              <span className="text-emerald-400 font-mono font-black text-sm">
                {task.driverShareFee.toLocaleString('uz-UZ')} so‘m
              </span>
            </div>
          </div>

          {/* ================================================================
              STAGE PROGRESS STEPS (Industrial Visual Timeline)
              ================================================================ */}
          <div className="bg-[#071326] rounded-2xl p-3 border border-[#1E3A6D]">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
              <span className="font-bold text-slate-300">BOSQICH:</span>
              <span className="text-amber-400 font-semibold">
                {stage === 'PENDING_ACCEPTANCE' && '1 / 5: Qabul qilish'}
                {stage === 'LOADING' && '2 / 5: Yuklash & Foto'}
                {stage === 'IN_TRANSIT' && '3 / 5: Yo‘ldaman'}
                {stage === 'ARRIVED' && '4 / 5: Yetib keldim & 50/50'}
                {stage === 'DELIVERED' && '5 / 5: PIN & Dalolatnoma'}
                {stage === 'COMPLETED' && 'YAKUNLANDI'}
              </span>
            </div>

            {/* Stepper bar */}
            <div className="grid grid-cols-5 gap-1.5">
              {(
                [
                  { id: 'PENDING_ACCEPTANCE', label: 'Qabul' },
                  { id: 'LOADING', label: 'Yuklash' },
                  { id: 'IN_TRANSIT', label: 'Yo‘l' },
                  { id: 'ARRIVED', label: 'Yetish' },
                  { id: 'DELIVERED', label: 'PIN' }
                ] as const
              ).map((step) => {
                const stagesOrder: DriverTaskStage[] = [
                  'PENDING_ACCEPTANCE',
                  'LOADING',
                  'IN_TRANSIT',
                  'ARRIVED',
                  'DELIVERED',
                  'COMPLETED'
                ];
                const currentIndex = stagesOrder.indexOf(stage);
                const stepIndex = stagesOrder.indexOf(step.id);
                const isPassed = currentIndex > stepIndex;
                const isCurrent = currentIndex === stepIndex;

                return (
                  <div key={step.id} className="text-center">
                    <div
                      className={`h-2 rounded-full mb-1 transition-all ${
                        isPassed
                          ? 'bg-emerald-500'
                          : isCurrent
                          ? 'bg-[#FFB800] shadow-[0_0_8px_rgba(255,184,0,0.5)]'
                          : 'bg-slate-700'
                      }`}
                    />
                    <span
                      className={`text-[9px] font-mono block truncate ${
                        isCurrent
                          ? 'text-amber-300 font-bold'
                          : isPassed
                          ? 'text-emerald-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================================================================
              STAGE 1: PENDING ACCEPTANCE (Vazifani qabul qilish / rad etish)
              ================================================================ */}
          {stage === 'PENDING_ACCEPTANCE' && (
            <div className="bg-[#071326] rounded-2xl p-4 border border-amber-500/40 shadow-lg space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-amber-400">
                <Clock className="w-5 h-5 shrink-0" />
                <h4 className="font-bold text-sm text-white">Yangi yetkazish vazifasi tayinlandi</h4>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Ushbu reysni qabul qilishingiz bilan belgilangan omborga yo‘l olasiz.
                Yuklanganlik fotosuratini ilovaga biriktirish majburiy hisoblanadi.
              </p>

              <div className="bg-[#0F2547] p-3 rounded-xl border border-[#1E3A6D] font-mono text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Masofa:</span>
                  <span className="text-white font-bold">{task.distanceKm} km</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Taxminiy vaqt:</span>
                  <span className="text-white font-bold">~{task.estimatedMinutes} daqiqa</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Reys to‘lovi:</span>
                  <span className="text-emerald-400 font-bold">{task.driverShareFee.toLocaleString()} so‘m</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setIsRejectModalOpen(true)}
                  className="w-full py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold border border-slate-600 transition active:scale-95 cursor-pointer"
                >
                  Rad etish
                </button>

                <button
                  onClick={handleAcceptTask}
                  className="w-full py-3 px-3 rounded-xl bg-[#FFB800] hover:bg-amber-400 text-black font-mono text-xs font-black shadow-lg shadow-amber-500/20 transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Qabul qilish</span>
                </button>
              </div>
            </div>
          )}

          {/* ================================================================
              STAGE 2: LOADING (Yukladim & Foto biriktirish)
              ================================================================ */}
          {stage === 'LOADING' && (
            <div className="bg-[#071326] rounded-2xl p-4 border border-blue-500/40 shadow-lg space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-400">
                  <Camera className="w-5 h-5 shrink-0" />
                  <h4 className="font-bold text-sm text-white">Omborda yuk ortish</h4>
                </div>
                <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                  FOTO MAJBURIY
                </span>
              </div>

              <div className="bg-[#0F2547] p-3 rounded-xl border border-[#1E3A6D] text-xs space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Ombor dispetcheri</span>
                <p className="text-slate-200 font-medium">{task.originName}</p>
                <p className="text-slate-400 text-[11px]">{task.originAddress}</p>
              </div>

              {/* Photo Upload area */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-300">
                  1. Yuk ortilgan fotosurati (Kuzov va qoplar ko‘rinishi shart):
                </label>

                <input
                  id="driver-loading-photo-input"
                  name="loadingPhoto"
                  type="file"
                  accept="image/*"
                  ref={loadingInputRef}
                  className="hidden"
                  onChange={(e) => handlePhotoUpload(e, setLoadingPhoto)}
                />

                {loadingPhoto ? (
                  <div className="relative rounded-xl overflow-hidden border border-emerald-500/50 bg-black/40">
                    <img
                      src={loadingPhoto}
                      alt="Yuklangan fotosurat"
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Yuklandi</span>
                    </div>
                    <button
                      onClick={() => loadingInputRef.current?.click()}
                      className="absolute bottom-2 right-2 bg-black/70 hover:bg-black text-white text-xs px-2.5 py-1 rounded-lg border border-slate-500 font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Qayta olish
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => loadingInputRef.current?.click()}
                    className="w-full h-32 rounded-xl border-2 border-dashed border-[#1E3A6D] hover:border-[#FFB800] bg-[#0F2547]/50 hover:bg-[#0F2547] flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[#FFB800]">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div className="text-center font-mono text-xs">
                      <span className="font-bold text-amber-400 block">+ Foto olish / Biriktirish</span>
                      <span className="text-[10px] text-slate-500">Kamida 1 dona surat</span>
                    </div>
                  </button>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={handleLoadingComplete}
                className="w-full py-3.5 px-4 rounded-xl bg-[#FFB800] hover:bg-amber-400 text-black font-mono text-sm font-black shadow-lg shadow-amber-500/20 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Truck className="w-4 h-4 stroke-[2.5]" />
                <span>Yukladim &amp; Yo‘lga chiqish</span>
              </button>
            </div>
          )}

          {/* ================================================================
              STAGE 3: IN TRANSIT (Yo'ldaman)
              ================================================================ */}
          {stage === 'IN_TRANSIT' && (
            <div className="bg-[#071326] rounded-2xl p-4 border border-amber-500/40 shadow-lg space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400">
                  <Navigation className="w-5 h-5 shrink-0" />
                  <h4 className="font-bold text-sm text-white">Yo‘ldasiz (Manzilga harakat)</h4>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  GPS FAOL
                </span>
              </div>

              {/* Destination navigation card */}
              <div className="bg-[#0F2547] p-3.5 rounded-xl border border-[#1E3A6D] space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Yetkazish ob‘ekti</span>
                <p className="text-white font-bold text-sm">{task.destinationName}</p>
                <p className="text-xs text-slate-300 leading-snug">{task.destinationAddress}</p>

                <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-[#1E3A6D]/80">
                  <span>Qolgan masofa: <strong className="text-amber-400">18.4 km</strong></span>
                  <span>ETA: <strong className="text-white">~25 daqiqa</strong></span>
                </div>
              </div>

              {/* Client Contacts card with One-Click Call */}
              <div className="bg-[#0F2547] p-3 rounded-xl border border-[#1E3A6D] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-slate-400 block">Qabul qiluvchi mas‘ul:</span>
                  <p className="text-xs font-bold text-white truncate">{task.clientName}</p>
                  <p className="text-[11px] font-mono text-slate-400">{task.clientPhone}</p>
                </div>

                <a
                  href={`tel:${task.clientPhone}`}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition active:scale-95 shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Qo‘ng‘iroq</span>
                </a>
              </div>

              {/* External Navigator Link */}
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(task.destinationAddress)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                <span>Yandex / Google Navigatorda ochish</span>
              </a>

              {/* Action Button: Yetib keldim */}
              <button
                onClick={handleMarkArrived}
                className="w-full py-3.5 px-4 rounded-xl bg-[#FFB800] hover:bg-amber-400 text-black font-mono text-sm font-black shadow-lg shadow-amber-500/20 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MapPin className="w-4 h-4 stroke-[2.5]" />
                <span>Ob‘ektga Yetib Keldim</span>
              </button>
            </div>
          )}

          {/* ================================================================
              STAGE 4: ARRIVED (Yetib keldim & 30-minutlik 50/50 taymeri)
              ================================================================ */}
          {stage === 'ARRIVED' && (
            <div className="bg-[#071326] rounded-2xl p-4 border border-amber-500/40 shadow-lg space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <h4 className="font-bold text-sm text-white">Ob‘ektga yetib kelindi</h4>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  SMS YUBORILDI
                </span>
              </div>

              {/* 30-minute Countdown Timer Box (TZ-4 / LG-08) */}
              <div className="bg-gradient-to-br from-amber-500/20 via-[#071326] to-[#0A1931] p-4 rounded-2xl border-2 border-[#FFB800]/50 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-mono font-bold">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>50/50 TO‘LOV KUTISH TAYMERI (30 DAQIQA)</span>
                </div>

                <div className="font-mono text-4xl font-black text-amber-300 tracking-wider">
                  {formatTimer(timerSecondsRemaining)}
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed px-1">
                  Mijoz ikkinchi 50% to‘lovni amalga oshirishi bilan uning ilovasida <strong>4 xonali Qabul PIN-kodi</strong> ochiladi.
                  Kod olinmasdan yukni tushirish qat‘iyan taqiqlanadi!
                </p>

                {timerSecondsRemaining === 0 && (
                  <div className="bg-red-500/20 border border-red-500/40 p-2.5 rounded-xl text-red-300 text-xs font-mono font-bold">
                    Kutish vaqti tugadi! Yukni qaytarish tartibi va avansdan jarima belgilash uchun dispetcherga murojaat qiling.
                  </div>
                )}
              </div>

              {/* Direct call to client to ask for PIN / 2nd payment */}
              <div className="bg-[#0F2547] p-3 rounded-xl border border-[#1E3A6D] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">Mijoz bilan bog‘lanish:</span>
                  <span className="text-xs font-bold text-white">{task.clientName}</span>
                </div>
                <a
                  href={`tel:${task.clientPhone}`}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  Qo‘ng‘iroq
                </a>
              </div>

              {/* PIN Code Verification input (LG-09) */}
              <div className="bg-[#0A1931] p-4 rounded-xl border border-[#1E3A6D] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-[#FFB800]" />
                    <span>Mijozning 4 xonali PIN-kodini kiriting:</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-500">
                    (Demo PIN: <strong>{task.correctPin}</strong>)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <label htmlFor="driver-acceptance-pin" className="sr-only">
                    Qabul qilish PIN kodi
                  </label>
                  <input
                    id="driver-acceptance-pin"
                    name="pin"
                    type="text"
                    maxLength={4}
                    inputMode="numeric"
                    aria-label="Qabul qilish PIN kodi"
                    value={pinInput}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setPinInput(val);
                      if (pinError) setPinError(null);
                    }}
                    placeholder="Masalan: 7492"
                    className="w-full text-center text-xl font-mono font-black tracking-widest py-2.5 px-4 rounded-xl bg-[#071326] border-2 border-[#1E3A6D] focus:border-[#FFB800] focus:outline-hidden text-amber-300 placeholder:text-slate-600"
                  />
                  <button
                    onClick={handlePinSubmit}
                    disabled={pinInput.length !== 4}
                    className="py-3 px-5 rounded-xl bg-[#FFB800] hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-mono text-xs font-black transition active:scale-95 shrink-0 cursor-pointer"
                  >
                    Tasdiqlash
                  </button>
                </div>

                {pinError && (
                  <p className="text-xs font-mono text-red-400 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{pinError}</span>
                  </p>
                )}

                {isPinVerified && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl space-y-2">
                    <p className="text-xs font-mono text-emerald-300 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>PIN-kod to‘g‘ri! 50/50 to‘lov to‘liq yopildi.</span>
                    </p>
                    <button
                      onClick={() => setStage('DELIVERED')}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-mono text-xs font-black transition active:scale-95 cursor-pointer"
                    >
                      Topshirish &amp; Foto-dalolatnoma sahifasiga o‘tish
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================
              STAGE 5: DELIVERED (Topshirildi & Foto-dalolatnoma)
              ================================================================ */}
          {stage === 'DELIVERED' && (
            <div className="bg-[#071326] rounded-2xl p-4 border border-emerald-500/40 shadow-lg space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <h4 className="font-bold text-sm text-white">Yukni topshirish &amp; Dalolatnoma</h4>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  PIN TASDIQLANGAN
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Yuk to‘liq tushirildi. Qabul qiluvchi bilan birgalikda tushirilgan mahsulot va imzolangan elektron/qog‘oz dalolatnoma fotosuratini biriktiring.
              </p>

              {/* Delivery Act Photo upload */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-300">
                  Tushirilgan yuk va dalolatnoma fotosi:
                </label>

                <input
                  id="driver-delivery-photo-input"
                  name="deliveryPhoto"
                  type="file"
                  accept="image/*"
                  ref={deliveryInputRef}
                  className="hidden"
                  onChange={(e) => handlePhotoUpload(e, setDeliveryPhoto)}
                />

                {deliveryPhoto ? (
                  <div className="relative rounded-xl overflow-hidden border border-emerald-500/50 bg-black/40">
                    <img
                      src={deliveryPhoto}
                      alt="Dalolatnoma fotosi"
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Dalolatnoma tayyor</span>
                    </div>
                    <button
                      onClick={() => deliveryInputRef.current?.click()}
                      className="absolute bottom-2 right-2 bg-black/70 hover:bg-black text-white text-xs px-2.5 py-1 rounded-lg border border-slate-500 font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Qayta olish
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => deliveryInputRef.current?.click()}
                    className="w-full h-32 rounded-xl border-2 border-dashed border-[#1E3A6D] hover:border-emerald-500 bg-[#0F2547]/50 hover:bg-[#0F2547] flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div className="text-center font-mono text-xs">
                      <span className="font-bold text-emerald-400 block">+ Foto-dalolatnoma biriktirish</span>
                      <span className="text-[10px] text-slate-500">Tushirilgan joy va qabul qiluvchi</span>
                    </div>
                  </button>
                )}
              </div>

              {/* Complete Delivery Button */}
              <button
                onClick={handleDeliverComplete}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-sm font-black shadow-lg shadow-emerald-500/20 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>Yetkazishni Yakunlash (Topshirildi)</span>
              </button>
            </div>
          )}

          {/* ================================================================
              STAGE 6: COMPLETED (Bajarildi & Hisob-kitob)
              ================================================================ */}
          {stage === 'COMPLETED' && (
            <div className="bg-[#071326] rounded-2xl p-5 border border-emerald-500/50 shadow-xl space-y-4 text-center animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 mx-auto flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Reys Muvaffaqiyatli Yakunlandi!</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Buyurtma #{task.orderNumber} to‘liq topshirildi
                </p>
              </div>

              {/* Payout breakdown */}
              <div className="bg-[#0F2547] p-4 rounded-xl border border-[#1E3A6D] space-y-2 text-xs font-mono text-left">
                <div className="flex justify-between text-slate-400">
                  <span>Reys tarif summasi:</span>
                  <span className="text-white">{task.totalFreightFee.toLocaleString()} so‘m</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Platforma komissiyasi (10%):</span>
                  <span className="text-red-400">-{(task.totalFreightFee - task.driverShareFee).toLocaleString()} so‘m</span>
                </div>
                <div className="pt-2 border-t border-[#1E3A6D] flex justify-between font-bold text-sm">
                  <span className="text-amber-400">Haydovchi hisobiga:</span>
                  <span className="text-emerald-400 font-black">+{task.driverShareFee.toLocaleString()} so‘m</span>
                </div>
              </div>

              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs text-blue-300 font-mono text-left">
                ℹ️ Mablag‘ haydovchi hamyoniga o‘tkazildi. Har juma kuni bank kartasiga avtomatik yechib beriladi.
              </div>

              <button
                onClick={handleResetDemo}
                className="w-full py-3 px-4 rounded-xl bg-[#FFB800] hover:bg-amber-400 text-black font-mono text-xs font-black transition active:scale-95 cursor-pointer"
              >
                Keyingi vazifani qidirish / Qayta boshlash
              </button>
            </div>
          )}

          {/* Reported Issues History (if any) */}
          {reportedIssues.length > 0 && (
            <div className="bg-[#071326] rounded-2xl p-3.5 border border-[#1E3A6D] space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Yuborilgan xabarnomalar ({reportedIssues.length}):
              </span>
              <div className="space-y-2">
                {reportedIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-2.5 rounded-xl bg-[#0F2547] border border-[#1E3A6D] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-300">{issue.typeLabel}</span>
                      <span className="text-[10px] font-mono text-slate-400">{issue.reportedAt}</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{issue.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ==================================================================
            MOBILE BOTTOM NAVIGATION / STATUS BAR
            ================================================================== */}
        <footer className="bg-[#071326] border-t border-[#1E3A6D] px-4 py-2.5 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-slate-300">BunkerStroy Haydovchi PWA</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <a
              href="tel:+998712000000"
              className="text-[#FFB800] hover:underline flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              <span>Dispetcher</span>
            </a>
          </div>
        </footer>
      </div>

      {/* ==================================================================
          MODAL: MUAMMO QAYD ETISH (LG-10: Kechikish, Shikastlanish, Aloqa yo'q)
          ================================================================== */}
      {isProblemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0F2547] rounded-2xl border-2 border-red-500/50 shadow-2xl p-5 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#1E3A6D] pb-3">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Muammo Qayd Etish</span>
              </div>
              <button
                onClick={() => setIsProblemModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitIssue} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Muammo sababi (LG-10 toifasi):
                </label>
                <select
                  value={problemType}
                  onChange={(e) => setProblemType(e.target.value as ProblemType)}
                  className="w-full text-xs bg-[#071326] border border-[#1E3A6D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#FFB800]"
                >
                  <option value="DELAY">Tirbandlik / Yo‘l harakati kechikishi</option>
                  <option value="CARGO_DAMAGE">Yuk shikastlanishi / Kamomad</option>
                  <option value="CLIENT_UNREACHABLE">Mijoz topilmadi / Telefon o‘chiq</option>
                  <option value="ROAD_BLOCKED">Manzilga kirish yo‘li yopiq</option>
                  <option value="VEHICLE_BREAKDOWN">Avtomashinada texnik nosozlik</option>
                  <option value="OTHER">Boshqa sabab</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Batafsil izoh:
                </label>
                <textarea
                  rows={3}
                  value={problemNotes}
                  onChange={(e) => setProblemNotes(e.target.value)}
                  placeholder="Holatni qisqacha bayon qiling..."
                  className="w-full text-xs bg-[#071326] border border-[#1E3A6D] rounded-xl p-2.5 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-[#FFB800]"
                />
              </div>

              {/* Photo upload for problem proof */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Holat fotosurati (Zararlanish, yo‘l yoki avariya):
                </label>
                <input
                  id="driver-problem-photo-input"
                  name="problemPhoto"
                  type="file"
                  accept="image/*"
                  ref={problemInputRef}
                  className="hidden"
                  onChange={(e) => handlePhotoUpload(e, setProblemPhoto)}
                />

                {problemPhoto ? (
                  <div className="relative rounded-xl overflow-hidden h-24 border border-red-500/50">
                    <img src={problemPhoto} alt="Muammo fotosi" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setProblemPhoto(null)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded p-1 text-[10px] cursor-pointer"
                    >
                      O‘chirish
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => problemInputRef.current?.click()}
                    className="w-full py-2 px-3 rounded-xl border border-dashed border-[#1E3A6D] hover:border-red-400 bg-[#071326] text-xs font-mono text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-red-400" />
                    <span>+ Foto biriktirish</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProblemModalOpen(false)}
                  className="py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono font-bold cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold shadow-lg shadow-red-600/30 cursor-pointer"
                >
                  Adminga yuborish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================
          MODAL: VAZIFANI RAD ETISH
          ================================================================== */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0F2547] rounded-2xl border-2 border-[#1E3A6D] p-5 space-y-4 animate-in zoom-in-95">
            <h4 className="font-bold text-sm text-white">Vazifani rad etish sababi:</h4>
            <div className="space-y-2 text-xs">
              {[
                'Mashina texnik nosozligi',
                'Hajm / tonnaj mos emas',
                'Yoqilg‘i yetarli emas',
                'Shaxsiy sabab / Navbat tugashi'
              ].map((reason, idx) => (
                <label
                  key={reason}
                  htmlFor={`driver-reject-reason-${idx}`}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-[#071326] border border-[#1E3A6D] cursor-pointer"
                >
                  <input
                    id={`driver-reject-reason-${idx}`}
                    type="radio"
                    name="rejectReason"
                    checked={rejectReason === reason}
                    onChange={() => setRejectReason(reason)}
                    className="text-[#FFB800]"
                  />
                  <span className="text-slate-300">{reason}</span>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono font-bold cursor-pointer"
              >
                Ortga
              </button>
              <button
                onClick={handleRejectTask}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold cursor-pointer"
              >
                Rad etishni tasdiqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
