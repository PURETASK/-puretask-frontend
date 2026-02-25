'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { GradientButton } from '@/components/brand/GradientButton';
import { useRouter } from 'next/navigation';

export default function ClientAddressPage() {
  const r = useRouter();
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('CA');
  const [zip, setZip] = useState('');

  const ok = line1.length > 4 && city.length > 1 && zip.length >= 5;

  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Enter your address</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          className="h-12 rounded-2xl"
          placeholder="123 Main St"
          value={line1}
          onChange={(e) => setLine1(e.target.value)}
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <Input
            className="h-12 rounded-2xl"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Input
            className="h-12 rounded-2xl"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <Input
            className="h-12 rounded-2xl"
            placeholder="ZIP"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />
        </div>

        <GradientButton
          disabled={!ok}
          onClick={() => {
            r.push('/client/job/demo-job-id');
          }}
        >
          Continue
        </GradientButton>
      </CardContent>
    </Card>
  );
}
