import { Prisma } from "@prisma/client";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class ProductDto implements Prisma.ProductUpdateInput {
    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    image: string;

    @IsString()
    miles: string;

    @IsString()
    time: string;
}
