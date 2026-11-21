import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { CommandPalette } from './CommandPalette';
import { TaskModal } from '../tasks/TaskModal';
import { ProjectModal } from '../projects/ProjectModal';
import { useProject } from '../../context/ProjectContext';

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { 
    isTaskModalOpen, 
    setIsTaskModalOpen, 
    taskModalData, 
    isProjectModalOpen, 
    setIsProjectModalOpen, 
    projectModalData 
  } = useProject();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090b10] flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette />

      {/* Global Task Creation/Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={taskModalData}
      />

      {/* Global Project Creation/Edit Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        project={projectModalData}
      />
    </div>
  );
}
