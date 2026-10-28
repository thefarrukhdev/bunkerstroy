import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CalculateQuoteDto {
  @ApiPropertyOptional({ example: 'veh-1', description: 'Texnika ID si (ixtiyoriy)' })
  @IsOptional()
  @IsString({ message: 'vehicleId satr bo‘lishi kerak' })
  vehicleId?: string;

  @ApiProperty({ example: 25, description: 'Masofa (km)' })
  @IsNotEmpty({ message: 'distanceKm kiritilishi shart' })
  @Type(() => Number)
  @IsNumber({}, { message: 'distanceKm son bo‘lishi kerak' })
  @Min(0.1, { message: 'Masofa kamida 0.1 km bo‘lishi kerak' })
  distanceKm: number;

  @ApiProperty({ example: 15, description: 'Yuk og‘irligi (tonna)' })
  @IsNotEmpty({ message: 'cargoWeightTons kiritilishi shart' })
  @Type(() => Number)
  @IsNumber({}, { message: 'cargoWeightTons son bo‘lishi kerak' })
  @Min(0.1, { message: 'Yuk og‘irligi kamida 0.1 tonna bo‘lishi kerak' })
  cargoWeightTons: number;
}

export class DispatchOrderDto {
  @ApiProperty({ example: 'order-uuid', description: 'Buyurtma identifikatori' })
  @IsNotEmpty({ message: 'orderId kiritilishi shart' })
  @IsString({ message: 'orderId satr bo‘lishi kerak' })
  orderId: string;

  @ApiProperty({ example: 'vehicle-uuid', description: 'Biriktiriladigan texnika ID si' })
  @IsNotEmpty({ message: 'vehicleId kiritilishi shart' })
  @IsString({ message: 'vehicleId satr bo‘lishi kerak' })
  vehicleId: string;

  @ApiPropertyOptional({ description: 'Haydovchi foydalanuvchi ID si' })
  @IsOptional()
  @IsString({ message: 'driverId satr bo‘lishi kerak' })
  driverId?: string;

  @ApiProperty({ example: 'Keles karyeri', description: 'Yuk ortish joyi (kelib chiqish nuqtasi)' })
  @IsNotEmpty({ message: 'origin kiritilishi shart' })
  @IsString({ message: 'origin satr bo‘lishi kerak' })
  origin: string;

  @ApiProperty({ example: 'Toshkent sh., Chilonzor tumani', description: 'Yetkazib berish manzili' })
  @IsNotEmpty({ message: 'destination kiritilishi shart' })
  @IsString({ message: 'destination satr bo‘lishi kerak' })
  destination: string;

  @ApiProperty({ example: 25, description: 'Masofa (km)' })
  @IsNotEmpty({ message: 'distanceKm kiritilishi shart' })
  @Type(() => Number)
  @IsNumber({}, { message: 'distanceKm son bo‘lishi kerak' })
  @Min(0.1, { message: 'distanceKm kamida 0.1 bo‘lishi kerak' })
  distanceKm: number;
}

export const DISPATCH_STATUSES = [
  'ASSIGNED',
  'IN_TRANSIT',
  'DELIVERED',
  'CANCELLED',
] as const;

export type DispatchStatusType = (typeof DISPATCH_STATUSES)[number];

export class UpdateDispatchStatusDto {
  @ApiProperty({
    example: 'IN_TRANSIT',
    enum: DISPATCH_STATUSES,
    description: 'Dispetcherlik yangi holati (ASSIGNED, IN_TRANSIT, DELIVERED, CANCELLED)',
  })
  @IsNotEmpty({ message: 'status kiritilishi shart' })
  @IsEnum(DISPATCH_STATUSES, {
    message: 'status faqat ASSIGNED, IN_TRANSIT, DELIVERED yoki CANCELLED bo‘lishi mumkin',
  })
  status: DispatchStatusType;
}

export class DriverMarkLoadedDto {
  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f',
    description: 'Yuk yuklangan holatdagi foto URL manzili',
  })
  @IsOptional()
  @IsString({ message: 'photoUrl satr bo‘lishi kerak' })
  photoUrl?: string;
}

export class DriverVerifyCodeDto {
  @ApiProperty({
    example: '4928',
    description: 'Mijoz taqdim etgan 4-xonali qabul PIN kodi',
  })
  @IsNotEmpty({ message: 'Qabul kodi kiritilishi shart' })
  @IsString({ message: 'Qabul kodi satr bo‘lishi kerak' })
  code: string;

  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f',
    description: 'Yuk topshirilgan holatdagi foto URL manzili',
  })
  @IsOptional()
  @IsString({ message: 'photoUrl satr bo‘lishi kerak' })
  photoUrl?: string;
}

export class DriverReportIssueDto {
  @ApiProperty({
    example: 'Mijoz manzilida emas, telefon raqamiga ulanib bo‘lmadi',
    description: 'Muammo yoki kechikish sababi',
  })
  @IsNotEmpty({ message: 'Muammo sababi kiritilishi shart' })
  @IsString({ message: 'Muammo sababi satr bo‘lishi kerak' })
  reason: string;

  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f',
    description: 'Muammoni isbotlovchi foto URL manzili',
  })
  @IsOptional()
  @IsString({ message: 'photoUrl satr bo‘lishi kerak' })
  photoUrl?: string;
}
