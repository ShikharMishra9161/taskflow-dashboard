import React from 'react';
import { Modal } from '../common/Modal';
import { useProject } from '../../context/ProjectContext';
import { TaskCard } from '../tasks/TaskCard';
import { Avatar } from '../common/Avatar';
import { formatShortDate } from '../../utils/dateUtils';
import { CheckSquare, Calendar, Plus, Edit2, Trash2 } from 'lucide-react';

export function ProjectDetailModal({ isOpen, onClose, project, onEdit, onDelete }) {
  const { tasks, getMemberById, openCreateTaskModal, openEditTaskModal, moveTask } = useProject();

  if (!project) return null;

  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
  const totalTasks = projectTasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const lead = getMemberById(project.leadId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project.name}
      description={project.category}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Description & Metadata */}
        <div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {project.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Lead:</span>
              {lead && <Avatar user={lead} size="xs" />}
              <span>{lead?.name || 'Unassigned'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Target: {formatShortDate(project.deadline)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: project.color }}
              />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Status:</span>
              <span>{project.status}</span>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#161a26] border border-slate-200/80 dark:border-[#202638]">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-700 dark:text-slate-300">Task Completion Rate</span>
            <span className="text-slate-900 dark:text-white">{progressPercent}% ({completedTasks}/{totalTasks})</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%`, backgroundColor: project.color || '#6366f1' }}
            />
          </div>
        </div>

        {/* Associated Tasks Header & List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tasks in this project ({projectTasks.length})
            </h4>
            <button
              type="button"
              onClick={() => {
                onClose();
                openCreateTaskModal({ projectId: project.id });
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Task
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {projectTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center italic">
                No tasks assigned to this project yet.
              </p>
            ) : (
              projectTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  showProject={false}
                  onClick={() => {
                    onClose();
                    openEditTaskModal(task);
                  }}
                  onToggleComplete={(t) => {
                    const next = t.status === 'completed' ? 'todo' : 'completed';
                    moveTask(t.id, next);
                  }}
                />
              ))
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-[#1e2334]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(project);
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Project
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete(project);
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
