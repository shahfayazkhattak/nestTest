import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async findOne(id: string): Promise<Task> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid task ID format');
    }
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException(`Task with ID "${id}" not found`);
    return task;
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel(dto);
    return createdTask.save();
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid task ID format');
    }
    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, dto)
      .exec();
    if (!updatedTask) throw new NotFoundException(`Task with ID "${id}" not found`);
    return updatedTask;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid task ID format');
    }
    const result = await this.taskModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Task with ID "${id}" not found`);
  }
}