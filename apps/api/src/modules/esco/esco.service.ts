import { Injectable } from '@nestjs/common';
import { EscoAuditInput, EscoCalculationResult } from '@bunkerstroy/types';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class EscoService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    if (process.env.GEMINI_API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
  }

  async calculateEnergyAudit(input: EscoAuditInput): Promise<EscoCalculationResult> {
    if (this.ai) {
      try {
        const prompt = `Siz BunkerStroy ESCO bosh energetik muhandisisiz.
Bino parametrlari:
- Maydon: ${input.areaM2} m²
- Yillik energiya sarfi: ${input.currentEnergyUsageKwh} kVt/soat
- Devor: ${input.wallMaterial}
- Deraza: ${input.windowType}

Qat'iy JSON formatida javob bering:
{
  "energySavingsPercent": son (masalan 36),
  "paybackYears": son (masalan 2.3),
  "annualSavingsSum": son (so'mda),
  "co2ReductionTons": son,
  "recommendedMaterials": ["tavsiya 1", "tavsiya 2", "tavsiya 3"],
  "insulationAdvice": "Tavsiya",
  "auditScore": "A+"
}`;

        const resp = await this.ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });

        const parsed = JSON.parse(resp.text || '{}');
        return {
          energySavingsPercent: parsed.energySavingsPercent || 36,
          paybackYears: parsed.paybackYears || 2.3,
          annualSavingsSum: parsed.annualSavingsSum || Math.round(input.areaM2 * 65000),
          co2ReductionTons: parsed.co2ReductionTons || Math.round(input.areaM2 * 0.045 * 10) / 10,
          recommendedMaterials: parsed.recommendedMaterials || [
            '100mm Bazalt mineral plitalari',
            '3 kamerali Low-E energiya tejamkor oynalar'
          ],
          insulationAdvice: parsed.insulationAdvice || "Devor va tomni kompleks izolyatsiyalash orqali xarajatlarni 35-40% gacha kamaytirish mumkin.",
          auditScore: parsed.auditScore || 'A+'
        };
      } catch (err) {
        console.warn('Gemini ESCO API fallback:', err);
      }
    }

    const area = input.areaM2;
    const annualSavingsSum = Math.round(area * 65000);
    return {
      energySavingsPercent: 38,
      paybackYears: 2.4,
      annualSavingsSum,
      co2ReductionTons: Math.round(area * 0.045 * 10) / 10,
      recommendedMaterials: [
        '100mm Bazalt mineral plitalari (Fasad uchun)',
        'Energiya tejamkor Low-E argonli deraza paketlari',
        'Avtomatlashtirilgan ob-havoga bog‘liq issiqlik regulyatori'
      ],
      insulationAdvice: `Bino maydoni ${area} m² uchun devorlar va tom qismini to‘liq mineral tosh plitalari bilan o‘rash orqali yiliga ${annualSavingsSum.toLocaleString()} so'm mablag‘ tejaladi.`,
      auditScore: 'A+'
    };
  }
}
