import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Users, FileText, Download, FolderOpen, Copy, CheckCircle, LogOut, X, MessageSquare, Send, Paperclip, MapPin, Calendar, User, Bell, Search, Filter, Clock, AlertTriangle, Plus } from 'lucide-react';

export default function App() {
  const [auth, setAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  if (!auth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl border p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-2">EPMO1</h1>
          <p className="text-slate-600 text-center mb-6">Enterprise PMO Platform</p>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="john@example.com"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && email === 'john@example.com' && pass === 'demo123') {
                  setAuth(true);
                }
              }}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="demo123"
            />
          </div>
          <button
            onClick={() => {
              if (email === 'john@example.com' && pass === 'demo123') {
                setAuth(true);
              } else {
                alert('Try: john@example.com / demo123');
              }
            }}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          >
            Login
          </button>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm"><strong>Demo Credentials:</strong></p>
            <p className="text-sm">Email: john@example.com</p>
            <p className="text-sm">Password: demo123</p>
          </div>
        </div>
      </div>
    );
  }

  return <MainApp />;
}

function MainApp() {
  const [view, setView] = useState('projects');
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState([
    { id: 1, title: 'Welcome!', msg: 'You have 2 tasks due this week', type: 'info' }
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">EPMO1</h1>
              <p className="text-sm text-slate-600">Welcome, John Smith</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="p-2 hover:bg-slate-100 rounded-lg relative"
                >
                  <Bell size={20} />
                  {notifs.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border z-50">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    {notifs.map(n => (
                      <div key={n.id} className="p-4 hover:bg-slate-50 border-b">
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-slate-600 mt-1">{n.msg}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => window.location.reload()}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setView('projects')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${view === 'projects' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
            >
              <FolderOpen size={18} />
              Projects
            </button>
            <button
              onClick={() => setView('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${view === 'analytics' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
            >
              <FileText size={18} />
              Analytics
            </button>
            <button
              onClick={() => setView('setup')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${view === 'setup' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
            >
              <Copy size={18} />
              Setup
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {view === 'projects' && <ProjectsView />}
        {view === 'analytics' && <AnalyticsView />}
        {view === 'setup' && <SetupView />}
      </div>
    </div>
  );
}

function ProjectsView() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Project Center</h2>
      <p>This is where your projects and RACI assignments will appear.</p>
    </div>
  );
}

function AnalyticsView() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
      <p>View your overall project stats, progress, and performance here.</p>
    </div>
  );
}

function SetupView() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Setup & Configuration</h2>
      <p>Define templates, departments, and project roles here.</p>
    </div>
  );
}
