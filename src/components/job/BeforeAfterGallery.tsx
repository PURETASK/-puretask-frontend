'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { LazyImage } from '@/components/ui/LazyImage';
import { BRAND } from '@/lib/brand';

export type GalleryPhoto = { id: string; url: string; createdAt: string };

type BeforeAfterGalleryProps = {
  before: GalleryPhoto[];
  after: GalleryPhoto[];
  className?: string;
  /** Side-by-side slider (confidence builder) vs tabs */
  variant?: 'tabs' | 'slider';
};

export function BeforeAfterGallery({
  before,
  after,
  className,
  variant = 'tabs',
}: BeforeAfterGalleryProps) {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('before');
  const [sliderX, setSliderX] = useState(50); // 0–100 %
  const beforeList = before ?? [];
  const afterList = after ?? [];

  const photos = activeTab === 'before' ? beforeList : afterList;

  // Slider: one before + one after for comparison
  const beforeImg = beforeList[0]?.url;
  const afterImg = afterList[0]?.url;

  const handleSliderMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      setSliderX(pct);
    },
    []
  );

  if (variant === 'slider' && (beforeImg || afterImg)) {
    return (
      <div className={cn('rounded-3xl overflow-hidden bg-white p-4 shadow-sm', className)}>
        <div className="text-sm font-semibold text-gray-700 mb-2">Before vs After</div>
        <div
          className="relative aspect-video w-full select-none rounded-2xl bg-slate-100"
          onMouseMove={handleSliderMove}
          onMouseLeave={() => setSliderX(50)}
          onTouchMove={handleSliderMove}
        >
          {afterImg && (
            <div className="absolute inset-0">
              <LazyImage src={afterImg} alt="After" className="h-full w-full object-cover" />
            </div>
          )}
          {beforeImg && (
            <motion.div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderX}% 0 0)` }}
            >
              <LazyImage src={beforeImg} alt="Before" className="h-full w-full object-cover" />
            </motion.div>
          )}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
            style={{ left: `${sliderX}%`, transform: 'translateX(-50%)' }}
          />
          <div
            className="absolute top-1/2 left-0 right-0 flex -translate-y-1/2 justify-center gap-2 text-xs font-medium"
            style={{ pointerEvents: 'none' }}
          >
            <span style={{ color: BRAND.blue }}>Before</span>
            <span style={{ color: BRAND.aqua }}>After</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">Drag or move over the image to compare.</p>
      </div>
    );
  }

  return (
    <div className={cn('rounded-3xl bg-white p-4 shadow-sm', className)}>
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('before')}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-semibold',
            activeTab === 'before'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
          )}
        >
          Before ({beforeList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('after')}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-semibold',
            activeTab === 'after'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
          )}
        >
          After ({afterList.length})
        </button>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.length === 0 ? (
          <p className="col-span-full text-sm text-gray-500">No photos yet.</p>
        ) : (
          photos.map((p) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-2xl bg-slate-100"
            >
              <LazyImage
                src={p.url}
                alt=""
                className="aspect-square w-full object-cover"
              />
            </a>
          ))
        )}
      </div>
    </div>
  );
}
