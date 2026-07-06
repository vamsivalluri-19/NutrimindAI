import React, { useState } from 'react';
import { Shield, Ban, CheckCircle, Search } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'USER', status: 'ACTIVE' },
    { id: '2', name: 'Dr. Sarah Jenkins', email: 'sarah@example.com', role: 'NUTRITIONIST', status: 'ACTIVE' },
    { id: '3', name: 'Coach Marcus Brody', email: 'marcus@example.com', role: 'TRAINER', status: 'ACTIVE' },
    { id: '4', name: 'Dave Vance', email: 'dave@example.com', role: 'USER', status: 'BANNED' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleUpdateRole = (id: string, newRole: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    alert(`Role updated successfully to ${newRole}`);
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">User Moderation</h1>
          <p className="text-slate-400 text-sm mt-1">Manage platform accounts, promote coaches, and toggle access blocks.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-900/50">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">System Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="px-6 py-4 font-semibold">{user.name}</td>
                <td className="px-6 py-4 text-slate-400">{user.email}</td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                    className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    <option value="USER">User</option>
                    <option value="NUTRITIONIST">Nutritionist</option>
                    <option value="TRAINER">Trainer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    user.status === 'ACTIVE' ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleToggleStatus(user.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      user.status === 'ACTIVE'
                        ? 'bg-red-500/10 hover:bg-red-500/20 text-red-500'
                        : 'bg-primary/10 hover:bg-primary/20 text-primary'
                    }`}
                    title={user.status === 'ACTIVE' ? 'Ban Account' : 'Activate Account'}
                  >
                    {user.status === 'ACTIVE' ? <Ban size={14} /> : <CheckCircle size={14} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
