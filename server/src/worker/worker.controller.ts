import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('v1/workers') // Specify the API version number as 'v1' and the table name as 'workers'
@UseGuards(AuthGuard)
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Post()
  async create(@Body() createWorkerDto: CreateWorkerDto) {
    return await this.workerService.create(createWorkerDto);
  }

  @Get()
  async findAll() {
    return await this.workerService.findAll();
  }

  @Throttle({default: { limit: 2, ttl: 1000}})
  @Get('cost')
  async findCost(@Query('completedTasks') completedTasks?: boolean, @Query('notCompletedTasks') notCompletedTasks?: boolean) {
    return await this.workerService.findCost();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.workerService.findOne(+id);
  }
}
