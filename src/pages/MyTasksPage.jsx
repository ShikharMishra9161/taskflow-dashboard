import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  ArrowUpDown, 
  Circle, 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  Trash2, 
  Edit2,
  FolderKanban
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { TaskCard } from '../components/tasks/TaskCard';
import { formatShortDate, getRelativeDueDate, isOverdue } from '../utils/dateUtils';

export function MyTasksPage() {
  const { 
    tasks, 
    projects, 
    moveTask, 
    deleteTask, 
    openCreateTaskModal, 
    openEditTaskModal, 
    getProjectById, 
    getMemberById 
  } = useProject();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate' | 'priority' | 'title'
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

  const [taskToDelete, setTaskToDelete] = useState(null);

  // Priority ranking for sorting
  const priorityRank = { urgent: 4, high: 3, medium: 2, low: 1 };

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesProject = projectFilter === 'all' || t.projectId === projectFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === 'priority') {
      return (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0);
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const handleToggleComplete = (task) => {
    const nextStatus = task.status === 'completed' ? 'todo' : 'completed';
    moveTask(task.id, nextStatus);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1a1f30]">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>My Tasks</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {sortedTasks.length} tasks
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track, filter, and complete assignments across all workspace initiatives.
          </p>
        </div>

        <button
          onClick={() => openCreateTaskModal()}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-glow transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-[#111420] p-3 rounded-2xl border border-slate-200/80 dark:border-[#1e2334] shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks by title, keyword..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-[#161a26] border border-slate-200 dark:border-[#22283a] text-slate-900 dark:text-white placeholder-slate-400 outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Select Dropdowns & View Mode */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-[#161a26] border border-slate-200 dark:border-[#22283a] text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="in-review">In Review</option>
              <option value="completed">Completed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-[#161a26] border border-slate-200 dark:border-[#22283a] text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Project Filter */}
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-[#161a26] border border-slate-200 dark:border-[#22283a] text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            {/* Sort Filter */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-[#161a26] border border-slate-200 dark:border-[#22283a] text-slate-700 dark:text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent outline-hidden"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>

            {/* List / Grid Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-[#161a26] p-1 rounded-xl shrink-0">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-slate-600 dark:text-slate-400 ${
                  viewMode === 'list' ? 'bg-white dark:bg-[#1f2538] text-indigo-600 dark:text-indigo-400 shadow-xs' : ''
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-slate-600 dark:text-slate-400 ${
                  viewMode === 'grid' ? 'bg-white dark:bg-[#1f2538] text-indigo-600 dark:text-indigo-400 shadow-xs' : ''
                }`}
                title="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task List / Grid Display */}
      {sortedTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found"
          description="No tasks match the active search or filters. Create a new task or adjust your criteria."
          actionLabel="Create Task"
          onAction={() => openCreateTaskModal()}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => openEditTaskModal(task)}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </div>
      ) : (
        /* Linear-style List View */
        <div className="bg-white dark:bg-[#111420] rounded-2xl border border-slate-200/80 dark:border-[#1e2334] overflow-hidden shadow-card">
          <div className="divide-y divide-slate-100 dark:divide-[#1a1f30]">
            {sortedTasks.map(task => {
              const project = getProjectById(task.projectId);
              const assignee = getMemberById(task.assigneeId);
              const isCompleted = task.status === 'completed';
              const dueInfo = getRelativeDueDate(task.dueDate, task.status);

              return (
                <div
                  key={task.id}
                  onClick={() => openEditTaskModal(task)}
                  className="p-3.5 sm:px-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-[#151926] transition-colors cursor-pointer group"
                >
                  {/* Left: Complete Checkbox + Title + Project Pill */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleComplete(task);
                      }}
                      className="shrink-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 hover:text-slate-500" />
                      )}
                    </button>

                    <span className={`text-xs sm:text-sm font-semibold truncate ${
                      isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'
                    }`}>
                      {task.title}
                    </span>

                    {project && (
                      <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-[#181c2a] text-slate-600 dark:text-slate-300 shrink-0">
                        <span 
                          className="w-1.5 h-1.5 rounded-full shrink-0" 
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="truncate max-w-[120px]">{project.name}</span>
                      </span>
                    )}
                  </div>

                  {/* Right: Status + Priority + Due Date + Assignee + Delete */}
                  <div className="flex items-center gap-3 sm:gap-4 shrink-0 text-xs">
                    <StatusBadge status={task.status} className="hidden sm:inline-flex" />
                    <PriorityBadge priority={task.priority} />

                    {task.dueDate && (
                      <span className={`hidden md:inline-flex items-center gap-1 text-[11px] ${dueInfo.color}`}>
                        <CalendarIcon className="w-3 h-3" />
                        <span>{dueInfo.label}</span>
                      </span>
                    )}

                    <Avatar user={assignee} size="xs" />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTaskToDelete(task);
                      }}
                      className="p-1 rounded text-slate-300 hover:text-rose-600 dark:text-slate-600 dark:hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (taskToDelete) {
            deleteTask(taskToDelete.id);
            setTaskToDelete(null);
          }
        }}
        title="Delete Task?"
        message={`Are you sure you want to delete "${taskToDelete?.title}"?`}
        confirmText="Delete"
        isDanger={true}
      />
    </div>
  );
}
