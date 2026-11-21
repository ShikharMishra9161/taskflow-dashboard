# TaskFlow — Modern SaaS Project Management Dashboard

TaskFlow is a production-quality, minimal SaaS project management application inspired by the design aesthetics and UX of **Linear**, **Vercel**, and modern productivity suites.

Built with **React**, **Vite**, **Tailwind CSS**, **React Router**, **@dnd-kit**, **Recharts**, and **Lucide Icons**.

---

## 🌟 Key Features

### 1. Overview Dashboard
- **Dynamic Live Metrics**: Total Projects, Active & Total Tasks, Completed Tasks, Pending & Overdue Tasks, and dynamic Task Completion Percentage.
- **Weekly Productivity Curve**: Responsive interactive Recharts AreaChart graphing task creation vs completion velocity over 7 days.
- **Project Progress Tracker**: Visual progress cards for all active initiatives with color accents and completion percentages.
- **Upcoming Deadlines**: Real-time list of prioritized tasks due soon with overdue warnings.
- **Recent Workspace Activity**: Audit feed logging task creation, column moves, status completions, and priority escalations.

### 2. Interactive Projects Management
- **Full Project CRUD**: Create, view, edit, and delete workspace projects.
- **Project Detail Modal**: Inspect individual projects, associated tasks, lead assignees, and deadlines.
- **View Modes**: Switch seamlessly between Grid Card view and Compact List view.
- **Search & Filters**: Instant keyword search and status filters (*All*, *Active*, *In Progress*, *In Planning*, *Completed*).
- **Team Avatars**: Real-time avatar stacks showing assignees and project leads.

### 3. Linear-Style Kanban Board
- **Fluid Drag-and-Drop**: Built using `@dnd-kit` across 4 columns:
  - 📋 **To Do**
  - 🚀 **In Progress**
  - 🔍 **In Review**
  - ✅ **Completed**
- **Celebration Effects**: Confetti bursts upon marking tasks as completed or moving them into the Completed column.
- **Board Filters**: Filter the board by Project, Priority, or instant text search.
- **Quick-Add**: Create new tasks directly inside any column with pre-assigned status.

### 4. My Tasks
- **Dual View Modes**: Switch between rich Grid cards and high-density Linear-style list rows.
- **Rich Filtering & Sorting**:
  - Filter by Status (*To Do*, *In Progress*, *In Review*, *Completed*).
  - Filter by Priority (*Urgent*, *High*, *Medium*, *Low*).
  - Filter by Project.
  - Sort by Due Date, Priority level, or Title (A-Z).
- **Instant Checkbox Completion**: Direct completion toggling from list items.

### 5. Interactive Monthly Calendar
- **Full Month Grid**: Navigate across months with a one-click "Today" jump button.
- **Task Chips**: Visual indicators for deadlines with priority colors and completion strike-throughs.
- **Click-to-Schedule**: Click any day cell to create a task scheduled for that specific date.
- **Project Filtering**: View deadlines for specific projects or the entire workspace.

### 6. Analytics & Telemetry
- **Cumulative Velocity Chart**: Area chart tracking completed deliverables vs active backlog.
- **Status Distribution Donut**: Recharts Pie chart displaying proportion of tasks across workflow states.
- **Task Priority Breakdown**: Bar chart color-coded by urgency level (Urgent, High, Medium, Low).
- **Project Completion Rates**: Comparative horizontal bars displaying progress per project.
- **Key KPIs**: Velocity metrics, cycle times, and critical path counts.

### 7. Workspace Settings & Data Management
- **Profile Customization**: Update name, role, email, and workspace identifier.
- **Theme Controls**: Light Mode, Dark Mode, and System Sync.
- **Notification Toggles**: Daily digest, assignment alerts, and overdue notifications.
- **Local Persistence**: Automatically persists all projects, tasks, and activities to browser `LocalStorage`.
- **JSON Data Backup**: One-click download of workspace state as formatted JSON.
- **Demo Reset**: Reset workspace to initial rich sample data at any time.

### 8. Global Command Palette & Shortcuts
- **Linear-Style Command Center**: Press <kbd>⌘K</kbd> or <kbd>Ctrl+K</kbd> anywhere to search tasks, jump to pages, or execute quick actions.
- **Quick Create Shortcut**: Press <kbd>C</kbd> outside input fields to instantly open the task creation dialog.
- **Toast Notification Engine**: Non-intrusive floating toasts for success, updates, and removals.
- **Destructive Action Guards**: Safe confirmation dialogs before deleting tasks or projects.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + Vite |
| **Routing** | React Router v6 |
| **Styling** | Tailwind CSS v3 |
| **Icons** | Lucide React |
| **Drag & Drop** | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` |
| **Data Visualization**| Recharts |
| **State & Persistence**| React Context API + LocalStorage |
| **Feedback & Polish** | Canvas Confetti, Custom Toasts, Modal System |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or pnpm

### Installation

1. Clone or navigate to the repository directory:
```bash
cd /d/product
```

2. Install dependencies:
```bash
npm install
```

3. Start the local development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Preview the production build:
```bash
npm run preview
```

---

## 📐 Architecture & Folder Structure

```
├── public/
├── src/
│   ├── components/
│   │   ├── common/         # StatCard, Avatar, Badge, Modal, ConfirmDialog, EmptyState
│   │   ├── layout/         # Sidebar, Navbar, Layout, CommandPalette
│   │   ├── tasks/          # TaskCard, TaskModal
│   │   ├── projects/       # ProjectCard, ProjectModal, ProjectDetailModal
│   │   ├── kanban/         # KanbanBoard, KanbanColumn, KanbanCard
│   │   └── calendar/       # Calendar grid & date utils
│   ├── context/
│   │   ├── ProjectContext.jsx  # Main state, CRUD operations, LocalStorage sync, metrics
│   │   ├── ThemeContext.jsx    # Dark/Light mode provider
│   │   └── ToastContext.jsx    # Toast notification engine
│   ├── data/
│   │   └── initialData.js      # Rich sample data (projects, tasks, members, activity)
│   ├── pages/
│   │   ├── OverviewPage.jsx
│   │   ├── ProjectsPage.jsx
│   │   ├── KanbanPage.jsx
│   │   ├── MyTasksPage.jsx
│   │   ├── CalendarPage.jsx
│   │   ├── AnalyticsPage.jsx
│   │   └── SettingsPage.jsx
│   ├── utils/
│   │   └── dateUtils.js        # Formatting, relative dates, overdue detection
│   ├── App.jsx                 # Routes & Providers
│   ├── main.jsx                # DOM entry point
│   └── index.css               # Tailwind directives & custom utilities
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🎨 Design Philosophy
- **Restraint & Precision**: Clear typographic hierarchy using *Plus Jakarta Sans* and *JetBrains Mono*.
- **Neutral Backgrounds**: Soft slate and zinc tones in light mode; deep obsidian `#090b10` and `#111420` in dark mode.
- **Accented Highlights**: Subtle indigo and violet glows without garish gradients.
- **Instant Responsiveness**: Full mobile drawer navigation, responsive table/grid layouts, zero horizontal overflow.
