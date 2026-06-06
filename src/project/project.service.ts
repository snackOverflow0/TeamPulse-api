import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateProjectDto) {
    const team = await this.prisma.team.findUnique({
      where: { id: dto.teamId }
    })

    if (!team) {
      throw new NotFoundException('The specified target team does not exist')
    }

    if (team.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to build a project inside this team')
    }

    return this.prisma.project.create({
      data: {
        name: dto.name,
        teamId: dto.teamId
      }
    })
  }

  async findAllByTeam(userId: string, teamId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId }
    })

    if (!team || team.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to view this team\'s projects');
    } 

    return this.prisma.project.findMany({
      where: { teamId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(userId: string, id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { team: true }
    })

    if (!project) {
      throw new NotFoundException('Requested project does not exist');
    }

    if (project.team.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to view this project');
    }

    const { team, ...projectData } = project;
    return projectData;
  }

  async update(userId: string, id: string, dto: UpdateProjectDto) {
    await this.findOne(userId, id)

    return this.prisma.project.update({
      where: { id },
      data: { name: dto.name }
    })
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id)

    await this.prisma.project.delete({
      where: { id }
    })

    return { success: true, message: 'Project and all nested tasks successfully deleted' }
  }
}
