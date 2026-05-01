export const TASK_EVENTS = {
  CREATED: 'task.created',
  PROCESSED: 'task.processed',
};

export interface TaskEventPayload {
  taskId: string;
  title: string;
  timestamp: Date;
}
