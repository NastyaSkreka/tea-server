import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Auth } from '../../src/auth/decorators/auth.decorator';
import { CategoryDto } from './category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAll() {
      return this.categoryService.getAll()
  }

  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
      return this.categoryService.bySlug(slug)
  }

  @Get(':id')
  @Auth()
  async getById(@Param('id') id: string) {
      return this.categoryService.byId(+id)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
   @Auth()
  @Put(':id')
  async update(@Param('id') categoryId: string, 
  @Body() dto: CategoryDto ) {
      return this.categoryService.update(+categoryId, dto)
  }

  @HttpCode(200)
  @Auth()
  @Post()
  async create(@Body() dto: CategoryDto ) {
        return this.categoryService.create(dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async delete(@Param('id') categoryId: string) {
      return this.categoryService.delete(+categoryId)
  }

}
