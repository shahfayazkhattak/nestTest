export interface BaseEvent {
  id: string;
  aggregateId: string;
  type: string;
  timestamp: Date;
  payload: Record<string, any>;
  version: number;
}
