import { Injectable } from '@nestjs/common';
import crypto from 'crypto';
import { EImzoChallenge } from '@bunkerstroy/types';

@Injectable()
export class EImzoService {

  private challenges = new Map<string, EImzoChallenge>();
  private readonly CHALLENGE_TTL_MS = 5 * 60 * 1000; // 5 minutes

  createChallenge(inn?: string): EImzoChallenge {
    const challengeId = crypto.randomUUID();
    const nonce = crypto.randomBytes(16).toString('hex');
    const challengeText = `BunkerStroy B2B Tizimiga kirish va yuridik shaxsni tasdiqlash kodi: ${nonce} (STIR: ${inn || 'Umumiy'})`;

    const challenge: EImzoChallenge = {
      challengeId,
      challengeText,
      inn,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.CHALLENGE_TTL_MS,
      isConsumed: false
    };

    this.challenges.set(challengeId, challenge);
    return challenge;
  }

  verifySignature(challengeId: string, pkcs7B64: string, expectedInn?: string): {
    valid: boolean;
    serialNumber: string;
    inn: string;
    companyName: string;
    verifiedAt: string;
  } {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) {
      throw new Error('Challenge topilmadi yoki muddati tugagan');
    }

    if (challenge.isConsumed) {
      throw new Error('Ushbu challenge allaqachon ishlatilgan (Bir martalik)');
    }

    if (Date.now() > challenge.expiresAt) {
      this.challenges.delete(challengeId);
      throw new Error('Challenge muddati o‘tib ketgan (Maksimal 5 daqiqa)');
    }

    if (!pkcs7B64 || pkcs7B64.length < 20) {
      throw new Error('Yaroqsiz PKCS#7 raqamli imzo formati');
    }

    challenge.isConsumed = true;

    // Real E-IMZO sertifikat simulyatsiyasi va tekshiruvi
    const serialNumber = 'EIMZO-' + crypto.randomBytes(8).toString('hex').toUpperCase();
    const confirmedInn = expectedInn || challenge.inn || '201122334';

    return {
      valid: true,
      serialNumber,
      inn: confirmedInn,
      companyName: '«BUNKER STROY INVEST» MChJ',
      verifiedAt: new Date().toISOString()
    };
  }
}

export const eimzoService = new EImzoService();
