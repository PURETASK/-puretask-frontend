'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { MapPin, Globe, Calendar } from 'lucide-react';
import { gamificationAdminService, type GamificationFlagKey } from '@/services/gamificationAdmin.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const FLAG_LABELS: Record<GamificationFlagKey, string> = {
  gamification_enabled: 'Gamification enabled',
  rewards_enabled: 'Rewards enabled',
  cash_rewards_enabled: 'Cash rewards enabled',
  seasonal_enabled: 'Seasonal / time-limited rewards',
  governor_enabled: 'Marketplace Health Governor',
};

const DEFAULT_FLAGS: Record<GamificationFlagKey, boolean> = {
  gamification_enabled: true,
  rewards_enabled: true,
  cash_rewards_enabled: false,
  seasonal_enabled: true,
  governor_enabled: true,
};

export default function AdminFlagsPage() {
  const queryClient = useQueryClient();
  const { data: flagsData } = useQuery({
    queryKey: ['admin', 'gamification', 'flags'],
    queryFn: () => gamificationAdminService.getFlags(),
  });
  const [flags, setFlags] = useState<Record<GamificationFlagKey, boolean>>(DEFAULT_FLAGS);
  const [regionOverrides, setRegionOverrides] = useState<Record<string, boolean>>({});
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    if (flagsData) {
      setFlags((prev) => ({
        ...prev,
        gamification_enabled: flagsData.gamification_enabled ?? prev.gamification_enabled,
        rewards_enabled: flagsData.rewards_enabled ?? prev.rewards_enabled,
        cash_rewards_enabled: flagsData.cash_rewards_enabled ?? prev.cash_rewards_enabled,
        seasonal_enabled: flagsData.seasonal_enabled ?? prev.seasonal_enabled,
        governor_enabled: flagsData.governor_enabled ?? prev.governor_enabled,
      }));
    }
  }, [flagsData]);

  const { mutate: saveFlags, isPending: saving } = useMutation({
    mutationFn: (payload: Record<string, boolean>) => gamificationAdminService.updateFlags(payload),
    onSuccess: (data) => {
      if (data) setFlags((prev) => ({ ...prev, ...data }));
      queryClient.invalidateQueries({ queryKey: ['admin', 'gamification', 'flags'] });
    },
  });

  const setFlag = (key: GamificationFlagKey, value: boolean) => {
    setFlags((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    saveFlags(flags);
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <Link href="/admin/gamification" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
              ← Gamification Overview
            </Link>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Feature Flags & Kill Switches</h1>
                <p className="text-gray-600 mt-1">
                  Turn gamification, rewards, and the governor on or off globally or per region.
                </p>
              </div>
              <Button variant="primary" onClick={handleSave} isLoading={saving}>
                Save changes
              </Button>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Global toggles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(Object.keys(FLAG_LABELS) as GamificationFlagKey[]).map((key) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-sm font-medium text-gray-900">{FLAG_LABELS[key]}</span>
                    <Toggle
                      checked={flags[key]}
                      onChange={(checked) => setFlag(key, checked)}
                      size="md"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRegionOverrides((p) => ({ ...p, 'north': !p['north'] }))}
                  className="inline-flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Enable in region
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFlags((p) => ({ ...p, gamification_enabled: false, rewards_enabled: false }))}
                  className="inline-flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  Disable globally
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowScheduleModal(true)}
                  className="inline-flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule enable window
                </Button>
              </CardContent>
            </Card>

            {Object.keys(regionOverrides).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Regional overrides</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Configure per-region overrides in Governor or settings. Placeholder: region toggles would list here.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      {showScheduleModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowScheduleModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule enable window</h3>
            <p className="text-sm text-gray-600 mb-4">
              Set a time window when a flag is enabled (e.g. seasonal rewards from Dec 1–31). Backend integration pending.
            </p>
            <Button variant="primary" onClick={() => setShowScheduleModal(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
