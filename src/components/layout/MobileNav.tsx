'use client';

import React, { useState } from 'react';
import { Menu, X, Home, Calendar, MessageSquare, User, Settings, LogOut, Trophy, Target, Award, Medal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/client/bookings', label: 'Bookings', icon: Calendar },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
    { href: '/client/settings', label: 'Settings', icon: Settings },
  ];

  const cleanerNavItems = [
    { href: '/cleaner/dashboard', label: 'Dashboard', icon: Home },
    { href: '/cleaner/progress', label: 'Progress', icon: Trophy },
    { href: '/cleaner/goals', label: 'Goals', icon: Target },
    { href: '/cleaner/rewards', label: 'Rewards', icon: Award },
    { href: '/cleaner/badges', label: 'Badges', icon: Medal },
    { href: '/cleaner/calendar', label: 'Calendar', icon: Calendar },
    { href: '/cleaner/jobs/requests', label: 'Jobs', icon: Calendar },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
    { href: '/cleaner/profile', label: 'Profile', icon: User },
  ];

  const adminNavItems = [
    { href: '/admin', label: 'Admin Panel', icon: Home },
    { href: '/admin/gamification', label: 'Gamification', icon: Trophy },
    { href: '/admin/gamification/flags', label: 'Flags', icon: Settings },
    { href: '/admin/gamification/goals', label: 'Goals Library', icon: Target },
    { href: '/admin/gamification/rewards', label: 'Rewards', icon: Award },
    { href: '/admin/gamification/choices', label: 'Choice Groups', icon: Award },
    { href: '/admin/gamification/governor', label: 'Governor', icon: Settings },
    { href: '/admin/gamification/abuse', label: 'Abuse Monitor', icon: Settings },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
  ];

  const items =
    user?.role === 'cleaner'
      ? cleanerNavItems
      : user?.role === 'admin'
        ? adminNavItems
        : navItems;

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn('lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900', className)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          <nav className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 lg:hidden transform transition-transform">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {user && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.email}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors min-h-[44px]"
                    aria-label={item.label}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              {user && (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors min-h-[44px]"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </nav>
        </>
      )}
    </>
  );
}
