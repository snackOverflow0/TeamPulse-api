import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global() // Exposes Redis instance app-wide automatically
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}