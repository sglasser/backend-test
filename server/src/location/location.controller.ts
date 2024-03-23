import { Controller, Get, Post, Body, Param, Query, Inject } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { Throttle } from '@nestjs/throttler';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('v1/locations') // Specify the API version number as 'v1' and the table name as 'locations'
export class LocationController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly locationService: LocationService
  ) {}

  @Post()
  async create(@Body() createLocationDto: CreateLocationDto) {
    return await this.locationService.create(createLocationDto);
  }

  @Get()
  async findAll() {
    return await this.locationService.findAll();
  }

  @Throttle({default: { limit: 2, ttl: 1000}})
  @Get('cost') 
  async getCost(@Query('locations') locations?: string) { 
    const cacheKey = `workerCost-${locations ? locations : 'all'}`;
    const cacheValue = await this.cacheManager.get(cacheKey);

    if (cacheValue) {
      console.log('Returning cached value'); // remove - just checking if cache is working
      return cacheValue;
    } else {
      const cost = await this.locationService.findCost(locations);
      await this.cacheManager.set(
        cacheKey,
        cost,
      );
      return cost;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.locationService.findOne(+id);
  }
}
