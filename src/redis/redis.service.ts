import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Initializes the Redis client connection targeting default localhost parameters
    super({
      host: 'localhost',
      port: 6379,
    });
  }

  onModuleInit() {
    console.log('Redis Client successfully connected');
  }

  onModuleDestroy() {
    this.disconnect();
  }
}