'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/admin/legacy/AdminLayout';

export default function AdminToolsLegacyLayoutPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-900">Legacy Admin Layout Preview</h1>
          <p className="text-sm text-gray-700 mt-2">
            This is the old sidebar-based admin layout. It’s been migrated for testing only.
          </p>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
