import React, { useState } from 'react';
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Moon, 
  Sun, 
  Laptop, 
  Shield, 
  Download, 
  RotateCcw, 
  Check,
  CheckCircle2
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Avatar } from '../components/common/Avatar';

export function SettingsPage() {
  const { userProfile, setUserProfile, resetToDefaultData, projects, tasks } = useProject();
  const { theme, setTheme } = useTheme();
  const toast = useToast();

  const [name, setName] = useState(userProfile.name || '');
  const [role, setRole] = useState(userProfile.role || '');
  const [email, setEmail] = useState(userProfile.email || '');
  const [workspace, setWorkspace] = useState(userProfile.workspace || '');

  const [notifications, setNotifications] = useState(userProfile.notifications || {
    emailDigest: true,
    taskAssigned: true,
    mentionNotifications: true,
    deadlineAlerts: true
  });

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      name,
      role,
      email,
      workspace,
      notifications
    }));
    toast.success('Your workspace profile has been updated.', 'Settings Saved');
  };

  const handleExportData = () => {
    const exportObject = {
      workspace,
      exportedAt: new Date().toISOString(),
      projects,
      tasks
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `taskflow_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    toast.success('JSON export downloaded successfully', 'Export Ready');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-[#1a1f30]">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Workspace Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal profile, display preferences, and local data persistence.
        </p>
      </div>

      {/* 1. Profile Information */}
      <div className="bg-white dark:bg-[#111420] rounded-2xl border border-slate-200/80 dark:border-[#1e2334] p-6 shadow-card">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100 dark:border-[#1a1f30]">
          <User className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Profile & Account
            </h3>
            <p className="text-xs text-slate-400">
              Personal credentials and workspace identity
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <Avatar user={userProfile} size="lg" />
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{userProfile.name}</h4>
              <p className="text-xs text-slate-400">{userProfile.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#161a26] border border-slate-200 dark:border-[#22283a] text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Job Title / Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#161a26] border border-slate-200 dark:border-[#22283a] text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#161a26] border border-slate-200 dark:border-[#22283a] text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Workspace Name
              </label>
              <input
                type="text"
                value={workspace}
                onChange={(e) => setWorkspace(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#161a26] border border-slate-200 dark:border-[#22283a] text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* 2. Theme & Appearance */}
      <div className="bg-white dark:bg-[#111420] rounded-2xl border border-slate-200/80 dark:border-[#1e2334] p-6 shadow-card">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100 dark:border-[#1a1f30]">
          <Sun className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Appearance & Theme
            </h3>
            <p className="text-xs text-slate-400">
              Customize the look and feel of the interface
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-[#22283a] hover:border-slate-300'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Light Mode</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">High contrast crisp daylight theme</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
              theme === 'dark'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-[#22283a] hover:border-slate-300'
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Dark Mode</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Linear & Vercel deep slate theme</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
              theme === 'system'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-[#22283a] hover:border-slate-300'
            }`}
          >
            <Laptop className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">System Sync</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Match OS display settings</p>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Notifications Preferences */}
      <div className="bg-white dark:bg-[#111420] rounded-2xl border border-slate-200/80 dark:border-[#1e2334] p-6 shadow-card">
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-[#1a1f30]">
          <Bell className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Notifications Preferences
            </h3>
            <p className="text-xs text-slate-400">
              Configure alert frequency and email digests
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { key: 'emailDigest', label: 'Daily Productivity Digest', desc: 'Summary of completed tasks sent each morning' },
            { key: 'taskAssigned', label: 'Direct Assignment Alerts', desc: 'Notify immediately when a new task is assigned to you' },
            { key: 'deadlineAlerts', label: 'Overdue & Deadline Warnings', desc: 'Receive reminders 24 hours prior to milestone deadlines' }
          ].map(item => (
            <label key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#161a26] cursor-pointer transition-colors">
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.label}</p>
                <p className="text-[11px] text-slate-400">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={notifications[item.key] ?? false}
                onChange={(e) => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
            </label>
          ))}
        </div>
      </div>

      {/* 4. LocalStorage & Data Management */}
      <div className="bg-white dark:bg-[#111420] rounded-2xl border border-slate-200/80 dark:border-[#1e2334] p-6 shadow-card">
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-[#1a1f30]">
          <Shield className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Data Persistence & Workspace Reset
            </h3>
            <p className="text-xs text-slate-400">
              Data is saved automatically in your browser's LocalStorage.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleExportData}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#161a26] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Data as JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Workspace</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          resetToDefaultData();
          setIsResetConfirmOpen(false);
        }}
        title="Reset Demo Data?"
        message="This will reset all projects, tasks, and activities back to the initial sample demo data. Any custom modifications will be cleared."
        confirmText="Reset Everything"
        isDanger={true}
      />
    </div>
  );
}
