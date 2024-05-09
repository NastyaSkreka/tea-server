import { Prisma } from "@prisma/client";
import { returnCategoryObject } from "../category/return-category.object";
import { returnReviewObject } from "../review/return-review.object";

export const productReturnObject: Prisma.ProductSelect = {
    id: true, 
    createdAt: true,
    name: true,
    price: true,
    description: true,
    image: true,
    miles: true,
    slug: true,
    userId: true,  
    time: true,
    category: { select: returnCategoryObject},
    reviews: {
        select: returnReviewObject, 
        orderBy: {
            createdAt: 'desc'
        }
    }
}

export const productReturnObjectFullest: Prisma.ProductSelect = {
    ...productReturnObject
}