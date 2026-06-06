import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'; // 🔌 Import Throttler
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './team/team.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { ActivityModule } from './activity/activity.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    // 🛡️ Set up global throttling rules: max 60 requests per 1 minute per IP
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 60,
    }]),
    PrismaModule,
    AuthModule,
    TeamModule,
    ProjectModule,
    TaskModule,
    ActivityModule,
    AnalyticsModule,
  ],
  providers: [
    // Activates the rate limiter automatically across every single route
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}