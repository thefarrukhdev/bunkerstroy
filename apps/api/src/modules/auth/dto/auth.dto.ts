import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: '+998901234567', description: 'Telefon raqami yoki login' })
  @IsNotEmpty({ message: 'Login yoki telefon raqami kiritilishi shart' })
  @IsString()
  login: string;

  @ApiProperty({ example: 'bunker2026', description: 'Foydalanuvchi paroli' })
  @IsNotEmpty({ message: 'Parol kiritilishi shart' })
  @IsString()
  password: string;

  @ApiPropertyOptional({ example: 'ADMIN', description: 'Talab etilayotgan rol' })
  @IsOptional()
  @IsString()
  role?: string;
}

export class SendOtpDto {
  @ApiProperty({ example: '+998901234567', description: 'Telefon raqam (+998XXXXXXXXX)' })
  @IsNotEmpty({ message: 'Telefon raqam kiritilishi shart' })
  @IsString()
  phone: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '+998901234567', description: 'Telefon raqam' })
  @IsNotEmpty({ message: 'Telefon raqam kiritilishi shart' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '123456', description: '6 xonali SMS tasdiqlash kodi' })
  @IsNotEmpty({ message: 'SMS tasdiqlash kodi kiritilishi shart' })
  @IsString()
  code: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Amaldagi Refresh Token' })
  @IsNotEmpty({ message: 'Refresh token kiritilishi shart' })
  @IsString()
  refreshToken: string;
}

export class EimzoChallengeDto {
  @ApiPropertyOptional({ example: '201122334', description: 'Yuridik shaxs STIR (INN)' })
  @IsOptional()
  @IsString()
  inn?: string;
}

export class EimzoVerifyDto {
  @ApiProperty({ description: 'Challenge identifikatori' })
  @IsNotEmpty({ message: 'challengeId kiritilishi shart' })
  @IsString()
  challengeId: string;

  @ApiProperty({ description: 'Base64 formatidagi PKCS#7 raqamli imzo' })
  @IsNotEmpty({ message: 'pkcs7B64 kiritilishi shart' })
  @IsString()
  pkcs7B64: string;

  @ApiPropertyOptional({ example: '201122334', description: 'STIR (INN)' })
  @IsOptional()
  @IsString()
  inn?: string;
}
