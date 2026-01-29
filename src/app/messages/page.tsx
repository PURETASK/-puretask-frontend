'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChatWindow } from '@/components/features/messaging/ChatWindow';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SkeletonList } from '@/components/ui/Skeleton';
import { ErrorDisplay } from '@/components/error/ErrorDisplay';
import { EmptyMessages } from '@/components/ui/EmptyState';
import { useConversations } from '@/hooks/useMessages';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function MessagesPage() {
  return (
    <ProtectedRoute requiredRole={['client', 'cleaner']}>
      <MessagesPageContent />
    </ProtectedRoute>
  );
}

function MessagesPageContent() {
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: conversationsData, isLoading } = useConversations();
  const conversations = conversationsData?.conversations || [];

  const filteredConversations = conversations.filter((conv: any) =>
    conv.other_user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <Card className="lg:col-span-1 h-[700px] flex flex-col">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loading />
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {searchQuery ? 'No conversations found' : 'No messages yet'}
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredConversations.map((conv: any) => (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv)}
                        className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left ${
                          selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <Avatar
                          src={conv.other_user.avatar}
                          fallback={conv.other_user.name[0]}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-900 truncate">
                              {conv.other_user.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(conv.last_message_at), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {conv.last_message}
                          </p>
                        </div>
                        {conv.unread_count > 0 && (
                          <Badge variant="primary">{conv.unread_count}</Badge>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Chat Window */}
            <div className="lg:col-span-2">
              {selectedConversation ? (
                <ChatWindow
                  conversationId={selectedConversation.id}
                  recipientId={selectedConversation.other_user?.id}
                  recipientName={selectedConversation.other_user?.name || 'User'}
                  recipientAvatar={selectedConversation.other_user?.avatar}
                  jobId={selectedConversation.job_id}
                />
              ) : (
                <Card className="h-[700px] flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                    <p className="text-sm">
                      Choose a conversation from the list to start messaging
                    </p>
                  </div>
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
