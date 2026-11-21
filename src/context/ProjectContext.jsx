import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { initialProjects, initialTasks, initialTeamMembers, initialActivities, initialUserProfile } from '../data/initialData';
import { useToast } from './ToastContext';
import { isOverdue } from '../utils/dateUtils';
import confetti from 'canvas-confetti';

const ProjectContext = createContext();

const STORAGE_KEYS = {
  PROJECTS: 'taskflow_projects_v1',
  TASKS: 'taskflow_tasks_v1',
  MEMBERS: 'taskflow_members_v1',
  ACTIVITIES: 'taskflow_activities_v1',
  PROFILE: 'taskflow_profile_v1',
};

export function ProjectProvider({ children }) {
  const toast = useToast();

  // 1. Core States with LocalStorage recovery
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : initialProjects;
    } catch {
      return initialProjects;
    }
  });

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      return saved ? JSON.parse(saved) : initialTeamMembers;
    } catch {
      return initialTeamMembers;
    }
  });

  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : initialActivities;
    } catch {
      return initialActivities;
    }
  });

  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : initialUserProfile;
    } catch {
      return initialUserProfile;
    }
  });

  // Global UI modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalData, setTaskModalData] = useState(null); // null = new task, object = edit task
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectModalData, setProjectModalData] = useState(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Sync state changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    } catch (e) {
      console.error('Failed to save members to localStorage', e);
    }
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch (e) {
      console.error('Failed to save activities to localStorage', e);
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
    } catch (e) {
      console.error('Failed to save profile to localStorage', e);
    }
  }, [userProfile]);

  // Log Activity Helper
  const logActivity = useCallback((type, target, details, userId = 'user-1') => {
    const newActivity = {
      id: 'act-' + Date.now() + Math.random().toString(36).substring(2, 5),
      userId,
      type,
      target,
      details,
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 30));
  }, []);

  // 2. Task Operations
  const addTask = useCallback((taskData) => {
    const newTask = {
      ...taskData,
      id: 'task-' + Date.now(),
      createdAt: new Date().toISOString(),
      subtasks: taskData.subtasks || [],
      labels: taskData.labels || []
    };

    setTasks(prev => [newTask, ...prev]);
    logActivity('task_created', newTask.title, 'Created new task');
    toast.success(`Task "${newTask.title.slice(0, 35)}..." created`, 'Task Added');
    return newTask;
  }, [logActivity, toast]);

  const updateTask = useCallback((taskId, updates) => {
    setTasks(prev => {
      const existing = prev.find(t => t.id === taskId);
      if (!existing) return prev;

      const isNowCompleted = updates.status === 'completed' && existing.status !== 'completed';
      if (isNowCompleted) {
        try {
          confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 } });
        } catch (_) {}
      }

      const updated = prev.map(t => (t.id === taskId ? { ...t, ...updates } : t));
      return updated;
    });

    logActivity('task_updated', updates.title || 'Task', 'Updated details');
    toast.success('Task updated successfully');
  }, [logActivity, toast]);

  const deleteTask = useCallback((taskId) => {
    let deletedTitle = 'Task';
    setTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      if (task) deletedTitle = task.title;
      return prev.filter(t => t.id !== taskId);
    });

    logActivity('task_deleted', deletedTitle, 'Task removed');
    toast.info(`Deleted task "${deletedTitle.slice(0, 35)}..."`, 'Task Deleted');
  }, [logActivity, toast]);

  const moveTask = useCallback((taskId, newStatus) => {
    setTasks(prev => {
      const targetTask = prev.find(t => t.id === taskId);
      if (!targetTask || targetTask.status === newStatus) return prev;

      if (newStatus === 'completed') {
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        } catch (_) {}
      }

      return prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t));
    });

    const statusLabels = {
      'todo': 'To Do',
      'in-progress': 'In Progress',
      'in-review': 'In Review',
      'completed': 'Completed'
    };

    logActivity('task_moved', 'Task', `Moved to ${statusLabels[newStatus] || newStatus}`);
  }, [logActivity]);

  const toggleSubtask = useCallback((taskId, subtaskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      const updatedSubtasks = (task.subtasks || []).map(st => 
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );
      return { ...task, subtasks: updatedSubtasks };
    }));
  }, []);

  // 3. Project Operations
  const addProject = useCallback((projectData) => {
    const newProject = {
      ...projectData,
      id: 'proj-' + Date.now(),
      createdAt: new Date().toISOString(),
      members: projectData.members || ['user-1'],
      status: projectData.status || 'Active'
    };

    setProjects(prev => [newProject, ...prev]);
    logActivity('project_created', newProject.name, 'Created new project');
    toast.success(`Project "${newProject.name}" created`, 'Project Added');
    return newProject;
  }, [logActivity, toast]);

  const updateProject = useCallback((projectId, updates) => {
    setProjects(prev => prev.map(p => (p.id === projectId ? { ...p, ...updates } : p)));
    logActivity('project_updated', updates.name || 'Project', 'Updated settings');
    toast.success('Project updated successfully');
  }, [logActivity, toast]);

  const deleteProject = useCallback((projectId) => {
    let deletedName = 'Project';
    setProjects(prev => {
      const p = prev.find(proj => proj.id === projectId);
      if (p) deletedName = p.name;
      return prev.filter(proj => proj.id !== projectId);
    });

    // Reassign or delete associated tasks
    setTasks(prev => prev.filter(t => t.projectId !== projectId));
    logActivity('project_deleted', deletedName, 'Project & associated tasks removed');
    toast.info(`Deleted project "${deletedName}"`, 'Project Removed');
  }, [logActivity, toast]);

  // 4. Reset to Demo Data
  const resetToDefaultData = useCallback(() => {
    setProjects(initialProjects);
    setTasks(initialTasks);
    setMembers(initialTeamMembers);
    setActivities(initialActivities);
    setUserProfile(initialUserProfile);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    toast.info('Workspace reset to default sample data', 'Reset Complete');
  }, [toast]);

  // 5. Dynamic Metrics Calculation
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const inReviewTasks = tasks.filter(t => t.status === 'in-review').length;
    const todoTasks = tasks.filter(t => t.status === 'todo').length;
    const pendingTasks = totalTasks - completedTasks;
    const overdueTasks = tasks.filter(t => isOverdue(t.dueDate, t.status)).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const highPriorityTasks = tasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length;

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      inReviewTasks,
      todoTasks,
      pendingTasks,
      overdueTasks,
      completionRate,
      highPriorityTasks
    };
  }, [projects, tasks]);

  // Helper getters
  const getProjectById = useCallback((id) => projects.find(p => p.id === id), [projects]);
  const getMemberById = useCallback((id) => members.find(m => m.id === id), [members]);

  const value = {
    projects,
    tasks,
    members,
    activities,
    userProfile,
    setUserProfile,
    stats,
    // Task actions
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    toggleSubtask,
    // Project actions
    addProject,
    updateProject,
    deleteProject,
    // Modal states
    isTaskModalOpen,
    setIsTaskModalOpen,
    taskModalData,
    setTaskModalData,
    openCreateTaskModal: (prefill = {}) => {
      setTaskModalData(prefill);
      setIsTaskModalOpen(true);
    },
    openEditTaskModal: (task) => {
      setTaskModalData(task);
      setIsTaskModalOpen(true);
    },
    isProjectModalOpen,
    setIsProjectModalOpen,
    projectModalData,
    setProjectModalData,
    openCreateProjectModal: () => {
      setProjectModalData(null);
      setIsProjectModalOpen(true);
    },
    openEditProjectModal: (project) => {
      setProjectModalData(project);
      setIsProjectModalOpen(true);
    },
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    resetToDefaultData,
    getProjectById,
    getMemberById
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
