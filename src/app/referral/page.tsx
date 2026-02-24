'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useToast } from '@/contexts/ToastContext';
import { referralService } from '@/services/referral.service';
import {
  Gift,
  Copy,
  Check,
  Users,
  DollarSign,
  Mail,
  MessageSquare,
  Share2,
} from 'lucide-react';

export default function ReferralPage() {
  return (
    <ProtectedRoute requiredRole={['client', 'cleaner']}>
      <ReferralContent />
    </ProtectedRoute>
  );
}

function ReferralContent() {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const { showToast } = useToast();

  // Mock data when GET /referral/me is not available; replace with API when backend provides it
  const [referralCode, setReferralCode] = useState('PURE-JD2026');
  const [referralLink, setReferralLink] = useState(`https://puretask.com/signup?ref=${referralCode}`);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 12,
    completedBookings: 8,
    pendingRewards: 75,
    totalEarned: 240,
  });
  const [recentReferrals, setRecentReferrals] = useState([
    { id: '1', name: 'Sarah Johnson', email: 's***@gmail.com', status: 'completed', reward: 30, date: '2026-01-05' },
    { id: '2', name: 'Mike Chen', email: 'm***@yahoo.com', status: 'pending', reward: 15, date: '2026-01-08' },
    { id: '3', name: 'Emily Davis', email: 'e***@hotmail.com', status: 'completed', reward: 30, date: '2025-12-28' },
  ]);

  // Optional: fetch referral/me on mount to replace mock data when backend is ready
  React.useEffect(() => {
    referralService.getMe().then((data) => {
      if (data.referral_code) {
        setReferralCode(data.referral_code);
        setReferralLink(data.referral_link ?? `https://puretask.com/signup?ref=${data.referral_code}`);
      }
      if (data.total_referrals != null) {
        setReferralStats({
          totalReferrals: data.total_referrals ?? 0,
          completedBookings: data.completed_bookings ?? 0,
          pendingRewards: data.pending_rewards ?? 0,
          totalEarned: data.total_earned ?? 0,
        });
      }
      if (data.recent_referrals?.length) {
        setRecentReferrals(
          data.recent_referrals.map((r) => ({
            id: r.id,
            name: r.name,
            email: r.email,
            status: r.status,
            reward: r.reward,
            date: r.date,
          }))
        );
      }
    }).catch(() => {});
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    try {
      await referralService.sendInvite({ email: email.trim() });
      showToast('Invite sent!', 'success');
      setEmail('');
    } catch (err: any) {
      showToast(err?.response?.data?.error?.message ?? 'Failed to send invite', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Gift className="h-6 w-6" />
                </div>
                <h1 className="text-3xl font-bold">Refer Friends, Earn Rewards!</h1>
              </div>
              <p className="text-lg text-blue-50 mb-6">
                Give your friends $15 off their first booking, and you'll earn $30 when they
                complete their first service. It's a win-win!
              </p>
              <div className="flex items-center gap-4">
                <Badge variant="default" className="bg-white/20 text-white border-0">
                  ⭐ Unlimited referrals
                </Badge>
                <Badge variant="default" className="bg-white/20 text-white border-0">
                  💰 Instant rewards
                </Badge>
                <Badge variant="default" className="bg-white/20 text-white border-0">
                  🎁 No expiration
                </Badge>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Referrals</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {referralStats.totalReferrals}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {referralStats.completedBookings}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${referralStats.pendingRewards}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                    <Gift className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Earned</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${referralStats.totalEarned}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Share Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Referral Link */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Referral Link</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Share your unique link
                    </label>
                    <div className="flex gap-2">
                      <Input value={referralLink} readOnly className="flex-1" />
                      <Button variant="primary" onClick={handleCopyCode}>
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your referral code
                    </label>
                    <div className="bg-gray-50 px-4 py-3 rounded-lg">
                      <code className="text-lg font-mono font-bold text-blue-600">
                        {referralCode}
                      </code>
                    </div>
                  </div>

                  {/* Share Buttons */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Share via
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <Button variant="outline" className="flex-col h-auto py-4">
                        <Mail className="h-6 w-6 mb-2 text-gray-600" />
                        <span className="text-sm">Email</span>
                      </Button>
                      <Button variant="outline" className="flex-col h-auto py-4">
                        <MessageSquare className="h-6 w-6 mb-2 text-green-600" />
                        <span className="text-sm">WhatsApp</span>
                      </Button>
                      <Button variant="outline" className="flex-col h-auto py-4">
                        <Share2 className="h-6 w-6 mb-2 text-blue-600" />
                        <span className="text-sm">More</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Invite by Email */}
              <Card>
                <CardHeader>
                  <CardTitle>Invite by Email</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSendEmail} className="flex gap-2">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="friend@email.com"
                      required
                      className="flex-1"
                    />
                    <Button type="submit" variant="primary" isLoading={sending}>
                      Send Invite
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Recent Referrals */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Referrals</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentReferrals.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No referrals yet. Start sharing!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentReferrals.map((referral) => (
                        <div
                          key={referral.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{referral.name}</p>
                            <p className="text-sm text-gray-600">{referral.email}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(referral.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                referral.status === 'completed' ? 'success' : 'warning'
                              }
                            >
                              {referral.status}
                            </Badge>
                            <p className="text-sm font-semibold text-gray-900 mt-1">
                              ${referral.reward}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* How It Works */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Share Your Link</h4>
                        <p className="text-sm text-gray-600">
                          Send your unique referral link to friends and family
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          They Sign Up & Book
                        </h4>
                        <p className="text-sm text-gray-600">
                          Your friend gets $15 off their first booking
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">You Both Win!</h4>
                        <p className="text-sm text-gray-600">
                          You earn $30 when they complete their first service
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg mt-6">
                      <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h4>
                      <p className="text-sm text-blue-800">
                        The more friends you refer, the more you earn. There's no limit to
                        your rewards!
                      </p>
                    </div>
                  </div>
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

