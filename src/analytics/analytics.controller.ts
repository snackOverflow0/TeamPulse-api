import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RedisService } from '../redis/redis.service';

@Controller()
@UseGuards(AuthGuard('jwt')) // 🛡️ Secure endpoints
export class AnalyticsController {
  constructor(private redis: RedisService) {}

  // 📥 GET /analytics (Fetches high-performance live atomic counter metrics)
  @Get('analytics')
  async getDailyAnalytics() {
    const tasksCompleted = await this.redis.get('analytics:tasks_completed_today') || '0';
    const projectsCreated = await this.redis.get('analytics:projects_created_today') || '0';

    return {
      today: {
        tasksCompletedToday: parseInt(tasksCompleted, 10),
        projectsCreatedToday: parseInt(projectsCreated, 10),
      },
    };
  }

  // 📥 GET /leaderboard?teamId=abc (Fetches the live user performance rankings via Sorted Sets)
  @Get('leaderboard')
  async getTeamLeaderboard(@Query('teamId') teamId: string) {
    // Fetches top 10 ranked users sorted descending by points (ZREVRANGE with scores)
    const leaderboardRaw = await this.redis.zrevrange(
      `leaderboard:team:${teamId}`,
      0,
      9,
      'WITHSCORES',
    );

    // Formats flat array output ['userId1', 'score1', 'userId2', 'score2'] into clean JSON objects
   // 💡 Add explicit type definitions to the array initialization
    const formattedLeaderboard: Array<{ userId: string; tasksCompleted: number }> = [];
    
    for (let i = 0; i < leaderboardRaw.length; i += 2) {
      formattedLeaderboard.push({
        userId: leaderboardRaw[i],
        tasksCompleted: parseInt(leaderboardRaw[i + 1], 10),
      });
    }

    return {
      teamId,
      leaderboard: formattedLeaderboard,
    };
  }
}