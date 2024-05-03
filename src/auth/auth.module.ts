import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { NatsModule } from 'src/transports/nats.module';
import { AuthGuard } from './guards';

@Module({
  controllers: [AuthController],
  providers: [AuthGuard],
  imports: [NatsModule],
  exports: [AuthGuard]
})
export class AuthModule {}
