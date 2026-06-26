import { photographerNav } from '@/components/dashboard/nav-configs';
import RoleLayout from '@/components/dashboard/role-layout';

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
