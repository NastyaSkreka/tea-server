import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { GetAllProductDto } from './dto/get-all.product.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ProductDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes(new ValidationPipe())
  @Get()
  async getAll(@Query() queryDto: GetAllProductDto) {
    return this.productService.getAll(queryDto)
  }
  
 // TODO: refactor: make similar products by category
/*  @Get('similar/:id')
  async getSimilar(@Param('id') id: string) {
    return this.productService.getSimilar(+id)
  }
*/

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  //@Auth()
  @Post()
  async createProduct() {
    return this.productService.create()
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
 // @Auth()
  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() dto: ProductDto) {
    return this.productService.update(+id, dto)
  }

  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async deleteProduct(@Param('id') id: string) {
    return this.productService.delete(+id)
  }

  @Get(':id')
  @Auth()
  async getProduct(@Param('id') id: string) {
    return this.productService.byId(+id)
  }
  
}
