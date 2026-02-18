'use client';
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProfileEditForm } from '@/components/features/profile/ProfileEditForm';
import { ChangePasswordForm } from '@/components/features/profile/ChangePasswordForm';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { clientEnhancedService } from '@/services/clientEnhanced.service';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { Trash2, Plus, Edit, Check, Sparkles, TrendingUp } from 'lucide-react';

export default function UserSettingsPage() {
  return (
    <ProtectedRoute requiredRole="client">
      <UserSettingsContent />
    </ProtectedRoute>
  );
}

function UserSettingsContent() {
  const [activeTab, setActiveTab] = useState('profile');
  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'payment', label: 'Payment Methods' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'credits', label: 'Credit Settings' },
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
              {activeTab === 'payment' && <PaymentMethodsTab />}
              {activeTab === 'addresses' && <AddressBookTab />}
              {activeTab === 'credits' && <CreditSettingsTab />}
              {activeTab === 'notifications' && <NotificationPreferencesTab />}
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

// Payment Methods Tab
function PaymentMethodsTab() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: paymentMethodsData } = useQuery({
    queryKey: ['client', 'payment-methods'],
    queryFn: async () => {
      try {
        return await apiClient.get('/client/payment-methods');
      } catch {
        return { paymentMethods: [] };
      }
    },
  });

  const paymentMethods = paymentMethodsData?.paymentMethods || [];

  const { mutate: setDefault } = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/client/payment-methods/${id}/default`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', 'payment-methods'] });
      showToast('Default payment method updated', 'success');
    },
  });

  const { mutate: deleteMethod } = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/client/payment-methods/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', 'payment-methods'] });
      showToast('Payment method removed', 'success');
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.length > 0 ? (
          paymentMethods.map((method: any) => (
            <div
              key={method.id}
              className={`p-4 border-2 rounded-lg ${
                method.is_default ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💳</span>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {method.brand} ending in {method.last4}
                    </p>
                    <p className="text-sm text-gray-600">Expires {method.exp_month}/{method.exp_year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {method.is_default ? (
                    <span className="text-sm font-medium text-blue-600">Default</span>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDefault(method.id)}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm('Remove this payment method?')) {
                        deleteMethod(method.id);
                      }
                    }}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center py-4">No payment methods added yet.</p>
        )}
        <Button variant="outline" className="w-full" onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Payment Method
        </Button>
      </CardContent>
    </Card>
  );
}

// Address Book Tab
function AddressBookTab() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: addressesData } = useQuery({
    queryKey: ['client', 'addresses'],
    queryFn: async () => {
      try {
        return await apiClient.get('/client/addresses');
      } catch {
        return { addresses: [] };
      }
    },
  });

  const addresses = addressesData?.addresses || [];

  const { mutate: setDefault } = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/client/addresses/${id}/default`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', 'addresses'] });
      showToast('Default address updated', 'success');
    },
  });

  const { mutate: deleteAddress } = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/client/addresses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', 'addresses'] });
      showToast('Address removed', 'success');
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Address Book</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {addresses.length > 0 ? (
          addresses.map((address: any) => (
            <div
              key={address.id}
              className={`p-4 border rounded-lg ${
                address.is_default ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{address.label || 'Home'}</p>
                  <p className="text-sm text-gray-600">{address.street}</p>
                  <p className="text-sm text-gray-600">
                    {address.city}, {address.state} {address.zip_code}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {address.is_default ? (
                    <span className="text-sm font-medium text-blue-600">Default</span>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => setDefault(address.id)}>
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm('Remove this address?')) {
                        deleteAddress(address.id);
                      }
                    }}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center py-4">No addresses saved yet.</p>
        )}
        <Button variant="outline" className="w-full" onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </CardContent>
    </Card>
  );
}

