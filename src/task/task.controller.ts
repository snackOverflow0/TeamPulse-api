import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('task')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@GetUser('id') userId: string, @Body() dto: CreateTaskDto) {
    return this.taskService.create(userId, dto);
  }

  @Get()
  findAll(@GetUser('id') userId: string, @Query('projectId') projectId: string) {
    return this.taskService.findAll(userId, projectId);
  }

  @Get(':id')
  findOne(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.taskService.findOne(userId, id);
  }

  @Patch(':id')
  update(@GetUser('id') userId: string, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.taskService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.taskService.remove(userId, id);
  }
}
