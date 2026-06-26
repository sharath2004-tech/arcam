'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button-glass';
import { Card } from '@/components/dashboard/card';
import Link from 'next/link';
import {
  Image, Camera, MessageSquare, CreditCard, Users, BarChart3, QrCode, FileText
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const quickActions = [
    user?.role === 'customer' && {
      icon: <Image className="w-6 h-6" />,
      label: 'View Albums',
      href: '/dashboard/albums',
      color: 'from-blue-500 to-blue-600'
    },
    user?.role === 'customer' && {
      icon: <Camera className="w-6 h-6" />,
      label: 'AR Camera',
      href: '/dashboard/ar-camera',
      color: 'from-purple-500 to-purple-600'
    },
    user?.role === 'customer' && {
      icon: <QrCode className="w-6 h-6" />,
      label: 'QR Codes',
      href: '/dashboard/qr-codes',
      color: 'from-green-500 to-green-600'
    },
    user?.role === 'photographer' && {
      icon: <Camera className="w-6 h-6" />,
      label: 'AR Camera',
      href: '/dashboard/ar-camera',
      color: 'from-purple-500 to-purple-600'
    },
    user?.role === 'photographer' && {
      icon: <FileText className="w-6 h-6" />,
      label: 'Portfolio',
      href: '/dashboard/portfolio',
      color: 'from-orange-500 to-orange-600'
    },
    user?.role === 'studio_owner' && {
      icon: <Users className="w-6 h-6" />,
      label: 'Team',
      href: '/dashboard/team',
      color: 'from-cyan-500 to-cyan-600'
    },
    user?.role === 'studio_owner' && {
      icon: <BarChart3 className="w-6 h-6" />,
      label: 'Analytics',
      href: '/dashboard/analytics',
      color: 'from-indigo-500 to-indigo-600'
    },
    user?.role === 'admin' && {
      icon: <BarChart3 className="w-6 h-6" />,
      label: 'Admin Panel',
      href: '/dashboard/admin',
      color: 'from-red-500 to-red-600'
    },
  ].filter(Boolean);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-muted-foreground">
          {user?.role === 'customer' && 'Capture and preserve your precious memories in AR'}
          {user?.role === 'photographer' && 'Manage your photo sessions and portfolio'}
          {user?.role === 'studio_owner' && 'Manage your team and monitor analytics'}
          {user?.role === 'admin' && 'System administration and monitoring'}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, idx) => (
          <Link key={idx} href={action.href}>
            <div className="group card-glass cursor-pointer hover:shadow-2xl transition-all">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <h3 className="font-semibold text-foreground">{action.label}</h3>
              <p className="text-sm text-muted-foreground mt-1">Access now</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Total Albums" value="12" subtitle="Active sessions" icon={<Image className="w-6 h-6" />} />
        <Card title="Messages" value="3" subtitle="Unread" icon={<MessageSquare className="w-6 h-6" />} />
        <Card title="Subscription" value="Pro" subtitle="Active" icon={<CreditCard className="w-6 h-6" />} />
      </div>

      {/* Recent Activity */}
      <div className="card-glass">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Image className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-sm">New album created</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Recent</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-accent" />
              <div>
                <p className="font-medium text-sm">AR session completed</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}
