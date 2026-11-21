import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FolderKanban, 
  Kanban, 
  Calendar, 
  BarChart3, 
  Settings, 
  Layers, 
  ChevronRight, 
  X,
  Plus
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { Avatar } from '../common/Avatar';

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { stats, userProfile, openCreateProjectModal, projects } = useProject();

  const navItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { 
      name: 'My Tasks', 
      path: '/tasks', 
      icon: CheckSquare,
      badge: stats.pendingTasks > 0 ? stats.pendingTasks : null,
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
    },
    { 
      name: 'Projects', 
      path: '/projects', 
      icon: FolderKanban,
      badge: stats.totalProjects,
      badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
    },
    { name: 'Kanban Board', path: '/kanban', icon: Kanban },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#0E111A] border-r border-slate-200/80 dark:border-[#1c2233] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 dark:border-[#1a1f30]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-glow">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                TaskFlow
              </span>
              <span className="ml-1.5 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                PRO
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Quick Indicator */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#141824] border border-slate-200/60 dark:border-[#1e2436] text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-slate-700 dark:text-slate-200 truncate">
                {userProfile.workspace}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">v2.4</span>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Workspace
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#151926]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                  <span>{item.name}</span>
                </div>

                {item.badge !== null && item.badge !== undefined && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 dark:bg-slate-800'}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* Quick Projects List */}
          <div className="pt-5 px-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Active Projects
            </span>
            <button
              onClick={openCreateProjectModal}
              title="Add Project"
              className="p-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5 pt-1">
            {projects.slice(0, 4).map(p => (
              <NavLink
                key={p.id}
                to={`/projects?id=${p.id}`}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#151926] hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <span 
                  className="w-2 h-2 rounded-full shrink-0" 
                  style={{ backgroundColor: p.color || '#6366f1' }}
                />
                <span className="truncate">{p.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User Profile Mini Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-[#1a1f30]">
          <NavLink
            to="/settings"
            onClick={() => {
              if (window.innerWidth < 1024) onClose();
            }}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#151926] transition-colors group"
          >
            <Avatar user={userProfile} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {userProfile.name}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {userProfile.role}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </NavLink>
        </div>
      </aside>
    </>
  );
}
