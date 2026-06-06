import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Project name cannot be empty' })
  @MaxLength(50, { message: 'Project name cannot exceed 50 characters' })
  name!: string;

  @IsUUID(4, { message: 'Parent teamId must be a valid UUID string' })
  @IsNotEmpty({ message: 'A parent teamId must be assigned' })
  teamId!: string;
}

export class UpdateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Updated project name cannot be empty' })
  @MaxLength(50, { message: 'Project name cannot exceed 50 characters' })
  name!: string;
}