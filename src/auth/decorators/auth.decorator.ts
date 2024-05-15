import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Role } from "../../utils/constants";
import { JwtAuthGuard } from "../guards/jwt.quard";
import { OnlyAdminGuard } from "../guards/admin.quard";

export const Auth = (role = Role.USER) => applyDecorators(
    role === Role.ADMIN 
    ? UseGuards(JwtAuthGuard, OnlyAdminGuard)
    : UseGuards(AuthGuard('jwt'))
)