import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';

@ApiTags('Building Materials Catalog')
@Controller('api/catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('products')
  @ApiOperation({ summary: "Qurilish mollari katalogini filtrlash va olish" })
  getProducts(
    @Query('query') query?: string,
    @Query('category') category?: string,
    @Query('region') region?: string,
    @Query('isEscoOnly') isEscoOnly?: string
  ) {
    const data = this.catalogService.findAll(query, category, region, isEscoOnly === 'true');
    return { success: true, data, total: data.length };
  }

  @Get('products/:id')
  @ApiOperation({ summary: "Bitta mahsulot tafsilotlarini olish" })
  getProductById(@Param('id') id: string) {
    const data = this.catalogService.findById(id);
    return { success: !!data, data };
  }
}
