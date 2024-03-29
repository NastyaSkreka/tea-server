import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { productReturnObject, productReturnObjectFullest } from './return-product.object';
import { ProductDto } from './dto/product.dto';
import { EnumProductSort, GetAllProductDto } from './dto/get-all.product.dto';
import { PaginationService } from 'src/pagination/pagination.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService, 
        private paginationService: PaginationService
    ) {}

    async getAll(dto: GetAllProductDto = {}) {
        const { sort, searchTerm } = dto
  
        const prismaSort: Prisma.ProductOrderByWithRelationInput [] = []
  
        if ( sort === EnumProductSort.LOW_PRICE ) {
          prismaSort.push({ price: 'asc' })
        } else if ( sort === EnumProductSort.HIGH_PRICE ) {
          prismaSort.push({ price: 'desc' })
        } else if ( sort === EnumProductSort.OLDEST ) {
          prismaSort.push({ createdAt: 'asc'})
        } else {
          prismaSort.push({ createdAt: 'desc'})
        }
  
        const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm ? {
          OR: [
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
        } : {}
  
        const { perPage, skip } = this.paginationService.getPagination(dto)
  
        const products = await this.prisma.product.findMany({
          where: prismaSearchTermFilter, 
          orderBy: prismaSort, 
          skip, 
          take: perPage, 
          select: productReturnObject
        })
  
        return {
          products, 
          length: await this.prisma.product.count({
              where: prismaSearchTermFilter
          })
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

    // TODO: refactor: make similar products by category   
 /*   async getSimilar(id: number) {
        const currentProduct = await this.byId(id)

        if (!currentProduct) 
            throw new NotFoundException('Current product not found')
            
        const products = await this.prisma.product.findMany({
            where: {
                reviews: {
                    rating: currentProduct.reviews.rating
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
            
        return products
    }
    */
    async create() {
        const product = await this.prisma.product.create({
            data: {
                name: '',
                price: 0,
                description: '',
                miles: '',
                time: '', 
                image: ''
            }
        })
        return product.id;
    }

    async update(id: number, dto: ProductDto) {
        const { name, price, description, image, miles, time } = dto

        return this.prisma.product.update({
            where: {
                id
            }, 
            data: {
                name, 
                price, 
                description, 
                image,
                miles, 
                time
            }
        })
    }

    async delete(id: number) {
        return this.prisma.product.delete({where: {id}})
    }
}
