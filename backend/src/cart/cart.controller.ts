import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { AuthenticatedRequest, AddToCartDto } from './cart.models';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req: AuthenticatedRequest) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post()
  addItem(@Request() req: AuthenticatedRequest, @Body() data: AddToCartDto) {
    return this.cartService.addItem(
      req.user.userId,
      data.productId,
      data.quantity || 1,
    );
  }

  @Delete(':productId')
  removeItem(
    @Request() req: AuthenticatedRequest,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartService.removeItem(req.user.userId, productId);
  }

  @Delete()
  clearCart(@Request() req: AuthenticatedRequest) {
    return this.cartService.clearCart(req.user.userId);
  }

  @Post('checkout')
  checkout(@Request() req: AuthenticatedRequest) {
    return this.cartService.checkout(req.user.userId);
  }

  @Get('orders')
  getOrders(@Request() req: AuthenticatedRequest) {
    return this.cartService.getOrders(req.user.userId);
  }
}
