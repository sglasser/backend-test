import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createLocationDto: CreateLocationDto) {
    const location = new Location(createLocationDto);
    return await this.locationRepository.save(location);
  }

  async findAll() {
    return await this.locationRepository.find();
  }

  /*
   * returns the total cost of workers for all tasks at a location
   *
   * @param locationIds - The locationIds to filter by
   * @returns The total cost of labor at each location for all tasks at that location
   */

  async findCost(locationIds?: string) {
    let sqlQuery = `
      SELECT
        loc.id AS location_id,
        loc.name AS location_name,
        COALESCE(ROUND(SUM((COALESCE(lt.time_seconds, 0) / 3600) * w.hourly_wage), 2), 0.00) AS labor_cost
      FROM
        locations loc
      LEFT JOIN
        tasks t ON loc.id = t.location_id
      LEFT JOIN
        logged_time lt ON t.id = lt.task_id
      LEFT JOIN
        workers w ON lt.worker_id = w.id
    `;

    // Conditionally add the WHERE clause based on locationIds
    if (locationIds && locationIds.length > 0) {
      sqlQuery += `
        WHERE
          loc.id in (${locationIds})
      `;
    }

    sqlQuery += `
      GROUP BY
        loc.id, loc.name
      ORDER BY
        loc.id;
    `;
    return await this.entityManager.query(sqlQuery);
  }

  async findOne(id: number) {
    return await this.locationRepository.findOneBy({ id });
  }
}
