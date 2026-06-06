import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  async create(userId: string, dto: CreateTaskDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
      include: { team: true }
    })

    if (!project) {
      throw new NotFoundException('The target project does not exist')
    }

    if (project.team.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to add tasks to this project')
    }

    return this.prisma.task.create({
      data: {
        title: dto.title,
        projectId: dto.projectId,
        assignedToId: dto.assignedToId,
        status: dto.status || 'TODO',
        priority: dto.priority || 'MEDIUM'
      }
    })
  }

  async findAll(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { team: true }
    })

    if (!project || project.team.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to view tasks in this project')
    }

    return this.prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    })
  }

  async findOne(userId: string, id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            team: true
          }
        }
      }
    })

    if (!task) {
      throw new NotFoundException('Requested task does not exist')
    }

    if (task.project.team.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to view this task')
    }

    const { project, ...taskData } = task
    return taskData
  }

  async update(userId: string, id: string, dto: UpdateTaskDto) {
    await this.findOne(userId, id);

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        status: dto.status,
        priority: dto.priority,
        assignedToId: dto.assignedToId,
      },
      include: { project: true }
    });

    if (dto.status === "DONE") {
      this.eventEmitter.emit('activity.dispatched', {
        action: 'TASK_COMPLETED',
        userId: userId,
        teamId: updatedTask.project.teamId
      })
    } else if (dto.status) {
      this.eventEmitter.emit('activity.dispatched', {
        action: 'TASK_CREATED',
        userId: userId,
        teamId: updatedTask.project.teamId
      })
    }

    return updatedTask
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    await this.prisma.task.delete({
      where: { id },
    });

    return { success: true, message: 'Task successfully removed' };
  }
}
