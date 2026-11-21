import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useProject } from '../../context/ProjectContext';
import { Trash2 } from 'lucide-react';

const PALETTE = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#f43f5e', // Rose
  '#3b82f6', // Blue
];

const CATEGORIES = [
  'Mobile App',
  'Web App',
  'Design System',
  'DevOps',
  'Backend & API',
  'Marketing & Growth',
  'Security & Compliance'
];

export function ProjectModal({ isOpen, onClose, project }) {
  const { addProject, updateProject, deleteProject, members } = useProject();
  const isEditing = Boolean(project && project.id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PALETTE[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [status, setStatus] = useState('In Progress');
  const [deadline, setDeadline] = useState('');
  const [leadId, setLeadId] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (project) {
        setName(project.name || '');
        setDescription(project.description || '');
        setColor(project.color || PALETTE[0]);
        setCategory(project.category || CATEGORIES[0]);
        setStatus(project.status || 'In Progress');
        setDeadline(project.deadline || '');
        setLeadId(project.leadId || (members[0]?.id || ''));
      } else {
        setName('');
        setDescription('');
        setColor(PALETTE[Math.floor(Math.random() * PALETTE.length)]);
        setCategory(CATEGORIES[0]);
        setStatus('Active');
        const defaultDeadline = new Date();
        defaultDeadline.setMonth(defaultDeadline.getMonth() + 1);
        setDeadline(defaultDeadline.toISOString().split('T')[0]);
        setLeadId(members[0]?.id || '');
      }
      setErrors({});
    }
  }, [isOpen, project, members]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrors({ name: 'Project name is required' });
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      color,
      category,
      status,
      deadline,
      leadId,
      members: [leadId, ...members.slice(0, 2).map(m => m.id)].filter((v, i, a) => a.indexOf(v) === i)
    };

    if (isEditing) {
      updateProject(project.id, payload);
    } else {
      addProject(payload);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Project Settings' : 'Create New Project'}
      description={isEditing ? 'Configure project timeline, team lead, and theme.' : 'Set up a workspace project with goals and team assignments.'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Project Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({});
            }}
            placeholder="e.g. Mobile Banking App 2.0"
            className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#161a26] border ${
              errors.name ? 'border-rose-500' : 'border-slate-200 dark:border-[#22283a]'
            } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20`}
          />
          {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Description & Key Objectives
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief overview of the project scope and deliverable goals..."
            className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#161a26] border border-slate-200 dark:border-[#22283a] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 resize-none"
          />
        </div>

        {/* Color Palette Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Project Accent Color
          </label>
          <div className="flex items-center gap-2.5">
            {PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full transition-transform ${
                  color === c ? 'scale-125 ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-[#131622]' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#161a26] border border-slate-200 dark:border-[#22283a] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#161a26] border border-slate-200 dark:border-[#22283a] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="Active">Active</option>
              <option value="In Progress">In Progress</option>
              <option value="In Planning">In Planning</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Deadline & Project Lead */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#161a26] border border-slate-200 dark:border-[#22283a] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Project Lead
            </label>
            <select
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#161a26] border border-slate-200 dark:border-[#22283a] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-[#1e2334]">
          {isEditing ? (
            <button
              type="button"
              onClick={() => {
                deleteProject(project.id);
                onClose();
              }}
              className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Project
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
            >
              {isEditing ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
