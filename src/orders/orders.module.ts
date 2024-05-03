import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { NatsModule } from 'src/transports/nats.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [OrdersController],
  imports: [NatsModule,AuthModule]


})
export class OrdersModule {}
