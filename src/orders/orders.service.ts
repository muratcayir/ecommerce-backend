import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async createOrder(order: Order): Promise<Order> {
    return this.ordersRepository.save(order);
  }

  async findAllOrdersByUser(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({ where: { user: { id: userId } } });
  }
}
