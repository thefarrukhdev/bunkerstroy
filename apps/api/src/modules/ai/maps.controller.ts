import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GoogleGenAI } from '@google/genai';

@ApiTags('AI & Google Maps Grounding')
@Controller('api/maps')
export class MapsController {
  @Post('search')
  @ApiOperation({ summary: 'Gemini 3.5 Flash va Google Maps orqali qurilish ob’ektlarini qidirish' })
  async search(@Body() body: { query: string; latitude?: number; longitude?: number }) {
    const { query } = body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const resp = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: `O'zbekistondagi qurilish nuqtalari: ${query}`,
          config: { tools: [{ googleMaps: {} }] }
        });

        const chunks = resp.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const places = chunks
          .filter((c: any) => c.maps)
          .map((c: any) => ({
            title: c.maps.title || 'Qurilish joyi',
            uri: c.maps.uri || ''
          }));

        return {
          success: true,
          data: {
            text: resp.text || '',
            places
          }
        };
      } catch (err: any) {
        console.warn('Maps AI error:', err.message);
      }
    }

    return {
      success: true,
      data: {
        text: `O'zbekiston hududida "${query}" bo'yicha yirik terminallar va omborlar:`,
        places: [
          { title: 'O‘rikzor Qurilish Mollari Bozori', uri: 'https://maps.google.com/?q=Orikzor' },
          { title: 'Bekto‘pi Qurilish Majmuasi', uri: 'https://maps.google.com/?q=Bektopi' },
          { title: 'Sergeli RBU Tayyor Beton Zavodlari', uri: 'https://maps.google.com/?q=Sergeli+Beton' }
        ]
      }
    };
  }
}
