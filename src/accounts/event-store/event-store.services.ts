import { Injectable, Logger } from '@nestjs/common';
import { BaseEvent } from '../events/base-event.interface';

@Injectable()
export class EventStoreService {
  private readonly store: Map<string, BaseEvent[]> = new Map();
  private readonly logger = new Logger(EventStoreService.name);

  save(aggregateId: string, events: BaseEvent[]): void {
    const existing = this.store.get(aggregateId) || [];
    this.store.set(aggregateId, [...existing, ...events]);
    this.logger.log(`💾 Appended ${events.length} events to aggregate ${aggregateId}`);
  }

  getEvents(aggregateId: string): BaseEvent[] {
    return this.store.get(aggregateId) || [];
  }
}
