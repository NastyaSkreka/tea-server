import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryDto } from './category.dto';
import { returnCategoryObject } from './return-category.object';
import { PrismaService } from '../prisma.service';
import { generateSlug } from '../utils/generate-slug';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.category.findMany({
      select: returnCategoryObject,
    });
  }

  async byId(id: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
      select: returnCategoryObject,
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async bySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        slug,
      },
      select: returnCategoryObject,
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async create(dto: CategoryDto) {
    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug: generateSlug(dto.name),
      },
    });
  }

  async update(id: number, dto: CategoryDto) {
    return this.prisma.category.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
        slug: generateSlug(dto.name),
      },
    });
  }

  async delete(id: number) {
    return this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
}
