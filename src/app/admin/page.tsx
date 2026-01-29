'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminGuard } from '@/components/auth/RoleGuard';
import { Loading } from '@/components/ui/Loading';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the full admin dashboard
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <AdminGuard>
      <Loading size="lg" text="Loading admin dashboard..." fullScreen />
    </AdminGuard>
  );
}

