import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, IsBoolean } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({ example: 'Updated Title' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @ApiProperty({ example: 'Updated Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
