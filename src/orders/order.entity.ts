import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productName: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @ManyToOne(() => User, user => user.orders, { eager: true })
  user: User;
}
