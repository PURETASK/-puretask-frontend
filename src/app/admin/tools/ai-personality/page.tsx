'use client';

import LegacyToolPage from '@/components/admin/LegacyToolPage';
import { AIPersonalityWizard } from '@/components/admin/legacy/components/AIPersonalityWizard';

export default function AdminToolsAIPersonalityPage() {
  return (
    <LegacyToolPage
      title="AI Personality Wizard (Legacy)"
      description="Wizard UI for AI tone and automation settings."
    >
      <AIPersonalityWizard onComplete={async () => {}} onSkip={() => {}} />
    </LegacyToolPage>
  );
}
