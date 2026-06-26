'use client';

import StatCards from '@/components/dashboard/stat-cards';
import { BarChart3, Building2, CreditCard, Folders, ScrollText, Settings, ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';

const quickLinks = [
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Studios', href: '/admin/studios', icon: Building2 },
  { label: 'Albums', href: '/admin/albums', icon: Folders },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Payments', href: '/admin/payments', icon: CreditCard },
  { label: 'Plans', href: '/admin/plans', icon: ShieldCheck },
  { label: 'Audit Logs', href: '/admin/logs', icon: ScrollText },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-white/50 text-sm mt-1">Platform overview and management.</p>
      </div>
      <StatCards items={[
        { label: 'Total Users', key: 'totalUsers' },
        { label: 'Studios',     key: 'totalStudios' },
        { label: 'Albums',      key: 'totalAlbums' },
        { label: 'QR Scans',    key: 'totalScans' },
      ]} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href}
            className="glass-effect rounded-2xl p-5 flex flex-col items-center gap-3 text-center hover:bg-white/10 transition-colors">
            <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-white/80 text-sm font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
