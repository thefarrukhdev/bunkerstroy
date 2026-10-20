import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import crypto from 'crypto';
import { CompanyInfo, StirRegex } from '@bunkerstroy/types';

@Injectable()
export class AuthService {
  private stirCache = new Map<string, { data: CompanyInfo; cachedAt: number }>();
  private challenges = new Map<string, any>();

  constructor(private readonly jwtService: JwtService) {}

  async lookupStir(inn: string): Promise<CompanyInfo> {
    const cleanInn = inn.trim();
    if (!StirRegex.test(cleanInn)) {
      throw new BadRequestException('STIR aynan 9 ta raqamdan iborat bo‘lishi shart');
    }

    const cached = this.stirCache.get(cleanInn);
    if (cached && Date.now() - cached.cachedAt < 24 * 3600 * 1000) {
      return cached.data;
    }

    const company: CompanyInfo = {
      inn: cleanInn,
      companyName: cleanInn === '201122334' ? '«BUNKER STROY INVEST» MChJ' : `«QURILISH INVEST ${cleanInn.slice(-4)}» MChJ`,
      status: 'ACTIVE',
      statusDescription: 'Faol soliq to‘lovchi yuridik shaxs',
      director: 'Jumayev Farrukh',
      address: 'Toshkent sh., Chilonzor tumani, Bunyodkor shox ko‘chasi, 42-uy',
      region: 'Toshkent shahri',
      district: 'Chilonzor tumani',
      registrationDate: '2022-01-15',
      activityType: 'Qurilish mollari ulgurji savdosi',
      vatPayer: true
    };

    this.stirCache.set(cleanInn, { data: company, cachedAt: Date.now() });
    return company;
  }

  createEimzoChallenge(inn?: string) {
    const challengeId = crypto.randomUUID();
    const nonce = crypto.randomBytes(16).toString('hex');
    const challengeText = `BunkerStroy E-IMZO Autentifikatsiya: ${nonce} (STIR: ${inn || 'Umumiy'})`;

    const challenge = {
      challengeId,
      challengeText,
      inn,
      createdAt: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000,
      isConsumed: false
    };

    this.challenges.set(challengeId, challenge);
    return challenge;
  }

  verifyEimzoSignature(challengeId: string, pkcs7B64: string, expectedInn?: string) {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) {
      throw new NotFoundException('Challenge topilmadi yoki muddati tugagan');
    }
    if (challenge.isConsumed) {
      throw new BadRequestException('Challenge allaqachon ishlatilgan');
    }

    challenge.isConsumed = true;
    const confirmedInn = expectedInn || challenge.inn || '201122334';
    const serialNumber = 'EIMZO-' + crypto.randomBytes(8).toString('hex').toUpperCase();

    const user = {
      id: 'eimzo-' + confirmedInn,
      displayName: '«BUNKER STROY INVEST» MChJ',
      role: 'CONTRACTOR',
      inn: confirmedInn,
      phone: '+998900000000',
      companyName: '«BUNKER STROY INVEST» MChJ',
      verificationStatus: 'VERIFIED',
      eimzoSerialNumber: serialNumber
    };

    const token = this.jwtService.sign({
      id: user.id,
      role: user.role,
      inn: user.inn,
      displayName: user.displayName,
      companyName: user.companyName,
      phone: user.phone
    });

    return {
      valid: true,
      serialNumber,
      inn: confirmedInn,
      companyName: '«BUNKER STROY INVEST» MChJ',
      token,
      user,
      verification: user,
      verifiedAt: new Date().toISOString()
    };
  }

  async getMe(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return {
        id: payload.id,
        displayName: payload.displayName || payload.companyName || 'Foydalanuvchi',
        role: payload.role || 'CLIENT',
        inn: payload.inn,
        phone: payload.phone,
        email: payload.email,
        companyName: payload.companyName
      };
    } catch {
      throw new UnauthorizedException('Token yaroqsiz yoki muddati o‘tgan');
    }
  }

  async sendOtp(phone: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[SMS OTP via NestJS] To: ${phone} -> Code: ${code}`);

    return {
      phone,
      mode: 'simulation',
      code,
      message: `SMS tasdiqlash kodi yuborildi: ${code}`
    };
  }

  async login(login: string, pass: string, role?: string) {
    if (login === 'admin' && (pass === 'bunker2026' || pass === 'admin123')) {
      const token = this.jwtService.sign({
        id: 'admin-001',
        role: 'ADMIN',
        displayName: 'Farrukh Jumayev (Admin)'
      });

      return {
        token,
        user: {
          id: 'admin-001',
          displayName: 'Bunker Admin',
          role: 'ADMIN',
          email: 'admin@bunkerstroy.uz'
        }
      };
    }

    if (role === 'supplier' || login.startsWith('supplier')) {
      const token = this.jwtService.sign({
        id: 'sup-001',
        role: 'SUPPLIER',
        displayName: 'Toshkent Sement Servis'
      });

      return {
        token,
        user: {
          id: 'sup-001',
          displayName: 'Toshkent Sement Servis MChJ',
          role: 'SUPPLIER',
          companyName: '«TOSHKENT G\'ISHT VA SEMENT SERVIS» MChJ'
        }
      };
    }

    const token = this.jwtService.sign({
      id: 'client-001',
      role: 'CLIENT',
      displayName: 'Mijoz'
    });

    return {
      token,
      user: {
        id: 'client-001',
        displayName: 'Mijoz',
        role: 'CLIENT',
        phone: login || '+998901112233'
      }
    };
  }
}
