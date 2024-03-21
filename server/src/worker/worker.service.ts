import { Injectable } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { EntityManager, Repository } from 'typeorm';
import { Worker } from './entities/worker.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WorkerService {

  constructor(
    @InjectRepository(Worker)
    private readonly workerRepository: Repository<Worker>,
    private readonly entityManager: EntityManager) {}

  async create(createWorkerDto: CreateWorkerDto) {
    const worker = new Worker(createWorkerDto)   
    await this.entityManager.save(worker);
  }

  async findAll() {
    return await this.workerRepository.find();
  }

  async findOne(id: number) {
    return this.workerRepository.findOneBy({ id });
  }

  //By worker - the total cost of that worker across all tasks and locations
  async totalCost(workerId: number) {
    // return await this.entityManager.query(`SELECT * FROM logged_time WHERE worker_id = ${workerId} AND location_id = ${locationId}`);
    return this.entityManager.query(`
      SELECT 
        w.username,
        SUM(w.hourly_wage * (lt.time_seconds / 3600)) AS total_cost
      FROM 
        workers w
      JOIN 
        logged_time lt ON w.id = lt.worker_id
      JOIN 
        tasks t ON lt.task_id = t.id
      JOIN 
        locations l ON t.location_id = l.id
      WHERE 
        w.id  = ${workerId}
    `);
  }

  // async update(id: number, updateWorkerDto: UpdateWorkerDto) {
  //   const updatedWorker = new Worker(updateWorkerDto);
  //   await this.entityManager.update(updatedWorker);
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} worker`;
  // }
}
