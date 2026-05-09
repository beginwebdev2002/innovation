import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  getCart(userId: number) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addItem(userId: number, productId: number, quantity: number) {
    const existing = await this.prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true },
      });
    }
    return this.prisma.cartItem.create({
      data: { userId, productId, quantity },
      include: { product: true },
    });
  }

  removeItem(userId: number, productId: number) {
    return this.prisma.cartItem.deleteMany({
      where: { userId, productId },
    });
  }

  clearCart(userId: number) {
    return this.prisma.cartItem.deleteMany({
      where: { userId },
    });
  }
}
