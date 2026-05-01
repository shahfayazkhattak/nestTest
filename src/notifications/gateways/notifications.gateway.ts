import { Injectable, Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { OnEvent } from '@nestjs/event-emitter';
import { Server, Socket } from 'socket.io';
import { TASK_EVENTS } from '../events/task.events';
import type { TaskEventPayload } from '../events/task.events';

@WebSocketGateway({ cors: true })
@Injectable()
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    this.logger.log(`📩 Message received from ${client.id}`);
    client.emit('message', payload);
  }
  @OnEvent(TASK_EVENTS.CREATED)
  handleTaskCreated(payload: TaskEventPayload) {
    this.logger.log(`📡 Broadcasting task creation: ${payload.title}`);
    this.server.emit(TASK_EVENTS.CREATED, payload);
  }
}
