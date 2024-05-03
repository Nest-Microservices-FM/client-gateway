import { Module } from '@nestjs/common';
import { AddTokenInterceptor } from './interceptors/add-token.interceptor';

@Module({
  providers: [AddTokenInterceptor],
  exports: [AddTokenInterceptor],
})
export class CommonModule {}
