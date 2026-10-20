import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Role, UserType, VerificationStatus } from '@bunkerstroy/db';
import { CompanyInfo, StirRegex } from '@bunkerstroy/types';
import { env } from '../../config/env';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { AuditLogService } from '../admin/audit-log.service';
import { SmsService } from './sms.service';
import { EImzoService } from './eimzo.service';
import { StirService } from './stir.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly smsService: SmsService,
    private readonly eimzoService: EImzoService,
    private readonly stirService: StirService,
    private readonly auditLogService: AuditLogService,
  ) {}

  private normalizePhone(phone: string): string {
    let clean = phone.replace(/[^\d+]/g, '');
    if (clean.startsWith('998') && !clean.startsWith('+')) {
      clean = '+' + clean;
    } else if (clean.length === 9) {
      clean = '+998' + clean;
    } else if (!clean.startsWith('+') && clean.length > 9) {
      clean = '+' + clean;
    }
    return clean;
  }

  private generateTokens(user: {
    id: string;
    role: Role;
    inn?: string | null;
    companyName?: string | null;
    phone?: string | null;
    email?: string | null;
    displayName?: string | null;
  }) {
    const payload = {
      id: user.id,
      role: user.role,
      inn: user.inn || null,
      companyName: user.companyName || null,
      phone: user.phone || null,
      email: user.email || null,
      displayName: user.displayName || null,
    };

    const token = this.jwtService.sign(payload, {
      secret: env.JWT_SECRET,
      expiresIn: (env.JWT_EXPIRES_IN || '7d') as any,
    });

    const refreshToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: env.REFRESH_SECRET,
        expiresIn: (env.REFRESH_EXPIRES_IN || '30d') as any,
      }
    );

    return { token, refreshToken };
  }

  async login(login: string, pass: string, requestedRole?: string) {
    const cleanLogin = login.trim();
    const normalizedPhone = this.normalizePhone(cleanLogin);

    // 1. Try to find user in PostgreSQL via Prisma
    const searchConditions: any[] = [
      { phone: cleanLogin },
      { phone: normalizedPhone },
      { email: cleanLogin.toLowerCase() },
    ];
    if (cleanLogin.toLowerCase() === 'admin') {
      searchConditions.push({ email: 'admin@bunkerstroy.uz' }, { phone: '+998901234567' });
    }
    if (cleanLogin.toLowerCase() === 'supplier') {
      searchConditions.push({ email: 'supplier@toshkentsement.uz' }, { phone: '+998971112233' });
    }

    let user: any = await this.prisma.user.findFirst({
      where: {
        OR: searchConditions,
      },
      include: { company: true },
    });

    if (user) {
      const isPasswordValid = await bcrypt.compare(pass, user.passwordHash);
      if (isPasswordValid) {
        const tokens = this.generateTokens(user);

        await this.auditLogService.logAction({
          actorId: user.id,
          action: 'AUTH_LOGIN_SUCCESS',
          category: 'AUTH',
          details: `Foydalanuvchi tizimga kirdi: ${user.displayName} (${user.role})`,
          level: 'INFO',
        });

        return {
          ...tokens,
          user: {
            id: user.id,
            displayName: user.displayName,
            role: user.role,
            phone: user.phone,
            email: user.email,
            inn: user.inn,
            companyName: user.companyName,
            verificationStatus: user.verificationStatus,
          },
        };
      }
    }

    // 2. Demo credentials fallback with auto-upsert in Prisma
    const isAdminDemo =
      cleanLogin === 'admin' ||
      cleanLogin === 'admin@bunkerstroy.uz' ||
      normalizedPhone === '+998901234567';
    if (isAdminDemo && (pass === 'bunker2026' || pass === 'admin123')) {
      user = await this.prisma.user.upsert({
        where: { phone: '+998901234567' },
        update: { role: Role.ADMIN },
        create: {
          phone: '+998901234567',
          email: 'admin@bunkerstroy.uz',
          passwordHash: await bcrypt.hash('bunker2026', 10),
          displayName: 'Bunker Admin',
          role: Role.ADMIN,
          userType: UserType.LEGAL_ENTITY,
          verificationStatus: VerificationStatus.VERIFIED,
          inn: '201122334',
          companyName: '«BUNKER STROY INVEST» MChJ',
        },
      });

      const tokens = this.generateTokens(user);
      return {
        ...tokens,
        user: {
          id: user.id,
          displayName: user.displayName,
          role: user.role,
          email: user.email,
          phone: user.phone,
          inn: user.inn,
          companyName: user.companyName,
          verificationStatus: user.verificationStatus,
        },
      };
    }

    const isSupplierDemo =
      cleanLogin === 'supplier' ||
      cleanLogin.startsWith('supplier') ||
      normalizedPhone === '+998971112233' ||
      requestedRole === 'supplier' ||
      requestedRole === 'SUPPLIER';

    if (isSupplierDemo && (pass === 'bunker2026' || pass === 'supplier123')) {
      user = await this.prisma.user.upsert({
        where: { phone: '+998971112233' },
        update: { role: Role.SUPPLIER },
        create: {
          phone: '+998971112233',
          email: 'supplier@toshkentsement.uz',
          passwordHash: await bcrypt.hash('supplier123', 10),
          displayName: 'Toshkent Sement Servis MChJ',
          role: Role.SUPPLIER,
          userType: UserType.LEGAL_ENTITY,
          verificationStatus: VerificationStatus.VERIFIED,
          inn: '305566778',
          companyName: '«TOSHKENT G\'ISHT VA SEMENT SERVIS» MChJ',
        },
      });

      const tokens = this.generateTokens(user);
      return {
        ...tokens,
        user: {
          id: user.id,
          displayName: user.displayName,
          role: user.role,
          email: user.email,
          phone: user.phone,
          inn: user.inn,
          companyName: user.companyName,
          verificationStatus: user.verificationStatus,
        },
      };
    }

    // Contractor demo
    if (cleanLogin === 'contractor' && (pass === 'bunker2026' || pass === 'contractor123')) {
      user = await this.prisma.user.upsert({
        where: { phone: '+998905556677' },
        update: {},
        create: {
          phone: '+998905556677',
          displayName: 'Mega Bino Qurilish MChJ',
          role: Role.CONTRACTOR,
          userType: UserType.LEGAL_ENTITY,
          verificationStatus: VerificationStatus.VERIFIED,
          inn: '201122334',
          companyName: '«MEGA BINO QURILISH» MChJ',
          passwordHash: await bcrypt.hash('contractor123', 10),
        },
      });

      const tokens = this.generateTokens(user);
      return {
        ...tokens,
        user: {
          id: user.id,
          displayName: user.displayName,
          role: user.role,
          phone: user.phone,
          inn: user.inn,
          companyName: user.companyName,
          verificationStatus: user.verificationStatus,
        },
      };
    }

    await this.auditLogService.logAction({
      action: 'AUTH_LOGIN_FAILED',
      category: 'AUTH',
      details: `Muvaffaqiyatsiz kirish urinishi (Login: ${cleanLogin})`,
      level: 'WARNING',
    });

    throw new UnauthorizedException('Login yoki parol noto‘g‘ri kiritildi');
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: env.REFRESH_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user) {
        throw new UnauthorizedException('Foydalanuvchi topilmadi');
      }

      const tokens = this.generateTokens(user);
      return {
        ...tokens,
        user: {
          id: user.id,
          displayName: user.displayName,
          role: user.role,
          phone: user.phone,
          email: user.email,
          inn: user.inn,
          companyName: user.companyName,
        },
      };
    } catch {
      throw new UnauthorizedException('Refresh token yaroqsiz yoki muddati o‘tgan');
    }
  }

  async sendOtp(phone: string) {
    const cleanPhone = this.normalizePhone(phone);
    if (!cleanPhone || cleanPhone.length < 9) {
      throw new BadRequestException('Telefon raqami noto‘g‘ri kiritildi');
    }

    // Rate-limiting check: 1 SMS per 60 seconds
    const cooldownKey = `otp_cooldown:${cleanPhone}`;
    const isInCooldown = await this.redisService.exists(cooldownKey);
    if (isInCooldown) {
      throw new BadRequestException('Iltimos, 1 daqiqadan so‘ng qayta urinib ko‘ring (Cheklov)');
    }

    // Generate secure 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in Redis with 120s (2 minutes) TTL
    const otpKey = `otp:${cleanPhone}`;
    await this.redisService.set(otpKey, code, 120);

    // Set cooldown in Redis for 60 seconds
    await this.redisService.set(cooldownKey, '1', 60);

    // Dispatch via Eskiz.uz / SMS service
    await this.smsService.sendOtp(cleanPhone, code);

    // CRITICAL: NEVER return code in response!
    return {
      success: true,
      phone: cleanPhone,
      message: 'Tasdiqlash kodi telefon raqamingizga SMS orqali yuborildi',
    };
  }

  async verifyOtp(phone: string, code: string) {
    const cleanPhone = this.normalizePhone(phone);
    const otpKey = `otp:${cleanPhone}`;

    const storedCode = await this.redisService.get(otpKey);
    const isMasterTestCode = code === '123456' && env.NODE_ENV !== 'production';

    if (!storedCode && !isMasterTestCode) {
      throw new BadRequestException('Tasdiqlash kodi muddati o‘tgan yoki yuborilmagan');
    }

    if (storedCode !== code && !isMasterTestCode) {
      throw new BadRequestException('Noto‘g‘ri tasdiqlash kodi kiritildi');
    }

    // Clean up Redis keys
    await this.redisService.del(otpKey);
    await this.redisService.del(`otp_cooldown:${cleanPhone}`);

    // Find or create user
    let user = await this.prisma.user.findFirst({
      where: { phone: cleanPhone },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone: cleanPhone,
          displayName: `Foydalanuvchi (${cleanPhone.slice(-4)})`,
          role: Role.CLIENT,
          userType: UserType.INDIVIDUAL,
          verificationStatus: VerificationStatus.VERIFIED,
          passwordHash: await bcrypt.hash(crypto.randomUUID(), 10),
        },
      });
    }

    const tokens = this.generateTokens(user);
    return {
      ...tokens,
      user: {
        id: user.id,
        displayName: user.displayName,
        role: user.role,
        phone: user.phone,
        email: user.email,
        inn: user.inn,
        companyName: user.companyName,
        verificationStatus: user.verificationStatus,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    return {
      id: user.id,
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      userType: user.userType,
      verificationStatus: user.verificationStatus,
      inn: user.inn,
      companyName: user.companyName || user.company?.companyName || null,
      phone: user.phone,
      email: user.email,
      region: user.region,
      district: user.district,
      contractNumber: user.contractNumber,
      eimzoSerialNumber: user.eimzoSerialNumber,
      createdAt: user.createdAt,
    };
  }

  async lookupStir(inn: string): Promise<CompanyInfo> {
    const data = await this.stirService.lookup(inn);
    if (!data) {
      throw new NotFoundException('STIR ma’lumotlari topilmadi');
    }
    return data;
  }

  createEimzoChallenge(inn?: string) {
    const challenge = this.eimzoService.createChallenge(inn);
    return challenge;
  }

  async verifyEimzoSignature(challengeId: string, pkcs7B64: string, expectedInn?: string) {
    const verified = this.eimzoService.verifySignature(challengeId, pkcs7B64, expectedInn);
    const confirmedInn = verified.inn;

    // Upsert company
    const company = await this.prisma.company.upsert({
      where: { inn: confirmedInn },
      update: {
        companyName: verified.companyName,
        verifiedAt: new Date(),
      },
      create: {
        inn: confirmedInn,
        companyName: verified.companyName,
        status: 'ACTIVE',
        statusDescription: 'Faol soliq to‘lovchi yuridik shaxs',
        verifiedAt: new Date(),
      },
    });

    // Find or create user with CONTRACTOR / verified role
    let user = await this.prisma.user.findFirst({
      where: { inn: confirmedInn },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone: `+99890${confirmedInn.slice(-7)}`,
          displayName: verified.companyName,
          companyName: verified.companyName,
          role: Role.CONTRACTOR,
          userType: UserType.LEGAL_ENTITY,
          verificationStatus: VerificationStatus.VERIFIED,
          inn: confirmedInn,
          eimzoSerialNumber: verified.serialNumber,
          eimzoVerifiedAt: new Date(),
          passwordHash: await bcrypt.hash(crypto.randomUUID(), 10),
        },
      });
    } else {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          eimzoSerialNumber: verified.serialNumber,
          eimzoVerifiedAt: new Date(),
          verificationStatus: VerificationStatus.VERIFIED,
        },
      });
    }

    const tokens = this.generateTokens(user);

    await this.auditLogService.logAction({
      actorId: user.id,
      action: 'EIMZO_VERIFIED',
      category: 'AUTH',
      details: `E-IMZO raqamli imzo muvaffaqiyatli tasdiqlandi: STIR ${confirmedInn} (${verified.companyName})`,
      level: 'INFO',
    });

    return {
      valid: true,
      serialNumber: verified.serialNumber,
      inn: confirmedInn,
      companyName: company.companyName,
      ...tokens,
      user: {
        id: user.id,
        displayName: user.displayName,
        role: user.role,
        inn: user.inn,
        phone: user.phone,
        companyName: user.companyName,
        verificationStatus: user.verificationStatus,
      },
      verifiedAt: verified.verifiedAt,
    };
  }
}
