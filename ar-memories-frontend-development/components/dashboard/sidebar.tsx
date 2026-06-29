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
    MessageSquare,
    QrCode,
    Settings,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  roles: UserRole[];
}

const navigationItems: NavItem[] = [
  // All users
  { icon: <Home className="w-5 h-5" />, label: 'Dashboard', href: '/dashboard', roles: ['customer', 'photographer', 'studio_owner', 'admin'] },
  
  // Customer
  { icon: <Image className="w-5 h-5" />, label: 'My Albums', href: '/dashboard/albums', roles: ['customer'] },
  { icon: <Camera className="w-5 h-5" />, label: 'AR Camera', href: '/dashboard/ar-camera', roles: ['customer', 'photographer'] },
  { icon: <QrCode className="w-5 h-5" />, label: 'QR Codes', href: '/dashboard/qr-codes', roles: ['customer', 'photographer'] },
  { icon: <MessageSquare className="w-5 h-5" />, label: 'Messages', href: '/dashboard/messages', roles: ['customer', 'photographer', 'studio_owner'] },
  { icon: <CreditCard className="w-5 h-5" />, label: 'Billing', href: '/dashboard/billing', roles: ['customer', 'photographer', 'studio_owner'] },
  
  // Photographer
  { icon: <FileText className="w-5 h-5" />, label: 'Portfolio', href: '/dashboard/portfolio', roles: ['photographer'] },
  { icon: <Users className="w-5 h-5" />, label: 'Customers', href: '/dashboard/customers', roles: ['photographer'] },
  
  // Studio Owner
  { icon: <Users className="w-5 h-5" />, label: 'Team', href: '/dashboard/team', roles: ['studio_owner', 'admin'] },
  { icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics', href: '/dashboard/analytics', roles: ['studio_owner', 'admin'] },
  
  // Admin
  { icon: <BarChart3 className="w-5 h-5" />, label: 'Admin Panel', href: '/dashboard/admin', roles: ['admin'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const visibleItems = navigationItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <aside className="glass-effect fixed left-0 top-0 h-screen w-64 border-r border-border flex flex-col py-6 px-4 z-40">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Camera className="w-6 h-6 text-primary-foreground" />
        </div>
        <span className="font-bold text-lg text-gradient">AR Memories</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="space-y-3 border-t border-border pt-4">
        <div className="px-4">
          <p className="text-xs text-muted-foreground">Logged in as</p>
          <p className="font-semibold text-sm text-foreground truncate">{user?.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{user?.role.replace('_', ' ')}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={logout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
        <Link href="/dashboard/settings" className="block">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </Link>
      </div>
    </aside>
  );
}
