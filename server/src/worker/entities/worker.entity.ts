import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('workers')
export class Worker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30, unique: true, nullable: false })
  username: string;

  @Column('decimal', { precision: 5, scale: 2, nullable: false, default: 0 })
  hourly_wage: number;

  constructor(partial: Partial<Worker>) {
    Object.assign(this, partial);
  }
}
