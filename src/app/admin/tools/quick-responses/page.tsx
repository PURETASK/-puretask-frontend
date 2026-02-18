'use client';

import React, { useState } from 'react';
import LegacyToolPage from '@/components/admin/LegacyToolPage';
import { QuickResponseManager, type QuickResponse } from '@/components/admin/legacy/components/QuickResponseManager';

export default function AdminToolsQuickResponsesPage() {
  const [responses, setResponses] = useState<QuickResponse[]>([]);

  return (
    <LegacyToolPage
      title="Quick Response Manager (Legacy)"
      description="Legacy quick responses UI for messaging."
    >
      <QuickResponseManager
        responses={responses}
        onAdd={async (r) => {
          setResponses((prev) => [
            ...prev,
            { ...r, id: crypto.randomUUID(), usageCount: 0 },
          ]);
        }}
        onEdit={async (id, r) => {
          setResponses((prev) =>
            prev.map((x) => (x.id === id ? { ...x, ...r } : x))
          );
        }}
        onDelete={async (id) => {
          setResponses((prev) => prev.filter((x) => x.id !== id));
        }}
        onToggleFavorite={async (id) => {
          setResponses((prev) =>
            prev.map((x) => (x.id === id ? { ...x, favorite: !x.favorite } : x))
          );
        }}
      />
    </LegacyToolPage>
  );
}
