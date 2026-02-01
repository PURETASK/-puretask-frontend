'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

export default function TeamManagementPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const teamStats = {
    totalMembers: 5,
    activeBookings: 12,
    totalEarnings: 34250,
    avgRating: 4.8,
  };

  const teamMembers = [
    {
      id: 'tm1',
      name: 'Sarah Johnson',
      role: 'Lead Cleaner',
      avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
      status: 'Active',
      bookings: 47,
      earnings: 12450,
      rating: 4.9,
      joined: 'Nov 2025',
    },
    {
      id: 'tm2',
      name: 'Mike Davis',
      role: 'Senior Cleaner',
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      status: 'Active',
      bookings: 38,
      earnings: 10880,
      rating: 4.8,
      joined: 'Dec 2025',
    },
    {
      id: 'tm3',
      name: 'Emma Wilson',
      role: 'Cleaner',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
      status: 'Active',
      bookings: 25,
      earnings: 7120,
      rating: 4.7,
      joined: 'Dec 2025',
    },
    {
      id: 'tm4',
      name: 'John Martinez',
      role: 'Cleaner',
      avatar: 'https://randomuser.me/api/portraits/men/13.jpg',
      status: 'Inactive',
      bookings: 12,
      earnings: 3800,
      rating: 4.6,
      joined: 'Jan 2026',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">👥 Team Management</h1>
              <p className="text-gray-600">Manage your cleaning team or agency</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => (window.location.href = '/cleaner/dashboard')}>
                ← Back to Dashboard
              </Button>
              <Button variant="primary">+ Invite Member</Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {['overview', 'members', 'schedule', 'earnings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-6 py-3 font-medium transition-colors border-b-2 capitalize',
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{teamStats.totalMembers}</div>
                    <div className="text-sm text-gray-600">Team Members</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">{teamStats.activeBookings}</div>
                    <div className="text-sm text-gray-600">Active Bookings</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">${teamStats.totalEarnings.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Earnings</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-1">{teamStats.avgRating}</div>
                    <div className="text-sm text-gray-600">Avg Rating</div>
                  </CardContent>
                </Card>
              </div>

              {/* Team Benefits */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">🌟 Team Benefits</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                    <li>✓ Accept larger bookings together</li>
                    <li>✓ Share resources and equipment</li>
                    <li>✓ Cover for each other during time off</li>
                    <li>✓ Shared earnings pool</li>
                    <li>✓ Team badge on your profile</li>
                    <li>✓ Priority support from platform</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {/* MEMBERS TAB */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <Card key={member.id} className={member.status === 'Inactive' ? 'opacity-60' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Avatar src={member.avatar} alt={member.name} size="lg" fallback={member.name.charAt(0)} />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                          <Badge variant={member.status === 'Active' ? 'primary' : 'secondary'}>
                            {member.status}
                          </Badge>
                          <Badge variant="secondary">{member.role}</Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="text-gray-500">Bookings:</span> {member.bookings}
                          </div>
                          <div>
                            <span className="text-gray-500">Earnings:</span> ${member.earnings.toLocaleString()}
                          </div>
                          <div>
                            <span className="text-gray-500">Rating:</span> ⭐ {member.rating}
                          </div>
                          <div>
                            <span className="text-gray-500">Joined:</span> {member.joined}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm">
                          Assign Job
                        </Button>
                        <Button variant="outline" size="sm">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="p-8 text-center">
                  <span className="text-4xl mb-3 block">➕</span>
                  <h3 className="font-semibold text-gray-900 mb-2">Invite New Team Member</h3>
                  <p className="text-sm text-gray-600 mb-4">Grow your team by inviting experienced cleaners</p>
                  <Button variant="primary">Send Invitation</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* SCHEDULE TAB */}
          {activeTab === 'schedule' && (
            <Card>
              <CardHeader>
                <CardTitle>Team Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Team scheduling calendar coming soon...</p>
              </CardContent>
            </Card>
          )}

          {/* EARNINGS TAB */}
          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar src={member.avatar} alt={member.name} size="sm" fallback={member.name.charAt(0)} />
                          <span className="font-medium text-gray-900">{member.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${member.earnings.toLocaleString()}</p>
                          <p className="text-xs text-gray-600">
                            {Math.round((member.earnings / teamStats.totalEarnings) * 100)}% of total
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Configure how team earnings are split and paid out...</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

