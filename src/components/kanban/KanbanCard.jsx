import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskCard } from '../tasks/TaskCard';
import { useProject } from '../../context/ProjectContext';

export function KanbanCard({ task }) {
  const { openEditTaskModal, moveTask } = useProject();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskCard
        task={task}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
        onClick={() => openEditTaskModal(task)}
        onToggleComplete={(t) => {
          const next = t.status === 'completed' ? 'todo' : 'completed';
          moveTask(t.id, next);
        }}
      />
    </div>
  );
}
