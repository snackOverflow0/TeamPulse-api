import { IsIn, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Task title cannot be empty' })
  @MaxLength(100, { message: 'Task title cannot exceed 100 characters' })
  title!: string;

  @IsUUID(4, { message: 'Parent projectId must be a valid UUID string' })
  @IsNotEmpty({ message: 'A parent projectId must be explicitly assigned' })
  projectId!: string;

  @IsUUID(4, { message: 'assignedToId must be a valid UUID string' })
  @IsOptional()
  assignedToId?: string;

  @IsString()
  @IsOptional()
  @IsIn(['TODO', 'IN_PROGRESS', 'DONE'], { message: 'Invalid status state' })
  status?: string;

  @IsString()
  @IsOptional()
  @IsIn(['LOW', 'MEDIUM', 'HIGH'], { message: 'Invalid priority tier' })
  priority?: string;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Task title cannot exceed 100 characters' })
  title?: string;

  @IsString()
  @IsOptional()
  @IsIn(['TODO', 'IN_PROGRESS', 'DONE'], { message: 'Invalid status state' })
  status?: string;

  @IsString()
  @IsOptional()
  @IsIn(['LOW', 'MEDIUM', 'HIGH'], { message: 'Invalid priority tier' })
  priority?: string;

  @IsUUID(4, { message: 'assignedToId must be a valid UUID string' })
  @IsOptional()
  assignedToId?: string;
}