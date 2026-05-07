import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post()
  addItem(@Request() req, @Body() data: { productId: number, quantity: number }) {
    return this.cartService.addItem(req.user.userId, data.productId, data.quantity || 1);
  }

  @Delete(':productId')
  removeItem(@Request() req, @Param('productId', ParseIntPipe) productId: number) {
    return this.cartService.removeItem(req.user.userId, productId);
  }
  
  @Delete()
  clearCart(@Request() req) {
      return this.cartService.clearCart(req.user.userId);
  }
}
