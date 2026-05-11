import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './commands/create-account.dto';
import { DepositDto } from './commands/deposit.dto';
import { WithdrawDto } from './commands/withdraw.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() dto: CreateAccountDto) {
    return this.accountsService.createAccount(dto);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.accountsService.getAccount(id);
  }

  @Post(':id/deposit')
  deposit(@Param('id') id: string, @Body() dto: DepositDto) {
    return this.accountsService.deposit(id, dto);
  }

  @Post(':id/withdraw')
  withdraw(@Param('id') id: string, @Body() dto: WithdrawDto) {
    return this.accountsService.withdraw(id, dto);
  }
}
