import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty({ message: 'Team name cannot be empty' })
  @MaxLength(50, { message: 'Team name cannot exceed 50 characters' })
  name!: string;
}

export class UpdateTeamDto {
  @IsString()
  @IsNotEmpty({ message: 'Updated team name cannot be empty' })
  @MaxLength(50, { message: 'Team name cannot exceed 50 characters' })
  name!: string;
}