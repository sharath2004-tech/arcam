'use client';

import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { Camera, LogOut, Menu, Settings, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import type { NavGroup } from './nav-configs';

interface SidebarProps {
  navGroups: NavGroup[];
  settingsHref: string;
}

function NavGroupSection({
  group, pathname, onNavigate, indexOffset = 0,
}: { group: NavGroup; pathname: string; onNavigate?: () => void; indexOffset?: number }) {
  return (
    <div className="mb-4">
      {group.title && (
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/30 px-4 mb-1">
          {group.title}
        </p>
      )}
      <nav className="space-y-0.5">
        {group.items.map((item, idx) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'nav-item-animate flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium',
                isActive ? 'bg-primary/15 text-primary' : 'text-white/60 hover:text-white hover:bg-white/8'
              )}
              style={{ animationDelay: `${(indexOffset + idx) * 50}ms` }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function Sidebar({ navGroups, settingsHref }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, getDashboardPath } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    router.push('/login');
  };

  const content = (
    <div className="flex flex-col h-full py-6 px-4">
      <div className="flex items-center justify-between mb-8">
        <Link href={getDashboardPath()} className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}>
            <Camera className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-base text-white">AR Memories</span>
        </Link>
        <button className="md:hidden p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
          onClick={() => setMobileOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {navGroups.map((group, i) => {
          const offset = navGroups.slice(0, i).reduce((sum, g) => sum + g.items.length, 0);
          return (
            <NavGroupSection key={i} group={group} pathname={pathname} onNavigate={() => setMobileOpen(false)} indexOffset={offset} />
          );
        })}
      </div>

      <div className="border-t border-white/10 pt-4 mt-4 space-y-1">
        <div className="px-4 mb-3">
          <p className="font-semibold text-sm text-white truncate">{user?.name}</p>
          <p className="text-xs text-white/40 capitalize">{user?.role?.replace(/_/g, ' ')}</p>
        </div>
        <Link href={settingsHref} onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/8 transition-all">
          <Settings className="w-4 h-4" />Settings
        </Link>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/8 transition-all w-full text-left">
          <LogOut className="w-4 h-4" />Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col bg-black/60 backdrop-blur-xl border-r border-white/10 z-40">
        {content}
      </aside>

      <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 bg-black/75 backdrop-blur-xl border-b border-white/10"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: '0.75rem' }}>
        <button className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
          onClick={() => setMobileOpen(true)}>
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-semibold text-white text-sm">AR Memories</span>
        <Link href={settingsHref} className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all">
          <Settings className="w-5 h-5" />
        </Link>
      </header>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 h-full bg-black/90 backdrop-blur-xl border-r border-white/10 flex flex-col overflow-y-auto">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
