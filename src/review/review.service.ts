import { Injectable } from '@nestjs/common';
import { returnReviewObject } from './return-review.object';
import { ReviewDto } from './review.dto';
import { PrismaService } from '../prisma.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class ReviewService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductService,
  ) {}

  async getAll() {
    return this.prisma.review.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: returnReviewObject,
    });
  }
  async create(userId: number, dto: ReviewDto, productId: number) {
    await this.productsService.byId(productId);

    return this.prisma.review.create({
      data: {
        ...dto,
        product: {
          connect: {
            id: productId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async getAverageValueByProductId(productId: number) {
    return this.prisma.review
      .aggregate({
        where: { productId },
        _avg: { rating: true },
      })
      .then((data) => data._avg);
  }

  async delete(productId: number) {
    return this.prisma.review.deleteMany({
      where: {
        productId,
      },
    });
  }
}
