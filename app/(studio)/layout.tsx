'use client';

import { studioNav } from '@/components/dashboard/nav-configs';
import RoleLayout from '@/components/dashboard/role-layout';

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout allowedRoles={['studio_manager', 'staff']} navGroups={studioNav} settingsHref="/studio/settings">
      {children}
    </RoleLayout>
  );
}
