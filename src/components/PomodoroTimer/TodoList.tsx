import React, { useState, useEffect } from 'react';
import { TodoItem, loadTodos, saveTodos, createTodo } from '../../utils/todoUtils';
import { TodoInput } from './TodoInput';
import { TodoItem as TodoItemComponent } from './TodoItem';
import { CheckSquare } from 'lucide-react';

interface TodoListProps {
  isTimerRunning?: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({ isTimerRunning = false }) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);

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

  const handleAddTodo = (text: string) => {
    const newTodo = createTodo(text);
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !todo.completed,
            completedAt: !todo.completed ? Date.now() : undefined,
          };
        }
        return todo;
      })
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  // Sort todos: active first, then completed (both by order/createdAt)
  const sortedTodos = [...todos].sort((a, b) => {
    // Active todos come first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // Within same completion status, sort by order (newest first)
    return b.order - a.order;
  });

  const activeTodosCount = todos.filter((todo) => !todo.completed).length;
  const completedTodosCount = todos.filter((todo) => todo.completed).length;

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
      {sortedTodos.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <CheckSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No tasks yet. Add one above to get started!</p>
        </div>
      ) : (
        <div className="space-y-1 max-h-96 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
          {sortedTodos.map((todo) => (
            <TodoItemComponent
              key={todo.id}
              todo={todo}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
            />
          ))}
        </div>
      )}
    </div>
  );
};
