import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { NatsModule } from './transports/nats.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { AddTokenInterceptor } from './common/interceptors/add-token.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';


@Module({
  imports: [ProductsModule, OrdersModule, NatsModule, AuthModule, CommonModule],
  controllers: [],
  providers:  [
    {
      provide: APP_INTERCEPTOR,
      useClass: AddTokenInterceptor,
    },
  ],
})
export class AppModule {}
