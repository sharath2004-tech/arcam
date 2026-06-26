'use client';

import { adminNav } from '@/components/dashboard/nav-configs';
import RoleLayout from '@/components/dashboard/role-layout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout allowedRoles={['admin', 'super_admin']} navGroups={adminNav} settingsHref="/admin/settings">
      {children}
    </RoleLayout>
  );
}
