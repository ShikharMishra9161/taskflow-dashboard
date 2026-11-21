// Utility functions for dates and formatting

export function formatDate(dateString) {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function formatShortDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function isOverdue(dateString, status) {
  if (!dateString || status === 'completed') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateString);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

export function isDueToday(dateString) {
  if (!dateString) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateString);
  due.setHours(0, 0, 0, 0);
  return due.getTime() === today.getTime();
}

export function getRelativeDueDate(dateString, status) {
  if (!dateString) return { label: 'No date', color: 'text-slate-400' };
  if (status === 'completed') return { label: formatShortDate(dateString), color: 'text-slate-400' };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateString);
  due.setHours(0, 0, 0, 0);

  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      label: overdueDays === 1 ? '1 day overdue' : `${overdueDays}d overdue`,
      color: 'text-rose-600 dark:text-rose-400 font-medium'
    };
  }
  if (diffDays === 0) {
    return { label: 'Due today', color: 'text-amber-600 dark:text-amber-400 font-medium' };
  }
  if (diffDays === 1) {
    return { label: 'Tomorrow', color: 'text-indigo-600 dark:text-indigo-400' };
  }
  if (diffDays <= 7) {
    return { label: `In ${diffDays} days`, color: 'text-slate-600 dark:text-slate-300' };
  }

  return { label: formatShortDate(dateString), color: 'text-slate-500 dark:text-slate-400' };
}

export function formatTimeAgo(timestamp) {
  if (!timestamp) return 'just now';
  const now = new Date();
  const past = new Date(timestamp);
  const diffSec = Math.floor((now - past) / 1000);

  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatShortDate(timestamp);
}
