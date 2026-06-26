'use client';

import RoleLayout from '@/components/dashboard/role-layout';
import { studioNav } from '@/components/dashboard/nav-configs';

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout allowedRoles={['studio_manager', 'staff']} navGroups={studioNav} settingsHref="/studio/settings">
      {children}
    </RoleLayout>
  );
}
