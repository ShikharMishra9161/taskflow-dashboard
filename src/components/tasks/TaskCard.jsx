import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  MoreVertical,
  GripVertical
} from 'lucide-react';
import { PriorityBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { useProject } from '../../context/ProjectContext';
import { getRelativeDueDate, isOverdue } from '../../utils/dateUtils';

export function TaskCard({ 
  task, 
  onClick, 
  onToggleComplete, 
  showProject = true, 
  isDragging = false,
  dragHandleProps = null 
}) {
  const { getProjectById, getMemberById } = useProject();

  const project = getProjectById(task.projectId);
  const assignee = getMemberById(task.assigneeId);
  const isCompleted = task.status === 'completed';
  const dueInfo = getRelativeDueDate(task.dueDate, task.status);
  const overdue = isOverdue(task.dueDate, task.status);

  const completedSubtasks = (task.subtasks || []).filter(st => st.completed).length;
  const totalSubtasks = (task.subtasks || []).length;

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white dark:bg-[#121520] rounded-xl border p-3.5 transition-all duration-150 cursor-pointer select-none ${
        isDragging
          ? 'shadow-2xl border-indigo-500/80 ring-2 ring-indigo-500/30 scale-[1.02] opacity-95 z-50'
          : 'border-slate-200/80 dark:border-[#1e2334] hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-card'
      }`}
    >
      {/* Top Header: Project Tag + Priority Badge + Drag Handle */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {dragHandleProps && (
            <div 
              {...dragHandleProps} 
              className="p-1 -ml-1 text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 cursor-grab active:cursor-grabbing rounded"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="w-3.5 h-3.5" />
            </div>
          )}

          {showProject && project && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-50 dark:bg-[#181c2a] text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800 truncate max-w-[140px]">
              <span 
                className="w-1.5 h-1.5 rounded-full shrink-0" 
                style={{ backgroundColor: project.color || '#6366f1' }}
              />
              <span className="truncate">{project.name}</span>
            </span>
          )}
        </div>

        <PriorityBadge priority={task.priority} />
      </div>

      {/* Title & Complete Checkbox */}
      <div className="flex items-start gap-2.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleComplete) onToggleComplete(task);
          }}
          className="mt-0.5 shrink-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
          ) : (
            <Circle className="w-4 h-4 text-slate-300 hover:text-slate-500 dark:text-slate-600" />
          )}
        </button>

        <h4 className={`text-xs sm:text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100 flex-1 line-clamp-2 ${
          isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
        }`}>
          {task.title}
        </h4>
      </div>

      {/* Description Snippet (optional) */}
      {task.description && (
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 pl-6.5 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Tags / Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1 pl-6.5">
          {task.labels.slice(0, 3).map(l => (
            <span key={l} className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#181c2a] text-slate-600 dark:text-slate-400">
              #{l}
            </span>
          ))}
          {task.labels.length > 3 && (
            <span className="text-[10px] text-slate-400">
              +{task.labels.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer Info: Subtask count, Due date, Assignee */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#1a1f30] flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2.5">
          {totalSubtasks > 0 && (
            <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${
              completedSubtasks === totalSubtasks ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
            }`}>
              <CheckSquare className="w-3 h-3" />
              <span>{completedSubtasks}/{totalSubtasks}</span>
            </span>
          )}

          {task.dueDate && (
            <span className={`inline-flex items-center gap-1 text-[11px] ${dueInfo.color}`}>
              <CalendarIcon className="w-3 h-3" />
              <span>{dueInfo.label}</span>
            </span>
          )}
        </div>

        <Avatar user={assignee} size="xs" />
      </div>
    </div>
  );
}
