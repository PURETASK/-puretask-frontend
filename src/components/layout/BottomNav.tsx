'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const clientNavItems = [
    { href: '/client/dashboard', label: 'Home', icon: Home },
    { href: '/client/bookings', label: 'Bookings', icon: Calendar },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
    { href: '/client/settings', label: 'Profile', icon: User },
  ];

  const cleanerNavItems = [
    { href: '/cleaner/dashboard', label: 'Home', icon: Home },
    { href: '/cleaner/calendar', label: 'Calendar', icon: Calendar },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
    { href: '/cleaner/profile', label: 'Profile', icon: User },
  ];

  const navItems = user?.role === 'cleaner' ? cleanerNavItems : clientNavItems;

  // Don't show on desktop or on certain pages
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/auth')) {
    return null;
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-50 safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-full min-h-[44px] transition-all duration-200 rounded-lg mx-1',
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={cn('h-5 w-5 transition-transform duration-200', isActive && 'text-blue-600 scale-110')} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
