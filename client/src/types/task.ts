export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  priority: TaskPriority;
  blockchainVerified?: boolean;
  category?: string;
}

export interface AIPrioritizationResponse {
  prioritizedTasks: Task[];
  motivationalTip: string;
}

export interface TaskAnalytics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  categoryCounts: Record<string, number>;
  weeklyCompletion: {
    day: string;
    completed: number;
    created: number;
  }[];
}
