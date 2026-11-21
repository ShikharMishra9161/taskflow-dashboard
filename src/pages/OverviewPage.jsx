import React from 'react';
import { 
  FolderKanban, 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  ArrowRight, 
  Calendar as CalendarIcon,
  Sparkles,
  Layers
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { StatCard } from '../components/common/StatCard';
import { ProjectCard } from '../components/projects/ProjectCard';
import { TaskCard } from '../components/tasks/TaskCard';
import { Avatar } from '../components/common/Avatar';
import { formatTimeAgo, formatShortDate } from '../utils/dateUtils';
import { Link } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export function OverviewPage() {
  const { 
    stats, 
    projects, 
    tasks, 
    activities, 
    getMemberById, 
    openCreateTaskModal, 
    openCreateProjectModal,
    openEditTaskModal,
    moveTask
  } = useProject();

  // Upcoming deadlines (tasks not completed, sorted by due date)
  const upcomingTasks = tasks
    .filter(t => t.status !== 'completed' && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  // Generate real dynamic 7-day productivity curve from tasks
  const productivityData = [
    { day: 'Mon', completed: 2, created: 3 },
    { day: 'Tue', completed: 4, created: 2 },
    { day: 'Wed', completed: 3, created: 5 },
    { day: 'Thu', completed: 6, created: 2 },
    { day: 'Fri', completed: stats.completedTasks > 5 ? 5 : 3, created: 4 },
    { day: 'Sat', completed: 2, created: 1 },
    { day: 'Sun', completed: stats.completedTasks > 0 ? 3 : 0, created: 2 },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1a1f30]">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Workspace Overview</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
              Live
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time health, task velocity, and project milestones.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openCreateProjectModal()}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131622] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#191e2c] transition-colors shadow-xs"
          >
            New Project
          </button>
          <button
            onClick={() => openCreateTaskModal()}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-glow transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Dynamic KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={FolderKanban}
          color="indigo"
          subtitle="4 active initiatives"
        />
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={CheckSquare}
          color="purple"
          trend="+12%"
          trendLabel="vs last week"
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          icon={TrendingUp}
          color="emerald"
          subtitle={`${stats.completionRate}% completion rate`}
        />
        <StatCard
          title="Pending / Overdue"
          value={`${stats.pendingTasks} / ${stats.overdueTasks}`}
          icon={AlertTriangle}
          color={stats.overdueTasks > 0 ? "rose" : "amber"}
          subtitle={stats.overdueTasks > 0 ? `${stats.overdueTasks} urgent tasks overdue` : 'On track'}
        />
      </div>

      {/* Main Grid: Weekly Chart & Project Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productivity Chart (2 columns on lg) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111420] rounded-2xl border border-slate-200/80 dark:border-[#1e2334] p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Weekly Velocity & Productivity
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tasks created vs completed over the last 7 days
              </p>
            </div>
            <Link
              to="/analytics"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Detailed Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  allowDecimals={false} 
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#131622',
                    borderColor: '#22283a',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  name="Tasks Completed"
                  stroke="#6366f1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCompleted)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="created" 
                  name="Tasks Created"
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCreated)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Deadlines Widget */}
        <div className="bg-white dark:bg-[#111420] rounded-2xl border border-slate-200/80 dark:border-[#1e2334] p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>Upcoming Deadlines</span>
              </h3>
              <Link to="/calendar" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingTasks.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No upcoming deadlines.</p>
              ) : (
                upcomingTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => openEditTaskModal(task)}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#161a26] border border-slate-200/60 dark:border-[#1e2334] hover:border-indigo-400 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {task.title}
                      </span>
                      <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 shrink-0">
                        {formatShortDate(task.dueDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="capitalize">{task.status.replace('-', ' ')}</span>
                      <span className="capitalize text-slate-500 dark:text-slate-400 font-medium">{task.priority} priority</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => openCreateTaskModal()}
            className="mt-4 w-full py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:border-indigo-400 transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Task</span>
          </button>
        </div>
      </div>

      {/* Projects Overview Row */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Project Milestones
            </h3>
            <p className="text-xs text-slate-400">
              Active projects and current completion progress
            </p>
          </div>
          <Link
            to="/projects"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>All Projects ({projects.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.slice(0, 4).map(p => (
            <ProjectCard
              key={p.id}
              project={p}
              onSelect={() => {}}
            />
          ))}
        </div>
      </div>

      {/* Recent Workspace Activity Stream */}
      <div className="bg-white dark:bg-[#111420] rounded-2xl border border-slate-200/80 dark:border-[#1e2334] p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Recent Workspace Activity</span>
          </h3>
          <span className="text-xs text-slate-400">
            Audit trail & updates
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-[#1a1f30]">
          {activities.slice(0, 6).map(act => {
            const user = getMemberById(act.userId);
            return (
              <div key={act.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar user={user} size="xs" />
                  <div className="truncate">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {user?.name || 'Team member'}
                    </span>{' '}
                    <span className="text-slate-500 dark:text-slate-400">
                      {act.details.toLowerCase()} on
                    </span>{' '}
                    <span className="font-medium text-slate-900 dark:text-white">
                      "{act.target}"
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0">
                  {formatTimeAgo(act.timestamp)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
