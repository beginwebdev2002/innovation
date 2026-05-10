import * as bcrypt from 'bcrypt';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvironmentVariables } from '@config/env.interface';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class SeedAdminService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (!adminEmail || !adminPassword) {
      console.warn('ADMIN_EMAIL or ADMIN_PASSWORD is not set');
      return;
    }

    const existing = await this.prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existing) return;

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await this.prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      },
    });
  }
}
