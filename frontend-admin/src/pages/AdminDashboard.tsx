import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import { Users, DollarSign, MessageSquare, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { name: 'Total Users', value: '1,240', change: '+12% this week', icon: Users, color: 'text-primary bg-primary/10' },
    { name: 'Monthly Revenue', value: '$8,450', change: '+24% this month', icon: DollarSign, color: 'text-yellow-500 bg-yellow-500/10' },
    { name: 'Active Coaches', value: '42', change: 'Nutritionists & Trainers', icon: Users, color: 'text-blue-500 bg-blue-500/10' },
    { name: 'Pending Tickets', value: '8', change: 'Requires response', icon: MessageSquare, color: 'text-red-500 bg-red-500/10' }
  ];

  const salesData = [
    { month: 'Jan', revenue: 3200 },
    { month: 'Feb', revenue: 4500 },
    { month: 'Mar', revenue: 5800 },
    { month: 'Apr', revenue: 7100 },
    { month: 'May', revenue: 8450 }
  ];

  const pendingTickets = [
    { id: '1', user: 'Mark Adams', subject: 'Calorie scan not detecting avocado recipe', status: 'OPEN' },
    { id: '2', user: 'Linda Carter', subject: 'Requested a coach match with nutritionist Jenkins', status: 'IN_PROGRESS' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold">System Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Real-time health statistics, subscription performance, and ticket logs.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{stat.name}</span>
                <div className={`p-2.5 rounded-xl ${stat.color}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div>
                <span className="text-3xl font-extrabold">{stat.value}</span>
                <span className="block text-[10px] text-slate-500 mt-1 font-semibold">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-3xl lg:col-span-2 space-y-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Subscription Revenue (USD)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <XAxis dataKey="month" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0F172A', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }} />
                <Line type="monotone" dataKey="revenue" stroke="#16A34A" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Support Tickets Queue */}
        <div className="glass p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
            <AlertCircle size={14} className="text-red-500" />
            <span>Support Tickets Queue</span>
          </h3>
          <div className="space-y-3">
            {pendingTickets.map((t) => (
              <div key={t.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold">{t.user}</span>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${t.status === 'OPEN' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>{t.status}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">{t.subject}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
