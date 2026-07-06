import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Users, MessageSquare, Terminal } from 'lucide-react';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import PromptManager from './pages/PromptManager';

function Navigation() {
  const location = useLocation();
  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Users Moderation', path: '/users', icon: Users },
    { name: 'AI Prompts Manager', path: '/prompts', icon: Terminal },
  ];

  return (
    <aside className="w-64 glass border-r border-slate-800 p-6 flex flex-col justify-between">
      <div className="space-y-8">
        <div className="flex items-center space-x-2 text-xl font-extrabold text-primary tracking-tight">
          <Shield className="h-6 w-6 text-primary" />
          <span>NutriMind <span className="text-slate-400">Admin</span></span>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={16} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="text-xs text-slate-500">
        <span>Logged in as Admin</span>
        <span className="block mt-1 font-mono">v1.0.0 (development)</span>
      </div>
    </aside>
  );
}

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Navigation />
        <main className="flex-grow p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/prompts" element={<PromptManager />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
