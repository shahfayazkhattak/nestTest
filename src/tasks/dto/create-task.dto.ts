import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Learn NestJS', description: 'Title of the task' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  title: string;

  @ApiProperty({ example: 'Learn NestJS by building a task management API', description: 'Description of the task' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
