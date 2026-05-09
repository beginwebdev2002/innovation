import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { unlink } from 'fs';
import { join } from 'path';

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

  async update(id: number, data: any) {
    // If a new image is provided, delete the old one from disk
    if (data.imageUrl) {
      const existing = await this.prisma.product.findUnique({ where: { id } });
      if (existing?.imageUrl && existing.imageUrl !== data.imageUrl) {
        const oldFilePath = join(process.cwd(), 'public', existing.imageUrl);
        unlink(oldFilePath, (err) => {
          if (err) console.warn(`Could not delete old image: ${oldFilePath}`, err.message);
        });
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: { ...data, ...(data.price !== undefined ? { price: parseFloat(data.price) } : {}) },
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
