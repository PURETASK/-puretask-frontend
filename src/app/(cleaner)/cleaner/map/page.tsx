'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CleanerMap } from '@/components/maps/CleanerMap';
import { getCleanerNextJob } from '@/services/cleaner';
import { GradientButton } from '@/components/brand/GradientButton';
import { useRouter } from 'next/navigation';

export default function CleanerMapPage() {
  const r = useRouter();
  const [next, setNext] = useState<{
    jobId: string;
    lat: number;
    lng: number;
    addressLabel: string;
  } | null>(null);
  const [cleaner, setCleaner] = useState<{ lat: number; lng: number } | undefined>(undefined);

  useEffect(() => {
    getCleanerNextJob()
      .then(setNext)
      .catch(() => setNext(null));
  }, []);

  useEffect(() => {
    const id = navigator.geolocation.watchPosition(
      (p) => setCleaner({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  if (!next) return <div className="text-sm opacity-70">Loading next job…</div>;

  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Directions to next appointment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CleanerMap
          dest={{ lat: next.lat, lng: next.lng, label: next.addressLabel }}
          cleaner={cleaner}
        />
        <GradientButton onClick={() => r.push(`/cleaner/job/${next.jobId}/workflow`)}>
          Start job workflow
        </GradientButton>
      </CardContent>
    </Card>
  );
}
