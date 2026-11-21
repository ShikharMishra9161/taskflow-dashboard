import React, { useState } from 'react';
import { 
  Kanban as KanbanIcon, 
  Plus, 
  Search, 
  Filter, 
  FolderKanban,
  AlertCircle
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { KanbanBoard } from '../components/kanban/KanbanBoard';

export function KanbanPage() {
  const { tasks, projects, openCreateTaskModal } = useProject();

  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [search, setSearch] = useState('');

  // Filter tasks for board
  const filteredTasks = tasks.filter(t => {
    const matchesProject = selectedProjectId === 'all' || t.projectId === selectedProjectId;
    const matchesPriority = selectedPriority === 'all' || t.priority === selectedPriority;
    const matchesSearch = 
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase());

    return matchesProject && matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1a1f30]">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Kanban Board</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {filteredTasks.length} tasks
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Drag and drop tasks across workflow columns to update real-time status.
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
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#111420] p-3 rounded-2xl border border-slate-200/80 dark:border-[#1e2334] shadow-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search board tasks..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-[#161a26] border border-slate-200 dark:border-[#22283a] text-slate-900 dark:text-white placeholder-slate-400 outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Project Selector & Priority Selector */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Project Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <FolderKanban className="w-3.5 h-3.5" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-[#161a26] border border-slate-200 dark:border-[#22283a] text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-[#161a26] border border-slate-200 dark:border-[#22283a] text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Kanban Board */}
      <div className="overflow-x-auto min-h-[550px]">
        <KanbanBoard filteredTasks={filteredTasks} />
      </div>
    </div>
  );
}
