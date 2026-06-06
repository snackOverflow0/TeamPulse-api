import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';

@Controller('activities')
@UseGuards(AuthGuard('jwt')) // Restricts reading access feeds to authenticated members
export class ActivityController {
  constructor(private prisma: PrismaService) {}

  // 📥 GET /activities/team/:teamId (Fetch full workspace timeline)
  @Get('team/:teamId')
  async getTeamFeed(@Param('teamId') teamId: string) {
    return this.prisma.activity.findMany({
      where: { teamId },
      include: {
        user: { select: { email: true } }, // Safely returns user metadata for rendering UI strings
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 📥 GET /activities/user/:userId (Fetch single user contribution history)
  @Get('user/:userId')
  async getUserFeed(@Param('userId') userId: string) {
    return this.prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}