import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@bunkerstroy/db';
import { CatalogService } from './catalog.service';
import { GetProductsQueryDto, CreateProductDto } from './dto/catalog.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Building Materials Catalog')
@Controller('api/catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('products')
  @ApiOperation({ summary: 'Qurilish mollari katalogini filtrlash, qidirish va paginatsiya bilan olish' })
  async getProducts(@Query() query: GetProductsQueryDto) {
    const result = await this.catalogService.findAll(query);
    return {
      success: true,
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Bitta mahsulot tafsilotlarini olish (ID yoki Slug bo‘yicha)' })
  async getProductById(@Param('id') id: string) {
    const data = await this.catalogService.findById(id);
    if (!data) {
      throw new NotFoundException(`Mahsulot topilmadi: ${id}`);
    }
    return { success: true, data };
  }

  @Post('products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPPLIER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yangi mahsulot qo‘shish (Faqat ADMIN va SUPPLIER)' })
  async createProduct(
    @Body() dto: CreateProductDto,
    @CurrentUser() user: CurrentUserPayload
  ) {
    const data = await this.catalogService.createProduct(dto, user.id);
    return {
      success: true,
      data,
      message: 'Mahsulot muvaffaqiyatli katalogga qo‘shildi',
    };
  }
}
