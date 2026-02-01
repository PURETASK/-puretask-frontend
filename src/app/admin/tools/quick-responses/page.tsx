'use client';

import LegacyToolPage from '@/components/admin/LegacyToolPage';
import { QuickResponseManager } from '@/components/admin/legacy/components/QuickResponseManager';

export default function AdminToolsQuickResponsesPage() {
  return (
    <LegacyToolPage
      title="Quick Response Manager (Legacy)"
      description="Legacy quick responses UI for messaging."
    >
      <QuickResponseManager />
    </LegacyToolPage>
  );
}