// Notification Preferences Tab
function NotificationPreferencesTab() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { data: preferencesData } = useQuery({
    queryKey: ['notifications', 'preferences'],
    queryFn: () => apiClient.get('/notifications/preferences'),
  });

  const [preferences, setPreferences] = useState({
    email: preferencesData?.preferences?.email ?? true,
    sms: preferencesData?.preferences?.sms ?? true,
    push: preferencesData?.preferences?.push ?? false,
    jobUpdates: preferencesData?.preferences?.jobUpdates ?? true,
    marketing: preferencesData?.preferences?.marketing ?? false,
  });

  const { mutate: updatePreferences } = useMutation({
    mutationFn: (data: any) => apiClient.put('/notifications/preferences', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'preferences'] });
      showToast('Preferences saved!', 'success');
    },
  });

  const handleSave = () => {
    updatePreferences(preferences);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer">
          <span className="text-gray-900">Email notifications</span>
          <input
            type="checkbox"
            checked={preferences.email}
            onChange={(e) => setPreferences({ ...preferences, email: e.target.checked })}
            className="rounded"
          />
        </label>
        <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer">
          <span className="text-gray-900">SMS notifications</span>
          <input
            type="checkbox"
            checked={preferences.sms}
            onChange={(e) => setPreferences({ ...preferences, sms: e.target.checked })}
            className="rounded"
          />
        </label>
        <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer">
          <span className="text-gray-900">Push notifications</span>
          <input
            type="checkbox"
            checked={preferences.push}
            onChange={(e) => setPreferences({ ...preferences, push: e.target.checked })}
            className="rounded"
          />
        </label>
        <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer">
          <span className="text-gray-900">Job updates</span>
          <input
            type="checkbox"
            checked={preferences.jobUpdates}
            onChange={(e) => setPreferences({ ...preferences, jobUpdates: e.target.checked })}
            className="rounded"
          />
        </label>
        <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer">
          <span className="text-gray-900">Marketing emails</span>
          <input
            type="checkbox"
            checked={preferences.marketing}
            onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
            className="rounded"
          />
        </label>
        <Button variant="primary" onClick={handleSave}>
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}

// Credit Settings Tab
function CreditSettingsTab() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [autoRefill, setAutoRefill] = useState(false);
  const [threshold, setThreshold] = useState(50);
  const [amount, setAmount] = useState(100);

  // Get current credit balance
  const { data: creditsData } = useQuery({
    queryKey: ['credits', 'balance'],
    queryFn: async () => {
      try {
        return await apiClient.get('/credits/balance');
      } catch {
        return { balance: 0 };
      }
    },
  });

  // Get preferences
  const { data: preferencesData } = useQuery({
    queryKey: ['client', 'preferences'],
    queryFn: () => clientEnhancedService.getPreferences(),
  });

  const { mutate: savePreferences } = useMutation({
    mutationFn: (prefs: any) => clientEnhancedService.savePreferences(prefs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', 'preferences'] });
      showToast('Preferences saved!', 'success');
    },
  });

  const { mutate: setupAutoRefill } = useMutation({
    mutationFn: (config: any) => clientEnhancedService.setupCreditAutoRefill(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits', 'balance'] });
      showToast('Auto-refill configured!', 'success');
    },
  });

  const handleSave = () => {
    if (autoRefill) {
      setupAutoRefill({
        enabled: true,
        threshold,
        amount,
      });
    } else {
      setupAutoRefill({ enabled: false });
    }
  };

  const balance = creditsData?.balance || 0;
  const isLowBalance = balance < threshold;

  return (
    <div className="space-y-4">
      {/* Current Balance Card */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Credit Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-4xl font-bold text-gray-900 mb-2">${balance.toFixed(2)}</p>
            {isLowBalance && autoRefill && (
              <p className="text-sm text-orange-600">
                Balance is low. Auto-refill will trigger soon.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Credit Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer">
            <div>
              <span className="text-gray-900 font-medium">Auto-refill credits</span>
              <p className="text-sm text-gray-600">Automatically purchase credits when balance is low</p>
            </div>
            <input
              type="checkbox"
              checked={autoRefill}
              onChange={(e) => setAutoRefill(e.target.checked)}
              className="rounded"
            />
          </label>
        {autoRefill && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refill when balance falls below
              </label>
              <Input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
                placeholder="50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refill amount
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                placeholder="100"
              />
            </div>
          </>
        )}
        <Button variant="primary" onClick={handleSave}>
          Save Settings
        </Button>
      </CardContent>
    </Card>
    </div>
  );
}
