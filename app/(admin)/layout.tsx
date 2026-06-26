'use client';

import RoleLayout from '@/components/dashboard/role-layout';
import { adminNav } from '@/components/dashboard/nav-configs';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout allowedRoles={['admin', 'super_admin']} navGroups={adminNav} settingsHref="/admin/settings">
      {children}
    </RoleLayout>
  );
}
