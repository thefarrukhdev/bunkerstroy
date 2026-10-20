import { Controller, Get, Post, Body, Query, Headers, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Authentication & Identity')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Joriy sessiya va foydalanuvchi ma’lumotlarini olish (JWT session persistence)' })
  async getMe(@Headers('authorization') authHeader?: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Avtorizatsiya tokeni topilmadi');
    }
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) {
      throw new UnauthorizedException('Avtorizatsiya tokeni noto‘g‘ri formatda');
    }
    const data = await this.authService.getMe(token);
    return { success: true, data };
  }

  @Get('stir-lookup')
  @ApiOperation({ summary: "Soliq STIR (INN) orqali yuridik shaxs ma'lumotlarini tekshirish" })
  async lookupStir(@Query('inn') inn: string) {
    const data = await this.authService.lookupStir(inn);
    return { success: true, data };
  }

  @Post('eimzo/challenge')
  @ApiOperation({ summary: 'E-IMZO bir martalik tasdiqlash challenge yaratish' })
  createEimzoChallenge(@Body('inn') inn?: string) {
    const data = this.authService.createEimzoChallenge(inn);
    return { success: true, data };
  }

  @Post('eimzo/verify')
  @ApiOperation({ summary: 'E-IMZO raqamli imzosini tekshirish va JWT olish' })
  verifyEimzo(@Body() body: { challengeId: string; pkcs7B64: string; inn?: string }) {
    const data = this.authService.verifyEimzoSignature(body.challengeId, body.pkcs7B64, body.inn);
    return { success: true, data };
  }

  @Post('send-otp')
  @ApiOperation({ summary: 'SMS orqali OTP tasdiqlash kodi yuborish' })
  async sendOtp(@Body('phone') phone: string) {
    const data = await this.authService.sendOtp(phone);
    return { success: true, data };
  }

  @Post('login')
  @ApiOperation({ summary: 'Tizimga login va parol orqali kirish (Admin, Supplier, Client)' })
  async login(@Body() body: { login: string; password: string; role?: string }) {
    const data = await this.authService.login(body.login, body.password, body.role);
    return { success: true, data };
  }
}
