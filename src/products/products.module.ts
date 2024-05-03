import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { NatsModule } from 'src/transports/nats.module';
import { AuthModule } from 'src/auth/auth.module';



@Module({
  imports: [NatsModule,AuthModule],
  controllers: [ProductsController],
  providers: [],
})
export class ProductsModule {}
