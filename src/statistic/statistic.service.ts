import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StatisticService {
  constructor(private prisma: PrismaService) {}

  async getMain() {
    const ordersCount = await this.prisma.order.count();
    const reviewsCount = await this.prisma.review.count();
    const usersCount = await this.prisma.user.count();

    return [
      {
        name: 'Orders',
        value: ordersCount,
      },
      {
        name: 'Reviews',
        value: reviewsCount,
      },
      {
        name: 'Users',
        value: usersCount,
      },
    ];
  }
}
