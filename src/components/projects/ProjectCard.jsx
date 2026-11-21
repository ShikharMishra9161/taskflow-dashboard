import React from 'react';
import { Calendar, CheckSquare, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { AvatarGroup, Avatar } from '../common/Avatar';
import { useProject } from '../../context/ProjectContext';
import { formatShortDate } from '../../utils/dateUtils';

export function ProjectCard({ project, onSelect, onEdit, onDelete }) {
  const { tasks, members, getMemberById } = useProject();

  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
  const totalTasks = projectTasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const lead = getMemberById(project.leadId);
  const projectMembers = (project.members || []).map(id => getMemberById(id)).filter(Boolean);

  return (
    <div
      onClick={onSelect}
      className="group relative bg-white dark:bg-[#111420] rounded-2xl border border-slate-200/80 dark:border-[#1e2334] p-5 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Accent Pill + Actions Menu */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-md shadow-xs" 
              style={{ backgroundColor: project.color || '#6366f1' }}
            />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {project.category || 'General'}
            </span>
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(project)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit Project"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(project)}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Delete Project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Project Title & Description */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {project.name}
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {project.description || 'No description provided.'}
        </p>
      </div>

      <div className="mt-5 space-y-3.5">
        {/* Progress Bar & Stats */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{completedTasks} of {totalTasks} tasks completed</span>
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {progressPercent}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${progressPercent}%`, 
                backgroundColor: project.color || '#6366f1' 
              }}
            />
          </div>
        </div>

        {/* Footer: Deadline & Team Avatar Group */}
        <div className="pt-3 border-t border-slate-100 dark:border-[#1a1f30] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Due {formatShortDate(project.deadline) || 'No deadline'}</span>
          </div>

          <div className="flex items-center gap-2">
            <AvatarGroup users={projectMembers.length > 0 ? projectMembers : (lead ? [lead] : [])} size="xs" />
          </div>
        </div>
      </div>
    </div>
  );
}
