'use client';

import { Sidebar } from '@/components/dashboard/sidebar';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* Desktop: offset for fixed sidebar. Mobile: offset for fixed top bar */}
      <main className="flex-1 md:ml-64 bg-background">
        <div
          className="p-4 md:p-8"
          style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 4rem)' }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutContent>{children}</DashboardLayoutContent>;
}

