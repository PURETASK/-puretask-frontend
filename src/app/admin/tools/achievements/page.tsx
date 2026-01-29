'use client';

import LegacyToolPage from '@/components/admin/LegacyToolPage';
import { AchievementDisplay } from '@/components/admin/legacy/components/AchievementDisplay';

export default function AdminToolsAchievementsPage() {
  return (
    <LegacyToolPage
      title="Achievements (Legacy)"
      description="Legacy achievements and progress UI."
    >
      <AchievementDisplay />
    </LegacyToolPage>
  );
}
