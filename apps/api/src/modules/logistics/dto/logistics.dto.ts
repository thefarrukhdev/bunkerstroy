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
  @IsString()
  vehicleId?: string;

  @ApiProperty({ example: 25, description: 'Masofa (km)' })
  @IsNotEmpty({ message: 'distanceKm kiritilishi shart' })
  @Type(() => Number)
  @IsNumber()
  @Min(0.1, { message: 'Masofa kamida 0.1 km bo‘lishi kerak' })
  distanceKm: number;

  @ApiProperty({ example: 15, description: 'Yuk og‘irligi (tonna)' })
  @IsNotEmpty({ message: 'cargoWeightTons kiritilishi shart' })
  @Type(() => Number)
  @IsNumber()
  @Min(0.1, { message: 'Yuk og‘irligi kamida 0.1 tonna bo‘lishi kerak' })
  cargoWeightTons: number;
}

export class DispatchOrderDto {
  @ApiProperty({ example: 'order-uuid', description: 'Buyurtma identifikatori' })
  @IsNotEmpty({ message: 'orderId kiritilishi shart' })
  @IsString()
  orderId: string;

  @ApiProperty({ example: 'vehicle-uuid', description: 'Biriktiriladigan texnika ID si' })
  @IsNotEmpty({ message: 'vehicleId kiritilishi shart' })
  @IsString()
  vehicleId: string;

  @ApiPropertyOptional({ description: 'Haydovchi foydalanuvchi ID si' })
  @IsOptional()
  @IsString()
  driverId?: string;

  @ApiProperty({ example: 'Keles karyeri', description: 'Yuk ortish joyi (kelib chiqish nuqtasi)' })
  @IsNotEmpty({ message: 'origin kiritilishi shart' })
  @IsString()
  origin: string;

  @ApiProperty({ example: 'Toshkent sh., Chilonzor tumani', description: 'Yetkazib berish manzili' })
  @IsNotEmpty({ message: 'destination kiritilishi shart' })
  @IsString()
  destination: string;

  @ApiProperty({ example: 25, description: 'Masofa (km)' })
  @IsNotEmpty({ message: 'distanceKm kiritilishi shart' })
  @Type(() => Number)
  @IsNumber()
  @Min(0.1)
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
