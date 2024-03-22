import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30, unique: true, nullable: false })
  name: string;

  constructor(partial: Partial<Location>) {
    Object.assign(this, partial);
  }
}