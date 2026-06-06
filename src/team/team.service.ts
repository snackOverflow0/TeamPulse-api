import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto, UpdateTeamDto } from './dto/team.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTeamDto) {
    return this.prisma.team.create({
      data: {
        name: dto.name,
        ownerId: userId
      }
    })
  }

  async findAll(userId: string) {
    return this.prisma.team.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' }
    })
  }

  async findOne(userId: string, id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id }
    })

    if (!team) {
      throw new NotFoundException('Requested team does not exist')
    }

    if (team.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to view this team')
    }

    return team
  }

  async update(userId: string, id: string, dto: UpdateTeamDto) {
    await this.findOne(userId, id)

    return this.prisma.team.update({
      where: { id },
      data: { name: dto.name }
    })
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id)

    await this.prisma.team.delete({
      where: { id }
    })

    return { success: true, message: 'Team and all its nested sub-assets have been deleted' }
  }
}
