import React, { useState, KeyboardEvent } from 'react';
import { FolderPlus } from 'lucide-react';

interface ProjectInputProps {
  onAddProject: (name: string) => void;
  disabled?: boolean;
}

const MAX_PROJECT_NAME_LENGTH = 50;

export const ProjectInput: React.FC<ProjectInputProps> = ({ onAddProject, disabled = false }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    
    if (trimmed.length === 0) {
      return; // Don't add empty projects
    }

    if (trimmed.length > MAX_PROJECT_NAME_LENGTH) {
      onAddProject(trimmed.substring(0, MAX_PROJECT_NAME_LENGTH));
    } else {
      onAddProject(trimmed);
    }

    // Clear input and collapse after adding
    setInputValue('');
    setIsExpanded(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled) {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setInputValue('');
      setIsExpanded(false);
    }
  };

  const isDisabled = disabled || inputValue.trim().length === 0;

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-2 text-sm 
                   text-blue-600 dark:text-blue-400 
                   hover:bg-blue-50 dark:hover:bg-blue-900/20 
                   rounded-lg transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Create new project"
      >
        <FolderPlus className="w-4 h-4" />
        <span>New Project</span>
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          // Don't collapse if there's input
          if (inputValue.trim().length === 0) {
            setIsExpanded(false);
          }
        }}
        placeholder="Project name..."
        disabled={disabled}
        maxLength={MAX_PROJECT_NAME_LENGTH}
        autoFocus
        className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 
                   text-gray-900 dark:text-gray-100
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   disabled:opacity-50 disabled:cursor-not-allowed
                   placeholder-gray-400 dark:placeholder-gray-500"
        aria-label="Project name"
      />
      <button
        onClick={handleSubmit}
        disabled={isDisabled}
        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                   text-white rounded-lg text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   transition-colors duration-200
                   flex items-center gap-2"
        aria-label="Create project"
      >
        <FolderPlus className="w-4 h-4" />
        <span>Add</span>
      </button>
      <button
        onClick={() => {
          setInputValue('');
          setIsExpanded(false);
        }}
        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600
                   text-gray-700 dark:text-gray-300 rounded-lg text-sm
                   focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                   transition-colors duration-200"
        aria-label="Cancel"
      >
        Cancel
      </button>
    </div>
  );
};
