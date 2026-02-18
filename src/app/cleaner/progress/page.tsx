'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import { cleanerEnhancedService } from '@/services/cleanerEnhanced.service';
import { Sparkles, Target, TrendingUp } from 'lucide-react';

export default function ProgressPage() {
  // Get goals
  const { data: goalsData } = useQuery({
    queryKey: ['cleaner', 'goals'],
    queryFn: () => cleanerEnhancedService.getGoals(),
  });

  const profile = {
    level: 7,
    xp: 2450,
    xpToNextLevel: 3000,
    totalBookings: 87,
    totalEarnings: 12450,
    rating: 4.9,
    badges: 12,
  };

  const achievements = [
    {
      id: 'a1',
      title: 'First Booking',
      description: 'Complete your first cleaning job',
      icon: '🎉',
      earned: true,
      earnedDate: 'Nov 15, 2025',
      xp: 100,
    },
    {
      id: 'a2',
      title: '10 Bookings',
      description: 'Complete 10 successful bookings',
      icon: '⭐',
      earned: true,
      earnedDate: 'Dec 20, 2025',
      xp: 250,
    },
    {
      id: 'a3',
      title: '50 Bookings',
      description: 'Complete 50 successful bookings',
      icon: '🌟',
      earned: true,
      earnedDate: 'Jan 5, 2026',
      xp: 500,
    },
    {
      id: 'a4',
      title: '100 Bookings',
      description: 'Complete 100 successful bookings',
      icon: '💎',
      earned: false,
      progress: 87,
      total: 100,
      xp: 1000,
    },
    {
      id: 'a5',
      title: '5-Star Pro',
      description: 'Maintain 4.8+ rating for 20 bookings',
      icon: '🏆',
      earned: true,
      earnedDate: 'Dec 28, 2025',
      xp: 300,
    },
    {
      id: 'a6',
      title: 'Early Bird',
      description: 'Complete 10 bookings before 8 AM',
      icon: '🌅',
      earned: false,
      progress: 6,
      total: 10,
      xp: 150,
    },
    {
      id: 'a7',
      title: 'Rapid Responder',
      description: 'Respond to 50 messages within 5 minutes',
      icon: '⚡',
      earned: true,
      earnedDate: 'Jan 3, 2026',
      xp: 200,
    },
    {
      id: 'a8',
      title: 'Perfectionist',
      description: 'Get 25 perfect 5.0 ratings',
      icon: '✨',
      earned: false,
      progress: 18,
      total: 25,
      xp: 400,
    },
  ];

  const recentActivity = [
    { date: 'Today', action: 'Earned "Rapid Responder" badge', xp: 200 },
    { date: 'Jan 5', action: 'Completed 50th booking', xp: 500 },
    { date: 'Jan 3', action: 'Reached Level 7', xp: 0 },
    { date: 'Dec 28', action: 'Earned "5-Star Pro" badge', xp: 300 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Goals Overview */}
          {goalsData?.goals && goalsData.goals.length > 0 && (
            <Card className="mb-6 border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-900 mb-2">Active Goals</h3>
                    <div className="space-y-3">
                      {goalsData.goals.map((goal: any) => (
                        <div key={goal.id} className="bg-white p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{goal.type}</span>
                            <span className="text-sm text-gray-600">
                              {goal.current}/{goal.target}
                            </span>
                          </div>
                          <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">🏆 Progress & Achievements</h1>
              <p className="text-gray-600">Track your journey and earn rewards</p>
            </div>
            <Button variant="outline" onClick={() => (window.location.href = '/cleaner/dashboard')}>
              ← Back to Dashboard
            </Button>
          </div>

          {/* Profile Stats */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">Level {profile.level}</h2>
                    <Badge variant="info">XP: {profile.xp}/{profile.xpToNextLevel}</Badge>
                  </div>
                  <Progress value={(profile.xp / profile.xpToNextLevel) * 100} className="w-64 mb-2" />
                  <p className="text-sm text-gray-600">{profile.xpToNextLevel - profile.xp} XP to Level {profile.level + 1}</p>
                </div>
                <div className="grid grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">{profile.totalBookings}</div>
                    <div className="text-sm text-gray-600">Bookings</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">${profile.totalEarnings.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Earned</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-yellow-600">{profile.rating}</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">{profile.badges}</div>
                    <div className="text-sm text-gray-600">Badges</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Achievements */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-lg border-2 ${
                          achievement.earned
                            ? 'border-yellow-400 bg-yellow-50'
                            : 'border-gray-200 bg-gray-50 opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-4xl">{achievement.icon}</span>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{achievement.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                            {achievement.earned ? (
                              <div className="flex items-center gap-2">
                                <Badge variant="info">+{achievement.xp} XP</Badge>
                                <span className="text-xs text-gray-500">{achievement.earnedDate}</span>
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-gray-600">
                                    {achievement.progress}/{achievement.total}
                                  </span>
                                  <span className="text-xs text-gray-500">+{achievement.xp} XP</span>
                                </div>
                                <Progress
                                  value={((achievement.progress || 0) / (achievement.total || 1)) * 100}
                                  className="h-2"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 mb-1">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                      {activity.xp > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          +{activity.xp} XP
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardContent className="p-6 text-center">
                  <span className="text-4xl mb-3 block">📜</span>
                  <h3 className="font-semibold text-gray-900 mb-2">Certifications</h3>
                  <p className="text-sm text-gray-600 mb-4">Unlock advanced certifications to stand out</p>
                  <Button variant="primary" onClick={() => (window.location.href = '/cleaner/certifications')}>
                    View Certifications
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

