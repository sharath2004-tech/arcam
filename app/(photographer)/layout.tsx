import { RoleLayout } from '@/components/dashboard/role-layout';
import { photographerNav } from '@/components/dashboard/nav-configs';

export default function PhotographerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout
      allowedRoles={['photographer']}
      navGroups={photographerNav}
      settingsHref="/photographer/settings"
    >
      {children}
    </RoleLayout>
  );
}
