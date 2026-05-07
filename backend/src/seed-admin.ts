import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedAdminService implements OnModuleInit {
  private readonly logger = new Logger(SeedAdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const adminEmail = 'admin@innovation.tj';
    const adminPassword = 'innovation2026';

    const existing = await this.prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existing) {
      this.logger.log(`Admin user already exists: ${adminEmail}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await this.prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      },
    });

    this.logger.log(`✅ Admin user created: ${adminEmail}`);
  }
}
