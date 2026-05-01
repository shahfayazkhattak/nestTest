import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationsQueue } from 'src/notifications/queues/notifications.queue';
import { TASK_EVENTS } from 'src/notifications/events/task.events';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    private readonly eventEmitter: EventEmitter2,
    private readonly notificationsQueue: NotificationsQueue
  ) {}

  async findAll(): Promise<Task[]> {
    this.logger.log('Fetching all tasks');
    return this.taskModel.find().exec();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException(`Task with ID "${id}" not found`);
    return task;
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const createdTask = await this.taskModel.create(dto);
    const payload = { taskId: createdTask.id, title: createdTask.title, timestamp: new Date() };

    // 1️⃣ Emit synchronous event (only logs, no blocking operations)
    this.eventEmitter.emit(TASK_EVENTS.CREATED, payload);

    // 2️⃣ Push to background queue → triggers BullMQ processor
    await this.notificationsQueue.addTaskCreated(payload);
    this.logger.log(`Task created & events dispatched: ${createdTask.id}`);
    return createdTask;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const updatedTask = await this.taskModel.findByIdAndUpdate(id, dto).exec();
    if (!updatedTask) throw new NotFoundException(`Task with ID "${id}" not found`);
    return updatedTask;
  }

  async remove(id: string): Promise<void> {
    const result = await this.taskModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Task with ID "${id}" not found`);
  }
}
