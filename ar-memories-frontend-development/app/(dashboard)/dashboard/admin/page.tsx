'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button-glass';
import { Card } from '@/components/dashboard/card';
import { Users, BarChart3, Flag, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
}

export default function AdminPage() {
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Alice Customer',
      email: 'alice@example.com',
      role: 'customer',
      status: 'active',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Bob Photographer',
      email: 'bob@example.com',
      role: 'photographer',
      status: 'active',
      createdAt: '2024-02-20',
    },
    {
      id: '3',
      name: 'Charlie Studio',
      email: 'charlie@example.com',
      role: 'studio_owner',
      status: 'pending',
      createdAt: '2024-03-10',
    },
    {
      id: '4',
      name: 'Diana User',
      email: 'diana@example.com',
      role: 'customer',
      status: 'suspended',
      createdAt: '2024-04-05',
    },
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">System administration and monitoring</p>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Users" value="1,245" subtitle="Active accounts" icon={<Users className="w-6 h-6" />} color="from-blue-500 to-blue-600" />
        <Card title="System Status" value="Healthy" subtitle="99.9% uptime" icon={<CheckCircle className="w-6 h-6" />} color="from-green-500 to-green-600" />
        <Card title="Revenue" value="$48,392" subtitle="This month" icon={<BarChart3 className="w-6 h-6" />} color="from-purple-500 to-purple-600" />
        <Card title="Reports" value="3" subtitle="Pending review" icon={<Flag className="w-6 h-6" />} color="from-red-500 to-red-600" />
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-glass">
          <h2 className="text-xl font-bold mb-4">System Health</h2>
          <div className="space-y-4">
            {[
              { name: 'Database', status: 'healthy' },
              { name: 'API Server', status: 'healthy' },
              { name: 'Storage', status: 'healthy' },
              { name: 'Email Service', status: 'warning' },
            ].map((service, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-sm">{service.name}</p>
                <div className="flex items-center gap-2">
                  {service.status === 'healthy' && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {service.status === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                  <span className="text-xs font-semibold capitalize px-2 py-1 rounded-full bg-background">
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card-glass">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2">
              <CheckCircle className="w-4 h-4" />
              View System Logs
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Flag className="w-4 h-4" />
              Review Reports
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <AlertTriangle className="w-4 h-4" />
              Manage Suspensions
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <BarChart3 className="w-4 h-4" />
              View Backups
            </Button>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="card-glass">
        <h2 className="text-2xl font-bold mb-6">User Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-left py-3 px-4 font-semibold">Email</th>
                <th className="text-left py-3 px-4 font-semibold">Role</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Joined</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold capitalize">
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      {user.status === 'active' && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {user.status === 'suspended' && <XCircle className="w-4 h-4 text-red-600" />}
                      {user.status === 'pending' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                      <span className="capitalize text-xs">{user.status}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{user.createdAt}</td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Content Moderation */}
      <div className="card-glass">
        <h2 className="text-2xl font-bold mb-6">Content Moderation Queue</h2>
        <div className="space-y-3">
          {[
            { type: 'Album Report', user: 'Alice', reason: 'Inappropriate content', date: '2024-06-11' },
            { type: 'User Report', user: 'Bob', reason: 'Spam comments', date: '2024-06-10' },
            { type: 'Photo Report', user: 'Charlie', reason: 'Copyright violation', date: '2024-06-09' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-bold text-sm">{item.type}</p>
                <p className="text-xs text-muted-foreground">
                  {item.user} • {item.reason} • {item.date}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Approve
                </Button>
                <Button size="sm" variant="destructive">
                  Ban User
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
