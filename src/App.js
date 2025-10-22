import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Users, FileText, Download, FolderOpen, CheckCircle, LogOut, X, MessageSquare, Send, Paperclip, Calendar, User, Bell, Search, AlertTriangle, Plus, Edit, Trash2, Home, Target, BarChart3, Settings, Menu, Upload, Check, AlertCircle, XCircle, PlayCircle, History, Clock, Eye } from 'lucide-react';

const INITIAL_DATA = {
  users: [
    { id: 1, name: 'John Smith', email: 'john@epmo.com', password: 'demo123', departmentId: 1, role: 'Admin', avatarUrl: '', isActive: true },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@epmo.com', password: 'demo123', departmentId: 2, role: 'PM', avatarUrl: '', isActive: true },
    { id: 3, name: 'Mike Chen', email: 'mike@epmo.com', password: 'demo123', departmentId: 3, role: 'Member', avatarUrl: '', isActive: true },
    { id: 4, name: 'Emma Wilson', email: 'emma@epmo.com', password: 'demo123', departmentId: 1, role: 'Member', avatarUrl: '', isActive: true },
    { id: 5, name: 'David Lee', email: 'david@epmo.com', password: 'demo123', departmentId: 2, role: 'Member', avatarUrl: '', isActive: true },
  ],
  departments: [
    { id: 1, name: 'Project Management Office', description: 'Strategic oversight and governance' },
    { id: 2, name: 'Engineering', description: 'Technical design and implementation' },
    { id: 3, name: 'Operations', description: 'Execution and delivery' },
    { id: 4, name: 'Quality Assurance', description: 'Quality control and compliance' },
  ],
  templates: [
    {
      id: 1,
      name: 'Construction Project Standard',
      description: 'Standard RACI matrix for construction projects',
      processes: [
        {
          id: 'PROC-001',
          name: 'Site Preparation',
          description: 'Initial site setup and preparation',
          tasks: [
            {
              id: 'TASK-001',
              name: 'Obtain Permits',
              description: 'Secure all necessary permits and approvals',
              defaultRACI: { R: [3], A: [1], C: [2, 4], I: [1, 4] },
              requiredAttachments: ['Site Plan', 'Building Permit', 'Environmental Clearance']
            },
            {
              id: 'TASK-002',
              name: 'Site Survey',
              description: 'Conduct comprehensive site survey',
              defaultRACI: { R: [2], A: [1], C: [3], I: [4] },
              requiredAttachments: ['Survey Report']
            }
          ]
        },
        {
          id: 'PROC-002',
          name: 'Foundation Work',
          description: 'Foundation and structural preparation',
          tasks: [
            {
              id: 'TASK-003',
              name: 'Excavation',
              description: 'Execute foundation excavation',
              defaultRACI: { R: [3], A: [1], C: [2], I: [4] },
              requiredAttachments: ['Excavation Plan', 'Safety Report']
            }
          ]
        }
      ]
    }
  ],
  projects: [
    {
      id: 1,
      code: 'PROJ-001',
      name: 'Downtown Office Complex',
      status: 'Active',
      startDate: '2025-10-01',
      endDate: '2026-03-31',
      ownerDeptId: 1,
      tags: ['Construction', 'High Priority']
    }
  ],
  tasks: [
    {
      id: 1,
      projectId: 1,
      processId: 'PROC-001',
      taskId: 'TASK-001',
      name: 'Obtain Permits',
      description: 'Secure all necessary permits and approvals',
      status: 'In Progress',
      assignees: { R: [3], A: [1], C: [2, 4], I: [1, 4] },
      dueDate: '2025-11-01',
      requiredAttachments: ['Site Plan', 'Building Permit', 'Environmental Clearance'],
      rInputComplete: false,
      createdAt: '2025-10-15T08:00:00Z',
      updatedAt: '2025-10-20T14:30:00Z',
      order: 1
    },
    {
      id: 2,
      projectId: 1,
      processId: 'PROC-001',
      taskId: 'TASK-002',
      name: 'Site Survey',
      description: 'Conduct comprehensive site survey',
      status: 'Not Started',
      assignees: { R: [2], A: [1], C: [3], I: [4] },
      dueDate: '2025-11-15',
      requiredAttachments: ['Survey Report'],
      rInputComplete: false,
      createdAt: '2025-10-15T08:00:00Z',
      updatedAt: '2025-10-15T08:00:00Z',
      order: 2
    }
  ],
  attachments: [
    {
      id: 1,
      taskId: 1,
      filename: 'site-plan-draft.pdf',
      url: '#',
      uploadedBy: 3,
      uploadedAt: '2025-10-20T10:00:00Z',
      requiredType: 'Site Plan',
      isRequired: true
    }
  ],
  comments: [
    {
      id: 1,
      taskId: 1,
      authorId: 2,
      body: 'Please ensure all permits are filed by end of week',
      createdAt: '2025-10-20T09:00:00Z',
      mentions: [3]
    }
  ],
  activityLog: [
    {
      id: 1,
      taskId: 1,
      actorId: 1,
      action: 'Task Created',
      payload: { status: 'Not Started' },
      timestamp: '2025-10-15T08:00:00Z'
    },
    {
      id: 2,
      taskId: 1,
      actorId: 3,
      action: 'Status Changed',
      payload: { from: 'Not Started', to: 'In Progress' },
      timestamp: '2025-10-20T09:30:00Z'
    }
  ],
  notifications: [
    {
      id: 1,
      userId: 1,
      title: 'New Task Assigned',
      message: 'You are Accountable for Obtain Permits',
      type: 'info',
      read: false,
      createdAt: '2025-10-20T08:00:00Z'
    }
  ]
};

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const getStatusColor = (status) => {
  const colors = {
    'Not Started': 'bg-gray-100 text-gray-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    'Blocked': 'bg-red-100 text-red-700',
    'Done': 'bg-green-100 text-green-700',
    'Closed': 'bg-gray-800 text-white',
    'Active': 'bg-green-100 text-green-700',
    'On Hold': 'bg-yellow-100 text-yellow-700',
    'Completed': 'bg-gray-800 text-white'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const isOverdue = (dueDate, status) => {
  if (status === 'Closed' || status === 'Done') return false;
  return new Date(dueDate) < new Date();
};

const ChevronLeft = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [data, setData] = useState(INITIAL_DATA);
  const [view, setView] = useState('login');
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const savedData = localStorage.getItem('epmo-data');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  const updateData = (updates) => {
    const newData = { ...data, ...updates };
    setData(newData);
    localStorage.setItem('epmo-data', JSON.stringify(newData));
  };

  const handleLogin = (email, password) => {
    const user = data.users.find(u => u.email === email && u.password === password && u.isActive);
    if (user) {
      setCurrentUser(user);
      setView('dashboard');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
    setSelectedTask(null);
    setSelectedProject(null);
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        currentUser={currentUser}
        view={view}
        setView={setView}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          currentUser={currentUser}
          data={data}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {view === 'dashboard' && <Dashboard data={data} currentUser={currentUser} setView={setView} setSelectedProject={setSelectedProject} />}
            {view === 'projects' && <ProjectsView data={data} updateData={updateData} currentUser={currentUser} setView={setView} setSelectedProject={setSelectedProject} />}
            {view === 'timeline' && <TimelineView data={data} setView={setView} setSelectedTask={setSelectedTask} setSelectedProject={setSelectedProject} />}
            {view === 'project-detail' && selectedProject && (
              <ProjectDetail
                project={selectedProject}
                data={data}
                updateData={updateData}
                currentUser={currentUser}
                setView={setView}
                setSelectedTask={setSelectedTask}
              />
            )}
            {view === 'task-action' && selectedTask && (
              <TaskActionCenter
                task={selectedTask}
                data={data}
                updateData={updateData}
                currentUser={currentUser}
                setView={setView}
              />
            )}
            {view === 'templates' && <TemplatesView data={data} updateData={updateData} currentUser={currentUser} />}
            {view === 'departments' && <DepartmentsView data={data} updateData={updateData} currentUser={currentUser} />}
            {view === 'users' && <UsersView data={data} updateData={updateData} currentUser={currentUser} />}
            {view === 'reports' && <ReportsView data={data} currentUser={currentUser} />}
          </div>
        </main>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin(email, password)) {
      setError('');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Target className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">ePMO Platform</h1>
          <p className="text-slate-600">Enterprise Project Management Office</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 font-medium transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-600 font-medium mb-2">Demo Accounts:</p>
          <div className="space-y-1 text-xs text-slate-500">
            <p>Admin: john@epmo.com / demo123</p>
            <p>PM: sarah@epmo.com / demo123</p>
            <p>Member: mike@epmo.com / demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ currentUser, view, setView, onLogout, isOpen, setIsOpen }) {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'projects', icon: FolderOpen, label: 'Projects' },
    { id: 'timeline', icon: Clock, label: 'Timeline View' },
    { id: 'templates', icon: FileText, label: 'Templates' },
    { id: 'departments', icon: Users, label: 'Departments' },
    { id: 'users', icon: User, label: 'Users' },
    { id: 'reports', icon: BarChart3, label: 'Reports' },
  ];

  return (
    <>
      <div className={`${isOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex-shrink-0 flex flex-col`}>
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <Target className="text-slate-900" size={24} />
            </div>
            {isOpen && (
              <div>
                <h1 className="font-bold text-lg">ePMO</h1>
                <p className="text-xs text-slate-400">v2.0</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white text-slate-900'
                      : 'text-slate-300 hover:bg-slate-800'
                  } ${!isOpen && 'justify-center'}`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {isOpen && <span className="font-medium">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className={`flex items-center gap-3 mb-3 ${!isOpen && 'justify-center'}`}>
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
              {getInitials(currentUser.name)}
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{currentUser.name}</p>
                <p className="text-xs text-slate-400 truncate">{currentUser.role}</p>
              </div>
            )}
          </div>
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors ${!isOpen && 'justify-center'}`}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {isOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}

function Header({ currentUser, data, sidebarOpen, setSidebarOpen }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = data.notifications.filter(n => n.userId === currentUser.id && !n.read).length;

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Welcome back, {currentUser.name.split(' ')[0]}</h2>
            <p className="text-sm text-slate-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-slate-100 rounded-lg"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {data.notifications
                    .filter(n => n.userId === currentUser.id)
                    .map(notification => (
                      <div key={notification.id} className={`p-4 hover:bg-slate-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
                        <p className="font-medium text-sm text-slate-900">{notification.title}</p>
                        <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-slate-500 mt-2">{formatDateTime(notification.createdAt)}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function Dashboard({ data, currentUser, setView, setSelectedProject }) {
  const userTasks = data.tasks.filter(task => {
    const assignees = task.assignees;
    return Object.values(assignees).some(arr => arr.includes(currentUser.id));
  });

  const stats = [
    { label: 'Active Projects', value: data.projects.filter(p => p.status === 'Active').length, icon: FolderOpen, color: 'bg-blue-500' },
    { label: 'My Tasks', value: userTasks.length, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Overdue', value: userTasks.filter(t => isOverdue(t.dueDate, t.status)).length, icon: AlertTriangle, color: 'bg-red-500' },
    { label: 'Completed', value: userTasks.filter(t => t.status === 'Closed').length, icon: Target, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
                <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
              </div>
              <p className="text-slate-600 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">My Active Tasks</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {userTasks.filter(t => t.status !== 'Closed').map(task => (
              <div key={task.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{task.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      {isOverdue(task.dueDate, task.status) && (
                        <span className="flex items-center gap-1 text-red-600 text-xs">
                          <AlertTriangle size={12} />
                          Overdue
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Active Projects</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {data.projects.filter(p => p.status === 'Active').map(project => {
              const projectTasks = data.tasks.filter(t => t.projectId === project.id);
              const completedTasks = projectTasks.filter(t => t.status === 'Closed').length;
              const completion = projectTasks.length ? Math.round((completedTasks / projectTasks.length) * 100) : 0;

              return (
                <div
                  key={project.id}
                  className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                  onClick={() => {
                    setSelectedProject(project);
                    setView('project-detail');
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{project.name}</h3>
                      <p className="text-sm text-slate-600">{project.code}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Progress</span>
                      <span className="font-semibold text-slate-900">{completion}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsView({ data, updateData, currentUser, setView, setSelectedProject }) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
        >
          <Plus size={20} />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.projects.map(project => {
          const projectTasks = data.tasks.filter(t => t.projectId === project.id);
          const completedTasks = projectTasks.filter(t => t.status === 'Closed').length;
          const completion = projectTasks.length ? Math.round((completedTasks / projectTasks.length) * 100) : 0;

          return (
            <div
              key={project.id}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedProject(project);
                setView('project-detail');
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg mb-1">{project.name}</h3>
                  <p className="text-sm text-slate-600">{project.code}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600">Progress</span>
                    <span className="font-semibold text-slate-900">{completion}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar size={16} />
                  <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-sm text-slate-600">{projectTasks.length} tasks</span>
                  <span className="text-sm text-slate-600">{completedTasks} completed</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showCreateModal && (
        <CreateProjectModal
          data={data}
          updateData={updateData}
          currentUser={currentUser}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}

function TaskActionCenter({ task, data, updateData, currentUser, setView }) {
  const [activeTab, setActiveTab] = useState('details');
  const [newComment, setNewComment] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [showRInputModal, setShowRInputModal] = useState(false);
  const [rInputData, setRInputData] = useState({ decision: '', notes: '' });

  const taskComments = data.comments.filter(c => c.taskId === task.id);
  const taskAttachments = data.attachments.filter(a => a.taskId === task.id);
  const taskActivity = data.activityLog.filter(a => a.taskId === task.id);

  const userRole = Object.keys(task.assignees).find(role =>
    task.assignees[role].includes(currentUser.id)
  );

  const addActivity = (action, payload = {}) => {
    const newActivity = {
      id: Math.max(...data.activityLog.map(a => a.id), 0) + 1,
      taskId: task.id,
      actorId: currentUser.id,
      action,
      payload,
      timestamp: new Date().toISOString()
    };
    updateData({ activityLog: [...data.activityLog, newActivity] });
  };

  const handleStatusChange = (newStatus) => {
    const updatedTasks = data.tasks.map(t =>
      t.id === task.id ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
    );
    updateData({ tasks: updatedTasks });
    addActivity('Status Changed', { from: task.status, to: newStatus });
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Math.max(...data.comments.map(c => c.id), 0) + 1,
      taskId: task.id,
      authorId: currentUser.id,
      body: newComment,
      createdAt: new Date().toISOString(),
      mentions: []
    };

    updateData({ comments: [...data.comments, comment] });
    addActivity('Comment Added', { comment: newComment.substring(0, 50) });
    setNewComment('');
  };

  const handleFileUpload = (requiredType) => {
    if (!fileToUpload) return;

    const attachment = {
      id: Math.max(...data.attachments.map(a => a.id), 0) + 1,
      taskId: task.id,
      filename: fileToUpload.name,
      url: URL.createObjectURL(fileToUpload),
      uploadedBy: currentUser.id,
      uploadedAt: new Date().toISOString(),
      requiredType,
      isRequired: true
    };

    updateData({ attachments: [...data.attachments, attachment] });
    addActivity('Attachment Added', { filename: fileToUpload.name, type: requiredType });
    setFileToUpload(null);
  };

  const handleRInput = () => {
    if (!rInputData.decision) return;

    const updatedTasks = data.tasks.map(t =>
      t.id === task.id ? { ...t, rInputComplete: true, updatedAt: new Date().toISOString() } : t
    );
    updateData({ tasks: updatedTasks });
    addActivity('R Input Submitted', { decision: rInputData.decision });
    setShowRInputModal(false);
    setRInputData({ decision: '', notes: '' });
  };

  const canPerformAction = (requiredRole) => {
    return userRole === requiredRole;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => setView('dashboard')}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
      >
        <ChevronLeft size={20} />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{task.name}</h1>
              <p className="text-slate-600">{task.description}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-600">
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              Due: {formatDate(task.dueDate)}
            </span>
            {isOverdue(task.dueDate, task.status) && (
              <span className="flex items-center gap-1 text-red-600 font-medium">
                <AlertTriangle size={16} />
                Overdue
              </span>
            )}
            <span className="flex items-center gap-2">
              <User size={16} />
              Your Role: <span className="font-medium">{userRole || 'None'}</span>
            </span>
          </div>
        </div>

        <div className="border-b border-slate-200">
          <div className="flex gap-1 px-6">
            {['details', 'comments', 'attachments', 'activity'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-slate-900 border-b-2 border-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Task Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  {canPerformAction('R') && !task.rInputComplete && (
                    <button
                      onClick={() => setShowRInputModal(true)}
                      className="p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50 text-left"
                    >
                      <PlayCircle className="text-blue-500 mb-2" size={24} />
                      <p className="font-medium text-slate-900">Submit R Input</p>
                      <p className="text-sm text-slate-600">Provide your responsible party input</p>
                    </button>
                  )}

                  {canPerformAction('A') && (
                    <>
                      <button
                        onClick={() => handleStatusChange('In Progress')}
                        disabled={task.status === 'In Progress'}
                        className="p-4 border-2 border-green-500 rounded-lg hover:bg-green-50 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="text-green-500 mb-2" size={24} />
                        <p className="font-medium text-slate-900">Start Task</p>
                        <p className="text-sm text-slate-600">Mark task as in progress</p>
                      </button>

                      <button
                        onClick={() => handleStatusChange('Done')}
                        disabled={task.status === 'Done' || task.status === 'Closed'}
                        className="p-4 border-2 border-purple-500 rounded-lg hover:bg-purple-50 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check className="text-purple-500 mb-2" size={24} />
                        <p className="font-medium text-slate-900">Mark as Done</p>
                        <p className="text-sm text-slate-600">Complete the task</p>
                      </button>

                      <button
                        onClick={() => handleStatusChange('Blocked')}
                        disabled={task.status === 'Blocked'}
                        className="p-4 border-2 border-red-500 rounded-lg hover:bg-red-50 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle className="text-red-500 mb-2" size={24} />
                        <p className="font-medium text-slate-900">Block Task</p>
                        <p className="text-sm text-slate-600">Mark as blocked</p>
                      </button>

                      <button
                        onClick={() => handleStatusChange('Closed')}
                        disabled={task.status === 'Closed'}
                        className="p-4 border-2 border-gray-500 rounded-lg hover:bg-gray-50 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="text-gray-500 mb-2" size={24} />
                        <p className="font-medium text-slate-900">Close Task</p>
                        <p className="text-sm text-slate-600">Finalize and close</p>
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-4">RACI Assignments</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(task.assignees).map(([role, userIds]) => (
                    <div key={role} className="p-4 bg-slate-50 rounded-lg">
                      <p className="font-medium text-slate-900 mb-2">
                        {role === 'R' ? 'Responsible' : role === 'A' ? 'Accountable' : role === 'C' ? 'Consulted' : 'Informed'}
                      </p>
                      <div className="space-y-2">
                        {userIds.map(userId => {
                          const user = data.users.find(u => u.id === userId);
                          return user ? (
                            <div key={userId} className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center text-xs font-medium">
                                {getInitials(user.name)}
                              </div>
                              <span className="text-sm text-slate-700">{user.name}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {taskComments.map(comment => {
                  const author = data.users.find(u => u.id === comment.authorId);
                  return (
                    <div key={comment.id} className="flex gap-3 p-4 bg-slate-50 rounded-lg">
                      <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {author ? getInitials(author.name) : '?'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-900">{author?.name || 'Unknown'}</span>
                          <span className="text-xs text-slate-500">{formatDateTime(comment.createdAt)}</span>
                        </div>
                        <p className="text-slate-700">{comment.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                />
                <button
                  onClick={handleCommentSubmit}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'attachments' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Required Attachments</h3>
                <div className="space-y-3">
                  {task.requiredAttachments.map(reqType => {
                    const existingAttachment = taskAttachments.find(a => a.requiredType === reqType);
                    return (
                      <div key={reqType} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-900">{reqType}</span>
                          {existingAttachment ? (
                            <span className="flex items-center gap-1 text-green-600 text-sm">
                              <CheckCircle size={16} />
                              Uploaded
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-orange-600 text-sm">
                              <AlertCircle size={16} />
                              Required
                            </span>
                          )}
                        </div>
                        {existingAttachment ? (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <FileText size={16} />
                            <span>{existingAttachment.filename}</span>
                            <span className="text-xs">
                              by {data.users.find(u => u.id === existingAttachment.uploadedBy)?.name}
                            </span>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="file"
                              onChange={(e) => setFileToUpload(e.target.files[0])}
                              className="flex-1 text-sm"
                            />
                            <button
                              onClick={() => handleFileUpload(reqType)}
                              disabled={!fileToUpload}
                              className="px-3 py-1 bg-slate-900 text-white rounded text-sm hover:bg-slate-800 disabled:opacity-50"
                            >
                              Upload
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {taskActivity.map(activity => {
                const actor = data.users.find(u => u.id === activity.actorId);
                return (
                  <div key={activity.id} className="flex gap-3 p-4 bg-slate-50 rounded-lg">
                    <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {actor ? getInitials(actor.name) : '?'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-900">{actor?.name || 'System'}</span>
                        <span className="text-sm text-slate-600">{activity.action}</span>
                      </div>
                      <p className="text-xs text-slate-500">{formatDateTime(activity.timestamp)}</p>
                      {activity.payload && Object.keys(activity.payload).length > 0 && (
                        <pre className="text-xs text-slate-600 mt-2 bg-white p-2 rounded">
                          {JSON.stringify(activity.payload, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showRInputModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Submit R Input</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Decision/Recommendation</label>
                <select
                  value={rInputData.decision}
                  onChange={(e) => setRInputData({ ...rInputData, decision: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="">Select...</option>
                  <option value="Approve">Approve</option>
                  <option value="Needs Changes">Needs Changes</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Complete">Complete</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                <textarea
                  value={rInputData.notes}
                  onChange={(e) => setRInputData({ ...rInputData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  rows={4}
                  placeholder="Additional notes..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRInput}
                  disabled={!rInputData.decision}
                  className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowRInputModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TemplatesView({ data, updateData, currentUser }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Templates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.templates.map(template => (
          <div key={template.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-slate-900 text-lg mb-2">{template.name}</h3>
            <p className="text-sm text-slate-600 mb-4">{template.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{template.processes?.length || 0} processes</span>
              <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm">
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DepartmentsView({ data, updateData, currentUser }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Departments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.departments.map(dept => {
          const deptUsers = data.users.filter(u => u.departmentId === dept.id);
          return (
            <div key={dept.id} className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-semibold text-slate-900 text-lg mb-2">{dept.name}</h3>
              <p className="text-sm text-slate-600 mb-4">{dept.description}</p>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-slate-600" />
                <span className="text-sm text-slate-600">{deptUsers.length} members</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UsersView({ data, updateData, currentUser }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Users</h1>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-slate-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-slate-900">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-slate-900">Department</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-slate-900">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-slate-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.users.map(user => {
              const dept = data.departments.find(d => d.id === user.departmentId);
              return (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center text-sm font-medium">
                        {getInitials(user.name)}
                      </div>
                      <span className="font-medium text-slate-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{dept?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportsView({ data, currentUser }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <BarChart3 className="text-slate-900 mb-4" size={32} />
          <h3 className="font-semibold text-slate-900 text-lg mb-2">Project Status Report</h3>
          <p className="text-sm text-slate-600 mb-4">Overview of all project statuses</p>
          <button className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm">
            Generate Report
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <FileText className="text-slate-900 mb-4" size={32} />
          <h3 className="font-semibold text-slate-900 text-lg mb-2">Task Completion Report</h3>
          <p className="text-sm text-slate-600 mb-4">Track task completion rates</p>
          <button className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm">
            Generate Report
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <Users className="text-slate-900 mb-4" size={32} />
          <h3 className="font-semibold text-slate-900 text-lg mb-2">Resource Utilization</h3>
          <p className="text-sm text-slate-600 mb-4">Analyze resource allocation</p>
          <button className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateProjectModal({ data, updateData, currentUser, onClose }) {
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({
    name: '',
    code: '',
    description: '',
    startDate: '',
    endDate: '',
    ownerDeptId: '',
    status: 'Active',
    tags: []
  });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [taskAssignments, setTaskAssignments] = useState([]);

  const handleCreateProject = () => {
    const newProject = {
      id: Math.max(...data.projects.map(p => p.id), 0) + 1,
      ...projectData,
      ownerDeptId: parseInt(projectData.ownerDeptId)
    };

    const newTasks = [];
    if (selectedTemplate) {
      selectedTemplate.processes.forEach((process, pIdx) => {
        process.tasks.forEach((task, tIdx) => {
          const assignment = taskAssignments.find(a => a.taskId === task.id);
          newTasks.push({
            id: Math.max(...data.tasks.map(t => t.id), 0) + newTasks.length + 1,
            projectId: newProject.id,
            processId: process.id,
            taskId: task.id,
            name: task.name,
            description: task.description,
            status: 'Not Started',
            assignees: assignment?.assignees || task.defaultRACI,
            dueDate: new Date(Date.now() + (pIdx * 7 + tIdx * 2) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            requiredAttachments: task.requiredAttachments || [],
            rInputComplete: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            order: newTasks.length + 1
          });
        });
      });
    }

    updateData({
      projects: [...data.projects, newProject],
      tasks: [...data.tasks, ...newTasks]
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Create New Project</h2>
            <p className="text-sm text-slate-600 mt-1">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Project Name</label>
                <input
                  type="text"
                  value={projectData.name}
                  onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Project Code</label>
                <input
                  type="text"
                  value={projectData.code}
                  onChange={(e) => setProjectData({ ...projectData, code: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  placeholder="PROJ-XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={projectData.description}
                  onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  rows={4}
                  placeholder="Project description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={projectData.startDate}
                    onChange={(e) => setProjectData({ ...projectData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={projectData.endDate}
                    onChange={(e) => setProjectData({ ...projectData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Owner Department</label>
                <select
                  value={projectData.ownerDeptId}
                  onChange={(e) => setProjectData({ ...projectData, ownerDeptId: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="">Select department</option>
                  {data.departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Project Template</h3>
              <div className="space-y-3">
                {data.templates.map(template => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <h4 className="font-semibold text-slate-900">{template.name}</h4>
                    <p className="text-sm text-slate-600 mt-1">{template.description}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {template.processes?.length || 0} processes
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && selectedTemplate && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Configure Task Assignments</h3>
              {selectedTemplate.processes.map(process => (
                <div key={process.id} className="mb-6">
                  <h4 className="font-semibold text-slate-900 mb-2">{process.name}</h4>
                  <p className="text-sm text-slate-600 mb-4">{process.description}</p>
                  <div className="space-y-4">
                    {process.tasks && process.tasks.map(task => (
                      <div key={task.id} className="p-4 bg-slate-50 rounded-xl">
                        <h4 className="font-semibold text-slate-900 mb-3">{task.name}</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {['R', 'A', 'C', 'I'].map(role => {
                            const deptIds = task.defaultRACI[role] || [];
                            const availableUsers = data.users.filter(u => deptIds.includes(u.departmentId));

                            return (
                              <div key={role}>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                  {role === 'R' ? 'Responsible' : role === 'A' ? 'Accountable' : role === 'C' ? 'Consulted' : 'Informed'}
                                  {(role === 'C' || role === 'I') && ' (Can select multiple)'}
                                </label>
                                <select
                                  multiple
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                  size={3}
                                  onChange={(e) => {
                                    const selected = Array.from(e.target.selectedOptions).map(o => parseInt(o.value));
                                    const existing = taskAssignments.find(a => a.taskId === task.id);
                                    if (existing) {
                                      setTaskAssignments(taskAssignments.map(a =>
                                        a.taskId === task.id
                                          ? { ...a, assignees: { ...a.assignees, [role]: selected } }
                                          : a
                                      ));
                                    } else {
                                      setTaskAssignments([
                                        ...taskAssignments,
                                        { taskId: task.id, assignees: { R: [], A: [], C: [], I: [], [role]: selected } }
                                      ]);
                                    }
                                  }}
                                >
                                  {availableUsers.map(user => (
                                    <option key={user.id} value={user.id}>
                                      {user.name} ({data.departments.find(d => d.id === user.departmentId)?.name})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-between flex-shrink-0">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleCreateProject}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
            >
              Create Project
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TimelineView({ data, setView, setSelectedTask, setSelectedProject }) {
  const [selectedProjectId, setSelectedProjectId] = useState(data.projects[0]?.id || null);

  const selectedProject = data.projects.find(p => p.id === selectedProjectId);
  const projectTasks = data.tasks.filter(t => t.projectId === selectedProjectId).sort((a, b) => a.order - b.order);

  const processes = [...new Set(projectTasks.map(t => t.processId))];
  const processGroups = processes.map(processId => ({
    processId,
    tasks: projectTasks.filter(t => t.processId === processId)
  }));

  const getTaskPosition = (task) => {
    const start = new Date(selectedProject?.startDate || new Date());
    const end = new Date(selectedProject?.endDate || new Date());
    const taskDate = new Date(task.dueDate || new Date());

    const totalDays = (end - start) / (1000 * 60 * 60 * 24);
    const taskDays = (taskDate - start) / (1000 * 60 * 60 * 24);

    return Math.max(0, Math.min(100, (taskDays / totalDays) * 100));
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setView('task-action');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Timeline View / Process Tracker</h1>
        <p className="text-slate-600 mt-1">Visual Gantt-style view of project processes and tasks</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6">
        <div className="flex items-center gap-4">
          <label className="font-medium text-slate-700">Select Project:</label>
          <select
            value={selectedProjectId || ''}
            onChange={(e) => setSelectedProjectId(parseInt(e.target.value))}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
          >
            {data.projects.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
            ))}
          </select>
        </div>
      </div>

      {selectedProject && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedProject.name}</h2>
                <p className="text-sm text-slate-600 mt-1">
                  {formatDate(selectedProject.startDate)} - {formatDate(selectedProject.endDate)}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProject.status)}`}>
                {selectedProject.status}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6 bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Timeline</span>
                <div className="flex gap-8 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500"></div>
                    <span>Closed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <span>In Progress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gray-300"></div>
                    <span>Not Started</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500"></div>
                    <span>Overdue</span>
                  </div>
                </div>
              </div>
              <div className="relative h-2 bg-slate-200 rounded-full">
                <div className="absolute left-0 w-1 h-4 -top-1 bg-slate-400"></div>
                <div className="absolute right-0 w-1 h-4 -top-1 bg-slate-400"></div>
              </div>
            </div>

            <div className="space-y-8 max-h-[600px] overflow-y-auto">
              {processGroups.map((group, idx) => (
                <div key={group.processId} className="border-l-4 border-slate-900 pl-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">{group.processId}</h3>
                  <div className="space-y-3">
                    {group.tasks.map(task => {
                      const position = getTaskPosition(task);
                      const overdue = isOverdue(task.dueDate, task.status);
                      const taskColor = task.status === 'Closed' ? 'bg-green-500' :
                                       task.status === 'In Progress' ? 'bg-blue-500' :
                                       overdue ? 'bg-red-500' : 'bg-gray-300';

                      return (
                        <div key={task.id} className="relative">
                          <div className="flex items-center gap-4 mb-2">
                            <div className="w-48 flex-shrink-0">
                              <p className="font-medium text-sm text-slate-900">{task.name}</p>
                              <p className="text-xs text-slate-500">{task.taskId}</p>
                            </div>
                            <div className="flex-1 relative h-8">
                              <div
                                className={`absolute top-0 h-full ${taskColor} rounded-lg cursor-pointer hover:opacity-80 transition`}
                                style={{ left: `${position}%`, width: '60px' }}
                                onClick={() => handleTaskClick(task)}
                                title={`${task.name} - ${task.status} - Due: ${formatDate(task.dueDate)}`}
                              >
                                <div className="flex items-center justify-center h-full px-2">
                                  <span className="text-white text-xs font-medium truncate">
                                    {task.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="w-32 flex-shrink-0 text-right">
                              <p className={`text-xs font-medium ${overdue ? 'text-red-600' : 'text-slate-600'}`}>
                                {formatDate(task.dueDate)}
                              </p>
                              <button
                                onClick={() => handleTaskClick(task)}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                              >
                                View Task →
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectDetail({ project, data, updateData, currentUser, setView, setSelectedTask }) {
  const [activeTab, setActiveTab] = useState('tasks');
  const [selectedProjectId, setSelectedProjectId] = useState(project.id);
  const [selectedProcessId, setSelectedProcessId] = useState('all');
  const [expandedProcesses, setExpandedProcesses] = useState({});

  const currentProject = data.projects.find(p => p.id === selectedProjectId) || project;
  const allProjectTasks = data.tasks.filter(t => t.projectId === selectedProjectId);

  const projectTasks = selectedProcessId === 'all'
    ? allProjectTasks
    : allProjectTasks.filter(t => t.processId === selectedProcessId);

  const projectProcesses = [...new Set(allProjectTasks.map(t => t.processId))];
  const processesWithTasks = projectProcesses.map(processId => {
    const tasks = allProjectTasks.filter(t => t.processId === processId);
    return {
      id: processId,
      name: processId,
      tasks: tasks
    };
  });

  const stats = {
    total: allProjectTasks.length,
    closed: allProjectTasks.filter(t => t.status === 'Closed').length,
    inProgress: allProjectTasks.filter(t => t.status === 'In Progress').length,
  };

  const completion = stats.total ? Math.round((stats.closed / stats.total) * 100) : 0;

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setView('task-action');
  };

  const toggleProcess = (processId) => {
    setExpandedProcesses(prev => ({
      ...prev,
      [processId]: !prev[processId]
    }));
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => setView('projects')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
        >
          <ChevronLeft size={20} />
          Back to Projects
        </button>

        <div className="bg-white p-4 rounded-xl border border-slate-200 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <label className="font-medium text-slate-700">Switch Project:</label>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(parseInt(e.target.value));
                setSelectedProcessId('all');
                setExpandedProcesses({});
              }}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
            >
              {data.projects.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="font-medium text-slate-700">Filter by Process:</label>
            <select
              value={selectedProcessId}
              onChange={(e) => setSelectedProcessId(e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
            >
              <option value="all">All Processes</option>
              {projectProcesses.map(processId => (
                <option key={processId} value={processId}>{processId}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-900">{currentProject.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentProject.status)}`}>
                {currentProject.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {formatDate(currentProject.startDate)} - {formatDate(currentProject.endDate)}
              </span>
              <span>{currentProject.code}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900">Project Progress</h3>
          <span className="text-2xl font-bold text-slate-900">{completion}%</span>
        </div>
        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Project Structure</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {processesWithTasks.map(process => (
              <div key={process.id} className="border border-slate-200 rounded-lg">
                <button
                  onClick={() => toggleProcess(process.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    {expandedProcesses[process.id] ? (
                      <ChevronDown size={20} className="text-slate-600" />
                    ) : (
                      <ChevronRight size={20} className="text-slate-600" />
                    )}
                    <h4 className="font-semibold text-slate-900">{process.name}</h4>
                    <span className="text-sm text-slate-600">({process.tasks.length} tasks)</span>
                  </div>
                </button>

                {expandedProcesses[process.id] && (
                  <div className="px-4 pb-4 space-y-2">
                    {process.tasks.map(task => (
                      <div key={task.id} className="ml-8 p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h5 className="font-medium text-slate-900">{task.name}</h5>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                              {isOverdue(task.dueDate, task.status) && (
                                <span className="flex items-center gap-1 text-red-600 text-xs">
                                  <AlertTriangle size={14} />
                                  Overdue
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{task.description}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                Due: {formatDate(task.dueDate)}
                              </span>
                              <div className="flex items-center gap-2">
                                {Object.entries(task.assignees).map(([role, users]) => (
                                  users.length > 0 && (
                                    <span key={role} className="flex items-center gap-1">
                                      <span className="font-medium">{role}:</span>
                                      {users.map(userId => {
                                        const user = data.users.find(u => u.id === userId);
                                        return user ? (
                                          <span key={userId} className="text-xs bg-slate-100 px-2 py-1 rounded">
                                            {user.name}
                                          </span>
                                        ) : null;
                                      })}
                                    </span>
                                  )
                                ))}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleTaskClick(task)}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 ml-4 text-sm"
                          >
                            <Target size={14} />
                            Action
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
