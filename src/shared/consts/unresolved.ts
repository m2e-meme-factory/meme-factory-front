import { Event } from 'api';

//todo: решить проблему с неправильным разрешением модуля с интерфейсами для API

export interface ProjectProgress {
  id: number;
  userId: number;
  projectId: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt?: Date;
  events: Event[];
  appliedTasks: string[];
  approvedTasks: string[];
  rejectedTasks: string[];
}
