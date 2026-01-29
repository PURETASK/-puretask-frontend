'use client';

import LegacyToolPage from '@/components/admin/LegacyToolPage';
import { InsightsDashboard } from '@/components/admin/legacy/components/InsightsDashboard';

export default function AdminToolsInsightsPage() {
  return (
    <LegacyToolPage
      title="AI Insights (Legacy)"
      description="Legacy analytics dashboard for AI performance."
    >
      <InsightsDashboard />
    </LegacyToolPage>
  );
}
