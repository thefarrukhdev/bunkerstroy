import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Send,
  X,
  Volume2,
  VolumeX,
  Bot,
  User,
  RotateCcw,
  ShieldCheck,
  Building2,
  Truck
} from 'lucide-react';
import { Modal, Button, Badge } from '@bunkerstroy/ui';
import { triggerHaptic } from '../../services/mobileBridge';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  action?: {
    label: string;
    path: string;
  };
}

const QUICK_PROMPTS = [
  'Sement M500 narxi qancha?',
  'HOWO 25t samosval hisoblash',
  '50/50 Escrow qanday ishlaydi?',
  'Bekobod armatura A500C',
  'Yetkazib berish muddati'
];

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: 'Assalomu alaykum! Men BunkerStroy AI muhandis yordamchisiman. Qurilish mollari narxi, 50/50 Escrow to‘lovi, yoki og‘ir texnika yetkazib berish bo‘yicha savolingiz bormi?',
      time: 'Hozir'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleToggleMic = () => {
    triggerHaptic('medium');
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Simulate listening and auto-respond after 3 seconds if Web Speech API isn't supported
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        try {
          const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.lang = 'uz-UZ';
          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputText(transcript);
            setIsListening(false);
            handleSend(transcript);
          };
          recognition.onerror = () => setIsListening(false);
          recognition.onend = () => setIsListening(false);
          recognition.start();
          return;
        } catch {
          // fallback
        }
      }

      // Voice recognition fallback
      setTimeout(() => {
        setIsListening(false);
        const samplePrompt = 'Sement M500 narxi va ombordagi zaxirasi';
        setInputText(samplePrompt);
        handleSend(samplePrompt);
      }, 2500);
    }
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    triggerHaptic('light');
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Generate intelligent engineering responses
    setTimeout(() => {
      let aiResponse =
        'Savolingiz qabul qilindi. BunkerStroy katalogida 100% akkreditatsiyalangan zavod narxlari va 50/50 Escrow to‘lovi kafolatlangan.';
      let action: { label: string; path: string } | undefined = undefined;

      const lower = query.toLowerCase();
      if (lower.includes('sement')) {
        aiResponse =
          '«Qizilqum Sement» va «Ohangaron Sement» M500 D0 markasi omborda mavjud. Narxi: 720,000 so‘m/tonna (qopda: 36,000 so‘m/qop). Ob‘ektgacha HOWO samosvalda yetkazib beriladi.';
        action = { label: 'Katalogda sementni ko‘rish', path: '/' };
      } else if (lower.includes('armatura') || lower.includes('metall')) {
        aiResponse =
          '«O‘zmetkombinat» Bekobod A500C/A600C armaturalari d8 dan d32 gacha mavjud. Ulgurji zavod narxi: 9,400,000 so‘m/tonna. Laboratoriya sertifikati va 12% QQS initsial kiritilgan.';
        action = { label: 'Armatura katalogi', path: '/' };
      } else if (lower.includes('howo') || lower.includes('transport') || lower.includes('yetkazish')) {
        aiResponse =
          'BunkerStroy logistika parkida HOWO 25t, Shacman mikser va Isuzu bortli mashinalar mavjud. Masofa bo‘yicha tarif: Baza 350,000 so‘m + 15,000 so‘m/km.';
        action = { label: 'Logistika hisoblash', path: '/logistics' };
      } else if (lower.includes('escrow') || lower.includes('50/50') || lower.includes('to‘lov')) {
        aiResponse =
          '50/50 Xavfsiz Escrow: 50% avans buyurtmada to‘lanadi, yuk ob‘ektga yetib kelgach tekshirilib, qolgan 50% to‘lanadi va haydovchiga 4-xonali Qabul Kodi (PIN) aytiladi.';
        action = { label: 'Buyurtmalarim', path: '/orders' };
      } else if (lower.includes('kalkulyator') || lower.includes('beton') || lower.includes('g‘isht')) {
        aiResponse =
          'Siz uchun Beton, G‘isht, Armatura va ESCO termoizolyatsiya muhandislik kalkulyatorimiz tayyor. Kerakli o‘lchamlarni kiritib, sarf-xarajatni hisoblang.';
        action = { label: 'Kalkulyatorga o‘tish', path: '/calculators' };
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponse,
        time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
        action
      };

      setMessages((prev) => [...prev, aiMsg]);
      triggerHaptic('success');
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#FFB800] text-[#071326] flex items-center justify-center font-black text-xs">
            AI
          </div>
          <span className="font-heading font-black">Bunker Ovozli Yordamchi</span>
        </div>
      }
      subtitle="Sun'iy intellekt asosida qurilish materiallari va logistika bo‘yicha maslahatchi"
      headerExtra={
        <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ONLINE
        </span>
      }
    >
      <div className="space-y-4 font-sans text-xs">
        {/* Chat History Container */}
        <div className="h-64 sm:h-72 overflow-y-auto space-y-3 p-3 bg-[#071326] border border-[#1E3A6D] rounded-2xl touch-scroll">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-[#0F2547] border border-[#254B85] flex items-center justify-center text-[#FFB800] shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-[#FFB800] text-[#071326] font-bold rounded-tr-none'
                    : 'bg-[#0A1931] border border-[#1E3A6D] text-sky-100 rounded-tl-none'
                }`}
              >
                <p>{m.text}</p>

                {m.action && onNavigate && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigate(m.action!.path);
                    }}
                    className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#132C54] hover:bg-[#1E3A6D] text-[#FFB800] border border-[#254B85] text-[11px] font-mono font-bold cursor-pointer transition-colors"
                  >
                    <span>{m.action.label}</span>
                    <Sparkles className="w-3 h-3 text-[#FFB800]" />
                  </button>
                )}

                <span
                  className={`block text-[9px] font-mono mt-1 ${
                    m.sender === 'user' ? 'text-black/60 text-right' : 'text-sky-400/70'
                  }`}
                >
                  {m.time}
                </span>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-[#132C54] border border-[#254B85] flex items-center justify-center text-white shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Listening Animation Indicator */}
        {isListening && (
          <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-amber-500/10 border border-[#FFB800]/40 text-[#FFB800] font-mono text-xs animate-pulse">
            <Mic className="w-4 h-4 text-[#FFB800] animate-bounce" />
            <span>Tinglayapman... Marhamat, savolingizni ayting.</span>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none pb-1 touch-pan-x">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-lg bg-[#0F2547] hover:bg-[#132C54] border border-[#1E3A6D] text-sky-200 hover:text-white font-mono text-[10px] whitespace-nowrap cursor-pointer transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Voice and Text Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 pt-1 font-mono"
        >
          <button
            type="button"
            onClick={handleToggleMic}
            className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md shrink-0 touch-target-44 ${
              isListening
                ? 'bg-red-600 text-white animate-pulse ring-2 ring-red-400'
                : 'btn-industrial-yellow'
            }`}
            title={isListening ? 'Mikrofonni to‘xtatish' : 'Ovoz bilan so‘rash'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Savolingizni yozing yoki mikrofonga ayting..."
            className="flex-1 h-11 px-3.5 rounded-xl bg-[#071326] border border-[#1E3A6D] focus:border-[#FFB800] text-xs sm:text-sm text-white placeholder-sky-300/50 outline-none"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-[#132C54] hover:bg-[#1E3A6D] disabled:opacity-40 border border-[#254B85] text-[#FFB800] flex items-center justify-center cursor-pointer transition-colors shrink-0 touch-target-44"
            title="Yuborish"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </Modal>
  );
};
