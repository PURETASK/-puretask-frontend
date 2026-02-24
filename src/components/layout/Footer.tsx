import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn('bg-gray-900 text-gray-300 mt-auto', className)}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Company */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* For Clients */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">For Clients</h3>
            <ul className="space-y-2">
              <li><Link href="/search" className="hover:text-white transition-colors">Find a Cleaner</Link></li>
              <li><Link href="/booking" className="hover:text-white transition-colors">Book Now</Link></li>
              <li><Link href="/client/dashboard" className="hover:text-white transition-colors">Client Dashboard</Link></li>
              <li><Link href="/client/bookings" className="hover:text-white transition-colors">My Bookings</Link></li>
              <li><Link href="/client/recurring" className="hover:text-white transition-colors">Recurring Bookings</Link></li>
              <li><Link href="/client/settings" className="hover:text-white transition-colors">Settings</Link></li>
              <li><Link href="/favorites" className="hover:text-white transition-colors">Favorite Cleaners</Link></li>
              <li><Link href="/reviews" className="hover:text-white transition-colors">Write a Review</Link></li>
            </ul>
          </div>

          {/* For Cleaners */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">For Cleaners</h3>
            <ul className="space-y-2">
              <li><Link href="/cleaner/onboarding" className="hover:text-white transition-colors">Become a Cleaner</Link></li>
              <li><Link href="/cleaner/dashboard" className="hover:text-white transition-colors">Cleaner Dashboard</Link></li>
              <li><Link href="/cleaner/calendar" className="hover:text-white transition-colors">My Calendar</Link></li>
              <li><Link href="/cleaner/team" className="hover:text-white transition-colors">Team Management</Link></li>
              <li><Link href="/cleaner/certifications" className="hover:text-white transition-colors">Certifications</Link></li>
              <li><Link href="/cleaner/progress" className="hover:text-white transition-colors">Progress Tracking</Link></li>
              <li><Link href="/cleaner/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link></li>
            </ul>
          </div>

          {/* AI Assistant & Features */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">AI Assistant</h3>
            <ul className="space-y-2">
              <li><Link href="/cleaner/ai-assistant" className="hover:text-white transition-colors">AI Chat</Link></li>
              <li><Link href="/cleaner/ai-assistant/quick-responses" className="hover:text-white transition-colors">Quick Responses</Link></li>
              <li><Link href="/cleaner/ai-assistant/templates" className="hover:text-white transition-colors">Message Templates</Link></li>
              <li><Link href="/cleaner/ai-assistant/saved" className="hover:text-white transition-colors">Saved Messages</Link></li>
              <li><Link href="/cleaner/ai-assistant/history" className="hover:text-white transition-colors">Chat History</Link></li>
              <li><Link href="/cleaner/ai-assistant/analytics" className="hover:text-white transition-colors">Analytics</Link></li>
              <li><Link href="/cleaner/ai-assistant/settings" className="hover:text-white transition-colors">AI Settings</Link></li>
            </ul>
          </div>

          {/* Account & Support */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Account</h3>
            <ul className="space-y-2">
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link href="/auth/register" className="hover:text-white transition-colors">Sign Up</Link></li>
              <li><Link href="/auth/forgot-password" className="hover:text-white transition-colors">Forgot Password</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/messages" className="hover:text-white transition-colors">Messages</Link></li>
              <li><Link href="/notifications" className="hover:text-white transition-colors">Notifications</Link></li>
              <li><Link href="/referral" className="hover:text-white transition-colors">Referral Program</Link></li>
            </ul>
          </div>
        </div>

        {/* Gamification – all pages (Cleaner + Admin) */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <h3 className="text-white font-semibold text-lg mb-4">Gamification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-gray-400 font-medium text-sm uppercase tracking-wide mb-3">Cleaner (Progress & rewards)</h4>
              <ul className="space-y-2">
                <li><Link href="/cleaner/progress" className="hover:text-white transition-colors">Progress Hub</Link></li>
                <li><Link href="/cleaner/goals" className="hover:text-white transition-colors">Goals</Link></li>
                <li><Link href="/cleaner/rewards" className="hover:text-white transition-colors">Rewards</Link></li>
                <li><Link href="/cleaner/badges" className="hover:text-white transition-colors">Badges</Link></li>
                <li><Link href="/cleaner/stats" className="hover:text-white transition-colors">Stats</Link></li>
                <li><Link href="/cleaner/maintenance" className="hover:text-white transition-colors">Maintenance</Link></li>
                <li><Link href="/cleaner/progress/level/4" className="hover:text-white transition-colors">Level 4 Detail</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-400 font-medium text-sm uppercase tracking-wide mb-3">Admin</h4>
              <ul className="space-y-2">
                <li><Link href="/admin/gamification" className="hover:text-white transition-colors">Gamification Overview</Link></li>
                <li><Link href="/admin/gamification/flags" className="hover:text-white transition-colors">Feature Flags</Link></li>
                <li><Link href="/admin/gamification/goals" className="hover:text-white transition-colors">Goals Library</Link></li>
                <li><Link href="/admin/gamification/rewards" className="hover:text-white transition-colors">Rewards</Link></li>
                <li><Link href="/admin/gamification/choices" className="hover:text-white transition-colors">Choice Groups</Link></li>
                <li><Link href="/admin/gamification/governor" className="hover:text-white transition-colors">Governor</Link></li>
                <li><Link href="/admin/gamification/abuse" className="hover:text-white transition-colors">Abuse Monitor</Link></li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">Support debug: /admin/support/cleaner/[id]/gamification</p>
            </div>
          </div>
        </div>

        {/* Admin Section (Only show if user is admin - for now showing all) */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <h3 className="text-white font-semibold text-lg mb-4">Admin Portal</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link href="/admin/dashboard" className="hover:text-white transition-colors">Admin Dashboard</Link>
            <Link href="/admin/users" className="hover:text-white transition-colors">User Management</Link>
            <Link href="/admin/bookings" className="hover:text-white transition-colors">Booking Management</Link>
            <Link href="/admin/finance" className="hover:text-white transition-colors">Finance</Link>
            <Link href="/admin/analytics" className="hover:text-white transition-colors">Analytics</Link>
            <Link href="/admin/reports" className="hover:text-white transition-colors">Reports</Link>
            <Link href="/admin/communication" className="hover:text-white transition-colors">Communication</Link>
            <Link href="/admin/risk" className="hover:text-white transition-colors">Risk Management</Link>
            <Link href="/admin/settings" className="hover:text-white transition-colors">Admin Settings</Link>
            <Link href="/admin/api" className="hover:text-white transition-colors">API Management</Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">PT</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-xl">PureTask</h2>
                <p className="text-sm text-gray-400">Professional Cleaning Services</p>
              </div>
            </div>

            {/* Social Links (placeholder) */}
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-400">
              © {currentYear} PureTask. All rights reserved.
            </div>
          </div>
        </div>

        {/* Testing Link */}
        <div className="mt-4 text-center">
          <Link href="/api-test" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
            API Test Page
          </Link>
        </div>
      </div>
    </footer>
  );
}
