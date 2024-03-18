import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'argon2';
import { UserDto } from './user.dto';
import { PrismaService } from 'src/prisma.service';
import { returnUserObject } from './return-user.object';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) {}

    async byId(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id},  
            select: {
              ...returnUserObject
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

}
