import { Injectable, NotFoundException } from '@nestjs/common';
import { EventStoreService } from './event-store/event-store.services';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateAccountDto } from './commands/create-account.dto';
import { AccountAggregate } from './aggregates/account-aggregate';
import { DepositDto } from './commands/deposit.dto';
import { WithdrawDto } from './commands/withdraw.dto';

@Injectable()
export class AccountsService {
  constructor(
    private readonly eventStore: EventStoreService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  createAccount(dto: CreateAccountDto) {
    const id = crypto.randomUUID();
    const aggregate = AccountAggregate.create(id, dto.ownerId);
    this.commit(id, aggregate);
    return aggregate.getState();
  }

  getAccount(id: string) {
    const events = this.eventStore.getEvents(id);
    if (events.length === 0) throw new NotFoundException('Account not found');
    const aggregate = new AccountAggregate(id, events);
    return aggregate.getState();
  }

  deposit(id: string, dto: DepositDto) {
    const aggregate = this.loadAggregate(id);
    aggregate.deposit(dto.amount);
    this.commit(id, aggregate);
    return aggregate.getState();
  }

  withdraw(id: string, dto: WithdrawDto) {
    const aggregate = this.loadAggregate(id);
    aggregate.withdraw(dto.amount);
    this.commit(id, aggregate);
    return aggregate.getState();
  }

  private loadAggregate(id: string): AccountAggregate {
    const events = this.eventStore.getEvents(id);
    if (events.length === 0) throw new NotFoundException('Account not found');
    return new AccountAggregate(id, events);
  }

  private commit(id: string, aggregate: AccountAggregate): void {
    const events = aggregate.getUncommitedEvents();
    if (events.length === 0) return;
    // 1️⃣ Persist to event store (append-only)
    this.eventStore.save(id, events);
    // 2️⃣ Dispatch events to listeners (WS, queues, projections, etc.)
    events.forEach((event) => this.eventEmitter.emit(event.type, event));
  }
}
