import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll(search?: string, category?: string, minPrice?: number, maxPrice?: number) {
    return this.prisma.product.findMany({
      where: {
        ...(category ? { category: { equals: category, mode: 'insensitive' } } : {}),
        ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
        ...(minPrice || maxPrice ? { price: { gte: minPrice ? +minPrice : 0, lte: maxPrice ? +maxPrice : 9999999 } } : {}),
      },
    });
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  create(data: any) {
    return this.prisma.product.create({
      data: { ...data, price: parseFloat(data.price) },
    });
  }

  update(id: number, data: any) {
    return this.prisma.product.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
