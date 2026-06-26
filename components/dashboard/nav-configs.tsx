import {
    Album,
    BarChart3,
    Bell,
    BookOpen,
    Calendar,
    Camera,
    CreditCard,
    FileText,
    Folders,
    Home,
    LayoutDashboard,
    QrCode,
    Settings,
    Shield,
    Star,
    Store,
    Users,
    Wallet
} from 'lucide-react';
import React from 'react';

export interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

// ─── Customer ───────────────────────────────────────────────────────────────

export const customerNav: NavGroup[] = [
  {
    items: [
      { icon: React.createElement(Home, { className: 'w-5 h-5' }), label: 'Dashboard', href: '/customer' },
      { icon: React.createElement(Album, { className: 'w-5 h-5' }), label: 'My Albums', href: '/customer/albums' },
      { icon: React.createElement(Camera, { className: 'w-5 h-5' }), label: 'AR Camera', href: '/customer/ar-camera' },
      { icon: React.createElement(QrCode, { className: 'w-5 h-5' }), label: 'Scan QR', href: '/customer/qr-scan' },
    ],
  },
  {
    title: 'Account',
    items: [
      { icon: React.createElement(Bell, { className: 'w-5 h-5' }), label: 'Notifications', href: '/customer/notifications' },
      { icon: React.createElement(CreditCard, { className: 'w-5 h-5' }), label: 'Billing', href: '/customer/billing' },
      { icon: React.createElement(Settings, { className: 'w-5 h-5' }), label: 'Settings', href: '/customer/settings' },
    ],
  },
];

// ─── Photographer ─────────────────────────────────────────────────────────────

export const photographerNav: NavGroup[] = [
  {
    items: [
      { icon: React.createElement(LayoutDashboard, { className: 'w-5 h-5' }), label: 'Dashboard', href: '/photographer' },
      { icon: React.createElement(Folders, { className: 'w-5 h-5' }), label: 'Albums', href: '/photographer/albums' },
      { icon: React.createElement(Calendar, { className: 'w-5 h-5' }), label: 'Events', href: '/photographer/events' },
      { icon: React.createElement(Users, { className: 'w-5 h-5' }), label: 'Customers', href: '/photographer/customers' },
      { icon: React.createElement(QrCode, { className: 'w-5 h-5' }), label: 'QR Codes', href: '/photographer/qr-codes' },
    ],
  },
  {
    title: 'Business',
    items: [
      { icon: React.createElement(Star, { className: 'w-5 h-5' }), label: 'Portfolio', href: '/photographer/portfolio' },
      { icon: React.createElement(BarChart3, { className: 'w-5 h-5' }), label: 'Analytics', href: '/photographer/analytics' },
      { icon: React.createElement(Wallet, { className: 'w-5 h-5' }), label: 'Billing', href: '/photographer/billing' },
      { icon: React.createElement(Settings, { className: 'w-5 h-5' }), label: 'Settings', href: '/photographer/settings' },
    ],
  },
];

// ─── Studio Manager / Staff ─────────────────────────────────────────────────

export const studioNav: NavGroup[] = [
  {
    items: [
      { icon: React.createElement(Store, { className: 'w-5 h-5' }), label: 'Dashboard', href: '/studio' },
      { icon: React.createElement(Users, { className: 'w-5 h-5' }), label: 'Team', href: '/studio/team' },
      { icon: React.createElement(Folders, { className: 'w-5 h-5' }), label: 'Albums', href: '/studio/albums' },
      { icon: React.createElement(Calendar, { className: 'w-5 h-5' }), label: 'Bookings', href: '/studio/bookings' },
    ],
  },
  {
    title: 'Studio',
    items: [
      { icon: React.createElement(BarChart3, { className: 'w-5 h-5' }), label: 'Analytics', href: '/studio/analytics' },
      { icon: React.createElement(CreditCard, { className: 'w-5 h-5' }), label: 'Billing', href: '/studio/billing' },
      { icon: React.createElement(Settings, { className: 'w-5 h-5' }), label: 'Settings', href: '/studio/settings' },
    ],
  },
];

// ─── Admin / Super Admin ─────────────────────────────────────────────────────

export const adminNav: NavGroup[] = [
  {
    items: [
      { icon: React.createElement(Shield, { className: 'w-5 h-5' }), label: 'Dashboard', href: '/admin' },
      { icon: React.createElement(Users, { className: 'w-5 h-5' }), label: 'Users', href: '/admin/users' },
      { icon: React.createElement(Store, { className: 'w-5 h-5' }), label: 'Studios', href: '/admin/studios' },
      { icon: React.createElement(Folders, { className: 'w-5 h-5' }), label: 'Albums', href: '/admin/albums' },
    ],
  },
  {
    title: 'Platform',
    items: [
      { icon: React.createElement(BarChart3, { className: 'w-5 h-5' }), label: 'Analytics', href: '/admin/analytics' },
      { icon: React.createElement(CreditCard, { className: 'w-5 h-5' }), label: 'Payments', href: '/admin/payments' },
      { icon: React.createElement(BookOpen, { className: 'w-5 h-5' }), label: 'Plans', href: '/admin/plans' },
      { icon: React.createElement(FileText, { className: 'w-5 h-5' }), label: 'Audit Logs', href: '/admin/logs' },
      { icon: React.createElement(Settings, { className: 'w-5 h-5' }), label: 'Settings', href: '/admin/settings' },
    ],
  },
];
