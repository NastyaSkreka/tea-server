import {forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/pagination/pagination.service';
import { CategoryModule } from 'src/category/category.module';
import { PaginationModule } from 'src/pagination/pagination.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ReviewModule } from 'src/review/review.module';
import { ReviewService } from 'src/review/review.service';

@Module({
  controllers: [ProductController],
  imports: [PaginationModule, CategoryModule, CloudinaryModule, ReviewModule], 
  providers: [ProductService, PrismaService, PaginationService, CloudinaryService, ReviewService],
})
export class ProductModule {}
