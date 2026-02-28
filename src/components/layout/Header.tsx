'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Menu, Home, Users, Briefcase, Shield, LayoutDashboard, Trophy, CalendarPlus, CalendarCheck, Inbox, Wallet } from 'lucide-react';
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
  const pathname = usePathname();

  const navLink = (href: string, label: string, Icon: React.ComponentType<{ className?: string }>) => {
    const active = pathname === href || (href !== '/' && pathname?.startsWith(href));
    return (
      <Link href={href}>
        <span
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
            active
              ? 'bg-[var(--brand-blue)]/10 text-[var(--brand-blue)]'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </span>
      </Link>
    );
  };

  return (
    <header className={cn('sticky top-0 z-50 border-b border-gray-200/80 bg-white/80 backdrop-blur-md', className)}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Back Button & Logo */}
        <div className="flex items-center gap-3">
          <BackButton />
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-aqua))' }}
            >
              <span className="text-white font-bold text-lg">PT</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">PureTask</h1>
          </Link>
        </div>

        {/* Center - Main Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLink('/', 'Home', Home)}
          {user?.role === 'admin' && (
            <>
              {navLink('/admin', 'Admin', Shield)}
              {navLink('/admin/gamification', 'Gamification', Trophy)}
            </>
          )}
          {user?.role === 'cleaner' && (
            <>
              {navLink('/cleaner', 'Home', Home)}
              {navLink('/cleaner/today', 'Today', CalendarCheck)}
              {navLink('/cleaner/jobs/requests', 'Requests', Inbox)}
              {navLink('/cleaner/earnings', 'Earnings', Wallet)}
              {navLink('/cleaner/progress', 'Progress', Trophy)}
            </>
          )}
          {user?.role === 'client' && (
            <>
              {navLink('/client', 'Home', Home)}
              {navLink('/client/book', 'Book', CalendarPlus)}
              {navLink('/client/bookings', 'Bookings', CalendarCheck)}
              {navLink('/client/credits-trust', 'Credits', Wallet)}
            </>
          )}
          {(!user || user.role === 'client') && (
            <Link href="/cleaner/onboarding">
              <span className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200">
                <Briefcase className="h-4 w-4" />
                I'm a Cleaner
              </span>
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
              user.role === 'cleaner' ? '/cleaner' :
              '/client'
            }>
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200 cursor-pointer hover:bg-gray-100 p-2 rounded-xl transition-all duration-200">
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

      {/* Mobile nav strip */}
      <div className="md:hidden border-t border-gray-200 px-4 py-2 flex gap-2 overflow-x-auto">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 flex-shrink-0">
            <Home className="h-4 w-4" />
            Home
          </Button>
        </Link>
        {user?.role === 'client' && (
          <>
            <Link href="/client/book">
              <Button variant="ghost" size="sm" className="gap-2 flex-shrink-0">
                <CalendarPlus className="h-4 w-4" />
                Book
              </Button>
            </Link>
            <Link href="/client/bookings">
              <Button variant="ghost" size="sm" className="gap-2 flex-shrink-0">
                <CalendarCheck className="h-4 w-4" />
                Bookings
              </Button>
            </Link>
          </>
        )}
        {user?.role === 'cleaner' && (
          <>
            <Link href="/cleaner/today">
              <Button variant="ghost" size="sm" className="gap-2 flex-shrink-0">
                <CalendarCheck className="h-4 w-4" />
                Today
              </Button>
            </Link>
            <Link href="/cleaner/jobs/requests">
              <Button variant="ghost" size="sm" className="gap-2 flex-shrink-0">
                <Inbox className="h-4 w-4" />
                Requests
              </Button>
            </Link>
          </>
        )}
        {user?.role === 'admin' && (
          <Link href="/admin/gamification">
            <Button variant="ghost" size="sm" className="gap-2 flex-shrink-0">
              <Trophy className="h-4 w-4" />
              Gamification
            </Button>
          </Link>
        )}
        {(!user || user.role === 'client') && (
          <Link href="/cleaner/onboarding">
            <Button variant="ghost" size="sm" className="gap-2 flex-shrink-0">
              <Briefcase className="h-4 w-4" />
              I'm a Cleaner
            </Button>
          </Link>
        )}
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
