import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityListener } from './activity.listener';

@Module({
  controllers: [ActivityController],
  providers: [ActivityListener]
})
export class ActivityModule {}
