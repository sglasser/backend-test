import { Test, TestingModule } from '@nestjs/testing';
import { WorkerService } from './worker.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Worker } from './entities/worker.entity';
import { EntityManager } from 'typeorm';

describe('WorkerService', () => {
  let service: WorkerService;

  const mockWorkerRepository = {
    save: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    totalCost: jest.fn(),
  }

  const mockEntityManager = {
    query: jest.fn(),
    update: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkerService,
        {
          provide: getRepositoryToken(Worker),
          useValue: mockWorkerRepository
        },
        {
          provide: EntityManager, 
          useValue: mockEntityManager
        }],
    }).compile();

    service = module.get<WorkerService>(WorkerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a worker', async () => {
    const worker = new Worker({
      username: 'test',
      hourly_wage: 10,
    });

    jest.spyOn(mockWorkerRepository, 'save').mockReturnValue(worker);

    const result = await service.create(worker);

    expect(result).toEqual(worker);
    expect(mockWorkerRepository.save).toBeCalledWith(worker);
  });

  it('findAll => should return an array of user', async () => {
 
    const worker1 = {
      id: 1,
      username: 'test1',
      hourly_wage: 10,
    };

    const worker2 = {
      id: 2,
      username: 'test2',
      hourly_wage: 20,
    };
    const users = [worker1, worker2];

    jest.spyOn(mockWorkerRepository, 'find').mockReturnValue(users);

    const result = await service.findAll();

    expect(result).toEqual(users);
    expect(result.length).toEqual(2);
    expect(mockWorkerRepository.find).toBeCalled();
  });

  it('findOne => should find a worker by a given id and return its data', async () => {
    //arrange
    const id = 1;
    const worker = {
      id: 1,
      username: 'Test 1',
      hourly_wage: 30.00,
    };

    jest.spyOn(mockWorkerRepository, 'findOneBy').mockReturnValue(worker);

    const result = await service.findOne(id);

    expect(result).toEqual(worker);
    expect(mockWorkerRepository.findOneBy).toBeCalled();
    expect(mockWorkerRepository.findOneBy).toBeCalledWith({ id });
  });

  it('totalCost => should return the total cost of all workers across all tasks and locations', async () => {
    const worker1 =  {
      "worker_id": 1,
      "worker_username": "Worker 1",
      "total_cost": "60.00"
    }

    const worker2 = {
      "worker_id": 2,
      "worker_username": "Worker 2",
      "total_cost": "80.00"
    }

    const workerCosts = [worker1, worker2];

    jest.spyOn(mockEntityManager, 'query').mockReturnValue(workerCosts);

    const result = await service.findCost();

    expect(result).toEqual(workerCosts);
    expect(mockEntityManager.query).toBeCalled();
  });
});
