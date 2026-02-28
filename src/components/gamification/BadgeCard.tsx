'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/Card';
import { motionTokens } from '@/components/motion/tokens';
import { StaggerItem } from '@/components/motion/Stagger';
import { cn } from '@/lib/utils';

export interface BadgeCardProps {
  id: string;
  name: string;
  icon?: string;
  earned: boolean;
  earnedDate?: string;
  howToEarn?: string;
  featured?: boolean;
  onPin?: () => void;
  onShare?: () => void;
  canPin?: boolean;
  className?: string;
}

export function BadgeCard({
  name,
  icon = '🏅',
  earned,
  earnedDate,
  howToEarn,
  featured,
  onPin,
  onShare,
  canPin = false,
  className,
}: BadgeCardProps) {
  return (
    <StaggerItem>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: motionTokens.duration.base, ease: motionTokens.ease.out }}
      >
        <Card
          className={cn(
            'transition-shadow hover:shadow-md',
            !earned && 'opacity-75',
            featured && 'ring-2 ring-amber-400',
            earned && 'ring-amber-200/50',
            className
          )}
        >
          <CardContent className="p-4 flex flex-col items-center text-center">
            <motion.div
              initial={earned ? { scale: 0.8 } : false}
              animate={{ scale: 1 }}
              transition={earned ? { type: 'spring', stiffness: 400, damping: 15 } : {}}
              className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2',
                earned ? 'bg-amber-100' : 'bg-gray-100'
              )}
            >
              {icon}
            </motion.div>
            <h3 className="font-semibold text-gray-900 text-sm">{name}</h3>
            {earned && earnedDate && (
              <p className="text-xs text-gray-500 mt-0.5">Earned {earnedDate}</p>
            )}
            {howToEarn && (
              <p className="text-xs text-gray-600 mt-2 line-clamp-2">{howToEarn}</p>
            )}
            <div className="flex gap-2 mt-3">
              {canPin && onPin && (
                <button
                  type="button"
                  onClick={onPin}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800"
                >
                  Pin to profile
                </button>
              )}
              {onShare && (
                <button
                  type="button"
                  onClick={onShare}
                  className="text-xs font-medium text-gray-600 hover:text-gray-800"
                >
                  Share
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </StaggerItem>
  );
}
