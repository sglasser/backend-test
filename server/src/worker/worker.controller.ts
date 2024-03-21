import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';

@Controller('worker')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Post()
  async create(@Body() createWorkerDto: CreateWorkerDto) {
    return this.workerService.create(createWorkerDto);
  }

  @Get()
  async findAll() {
    return this.workerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.workerService.findOne(+id);
  }

  @Get(':id/cost')
  async findHours(@Param('id') id: number) {
    return this.workerService.totalCost(id);
  }

  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() updateWorkerDto: UpdateWorkerDto) {
  //   return this.workerService.update(+id, updateWorkerDto);
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return this.workerService.remove(+id);
  // }
}
