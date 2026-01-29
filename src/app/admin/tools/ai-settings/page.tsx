'use client';

import LegacyToolPage from '@/components/admin/LegacyToolPage';
import CleanerAISettings from '@/components/admin/legacy/CleanerAISettings';

export default function AdminToolsAISettingsPage() {
  return (
    <LegacyToolPage
      title="Cleaner AI Settings (Legacy)"
      description="Legacy AI settings UI migrated for testing."
    >
      <CleanerAISettings />
    </LegacyToolPage>
  );
}
