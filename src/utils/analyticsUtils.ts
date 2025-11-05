import { loadTodos } from './todoUtils';

export interface TaskAnalytics {
  taskName: string;
  totalTimeSpent: number; // in seconds
  completionCount: number;
  lastCompleted?: number;
}

export interface DayAnalytics {
  date: string; // YYYY-MM-DD format
  totalTimeSpent: number; // in seconds
  taskCount: number;
}

export interface WeekAnalytics {
  weekStart: string; // YYYY-MM-DD format (Monday)
  weekEnd: string; // YYYY-MM-DD format (Sunday)
  totalTimeSpent: number; // in seconds
  taskCount: number;
}

export interface MonthAnalytics {
  month: string; // YYYY-MM format
  monthName: string; // e.g., "January 2024"
  totalTimeSpent: number; // in seconds
  taskCount: number;
}

/**
 * Get start of day timestamp
 */
const getStartOfDay = (timestamp: number): number => {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

/**
 * Get start of week (Monday) timestamp
 */
const getStartOfWeek = (timestamp: number): number => {
  const date = new Date(timestamp);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

/**
 * Get start of month timestamp
 */
const getStartOfMonth = (timestamp: number): number => {
  const date = new Date(timestamp);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

/**
 * Format date to YYYY-MM-DD
 */
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toISOString().split('T')[0];
};

/**
 * Format date to YYYY-MM
 */
const formatMonth = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * Get month name string
 */
const getMonthName = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

/**
 * Get analytics data for all tasks
 */
export const getTaskAnalytics = (): TaskAnalytics[] => {
  const todos = loadTodos();
  const taskMap = new Map<string, TaskAnalytics>();

  todos.forEach((todo) => {
    if (todo.completed && todo.timeSpent !== undefined && todo.timeSpent > 0) {
      const existing = taskMap.get(todo.text) || {
        taskName: todo.text,
        totalTimeSpent: 0,
        completionCount: 0,
        lastCompleted: undefined,
      };

      existing.totalTimeSpent += todo.timeSpent;
      existing.completionCount += 1;
      if (!existing.lastCompleted || (todo.completedAt && todo.completedAt > existing.lastCompleted)) {
        existing.lastCompleted = todo.completedAt;
      }

      taskMap.set(todo.text, existing);
    }
  });

  return Array.from(taskMap.values()).sort((a, b) => b.totalTimeSpent - a.totalTimeSpent);
};

/**
 * Get analytics data grouped by day
 */
export const getDayAnalytics = (): DayAnalytics[] => {
  const todos = loadTodos();
  const dayMap = new Map<string, DayAnalytics>();

  todos.forEach((todo) => {
    if (todo.completed && todo.timeSpent !== undefined && todo.timeSpent > 0 && todo.completedAt) {
      const dayStart = getStartOfDay(todo.completedAt);
      const dateKey = formatDate(dayStart);

      const existing = dayMap.get(dateKey) || {
        date: dateKey,
        totalTimeSpent: 0,
        taskCount: 0,
      };

      existing.totalTimeSpent += todo.timeSpent;
      existing.taskCount += 1;
      dayMap.set(dateKey, existing);
    }
  });

  return Array.from(dayMap.values()).sort((a, b) => b.date.localeCompare(a.date));
};

/**
 * Get analytics data grouped by week
 */
export const getWeekAnalytics = (): WeekAnalytics[] => {
  const todos = loadTodos();
  const weekMap = new Map<string, WeekAnalytics>();

  todos.forEach((todo) => {
    if (todo.completed && todo.timeSpent !== undefined && todo.timeSpent > 0 && todo.completedAt) {
      const weekStart = getStartOfWeek(todo.completedAt);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const weekKey = formatDate(weekStart);

      const existing = weekMap.get(weekKey) || {
        weekStart: formatDate(weekStart),
        weekEnd: formatDate(weekEnd.getTime()),
        totalTimeSpent: 0,
        taskCount: 0,
      };

      existing.totalTimeSpent += todo.timeSpent;
      existing.taskCount += 1;
      weekMap.set(weekKey, existing);
    }
  });

  return Array.from(weekMap.values()).sort((a, b) => b.weekStart.localeCompare(a.weekStart));
};

/**
 * Get analytics data grouped by month
 */
export const getMonthAnalytics = (): MonthAnalytics[] => {
  const todos = loadTodos();
  const monthMap = new Map<string, MonthAnalytics>();

  todos.forEach((todo) => {
    if (todo.completed && todo.timeSpent !== undefined && todo.timeSpent > 0 && todo.completedAt) {
      const monthStart = getStartOfMonth(todo.completedAt);
      const monthKey = formatMonth(monthStart);

      const existing = monthMap.get(monthKey) || {
        month: monthKey,
        monthName: getMonthName(monthStart),
        totalTimeSpent: 0,
        taskCount: 0,
      };

      existing.totalTimeSpent += todo.timeSpent;
      existing.taskCount += 1;
      monthMap.set(monthKey, existing);
    }
  });

  return Array.from(monthMap.values()).sort((a, b) => b.month.localeCompare(a.month));
};

/**
 * Get total focus time across all completed tasks
 */
export const getTotalFocusTime = (): number => {
  const todos = loadTodos();
  return todos
    .filter((todo) => todo.completed && todo.timeSpent !== undefined && todo.timeSpent > 0)
    .reduce((total, todo) => total + (todo.timeSpent || 0), 0);
};
