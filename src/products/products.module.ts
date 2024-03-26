import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from 'src/config/envs';
import { PRODUCT_SERVICE } from 'src/config/services';
import { ProductsController } from './products.controller';


@Module({
  imports: [  
    ClientsModule.register([
      { name: PRODUCT_SERVICE, 
        transport: Transport.TCP,
        options:{
          host: envs.productsMicroserviceHost,
          port: envs.productMicroservicePort
        }
      },
    ]),
  
  ],
  controllers: [ProductsController],
  providers: [],
})
export class ProductsModule {}
