import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CalculateEscoDto {
  @ApiProperty({
    example: 'COMMERCIAL_OFFICE',
    description: 'Bino turi (masalan: RESIDENTIAL_MULTI_STOREY, COMMERCIAL_OFFICE, PRIVATE_HOUSE_COTTAGE)',
  })
  @IsNotEmpty({ message: 'buildingType kiritilishi shart' })
  @IsString()
  buildingType: string;

  @ApiProperty({ example: 450, description: 'Bino umumiy isitiladigan maydoni (m²)' })
  @IsNotEmpty({ message: 'areaM2 kiritilishi shart' })
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'Bino maydoni kamida 1 m² bo‘lishi kerak' })
  areaM2: number;

  @ApiProperty({
    example: 12000,
    description: 'Yillik joriy energiya sarfi (kVt/soat)',
  })
  @IsNotEmpty({ message: 'currentEnergyUsageKwh kiritilishi shart' })
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'Energiya sarfi kamida 1 kVt/soat bo‘lishi kerak' })
  currentEnergyUsageKwh: number;

  @ApiPropertyOptional({
    example: "Pishiq g'isht (1.5 g'isht qalinlikda)",
    description: 'Devor konstruksiyasi va materiali',
  })
  @IsOptional()
  @IsString()
  wallMaterial?: string;

  @ApiPropertyOptional({
    example: 'Oddiy ikki kamerali plastik',
    description: 'Oyna va vitrajlar turi',
  })
  @IsOptional()
  @IsString()
  windowType?: string;

  @ApiPropertyOptional({
    example: 'Gaz qozoni',
    description: 'Mavjud isitish tizimi turi',
  })
  @IsOptional()
  @IsString()
  currentHeatingType?: string;

  @ApiPropertyOptional({
    example: 'Toshkent',
    description: 'Bino joylashgan hudud yoki viloyat',
  })
  @IsOptional()
  @IsString()
  region?: string;
}

export class SaveEscoAuditDto extends CalculateEscoDto {
  @ApiPropertyOptional({
    example: 38,
    description: 'Kutilayotgan tejamkorlik foizi (%)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  estimatedSavingsPct?: number;

  @ApiPropertyOptional({
    example: 29250000,
    description: 'Yillik tejab qolinadigan mablag‘ (so‘mda)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  annualSavingsSum?: number;

  @ApiPropertyOptional({
    example: 2.4,
    description: 'Loyihaning o‘zini oqlash muddati (yil)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  paybackYears?: number;

  @ApiPropertyOptional({
    example: 20.2,
    description: 'Atrof-muhitga CO2 chiqindisi qisqarishi (tonna)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  co2ReductionTons?: number;

  @ApiPropertyOptional({
    example: [
      '100mm Bazalt mineral plitalari (Fasad uchun)',
      'Energiya tejamkor Low-E argonli deraza paketlari',
    ],
    description: 'Tavsiya etilgan energiya tejamkor materiallar ro‘yxati',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recommendations?: string[];

  @ApiPropertyOptional({
    example:
      'Devor va tomni kompleks izolyatsiyalash orqali xarajatlarni 35-40% gacha kamaytirish mumkin.',
    description: 'Izolyatsiya va texnik yechimlar bo‘yicha muhandislik xulosasi',
  })
  @IsOptional()
  @IsString()
  insulationAdvice?: string;
}
