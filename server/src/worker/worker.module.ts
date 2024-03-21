import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from './entities/worker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Worker
  ])],
  controllers: [WorkerController],
  providers: [WorkerService],
})
export class WorkerModule {}
