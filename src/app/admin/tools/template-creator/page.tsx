'use client';

import LegacyToolPage from '@/components/admin/LegacyToolPage';
import { TemplateCreator } from '@/components/admin/legacy/components/TemplateCreator';

export default function AdminToolsTemplateCreatorPage() {
  return (
    <LegacyToolPage
      title="Template Creator (Legacy)"
      description="Legacy template builder for cleaner communications."
    >
      <TemplateCreator />
    </LegacyToolPage>
  );
}
