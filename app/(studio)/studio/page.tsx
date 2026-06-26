'use client';

import { useAuth } from '@/lib/auth-context';
import { BarChart3, CalendarCheck, Folders, Users } from 'lucide-react';
import Link from 'next/link';

const quickLinks = [
  { label: 'Team', href: '/studio/team', icon: Users },
  { label: 'Albums', href: '/studio/albums', icon: Folders },
  { label: 'Bookings', href: '/studio/bookings', icon: CalendarCheck },
  { label: 'Analytics', href: '/studio/analytics', icon: BarChart3 },
];

export default function StudioDashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Studio Dashboard</h1>
        <p className="text-white/50 text-sm mt-1">Welcome back, {user?.name ?? 'there'}.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Albums', 'Team Members', 'Bookings', 'QR Scans'].map(label => (
          <div key={label} className="glass-effect rounded-2xl p-5">
            <p className="text-white/40 text-xs mb-2">{label}</p>
            <p className="text-2xl font-bold text-white">—</p>
          </div>
        ))}
      </div>
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
