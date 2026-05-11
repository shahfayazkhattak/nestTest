import { ACCOUNT_EVENTS } from '../events/account.events';
import { BaseEvent } from '../events/base-event.interface';

export interface AccountState {
  id: string;
  ownerId: string;
  balance: number;
  version: number;
}

export class AccountAggregate {
  private state: AccountState;
  private uncommitedEvents: BaseEvent[] = [];

  constructor(id: string, events: BaseEvent[] = []) {
    this.state = { id, ownerId: '', balance: 0, version: 0 };
    events.forEach((event) => this.apply(event));
  }

  static create(id: string, ownerId: string): AccountAggregate {
    const aggregate = new AccountAggregate(id, []);
    const event: BaseEvent = {
      id: crypto.randomUUID(),
      aggregateId: id,
      type: ACCOUNT_EVENTS.CREATED,
      timestamp: new Date(),
      payload: { ownerId },
      version: 1,
    };
    aggregate.uncommitedEvents.push(event);
    return aggregate;
  }

  deposit(amount: number): BaseEvent {
    const event: BaseEvent = {
      id: crypto.randomUUID(),
      aggregateId: this.state.id,
      type: ACCOUNT_EVENTS.DEPOSITED,
      timestamp: new Date(),
      payload: { amount },
      version: this.state.version + 1,
    };
    this.uncommitedEvents.push(event);
    return event;
  }

  withdraw(amount: number): BaseEvent {
    if (this.state.balance < amount) {
      throw new Error('Insufficient funds');
    }
    const event: BaseEvent = {
      id: crypto.randomUUID(),
      aggregateId: this.state.id,
      type: ACCOUNT_EVENTS.WITHDRAWN,
      timestamp: new Date(),
      payload: { amount },
      version: this.state.version + 1,
    };
    this.uncommitedEvents.push(event);
    return event;
  }

  getState(): AccountState {
    return { ...this.state };
  }

  getUncommitedEvents(): BaseEvent[] {
    return [...this.uncommitedEvents];
  }

  private apply(event: BaseEvent): void {
    this.state.version = event.version;
    switch (event.type) {
      case ACCOUNT_EVENTS.CREATED:
        this.state.ownerId = event.payload.ownerId;
        this.state.balance = 0;
        break;
      case ACCOUNT_EVENTS.DEPOSITED:
        this.state.balance += event.payload.amount;
        break;
      case ACCOUNT_EVENTS.WITHDRAWN:
        this.state.balance -= event.payload.amount;
        break;
    }
  }
}
