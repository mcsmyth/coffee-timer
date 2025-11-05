import React, { useState, useEffect } from 'react';
import { 
  getTaskAnalytics, 
  getDayAnalytics, 
  getWeekAnalytics, 
  getMonthAnalytics,
  getTotalFocusTime,
  TaskAnalytics,
  DayAnalytics,
  WeekAnalytics,
  MonthAnalytics,
} from '../../utils/analyticsUtils';
import { formatTimeSpent } from '../../utils/todoUtils';
import { ArrowLeft, BarChart3, Calendar, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

type ViewType = 'task' | 'day' | 'week' | 'month';

interface AnalyticsViewProps {
  onBack: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onBack }) => {
  const [currentView, setCurrentView] = useState<ViewType>('task');
  const [taskData, setTaskData] = useState<TaskAnalytics[]>([]);
  const [dayData, setDayData] = useState<DayAnalytics[]>([]);
  const [weekData, setWeekData] = useState<WeekAnalytics[]>([]);
  const [monthData, setMonthData] = useState<MonthAnalytics[]>([]);
  const [totalFocusTime, setTotalFocusTime] = useState<number>(0);

  const refreshData = () => {
    setTaskData(getTaskAnalytics());
    setDayData(getDayAnalytics());
    setWeekData(getWeekAnalytics());
    setMonthData(getMonthAnalytics());
    setTotalFocusTime(getTotalFocusTime());
  };

  useEffect(() => {
    refreshData();
    // Refresh data every 5 seconds in case todos are updated
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatDateDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
    });
  };

  const formatWeekDisplay = (weekStart: string, weekEnd: string): string => {
    const start = new Date(weekStart);
    const end = new Date(weekEnd);
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    if (start.getMonth() === end.getMonth()) {
      return `${startStr} - ${end.getDate()}, ${end.getFullYear()}`;
    }
    return `${startStr} - ${endStr}, ${end.getFullYear()}`;
  };

  const renderTaskView = () => {
    if (taskData.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No completed tasks yet. Complete some tasks to see analytics!</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {taskData.map((task, index) => (
          <div
            key={task.taskName}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    #{index + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {task.taskName}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTimeSpent(task.totalTimeSpent)}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {task.completionCount} time{task.completionCount !== 1 ? 's' : ''}
                  </span>
                  {task.lastCompleted && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Last: {formatDateDisplay(new Date(task.lastCompleted).toISOString().split('T')[0])}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    if (dayData.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No focus time data available. Complete some tasks to see daily analytics!</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {dayData.map((day) => (
          <div
            key={day.date}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {formatDateDisplay(day.date)}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTimeSpent(day.totalTimeSpent)}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {day.taskCount} task{day.taskCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderWeekView = () => {
    if (weekData.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No focus time data available. Complete some tasks to see weekly analytics!</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {weekData.map((week) => (
          <div
            key={week.weekStart}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {formatWeekDisplay(week.weekStart, week.weekEnd)}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTimeSpent(week.totalTimeSpent)}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {week.taskCount} task{week.taskCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMonthView = () => {
    if (monthData.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No focus time data available. Complete some tasks to see monthly analytics!</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {monthData.map((month) => (
          <div
            key={month.month}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {month.monthName}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTimeSpent(month.totalTimeSpent)}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {month.taskCount} task{month.taskCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const tabs = [
    { id: 'task' as ViewType, label: 'Per Task', icon: CheckCircle2 },
    { id: 'day' as ViewType, label: 'Day', icon: Calendar },
    { id: 'week' as ViewType, label: 'Week', icon: Calendar },
    { id: 'month' as ViewType, label: 'Month', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Timer</span>
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Focus Time Analytics
            </h1>
          </div>
          
          {totalFocusTime > 0 && (
            <div className="flex items-center gap-2 text-lg text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-5 h-5" />
              <span>
                Total Focus Time: <strong className="text-gray-900 dark:text-gray-100">{formatTimeSpent(totalFocusTime)}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors border-b-2 ${
                  currentView === tab.id
                    ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {currentView === 'task' && renderTaskView()}
          {currentView === 'day' && renderDayView()}
          {currentView === 'week' && renderWeekView()}
          {currentView === 'month' && renderMonthView()}
        </div>
      </div>
    </div>
  );
};
