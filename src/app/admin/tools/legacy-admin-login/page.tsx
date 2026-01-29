'use client';

import LegacyToolPage from '@/components/admin/LegacyToolPage';
import AdminLogin from '@/components/admin/legacy/AdminLogin';

export default function AdminToolsLegacyLoginPage() {
  return (
    <LegacyToolPage
      title="Legacy Admin Login (Preview)"
      description="Legacy admin login page, kept for testing visuals."
    >
      <AdminLogin />
    </LegacyToolPage>
  );
}
