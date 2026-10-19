import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { env } from '../../config/env';

export function setupLiveVoiceGateway(server: Server) {
  const wss = new WebSocketServer({ server, path: '/api/live' });

  wss.on('connection', async (clientWs: WebSocket) => {
    console.log('Client connected to Live Voice Gateway');

    if (!env.GEMINI_API_KEY) {
      clientWs.send(
        JSON.stringify({
          type: 'text',
          text: "BunkerStroy Voice Agent faollashtirildi (Demo rejim). Gemini API kaliti kiritilganda to'liq ovozli muloqot ishlaydi."
        })
      );
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
      const session = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
          },
          systemInstruction: `Siz BunkerStroy kompaniyasining aqlli ovozli maslahatchisisiz (BunkerStroy Voice Agent).
Siz quyidagi sohalarda mijozlarga professional maslahat berasiz:
1. Qurilish mollari (Sement M400/M500, g'isht, armatura A500C, quruq qorishmalar, izolyatsiya plitalari).
2. Logistika va transport (Samosval, Avtokran, Mikser, Manipulyator, Gazel yetkazib berish va marshrut hisobi).
3. ESCO (Energiya samaradorlik auditi, binolarni issiqlik izolyatsiyalash, energiya tejamkor qurilish).
Siz o'zbek tilida tabiiy, samimiy va professional gapirasiz. Javoblaringiz qisqa, aniq va jonli muloqotga mos bo'lsin.`
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const parts = message.serverContent?.modelTurn?.parts;
            if (parts && parts.length > 0) {
              for (const part of parts) {
                if (part.inlineData?.data) {
                  clientWs.send(JSON.stringify({ type: 'audio', audio: part.inlineData.data }));
                }
                if (part.text) {
                  clientWs.send(JSON.stringify({ type: 'text', text: part.text }));
                }
              }
            }
            if (message.serverContent?.turnComplete) {
              clientWs.send(JSON.stringify({ type: 'turnComplete' }));
            }
          },
          onerror: (err: any) => {
            console.error('Live Voice API error:', err);
          }
        }
      });

      clientWs.on('message', (data: Buffer | string) => {
        try {
          const parsed = JSON.parse(data.toString());
          if (parsed.audio) {
            session.sendRealtimeInput({
              audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' }
            });
          } else if (parsed.text) {
            session.sendRealtimeInput({ text: parsed.text });
          }
        } catch (err) {
          console.error('Error forwarding client audio/text to Live session:', err);
        }
      });

      clientWs.on('close', () => {
        try {
          session.close();
        } catch {}
      });
    } catch (err: any) {
      console.error('Live voice connection error:', err);
    }
  });

  return wss;
}
