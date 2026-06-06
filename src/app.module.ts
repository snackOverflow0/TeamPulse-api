import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './team/team.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { ActivityModule } from './activity/activity.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [PrismaModule, AuthModule, TeamModule, ProjectModule, TaskModule, ActivityModule, EventEmitterModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
