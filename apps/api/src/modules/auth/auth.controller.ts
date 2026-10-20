import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import {
  LoginDto,
  SendOtpDto,
  VerifyOtpDto,
  RefreshTokenDto,
  EimzoChallengeDto,
  EimzoVerifyDto,
} from './dto/auth.dto';

@ApiTags('Authentication & Identity')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Joriy sessiya va foydalanuvchi ma’lumotlarini olish (JWT session persistence)' })
  async getMe(@CurrentUser() user: CurrentUserPayload | null) {
    if (!user || !user.id) {
      throw new UnauthorizedException('Foydalanuvchi sessiyasi topilmadi');
    }
    const data = await this.authService.getMe(user.id);
    return { success: true, data };
  }

  @Throttle({ auth: { limit: 5, ttl: 60000 } })
  @Post('login')
  @ApiOperation({ summary: 'Tizimga login va parol orqali kirish (Admin, Supplier, Client)' })
  async login(@Body() body: LoginDto) {
    const data = await this.authService.login(body.login, body.password, body.role);
    return { success: true, data };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Access tokenni yangilash (Refresh Token orqali)' })
  async refresh(@Body() body: RefreshTokenDto) {
    const data = await this.authService.refreshToken(body.refreshToken);
    return { success: true, data };
  }

  @Throttle({ auth: { limit: 5, ttl: 60000 } })
  @Post('send-otp')
  @ApiOperation({ summary: 'SMS orqali bir martalik OTP tasdiqlash kodi yuborish' })
  async sendOtp(@Body() body: SendOtpDto) {
    const data = await this.authService.sendOtp(body.phone);
    return { success: true, data };
  }

  @Throttle({ auth: { limit: 5, ttl: 60000 } })
  @Post('verify-otp')
  @ApiOperation({ summary: 'SMS OTP tasdiqlash va tizimga kirish' })
  async verifyOtp(@Body() body: VerifyOtpDto) {
    const data = await this.authService.verifyOtp(body.phone, body.code);
    return { success: true, data };
  }

  @SkipThrottle()
  @Public()
  @Get('stir-lookup')
  @ApiOperation({ summary: "Soliq STIR (INN) orqali yuridik shaxs ma'lumotlarini tekshirish" })
  async lookupStir(@Query('inn') inn: string) {
    const data = await this.authService.lookupStir(inn);
    return { success: true, data };
  }

  @SkipThrottle()
  @Public()
  @Post('eimzo/challenge')
  @ApiOperation({ summary: 'E-IMZO bir martalik tasdiqlash challenge yaratish' })
  createEimzoChallenge(@Body() body: EimzoChallengeDto) {
    const data = this.authService.createEimzoChallenge(body.inn);
    return { success: true, data };
  }

  @Throttle({ auth: { limit: 5, ttl: 60000 } })
  @Public()
  @Post('eimzo/verify')
  @ApiOperation({ summary: 'E-IMZO raqamli imzosini tekshirish va JWT olish' })
  async verifyEimzo(@Body() body: EimzoVerifyDto) {
    const data = await this.authService.verifyEimzoSignature(
      body.challengeId,
      body.pkcs7B64,
      body.inn
    );
    return { success: true, data };
  }
}
