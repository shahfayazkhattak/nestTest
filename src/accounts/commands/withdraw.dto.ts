// withdraw.dto.ts
import { IsNumber, IsPositive } from 'class-validator';
export class WithdrawDto {
  @IsNumber() @IsPositive() amount: number;
}
