import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Inject,
} from '@nestjs/common';
import { WorkerService } from './worker.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Throttle } from '@nestjs/throttler';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('v1/workers') // Specify the API version number as 'v1' and the table name as 'workers'
@UseGuards(AuthGuard)
export class WorkerController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly workerService: WorkerService,
  ) {}

  @Post()
  async create(@Body() createWorkerDto: CreateWorkerDto) {
    return await this.workerService.create(createWorkerDto);
  }

  @Get()
  async findAll() {
    return await this.workerService.findAll();
  }

  // url lengths are limited to 2048 characters, so we need to limit the number of query parameters (userIds in this case)
  // or use a POST request instead. For the sake of argument we'll assume we're limiting the number users that can be queried
  // GET /v1/workers/cost?completedTasks=true&notCompletedTasks=true&userId=1,2,3,4,5,6,7,8,9,10
  @Throttle({ default: { limit: 2, ttl: 1000 } })
  @Get('cost')
  async findCost(
    @Query('completedTasks') completedTasks?: boolean,
    @Query('notCompletedTasks') notCompletedTasks?: boolean,
    @Query('workers') workers?: string,
  ) {
    const cacheKey = `workerCost-${workers ? workers : 'all'}`;
    const cacheValue = await this.cacheManager.get(cacheKey);
    
    if (cacheValue) {
      console.log('Returning cached value'); // remove - just checking if cache is working
      return cacheValue;
    } else {
      const cost = await this.workerService.findCost(workers);
      await this.cacheManager.set(
        cacheKey,
        cost,
      );
      return cost;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.workerService.findOne(+id);
  }
}
