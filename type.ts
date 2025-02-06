export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Session {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // in seconds
  tasks: Task[];
}

export type View = 'home' | 'tasks' | 'inbox' | 'reporting' | 'portfolios' | 'goals';
