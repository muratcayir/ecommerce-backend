import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serviceName: string;

  @Column()
  description: string;
}
