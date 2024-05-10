import { Controller, Get } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('statistic')
export class StatisticController {
  constructor(private statisticService: StatisticService) {}

  @Get('main')
  @Auth()
  getMainStatistics() {
    return this.statisticService.getMain();
  }
}
