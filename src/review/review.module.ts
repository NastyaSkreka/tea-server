import { forwardRef, Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { CategoryModule } from '../category/category.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PaginationModule } from '../pagination/pagination.module';
import { PrismaService } from '../prisma.service';
import { ProductModule } from '../product/product.module';
import { ProductService } from '../product/product.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, PrismaService, ProductService, CloudinaryService],
  imports: [forwardRef(() => ProductModule), PaginationModule, CategoryModule],
})
export class ReviewModule {}
