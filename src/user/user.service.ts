import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'argon2';
import { UserDto } from './user.dto';
import { PrismaService } from 'src/prisma.service';
import { returnUserObject } from './return-user.object';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) {}

    async getAll() {
        return this.prisma.user.findMany({
            select: returnUserObject
        })
    }

    async byId(id: number, selectObject: Prisma.UserSelect = {}) {
        const user = await this.prisma.user.findUnique({
            where: { id},  
            select: {
              ...returnUserObject, 
              favorites: {
                select: {
                    id: true, 
                    name: true, 
                    price: true, 
                    image: true,  
                    slug: true, 
                    reviews: true,
                    category: {
                        select: {
                            slug: true
                        }
                    }
                },
              }, 
              ...selectObject
            }
        })

        if (!user) {
            throw new Error('User not found')
        }

        return user
    }

    async updateProfile (id: number, dto: UserDto) {
        const isSameUser = await this.prisma.user.findUnique({
            where: {email: dto.email}
        })

        if (isSameUser && id !== isSameUser.id)
            throw new BadRequestException('Email already in use')
        
        const user = await this.byId(id)

        return this.prisma.user.update({
            where: {
                id
            }, 
            data: {
                email: dto.email, 
                name: dto.name, 
                avatarPath: dto.avatarPath, 
                phone: dto.phone, 
                password: dto.password ? await hash(dto.password) : 
                user.password
            }
        })
    }


    async toggleFavorite(userId: number, productId: number) {
        const user = await this.byId(userId)

        if(!user) throw new NotFoundException('User not found.')

        const isExists = user.favorites.some(product => product.id === productId)

        await this.prisma.user.update({
            where: {
                id: user.id
            }, 
            data: {
                favorites: {
                    [isExists ? 'disconnect' : 'connect']: {
                       id: productId 
                    }
                }
            }
        })
    }

    async delete(id: number) {
        const reviews = await this.prisma.review.findMany({
            where: {
              userId: id,
            },
          });
      
          // TODO: импортировать из review модуля
          await this.prisma.review.deleteMany({
            where: {
              userId: id,
            },
          });
      

          await this.prisma.user.delete({
            where: {
              id,
            },
          });
      
          return { success: true };
        }
    }

