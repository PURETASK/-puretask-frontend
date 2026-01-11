'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Rating } from '@/components/ui/Rating';
interface ReviewCardProps {
  author: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
}
export function ReviewCard({ author, rating, date, text, helpful }: ReviewCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar alt={author} size="md" fallback={author.charAt(0)} />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-semibold text-gray-900">{author}</p>
                <p className="text-sm text-gray-600">{date}</p>
              </div>
              <Rating value={rating} readonly size="sm" />
            </div>
            <p className="text-gray-700 mb-4">{text}</p>
            <div className="flex items-center gap-4 text-sm">
              <button className="text-gray-600 hover:text-blue-600">
                ???? Helpful ({helpful})
              </button>
              <button className="text-gray-600 hover:text-blue-600">
                Report
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
