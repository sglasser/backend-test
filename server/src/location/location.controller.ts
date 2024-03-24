import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Inject,
  Header,
  BadRequestException,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { Throttle } from '@nestjs/throttler';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ApiQuery } from '@nestjs/swagger';

@Controller('v1/locations') // Specify the API version number as 'v1' and the table name as 'locations'
export class LocationController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly locationService: LocationService,
  ) {}

  @Post()
  async create(@Body() createLocationDto: CreateLocationDto) {
    return await this.locationService.create(createLocationDto);
  }

  @Get()
  @Header('Cache-Control', 'no-cache')
  async findAll() {
    return await this.locationService.findAll();
  }

  // GET api/v1/locations/cost?completedTasks=true&unCompletedTasks=true&locations=1,2,3,4,5,6,7,8,9,10
  @Throttle({ default: { limit: 2, ttl: 1000 } })
  @Get('cost')
  @Header('Cache-Control', 'no-cache')
  @ApiQuery({ name: 'includeCompleted', required: false })
  @ApiQuery({ name: 'includeUncompleted', required: false })
  @ApiQuery({ name: 'locations', required: false })
  async getCost(
    @Query('locations') locations?: string,
    @Query('includeCompleted') completedTasks?: boolean,
    @Query('includeUncompleted') uncompletedTasks?: boolean,
  ) {
    // validate the locations query parameter if it exists
    const locationsArray = locations ? locations.split(',') : [];

    if (locationsArray.some((id) => isNaN(+id))) {
      return new BadRequestException('Location ids must be numbers');
    }
    
    //TODO probably want to add some sort of hashing function for the cache key to prevent long query strings being used as cache keys
    // not taking into account the includeCompleted and includeUncompleted query params as the current schema (tasks table) doesn't support them
    const cacheKey = `workerCost-${locations ? locations : 'all'}`;
    const cacheValue = await this.cacheManager.get(cacheKey);

    if (cacheValue) {
      console.log('Returning cached value'); // remove - just checking if cache is working
      return cacheValue;
    } else {
      const cost = await this.locationService.findCost(locations);
      //TODO might want to add some error handling here in case the cache fails to set, we still want the cost to be returned
      await this.cacheManager.set(cacheKey, cost);
      return cost;
    }
  }

  @Get(':id')
  @Header('Cache-Control', 'no-cache')
  async findOne(@Param('id') id: string) {
    return await this.locationService.findOne(+id);
  }
}
