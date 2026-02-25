'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { GradientButton } from '@/components/brand/GradientButton';
import { Badge } from '@/components/ui/Badge';

export default function CleanerWalletPage() {
  const [instant, setInstant] = useState(false);

  const availableUsd = 420.35;
  const payout = instant ? availableUsd * 0.95 : availableUsd;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="rounded-3xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-xs opacity-70">Available payout</div>
            <div className="text-3xl font-bold">${availableUsd.toFixed(2)}</div>
            <div className="mt-2 text-xs opacity-60">After approvals.</div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Payout method</div>
              <Badge
                className="rounded-full"
                style={{ background: 'rgba(0,120,255,0.12)', color: '#1D2533' }}
              >
                Stripe Connect
              </Badge>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className="rounded-full border px-4 py-2 text-sm"
                style={
                  !instant
                    ? {
                        backgroundImage: 'linear-gradient(90deg,#0078FF,#00D4FF)',
                        color: 'white',
                        borderColor: 'transparent',
                      }
                    : undefined
                }
                onClick={() => setInstant(false)}
              >
                Weekly (Free)
              </button>
              <button
                type="button"
                className="rounded-full border px-4 py-2 text-sm"
                style={
                  instant
                    ? {
                        backgroundImage: 'linear-gradient(90deg,#0078FF,#00D4FF)',
                        color: 'white',
                        borderColor: 'transparent',
                      }
                    : undefined
                }
                onClick={() => setInstant(true)}
              >
                Instant (5% fee)
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-3xl bg-slate-50 p-4">
              <div>
                <div className="text-xs opacity-70">You will receive</div>
                <div className="text-xl font-semibold">${payout.toFixed(2)}</div>
              </div>
              <GradientButton onClick={() => alert('Wire this to your payout endpoint')}>
                Request payout
              </GradientButton>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Rewards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm opacity-80">
          Next upgrades to add here:
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Reliability score gauge</li>
            <li>Tier perks + unlock progress</li>
            <li>Animated “credits earned” on approval</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
