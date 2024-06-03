import { Controller, Post, Get, Body, Request, UseGuards, Logger } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Body() order: Order, @Request() req): Promise<Order> {
    this.logger.log('Creating order...');
    this.logger.log(`Order details: ${JSON.stringify(order)}`);
    this.logger.log(`User details: ${JSON.stringify(req.user)}`);

    const user = await this.usersService.findUserById(req.user.userId);
    if (!user) {
      throw new Error('User not found');
    }
    order.user = user;

    this.logger.log(`Final order: ${JSON.stringify(order)}`);

    return this.ordersService.createOrder(order);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getOrders(@Request() req): Promise<Order[]> {
    return this.ordersService.findAllOrdersByUser(req.user.userId);
  }
}
