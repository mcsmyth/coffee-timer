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
  Project,
  loadTodos, 
  saveTodos, 
  createTodo,
  loadProjects,
  saveProjects,
  createProject,
  deleteProjectFromTodos,
  reorderTodos
} from '../../utils/todoUtils';
import { TodoInput } from './TodoInput';
import { TodoItem as TodoItemComponent } from './TodoItem';
import { ProjectInput } from './ProjectInput';
import { CheckSquare, Folder, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';

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
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      return loadProjects();
    } catch {
      return [];
    }
  });
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(() => {
    try {
      const loadedProjects = loadProjects();
      return new Set(loadedProjects.map(p => p.id));
    } catch {
      return new Set();
    }
  });
  
  // Use refs to track if we're updating from an event to prevent save loops
  const isUpdatingFromEvent = useRef<boolean>(false);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load todos and projects from localStorage on mount and when timer starts
  const loadInitialData = () => {
    const loadedTodos = loadTodos();
    const loadedProjects = loadProjects();
    
    // Always update state, even if it seems the same, to ensure fresh data
    setTodos(loadedTodos);
    setProjects(loadedProjects);
    // Expand all projects by default
    setExpandedProjects(new Set(loadedProjects.map(p => p.id)));
  };
  
  // Expose reload function for manual refresh (can be called via ref if needed)
  const reloadData = () => {
    loadInitialData();
  };

  // Load todos and projects from localStorage on mount
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

    const handleProjectsUpdated = (e: CustomEvent<Project[]>) => {
      if (e.detail && Array.isArray(e.detail)) {
        // Only update if the data actually changed to prevent unnecessary re-renders
        setProjects((prevProjects) => {
          const prevSorted = [...prevProjects].sort((a, b) => a.id.localeCompare(b.id));
          const newSorted = [...e.detail].sort((a, b) => a.id.localeCompare(b.id));
          const prevStr = JSON.stringify(prevSorted);
          const newStr = JSON.stringify(newSorted);
          
          if (prevStr !== newStr) {
            return e.detail;
          }
          return prevProjects;
        });
        setExpandedProjects((prev) => {
          const newSet = new Set(prev);
          e.detail.forEach(p => newSet.add(p.id));
          return newSet;
        });
      }
    };

    window.addEventListener('todosUpdated', handleTodosUpdated as EventListener);
    window.addEventListener('projectsUpdated', handleProjectsUpdated as EventListener);
    
    return () => {
      window.removeEventListener('todosUpdated', handleTodosUpdated as EventListener);
      window.removeEventListener('projectsUpdated', handleProjectsUpdated as EventListener);
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

  // Save projects to localStorage whenever projects change
  useEffect(() => {
    // Always save, even if empty
    saveProjects(projects);
  }, [projects]);

  // Track timer session start time
  useEffect(() => {
    if (isTimerActive && sessionId > 0) {
      setSessionStartTime(Date.now());
    }
  }, [sessionId, isTimerActive]);

  const handleAddTodo = (text: string, projectId?: string) => {
    const newTodo = createTodo(text, projectId);
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    // Expand the project if a task was added to it
    if (projectId && !expandedProjects.has(projectId)) {
      setExpandedProjects((prev) => {
        const newSet = new Set(prev);
        newSet.add(projectId);
        return newSet;
      });
    }
  };

  const handleAddProject = (name: string) => {
    const newProject = createProject(name);
    setProjects((prevProjects) => [...prevProjects, newProject]);
    setExpandedProjects((prev) => {
      const newSet = new Set(prev);
      newSet.add(newProject.id);
      return newSet;
    });
  };

  const handleDeleteProject = (projectId: string) => {
    // Remove projectId from todos
    const updatedTodos = deleteProjectFromTodos(projectId, todos);
    setTodos(updatedTodos);
    // Remove project
    setProjects((prevProjects) => prevProjects.filter(p => p.id !== projectId));
    setExpandedProjects((prev) => {
      const newSet = new Set(prev);
      newSet.delete(projectId);
      return newSet;
    });
  };

  const toggleProjectExpansion = (projectId: string) => {
    setExpandedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  // Handle drag end for reordering todos
  const handleDragEnd = (event: DragEndEvent, groupId: string, isCompleted: boolean) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Find the dragged todo to determine its group
    const draggedTodo = todos.find((t) => t.id === active.id);
    if (!draggedTodo) return;

    // Determine which todos belong to this group
    const groupTodos = todos.filter((t) => {
      const sameProject = groupId === 'none' 
        ? !t.projectId 
        : t.projectId === groupId;
      return sameProject && t.completed === isCompleted;
    });

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

  // Separate todos by project
  const todosByProject = new Map<string, TodoItem[]>();
  const todosWithoutProject: TodoItem[] = [];

  todos.forEach(todo => {
    if (todo.projectId) {
      if (!todosByProject.has(todo.projectId)) {
        todosByProject.set(todo.projectId, []);
      }
      todosByProject.get(todo.projectId)!.push(todo);
    } else {
      todosWithoutProject.push(todo);
    }
  });

  // Sort projects
  const sortedProjects = [...projects].sort((a, b) => a.name.localeCompare(b.name));

  // Helper to separate active and completed todos
  const separateTodos = (todoList: TodoItem[]) => {
    const active = todoList.filter(t => !t.completed).sort((a, b) => b.order - a.order);
    const completed = todoList.filter(t => t.completed).sort((a, b) => b.order - a.order);
    return { active, completed };
  };

  const { active: activeTodosWithoutProject, completed: completedTodosWithoutProject } = separateTodos(todosWithoutProject);
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

      {/* Project Input */}
      <div className="mb-4">
        <ProjectInput onAddProject={handleAddProject} disabled={false} />
      </div>

      {/* Todo Input */}
      <div className="mb-4">
        <TodoInput 
          onAddTodo={handleAddTodo} 
          projects={projects}
          disabled={false} 
        />
      </div>

      {/* Todo List */}
      {todos.length === 0 && projects.length === 0 ? (
        <div className="text-center py-8 text-white/90 drop-shadow-md" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)' }}>
          <CheckSquare className="w-12 h-12 mx-auto mb-2 opacity-70" />
          <p>No tasks yet. Create a project or add a task above to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Projects */}
          {sortedProjects.map((project) => {
            const projectTodos = todosByProject.get(project.id) || [];
            const { active, completed } = separateTodos(projectTodos);
            const isExpanded = expandedProjects.has(project.id);
            const hasTodos = projectTodos.length > 0;

            return (
              <div key={project.id} className="border border-white/30 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg">
                {/* Project Header */}
                <div className="flex items-center gap-2 p-3 hover:bg-white/80 dark:hover:bg-gray-700/50 rounded-t-lg">
                  <button
                    onClick={() => toggleProjectExpansion(project.id)}
                    className="flex items-center gap-2 flex-1 text-left"
                    disabled={!hasTodos}
                  >
                    {hasTodos ? (
                      isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                    <Folder className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{project.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({active.length} active{completed.length > 0 && `, ${completed.length} completed`})
                    </span>
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    aria-label={`Delete project ${project.name}`}
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>

                {/* Project Tasks */}
                {isExpanded && hasTodos && (
                  <div className="px-3 pb-3 space-y-3">
                    {/* Active Tasks */}
                    {active.length > 0 && (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(e) => handleDragEnd(e, project.id, false)}
                      >
                        <SortableContext
                          items={active.map((t) => t.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="max-h-48 overflow-y-auto space-y-1">
                            {active.map((todo) => (
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
                    {completed.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 px-1">
                          Completed
                        </h4>
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={(e) => handleDragEnd(e, project.id, true)}
                        >
                          <SortableContext
                            items={completed.map((t) => t.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="max-h-32 overflow-y-auto space-y-1">
                              {completed.map((todo) => (
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
                )}
              </div>
            );
          })}

          {/* Tasks without Project */}
          {(activeTodosWithoutProject.length > 0 || completedTodosWithoutProject.length > 0) && (
            <div className="border border-white/30 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg">
              <div className="p-3 border-b border-white/30 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  No Project ({activeTodosWithoutProject.length} active
                  {completedTodosWithoutProject.length > 0 && `, ${completedTodosWithoutProject.length} completed`})
                </h3>
              </div>
              <div className="p-3 space-y-3">
                {/* Active Tasks */}
                {activeTodosWithoutProject.length > 0 && (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(e) => handleDragEnd(e, 'none', false)}
                  >
                    <SortableContext
                      items={activeTodosWithoutProject.map((t) => t.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="max-h-48 overflow-y-auto space-y-1">
                        {activeTodosWithoutProject.map((todo) => (
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
                {completedTodosWithoutProject.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 px-1">
                      Completed
                    </h4>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={(e) => handleDragEnd(e, 'none', true)}
                    >
                      <SortableContext
                        items={completedTodosWithoutProject.map((t) => t.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {completedTodosWithoutProject.map((todo) => (
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
      )}
    </div>
  );
};
