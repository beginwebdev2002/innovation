import { Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  checkout(@Request() req) {
    return this.ordersService.checkout(req.user.userId);
  }

  @Get()
  getOrders(@Request() req) {
    return this.ordersService.getOrders(req.user.userId);
  }
}
