import React, { useRef, useEffect, useState } from 'react';
import { Project } from '../../utils/todoUtils';
import { Folder } from 'lucide-react';

interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId?: string;
  onSelectProject: (projectId?: string) => void;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
}) => {
  const selectRef = useRef<HTMLSelectElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [selectWidth, setSelectWidth] = useState<number>(120);

  const sortedProjects = [...projects].sort((a, b) => a.name.localeCompare(b.name));
  
  const selectedProject = sortedProjects.find(p => p.id === selectedProjectId);
  const displayText = selectedProject ? selectedProject.name : 'No Project';

  useEffect(() => {
    if (measureRef.current) {
      const width = measureRef.current.offsetWidth;
      // Add padding (px-3 = 12px on each side = 24px) plus extra for dropdown arrow (16px)
      setSelectWidth(Math.max(100, width + 40));
    }
  }, [displayText, selectedProjectId]);

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
        <Folder className="w-4 h-4" />
        <span>Project:</span>
      </label>
      <div className="relative inline-block">
        {/* Hidden span to measure text width */}
        <span
          ref={measureRef}
          className="absolute invisible whitespace-nowrap text-sm font-normal"
          style={{ 
            padding: '0.375rem 0.75rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem'
          }}
        >
          {displayText}
        </span>
        <select
          ref={selectRef}
          value={selectedProjectId || ''}
          onChange={(e) => onSelectProject(e.target.value || undefined)}
          style={{ width: `${selectWidth}px` }}
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     cursor-pointer pr-8"
          aria-label="Select project"
        >
          <option value="">No Project</option>
          {sortedProjects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
