import React from 'react';
import { AlertCircle, AlertTriangle, ArrowDown, ArrowUp, CheckCircle, Clock } from 'lucide-react';

export function PriorityBadge({ priority, className = '' }) {
  const config = {
    urgent: {
      label: 'Urgent',
      icon: AlertCircle,
      classes: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/60'
    },
    high: {
      label: 'High',
      icon: ArrowUp,
      classes: 'bg-orange-50 text-orange-700 border-orange-200/80 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/60'
    },
    medium: {
      label: 'Medium',
      icon: AlertTriangle,
      classes: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60'
    },
    low: {
      label: 'Low',
      icon: ArrowDown,
      classes: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700/60'
    }
  };

  const curr = config[priority?.toLowerCase()] || config.medium;
  const Icon = curr.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${curr.classes} ${className}`}>
      <Icon className="w-3 h-3 shrink-0" />
      <span>{curr.label}</span>
    </span>
  );
}

export function StatusBadge({ status, className = '' }) {
  const config = {
    'todo': {
      label: 'To Do',
      classes: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700'
    },
    'in-progress': {
      label: 'In Progress',
      classes: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/60'
    },
    'in-review': {
      label: 'In Review',
      classes: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/60'
    },
    'completed': {
      label: 'Completed',
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60'
    }
  };

  const curr = config[status] || { label: status, classes: 'bg-slate-100 text-slate-700 border-slate-200' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${curr.classes} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{curr.label}</span>
    </span>
  );
}

export function TagBadge({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/80 dark:bg-[#161a26] dark:text-slate-300 dark:border-slate-800">
      <span>#{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-0.5"
          aria-label={`Remove tag ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
