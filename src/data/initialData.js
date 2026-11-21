// Realistic sample data for TaskFlow SaaS Dashboard

export const initialTeamMembers = [
  {
    id: 'user-1',
    name: 'Alex Rivera',
    role: 'Lead Architect',
    email: 'alex.rivera@acme.dev',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    initials: 'AR'
  },
  {
    id: 'user-2',
    name: 'Sarah Chen',
    role: 'Senior Product Designer',
    email: 'sarah.chen@acme.dev',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
    initials: 'SC'
  },
  {
    id: 'user-3',
    name: 'Marcus Vance',
    role: 'Full Stack Engineer',
    email: 'marcus.vance@acme.dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    initials: 'MV'
  },
  {
    id: 'user-4',
    name: 'Elena Rostova',
    role: 'QA & Security Engineer',
    email: 'elena.rostova@acme.dev',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
    initials: 'ER'
  },
  {
    id: 'user-5',
    name: 'David Kim',
    role: 'DevOps & Cloud Lead',
    email: 'david.kim@acme.dev',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    initials: 'DK'
  }
];

export const initialProjects = [
  {
    id: 'proj-1',
    name: 'Mobile Banking App 2.0',
    description: 'Next-generation iOS & Android application featuring biometrics, real-time FX transfers, and AI budgeting.',
    color: '#6366f1', // Indigo
    category: 'Mobile App',
    status: 'In Progress',
    deadline: '2026-12-15',
    leadId: 'user-1',
    members: ['user-1', 'user-2', 'user-3'],
    createdAt: '2026-10-01'
  },
  {
    id: 'proj-2',
    name: 'Design System & UI Kit',
    description: 'Unified component library built in Tailwind & React with tokenized themes and WCAG AAA compliance.',
    color: '#ec4899', // Pink
    category: 'Design System',
    status: 'In Progress',
    deadline: '2026-11-30',
    leadId: 'user-2',
    members: ['user-2', 'user-3'],
    createdAt: '2026-10-15'
  },
  {
    id: 'proj-3',
    name: 'Cloud Infrastructure & Migrations',
    description: 'Zero-downtime Kubernetes cluster migration, multi-region failover, and SOC2 compliance monitoring.',
    color: '#06b6d4', // Cyan
    category: 'DevOps',
    status: 'Active',
    deadline: '2026-12-28',
    leadId: 'user-5',
    members: ['user-1', 'user-5'],
    createdAt: '2026-09-20'
  },
  {
    id: 'proj-4',
    name: 'Customer Portal Redesign',
    description: 'Modern self-service dashboard for enterprise clients with billing analytics and role-based permissions.',
    color: '#10b981', // Emerald
    category: 'Web App',
    status: 'Completed',
    deadline: '2026-11-10',
    leadId: 'user-3',
    members: ['user-3', 'user-4'],
    createdAt: '2026-09-01'
  }
];

