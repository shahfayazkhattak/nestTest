import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true }) // Auto-manages createdAt & updatedAt
export class Task {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: false })
  completed: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);