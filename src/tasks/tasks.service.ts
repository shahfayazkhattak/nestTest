import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}

@Injectable()
export class TasksService {
  // In-memory storage for beginners (replace with DB later)
  private tasks: Task[] = [];

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: string): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  create(dto: CreateTaskDto): Task {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: dto.title,
      description: dto.description,
      createdAt: new Date(),
    };
    this.tasks.push(newTask);
    return newTask;
  }
}