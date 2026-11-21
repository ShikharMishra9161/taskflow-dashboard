import React, { useState } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  closestCorners 
} from '@dnd-kit/core';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from '../tasks/TaskCard';
import { useProject } from '../../context/ProjectContext';

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: '#94a3b8' },
  { id: 'in-progress', title: 'In Progress', color: '#3b82f6' },
  { id: 'in-review', title: 'In Review', color: '#a855f7' },
  { id: 'completed', title: 'Completed', color: '#10b981' }
];

export function KanbanBoard({ filteredTasks = null }) {
  const { tasks: allTasks, moveTask } = useProject();
  const [activeTask, setActiveTask] = useState(null);

  const tasks = filteredTasks || allTasks;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5 // Avoid dragging when simply clicking
      }
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Check if dropped directly on a column
    const isColumn = COLUMNS.some(c => c.id === overId);
    if (isColumn) {
      moveTask(activeId, overId);
      return;
    }

    // Dropped on another task -> find that task's column
    const overTask = tasks.find(t => t.id === overId);
    if (overTask && overTask.status) {
      moveTask(activeId, overTask.status);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2">
        {COLUMNS.map(column => {
          const columnTasks = tasks.filter(t => t.status === column.id);
          return (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={columnTasks}
            />
          );
        })}
      </div>

      {/* Floating Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <div className="w-72 sm:w-80">
            <TaskCard task={activeTask} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
