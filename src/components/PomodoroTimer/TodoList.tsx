import React, { useState, useEffect } from 'react';
import { TodoItem, loadTodos, saveTodos, createTodo } from '../../utils/todoUtils';
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
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());

  // Load todos from localStorage on mount
  useEffect(() => {
    const loadedTodos = loadTodos();
    setTodos(loadedTodos);
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (todos.length > 0 || loadTodos().length > 0) {
      saveTodos(todos);
    }
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

  // Separate active and completed todos
  const activeTodos = todos.filter((todo) => !todo.completed).sort((a, b) => b.order - a.order);
  const completedTodos = todos.filter((todo) => todo.completed).sort((a, b) => b.order - a.order);

  const activeTodosCount = activeTodos.length;
  const completedTodosCount = completedTodos.length;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Todo List
        </h2>
        {todos.length > 0 && (
          <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            {activeTodosCount} active
            {completedTodosCount > 0 && ` • ${completedTodosCount} completed`}
          </span>
        )}
      </div>

      {/* Input */}
      <div className="mb-4">
        <TodoInput onAddTodo={handleAddTodo} disabled={false} />
      </div>

      {/* Todo List */}
      {todos.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <CheckSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No tasks yet. Add one above to get started!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Tasks Section */}
          {activeTodos.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 px-1">
                Active Tasks ({activeTodosCount})
              </h3>
              <div className="space-y-1 max-h-64 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                {activeTodos.map((todo) => (
                  <TodoItemComponent
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks Section */}
          {completedTodos.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 px-1">
                Completed Tasks ({completedTodosCount})
              </h3>
              <div className="space-y-1 max-h-64 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                {completedTodos.map((todo) => (
                  <TodoItemComponent
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
