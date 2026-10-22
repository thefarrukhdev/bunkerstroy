import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class GetProductsQueryDto {
  @ApiPropertyOptional({ description: 'Qidiruv so‘zi (nomi yoki tavsifi bo‘yicha)' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ description: 'Kategoriya ID si yoki slugi' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Viloyat / hudud nomi' })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({ description: 'Faqat ESCO energiya tejamkor mahsulotlar' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === '1')
  @IsBoolean()
  escoOnly?: boolean;

  @ApiPropertyOptional({ description: 'Sotuvchi (Supplier) ID si bo‘yicha filtrlash' })
  @IsOptional()
  @IsString()
  supplierId?: string;

  @ApiPropertyOptional({ description: 'Sahifa raqami (boshlanishi 1)', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Har bir sahifadagi mahsulotlar soni', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Sement M500 D0 (50kg)', description: 'Mahsulot nomi' })
  @IsNotEmpty({ message: 'Mahsulot nomi kiritilishi shart' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'sement-m500-d0-50kg', description: 'URL slug' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ example: 'cat-sement', description: 'Kategoriya ID si' })
  @IsNotEmpty({ message: 'Kategoriya ID kiritilishi shart' })
  @IsString()
  categoryId: string;

  @ApiProperty({ example: 64000, description: 'Birlik narxi (so‘m)' })
  @IsNotEmpty({ message: 'Narx kiritilishi shart' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 'BAG_50KG', description: 'O‘lchov birligi' })
  @IsOptional()
  @IsString()
  unit?: string = 'dona';

  @ApiProperty({ example: 1000, description: 'Ombordagi mavjud zaxira miqdori' })
  @IsNotEmpty({ message: 'Zaxira miqdori kiritilishi shart' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ example: 20, description: 'Minimal buyurtma hajmi' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  minOrder?: number = 1;

  @ApiPropertyOptional({ example: 'A', description: 'Energiya samaradorlik reytingi' })
  @IsOptional()
  @IsString()
  energyEfficiencyRating?: string = 'STANDARD';

  @ApiPropertyOptional({ example: true, description: 'ESCO sertifikatlanganligi' })
  @IsOptional()
  @IsBoolean()
  isEscoCertified?: boolean = false;

  @ApiProperty({ example: 'M500 D0 yuqori mustahkamlikdagi tsement', description: 'Tavsif' })
  @IsNotEmpty({ message: 'Tavsif kiritilishi shart' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 'MATERIAL', description: 'Mahsulot turi' })
  @IsOptional()
  @IsString()
  itemType?: string = 'MATERIAL';

  @ApiPropertyOptional({ example: 'UNIVERSAL', description: 'Qurilish / ta’mirlash turi' })
  @IsOptional()
  @IsString()
  repairType?: string = 'UNIVERSAL';

  @ApiPropertyOptional({ example: 'Toshkent shahri', description: 'Hudud' })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({ example: 'Chilonzor tumani', description: 'Tuman' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ example: ['https://example.com/cement.jpg'], description: 'Rasmlar ro‘yxati' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ example: '12 oy', description: 'Kafolat muddati' })
  @IsOptional()
  @IsString()
  warranty?: string;

  @ApiPropertyOptional({ example: true, description: 'Yetkazib berish mavjudligi' })
  @IsOptional()
  @IsBoolean()
  hasDelivery?: boolean = true;

  @ApiPropertyOptional({ example: false, description: 'Bonus dasturi mavjudligi' })
  @IsOptional()
  @IsBoolean()
  hasBonus?: boolean = false;
}

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Sement M500 D0 (50kg)', description: 'Mahsulot nomi' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'cat-sement', description: 'Kategoriya ID si' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: 64000, description: 'Birlik narxi (so‘m)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 'dona', description: 'O‘lchov birligi' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ example: 1000, description: 'Ombordagi mavjud zaxira miqdori' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({ example: 1, description: 'Minimal buyurtma hajmi' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  minOrder?: number;

  @ApiPropertyOptional({ example: 'M500 D0 yuqori sifatli tsement', description: 'Tavsif' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: ['https://example.com/cement.jpg'], description: 'Rasmlar' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ example: true, description: 'Yetkazib berish mavjudligi' })
  @IsOptional()
  @IsBoolean()
  hasDelivery?: boolean;

  @ApiPropertyOptional({ example: 'Toshkent shahri', description: 'Hudud' })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({ example: 'Chilonzor tumani', description: 'Tuman' })
  @IsOptional()
  @IsString()
  district?: string;
}
