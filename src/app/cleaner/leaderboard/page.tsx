'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState('month');
  const [category, setCategory] = useState('earnings');

  // Get personal ranking insights
  const { data: rankingData } = useQuery({
    queryKey: ['cleaner', 'leaderboard', 'personal', timeframe, category],
    queryFn: async () => {
      try {
        const res = await apiClient.get(`/cleaner/leaderboard/personal?timeframe=${timeframe}&category=${category}`);
        return (res ?? {}) as { rank?: number | null; trend?: number | null; nextRank?: { rank?: number; gap?: string } | null };
      } catch {
        return { rank: null, trend: null, nextRank: null };
      }
    },
  });

  const leaderboardData = [
    {
      rank: 1,
      name: 'Jane Doe',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      value: '$12,450',
      rating: 4.9,
      bookings: 87,
      level: 12,
      badge: '👑',
    },
    {
      rank: 2,
      name: 'Mike Smith',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      value: '$10,880',
      rating: 4.8,
      bookings: 76,
      level: 10,
      badge: '🥈',
    },
    {
      rank: 3,
      name: 'Lisa Brown',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      value: '$9,320',
      rating: 4.9,
      bookings: 68,
      level: 9,
      badge: '🥉',
    },
    {
      rank: 4,
      name: 'John Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      value: '$8,750',
      rating: 4.7,
      bookings: 64,
      level: 8,
    },
    {
      rank: 5,
      name: 'Sarah Martinez',
      avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
      value: '$8,100',
      rating: 4.8,
      bookings: 59,
      level: 8,
    },
    {
      rank: 6,
      name: 'You',
      avatar: '',
      value: '$7,240',
      rating: 4.9,
      bookings: 52,
      level: 7,
      isCurrentUser: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">🏆 Leaderboard</h1>
              <p className="text-gray-600">See how you rank among top cleaners</p>
            </div>
            <Button variant="outline" onClick={() => (window.location.href = '/cleaner')}>
              ← Back to Dashboard
            </Button>
          </div>

          {/* Personal Ranking Insights */}
          {rankingData && (rankingData.rank !== null || rankingData.trend) && (
            <Card className="mb-6 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-2">Your Ranking</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      {rankingData.rank !== null && (
                        <div>
                          <p className="text-blue-700">Current Rank</p>
                          <p className="text-lg font-bold text-blue-900">#{rankingData.rank}</p>
                        </div>
                      )}
                      {rankingData.trend && (
                        <div>
                          <p className="text-blue-700">Trend</p>
                          <div className="flex items-center gap-1">
                            {rankingData.trend > 0 ? (
                              <>
                                <TrendingUp className="h-4 w-4 text-green-600" />
                                <span className="text-lg font-bold text-green-600">+{rankingData.trend}</span>
                              </>
                            ) : rankingData.trend < 0 ? (
                              <>
                                <TrendingDown className="h-4 w-4 text-red-600" />
                                <span className="text-lg font-bold text-red-600">{rankingData.trend}</span>
                              </>
                            ) : (
                              <span className="text-lg font-bold text-blue-900">No change</span>
                            )}
                          </div>
                        </div>
                      )}
                      {rankingData.nextRank ? (
                        <div>
                          <p className="text-blue-700">Next Rank</p>
                          <p className="text-lg font-bold text-blue-900">#{rankingData.nextRank.rank}</p>
                          <p className="text-xs text-blue-600">Need {rankingData.nextRank.gap}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Timeframe</label>
                  <div className="flex gap-2">
                    {['week', 'month', 'year', 'all-time'].map((period) => (
                      <button
                        key={period}
                        onClick={() => setTimeframe(period)}
                        className={cn(
                          'px-4 py-2 rounded-lg font-medium transition-colors capitalize',
                          timeframe === period
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        )}
                      >
                        {period.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
                  <div className="flex gap-2">
                    {['earnings', 'bookings', 'rating'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={cn(
                          'px-4 py-2 rounded-lg font-medium transition-colors capitalize',
                          category === cat
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>
                Top Cleaners - {timeframe.replace('-', ' ')} ({category})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboardData.map((cleaner) => (
                  <div
                    key={cleaner.rank}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-lg transition-colors',
                      cleaner.isCurrentUser
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : cleaner.rank <= 3
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50'
                        : 'bg-gray-50 hover:bg-gray-100'
                    )}
                  >
                    <div className="w-12 text-center">
                      {cleaner.badge ? (
                        <span className="text-3xl">{cleaner.badge}</span>
                      ) : (
                        <span className="text-2xl font-bold text-gray-600">#{cleaner.rank}</span>
                      )}
                    </div>
                    <Avatar
                      src={cleaner.avatar}
                      alt={cleaner.name}
                      size="lg"
                      fallback={cleaner.name.charAt(0)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{cleaner.name}</h3>
                        {cleaner.isCurrentUser && <Badge variant="info">You</Badge>}
                        <Badge variant="secondary">Level {cleaner.level}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>⭐ {cleaner.rating}</span>
                        <span>📋 {cleaner.bookings} bookings</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{cleaner.value}</div>
                      <div className="text-sm text-gray-500">This {timeframe}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rewards */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Monthly Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                  <span className="text-5xl mb-3 block">👑</span>
                  <h4 className="font-bold text-gray-900 mb-2">#1: Gold Crown</h4>
                  <p className="text-sm text-gray-700">$500 bonus + Featured profile</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
                  <span className="text-5xl mb-3 block">🥈</span>
                  <h4 className="font-bold text-gray-900 mb-2">#2: Silver Medal</h4>
                  <p className="text-sm text-gray-700">$300 bonus + Priority listing</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg">
                  <span className="text-5xl mb-3 block">🥉</span>
                  <h4 className="font-bold text-gray-900 mb-2">#3: Bronze Medal</h4>
                  <p className="text-sm text-gray-700">$200 bonus + Badge of honor</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

