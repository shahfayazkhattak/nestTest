import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsGateway } from './gateways/notifications.gateway';
import { NotificationsQueue } from './queues/notifications.queue';
import { NotificationProcessor } from './queues/notifications.processor';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: { url: config.get<string>('redisUrl'), password: config.get<string>('redisPassword') },
      }),
    }),
    BullModule.registerQueue({ name: 'notifications' }),
  ],
  providers: [NotificationsGateway, NotificationsQueue, NotificationProcessor],
  exports: [NotificationsQueue],
})
export class NotificationsModule {}
