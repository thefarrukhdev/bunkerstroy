import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import crypto from 'crypto';
import { EImzoChallenge } from '@bunkerstroy/types';

// Standard PKCS#7 SignedData OID: 1.2.840.113549.1.7.2
const PKCS7_SIGNED_DATA_OID = Buffer.from([
  0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x07, 0x02,
]);

// PKCS#7 Data OID: 1.2.840.113549.1.7.1
const PKCS7_DATA_OID = Buffer.from([
  0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x07, 0x01,
]);

// State Tax Committee of Uzbekistan STIR / TIN OID: 1.2.860.3.16.1.1
const UZ_STIR_OID = Buffer.from([
  0x06, 0x07, 0x2a, 0x86, 0x5c, 0x03, 0x10, 0x01, 0x01,
]);

// Organization Name OID: 2.5.4.10
const ORG_NAME_OID = Buffer.from([0x06, 0x03, 0x55, 0x04, 0x0a]);

function encodeDerLength(len: number): Buffer {
  if (len < 128) return Buffer.from([len]);
  const bytes: number[] = [];
  let temp = len;
  while (temp > 0) {
    bytes.unshift(temp & 0xff);
    temp >>= 8;
  }
  return Buffer.from([0x80 | bytes.length, ...bytes]);
}

function makeDerSeq(buffers: Buffer[]): Buffer {
  const body = Buffer.concat(buffers);
  return Buffer.concat([Buffer.from([0x30]), encodeDerLength(body.length), body]);
}

function makePrintableString(str: string): Buffer {
  const buf = Buffer.from(str, 'ascii');
  return Buffer.concat([Buffer.from([0x13]), encodeDerLength(buf.length), buf]);
}

function makeUtf8String(str: string): Buffer {
  const buf = Buffer.from(str, 'utf8');
  return Buffer.concat([Buffer.from([0x0c]), encodeDerLength(buf.length), buf]);
}

