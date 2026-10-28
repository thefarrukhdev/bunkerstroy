import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  IsOptional,
  IsEnum,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus, PaymentMode } from '@bunkerstroy/db';

export class OrderItemDto {
  @ApiProperty({ example: 'prod-1', description: 'Mahsulot ID si' })
  @IsNotEmpty({ message: 'productId kiritilishi shart' })
  @IsString({ message: 'productId satr bo‘lishi kerak' })
  productId: string;

  @ApiProperty({ example: 10, description: 'Buyurtma miqdori' })
  @IsNotEmpty({ message: 'quantity kiritilishi shart' })
  @Type(() => Number)
  @IsNumber({}, { message: 'quantity son bo‘lishi kerak' })
  @Min(1, { message: 'Miqdor kamida 1 bo‘lishi shart' })
  quantity: number;
}

export class DeliveryAddressDto {
  @ApiProperty({ example: 'Toshkent shahri', description: 'Viloyat / shahar' })
  @IsNotEmpty({ message: 'region kiritilishi shart' })
  @IsString({ message: 'region satr bo‘lishi kerak' })
  region: string;

  @ApiProperty({ example: 'Chilonzor tumani', description: 'Tuman' })
  @IsNotEmpty({ message: 'district kiritilishi shart' })
  @IsString({ message: 'district satr bo‘lishi kerak' })
  district: string;

  @ApiPropertyOptional({ example: 'Bunyodkor shox ko‘chasi, 42', description: 'Ko‘cha va uy' })
  @IsOptional()
  @IsString({ message: 'street satr bo‘lishi kerak' })
  street?: string;

  @ApiPropertyOptional({ example: 'Mirzo Ulug‘bek metrosi yaqinida', description: 'Mo‘ljal' })
  @IsOptional()
  @IsString({ message: 'landmark satr bo‘lishi kerak' })
  landmark?: string;

  @ApiPropertyOptional({ example: 41.2995, description: 'Kenglik (Latitude)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'deliveryLat son bo‘lishi kerak' })
  deliveryLat?: number;

  @ApiPropertyOptional({ example: 69.2401, description: 'Uzunlik (Longitude)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'deliveryLng son bo‘lishi kerak' })
  deliveryLng?: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto], description: 'Savatdagi mahsulotlar ro‘yxati' })
  @IsArray({ message: 'items massiv bo‘lishi shart' })
  @ArrayMinSize(1, { message: 'Savatda kamida 1 ta mahsulot bo‘lishi kerak' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ type: DeliveryAddressDto, description: 'Yetkazib berish manzili' })
  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  @IsNotEmpty({ message: 'Yetkazib berish manzili kiritilishi shart' })
  deliveryAddress: DeliveryAddressDto;

  @ApiPropertyOptional({ example: 'FULL_100', enum: PaymentMode, description: 'To‘lov rejimi: 100% yoki 50/50' })
  @IsOptional()
  @IsEnum(PaymentMode, { message: 'To‘lov rejimi FULL_100 yoki SPLIT_50_50 bo‘lishi kerak' })
  paymentMode?: PaymentMode;

  @ApiPropertyOptional({ example: 'Samosval (HOWO)', description: 'Tanlangan maxsus texnika' })
  @IsOptional()
  @IsString({ message: 'vehicleType satr bo‘lishi kerak' })
  vehicleType?: string;

  @ApiPropertyOptional({ example: 'PAYME', description: 'To‘lov usuli' })
  @IsOptional()
  @IsString({ message: 'paymentMethod satr bo‘lishi kerak' })
  paymentMethod?: string;

  @ApiPropertyOptional({ example: 'Farrukh Jumayev', description: 'Mijoz F.I.SH' })
  @IsOptional()
  @IsString({ message: 'buyerName satr bo‘lishi kerak' })
  buyerName?: string;

  @ApiPropertyOptional({ example: '+998901234567', description: 'Mijoz telefon raqami' })
  @IsOptional()
  @IsString({ message: 'buyerPhone satr bo‘lishi kerak' })
  buyerPhone?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.CONFIRMED,
    description: 'Yangi buyurtma holati',
  })
  @IsNotEmpty({ message: 'status kiritilishi shart' })
  @IsEnum(OrderStatus, {
    message: 'Yaroqsiz status.',
  })
  status: OrderStatus;

  @ApiPropertyOptional({ description: 'O‘zgarish sababi' })
  @IsOptional()
  @IsString({ message: 'reason satr bo‘lishi kerak' })
  reason?: string;
}

export class VerifyAcceptanceCodeDto {
  @ApiProperty({ example: '4928', description: 'Mijoz bergan 4-xonali qabul kodi' })
  @IsNotEmpty({ message: 'Qabul kodi kiritilishi shart' })
  @IsString({ message: 'code satr bo‘lishi kerak' })
  code: string;

  @ApiPropertyOptional({ description: 'Topshirish foto-dalolatnomasi URL' })
  @IsOptional()
  @IsString({ message: 'photoUrl satr bo‘lishi kerak' })
  photoUrl?: string;
}

export class OpenDisputeDto {
  @ApiProperty({ example: 'Yuk shikastlangan yetib keldi', description: 'Nizo sababi' })
  @IsNotEmpty({ message: 'Nizo sababi kiritilishi shart' })
  @IsString({ message: 'reason satr bo‘lishi kerak' })
  reason: string;

  @ApiPropertyOptional({ type: [String], description: 'Isbotlovchi foto yoki video URL manzillari' })
  @IsOptional()
  @IsArray({ message: 'evidenceUrls massiv bo‘lishi kerak' })
  @IsString({ each: true, message: 'Har bir evidenceUrl satr bo‘lishi kerak' })
  evidenceUrls?: string[];
}
