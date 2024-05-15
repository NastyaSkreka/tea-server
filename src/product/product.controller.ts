import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { GetAllProductDto } from './dto/get-all.product.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ProductDto } from './dto/product.dto';
import { Role } from '../utils/constants';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes(new ValidationPipe())
  @Get()
  async getAll(@Query() queryDto: GetAllProductDto) {
    return this.productService.getAll(queryDto);
  }

  @Get('similar/:id')
  async getSimilar(@Param('id') id: string) {
    return this.productService.getSimilar(+id);
  }

  @Get('by-slug/:slug')
  async getProductBySlug(@Param('slug') slug: string) {
    console.log('slug =>', slug);
    return this.productService.bySlug(slug);
  }

  @Get('by-category/:categorySlug')
  async getProductByCategory(@Param('categorySlug') categorySlug: string) {
    return this.productService.byCategory(categorySlug);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth(Role.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(
    @Body() dto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    dto.price = parseFloat(dto.price);
    dto.categoryId = parseFloat(dto.categoryId);
    dto.userId = parseFloat(dto.userId);
    return this.productService.create(dto, file);
  }

  @HttpCode(200)
  @Delete(':id')
  @Auth(Role.ADMIN)
  @Auth()
  async deleteProduct(@Param('id') id: string) {
    return this.productService.delete(+id);
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.productService.byId(+id);
  }
}
