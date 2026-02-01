'use client';

import React, { useState } from 'react';
import LegacyToolPage from '@/components/admin/LegacyToolPage';
import { SettingsCard } from '@/components/admin/legacy/components/SettingsCard';

export default function AdminToolsSettingsCardPage() {
  const [enabled, setEnabled] = useState(true);
  const [maxBookings, setMaxBookings] = useState(5);
  const [tone, setTone] = useState('friendly');

  return (
    <LegacyToolPage
      title="Settings Card Demo (Legacy)"
      description="Legacy settings card components with sample data."
    >
      <div className="grid md:grid-cols-2 gap-4">
        <SettingsCard
          title="Auto-reply Enabled"
          description="Automatically respond to clients during business hours."
          value={enabled}
          onChange={(value) => setEnabled(Boolean(value))}
          icon="🤖"
          badge="BETA"
        />
        <SettingsCard
          title="Max Bookings Per Day"
          description="Limit the number of bookings allowed daily."
          value={maxBookings}
          type="number"
          min={1}
          max={10}
          onChange={(value) => setMaxBookings(Number(value))}
          icon="📅"
        />
        <SettingsCard
          title="Communication Tone"
          description="Preferred AI communication style."
          value={tone}
          type="select"
          options={[
            { value: 'friendly', label: 'Friendly' },
            { value: 'professional', label: 'Professional' },
            { value: 'casual', label: 'Casual' },
          ]}
          onChange={(value) => setTone(String(value))}
          icon="💬"
        />
      </div>
    </LegacyToolPage>
  );
}
