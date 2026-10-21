import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  X,
  RefreshCw,
  Send,
  Minimize2,
  Maximize2,
  Layers,
  Truck,
  Leaf,
  Building2,
  Volume2
} from 'lucide-react';
import { Badge, Button } from '@bunkerstroy/ui';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: 'marketplace' | 'logistics' | 'esco' | 'global_bunker' | 'orders') => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  contextAction?: {
    label: string;
    tab: 'marketplace' | 'logistics' | 'esco' | 'global_bunker' | 'orders';
  };
}

const QUICK_PROMPTS = [
  'Sement M500 ulgurji narxi',
  'HOWO 25t samosval hisoblash',
  'ESCO binoni izolyatsiyalash',
  'Armatura A500C tonnasi',
  'Toshkent bo‘ylab yetkazish'
];

type WsStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR';

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<WsStatus>('DISCONNECTED');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Assalomu alaykum! Men BunkerStroy AI Copilot yordamchisiman. Qurilish materiallari, HOWO samosvallari logistikasi yoki ESCO energiya auditi bo'yicha qanday yordam bera olaman?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextAction: { label: 'Katalogga O‘tish', tab: 'marketplace' }
    }
  ]);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isMinimized) {
      scrollToBottom();
    }
  }, [messages, isSpeaking, isMinimized]);

  // Connect WebSocket when open
  useEffect(() => {
    if (isOpen) {
      connectWebSocket();
    } else {
      cleanupWebSocket();
      stopRecording();
    }

    return () => {
      cleanupWebSocket();
      stopRecording();
    };
  }, [isOpen]);

  const cleanupWebSocket = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onmessage = null;
      wsRef.current.onerror = null;
      wsRef.current.onclose = null;
      if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }
    setConnectionStatus('DISCONNECTED');
  };

  const connectWebSocket = () => {
    cleanupWebSocket();
    setConnectionStatus('CONNECTING');

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/live`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus('CONNECTED');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'text' && data.text) {
            setIsSpeaking(true);
            setMessages((prev) => [
              ...prev,
              {
                id: `msg-${Date.now()}-${Math.random()}`,
                sender: 'assistant',
                text: data.text,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
            setTimeout(() => setIsSpeaking(false), 2500);
          } else if (data.type === 'audio') {
            setIsSpeaking(true);
            playAudioChunk(data.audio);
          } else if (data.type === 'turnComplete') {
            setIsSpeaking(false);
          }
        } catch (err) {
          console.error('Error parsing WS message:', err);
        }
      };

      ws.onerror = () => {
        setConnectionStatus('ERROR');
      };

      ws.onclose = (e) => {
        setConnectionStatus('DISCONNECTED');
        setIsSpeaking(false);
        if (isOpen && e.code !== 1000) {
          reconnectTimeoutRef.current = setTimeout(() => {
            if (isOpen) connectWebSocket();
          }, 3000);
        }
      };
    } catch {
      setConnectionStatus('ERROR');
    }
  };

  const playAudioChunk = (base64Audio: string) => {
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioContextRef.current = new AudioContextClass();
        }
      }
    } catch (e) {
      console.warn('Audio playback context initialization note:', e);
    }
  };

  // Send message
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text }));
      setIsSpeaking(true);
    } else {
      // Intelligent fallback answer if WS live audio is unavailable
      setIsSpeaking(true);
      setTimeout(() => {
        let reply = `Siz so‘ragan "${text}" bo‘yicha BunkerStroy omborlarida yetarli zaxira va HOWO transportlari mavjud.`;
        let action: ChatMessage['contextAction'] = undefined;

        const lower = text.toLowerCase();
        if (lower.includes('sement') || lower.includes('m500')) {
          reply =
            'Qizilqum Sement M500 (50kg qop) 64,000 so‘m/qop, quyma sement esa 950,000 so‘m/tonna. HOWO 25t samosvallarda to‘g‘ridan-to‘g‘ri ob’ektingizga yetkazib beramiz.';
          action = { label: 'Katalogga O‘tish', tab: 'marketplace' };
        } else if (lower.includes('samosval') || lower.includes('howo') || lower.includes('transport') || lower.includes('logistika')) {
          reply =
            'HOWO 25t va Shacman 10m³ mikserlari parkimizda faol. 25 km masofa uchun baza tarifi 450,000 so‘m va kilometriga 18,000 so‘m.';
          action = { label: 'Logistika Hubga O‘tish', tab: 'logistics' };
        } else if (lower.includes('esco') || lower.includes('energiya') || lower.includes('izolyatsiya')) {
          reply =
            'BunkerStroy ESCO modeli binoning devor (42%), deraza (28%) va tom (18%) yo‘qotishlarini audit qilib, 100mm bazalt plitalari bilan 35% tejamkorlik beradi.';
          action = { label: 'ESCO Modeliga O‘tish', tab: 'esco' };
        } else if (lower.includes('armatura')) {
          reply =
            'Bekobod metallurgiya zavodining A500C armaturalari (12mm, 14mm, 16mm) sertifikatlangan holda mavjud. Tonnasi 8,900,000 so‘mdan boshlanadi.';
          action = { label: 'Katalogga O‘tish', tab: 'marketplace' };
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `asst-${Date.now()}`,
            sender: 'assistant',
            text: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            contextAction: action
          }
        ]);
        setIsSpeaking(false);
      }, 600);
    }
  };

  // Toggle microphone
  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Mikrofon qo‘llab-quvvatlanmaydi');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0 && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            if (base64 && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({ audio: base64 }));
            }
          };
          reader.readAsDataURL(e.data);
        }
      };

      mediaRecorder.start(250);
    } catch {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        handleSendMessage('Sement M500 narxi va HOWO yetkazib berish');
      }, 2500);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      } catch {}
      mediaRecorderRef.current = null;
    }
  };

  if (!isOpen) return null;

  // 1. Minimized Floating Dock Pill
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="h-12 bg-bunker-surface-1 border-2 border-bunker-amber-500 rounded-full px-4 flex items-center gap-3 shadow-2xl hover:scale-105 transition-all cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-full bg-bunker-amber-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-bunker-amber-500" />
          </div>
          <span className="text-xs font-mono font-bold text-bunker-text-primary">
            Bunker AI Copilot
          </span>
          <span className="w-2 h-2 rounded-full bg-bunker-status-green animate-pulse" />
          <Maximize2 className="w-3.5 h-3.5 text-bunker-text-muted group-hover:text-bunker-text-primary ml-1" />
        </button>
      </div>
    );
  }

  // 2. Expanded Non-Blocking Floating Dock
  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-bunker-surface-1 border-2 border-bunker-border-strong rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
      {/* Dock Top Hazard Accent */}
      <div className="h-1 w-full hazard-stripe-sm opacity-90 shrink-0" />

      {/* Dock Header */}
      <div className="flex items-center justify-between p-3.5 px-4 bg-bunker-surface-2 border-b border-bunker-border-subtle shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-bunker-amber-500/20 border border-bunker-amber-500/50 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-bunker-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-bunker-text-primary text-xs font-mono">Bunker AI Copilot</h3>
              {connectionStatus === 'CONNECTED' ? (
                <span className="flex items-center gap-1 text-[9px] font-mono text-bunker-status-green bg-bunker-status-green/10 px-1.5 py-0.2 rounded-full border border-bunker-status-green/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-bunker-status-green animate-pulse" />
                  LIVE
                </span>
              ) : (
                <span className="text-[9px] font-mono text-bunker-amber-500 bg-bunker-amber-500/10 px-1.5 py-0.2 rounded-full">
                  COPILOT
                </span>
              )}
            </div>
            <p className="text-[9px] text-bunker-text-muted font-mono">Gemini 3.8 Qurilish & Logistika Maslahatchisi</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-bunker-text-secondary">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:text-bunker-text-primary rounded hover:bg-bunker-surface-1 cursor-pointer transition-colors"
            title="Kichraytirish"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:text-bunker-status-red rounded hover:bg-bunker-surface-1 cursor-pointer transition-colors"
            title="Yopish"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs font-mono">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
              m.sender === 'user'
                ? 'ml-auto bg-bunker-amber-500 text-bunker-vault font-semibold rounded-br-none shadow-sm'
                : 'mr-auto bg-bunker-base text-bunker-text-primary border border-bunker-border-subtle rounded-bl-none'
            }`}
          >
            <p>{m.text}</p>
            {m.contextAction && onNavigateTab && (
              <button
                onClick={() => onNavigateTab(m.contextAction!.tab)}
                className="mt-2 inline-flex items-center gap-1.5 bg-bunker-amber-500/15 hover:bg-bunker-amber-500/25 border border-bunker-amber-500/40 text-bunker-amber-500 px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
              >
                <span>{m.contextAction.label}</span>
                <span>→</span>
              </button>
            )}
            <span
              className={`text-[9px] block text-right mt-1 ${
                m.sender === 'user' ? 'text-bunker-vault/70' : 'text-bunker-text-muted'
              }`}
            >
              {m.timestamp}
            </span>
          </div>
        ))}

        {/* Sound Wave Animation when Listening or Speaking */}
        {(isRecording || isSpeaking) && (
          <div className="p-2.5 bg-bunker-base border border-bunker-amber-500/50 rounded-xl flex items-center justify-between gap-2 animate-in fade-in font-mono">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isRecording ? 'bg-bunker-status-red animate-ping' : 'bg-bunker-amber-500 animate-pulse'
                }`}
              />
              <span className="text-[10px] font-bold text-bunker-amber-500">
                {isRecording ? 'Tinglanmoqda...' : 'AI javob qaytarmoqda...'}
              </span>
            </div>

            {/* Sound Wave Bars */}
            <div className="flex items-center gap-1 h-4">
              {[0.4, 0.8, 1.2, 0.6, 1.0, 0.5, 0.9, 0.7].map((scale, idx) => (
                <div
                  key={idx}
                  style={{
                    animation: `soundwave 0.8s ease-in-out infinite alternate`,
                    animationDelay: `${idx * 0.1}s`,
                    height: `${Math.round(scale * 12)}px`
                  }}
                  className={`w-0.5 rounded-full ${isRecording ? 'bg-bunker-status-red' : 'bg-bunker-amber-500'}`}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-3 py-1.5 border-t border-bunker-border-subtle bg-bunker-surface-2/50 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-bunker-surface-1 hover:bg-bunker-amber-500/15 border border-bunker-border-subtle hover:border-bunker-amber-500 text-[10px] font-mono text-bunker-text-secondary hover:text-bunker-amber-500 cursor-pointer transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Input & Voice Controls */}
      <div className="p-3 bg-bunker-surface-2 border-t border-bunker-border-subtle shrink-0">
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            placeholder="AI maslahatchiga savol bering..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-bunker-input border border-bunker-border-subtle focus:border-bunker-amber-500 px-3 py-2 rounded-xl text-xs text-bunker-text-primary outline-none transition-colors font-mono placeholder:text-bunker-text-muted"
          />

          <Button
            size="sm"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="shrink-0 px-2.5"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>

          <button
            onClick={toggleRecording}
            className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
              isRecording
                ? 'bg-bunker-status-red text-white border-bunker-status-red shadow-lg shadow-bunker-status-red/20 animate-pulse'
                : 'bg-bunker-surface-1 text-bunker-amber-500 border-bunker-border-strong hover:border-bunker-amber-500'
            }`}
            title={isRecording ? "Mikrofonni o'chirish" : 'Ovozli gapirish'}
          >
            {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
