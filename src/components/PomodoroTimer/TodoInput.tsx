import React, { useState, KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';
import { Project } from '../../utils/todoUtils';
import { ProjectSelector } from './ProjectSelector';

interface TodoInputProps {
  onAddTodo: (text: string, projectId?: string) => void;
  projects?: Project[];
  disabled?: boolean;
}

const MAX_TODO_LENGTH = 200;

export const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo, projects = [], disabled = false }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    
    if (trimmed.length === 0) {
      return; // Don't add empty todos
    }

    if (trimmed.length > MAX_TODO_LENGTH) {
      // Truncate if too long (could show warning instead)
      onAddTodo(trimmed.substring(0, MAX_TODO_LENGTH), selectedProjectId);
    } else {
      onAddTodo(trimmed, selectedProjectId);
    }

    // Clear input after adding (but keep project selection)
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled) {
      handleSubmit();
    }
  };

  const isDisabled = disabled || inputValue.trim().length === 0;

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task..."
          disabled={disabled}
          maxLength={MAX_TODO_LENGTH}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed
                     placeholder-gray-400 dark:placeholder-gray-500"
          aria-label="Add a new task"
        />
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                     text-white rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     transition-colors duration-200
                     flex items-center gap-2"
          aria-label="Add task"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>
      {projects.length > 0 && (
        <ProjectSelector
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
        />
      )}
    </div>
  );
};
