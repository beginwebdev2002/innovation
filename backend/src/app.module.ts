import { AuthModule } from '@/auth/auth.module';
import { CartModule } from '@/cart/cart.module';
import { OrdersModule } from '@/orders/orders.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProductsModule } from '@/products/products.module';
import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeedAdminService } from './seed-admin';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
    }),
  ],
  controllers: [AppController],
  providers: [SeedAdminService, AppService],
})
export class AppModule {}