// Helper to get relative date string YYYY-MM-DD
function getOffsetDate(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

export const initialTasks = [
  {
    id: 'task-101',
    title: 'Implement FaceID / TouchID biometric login flow',
    description: 'Integrate native biometric authentication with fallback to secure 6-digit PIN and hardware keystore encryption.',
    projectId: 'proj-1',
    status: 'in-progress',
    priority: 'high',
    dueDate: getOffsetDate(2),
    assigneeId: 'user-1',
    labels: ['Security', 'Mobile', 'iOS'],
    subtasks: [
      { id: 'st-1', title: 'Keychain wrapper implementation', completed: true },
      { id: 'st-2', title: 'Fallback PIN keypad UI', completed: true },
      { id: 'st-3', title: 'Biometric prompt trigger and error states', completed: false }
    ],
    createdAt: '2026-11-14T09:30:00Z'
  },
  {
    id: 'task-102',
    title: 'Design high-fidelity interactive wireframes for FX transfers',
    description: 'Create multi-currency exchange conversion screen with real-time rate charts and fee breakdown.',
    projectId: 'proj-1',
    status: 'completed',
    priority: 'medium',
    dueDate: getOffsetDate(-3),
    assigneeId: 'user-2',
    labels: ['UI/UX', 'Figma'],
    subtasks: [
      { id: 'st-4', title: 'Currency picker drawer component', completed: true },
      { id: 'st-5', title: 'Interactive exchange rate preview', completed: true }
    ],
    createdAt: '2026-11-10T11:00:00Z'
  },
  {
    id: 'task-103',
    title: 'Audit color tokens for dark mode contrast ratios',
    description: 'Ensure all primary, surface, and muted text tokens satisfy WCAG 2.1 AA standards in both light and dark themes.',
    projectId: 'proj-2',
    status: 'in-review',
    priority: 'high',
    dueDate: getOffsetDate(1),
    assigneeId: 'user-2',
    labels: ['Accessibility', 'Design System'],
    subtasks: [
      { id: 'st-6', title: 'Run automated Stark color contrast scan', completed: true },
      { id: 'st-7', title: 'Update slate token definitions in Tailwind config', completed: true },
      { id: 'st-8', title: 'Peer review with Elena', completed: false }
    ],
    createdAt: '2026-11-16T14:20:00Z'
  },
  {
    id: 'task-104',
    title: 'Configure automated blue-green deployments in Terraform',
    description: 'Set up zero-downtime rolling cluster updates with automatic rollback on HTTP 5xx threshold triggers.',
    projectId: 'proj-3',
    status: 'in-progress',
    priority: 'urgent',
    dueDate: getOffsetDate(0), // Due today!
    assigneeId: 'user-5',
    labels: ['DevOps', 'Terraform', 'Kubernetes'],
    subtasks: [
      { id: 'st-9', title: 'Define ingress controller canary weights', completed: true },
      { id: 'st-10', title: 'Prometheus alert webhook configuration', completed: false }
    ],
    createdAt: '2026-11-15T08:15:00Z'
  },
  {
    id: 'task-105',
    title: 'Refactor modal dialogue focus trap and screen-reader announcements',
    description: 'Address accessibility gap where ESC key press was not restoring focus to the triggering element.',
    projectId: 'proj-2',
    status: 'todo',
    priority: 'medium',
    dueDate: getOffsetDate(4),
    assigneeId: 'user-3',
    labels: ['Accessibility', 'Frontend'],
    subtasks: [
      { id: 'st-11', title: 'Write unit test for focus trap loop', completed: false },
      { id: 'st-12', title: 'Add aria-modal attributes to backdrop', completed: false }
    ],
    createdAt: '2026-11-18T10:00:00Z'
  },
  {
    id: 'task-106',
    title: 'Optimize Postgres database connection pooling and read replicas',
    description: 'Migrate to PgBouncer connection pooling to handle peak traffic surges during morning trading sessions.',
    projectId: 'proj-3',
    status: 'todo',
    priority: 'high',
    dueDate: getOffsetDate(-1), // Overdue!
    assigneeId: 'user-5',
    labels: ['Database', 'Performance'],
    subtasks: [
      { id: 'st-13', title: 'Benchmark pool size 50 vs 100', completed: false },
      { id: 'st-14', title: 'Configure read-replica DNS routing', completed: false }
    ],
    createdAt: '2026-11-12T13:45:00Z'
  },
  {
    id: 'task-107',
    title: 'Customer portal billing invoice PDF export generator',
    description: 'Allow enterprise accounts to download branded, itemized PDF invoices for tax audits with one click.',
    projectId: 'proj-4',
    status: 'completed',
    priority: 'low',
    dueDate: getOffsetDate(-6),
    assigneeId: 'user-3',
    labels: ['Billing', 'Feature'],
    subtasks: [
      { id: 'st-15', title: 'HTML template styling', completed: true },
      { id: 'st-16', title: 'Serverless PDF generation endpoint', completed: true }
    ],
    createdAt: '2026-11-05T16:00:00Z'
  },
  {
    id: 'task-108',
    title: 'Fix Safari flexbox overflow glitch on billing history table',
    description: 'Horizontal scrollbar is disappearing on older WebKit engines when table width exceeds viewport container.',
    projectId: 'proj-4',
    status: 'completed',
    priority: 'medium',
    dueDate: getOffsetDate(-4),
    assigneeId: 'user-4',
    labels: ['Bug', 'CSS'],
    subtasks: [
      { id: 'st-17', title: 'Reproduce on macOS Safari 16', completed: true },
      { id: 'st-18', title: 'Apply min-w-full overflow-x-auto fix', completed: true }
    ],
    createdAt: '2026-11-08T09:00:00Z'
  },
  {
    id: 'task-109',
    title: 'Real-time WebSocket notifications for pending transfer approvals',
    description: 'Broadcast push notifications and in-app toasts when high-value transfers require co-signature approval.',
    projectId: 'proj-1',
    status: 'in-review',
    priority: 'high',
    dueDate: getOffsetDate(3),
    assigneeId: 'user-3',
    labels: ['WebSockets', 'Backend', 'Realtime'],
    subtasks: [
      { id: 'st-19', title: 'Redis Pub/Sub channel connection', completed: true },
      { id: 'st-20', title: 'Heartbeat ping-pong reconnect logic', completed: true },
      { id: 'st-21', title: 'End-to-end integration tests', completed: false }
    ],
    createdAt: '2026-11-17T11:30:00Z'
  },
  {
    id: 'task-110',
    title: 'Create storybook documentation for DatePicker component',
    description: 'Write comprehensive stories demonstrating single-date, date-range, and international locale variations.',
    projectId: 'proj-2',
    status: 'todo',
    priority: 'low',
    dueDate: getOffsetDate(6),
    assigneeId: 'user-2',
    labels: ['Documentation', 'Design System'],
    subtasks: [
      { id: 'st-22', title: 'Document prop types and events', completed: false }
    ],
    createdAt: '2026-11-19T15:00:00Z'
  },
  {
    id: 'task-111',
    title: 'Implement automated vulnerability scanning in CI/CD pipeline',
    description: 'Integrate Snyk and Trivy image scanning on GitHub Actions to block merge of high-severity CVEs.',
    projectId: 'proj-3',
    status: 'completed',
    priority: 'high',
    dueDate: getOffsetDate(-2),
    assigneeId: 'user-4',
    labels: ['Security', 'CI/CD'],
    subtasks: [
      { id: 'st-23', title: 'Add secret detection scan to pull requests', completed: true },
      { id: 'st-24', title: 'Set severity fail threshold to HIGH', completed: true }
    ],
    createdAt: '2026-11-11T14:10:00Z'
  },
  {
    id: 'task-112',
    title: 'Optimize client bundle size with dynamic code splitting',
    description: 'Separate heavy charts (Recharts) and PDF export libraries into async dynamic chunks to drop initial JS payload under 120kb.',
    projectId: 'proj-1',
    status: 'todo',
    priority: 'medium',
    dueDate: getOffsetDate(5),
    assigneeId: 'user-1',
    labels: ['Performance', 'Vite'],
    subtasks: [
      { id: 'st-25', title: 'Analyze bundle with rollup-visualizer', completed: false },
      { id: 'st-26', title: 'Implement React.lazy on analytics route', completed: false }
    ],
    createdAt: '2026-11-18T16:30:00Z'
  }
];

export const initialActivities = [
  {
    id: 'act-1',
    userId: 'user-1',
    type: 'task_updated',
    target: 'Implement FaceID / TouchID biometric login flow',
    details: 'Moved to In Progress',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString() // 25 mins ago
  },
  {
    id: 'act-2',
    userId: 'user-2',
    type: 'task_completed',
    target: 'Design high-fidelity interactive wireframes for FX transfers',
    details: 'Completed all subtasks',
    timestamp: new Date(Date.now() - 1000 * 60 * 85).toISOString() // ~1.5 hours ago
  },
  {
    id: 'act-3',
    userId: 'user-5',
    type: 'task_updated',
    target: 'Configure automated blue-green deployments in Terraform',
    details: 'Priority raised to Urgent',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString() // 3 hours ago
  },
  {
    id: 'act-4',
    userId: 'user-4',
    type: 'task_completed',
    target: 'Implement automated vulnerability scanning in CI/CD pipeline',
    details: 'Merged to master branch',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString() // 14 hours ago
  },
  {
    id: 'act-5',
    userId: 'user-3',
    type: 'task_created',
    target: 'Customer portal billing invoice PDF export generator',
    details: 'Assigned to Marcus Vance',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() // 1 day ago
  }
];

export const initialUserProfile = {
  name: 'Alex Rivera',
  role: 'Engineering Lead & Product Architect',
  email: 'alex.rivera@acme.dev',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  workspace: 'Acme SaaS Studio',
  themePreference: 'dark',
  notifications: {
    emailDigest: true,
    taskAssigned: true,
    mentionNotifications: true,
    deadlineAlerts: true
  }
};
