import { RoleLayout } from '@/components/dashboard/role-layout';
import { customerNav } from '@/components/dashboard/nav-configs';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout
      allowedRoles={['customer']}
      navGroups={customerNav}
      settingsHref="/customer/settings"
    >
      {children}
    </RoleLayout>
  );
}
