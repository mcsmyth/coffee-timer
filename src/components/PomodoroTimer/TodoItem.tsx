import React from 'react';
import { TodoItem as TodoItemType, formatTimeSpent } from '../../utils/todoUtils';
import { X, Clock } from 'lucide-react';

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  return (
    <div className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 cursor-pointer transition-all"
        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />

      {/* Task Text */}
      <div className="flex-1 flex items-center gap-2">
        <label
          className={`flex-1 cursor-pointer select-none transition-all duration-200 ${
            todo.completed
              ? 'line-through text-gray-500 dark:text-gray-400'
              : 'text-gray-800 dark:text-gray-200'
          }`}
          onClick={handleToggle}
        >
          {todo.text}
        </label>

        {/* Time Spent Badge (for completed tasks) */}
        {todo.completed && todo.timeSpent !== undefined && todo.timeSpent > 0 && (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
            <Clock className="w-3 h-3" />
            {formatTimeSpent(todo.timeSpent)}
          </span>
        )}
      </div>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label={`Delete "${todo.text}"`}
      >
        <X className="w-4 h-4 text-red-600 dark:text-red-400" />
      </button>
    </div>
  );
};
