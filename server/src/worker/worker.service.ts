import { Injectable } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { EntityManager, Repository } from 'typeorm';
import { Worker } from './entities/worker.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WorkerService {

  constructor(
    @InjectRepository(Worker)
    private readonly workerRepository: Repository<Worker>,
    private readonly entityManager: EntityManager) {}

  async create(createWorkerDto: CreateWorkerDto) {
    const worker = new Worker(createWorkerDto)   
    return await this.workerRepository.save(worker);
  }

  async findAll(): Promise<Worker[]>{
    return await this.workerRepository.find();
  }

  async findOne(id: number): Promise<Worker>{
    return await this.workerRepository.findOneBy({ id });
  }

  /*
  * returns the total cost of workers across all locations and tasks
  * 
  * @param workerIds - The workerIds to filter by
  * @returns The total cost of the workers
  */
  async findCost(workerIds?: string): Promise<any[]>{
    let sqlQuery = `
      SELECT
        w.id AS worker_id,
        w.username AS worker_username,
        ROUND(SUM((COALESCE(lt.time_seconds, 0) / 3600) * w.hourly_wage), 2) AS total_cost
      FROM
        workers w
      LEFT JOIN
        logged_time lt ON w.id = lt.worker_id
      LEFT JOIN
        tasks t ON lt.task_id = t.id
      LEFT JOIN
        locations loc ON t.location_id = loc.id
    `;

    // Conditionally add the WHERE clause based on workerIds
    if (workerIds && workerIds.length > 0) {
      sqlQuery += `
        WHERE
          w.id in (${workerIds})
      `;
    }

    sqlQuery += `
      GROUP BY
        w.id, w.username
      ORDER BY
        worker_id;
    `;

    return await this.entityManager.query(sqlQuery);
  }
}
