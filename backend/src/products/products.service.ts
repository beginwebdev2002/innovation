import { unlink } from 'fs';
import { join } from 'path';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@prisma/prisma.service';

import type { ProductCreateDto, ProductUpdateDto } from './products.models';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll(
    search?: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number,
  ) {
    return this.prisma.product.findMany({
      where: {
        ...(category
          ? { category: { equals: category, mode: 'insensitive' } }
          : {}),
        ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
        ...(minPrice || maxPrice
          ? {
              price: {
                gte: minPrice ? +minPrice : 0,
                lte: maxPrice ? +maxPrice : 9999999,
              },
            }
          : {}),
      },
    });
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  create(data: ProductCreateDto) {
    const { price, ...restData } = data;
    return this.prisma.product.create({
      data: { ...restData, price: parseFloat(price) },
    });
  }

  async update(id: number, data: ProductUpdateDto) {
    await this.updateImageUrl(id, data);
    const { price, ...restData } = data;
    return this.prisma.product.update({
      where: { id },
      data: {
        ...restData,
        ...(price !== undefined ? { price: parseFloat(price) } : {}),
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (existing?.imageUrl) {
      const oldFilePath = join(process.cwd(), 'public', existing.imageUrl);
      unlink(oldFilePath, (err) => {
        if (err) console.warn(err.message);
      });
    }
    return this.prisma.product.delete({ where: { id } });
  }

  private async updateImageUrl(id: number, data: ProductUpdateDto) {
    if (data.imageUrl) {
      const existing = await this.prisma.product.findUnique({ where: { id } });
      if (existing?.imageUrl && existing.imageUrl !== data.imageUrl) {
        const oldFilePath = join(process.cwd(), 'public', existing.imageUrl);
        unlink(oldFilePath, (err) => {
          if (err) console.warn(err.message);
        });
      }
    }
    return data;
  }
}
