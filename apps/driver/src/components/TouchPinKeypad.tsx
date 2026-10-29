import React, { useEffect, useCallback } from 'react';
import { Delete, RotateCcw, KeyRound, XCircle } from 'lucide-react';

export interface TouchPinKeypadProps {
  pin: string;
  onChange: (pin: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  error?: string | null;
  triggerHaptic?: (type: 'success' | 'alert' | 'click') => void;
  maxLength?: number;
}

export const TouchPinKeypad: React.FC<TouchPinKeypadProps> = ({
  pin,
  onChange,
  onSubmit,
  disabled = false,
  error = null,
  triggerHaptic,
  maxLength = 4
}) => {
  // Built-in haptic vibration & Web Audio click feedback
  const playFeedback = useCallback((type: 'click' | 'alert' | 'success') => {
    if (triggerHaptic) {
      triggerHaptic(type);
      return;
    }
    if (typeof window !== 'undefined') {
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate(type === 'alert' ? [60, 80, 60] : [30, 40]);
        } catch {
          // ignore
        }
      }
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          const now = ctx.currentTime;
          osc.frequency.setValueAtTime(type === 'alert' ? 330 : 800, now);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + (type === 'alert' ? 0.2 : 0.05));
          osc.start(now);
          osc.stop(now + (type === 'alert' ? 0.2 : 0.05));
        }
      } catch {
        // ignore audio context restrictions
      }
    }
  }, [triggerHaptic]);

  const handleDigitPress = useCallback((digit: string) => {
    if (disabled) return;
    if (pin.length < maxLength) {
      playFeedback('click');
      onChange(pin + digit);
    }
  }, [disabled, pin, maxLength, playFeedback, onChange]);

  const handleDelete = useCallback(() => {
    if (disabled || pin.length === 0) return;
    playFeedback('click');
    onChange(pin.slice(0, -1));
  }, [disabled, pin, playFeedback, onChange]);

  const handleClear = useCallback(() => {
    if (disabled || pin.length === 0) return;
    playFeedback('alert');
    onChange('');
  }, [disabled, pin, playFeedback, onChange]);

  // Physical keyboard support for convenience with input field safety check
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        e.preventDefault();
        handleClear();
      } else if (e.key === 'Enter' && pin.length === maxLength) {
        e.preventDefault();
        onSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, handleDigitPress, handleDelete, handleClear, pin, maxLength, onSubmit]);

  const keys: Array<{ label: string; action: () => void; ariaLabel: string; type: 'number' | 'clear' | 'backspace' }> = [
    { label: '1', action: () => handleDigitPress('1'), ariaLabel: 'Raqam 1', type: 'number' },
    { label: '2', action: () => handleDigitPress('2'), ariaLabel: 'Raqam 2', type: 'number' },
    { label: '3', action: () => handleDigitPress('3'), ariaLabel: 'Raqam 3', type: 'number' },
    { label: '4', action: () => handleDigitPress('4'), ariaLabel: 'Raqam 4', type: 'number' },
    { label: '5', action: () => handleDigitPress('5'), ariaLabel: 'Raqam 5', type: 'number' },
    { label: '6', action: () => handleDigitPress('6'), ariaLabel: 'Raqam 6', type: 'number' },
    { label: '7', action: () => handleDigitPress('7'), ariaLabel: 'Raqam 7', type: 'number' },
    { label: '8', action: () => handleDigitPress('8'), ariaLabel: 'Raqam 8', type: 'number' },
    { label: '9', action: () => handleDigitPress('9'), ariaLabel: 'Raqam 9', type: 'number' },
    { label: 'C', action: handleClear, ariaLabel: 'Tozalash', type: 'clear' },
    { label: '0', action: () => handleDigitPress('0'), ariaLabel: 'Raqam 0', type: 'number' },
    { label: '⌫', action: handleDelete, ariaLabel: 'Bitta o‘chirish', type: 'backspace' },
  ];

  return (
    <div className="w-full flex flex-col items-center space-y-4 select-none touch-manipulation">
      {/* 4 Digit Slots Display */}
      <div
        className="flex items-center justify-center gap-3 w-full py-2"
        role="group"
        aria-label="Kiritilgan PIN kod katakchalari"
      >
        {Array.from({ length: maxLength }).map((_, idx) => {
          const char = pin[idx];
          const isCurrent = idx === pin.length && !disabled;
          const isFilled = char !== undefined;

          return (
            <div
              key={idx}
              className={`w-14 h-16 sm:w-16 sm:h-18 rounded-2xl border-2 flex items-center justify-center font-mono text-3xl font-black transition-all ${
                isFilled
                  ? 'bg-[#071326] border-[#FFB800] text-amber-300 shadow-[0_0_12px_rgba(255,184,0,0.3)] scale-105'
                  : isCurrent
                  ? 'bg-[#0A1931] border-sky-400 text-sky-400 ring-2 ring-sky-400/30 animate-pulse'
                  : 'bg-[#071326] border-[#1E3A6D] text-slate-600'
              }`}
            >
              {isFilled ? char : <span className="w-2 h-2 rounded-full bg-slate-600" />}
            </div>
          );
        })}
      </div>

      {/* 3x4 Touch Numpad Group (Every button minimum 60x60px for heavy cabin gloves) */}
      <div
        className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full max-w-[360px]"
        role="group"
        aria-label="Sensorli raqamli klaviatura"
      >
        {keys.map((k, index) => {
          const isNumber = k.type === 'number';
          const isClear = k.type === 'clear';
          const isBack = k.type === 'backspace';

          return (
            <button
              key={index}
              type="button"
              disabled={disabled}
              onClick={k.action}
              aria-label={k.ariaLabel}
              className={`w-full min-w-[60px] min-h-[60px] h-[64px] sm:h-[68px] rounded-2xl flex items-center justify-center font-mono transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md touch-manipulation border ${
                isNumber
                  ? 'bg-[#0F2547] hover:bg-[#132C54] active:bg-[#1A3865] border-[#1E3A6D] active:border-[#FFB800] text-white text-2xl font-black'
                  : isClear
                  ? 'bg-[#181E2E] hover:bg-[#222B3F] active:bg-[#2A354E] border-[#2A374F] text-amber-400 text-sm font-bold flex flex-col items-center gap-0.5'
                  : 'bg-[#181E2E] hover:bg-[#222B3F] active:bg-[#2A354E] border-[#2A374F] text-rose-400 flex items-center justify-center'
              }`}
            >
              {isBack ? (
                <Delete className="w-6 h-6 stroke-[2.2]" />
              ) : isClear ? (
                <>
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] tracking-tight uppercase font-mono">Tozalash</span>
                </>
              ) : (
                k.label
              )}
            </button>
          );
        })}
      </div>

      {/* Optional In-Keypad Error Notice */}
      {error && (
        <p className="text-xs font-mono text-red-400 flex items-center justify-center gap-1.5 pt-1 text-center font-bold animate-in fade-in">
          <XCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {/* Confirmation Button */}
      <button
        type="button"
        disabled={disabled || pin.length !== maxLength}
        onClick={() => {
          playFeedback('click');
          onSubmit();
        }}
        className="w-full max-w-[360px] min-h-[56px] py-3.5 px-6 rounded-2xl bg-[#FFB800] hover:bg-amber-400 active:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-black font-mono text-sm font-black transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
      >
        <KeyRound className="w-5 h-5 text-black" />
        <span>PIN-KODNI TASDIQLASH</span>
      </button>
    </div>
  );
};
