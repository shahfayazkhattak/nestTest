import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(@InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>) {}

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
    this.logger.log(`Creating task with title: ${dto.title}`);
    const createdTask = new this.taskModel(dto);
    return createdTask.save();
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
