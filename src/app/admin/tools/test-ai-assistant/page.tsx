'use client';

import LegacyToolPage from '@/components/admin/LegacyToolPage';
import TestAIAssistant from '@/components/admin/legacy/components/TestAIAssistant';

export default function AdminToolsTestAIAssistantPage() {
  return (
    <LegacyToolPage
      title="Test AI Assistant (Legacy)"
      description="Legacy AI assistant sandbox for QA."
    >
      <TestAIAssistant />
    </LegacyToolPage>
  );
}
