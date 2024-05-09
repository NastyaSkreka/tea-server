import {forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CategoryModule } from '../category/category.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PaginationModule } from '../pagination/pagination.module';
import { PaginationService } from '../pagination/pagination.service';
import { PrismaService } from '../prisma.service';
import { ReviewModule } from '../review/review.module';
import { ReviewService } from '../review/review.service';

@Module({
  controllers: [ProductController],
  imports: [PaginationModule, CategoryModule, CloudinaryModule, ReviewModule], 
  providers: [ProductService, PrismaService, PaginationService, CloudinaryService, ReviewService],
})
export class ProductModule {}
