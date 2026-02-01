'use client';

import LegacyToolPage from '@/components/admin/LegacyToolPage';
import { TooltipSystem } from '@/components/admin/legacy/components/TooltipSystem';

export default function AdminToolsTooltipsPage() {
  return (
    <LegacyToolPage
      title="Tooltip System (Legacy)"
      description="Legacy guided tooltip system preview."
    >
      <div className="relative min-h-[400px]">
        <div className="p-6 bg-gray-100 rounded-lg">
          <p className="text-gray-700">
            Tooltip demo: set <code className="bg-white px-1 rounded">showAll</code> to preview all tooltips.
          </p>
        </div>
        <TooltipSystem showAll />
      </div>
    </LegacyToolPage>
  );
}
