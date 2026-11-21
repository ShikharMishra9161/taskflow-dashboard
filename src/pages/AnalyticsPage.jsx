import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Layers,
  PieChart as PieIcon
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { StatCard } from '../components/common/StatCard';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

export function AnalyticsPage() {
  const { stats, tasks, projects } = useProject();

  // 1. Task Status Distribution Data
  const statusData = [
    { name: 'Completed', value: stats.completedTasks, color: '#10b981' },
    { name: 'In Progress', value: stats.inProgressTasks, color: '#6366f1' },
    { name: 'In Review', value: stats.inReviewTasks, color: '#a855f7' },
    { name: 'To Do', value: stats.todoTasks, color: '#94a3b8' }
  ].filter(d => d.value > 0);

  // 2. Priority Distribution Data
  const priorityCounts = {
    urgent: tasks.filter(t => t.priority === 'urgent').length,
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length,
  };

  const priorityData = [
    { priority: 'Urgent', count: priorityCounts.urgent, fill: '#f43f5e' },
    { priority: 'High', count: priorityCounts.high, fill: '#f97316' },
    { priority: 'Medium', count: priorityCounts.medium, fill: '#f59e0b' },
    { priority: 'Low', count: priorityCounts.low, fill: '#94a3b8' }
  ];

  // 3. Project Completion Rates Data
  const projectCompletionData = projects.map(p => {
    const pTasks = tasks.filter(t => t.projectId === p.id);
    const completed = pTasks.filter(t => t.status === 'completed').length;
    const total = pTasks.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      name: p.name.length > 18 ? p.name.slice(0, 16) + '...' : p.name,
      rate,
      completed,
      total,
      color: p.color
    };
  });

  // 4. Tasks Completed Over Time (Historical trend simulation)
  const timelineData = [
    { date: 'Nov 1', completed: 1, open: 4 },
    { date: 'Nov 5', completed: 3, open: 6 },
    { date: 'Nov 9', completed: 5, open: 7 },
    { date: 'Nov 13', completed: 8, open: 9 },
    { date: 'Nov 17', completed: 12, open: 8 },
    { date: 'Nov 21', completed: stats.completedTasks, open: stats.pendingTasks },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-[#1a1f30]">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>Analytics & Performance</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            Real-time
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Quantitative telemetry, task completion velocity, and delivery analytics.
        </p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Completion"
          value={`${stats.completionRate}%`}
          icon={CheckCircle2}
          color="emerald"
          subtitle={`${stats.completedTasks} of ${stats.totalTasks} total tasks`}
        />
        <StatCard
          title="Active Projects"
          value={stats.totalProjects}
          icon={Layers}
          color="indigo"
          subtitle="All projects on track"
        />
        <StatCard
          title="High/Urgent Priority"
          value={stats.highPriorityTasks}
          icon={AlertTriangle}
          color="rose"
          subtitle="Critical path initiatives"
        />
        <StatCard
          title="Cycle Velocity"
          value="4.2d"
          icon={TrendingUp}
          color="purple"
          subtitle="Average time to resolution"
        />
      </div>

      {/* Charts Grid Row 1: Time Series & Status Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111420] rounded-2xl border border-slate-200/80 dark:border-[#1e2334] p-5 shadow-card">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Cumulative Velocity Over Time
            </h3>
            <p className="text-xs text-slate-400">
              Tracking tasks completed vs active backlog
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="areaOpen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#131622',
                    borderColor: '#22283a',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
                <Area type="monotone" dataKey="completed" name="Completed" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#areaCompleted)" />
                <Area type="monotone" dataKey="open" name="Open Backlog" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#areaOpen)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Donut */}
        <div className="bg-white dark:bg-[#111420] rounded-2xl border border-slate-200/80 dark:border-[#1e2334] p-5 shadow-card flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Task Status Distribution
            </h3>
            <p className="text-xs text-slate-400">
              Breakdown across workflow columns
            </p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#131622',
                    borderColor: '#22283a',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-[#1a1f30]">
            {statusData.map(item => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-400 truncate">{item.name}:</span>
                <span className="font-bold text-slate-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Grid Row 2: Priority Breakdown & Project Completion Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Breakdown Bar Chart */}
        <div className="bg-white dark:bg-[#111420] rounded-2xl border border-slate-200/80 dark:border-[#1e2334] p-5 shadow-card">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Task Priority Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              Work items segmented by urgency level
            </p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="priority" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#131622',
                    borderColor: '#22283a',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="count" name="Total Tasks" radius={[6, 6, 0, 0]}>
                  {priorityData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Completion Progress */}
        <div className="bg-white dark:bg-[#111420] rounded-2xl border border-slate-200/80 dark:border-[#1e2334] p-5 shadow-card">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Project Completion Rates
            </h3>
            <p className="text-xs text-slate-400">
              Percentage of finished deliverables per initiative
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {projectCompletionData.map(p => (
              <div key={p.name}>
                <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
                  <span className="text-slate-800 dark:text-slate-200 truncate">{p.name}</span>
                  <span className="text-slate-500 dark:text-slate-400">{p.rate}% ({p.completed}/{p.total})</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${p.rate}%`, backgroundColor: p.color || '#6366f1' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
