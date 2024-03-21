import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('workers')
export class Worker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  hourly_wage: number;

  constructor(partial: Partial<Worker>) {
    Object.assign(this, partial);
  }
}
