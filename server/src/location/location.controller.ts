import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';

@Controller('v1/locations') // Specify the API version number as 'v1' and the table name as 'locations'
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  async create(@Body() createLocationDto: CreateLocationDto) {
    return await this.locationService.create(createLocationDto);
  }

  @Get()
  async findAll() {
    return await this.locationService.findAll();
  }

  @Get('cost') 
  async getCost() { 
    return await this.locationService.findCost(); 
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.locationService.findOne(+id);
  }
}
