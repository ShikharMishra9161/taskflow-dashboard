import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Grid, 
  List, 
  Filter,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectDetailModal } from '../components/projects/ProjectDetailModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { AvatarGroup } from '../components/common/Avatar';
import { formatShortDate } from '../utils/dateUtils';

export function ProjectsPage() {
  const { 
    projects, 
    tasks, 
    deleteProject, 
    openCreateProjectModal, 
    openEditProjectModal,
    getMemberById 
  } = useProject();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const [selectedProject, setSelectedProject] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Filter projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ['All', 'Active', 'In Progress', 'In Planning', 'Completed'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1a1f30]">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Projects</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {filteredProjects.length}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize work streams, assign teams, and monitor deliverable completion.
          </p>
        </div>

        <button
          onClick={openCreateProjectModal}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-glow transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-[#111420] p-3 rounded-2xl border border-slate-200/80 dark:border-[#1e2334] shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name, category..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-[#161a26] border border-slate-200 dark:border-[#22283a] text-slate-900 dark:text-white placeholder-slate-400 outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Status Pill Filters & View Mode */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#161a26] p-1 rounded-xl">
            {statuses.map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-white dark:bg-[#1f2538] text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-[#161a26] p-1 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-slate-600 dark:text-slate-400 ${
                viewMode === 'grid' ? 'bg-white dark:bg-[#1f2538] text-indigo-600 dark:text-indigo-400 shadow-xs' : ''
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-slate-600 dark:text-slate-400 ${
                viewMode === 'list' ? 'bg-white dark:bg-[#1f2538] text-indigo-600 dark:text-indigo-400 shadow-xs' : ''
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects match your filter"
          description="Try clearing your search keyword or switching the status filter."
          actionLabel="Create Project"
          onAction={openCreateProjectModal}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={() => {
                setSelectedProject(project);
                setIsDetailOpen(true);
              }}
              onEdit={openEditProjectModal}
              onDelete={setProjectToDelete}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-[#111420] rounded-2xl border border-slate-200/80 dark:border-[#1e2334] overflow-hidden shadow-card">
          <div className="divide-y divide-slate-100 dark:divide-[#1a1f30]">
            {filteredProjects.map(project => {
              const projectTasks = tasks.filter(t => t.projectId === project.id);
              const completedCount = projectTasks.filter(t => t.status === 'completed').length;
              const totalCount = projectTasks.length;
              const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
              const membersList = (project.members || []).map(id => getMemberById(id)).filter(Boolean);

              return (
                <div
                  key={project.id}
                  onClick={() => {
                    setSelectedProject(project);
                    setIsDetailOpen(true);
                  }}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-[#151926] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span 
                      className="w-3.5 h-3.5 rounded-lg shrink-0 shadow-xs" 
                      style={{ backgroundColor: project.color }}
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {project.name}
                      </h4>
                      <p className="text-xs text-slate-400 truncate max-w-md">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 justify-between sm:justify-end shrink-0 text-xs">
                    <div className="w-28">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">{completedCount}/{totalCount} tasks</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{percent}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ width: `${percent}%`, backgroundColor: project.color }} 
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatShortDate(project.deadline)}</span>
                    </div>

                    <AvatarGroup users={membersList} size="xs" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      <ProjectDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        project={selectedProject}
        onEdit={openEditProjectModal}
        onDelete={setProjectToDelete}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(projectToDelete)}
        onClose={() => setProjectToDelete(null)}
        onConfirm={() => {
          if (projectToDelete) {
            deleteProject(projectToDelete.id);
            setProjectToDelete(null);
          }
        }}
        title="Delete Project?"
        message={`Are you sure you want to delete "${projectToDelete?.name}"? All associated tasks will also be permanently removed.`}
        confirmText="Delete Project"
        isDanger={true}
      />
    </div>
  );
}
