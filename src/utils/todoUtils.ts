/**
 * Todo Item data structure
 */
export interface TodoItem {
  id: string;              // Unique identifier
  text: string;            // Task description
  completed: boolean;      // Completion status
  createdAt: number;       // Timestamp when created
  completedAt?: number;    // Timestamp when completed (optional)
  order: number;           // Display order
  sessionId?: number;      // Timer session when task was completed
  timeSpent?: number;      // Time spent in seconds
}

const STORAGE_KEY = 'pomodoro_todos';

/**
 * Read todos from localStorage
 * @returns Array of TodoItem or empty array if none exist or error occurs
 */
export const loadTodos = (): TodoItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    
    // Validate that it's an array
    if (!Array.isArray(parsed)) {
      console.warn('Invalid todo data format, resetting to empty array');
      return [];
    }
    
    // Basic validation - ensure each item has required fields
    const validated = parsed.filter((item: any) => {
      return (
        item &&
        typeof item.id === 'string' &&
        typeof item.text === 'string' &&
        typeof item.completed === 'boolean' &&
        typeof item.createdAt === 'number' &&
        typeof item.order === 'number'
      );
    });
    
    // If some items were invalid, save the cleaned version
    if (validated.length !== parsed.length) {
      saveTodos(validated);
    }
    
    return validated;
  } catch (error) {
    console.error('Error loading todos:', error);
    return [];
  }
};

/**
 * Save todos to localStorage
 * @param todos - Array of TodoItem to save
 */
export const saveTodos = (todos: TodoItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    // Handle quota exceeded or other storage errors
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Consider clearing old todos.');
    } else {
      console.error('Error saving todos:', error);
    }
  }
};

/**
 * Generate a unique ID for a todo item
 * @returns Unique string ID
 */
export const generateTodoId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create a new todo item
 * @param text - Task description
 * @returns New TodoItem object
 */
export const createTodo = (text: string): TodoItem => {
  return {
    id: generateTodoId(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now(),
    order: Date.now(), // Use timestamp for simple ordering
  };
};

/**
 * Format time spent in seconds to a readable string
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "2m 30s", "1h 5m")
 */
export const formatTimeSpent = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    if (minutes > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${hours}h`;
  }

  if (secs > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${minutes}m`;
};
