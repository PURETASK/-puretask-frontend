'use client';

import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { PhotoEvidence } from '@/types/appointment';
import { Image } from 'lucide-react';

interface PhotoUploadPanelProps {
  photos: PhotoEvidence[];
}

export function PhotoUploadPanel({ photos }: PhotoUploadPanelProps) {
  const before = photos.filter((p) => p.kind === 'before');
  const after = photos.filter((p) => p.kind === 'after');

  const Section = ({
    title,
    items,
  }: {
    title: string;
    items: PhotoEvidence[];
  }) => (
    <div>
      <h4 className="mb-2 font-medium text-gray-900">{title}</h4>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No photos yet</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((p) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src={p.url}
                alt={p.kind}
                className="h-24 w-24 rounded-lg object-cover border border-gray-200 hover:border-blue-400"
              />
              <span className="text-xs text-gray-500">
                {format(new Date(p.createdAtISO), 'h:mm a')}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
        <Image className="h-5 w-5" />
        Service evidence
      </h3>
      <div className="space-y-6">
        <Section title="Before" items={before} />
        <Section title="After" items={after} />
      </div>
    </div>
  );
}
