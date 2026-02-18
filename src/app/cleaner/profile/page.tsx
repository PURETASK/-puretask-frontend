'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCleanerAvailability, useUpdateAvailability } from '@/hooks/useCleanerAvailability';
import { apiClient } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cleanerEnhancedService } from '@/services/cleanerEnhanced.service';
import { Sparkles, TrendingUp, Image as ImageIcon, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { FiveStarReviewWatcher } from '@/components/features/reviews/FiveStarReviewWatcher';

export default function CleanerProfilePage() {
  return (
    <ProtectedRoute requiredRole="cleaner">
      <CleanerProfileContent />
    </ProtectedRoute>
  );
}

function CleanerProfileContent() {
  const [activeTab, setActiveTab] = useState<'profile' | 'services' | 'areas' | 'verification' | 'settings'>('profile');
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Get cleaner profile
  const { data: profileData, isLoading: loadingProfile } = useQuery({
    queryKey: ['cleaner', 'profile'],
    queryFn: () => apiClient.get('/cleaner/profile'),
  });

  // Get performance insights
  const { data: insightsData } = useQuery({
    queryKey: ['cleaner', 'profile', 'insights'],
    queryFn: () => cleanerEnhancedService.getProfileInsights(),
  });

  const profile = profileData?.profile;

  if (loadingProfile) {
    return <Loading size="lg" text="Loading profile..." fullScreen />;
  }

  return (
    <>
      <FiveStarReviewWatcher />
      <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile Management</h1>
            <p className="text-gray-600 mt-1">Manage your profile, services, and settings.</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {[
              { id: 'profile', label: 'Profile' },
              { id: 'services', label: 'Services & Pricing' },
              { id: 'areas', label: 'Service Areas' },
              { id: 'verification', label: 'Verification' },
              { id: 'settings', label: 'Settings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Performance Insights Banner */}
          {insightsData?.insights && (
            <Card className="mb-6 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-2">Profile Performance</h3>
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      {insightsData.insights.profile_views && (
                        <div>
                          <p className="text-blue-700">Profile Views</p>
                          <p className="text-lg font-bold text-blue-900">
                            {insightsData.insights.profile_views}
                          </p>
                        </div>
                      )}
                      {insightsData.insights.bookings_from_profile && (
                        <div>
                          <p className="text-blue-700">Bookings from Profile</p>
                          <p className="text-lg font-bold text-blue-900">
                            {insightsData.insights.bookings_from_profile}
                          </p>
                        </div>
                      )}
                      {insightsData.insights.completion_score !== undefined && (
                        <div>
                          <p className="text-blue-700">Profile Completion</p>
                          <p className="text-lg font-bold text-blue-900">
                            {insightsData.insights.completion_score}%
                          </p>
                        </div>
                      )}
                      {insightsData.insights.avg_rating && (
                        <div>
                          <p className="text-blue-700">Average Rating</p>
                          <p className="text-lg font-bold text-blue-900">
                            {insightsData.insights.avg_rating.toFixed(1)} ⭐
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab Content */}
          {activeTab === 'profile' && <ProfileTab profile={profile} insights={insightsData?.insights} />}
          {activeTab === 'services' && <ServicesTab />}
          {activeTab === 'areas' && <ServiceAreasTab />}
          {activeTab === 'verification' && <VerificationTab profile={profile} />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </main>
      <Footer />
    </div>
    </>
  );
}

// Profile Tab Component
function ProfileTab({ profile, insights }: { profile: any; insights?: any }) {
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    experience_years: profile?.experience_years || 0,
  });
  const [portfolioPhotos, setPortfolioPhotos] = useState<string[]>(profile?.portfolio_photos || []);
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: (data: any) => apiClient.patch('/cleaner/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cleaner', 'profile'] });
      showToast('Profile updated successfully!', 'success');
    },
    onError: (error: any) => {
      showToast(error.response?.data?.error?.message || 'Failed to update profile', 'error');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              required
            />
          </div>
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              maxLength={500}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Tell clients about yourself, your experience, and what makes you great..."
            />
            <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/500 characters</p>
          </div>
          <Input
            label="Years of Experience"
            type="number"
            value={formData.experience_years}
            onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
            min="0"
          />
          
          {/* Portfolio Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Portfolio Photos
            </label>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {portfolioPhotos.map((photo, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={photo}
                    alt={`Portfolio ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setPortfolioPhotos(portfolioPhotos.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {portfolioPhotos.length < 10 && (
                <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500">
                  <div className="text-center">
                    <ImageIcon className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Add Photo</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setPortfolioPhotos([...portfolioPhotos, url]);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500">Add up to 10 portfolio photos showcasing your work</p>
          </div>

          <Button type="submit" variant="primary" isLoading={isPending}>
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Services Tab Component
function ServicesTab() {
  const { data: profile } = useQuery({
    queryKey: ['cleaner', 'profile'],
    queryFn: () => apiClient.get('/cleaner/profile'),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Services & Pricing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Base Rate (per hour)</label>
              <Input
                type="number"
                defaultValue={profile?.profile?.base_rate_cph || 0}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deep Clean Add-on (per hour)</label>
              <Input
                type="number"
                defaultValue={profile?.profile?.deep_addon_cph || 0}
                placeholder="0.00"
              />
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Your rates are shown to clients when they search for cleaners. You can adjust these at any time.
          </p>
          <Button variant="primary">Update Pricing</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Service Areas Tab Component
function ServiceAreasTab() {
  const { data: areasData } = useQuery({
    queryKey: ['cleaner', 'service-areas'],
    queryFn: () => apiClient.get('/cleaner/service-areas'),
  });

  const serviceAreas = areasData?.serviceAreas || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Areas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {serviceAreas.length > 0 ? (
            <div className="space-y-2">
              {serviceAreas.map((area: any) => (
                <div key={area.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">{area.zip_code || area.city || 'Service Area'}</p>
                    {area.radius_miles && (
                      <p className="text-sm text-gray-600">{area.radius_miles} mile radius</p>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No service areas configured yet.</p>
          )}
          <Button variant="outline">+ Add Service Area</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Verification Tab Component
function VerificationTab({ profile }: { profile: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium">Background Check</p>
              <p className="text-sm text-gray-600">Status: {profile?.background_checked ? '✓ Verified' : 'Pending'}</p>
            </div>
            {!profile?.background_checked && (
              <Button variant="outline" size="sm">
                Complete Check
              </Button>
            )}
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium">ID Verification</p>
              <p className="text-sm text-gray-600">Status: Pending</p>
            </div>
            <Button variant="outline" size="sm">
              Upload ID
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Settings Tab Component
function SettingsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Notification Preferences</h3>
            <div className="space-y-3">
              {['Email', 'SMS', 'Push'].map((type) => (
                <label key={type} className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-gray-700">{type} notifications</span>
                </label>
              ))}
            </div>
          </div>
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Change Password</h3>
            <div className="space-y-3 max-w-md">
              <Input type="password" label="Current Password" />
              <Input type="password" label="New Password" />
              <Input type="password" label="Confirm New Password" />
              <Button variant="primary">Update Password</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
