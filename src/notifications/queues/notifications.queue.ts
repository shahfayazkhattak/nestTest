import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { TaskEventPayload } from '../events/task.events';

@Injectable()
export class NotificationsQueue {
  constructor(@InjectQueue('notifications') private readonly queue: Queue) {}

  async addTaskCreated(payload: TaskEventPayload) {
    return this.queue.add('send-notification', payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: true,
    });
  }
}
