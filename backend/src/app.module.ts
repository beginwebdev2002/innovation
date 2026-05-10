import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AuthModule } from '@auth/auth.module';
import { CartModule } from '@cart/cart.module';
import { PrismaModule } from '@prisma/prisma.module';
import { ProductsModule } from '@products/products.module';
import { UsersModule } from '@users/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeedAdminService } from './seed-admin';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CartModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
    }),
  ],
  controllers: [AppController],
  providers: [SeedAdminService, AppService],
})
export class AppModule {}
