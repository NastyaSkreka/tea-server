import { Body, Controller, Delete, Get, HttpCode, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewDto } from './review.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Role } from 'src/utils/constants';

@Controller('reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService, 
    ) {}

  @UsePipes(new ValidationPipe())
  @Get()
  @Auth(Role.ADMIN)
  async getAll() {
    return this.reviewService.getAll()
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('leave/:productId')
   @Auth()
  async leaveReview(
    @CurrentUser('id') id: number, 
    @Body() dto: ReviewDto, 
    @Param('productId') productId: string
  ) {
    return this.reviewService.create(id, dto, +productId)
  } 

  @Get('average-by-product/:productId')
  async getAverageByProduct(@Param('productId') productId: string) {
    return this.reviewService.getAverageValueByProductId(+productId)
  }

  @HttpCode(200)
  @Delete(':id')
  @Auth(Role.ADMIN)
  @Auth()
  async deleteReview(@Param('id') id: string) {
    return this.reviewService.delete(+id)
  }
}
