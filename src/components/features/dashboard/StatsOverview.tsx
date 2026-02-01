import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
interface StatsOverviewProps {
  stats: {
    label: string;
    value: string | number;
    icon: string;
    color: string;
  }[];
}
export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <Card key={idx}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`text-4xl ${stat.color}`}>{stat.icon}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
