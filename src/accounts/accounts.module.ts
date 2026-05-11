import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controllers';
import { AccountsService } from './accounts.service';
import { EventStoreService } from './event-store/event-store.services';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, EventStoreService],
})
export class AccountsModule {}
