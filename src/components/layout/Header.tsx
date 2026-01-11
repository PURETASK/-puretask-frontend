'use client';

import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell } from '@/components/features/notifications/NotificationBell';

interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

export function Header({ onMenuClick, className }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const { user } = useAuth();

  return (
    <header className={cn('bg-white border-b border-gray-200 sticky top-0 z-50', className)}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Logo & Menu */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onMenuClick} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PT</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">PureTask</h1>
          </div>
        </div>

        {/* Center - Search (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search bookings, cleaners, clients..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setShowSearch(!showSearch)}>
            <Search className="h-5 w-5" />
          </Button>
          
          <NotificationBell />

          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" onClick={() => window.location.href = '/client/settings'}>
            <Avatar size="sm" fallback={user?.full_name?.[0] || user?.email?.[0] || 'U'} />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.full_name || user?.email || 'User'}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || 'user'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {showSearch && (
        <div className="px-4 pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      )}
    </header>
  );
}
