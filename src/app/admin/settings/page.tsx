'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useSystemSettings, useUpdateSetting } from '@/hooks/useAdmin';
import { adminEnhancedService } from '@/services/adminEnhanced.service';
import { useQuery } from '@tanstack/react-query';
import { Settings, DollarSign, Mail, Shield, Bell, Globe, Sparkles, FileText } from 'lucide-react';

type FeatureFlagsResponse = { flags?: Record<string, { description?: string }> };
type AuditLogResponse = { logs?: unknown[] };

export default function AdminSettingsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminSettingsContent />
    </ProtectedRoute>
  );
}

function AdminSettingsContent() {
  const [activeTab, setActiveTab] = useState('general');
  const { data: settingsData, isLoading } = useSystemSettings();
  const { mutate: updateSetting, isPending: updating } = useUpdateSetting();

  // Get feature flags
  const { data: featureFlagsData } = useQuery({
    queryKey: ['admin', 'settings', 'feature-flags'],
    queryFn: () => adminEnhancedService.getFeatureFlags() as Promise<FeatureFlagsResponse>,
  });

  // Get audit log
  const { data: auditLogData } = useQuery({
    queryKey: ['admin', 'settings', 'audit-log'],
    queryFn: () => adminEnhancedService.getAuditLog(50) as Promise<AuditLogResponse>,
  });

  const [formData, setFormData] = useState({
    platform_name: 'PureTask',
    platform_fee_percentage: '15',
    support_email: 'support@puretask.com',
    stripe_public_key: '',
    stripe_secret_key: '',
    email_notifications_enabled: true,
    sms_notifications_enabled: false,
    booking_auto_confirm: false,
    cleaner_approval_required: true,
    min_booking_hours: '2',
    max_booking_hours: '8',
    cancellation_window_hours: '24',
  });

  const handleSave = (key: string, value: string) => {
    updateSetting({ key, value });
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'email', label: 'Email', icon: Mail },
  ];

  if (isLoading) {
    return <Loading size="lg" text="Loading settings..." fullScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
              <p className="text-gray-600 mt-1">Configure platform settings and preferences</p>
            </div>
            <Button variant="outline" onClick={() => (window.location.href = '/admin/dashboard')}>
              ← Back to Dashboard
            </Button>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Tabs Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <tab.icon className="h-5 w-5" />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Feature Flags */}
              {featureFlagsData && activeTab === 'general' && (
                <Card className="border-blue-200">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                      <CardTitle>Feature Flags</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(featureFlagsData.flags || {}).map(([key, value]: [string, any]) => (
                        <label key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <div>
                            <span className="font-medium text-gray-900">{key.replace(/_/g, ' ')}</span>
                            <p className="text-sm text-gray-600">{value.description || ''}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={value.enabled}
                            onChange={(e) => updateSetting({ key: `feature_${key}`, value: e.target.checked.toString() })}
                            className="rounded"
                          />
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Audit Log */}
              {auditLogData && activeTab === 'security' && (
                <Card className="border-gray-200">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <CardTitle>Recent Audit Log</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {auditLogData.logs?.slice(0, 20).map((log: any, idx: number) => (
                        <div key={idx} className="p-3 border border-gray-200 rounded-lg text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">{log.action}</span>
                            <span className="text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-gray-600">User: {log.user_id} | IP: {log.ip_address}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* General Settings */}
              {activeTab === 'general' && (
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform Name
                      </label>
                      <Input
                        value={formData.platform_name}
                        onChange={(e) =>
                          setFormData({ ...formData, platform_name: e.target.value })
                        }
                        placeholder="PureTask"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Support Email
                      </label>
                      <Input
                        type="email"
                        value={formData.support_email}
                        onChange={(e) =>
                          setFormData({ ...formData, support_email: e.target.value })
                        }
                        placeholder="support@puretask.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Booking Hours
                      </label>
                      <Input
                        type="number"
                        value={formData.min_booking_hours}
                        onChange={(e) =>
                          setFormData({ ...formData, min_booking_hours: e.target.value })
                        }
                        min="1"
                        max="24"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Booking Hours
                      </label>
                      <Input
                        type="number"
                        value={formData.max_booking_hours}
                        onChange={(e) =>
                          setFormData({ ...formData, max_booking_hours: e.target.value })
                        }
                        min="1"
                        max="24"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cancellation Window (hours)
                      </label>
                      <Input
                        type="number"
                        value={formData.cancellation_window_hours}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cancellation_window_hours: e.target.value,
                          })
                        }
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Users can cancel bookings up to this many hours before the scheduled time
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.booking_auto_confirm}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              booking_auto_confirm: e.target.checked,
                            })
                          }
                          className="w-5 h-5 rounded border-gray-300"
                        />
                        <div>
                          <p className="font-medium text-gray-900">Auto-confirm Bookings</p>
                          <p className="text-sm text-gray-600">
                            Automatically confirm bookings without cleaner approval
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.cleaner_approval_required}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cleaner_approval_required: e.target.checked,
                            })
                          }
                          className="w-5 h-5 rounded border-gray-300"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            Require Cleaner Profile Approval
                          </p>
                          <p className="text-sm text-gray-600">
                            Manually approve new cleaner registrations
                          </p>
                        </div>
                      </label>
                    </div>

                    <Button
                      variant="primary"
                      onClick={() => handleSave('general_settings', JSON.stringify(formData))}
                      isLoading={updating}
                    >
                      Save General Settings
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Payment Settings */}
              {activeTab === 'payments' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform Fee Percentage
                      </label>
                      <Input
                        type="number"
                        value={formData.platform_fee_percentage}
                        onChange={(e) =>
                          setFormData({ ...formData, platform_fee_percentage: e.target.value })
                        }
                        min="0"
                        max="100"
                        step="0.1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Percentage of each booking that goes to the platform
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stripe Public Key
                      </label>
                      <Input
                        type="text"
                        value={formData.stripe_public_key}
                        onChange={(e) =>
                          setFormData({ ...formData, stripe_public_key: e.target.value })
                        }
                        placeholder="pk_test_..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stripe Secret Key
                      </label>
                      <Input
                        type="password"
                        value={formData.stripe_secret_key}
                        onChange={(e) =>
                          setFormData({ ...formData, stripe_secret_key: e.target.value })
                        }
                        placeholder="sk_test_..."
                      />
                      <p className="text-xs text-gray-500 mt-1">This key is encrypted in storage</p>
                    </div>

                    <Button
                      variant="primary"
                      onClick={() => handleSave('payment_settings', JSON.stringify(formData))}
                      isLoading={updating}
                    >
                      Save Payment Settings
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.email_notifications_enabled}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              email_notifications_enabled: e.target.checked,
                            })
                          }
                          className="w-5 h-5 rounded border-gray-300"
                        />
                        <div>
                          <p className="font-medium text-gray-900">Enable Email Notifications</p>
                          <p className="text-sm text-gray-600">
                            Send email notifications for bookings, messages, etc.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.sms_notifications_enabled}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              sms_notifications_enabled: e.target.checked,
                            })
                          }
                          className="w-5 h-5 rounded border-gray-300"
                        />
                        <div>
                          <p className="font-medium text-gray-900">Enable SMS Notifications</p>
                          <p className="text-sm text-gray-600">
                            Send SMS notifications for urgent updates
                          </p>
                        </div>
                      </label>
                    </div>

                    <Button
                      variant="primary"
                      onClick={() =>
                        handleSave('notification_settings', JSON.stringify(formData))
                      }
                      isLoading={updating}
                    >
                      Save Notification Settings
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-900 mb-1">
                            Security Configuration
                          </h4>
                          <p className="text-sm text-yellow-800">
                            These settings affect authentication and authorization across the
                            platform. Changes may require users to re-login.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        JWT Secret Key
                      </label>
                      <Input type="password" value="••••••••••••••••" disabled />
                      <p className="text-xs text-gray-500 mt-1">
                        Contact system administrator to change
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <Input type="number" defaultValue="60" min="15" max="1440" />
                    </div>

                    <Button variant="primary" isLoading={updating}>
                      Save Security Settings
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Email Settings */}
              {activeTab === 'email' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Email Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Host
                      </label>
                      <Input placeholder="smtp.gmail.com" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Port
                        </label>
                        <Input type="number" placeholder="587" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Encryption
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                          <option>TLS</option>
                          <option>SSL</option>
                          <option>None</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Username
                      </label>
                      <Input type="email" placeholder="noreply@puretask.com" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Password
                      </label>
                      <Input type="password" placeholder="••••••••" />
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline">Test Connection</Button>
                      <Button variant="primary" isLoading={updating}>
                        Save Email Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
