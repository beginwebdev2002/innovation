import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async checkout(userId: number) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0,
    );

    const order = await this.prisma.order.create({
      data: {
        userId,
        totalAmount,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.product.price,
          })),
        },
      },
    });

    await this.prisma.cartItem.deleteMany({ where: { userId } });

    return order;
  }

  getOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
