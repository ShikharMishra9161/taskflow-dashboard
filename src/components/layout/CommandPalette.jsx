import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  FolderKanban, 
  CheckSquare, 
  Kanban, 
  Calendar, 
  BarChart3, 
  Settings, 
  Plus, 
  Moon, 
  Sun, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useTheme } from '../../context/ThemeContext';
import { PriorityBadge } from '../common/Badge';

export function CommandPalette() {
  const navigate = useNavigate();
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    tasks, 
    projects, 
    openCreateTaskModal,
    openCreateProjectModal,
    openEditTaskModal
  } = useProject();
  const { toggleTheme, theme } = useTheme();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Keyboard navigation inside palette
  useEffect(() => {
    function handleKeyDown(e) {
      if (!isCommandPaletteOpen) return;

      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, allResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (allResults[selectedIndex]) {
          allResults[selectedIndex].action();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!isCommandPaletteOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // Navigation Items
  const navActions = [
    { id: 'nav-overview', label: 'Go to Overview', icon: Sparkles, action: () => { navigate('/'); setIsCommandPaletteOpen(false); } },
    { id: 'nav-tasks', label: 'Go to My Tasks', icon: CheckSquare, action: () => { navigate('/tasks'); setIsCommandPaletteOpen(false); } },
    { id: 'nav-projects', label: 'Go to Projects', icon: FolderKanban, action: () => { navigate('/projects'); setIsCommandPaletteOpen(false); } },
    { id: 'nav-kanban', label: 'Go to Kanban Board', icon: Kanban, action: () => { navigate('/kanban'); setIsCommandPaletteOpen(false); } },
    { id: 'nav-calendar', label: 'Go to Calendar', icon: Calendar, action: () => { navigate('/calendar'); setIsCommandPaletteOpen(false); } },
    { id: 'nav-analytics', label: 'Go to Analytics', icon: BarChart3, action: () => { navigate('/analytics'); setIsCommandPaletteOpen(false); } },
    { id: 'nav-settings', label: 'Go to Settings', icon: Settings, action: () => { navigate('/settings'); setIsCommandPaletteOpen(false); } }
  ].filter(item => !trimmed || item.label.toLowerCase().includes(trimmed));

  // Quick Action Items
  const quickActions = [
    { id: 'act-new-task', label: 'Create New Task', icon: Plus, action: () => { setIsCommandPaletteOpen(false); openCreateTaskModal(); } },
    { id: 'act-new-project', label: 'Create New Project', icon: FolderKanban, action: () => { setIsCommandPaletteOpen(false); openCreateProjectModal(); } },
    { id: 'act-toggle-theme', label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, icon: theme === 'dark' ? Sun : Moon, action: () => { toggleTheme(); setIsCommandPaletteOpen(false); } }
  ].filter(item => !trimmed || item.label.toLowerCase().includes(trimmed));

  // Filtered Tasks
  const taskResults = tasks
    .filter(t => !trimmed || t.title.toLowerCase().includes(trimmed) || t.description?.toLowerCase().includes(trimmed))
    .slice(0, 5)
    .map(t => ({
      id: t.id,
      label: t.title,
      type: 'task',
      priority: t.priority,
      status: t.status,
      action: () => {
        setIsCommandPaletteOpen(false);
        openEditTaskModal(t);
      }
    }));

  // Filtered Projects
  const projectResults = projects
    .filter(p => !trimmed || p.name.toLowerCase().includes(trimmed) || p.category?.toLowerCase().includes(trimmed))
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      label: p.name,
      type: 'project',
      color: p.color,
      action: () => {
        setIsCommandPaletteOpen(false);
        navigate(`/projects?id=${p.id}`);
      }
    }));

  const allResults = [...quickActions, ...navActions, ...taskResults, ...projectResults];

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-start justify-center pt-20 sm:pt-28 p-4 animate-fade-in"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div 
        className="w-full max-w-xl bg-white dark:bg-[#131622] rounded-2xl border border-slate-200 dark:border-[#22283a] shadow-2xl overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-[#1e2334]">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search tasks, projects..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-hidden"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {allResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching commands, tasks, or projects found.
            </div>
          ) : (
            allResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-colors text-left ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#191e2c]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {Icon ? (
                      <Icon className="w-4 h-4 text-indigo-500 shrink-0" />
                    ) : item.type === 'task' ? (
                      <CheckSquare className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <span 
                        className="w-3 h-3 rounded-full shrink-0" 
                        style={{ backgroundColor: item.color || '#6366f1' }}
                      />
                    )}

                    <span className="font-medium truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.priority && <PriorityBadge priority={item.priority} />}
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'opacity-100 translate-x-0.5' : 'opacity-0'}`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Hints */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-[#1e2334] bg-slate-50/50 dark:bg-[#10131c] flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>↑↓ Navigate</span>
            <span>•</span>
            <span>↵ Select</span>
          </div>
          <span>Linear-style Command Center</span>
        </div>
      </div>
    </div>
  );
}
