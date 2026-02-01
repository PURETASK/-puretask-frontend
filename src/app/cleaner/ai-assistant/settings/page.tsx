'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

export default function AISettingsPage() {
  const [activeTab, setActiveTab] = useState('personality');
  const [settings, setSettings] = useState({
    tone: 'friendly',
    enthusiasmLevel: 60,
    detailLevel: 50,
    emojiLevel: 30,
    useEmojis: true,
    beWarm: true,
    useFormal: false,
    matchTone: true,
    autoReplyAvailability: true,
    autoReplyPricing: true,
    autoReplyService: true,
    autoReplyConfirmation: true,
    autoReplyChanges: false,
    autoReplyComplaints: false,
    responseDelay: 3,
    businessHoursOnly: true,
    notifyNoAnswer: true,
    notifyUpset: true,
    notifyHighValue: true,
    suggestTimes: true,
    upsellAddOns: true,
    sendFollowUp: true,
    requestReviews: true,
    reEngageClients: true,
    useClientName: true,
    referencePast: true,
    rememberPrefs: true,
  });

  const tabs = [
    { id: 'personality', label: 'Personality', icon: '🎭' },
    { id: 'automation', label: 'Automation', icon: '⚡' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Settings</h1>
              <p className="text-gray-600">Customize your AI assistant's behavior</p>
            </div>
            <Button variant="outline" onClick={() => (window.location.href = '/cleaner/ai-assistant')}>
              ← Back to Dashboard
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-6 py-3 font-medium transition-colors border-b-2',
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                )}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <Card>
            <CardContent className="p-8">
              {/* PERSONALITY TAB */}
              {activeTab === 'personality' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Tone</h3>
                    <div className="space-y-3">
                      {['professional', 'friendly', 'casual', 'formal'].map((tone) => (
                        <label key={tone} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="tone"
                            value={tone}
                            checked={settings.tone === tone}
                            onChange={(e) => setSettings({ ...settings, tone: e.target.value })}
                            className="form-radio"
                          />
                          <span className="text-gray-700 capitalize">{tone}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Communication Style</h3>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700">Enthusiastic</span>
                          <span className="text-gray-700">Calm</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={settings.enthusiasmLevel}
                          onChange={(e) => setSettings({ ...settings, enthusiasmLevel: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700">Detailed</span>
                          <span className="text-gray-700">Brief</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={settings.detailLevel}
                          onChange={(e) => setSettings({ ...settings, detailLevel: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700">Emoji heavy</span>
                          <span className="text-gray-700">Text only</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={settings.emojiLevel}
                          onChange={(e) => setSettings({ ...settings, emojiLevel: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Language Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.useEmojis}
                          onChange={(e) => setSettings({ ...settings, useEmojis: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-700">Use emojis occasionally</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.beWarm}
                          onChange={(e) => setSettings({ ...settings, beWarm: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-700">Be warm and personable</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.useFormal}
                          onChange={(e) => setSettings({ ...settings, useFormal: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-700">Use formal language</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.matchTone}
                          onChange={(e) => setSettings({ ...settings, matchTone: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-700">Match client's tone</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* AUTOMATION TAB */}
              {activeTab === 'automation' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Auto-Reply Rules</h3>
                    <p className="text-gray-600 mb-4">Choose which types of messages AI can automatically respond to:</p>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.autoReplyAvailability}
                          onChange={(e) => setSettings({ ...settings, autoReplyAvailability: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-700">Availability questions</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.autoReplyPricing}
                          onChange={(e) => setSettings({ ...settings, autoReplyPricing: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-700">Pricing inquiries</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.autoReplyService}
                          onChange={(e) => setSettings({ ...settings, autoReplyService: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-700">Service details</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.autoReplyConfirmation}
                          onChange={(e) => setSettings({ ...settings, autoReplyConfirmation: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-700">Confirmation requests</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.autoReplyChanges}
                          onChange={(e) => setSettings({ ...settings, autoReplyChanges: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-700">Booking changes</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.autoReplyComplaints}
                          onChange={(e) => setSettings({ ...settings, autoReplyComplaints: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-700">Complaints/issues (not recommended)</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Timing</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 mb-2">Response delay (looks more human):</label>
                        <div className="flex items-center gap-4">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={settings.responseDelay}
                            onChange={(e) => setSettings({ ...settings, responseDelay: parseInt(e.target.value) })}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <span className="text-gray-600">minutes</span>
                        </div>
                      </div>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.businessHoursOnly}
                          onChange={(e) => setSettings({ ...settings, businessHoursOnly: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-700">Auto-reply during business hours only (9 AM - 6 PM)</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Escalation</h3>
                    <p className="text-gray-600 mb-4">Notify me when:</p>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.notifyNoAnswer}
                          onChange={(e) => setSettings({ ...settings, notifyNoAnswer: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-700">AI can't answer</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.notifyUpset}
                          onChange={(e) => setSettings({ ...settings, notifyUpset: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-700">Client seems upset</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.notifyHighValue}
                          onChange={(e) => setSettings({ ...settings, notifyHighValue: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-700">Booking worth &gt; $500</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* PREFERENCES TAB */}
              {activeTab === 'preferences' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Features</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.suggestTimes}
                          onChange={(e) => setSettings({ ...settings, suggestTimes: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-700">Suggest available times automatically</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.upsellAddOns}
                          onChange={(e) => setSettings({ ...settings, upsellAddOns: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-700">Upsell add-on services</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.sendFollowUp}
                          onChange={(e) => setSettings({ ...settings, sendFollowUp: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-700">Send follow-up messages</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.requestReviews}
                          onChange={(e) => setSettings({ ...settings, requestReviews: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-700">Request reviews after completed jobs</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.reEngageClients}
                          onChange={(e) => setSettings({ ...settings, reEngageClients: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-700">Re-engage past clients automatically</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Personalization</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.useClientName}
                          onChange={(e) => setSettings({ ...settings, useClientName: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-700">Use client's name in messages</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.referencePast}
                          onChange={(e) => setSettings({ ...settings, referencePast: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-700">Reference past bookings</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.rememberPrefs}
                          onChange={(e) => setSettings({ ...settings, rememberPrefs: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-700">Remember client preferences</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Button variant="primary" size="lg" className="w-full md:w-auto">
                  💾 Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

