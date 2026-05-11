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
    const adminEmail = this.configService.get('ADMIN_EMAIL', { infer: true });
    const adminPassword = this.configService.get('ADMIN_PASSWORD', {
      infer: true,
    });

    if (!adminEmail || !adminPassword) {
      console.warn('ADMIN_EMAIL or ADMIN_PASSWORD is not set');
      return;
    }

    const existing = await this.prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existing) return;

    const hashedPassword = await bcrypt.hash(
      adminPassword,
      this.configService.get('HASH_SALT', { infer: true }),
    );

    await this.prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      },
    });
  }
}
