'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface LineChartProps {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  showGrid?: boolean;
}

export function LineChart({ data, title, height = 300, showGrid = true }: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent className="flex items-center justify-center" style={{ height }}>
          <p className="text-gray-500">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="relative" style={{ height }}>
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-500">
            <span>{maxValue.toFixed(0)}</span>
            <span>{((maxValue + minValue) / 2).toFixed(0)}</span>
            <span>{minValue.toFixed(0)}</span>
          </div>

          {/* Chart area */}
          <div className="ml-12 mr-4 h-full pb-8 relative">
            {/* Grid lines */}
            {showGrid && (
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-b border-gray-200" />
                ))}
              </div>
            )}

            {/* Line path */}
            <svg className="absolute inset-0 w-full h-full">
              <polyline
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                points={data
                  .map((point, i) => {
                    const x = (i / (data.length - 1)) * 100;
                    const y = 100 - ((point.value - minValue) / range) * 100;
                    return `${x}%,${y}%`;
                  })
                  .join(' ')}
              />
              {/* Data points */}
              {data.map((point, i) => {
                const x = (i / (data.length - 1)) * 100;
                const y = 100 - ((point.value - minValue) / range) * 100;
                return (
                  <circle
                    key={i}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="4"
                    fill="#3B82F6"
                    className="hover:r-6 transition-all cursor-pointer"
                  >
                    <title>
                      {point.label}: {point.value}
                    </title>
                  </circle>
                );
              })}
            </svg>
          </div>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-12 right-4 flex justify-between text-xs text-gray-500">
            {data.map((point, i) => (
              <span key={i} className="transform -rotate-45 origin-top-left">
                {point.label}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface BarChartProps {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  horizontal?: boolean;
}

export function BarChart({ data, title, height = 300, horizontal = false }: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent className="flex items-center justify-center" style={{ height }}>
          <p className="text-gray-500">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div style={{ height }} className="flex flex-col justify-between">
          {data.map((point, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-24 text-sm text-gray-700 truncate">{point.label}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                <div
                  className="h-full rounded-full flex items-center justify-end px-3 text-white text-sm font-medium transition-all duration-500"
                  style={{
                    width: `${(point.value / maxValue) * 100}%`,
                    backgroundColor: point.color || '#3B82F6',
                  }}
                >
                  {point.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface PieChartProps {
  data: ChartDataPoint[];
  title?: string;
  size?: number;
}

export function PieChart({ data, title, size = 300 }: PieChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent className="flex items-center justify-center" style={{ height: size }}>
          <p className="text-gray-500">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((sum, point) => sum + point.value, 0);
  const colors = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#EC4899',
    '#14B8A6',
  ];

  let currentAngle = 0;
  const paths = data.map((point, i) => {
    const percentage = (point.value / total) * 100;
    const angle = (point.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    const startX = Math.cos((startAngle - 90) * (Math.PI / 180)) * 100 + 100;
    const startY = Math.sin((startAngle - 90) * (Math.PI / 180)) * 100 + 100;
    const endX = Math.cos((endAngle - 90) * (Math.PI / 180)) * 100 + 100;
    const endY = Math.sin((endAngle - 90) * (Math.PI / 180)) * 100 + 100;

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = `
      M 100 100
      L ${startX} ${startY}
      A 100 100 0 ${largeArc} 1 ${endX} ${endY}
      Z
    `;

    currentAngle += angle;

    return {
      path: pathData,
      color: point.color || colors[i % colors.length],
      label: point.label,
      value: point.value,
      percentage,
    };
  });

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="flex items-center gap-8">
          <svg width={size} height={size} viewBox="0 0 200 200">
            {paths.map((path, i) => (
              <path
                key={i}
                d={path.path}
                fill={path.color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <title>
                  {path.label}: {path.value} ({path.percentage.toFixed(1)}%)
                </title>
              </path>
            ))}
          </svg>

          <div className="flex-1 space-y-2">
            {paths.map((path, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: path.color }}
                />
                <span className="flex-1 text-gray-700">{path.label}</span>
                <span className="font-medium text-gray-900">
                  {path.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DonutChartProps extends PieChartProps {
  centerText?: string;
  centerSubtext?: string;
}

export function DonutChart({
  data,
  title,
  size = 300,
  centerText,
  centerSubtext,
}: DonutChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent className="flex items-center justify-center" style={{ height: size }}>
          <p className="text-gray-500">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((sum, point) => sum + point.value, 0);
  const colors = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#EC4899',
    '#14B8A6',
  ];

  let currentAngle = 0;
  const paths = data.map((point, i) => {
    const percentage = (point.value / total) * 100;
    const angle = (point.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    const outerRadius = 100;
    const innerRadius = 60;

    const startOuterX = Math.cos((startAngle - 90) * (Math.PI / 180)) * outerRadius + 100;
    const startOuterY = Math.sin((startAngle - 90) * (Math.PI / 180)) * outerRadius + 100;
    const endOuterX = Math.cos((endAngle - 90) * (Math.PI / 180)) * outerRadius + 100;
    const endOuterY = Math.sin((endAngle - 90) * (Math.PI / 180)) * outerRadius + 100;

    const startInnerX = Math.cos((endAngle - 90) * (Math.PI / 180)) * innerRadius + 100;
    const startInnerY = Math.sin((endAngle - 90) * (Math.PI / 180)) * innerRadius + 100;
    const endInnerX = Math.cos((startAngle - 90) * (Math.PI / 180)) * innerRadius + 100;
    const endInnerY = Math.sin((startAngle - 90) * (Math.PI / 180)) * innerRadius + 100;

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = `
      M ${startOuterX} ${startOuterY}
      A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${endOuterX} ${endOuterY}
      L ${startInnerX} ${startInnerY}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${endInnerX} ${endInnerY}
      Z
    `;

    currentAngle += angle;

    return {
      path: pathData,
      color: point.color || colors[i % colors.length],
      label: point.label,
      value: point.value,
      percentage,
    };
  });

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="flex items-center gap-8">
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox="0 0 200 200">
              {paths.map((path, i) => (
                <path
                  key={i}
                  d={path.path}
                  fill={path.color}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <title>
                    {path.label}: {path.value} ({path.percentage.toFixed(1)}%)
                  </title>
                </path>
              ))}
            </svg>
            {(centerText || centerSubtext) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {centerText && (
                  <div className="text-3xl font-bold text-gray-900">{centerText}</div>
                )}
                {centerSubtext && (
                  <div className="text-sm text-gray-600 mt-1">{centerSubtext}</div>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            {paths.map((path, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: path.color }}
                />
                <span className="flex-1 text-gray-700">{path.label}</span>
                <span className="font-medium text-gray-900">
                  {path.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

