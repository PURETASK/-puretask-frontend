'use client';

import React, { useState } from 'react';
import { Search, Menu, Home, Users, Briefcase, Shield, LayoutDashboard, Trophy } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';
import { Avatar } from '@/components/ui/Avatar';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell } from '@/components/features/notifications/NotificationBell';
import { MobileNav } from './MobileNav';

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
        {/* Left side - Back Button & Logo */}
        <div className="flex items-center gap-3">
          <BackButton />
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">PT</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">PureTask</h1>
          </Link>
        </div>

        {/* Center - Main Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="md" className="gap-2">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
          
          {/* Admin-specific navigation */}
          {user?.role === 'admin' && (
            <>
              <Link href="/admin">
                <Button variant="ghost" size="md" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Admin Panel
                </Button>
              </Link>
              <Link href="/admin/gamification">
                <Button variant="ghost" size="md" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  Gamification
                </Button>
              </Link>
            </>
          )}
          
          {/* Cleaner-specific navigation */}
          {user?.role === 'cleaner' && (
            <>
              <Link href="/cleaner/dashboard">
                <Button variant="ghost" size="md" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  My Dashboard
                </Button>
              </Link>
              <Link href="/cleaner/progress">
                <Button variant="ghost" size="md" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  Progress
                </Button>
              </Link>
            </>
          )}
          
          {/* Client-specific navigation */}
          {user?.role === 'client' && (
            <>
              <Link href="/search">
                <Button variant="ghost" size="md" className="gap-2">
                  <Users className="h-4 w-4" />
                  Find a Cleaner
                </Button>
              </Link>
              <Link href="/client/dashboard">
                <Button variant="ghost" size="md" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  My Bookings
                </Button>
              </Link>
            </>
          )}
          
          {/* Show cleaner onboarding for non-logged-in users or clients */}
          {(!user || user.role === 'client') && (
            <Link href="/cleaner/onboarding">
              <Button variant="ghost" size="md" className="gap-2">
                <Briefcase className="h-4 w-4" />
                I'm a Cleaner
              </Button>
            </Link>
          )}
        </nav>

        {/* Right side - Search & User */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden lg:flex" 
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Toggle search"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          {user && <NotificationBell />}

          {user ? (
            <Link href={
              user.role === 'admin' ? '/admin' :
              user.role === 'cleaner' ? '/cleaner/dashboard' :
              '/client/dashboard'
            }>
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <Avatar size="sm" fallback={user?.full_name?.[0] || user?.email?.[0] || 'U'} />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.full_name || user?.email || 'User'}
                  </p>
                  <div className="mt-0.5">
                    <RoleBadge role={user.role} size="sm" />
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="primary" size="sm">Sign Up</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button - Replaced with MobileNav */}
          <MobileNav />
        </div>
      </div>

      {/* Legacy Mobile Navigation - Can be removed if MobileNav works well */}
      <div className="md:hidden border-t border-gray-200 px-4 py-2 flex gap-2 overflow-x-auto">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 flex-shrink-0">
            <Home className="h-4 w-4" />
            Home
          </Button>
        </Link>
        <Link href="/search">
          <Button variant="ghost" size="sm" className="gap-2 flex-shrink-0">
            <Users className="h-4 w-4" />
            Find Cleaner
          </Button>
        </Link>
        {user?.role === 'cleaner' && (
          <Link href="/cleaner/progress">
            <Button variant="ghost" size="sm" className="gap-2 flex-shrink-0">
              <Trophy className="h-4 w-4" />
              Progress
            </Button>
          </Link>
        )}
        {user?.role === 'admin' && (
          <Link href="/admin/gamification">
            <Button variant="ghost" size="sm" className="gap-2 flex-shrink-0">
              <Trophy className="h-4 w-4" />
              Gamification
            </Button>
          </Link>
        )}
        <Link href="/cleaner/onboarding">
          <Button variant="ghost" size="sm" className="gap-2 flex-shrink-0">
            <Briefcase className="h-4 w-4" />
            I'm a Cleaner
          </Button>
        </Link>
      </div>

      {/* Search Bar (when expanded) */}
      {showSearch && (
        <div className="px-4 pb-3 border-t border-gray-200">
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search bookings, cleaners, clients..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      )}
    </header>
  );
}
