'use client';

import { useAuth } from '@/lib/auth-context';
import { Album, Camera, CreditCard, QrCode } from 'lucide-react';
import Link from 'next/link';

const quickLinks = [
  { href: '/customer/albums',       icon: Album,    label: 'View Albums',  desc: 'Browse your photo albums' },
  { href: '/customer/ar-camera',    icon: Camera,   label: 'AR Camera',    desc: 'Launch AR experience' },
  { href: '/customer/qr-scan',      icon: QrCode,   label: 'Scan QR',      desc: 'Scan a QR code' },
  { href: '/customer/billing',      icon: CreditCard, label: 'Billing',    desc: 'Manage subscription' },
];

export default function CustomerDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-white/50 text-sm mt-1">Here&apos;s an overview of your memories.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="group glass-effect rounded-2xl p-5 flex flex-col gap-3 hover:border-primary/30 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">{label}</p>
              <p className="text-white/40 text-xs mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Albums — empty state until API data */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Recent Albums</h2>
        <div className="glass-effect rounded-2xl p-12 flex flex-col items-center text-center">
          <Album className="w-12 h-12 text-white/20 mb-4" />
          <p className="text-white/50 font-medium">No albums yet</p>
          <p className="text-white/30 text-sm mt-1">Albums shared with you will appear here.</p>
        </div>
      </div>
    </div>
  );
}
