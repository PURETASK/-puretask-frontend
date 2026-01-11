'use client';

import React, { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
  isAiResponse?: boolean;
}

interface ChatWindowProps {
  recipientName: string;
  recipientStatus: 'online' | 'offline';
  messages: Message[];
  aiEnabled?: boolean;
}

export function ChatWindow({ recipientName, recipientStatus, messages, aiEnabled = false }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <Avatar alt={recipientName} size="md" fallback={recipientName.charAt(0)} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{recipientName}</h3>
            {aiEnabled && (
              <Badge variant="primary" className="text-xs">
                🤖 AI Assistant Active
              </Badge>
            )}
          </div>
          <p className={`text-sm ${recipientStatus === 'online' ? 'text-green-600' : 'text-gray-500'}`}>
            {recipientStatus === 'online' ? '● Online' : '○ Offline'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex flex-col">
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.sender === 'me'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p>{message.text}</p>
                <p className={`text-xs mt-1 ${message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {message.time}
                </p>
              </div>
              {message.isAiResponse && (
                <span className="text-xs text-gray-500 mt-1 ml-2">⚡ Replied instantly</span>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg">
              <p className="text-sm">💭 {recipientName} is typing...</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button variant="primary">Send</Button>
        </div>
      </div>
    </div>
  );
}
