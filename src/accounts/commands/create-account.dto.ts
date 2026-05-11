// create-account.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';
export class CreateAccountDto {
  @IsString() @IsNotEmpty() ownerId: string;
}
