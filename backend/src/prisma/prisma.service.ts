import 'dotenv/config';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { EnvironmentVariables } from '@config/env.interface';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pgPool: Pool;
  private readonly configService: ConfigService<EnvironmentVariables, true>;

  constructor(configService: ConfigService<EnvironmentVariables, true>) {
    const connectionString = configService.get('DATABASE_URL', { infer: true });
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
    this.configService = configService;
    this.pgPool = pool;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pgPool.end();
  }
}
