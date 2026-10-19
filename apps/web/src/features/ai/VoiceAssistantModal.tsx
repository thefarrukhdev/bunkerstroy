import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, X, RefreshCw } from 'lucide-react';
import { Badge, Button } from '@bunkerstroy/ui';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'assistant'; text: string }[]>([
    {
      sender: 'assistant',
      text: "Assalomu alaykum! Men BunkerStroy ovozli maslahatchisiman. Qurilish mollari, transport yoki ESCO auditi bo'yicha qanday yordam bera olaman?"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (isOpen) {
      connectWs();
    } else {
      if (wsRef.current) {
        wsRef.current.close();
      }
    }
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [isOpen]);

  const connectWs = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/live`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'text') {
          setMessages((prev) => [...prev, { sender: 'assistant', text: data.text }]);
        }
      } catch (err) {
        console.error(err);
      }
    };
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', text: inputText }]);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text: inputText }));
    } else {
      // Mock instant reply if WS is not streaming
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: `Siz so‘ragan "${inputText}" bo‘yicha BunkerStroy omborlarida yetarli zaxira va HOWO transportlari mavjud.`
          }
        ]);
      }, 700);
    }
    setInputText('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#1A1D20] border border-[#33373B] rounded-3xl p-6 space-y-5 shadow-2xl flex flex-col h-[520px]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#33373B]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FFB800]/20 border border-[#FFB800]/50 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#FFB800]" />
            </div>
            <div>
              <h3 className="font-bold text-[#F5F5F2] text-sm">Bunker Voice AI Agent</h3>
              <p className="text-[10px] text-[#B8B8B3]">Gemini 3.8 Live Jonli Ovozli Maslahatchi</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#B8B8B3] hover:text-[#F5F5F2] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                m.sender === 'user'
                  ? 'ml-auto bg-[#FFB800] text-[#151719] font-semibold'
                  : 'mr-auto bg-[#151719] text-[#F5F5F2] border border-[#33373B]'
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        {/* Bottom controls */}
        <div className="space-y-3 pt-2 border-t border-[#33373B]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Savolingizni yozing yoki mikrofondan foydalaning..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
              className="flex-1 bg-[#151719] border border-[#33373B] px-3.5 py-2.5 rounded-xl text-xs text-[#F5F5F2] outline-none"
            />
            <Button size="sm" onClick={handleSendText}>
              Yuborish
            </Button>
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isRecording
                  ? 'bg-red-500 text-white border-red-400 animate-pulse'
                  : 'bg-[#292C2F] text-[#FFB800] border-[#51504A] hover:border-[#FFB800]'
              }`}
              title="Ovozli gapirish"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
