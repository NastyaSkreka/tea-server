import { Injectable, NotFoundException } from '@nestjs/common';
import { productReturnObject, productReturnObjectFullest } from './return-product.object';
import { ProductDto } from './dto/product.dto';
import { EnumProductSort, GetAllProductDto } from './dto/get-all.product.dto';
import { Prisma } from '@prisma/client';
import { CategoryService } from '../category/category.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PaginationService } from '../pagination/pagination.service';
import { PrismaService } from '../prisma.service';
import { convertToNumber } from '../utils/convert-to-number';
import { generateSlug } from '../utils/generate-slug';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService, 
        private paginationService: PaginationService, 
        private categoryService: CategoryService, 
        private cloudinaryService: CloudinaryService, 
    ) {}

    async getAll(dto: GetAllProductDto = {}) {
        const { perPage, skip } = this.paginationService.getPagination(dto)

        const filters = this.createFilter(dto)
  
        const products = await this.prisma.product.findMany({
          where: filters, 
          orderBy: this.getSortOption(dto.sort), 
          skip, 
          take: perPage, 
          select: productReturnObject
        })
  
        return {
          products, 
          length: await this.prisma.product.count({
              where: filters
          })
        }
      }
    
    private getCategoryFilter(categoryId: number):Prisma.ProductWhereInput {
        return {
            categoryId
        }
    }
    
    private createFilter(dto: GetAllProductDto): Prisma.ProductWhereInput {
        const filters: Prisma.ProductWhereInput[] = []

        if (dto.searchTerm) filters.push(this.getSearchTermFilter(dto.searchTerm))
        if (dto.rating) filters.push(this.getRatingFilter(dto.rating.split('|').map(rating => +rating)))
        if (dto.minPrice || dto.maxPrice ) filters.push(this.getPriceFilter(
            convertToNumber(dto.minPrice), 
            convertToNumber(dto.maxPrice)
        ))
        if(dto.categoryId)
            filters.push(this.getCategoryFilter(+dto.categoryId))

        return filters.length ? {AND: filters} : {}
    }

    private getSortOption(sort: EnumProductSort): Prisma.ProductOrderByWithRelationInput[] {
        switch (sort) {
            case EnumProductSort.LOW_PRICE:
                return [{ price: 'asc' }]
            case EnumProductSort.HIGH_PRICE: 
                return [ { price: 'desc' }]
            case EnumProductSort.OLDEST: 
                return [ {createdAt: 'asc'} ]
            default: 
                return [ { createdAt: 'desc'} ]
        }
    }

    private getSearchTermFilter(searchTerm: string): Prisma.ProductWhereInput {
        return {
                OR: [
                    {
                        category: {
                            name: {
                                contains: searchTerm, 
                                mode: 'insensitive'
                            }
                        }
                    }, 
                    {
                      name: {
                            contains: searchTerm, 
                            mode: 'insensitive'
                       }
                    },
                      {
                      description: {
                            contains: searchTerm, 
                            mode: 'insensitive'
                       },
                    }
                ]
            
        }
    }

    private getRatingFilter(rating: number[]): Prisma.ProductWhereInput {
        return {
            reviews: {
                some: {
                    rating: {
                        in: rating
                    }
                }
            }
        }
    }

    private getPriceFilter(minPrice?: number, maxPrice?: number): Prisma.ProductWhereInput {
        let priceFilter: Prisma.IntFilter | undefined = undefined

        if(minPrice) {
            priceFilter = {
                ...priceFilter, 
                gte: minPrice // <=
            }
        }
        if(maxPrice) {
            priceFilter = {
                ...priceFilter, 
                lte: maxPrice // >=
            }
        }

        return {
            price: priceFilter
        }
    }

    async byId(id: number) {
        const product = await this.prisma.product.findUnique({
            where: {
                id
            }, 
            select: productReturnObjectFullest
        })

        if (!product) throw new NotFoundException('Product not found!')

        return product
    }

    async bySlug(slug: string) {
        const product = await this.prisma.product.findUnique({
            where: {
                slug
            }, 
            select: productReturnObjectFullest
        })

        if (!product) {
            throw new NotFoundException('Product not found')
        }

        return product
    }


    async getSimilar(id: number) {
        const currentProduct = await this.byId(id)

        if (!currentProduct)
            throw new NotFoundException('Current product not found')
        
        const products = await this.prisma.product.findMany({
            where: {
                category: {
                    name: currentProduct.category.name
                }, 
                NOT: {
                    id: currentProduct.id
                }
            }, 
            orderBy: {
                createdAt: 'desc'
            }, 
            select: productReturnObject
        })

        return products;
    }

    async byCategory(categorySlug: string) {
        const product = await this.prisma.product.findMany({
            where: {
                category: {
                    slug: categorySlug
                }
            }, 
            select: productReturnObjectFullest
        })

        return product
    }

    async create( dto: any , file: any) {
        const { name, price, description, miles, time, categoryId, userId } = dto;     
        const image = await this.cloudinaryService.uploadImage(file)
        await this.categoryService.byId(categoryId)
        return this.prisma.product.create({
            data: {
                name, 
                price, 
                description, 
                image,
                miles, 
                time,  
                user: {
                    connect: {
                       id: userId
                    }
                }, 
                slug: generateSlug(name), 
                category: {
                    connect: {
                        id: categoryId
                    }
                }
            }
        })
    }

    async delete(id: number) {

        await this.prisma.review.deleteMany({
            where: {
                productId: id,
            },
        });

        return this.prisma.product.delete({where: {id}})
    }
}