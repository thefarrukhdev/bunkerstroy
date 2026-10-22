import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@bunkerstroy/db';
import { CatalogService } from './catalog.service';
import { GetProductsQueryDto, CreateProductDto, UpdateProductDto } from './dto/catalog.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Building Materials Catalog')
@Controller('api/catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Katalog kategoriyalari ro‘yxatini olish' })
  async getCategories() {
    const data = await this.catalogService.getCategories();
    return { success: true, data };
  }

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

  @Get('my-products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPPLIER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sotuvchining o‘z mahsulotlari ro‘yxatini olish' })
  async getMyProducts(@CurrentUser() user: CurrentUserPayload) {
    let data;
    if (user.role === Role.ADMIN) {
      const res = await this.catalogService.findAll({ limit: 100 });
      data = res.data;
    } else {
      data = await this.catalogService.findSupplierProducts(user.id);
    }
    return { success: true, data, total: data.length };
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

  @Put('products/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPPLIER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mahsulot narxi, zaxirasi va parametrlarini tahrirlash' })
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser() user: CurrentUserPayload
  ) {
    const data = await this.catalogService.updateProduct(id, dto, user.id, user.role);
    return {
      success: true,
      data,
      message: 'Mahsulot ma’lumotlari muvaffaqiyatli yangilandi',
    };
  }

  @Delete('products/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPPLIER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mahsulotni katalogdan o‘chirish' })
  async deleteProduct(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload
  ) {
    const data = await this.catalogService.deleteProduct(id, user.id, user.role);
    return {
      success: true,
      data,
      message: 'Mahsulot katalogdan o‘chirildi',
    };
  }
}
