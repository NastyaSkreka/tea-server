import { Prisma } from "@prisma/client";
import { returnReviewObject } from "src/review/return-review.object";

export const productReturnObject: Prisma.ProductSelect = {
    id: true, 
    createdAt: true,
    name: true,
    price: true,
    description: true,
    image: true,
    miles: true,
    time: true,
    reviews: {
        select: returnReviewObject
    }
}

export const productReturnObjectFullest: Prisma.ProductSelect = {
    ...productReturnObject
}