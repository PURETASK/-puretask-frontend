'use client';

import LegacyToolPage from '@/components/admin/LegacyToolPage';
import { Leaderboard } from '@/components/admin/legacy/components/Leaderboard';

export default function AdminToolsLeaderboardPage() {
  return (
    <LegacyToolPage
      title="Leaderboard (Legacy)"
      description="Legacy leaderboard UI preview."
    >
      <Leaderboard />
    </LegacyToolPage>
  );
}
