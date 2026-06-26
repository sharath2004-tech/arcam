'use client';

import type { NavGroup } from '@/components/dashboard/nav-configs';
import { Sidebar } from '@/components/dashboard/sidebar';
import { useAuth, type UserRole } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RoleLayoutProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  navGroups: NavGroup[];
  settingsHref: string;
}

export default function RoleLayout({ children, allowedRoles, navGroups, settingsHref }: RoleLayoutProps) {
  const { user, isLoading, getDashboardPath } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      router.replace(getDashboardPath());
    }
  }, [user, isLoading, allowedRoles, router, getDashboardPath]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar navGroups={navGroups} settingsHref={settingsHref} />
      <main
        className="md:ml-64 min-h-screen"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 4rem)' }}
      >
        <div className="p-4 md:p-6 md:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
