import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { Role } from "../../../src/utils/constants";

@Injectable()
export class OnlyAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<{ user: User}>()
        const user = request.user

        if(user.role !== Role.ADMIN) throw new ForbiddenException('You are not admin')
        
        return user.role === Role.ADMIN
    }
}