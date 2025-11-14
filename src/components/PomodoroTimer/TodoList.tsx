import React, { useState, useEffect, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { 
  TodoItem, 
  loadTodos, 
  saveTodos, 
  createTodo,
  reorderTodos
} from '../../utils/todoUtils';
import { TodoInput } from './TodoInput';
import { TodoItem as TodoItemComponent } from './TodoItem';
import { CheckSquare } from 'lucide-react';

interface TodoListProps {
  isTimerRunning?: boolean;
  sessionId?: number;
  isTimerActive?: boolean; // Whether timer is running (not paused)
}

export const TodoList: React.FC<TodoListProps> = ({
  isTimerRunning = false,
  sessionId = 0,
  isTimerActive = false
}) => {
  // Initialize state from localStorage immediately to ensure fresh data on mount
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      return loadTodos();
    } catch {
      return [];
    }
  });
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  
  // Use refs to track if we're updating from an event to prevent save loops
  const isUpdatingFromEvent = useRef<boolean>(false);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load todos from localStorage on mount and when timer starts
  const loadInitialData = () => {
    const loadedTodos = loadTodos();
    // Always update state, even if it seems the same, to ensure fresh data
    setTodos(loadedTodos);
  };

  // Load todos from localStorage on mount
  useEffect(() => {
    // Load immediately on mount
    loadInitialData();
    
    // Also reload after a delay to catch any pending saves from other instances
    // This is especially important for the panel that mounts when timer starts
    const timeoutId = setTimeout(() => {
      loadInitialData();
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Listen for custom events to sync todos across multiple TodoList instances in the same window
  useEffect(() => {
    const handleTodosUpdated = (e: CustomEvent<TodoItem[]>) => {
      if (e.detail && Array.isArray(e.detail)) {
        setTodos((prevTodos) => {
          // Compare sorted arrays to check if data actually changed
          const prevSorted = [...prevTodos].sort((a, b) => a.id.localeCompare(b.id));
          const newSorted = [...e.detail].sort((a, b) => a.id.localeCompare(b.id));
          const prevStr = JSON.stringify(prevSorted);
          const newStr = JSON.stringify(newSorted);
          
          if (prevStr !== newStr) {
            // Mark that we're updating from an event to prevent save loop
            // The flag will be reset in the save effect when it skips the save
            isUpdatingFromEvent.current = true;
            return e.detail;
          }
          return prevTodos;
        });
      }
    };

    window.addEventListener('todosUpdated', handleTodosUpdated as EventListener);
    
    return () => {
      window.removeEventListener('todosUpdated', handleTodosUpdated as EventListener);
    };
  }, []);

  // Reload todos when timer starts running (for panel that mounts when timer starts)
  useEffect(() => {
    // Reload from localStorage when timer starts running (panel opens)
    // This ensures fresh data when the panel's TodoList mounts
    if (isTimerRunning) {
      // Load immediately
      loadInitialData();
      
      // Also reload after a delay to catch any pending saves
      const timeoutId = setTimeout(() => {
        loadInitialData();
      }, 150);
      
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isTimerRunning]);

  // Save todos to localStorage whenever todos change (but not when updating from event)
  useEffect(() => {
    // Skip saving if we're updating from an event to prevent infinite loops
    if (isUpdatingFromEvent.current) {
      // Reset the flag after skipping the save
      setTimeout(() => {
        isUpdatingFromEvent.current = false;
      }, 0);
      return;
    }
    
    // Always save immediately, even if empty, to ensure deletions are persisted
    saveTodos(todos);
  }, [todos]);


  // Track timer session start time
  useEffect(() => {
    if (isTimerActive && sessionId > 0) {
      setSessionStartTime(Date.now());
    }
  }, [sessionId, isTimerActive]);

  const handleAddTodo = (text: string) => {
    const newTodo = createTodo(text);
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  // Handle drag end for reordering todos
  const handleDragEnd = (event: DragEndEvent, isCompleted: boolean) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Find the dragged todo
    const draggedTodo = todos.find((t) => t.id === active.id);
    if (!draggedTodo) return;

    // Determine which todos belong to this group (active or completed)
    const groupTodos = todos.filter((t) => t.completed === isCompleted);

    const oldIndex = groupTodos.findIndex((todo) => todo.id === active.id);
    const newIndex = groupTodos.findIndex((todo) => todo.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = reorderTodos(groupTodos, oldIndex, newIndex);
      
      // Update the main todos state
      setTodos((prevTodos) => {
        const updatedTodos = [...prevTodos];
        reordered.forEach((reorderedTodo) => {
          const index = updatedTodos.findIndex((t) => t.id === reorderedTodo.id);
          if (index !== -1) {
            updatedTodos[index] = reorderedTodo;
          }
        });
        return updatedTodos;
      });
    }
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === id) {
          const isCompleting = !todo.completed;
          const now = Date.now();

          // Calculate time spent if completing the task and timer is active
          let timeSpent = todo.timeSpent;
          if (isCompleting && isTimerActive && sessionId > 0) {
            const sessionDuration = Math.floor((now - sessionStartTime) / 1000);
            timeSpent = sessionDuration;
          }

          return {
            ...todo,
            completed: isCompleting,
            completedAt: isCompleting ? now : undefined,
            sessionId: isCompleting && isTimerActive ? sessionId : undefined,
            timeSpent: isCompleting ? timeSpent : undefined,
          };
        }
        return todo;
      })
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  // Helper to separate active and completed todos
  const separateTodos = (todoList: TodoItem[]) => {
    const active = todoList.filter(t => !t.completed).sort((a, b) => b.order - a.order);
    const completed = todoList.filter(t => t.completed).sort((a, b) => b.order - a.order);
    return { active, completed };
  };

  const { active: activeTodos, completed: completedTodos } = separateTodos(todos);
  const totalActiveCount = todos.filter(t => !t.completed).length;
  const totalCompletedCount = todos.filter(t => t.completed).length;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <CheckSquare className="w-5 h-5 text-white drop-shadow-md" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)' }} />
        <h2 className="text-xl font-semibold text-white drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)' }}>
          Todo List
        </h2>
        {todos.length > 0 && (
          <span className="ml-auto text-sm text-white/90 drop-shadow-md" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)' }}>
            {totalActiveCount} active
            {totalCompletedCount > 0 && ` • ${totalCompletedCount} completed`}
          </span>
        )}
      </div>

      {/* Todo Input */}
      <div className="mb-4">
        <TodoInput 
          onAddTodo={handleAddTodo} 
          disabled={false} 
        />
      </div>

      {/* Todo List */}
      {todos.length === 0 ? (
        <div className="text-center py-8 text-white/90 drop-shadow-md" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)' }}>
          <CheckSquare className="w-12 h-12 mx-auto mb-2 opacity-70" />
          <p>No tasks yet. Add a task above to get started!</p>
        </div>
      ) : (
        <div className="border border-white/30 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg">
          <div className="p-3 space-y-3">
            {/* Active Tasks */}
            {activeTodos.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(e) => handleDragEnd(e, false)}
              >
                <SortableContext
                  items={activeTodos.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {activeTodos.map((todo) => (
                      <TodoItemComponent
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggleTodo}
                        onDelete={handleDeleteTodo}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {/* Completed Tasks */}
            {completedTodos.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 px-1">
                  Completed
                </h4>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(e) => handleDragEnd(e, true)}
                >
                  <SortableContext
                    items={completedTodos.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {completedTodos.map((todo) => (
                        <TodoItemComponent
                          key={todo.id}
                          todo={todo}
                          onToggle={handleToggleTodo}
                          onDelete={handleDeleteTodo}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
