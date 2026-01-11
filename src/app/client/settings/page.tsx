'use client';
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { ProfileEditForm } from '@/components/features/profile/ProfileEditForm';
import { ChangePasswordForm } from '@/components/features/profile/ChangePasswordForm';
export default function UserSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'payment', label: 'Payment Methods' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' },
  ];
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-3">
              {activeTab === 'profile' && (
                <ProfileEditForm />
              )}
              {activeTab === 'payment' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border-2 border-blue-600 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">????</span>
                          <div>
                            <p className="font-semibold text-gray-900">Visa ending in 1234</p>
                            <p className="text-sm text-gray-600">Expires 12/27</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-blue-600">Default</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      + Add New Card
                    </Button>
                  </CardContent>
                </Card>
              )}
              {activeTab === 'notifications' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer">
                      <span className="text-gray-900">Email notifications</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </label>
                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer">
                      <span className="text-gray-900">SMS notifications</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </label>
                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer">
                      <span className="text-gray-900">Push notifications</span>
                      <input type="checkbox" className="rounded" />
                    </label>
                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer">
                      <span className="text-gray-900">Marketing emails</span>
                      <input type="checkbox" className="rounded" />
                    </label>
                    <Button variant="primary">Save Preferences</Button>
                  </CardContent>
                </Card>
              )}
              {activeTab === 'security' && (
                <ChangePasswordForm />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
