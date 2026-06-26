'use client';

import { useAuth } from '@/lib/auth-context';
import { BarChart3, Calendar, Folders, QrCode, Users } from 'lucide-react';
import Link from 'next/link';

const quickLinks = [
  { href: '/photographer/albums',    icon: Folders,   label: 'Albums',    desc: 'Manage photo albums' },
  { href: '/photographer/events',    icon: Calendar,  label: 'Events',    desc: 'Upcoming shoots' },
  { href: '/photographer/customers', icon: Users,     label: 'Customers', desc: 'Your client list' },
  { href: '/photographer/qr-codes',  icon: QrCode,    label: 'QR Codes',  desc: 'Generate QR codes' },
  { href: '/photographer/analytics', icon: BarChart3, label: 'Analytics', desc: 'Revenue & engagement' },
];

export default function PhotographerDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Studio Dashboard</h1>
        <p className="text-white/50 text-sm mt-1">Welcome back, {user?.name?.split(' ')[0]}. Here&apos;s your overview.</p>
      </div>

      {/* Stats — will populate from API */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Albums', value: '—' },
          { label: 'Total Customers', value: '—' },
          { label: 'QR Scans', value: '—' },
          { label: 'Revenue', value: '—' },
        ].map(({ label, value }) => (
          <div key={label} className="glass-effect rounded-2xl p-5">
            <p className="text-white/40 text-xs mb-2">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {quickLinks.map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="group glass-effect rounded-2xl p-5 flex items-center gap-4 hover:border-primary/30 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">{label}</p>
              <p className="text-white/40 text-xs">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
