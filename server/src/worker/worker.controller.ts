import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Inject,
  Header,
  BadRequestException,
} from '@nestjs/common';
import { WorkerService } from './worker.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Throttle } from '@nestjs/throttler';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ApiQuery } from '@nestjs/swagger';

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
  @Header('Cache-Control', 'no-cache')
  async findAll() {
    return await this.workerService.findAll();
  }

  // url lengths are limited to 2048 characters, so we need to limit the number of query parameters (userIds in this case)
  // or use a POST request instead. For the sake of argument we'll assume we're limiting the number of users that can be queried at one time to 100
  // GET api/v1/workers/cost?completedTasks=true&unCompletedTasks=true&userId=1,2,3,4,5,6,7,8,9,10
  @Throttle({ default: { limit: 2, ttl: 1000 } })
  @Get('cost')
  @Header('Cache-Control', 'no-cache')
  @ApiQuery({ name: 'includeCompleted', required: false })
  @ApiQuery({ name: 'includeUncompleted', required: false })
  @ApiQuery({ name: 'workers', required: false })
  async findCost(
    @Query('includeCompleted') completedTasks?: boolean, // not implemented in the current db schema
    @Query('includeUncompleted') uncompletedTasks?: boolean, // not implemented in the current db schema
    @Query('workers') workers?: string,
  ) {
    // validate the workers query parameter if it exists
    const workersArray = workers ? workers.split(',') : [];
    if (workersArray.length > 100) {
      return new BadRequestException('Too many workers requested');
    }

    if (workersArray.some((id) => isNaN(+id))) {
      return new BadRequestException('Worker ids must be numbers');
    }

    //TODO might want to add some sort of hashing function for cache key to prevent long query strings being used as cache keys
    // not taking into account the includeCompleted and includeUncompleted query params as the current schema (tasks table) doesn't support them
    const cacheKey = `workerCost-${workers ? workers : 'all'}`;
    const cacheValue = await this.cacheManager.get(cacheKey);

    if (cacheValue) {
      console.log('Returning cached value'); //remove - just checking if cache is working
      return cacheValue;
    } else {
      const cost = await this.workerService.findCost(workers);
      //TODO might want to add some error handling here in case the cache fails to set, we still want the cost to be returned
      await this.cacheManager.set(cacheKey, cost);
      return cost;
    }
  }

  @Get(':id')
  @Header('Cache-Control', 'no-cache')
  async findOne(@Param('id') id: string) {
    if (isNaN(+id)) {
      return new BadRequestException('Worker Id must be a number');
    }
    return await this.workerService.findOne(+id);
  }
}
