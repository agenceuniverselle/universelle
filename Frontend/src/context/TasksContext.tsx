
import React, { createContext, useContext, ReactNode } from 'react';
import { useTasks, Task } from '@/hooks/useTasks';

interface TasksContextType {
  tasks: Task[];
  addTask: (newTask: Omit<Task, 'id'>) => Task;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  cancelTask: (taskId: string) => void;
  putTaskOnHold: (taskId: string) => void;
  getTasksForDate: (date: Date | undefined) => Task[];
  getUpcomingTasks: (limit?: number) => Task[];
  exportToCalendar: (taskId: string, type: 'google' | 'outlook') => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const tasksHook = useTasks();
  
  return (
    <TasksContext.Provider value={tasksHook}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasksContext = (): TasksContextType => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasksContext must be used within a TasksProvider');
  }
  return context;
};
