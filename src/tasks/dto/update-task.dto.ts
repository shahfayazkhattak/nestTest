import { IsString, IsOptional, MinLength, IsBoolean } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}