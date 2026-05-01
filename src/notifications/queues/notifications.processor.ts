import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { TaskEventPayload } from '../events/task.events';

@Processor('notifications')
@Injectable()
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  async process(job: Job<TaskEventPayload, any, string>): Promise<any> {
    this.logger.log(`⚙️ Processing job ${job.id}: ${job.data.title}`);

    // Simulate heavy async work (email, PDF gen, webhook, etc.)
    await new Promise((res) => setTimeout(res, 2000));
    this.logger.log(`✅ Job ${job.id} completed`);
    return { status: 'completed', processedAt: new Date() };
  }
}
