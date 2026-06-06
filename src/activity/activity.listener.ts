import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

// 📋 Define a clear structure for our activity payloads
export interface ActivityEventPayload {
  action: 'TEAM_JOINED' | 'PROJECT_CREATED' | 'TASK_CREATED' | 'TASK_COMPLETED';
  userId: string;
  teamId: string;
}

@Injectable()
export class ActivityListener {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService
  ) {}

  // 👂 Listens for the central event broadcast name: 'activity.dispatched'
  @OnEvent('activity.dispatched', { async: true })
  async handleActivityLog(payload: ActivityEventPayload) {
    try {
      // Write the immutable event record straight into your PostgreSQL table
      await this.prisma.activity.create({
        data: {
          action: payload.action,
          userId: payload.userId,
          teamId: payload.teamId,
        },
      });

      if (payload.action === 'TASK_COMPLETED') {
        await this.redis.incr('analytics:task_completed_today')

        await this.redis.zincrby(`leaderboard:team:${payload.teamId}`, 1, payload.userId)
      }

      if (payload.action === 'PROJECT_CREATED') {
        await this.redis.incr('analytics:projects_created_today')
      }

    } catch (error) {
      // Safe non-blocking log output so database write issues don't crash user requests
      console.error(`[ERROR] Background Redis/Prisma Write Failed:`, error.message);
    }
  }
}