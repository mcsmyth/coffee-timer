import React, { useState } from 'react';
import { TodoList } from './TodoList';
import { List, X } from 'lucide-react';

interface TodoListPanelProps {
  isTimerRunning: boolean;
  sessionId?: number;
  isTimerActive?: boolean;
}

export const TodoListPanel: React.FC<TodoListPanelProps> = ({
  isTimerRunning,
  sessionId,
  isTimerActive
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Only show when timer is running
  if (!isTimerRunning) {
    return null;
  }

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle Button - Always visible when timer is running */}
      <button
        onClick={togglePanel}
        className={`fixed top-4 left-4 z-20 p-3 rounded-full 
                   bg-black/20 backdrop-blur-md hover:bg-black/30 
                   text-white border border-white/20
                   focus:outline-none focus:ring-2 focus:ring-white/50
                   transition-all duration-200
                   shadow-lg`}
        aria-label={isOpen ? 'Close todo list' : 'Open todo list'}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <List className="w-6 h-6" />
        )}
      </button>

      {/* Backdrop - closes panel on click */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={togglePanel}
          aria-hidden="true"
        />
      )}

      {/* Todo List Panel */}
      <div
        className={`fixed top-0 left-0 h-full z-40 
                   bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg
                   shadow-2xl
                   w-full sm:w-96 max-w-sm
                   transform transition-transform duration-300 ease-in-out
                   ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                   overflow-y-auto`}
      >
        <div className="p-6">
          <TodoList
            isTimerRunning={isTimerRunning}
            sessionId={sessionId}
            isTimerActive={isTimerActive}
          />
        </div>
      </div>
    </>
  );
};
