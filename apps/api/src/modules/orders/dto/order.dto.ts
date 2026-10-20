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
import { OrderStatus } from '@bunkerstroy/db';

export class OrderItemDto {
  @ApiProperty({ example: 'prod-1', description: 'Mahsulot ID si' })
  @IsNotEmpty({ message: 'productId kiritilishi shart' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 10, description: 'Buyurtma miqdori' })
  @IsNotEmpty({ message: 'quantity kiritilishi shart' })
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'Miqdor kamida 1 bo‘lishi shart' })
  quantity: number;
}

export class DeliveryAddressDto {
  @ApiProperty({ example: 'Toshkent shahri', description: 'Viloyat / shahar' })
  @IsNotEmpty({ message: 'region kiritilishi shart' })
  @IsString()
  region: string;

  @ApiProperty({ example: 'Chilonzor tumani', description: 'Tuman' })
  @IsNotEmpty({ message: 'district kiritilishi shart' })
  @IsString()
  district: string;

  @ApiPropertyOptional({ example: 'Bunyodkor shox ko‘chasi, 42', description: 'Ko‘cha va uy' })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiPropertyOptional({ example: 'Mirzo Ulug‘bek metrosi yaqinida', description: 'Mo‘ljal' })
  @IsOptional()
  @IsString()
  landmark?: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto], description: 'Savatdagi mahsulotlar ro‘yxati' })
  @IsArray()
  @ArrayMinSize(1, { message: 'Savatda kamida 1 ta mahsulot bo‘lishi kerak' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ type: DeliveryAddressDto, description: 'Yetkazib berish manzili' })
  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  @IsNotEmpty({ message: 'Yetkazib berish manzili kiritilishi shart' })
  deliveryAddress: DeliveryAddressDto;

  @ApiPropertyOptional({ example: 'Samosval (HOWO)', description: 'Tanlangan maxsus texnika' })
  @IsOptional()
  @IsString()
  vehicleType?: string;

  @ApiPropertyOptional({ example: 'PAYME', description: 'To‘lov usuli' })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({ example: 'Farrukh Jumayev', description: 'Mijoz F.I.SH' })
  @IsOptional()
  @IsString()
  buyerName?: string;

  @ApiPropertyOptional({ example: '+998901234567', description: 'Mijoz telefon raqami' })
  @IsOptional()
  @IsString()
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
    message: 'Yaroqsiz status. Ruxsat etilgan: PENDING, CONFIRMED, ASSIGNED_TO_FLEET, IN_TRANSIT, DELIVERED, CANCELLED',
  })
  status: OrderStatus;
}
