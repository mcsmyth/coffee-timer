/**
 * Project data structure
 */
export interface Project {
  id: string;              // Unique identifier
  name: string;            // Project name
  createdAt: number;       // Timestamp when created
  order: number;           // Display order
}

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
  projectId?: string;      // Associated project ID (optional)
}

const STORAGE_KEY = 'pomodoro_todos';
const PROJECTS_STORAGE_KEY = 'pomodoro_projects';

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
    // Dispatch custom event to notify other TodoList instances in the same window
    window.dispatchEvent(new CustomEvent('todosUpdated', { detail: todos }));
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
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
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

// ==================== Project Management Functions ====================

/**
 * Load projects from localStorage
 * @returns Array of Project or empty array if none exist or error occurs
 */
export const loadProjects = (): Project[] => {
  try {
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    
    // Validate that it's an array
    if (!Array.isArray(parsed)) {
      console.warn('Invalid project data format, resetting to empty array');
      return [];
    }
    
    // Basic validation - ensure each item has required fields
    const validated = parsed.filter((item: any) => {
      return (
        item &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.createdAt === 'number' &&
        typeof item.order === 'number'
      );
    });
    
    // If some items were invalid, save the cleaned version
    if (validated.length !== parsed.length) {
      saveProjects(validated);
    }
    
    return validated;
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
};

/**
 * Save projects to localStorage
 * @param projects - Array of Project to save
 */
export const saveProjects = (projects: Project[]): void => {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    // Dispatch custom event to notify other TodoList instances in the same window
    window.dispatchEvent(new CustomEvent('projectsUpdated', { detail: projects }));
  } catch (error) {
    // Handle quota exceeded or other storage errors
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Consider clearing old projects.');
    } else {
      console.error('Error saving projects:', error);
    }
  }
};

/**
 * Generate a unique ID for a project
 * @returns Unique string ID
 */
export const generateProjectId = (): string => {
  return `project-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Create a new project
 * @param name - Project name
 * @returns New Project object
 */
export const createProject = (name: string): Project => {
  return {
    id: generateProjectId(),
    name: name.trim(),
    createdAt: Date.now(),
    order: Date.now(), // Use timestamp for simple ordering
  };
};

/**
 * Delete a project and optionally remove projectId from todos
 * @param projectId - ID of project to delete
 * @param todos - Array of todos to update (will be modified)
 * @returns Updated todos array with projectId removed
 */
export const deleteProjectFromTodos = (projectId: string, todos: TodoItem[]): TodoItem[] => {
  return todos.map(todo => {
    if (todo.projectId === projectId) {
      const { projectId, ...todoWithoutProject } = todo;
      return todoWithoutProject;
    }
    return todo;
  });
};

/**
 * Reorder todos within a list and update their order values
 * @param todos - Array of todos to reorder
 * @param activeIndex - Index of the item being dragged
 * @param overIndex - Index where the item is being dropped
 * @returns Reordered array of todos with updated order values
 */
export const reorderTodos = (todos: TodoItem[], activeIndex: number, overIndex: number): TodoItem[] => {
  const reordered = [...todos];
  const [removed] = reordered.splice(activeIndex, 1);
  reordered.splice(overIndex, 0, removed);

  // Update order values based on new positions (higher order = appears first)
  const now = Date.now();
  return reordered.map((todo, index) => ({
    ...todo,
    order: now - index, // More recent = higher order = appears first
  }));
};
