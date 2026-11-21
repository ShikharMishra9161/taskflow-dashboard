import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanCard } from './KanbanCard';
import { Plus } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export function KanbanColumn({ column, tasks }) {
  const { openCreateTaskModal } = useProject();
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column
    }
  });

  const taskIds = tasks.map(t => t.id);

  return (
    <div 
      ref={setNodeRef}
      className={`flex flex-col w-72 sm:w-80 shrink-0 rounded-2xl bg-slate-100/70 dark:bg-[#0e111a] border transition-colors duration-150 p-3 ${
        isOver
          ? 'border-indigo-500/80 bg-indigo-50/20 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20'
          : 'border-slate-200/60 dark:border-[#1a1f30]'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-1 pb-3">
        <div className="flex items-center gap-2">
          <span 
            className="w-2.5 h-2.5 rounded-full" 
            style={{ backgroundColor: column.color }}
          />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            {column.title}
          </h3>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {tasks.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => openCreateTaskModal({ status: column.id })}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          title={`Add task to ${column.title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Droppable Task Cards Container */}
      <div className="flex-1 overflow-y-auto space-y-2.5 min-h-[150px] pr-0.5">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <KanbanCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="h-28 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-400">
            Drop task here
          </div>
        )}
      </div>

      {/* Quick Add Button at bottom */}
      <button
        type="button"
        onClick={() => openCreateTaskModal({ status: column.id })}
        className="mt-3 py-2 w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300/80 dark:border-slate-800 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:border-slate-400 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Task</span>
      </button>
    </div>
  );
}
