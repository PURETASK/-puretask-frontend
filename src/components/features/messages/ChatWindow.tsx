'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { Card } from '@/components/ui/Card';
import { useMessages, useSendMessage, useRealtimeMessages } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { format, formatDistanceToNow } from 'date-fns';

interface ChatWindowProps {
  conversationId?: string;
  recipientId?: string;
  recipientName: string;
  recipientAvatar?: string;
  jobId?: string;
}

export function ChatWindow({
  conversationId,
  recipientId,
  recipientName,
  recipientAvatar,
  jobId,
}: ChatWindowProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use jobId if available, otherwise use conversationId
  const chatId = jobId || conversationId;
  const { data: messagesData, isLoading } = useMessages(chatId);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  useRealtimeMessages(chatId);

  const messages = messagesData?.messages || [];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !chatId) return;

    sendMessage(
      {
        recipientId: recipientId || '',
        content: newMessage,
        jobId: jobId,
      },
      {
        onSuccess: () => {
          setNewMessage('');
        },
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <Card className="h-[700px] flex items-center justify-center">
        <Loading size="md" text="Loading messages..." />
      </Card>
    );
  }

  return (
    <Card className="h-[700px] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <Avatar src={recipientAvatar} alt={recipientName} size="md" fallback={recipientName.charAt(0)} />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{recipientName}</h3>
          <p className="text-sm text-gray-500">Active now</p>
        </div>
        {jobId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/client/bookings/${jobId}`)}
          >
            View Job
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message: any) => {
            const isMe = message.sender_id === user?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex flex-col max-w-xs lg:max-w-md ${isMe ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.body || message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isMe ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {format(new Date(message.created_at), 'h:mm a')}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 px-1">
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg rounded-bl-none">
              <p className="text-sm">💭 {recipientName} is typing...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={!newMessage.trim() || isSending}
            isLoading={isSending}
          >
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
}
