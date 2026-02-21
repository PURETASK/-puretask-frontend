'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Sparkles, TrendingUp, Target } from 'lucide-react';

export default function CertificationsPage() {
  const [activeTab, setActiveTab] = useState('available');

  // Get certification recommendations
  const { data: recommendationsData } = useQuery<{
    recommendations?: Array<{ name: string; reason: string }>;
  }>({
    queryKey: ['cleaner', 'certifications', 'recommendations'],
    queryFn: async () => {
      try {
        const res = await apiClient.get<{ recommendations?: Array<{ name: string; reason: string }> }>(
          '/cleaner/certifications/recommendations'
        );
        return res ?? { recommendations: [] };
      } catch {
        return { recommendations: [] };
      }
    },
  });

  const earnedCertifications = [
    {
      id: 'cert1',
      name: 'Standard Cleaning Certified',
      icon: '🏅',
      earnedDate: 'Dec 1, 2025',
      level: 'Basic',
      benefits: ['Verified badge on profile', 'Access to standard cleaning jobs', '+50 XP'],
    },
    {
      id: 'cert2',
      name: 'Deep Cleaning Specialist',
      icon: '🌟',
      earnedDate: 'Dec 15, 2025',
      level: 'Advanced',
      benefits: ['15% higher rates', 'Priority in search', '+100 XP'],
    },
  ];

  const availableCertifications = [
    {
      id: 'cert3',
      name: 'Move In/Out Expert',
      icon: '📦',
      level: 'Advanced',
      requirements: [
        { text: 'Complete 20 standard cleanings', complete: true },
        { text: 'Maintain 4.5+ rating', complete: true },
        { text: 'Complete 5 move-in/out jobs', complete: false, progress: 2, total: 5 },
      ],
      benefits: ['20% higher rates for move-ins', 'Featured badge', '+150 XP'],
      xp: 150,
    },
    {
      id: 'cert4',
      name: 'Eco-Friendly Cleaning Pro',
      icon: '🌱',
      level: 'Specialty',
      requirements: [
        { text: 'Complete eco-cleaning training', complete: false },
        { text: 'Use approved eco products', complete: false },
        { text: 'Complete 10 eco-cleanings', complete: false, progress: 0, total: 10 },
      ],
      benefits: ['Access to eco-conscious clients', 'Green badge', '+200 XP'],
      xp: 200,
    },
    {
      id: 'cert5',
      name: 'Commercial Cleaning Certified',
      icon: '🏢',
      level: 'Professional',
      requirements: [
        { text: 'Complete 50 residential cleanings', complete: false, progress: 87, total: 50 },
        { text: 'Pass commercial cleaning exam', complete: false },
        { text: 'Background check verified', complete: true },
      ],
      benefits: ['Access to commercial contracts', 'Higher earning potential', '+300 XP'],
      xp: 300,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">📜 Certifications</h1>
              <p className="text-gray-600">Earn certifications to unlock premium features</p>
            </div>
            <Button variant="outline" onClick={() => (window.location.href = '/cleaner/progress')}>
              ← Back to Progress
            </Button>
          </div>

          {/* Recommendations */}
          {recommendationsData?.recommendations && recommendationsData.recommendations.length > 0 && (
            <Card className="mb-6 border-purple-200 bg-purple-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-purple-900 mb-2">Recommended for You</h3>
                    <div className="space-y-2 text-sm text-purple-700">
                      {recommendationsData.recommendations.map((rec: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          <span>
                            <strong>{rec.name}</strong> - {rec.reason}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'earned', label: 'Earned', count: earnedCertifications.length },
              { id: 'available', label: 'Available', count: availableCertifications.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-6 py-3 rounded-lg font-medium transition-colors',
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                )}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* EARNED TAB */}
          {activeTab === 'earned' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {earnedCertifications.map((cert) => (
                <Card key={cert.id} className="border-2 border-yellow-400 bg-yellow-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <span className="text-5xl">{cert.icon}</span>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{cert.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="info">{cert.level}</Badge>
                          <span className="text-sm text-gray-600">Earned {cert.earnedDate}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
                      <ul className="space-y-1">
                        {cert.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* AVAILABLE TAB */}
          {activeTab === 'available' && (
            <div className="grid grid-cols-1 gap-6">
              {availableCertifications.map((cert) => {
                const completedReqs = cert.requirements.filter((r) => r.complete).length;
                const totalReqs = cert.requirements.length;
                const isEligible = completedReqs === totalReqs;

                return (
                  <Card key={cert.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <span className="text-5xl opacity-50">{cert.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{cert.name}</h3>
                            <Badge variant="secondary">{cert.level}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            {completedReqs}/{totalReqs} requirements complete
                          </p>

                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                            <div className="space-y-3">
                              {cert.requirements.map((req, index) => (
                                <div key={index}>
                                  <div className="flex items-center justify-between mb-1">
                                    <span
                                      className={`text-sm ${
                                        req.complete ? 'text-green-600 line-through' : 'text-gray-700'
                                      }`}
                                    >
                                      {req.complete ? '✓' : '○'} {req.text}
                                    </span>
                                    {req.progress !== undefined && (
                                      <span className="text-xs text-gray-500">
                                        {req.progress}/{req.total}
                                      </span>
                                    )}
                                  </div>
                                  {req.progress !== undefined && (
                                    <Progress value={(req.progress / req.total) * 100} className="h-2" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
                            <ul className="space-y-1">
                              {cert.benefits.map((benefit, index) => (
                                <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                                  <span className="text-blue-600">→</span>
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <Button
                            variant={isEligible ? 'primary' : 'outline'}
                            disabled={!isEligible}
                            className="w-full"
                          >
                            {isEligible ? 'Start Certification Process' : 'Requirements Not Met'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

