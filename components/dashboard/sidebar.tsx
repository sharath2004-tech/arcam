'use client';

import { Button } from '@/components/ui/button-glass';
import { useAuth, type UserRole } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import {
    BarChart3, Camera,
    CreditCard,
    FileText,
    Home, Image,
    LogOut,
    Menu,
    MessageSquare,
    QrCode,
    Settings,
    Users,
    X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  roles: UserRole[];
}

const navigationItems: NavItem[] = [
  { icon: <Home className="w-5 h-5" />, label: 'Dashboard', href: '/dashboard', roles: ['customer', 'photographer', 'studio_owner', 'admin'] },
  { icon: <Image className="w-5 h-5" />, label: 'My Albums', href: '/dashboard/albums', roles: ['customer'] },
  { icon: <Camera className="w-5 h-5" />, label: 'AR Camera', href: '/dashboard/ar-camera', roles: ['customer', 'photographer'] },
  { icon: <QrCode className="w-5 h-5" />, label: 'QR Codes', href: '/dashboard/qr-codes', roles: ['customer', 'photographer'] },
  { icon: <MessageSquare className="w-5 h-5" />, label: 'Messages', href: '/dashboard/messages', roles: ['customer', 'photographer', 'studio_owner'] },
  { icon: <CreditCard className="w-5 h-5" />, label: 'Billing', href: '/dashboard/billing', roles: ['customer', 'photographer', 'studio_owner'] },
  { icon: <FileText className="w-5 h-5" />, label: 'Portfolio', href: '/dashboard/portfolio', roles: ['photographer'] },
  { icon: <Users className="w-5 h-5" />, label: 'Team', href: '/dashboard/team', roles: ['studio_owner', 'admin'] },
  { icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics', href: '/dashboard/analytics', roles: ['studio_owner', 'admin'] },
  { icon: <BarChart3 className="w-5 h-5" />, label: 'Admin Panel', href: '/dashboard/admin', roles: ['admin'] },
];

function NavLinks({ items, pathname, onNavigate }: { items: NavItem[]; pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-1">
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium',
              isActive
                ? 'bg-primary/15 text-primary'
                : 'text-white/60 hover:text-white hover:bg-white/8'
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleItems = navigationItems.filter(item =>
    user && item.roles.includes(user.role)
  );

  const sidebarContent = (
    <div className="flex flex-col h-full py-6 px-4">
      {/* Logo */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}
          >
            <Camera className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-base text-white">VR Album</span>
        </Link>
        {/* Close button — mobile only */}
        <button
          className="md:hidden p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
          onClick={() => setMobileOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <NavLinks items={visibleItems} pathname={pathname} onNavigate={() => setMobileOpen(false)} />

      {/* User Info & Actions */}
      <div className="space-y-2 border-t border-white/10 pt-4 mt-4">
        <div className="px-4 mb-2">
          <p className="text-xs text-white/40">Logged in as</p>
          <p className="font-semibold text-sm text-white truncate">{user?.name}</p>
          <p className="text-xs text-white/40 capitalize">{user?.role?.replace('_', ' ')}</p>
        </div>
        <Link href="/dashboard/settings" onClick={() => setMobileOpen(false)}>
          <Button variant="ghost" className="w-full justify-start gap-2 text-white/60 hover:text-white hover:bg-white/8">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-white/60 hover:text-white hover:bg-white/8"
          onClick={() => { logout(); setMobileOpen(false); }}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col bg-black/60 backdrop-blur-xl border-r border-white/10 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile top bar */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 bg-black/75 backdrop-blur-xl border-b border-white/10"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: '0.75rem', marginTop: '0' }}
      >
        <button
          className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-semibold text-white text-sm">VR Album</span>
        <Link href="/dashboard/settings" className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all">
          <Settings className="w-5 h-5" />
        </Link>
      </header>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative w-72 h-full bg-black/90 backdrop-blur-xl border-r border-white/10 flex flex-col overflow-y-auto">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}


