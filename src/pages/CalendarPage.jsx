import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  FolderKanban,
  CheckCircle2
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { PriorityBadge } from '../components/common/Badge';

export function CalendarPage() {
  const { tasks, projects, openCreateTaskModal, openEditTaskModal } = useProject();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedProjectId, setSelectedProjectId] = useState('all');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Navigate months
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Generate day cells
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarDays = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      day: prevMonthDays - i,
      dateString: null,
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(i).padStart(2, '0');
    const dateString = `${year}-${formattedMonth}-${formattedDay}`;

    calendarDays.push({
      day: i,
      dateString,
      isCurrentMonth: true
    });
  }

  // Remaining padding for 6x7 grid (42 cells)
  const remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({
      day: i,
      dateString: null,
      isCurrentMonth: false
    });
  }

  const todayString = new Date().toISOString().split('T')[0];

  // Filter tasks by project
  const filteredTasks = tasks.filter(t => 
    selectedProjectId === 'all' || t.projectId === selectedProjectId
  );

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1a1f30]">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Calendar</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {monthNames[month]} {year}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monthly schedule of deliverable deadlines and project milestones.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Project Filter */}
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-[#161a26] border border-slate-200 dark:border-[#22283a] text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Month Navigation */}
          <div className="flex items-center gap-1 bg-white dark:bg-[#111420] p-1 rounded-xl border border-slate-200/80 dark:border-[#1e2334] shadow-xs">
            <button
              onClick={prevMonth}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToToday}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white dark:bg-[#111420] rounded-2xl border border-slate-200/80 dark:border-[#1e2334] shadow-card overflow-hidden">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-slate-100 dark:border-[#1a1f30] bg-slate-50/60 dark:bg-[#0e111a] text-center text-xs font-semibold uppercase tracking-wider text-slate-400 py-3">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-[#1a1f30]">
          {calendarDays.map((cell, idx) => {
            const dayTasks = cell.dateString
              ? filteredTasks.filter(t => t.dueDate === cell.dateString)
              : [];

            const isToday = cell.dateString === todayString;

            return (
              <div
                key={idx}
                onClick={() => {
                  if (cell.isCurrentMonth && cell.dateString) {
                    openCreateTaskModal({ dueDate: cell.dateString });
                  }
                }}
                className={`min-h-[105px] p-2 transition-colors group cursor-pointer flex flex-col justify-between ${
                  !cell.isCurrentMonth
                    ? 'bg-slate-50/40 dark:bg-[#0c0e14]/40 text-slate-300 dark:text-slate-700 pointer-events-none'
                    : 'hover:bg-slate-50/70 dark:hover:bg-[#151926]'
                } ${isToday ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''}`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : cell.isCurrentMonth
                        ? 'text-slate-800 dark:text-slate-200 group-hover:text-indigo-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {cell.day}
                  </span>

                  {cell.isCurrentMonth && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openCreateTaskModal({ dueDate: cell.dateString });
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-opacity"
                      title="Add task on this day"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Day Tasks Stack */}
                <div className="space-y-1 flex-1 overflow-y-auto max-h-20">
                  {dayTasks.slice(0, 3).map(task => {
                    const isCompleted = task.status === 'completed';
                    return (
                      <div
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditTaskModal(task);
                        }}
                        className={`px-1.5 py-0.5 rounded text-[11px] font-medium truncate flex items-center gap-1 border transition-all ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 line-through'
                            : task.priority === 'urgent'
                            ? 'bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-300'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-950/40 dark:text-indigo-300'
                        }`}
                        title={task.title}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                        <span className="truncate">{task.title}</span>
                      </div>
                    );
                  })}
                  {dayTasks.length > 3 && (
                    <span className="text-[10px] text-slate-400 font-semibold pl-1">
                      +{dayTasks.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
