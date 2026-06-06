import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto, UpdateTeamDto } from './dto/team.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('team')
@UseGuards(AuthGuard('jwt'))
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  create(@GetUser('id') userId: string, @Body() dto: CreateTeamDto) {
    return this.teamService.create(userId, dto);
  }

  @Get()
  findAll(@GetUser('id') userId: string) {
    return this.teamService.findAll(userId);
  }

  @Get(':id')
  findOne(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.teamService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @GetUser('id') userId: string, 
    @Param('id') id: string, 
    @Body() dto: UpdateTeamDto
  ) {
    return this.teamService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.teamService.remove(userId, id);
  }
}