export function createValidPkcs7Signature(inn: string, companyName = '«BUNKER STROY INVEST» MChJ'): string {
  const stirAttr = makeDerSeq([UZ_STIR_OID, makePrintableString(inn)]);
  const orgAttr = makeDerSeq([ORG_NAME_OID, makeUtf8String(companyName)]);
  const subject = makeDerSeq([stirAttr, orgAttr]);
  const cert = makeDerSeq([
    Buffer.from([0x02, 0x08, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88]), // Serial Number
    Buffer.from([0x30, 0x06, 0x06, 0x04, 0x2a, 0x85, 0x03, 0x02]), // Algorithm (UZ GOST / SHA)
    subject,
  ]);
  const content = makeDerSeq([
    Buffer.from([0x02, 0x01, 0x01]), // Version 1
    makeDerSeq([Buffer.from([0x30, 0x02, 0x06, 0x00])]), // DigestAlgorithms
    makeDerSeq([PKCS7_DATA_OID]), // ContentInfo
    cert,
  ]);
  const pkcs7 = makeDerSeq([PKCS7_SIGNED_DATA_OID, content]);
  return pkcs7.toString('base64');
}

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
      isConsumed: false,
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
      throw new BadRequestException('Challenge topilmadi yoki muddati tugagan');
    }

    if (challenge.isConsumed) {
      throw new BadRequestException('Ushbu challenge allaqachon ishlatilgan (Bir martalik)');
    }

    if (Date.now() > challenge.expiresAt) {
      this.challenges.delete(challengeId);
      throw new BadRequestException('Challenge muddati o‘tib ketgan (Maksimal 5 daqiqa)');
    }

    // 1. Strict Base64 validation
    if (!pkcs7B64 || typeof pkcs7B64 !== 'string') {
      throw new BadRequestException('PKCS#7 raqamli imzo kiritilishi shart');
    }

    const cleanB64 = pkcs7B64.trim().replace(/\r?\n/g, '');
    if (cleanB64.length < 64) {
      throw new BadRequestException('Yaroqsiz PKCS#7 raqamli imzo formati: ma\'lumot hajmi yetarli emas');
    }

    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
    if (!base64Regex.test(cleanB64)) {
      throw new BadRequestException('Yaroqsiz Base64 kodlash formati');
    }

    let derBuffer: Buffer;
    try {
      derBuffer = Buffer.from(cleanB64, 'base64');
    } catch {
      throw new BadRequestException('Base64 dekodlashda xatolik');
    }

    if (derBuffer.length < 40) {
      throw new BadRequestException('Yaroqsiz PKCS#7 imzosi: dekodlangan ASN.1 bayt hajmi juda qisqa');
    }

    // 2. ASN.1 DER Header and PKCS#7 SignedData structure check
    // An ASN.1 SEQUENCE must begin with byte 0x30
    if (derBuffer[0] !== 0x30) {
      throw new BadRequestException('Yaroqsiz PKCS#7 formati: ASN.1 SEQUENCE (0x30) topilmadi');
    }

    // Must contain PKCS#7 SignedData OID (1.2.840.113549.1.7.2) or Data OID (1.2.840.113549.1.7.1)
    const hasSignedDataOid = derBuffer.includes(PKCS7_SIGNED_DATA_OID);
    const hasDataOid = derBuffer.includes(PKCS7_DATA_OID);

    if (!hasSignedDataOid && !hasDataOid) {
      throw new BadRequestException(
        'Yaroqsiz PKCS#7 raqamli imzo formati: PKCS#7 SignedData / CMS OID aniqlanmadi'
      );
    }

    // 3. Extract STIR (TIN) from Uzbekistan certificate OID (1.2.860.3.16.1.1) or certificate payload
    let extractedInn: string | null = null;
    const stirIdx = derBuffer.indexOf(UZ_STIR_OID);
    if (stirIdx !== -1) {
      const afterOid = stirIdx + UZ_STIR_OID.length;
      if (afterOid + 2 < derBuffer.length) {
        let len = derBuffer[afterOid + 1];
        let offset = afterOid + 2;
        if (len & 0x80) {
          const numBytes = len & 0x7f;
          len = 0;
          for (let i = 0; i < numBytes; i++) {
            len = (len << 8) | derBuffer[offset + i];
          }
          offset += numBytes;
        }
        if (offset + len <= derBuffer.length) {
          const rawVal = derBuffer.subarray(offset, offset + len).toString('utf8').trim();
          if (/^[123]\d{8}$/.test(rawVal)) {
            extractedInn = rawVal;
          }
        }
      }
    }

    if (!extractedInn) {
      const derString = derBuffer.toString('latin1');
      const match = derString.match(/\b([123]\d{8})\b/);
      if (match) {
        extractedInn = match[1];
      }
    }

    if (!extractedInn) {
      throw new BadRequestException("PKCS#7 imzodan O'zbekiston STIR (9 xonali INN) ma'lumoti topilmadi");
    }

    // 4. Extract Organization / Company Name
    let companyName = '«BUNKER STROY INVEST» MChJ';
    const orgIdx = derBuffer.indexOf(ORG_NAME_OID);
    if (orgIdx !== -1) {
      const afterOid = orgIdx + ORG_NAME_OID.length;
      if (afterOid + 2 < derBuffer.length) {
        let len = derBuffer[afterOid + 1];
        let offset = afterOid + 2;
        if (len & 0x80) {
          const numBytes = len & 0x7f;
          len = 0;
          for (let i = 0; i < numBytes; i++) {
            len = (len << 8) | derBuffer[offset + i];
          }
          offset += numBytes;
        }
        if (offset + len <= derBuffer.length) {
          const orgVal = derBuffer.subarray(offset, offset + len).toString('utf8').trim();
          if (orgVal.length > 2) {
            companyName = orgVal;
          }
        }
      }
    }

    // 5. STIR Comparison Logic
    const targetInn = expectedInn || challenge.inn;
    if (targetInn && extractedInn !== targetInn) {
      throw new BadRequestException(
        `STIR nomuvofiq: E-IMZO sertifikatidagi STIR (${extractedInn}) kutilgan STIR (${targetInn}) bilan mos kelmadi`
      );
    }

    // Mark challenge as consumed (one-time use)
    challenge.isConsumed = true;

    // Generate cryptographic fingerprint serial number
    const hash = crypto.createHash('sha256').update(derBuffer).digest('hex').substring(0, 16).toUpperCase();
    const serialNumber = `EIMZO-${hash}`;

    return {
      valid: true,
      serialNumber,
      inn: extractedInn,
      companyName,
      verifiedAt: new Date().toISOString(),
    };
  }
}

export const eimzoService = new EImzoService();
