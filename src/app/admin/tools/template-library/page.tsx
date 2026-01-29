'use client';

import LegacyToolPage from '@/components/admin/LegacyToolPage';
import TemplateLibraryUI from '@/components/admin/legacy/components/TemplateLibraryUI';

export default function AdminToolsTemplateLibraryPage() {
  return (
    <LegacyToolPage
      title="Template Library (Legacy)"
      description="Legacy marketplace UI for shared templates."
    >
      <TemplateLibraryUI />
    </LegacyToolPage>
  );
}
