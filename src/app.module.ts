import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './team/team.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [PrismaModule, AuthModule, TeamModule, ProjectModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
