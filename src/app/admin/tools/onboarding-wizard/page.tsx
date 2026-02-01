'use client';

import LegacyToolPage from '@/components/admin/LegacyToolPage';
import { InteractiveOnboardingWizard } from '@/components/admin/legacy/components/InteractiveOnboardingWizard';

export default function AdminToolsOnboardingWizardPage() {
  return (
    <LegacyToolPage
      title="Interactive Onboarding Wizard (Legacy)"
      description="Legacy multi-step onboarding wizard preview."
    >
      <InteractiveOnboardingWizard />
    </LegacyToolPage>
  );
}
