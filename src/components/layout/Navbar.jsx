import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Plus, 
  Menu, 
  Command, 
  Check, 
  Clock, 
  User, 
  Settings as SettingsIcon,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useProject } from '../../context/ProjectContext';
import { Avatar } from '../common/Avatar';
import { formatTimeAgo } from '../../utils/dateUtils';

export function Navbar({ onOpenSidebar }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { 
    openCreateTaskModal, 
    setIsCommandPaletteOpen, 
    userProfile, 
    activities 
  } = useProject();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut listener ('c' for create task, 'Cmd+K' for command palette)
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      } else if (e.key === 'c' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        openCreateTaskModal();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openCreateTaskModal, setIsCommandPaletteOpen]);

  // Map route path to human title
  const pageTitles = {
    '/': 'Overview',
    '/tasks': 'My Tasks',
    '/projects': 'Projects',
    '/kanban': 'Kanban Board',
    '/calendar': 'Calendar',
    '/analytics': 'Analytics',
    '/settings': 'Settings'
  };

  const currentTitle = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-[#0E111A]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-[#1c2233] px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400 hidden sm:inline">Workspace</span>
          <span className="text-xs text-slate-300 dark:text-slate-600 hidden sm:inline">/</span>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {currentTitle}
          </h1>
        </div>
      </div>

      {/* Right: Actions, Search, Notifications, Theme, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Button (Linear Style) */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#141824] border border-slate-200/80 dark:border-[#22283a] text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-all text-xs"
          title="Search anything (⌘K or Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Search tasks, projects...</span>
          <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-[#1d2232] border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-400">
            <Command className="w-2.5 h-2.5" /> K
          </span>
        </button>

        {/* Quick Create Task Button */}
        <button
          onClick={() => openCreateTaskModal()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm hover:shadow-glow transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Task</span>
          <span className="hidden lg:inline text-[10px] opacity-75 font-mono px-1 py-0.2 rounded bg-indigo-800/50">C</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#161a26] transition-colors"
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setIsNotificationsOpen(prev => !prev);
              setUnreadCount(0);
            }}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#161a26] transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-[#0E111A]" />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#131622] rounded-xl border border-slate-200 dark:border-[#202536] shadow-xl p-3 z-50 animate-scale-in">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-[#1c2233]">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Notifications & Activity
                </h4>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer">
                  Mark all read
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2">
                {activities.slice(0, 5).map(act => (
                  <div key={act.id} className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#1a1f2e] transition-colors flex items-start gap-2.5 text-xs">
                    <div className="p-1 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {act.target}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {act.details}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {formatTimeAgo(act.timestamp)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-[#1c2233] text-center">
                <Link
                  to="/"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View full activity feed
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileMenuOpen(prev => !prev)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-indigo-500/20 transition-all"
            aria-label="User menu"
          >
            <Avatar user={userProfile} size="sm" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#131622] rounded-xl border border-slate-200 dark:border-[#202536] shadow-xl p-2 z-50 animate-scale-in text-xs">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-[#1c2233]">
                <p className="font-semibold text-slate-900 dark:text-white truncate">
                  {userProfile.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {userProfile.email}
                </p>
              </div>

              <div className="py-1">
                <Link
                  to="/settings"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1a1f2e] transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1a1f2e] transition-colors"
                >
                  <SettingsIcon className="w-4 h-4 text-slate-400" />
                  <span>Preferences</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-[#1c2233]">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
