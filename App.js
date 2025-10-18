"use client";
import React, { useState } from "react";
import {
  ChevronDown, ChevronRight, Users, FileText, Download, FolderOpen, Copy, CheckCircle,
  LogOut, X, MessageSquare, Send, Paperclip, MapPin, Calendar, User, Bell, Search,
  Filter, Clock, AlertTriangle, Plus
} from "lucide-react";

export default function App() {
  const [auth, setAuth] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  if (!auth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl border p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-2">RACI Matrix Pro</h1>
          <p className="text-slate-600 text-center mb-6">Process Management System</p>
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && email === "john@example.com" && pass === "demo123") {
                  setAuth(true);
                }
              }}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="demo123"
            />
          </div>
          <button
            onClick={() => {
              if (email === "john@example.com" && pass === "demo123") {
                setAuth(true);
              } else {
                alert("Try: john@example.com / demo123");
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
  const [view, setView] = useState("projects");
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs] = useState([
    { id: 1, title: "Welcome!", msg: "You have 2 tasks due this week", type: "info" }
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">RACI Matrix Pro</h1>
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
              onClick={() => setView("projects")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${view === "projects" ? "bg-blue-500 text-white" : "bg-slate-100"}`}
            >
              <FolderOpen size={18} />
              Projects
            </button>
            <button
              onClick={() => setView("analytics")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${view === "analytics" ? "bg-blue-500 text-white" : "bg-slate-100"}`}
            >
              <FileText size={18} />
              Analytics
            </button>
            <button
              onClick={() => setView("setup")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${view === "setup" ? "bg-blue-500 text-white" : "bg-slate-100"}`}
            >
              <Copy size={18} />
              Setup
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {view === "projects" && <ProjectsView />}
        {view === "analytics" && <AnalyticsView />}
        {view === "setup" && <SetupView />}
      </div>
    </div>
  );
}

function ProjectsView() {
  const [expanded, setExpanded] = useState({});
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [tab, setTab] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [showExport, setShowExport] = useState(false);
  const [processes, setProcesses] = useState([
    { id: 1, name: "Site Preparation", desc: "Initial site setup", pri: "high",     due: "2025-10-25", hrs: 40, status: "progress",     raci: { PM: "A", Ops: "R", Safety: "C", QC: "I" } },
    { id: 2, name: "Foundation Work",  desc: "Foundation construction",  pri: "critical", due: "2025-10-15", hrs: 80, status: "not-started", raci: { PM: "A", Ops: "R", Eng: "C" } }
  ]);

  const updateStatus = (procId, newStatus) => {
    setProcesses(processes.map(p => p.id === procId ? { ...p, status: newStatus } : p));
  };

  const filtered = processes.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (priorityFilter !== "all" && p.pri !== priorityFilter) return false;
    return true;
  });

  const rColors = {
    R: "bg-blue-100 text-blue-800",
    A: "bg-purple-100 text-purple-800",
    C: "bg-green-100 text-green-800",
    I: "bg-yellow-100 text-yellow-800"
  };

  const pColors = {
    low: "bg-slate-100 text-slate-700",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    critical: "bg-red-100 text-red-700"
  };

  const sColors = {
    "not-started": "bg-gray-100 text-gray-700",
    progress: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    delayed: "bg-red-100 text-red-700"
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Project Center</h2>

      <div className="bg-white rounded-xl shadow border p-6 mb-6">
        <div className="mb-4">
          <h3 className="text-2xl font-bold">Downtown Office Complex</h3>
          <div className="flex gap-4 mt-2 text-sm text-slate-600">
            <span><MapPin size={14} className="inline" /> Riyadh, Saudi Arabia</span>
            <span><User size={14} className="inline" /> PM: John Smith</span>
            <span><Calendar size={14} className="inline" /> 2025-01-15</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search processes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <button
            onClick={() => setShowExport(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
          >
            <Download size={18} />
            Export
          </button>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <span className="text-sm font-medium flex items-center gap-2">
            <Filter size={16} />Filters:
          </span>
          <button
            onClick={() => setRoleFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm ${roleFilter === "all" ? "bg-slate-900 text-white" : "bg-slate-100"}`}
          >
            All
          </button>
          <button
            onClick={() => setRoleFilter("mine")}
            className={`px-4 py-2 rounded-lg text-sm ${roleFilter === "mine" ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-700"}`}
          >
            My Tasks
          </button>
          <div className="h-6 w-px bg-slate-300"></div>
          <span className="text-sm font-medium">Priority:</span>
          {["all", "critical", "high", "medium", "low"].map(p => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1 rounded text-xs ${priorityFilter === p ? "bg-slate-900 text-white" : "bg-slate-100"}`}
            >
              {p === "all" ? "All" : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow border p-6">
          <div className="text-slate-600 text-sm mb-1">Total Processes</div>
          <div className="text-3xl font-bold">2</div>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
          <div className="text-blue-700 text-sm mb-1">Responsible</div>
          <div className="text-3xl font-bold text-blue-900">2</div>
        </div>
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
          <div className="text-purple-700 text-sm mb-1">Accountable</div>
          <div className="text-3xl font-bold text-purple-900">2</div>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-6">
          <div className="text-green-700 text-sm mb-1">Consult/Inform</div>
          <div className="text-3xl font-bold text-green-900">3</div>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(proc => {
          const isExp = expanded[proc.id];
          const curTab = tab[proc.id] || "overview";
          const commKey = `proc-${proc.id}`;
          const comms = comments[commKey] || [];
          const isOverdue = new Date(proc.due) < new Date() && proc.status !== "completed";

          return (
            <div key={proc.id} className="bg-white rounded-xl shadow border">
              <div className="bg-slate-50 border-b p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 flex-1">
                    <button onClick={() => setExpanded({ ...expanded, [proc.id]: !isExp })}>
                      {isExp ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="font-semibold">{proc.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${sColors[proc.status]}`}>
                          {proc.status.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${pColors[proc.pri]}`}>
                          {proc.pri.toUpperCase()}
                        </span>
                        {isOverdue && (
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700 flex items-center gap-1">
                            <AlertTriangle size={12} />OVERDUE
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />Due: {proc.due}
                        </div>
                        <div>{proc.hrs}h estimated</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <MessageSquare size={16} />{comms.length}
                    </div>
                    <div className="flex items-center gap-1">
                      <Paperclip size={16} />0
                    </div>
                  </div>
                </div>
              </div>

              {isExp && (
                <div>
                  <div className="border-b flex gap-1 px-4">
                    <button
                      onClick={() => setTab({ ...tab, [proc.id]: "overview" })}
                      className={`px-4 py-2 text-sm font-medium border-b-2 ${curTab === "overview" ? "border-blue-500 text-blue-600" : "border-transparent"}`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setTab({ ...tab, [proc.id]: "collab" })}
                      className={`px-4 py-2 text-sm font-medium border-b-2 ${curTab === "collab" ? "border-blue-500 text-blue-600" : "border-transparent"}`}
                    >
                      Collaboration ({comms.length})
                    </button>
                    <button
                      onClick={() => setTab({ ...tab, [proc.id]: "attach" })}
                      className={`px-4 py-2 text-sm font-medium border-b-2 ${curTab === "attach" ? "border-blue-500 text-blue-600" : "border-transparent"}`}
                    >
                      Attachments (0)
                    </button>
                  </div>

                  <div className="p-6">
                    {curTab === "overview" && (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="text-sm font-semibold">Team Assignments</h5>
                          <div className="flex gap-2">
                            <select
                              value={proc.status}
                              onChange={(e) => updateStatus(proc.id, e.target.value)}
                              className="px-3 py-1 border rounded text-sm"
                            >
                              <option value="not-started">Not Started</option>
                              <option value="progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="delayed">Delayed</option>
                            </select>
                            <button
                              onClick={() => updateStatus(proc.id, "completed")}
                              className="px-4 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 flex items-center gap-1"
                            >
                              <CheckCircle size={16} />
                              Approve & Complete
                            </button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {Object.entries(proc.raci).map(([dept, role]) => (
                            <div key={dept} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50">
                              <span className={`px-3 py-1 rounded font-semibold text-sm ${rColors[role]}`}>
                                {role}
                              </span>
                              <div className="flex-1">
                                <div className="font-medium">John Smith (You)</div>
                                <div className="text-sm text-slate-600">{dept} • Senior Manager</div>
                              </div>
                              <CheckCircle size={20} className="text-green-500" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {curTab === "collab" && (
                      <div>
                        <div className="space-y-4 mb-4">
                          {comms.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                              <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No comments yet</p>
                            </div>
                          ) : (
                            comms.map((c, i) => (
                              <div key={i} className="bg-slate-50 rounded-lg p-4">
                                <div className="flex justify-between mb-2">
                                  <span className="font-semibold text-sm">John Smith</span>
                                  <span className="text-xs text-slate-500">Just now</span>
                                </div>
                                <p className="text-slate-700">{c}</p>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment[proc.id] || ""}
                            onChange={(e) => setNewComment({ ...newComment, [proc.id]: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && newComment[proc.id]) {
                                setComments({ ...comments, [commKey]: [...comms, newComment[proc.id]] });
                                setNewComment({ ...newComment, [proc.id]: "" });
                              }
                            }}
                            className="flex-1 px-4 py-2 border rounded-lg"
                          />
                          <button
                            onClick={() => {
                              if (newComment[proc.id]) {
                                setComments({ ...comments, [commKey]: [...comms, newComment[proc.id]] });
                                setNewComment({ ...newComment, [proc.id]: "" });
                              }
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                          >
                            <Send size={18} />
                          </button>
                        </div>
                      </div>
                    )}

                    {curTab === "attach" && (
                      <div className="text-center py-8 text-slate-500">
                        <Paperclip size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No attachments</p>
                        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                          Add Attachment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showExport && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowExport(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between mb-6">
              <h3 className="text-lg font-semibold">Export Project Data</h3>
              <button onClick={() => setShowExport(false)} className="p-1 hover:bg-slate-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <FileText size={18} />JSON Format
                </span>
                <Download size={18} />
              </button>
              <button className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <FileText size={18} />CSV Format
                </span>
                <Download size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AnalyticsView() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow border p-6">
          <div className="text-slate-600 text-sm mb-1">Total</div>
          <div className="text-3xl font-bold">2</div>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-6">
          <div className="text-green-700 text-sm mb-1">Completed</div>
          <div className="text-3xl font-bold text-green-900">0</div>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
          <div className="text-blue-700 text-sm mb-1">In Progress</div>
          <div className="text-3xl font-bold text-blue-900">1</div>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-6">
          <div className="text-red-700 text-sm mb-1">Delayed</div>
          <div className="text-3xl font-bold text-red-900">0</div>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <div className="text-gray-700 text-sm mb-1">Not Started</div>
          <div className="text-3xl font-bold text-gray-900">1</div>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-200 p-6">
          <div className="text-orange-700 text-sm mb-1">Overdue</div>
          <div className="text-3xl font-bold text-orange-900">1</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border p-6 mb-6">
        <h3 className="font-semibold mb-4">Overall Completion Rate</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-green-500 h-4 rounded-full" style={{ width: "50%" }}></div>
            </div>
          </div>
          <div className="text-3xl font-bold">50%</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border p-6">
        <h3 className="font-semibold mb-4">RACI Distribution</h3>
        <div className="space-y-3">
          {[
            { role: "R", name: "Responsible", count: 4, color: "bg-blue-500" },
            { role: "A", name: "Accountable", count: 2, color: "bg-purple-500" },
            { role: "C", name: "Consulted",   count: 2, color: "bg-green-500" },
            { role: "I", name: "Informed",    count: 1, color: "bg-yellow-500" }
          ].map(item => (
            <div key={item.role}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-sm font-bold">{item.count}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${(item.count / 9) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SetupView() {
  const [setupTab, setSetupTab] = useState("templates");
  const [showTempForm, setShowTempForm] = useState(false);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Setup & Configuration</h2>

      <div className="bg-white rounded-xl shadow border mb-6">
        <div className="border-b flex">
          <button
            onClick={() => setSetupTab("templates")}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${setupTab === "templates" ? "border-blue-500 text-blue-600" : "border-transparent"}`}
          >
            Templates
          </button>
          <button
            onClick={() => setSetupTab("projects")}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${setupTab === "projects" ? "border-blue-500 text-blue-600" : "border-transparent"}`}
          >
            Projects
          </button>
          <button
            onClick={() => setSetupTab("people")}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${setupTab === "people" ? "border-blue-500 text-blue-600" : "border-transparent"}`}
          >
            People
          </button>
          <button
            onClick={() => setSetupTab("depts")}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${setupTab === "depts" ? "border-blue-500 text-blue-600" : "border-transparent"}`}
          >
            Departments
          </button>
        </div>

        <div className="p-6">
          {setupTab === "templates" && (
            <div>
              <div className="flex justify-between mb-6">
                <p className="text-slate-600">Pre-defined RACI templates</p>
                <button
                  onClick={() => setShowTempForm(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                >
                  <Plus size={18} />New Template
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { name: "Construction Standard", cat: "Construction", procs: 2 },
                  { name: "Software Sprint",       cat: "Technology",   procs: 1 }
                ].map((t, i) => (
                  <div key={i} className="border rounded-lg p-6 hover:shadow transition">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded mb-2">
                      {t.cat}
                    </span>
                    <h3 className="text-lg font-semibold">{t.name}</h3>
                    <p className="text-sm text-slate-700 mt-3">
                      <strong>{t.procs} Processes</strong>
                    </p>
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">
                        View
                      </button>
                      <button className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm">
                        Edit
                      </button>
                      <button className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {showTempForm && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6"
                  onClick={() => setShowTempForm(false)}
                >
                  <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                    <div className="p-6 border-b flex justify-between">
                      <h2 className="text-2xl font-bold">Create New Template</h2>
                      <button onClick={() => setShowTempForm(false)} className="p-2 hover:bg-slate-100 rounded">
                        <X size={24} />
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium mb-1">Template Name</label>
                          <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Marketing Campaign" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Brief description" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Category</label>
                          <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Marketing, Technology" />
                        </div>
                      </div>
                      <button className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
                        Create Template
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {setupTab === "projects" && (
            <div>
              <div className="flex justify-between mb-6">
                <p className="text-slate-600">Manage your projects</p>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
                  <Plus size={18} />New Project
                </button>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold">Downtown Office Complex</h3>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 mt-3 text-sm text-slate-600">
                  <div><MapPin size={14} className="inline mr-1" />Riyadh, Saudi Arabia</div>
                  <div><User size={14} className="inline mr-1" />PM: John Smith</div>
                  <div>Client: ABC Corporation</div>
                  <div>Budget: $5,000,000</div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                    Open Project
                  </button>
                  <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm flex items-center gap-2">
                    <Users size={16} />Assign People
                  </button>
                </div>
              </div>
            </div>
          )}

          {setupTab === "people" && (
            <div>
              <div className="flex justify-between mb-6">
                <p className="text-slate-600">Team members</p>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
                  <Plus size={18} />Add Person
                </button>
              </div>
              <div className="bg-white rounded-lg border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase">Dept</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { name: "John Smith",  title: "Senior PM",       dept: "PM",  email: "john@ex.com" },
                      { name: "Sarah Johnson", title: "Supervisor",     dept: "Ops", email: "sarah@ex.com" },
                      { name: "Mike Chen",     title: "Safety Officer", dept: "Safety", email: "mike@ex.com" },
                      { name: "Lisa Brown",    title: "QC Inspector",   dept: "QC",  email: "lisa@ex.com" }
                    ].map((p, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm font-medium">{p.name}</td>
                        <td className="px-4 py-3 text-sm">{p.title}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {p.dept}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{p.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {setupTab === "depts" && (
            <div>
              <div className="flex justify-between mb-6">
                <p className="text-slate-600">Organizational departments</p>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
                  <Plus size={18} />Add Department
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {["PM", "Operations", "Engineering", "Safety", "QC"].map((d, i) => (
                  <div key={i} className="border rounded-lg p-6 hover:shadow transition">
                    <h3 className="font-semibold text-lg mb-2">{d}</h3>
                    <p className="text-sm text-slate-500">{Math.floor(Math.random() * 5) + 1} members</p>
                    <div className="mt-4 flex gap-2">
                      <button className="text-sm text-blue-600 hover:underline">Edit</button>
                      <button className="text-sm text-red-600 hover:underline">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
