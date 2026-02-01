'use client';

import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';

const tools = [
  { href: '/admin/tools/legacy-admin-layout', title: 'Legacy Admin Layout', desc: 'Full legacy sidebar layout preview.' },
  { href: '/admin/tools/legacy-admin-login', title: 'Legacy Admin Login', desc: 'Legacy admin login UI preview.' },
  { href: '/admin/tools/ai-settings', title: 'Cleaner AI Settings', desc: 'Legacy AI settings dashboard.' },
  { href: '/admin/tools/ai-personality', title: 'AI Personality Wizard', desc: 'Legacy wizard for AI tone and automation.' },
  { href: '/admin/tools/achievements', title: 'Achievements', desc: 'Legacy achievements dashboard.' },
  { href: '/admin/tools/certifications', title: 'Certifications', desc: 'Legacy certification progression.' },
  { href: '/admin/tools/insights', title: 'AI Insights', desc: 'Legacy AI insights analytics.' },
  { href: '/admin/tools/onboarding-wizard', title: 'Onboarding Wizard', desc: 'Legacy interactive onboarding flow.' },
  { href: '/admin/tools/leaderboard', title: 'Leaderboard', desc: 'Legacy leaderboard UI.' },
  { href: '/admin/tools/quick-responses', title: 'Quick Responses', desc: 'Legacy quick response manager.' },
  { href: '/admin/tools/settings-card', title: 'Settings Card Demo', desc: 'Legacy settings card components demo.' },
  { href: '/admin/tools/template-creator', title: 'Template Creator', desc: 'Legacy template creation studio.' },
  { href: '/admin/tools/template-editor', title: 'Template Editor', desc: 'Legacy template editor demo.' },
  { href: '/admin/tools/template-library', title: 'Template Library', desc: 'Legacy template marketplace UI.' },
  { href: '/admin/tools/test-ai-assistant', title: 'Test AI Assistant', desc: 'Legacy AI assistant test harness.' },
  { href: '/admin/tools/tooltips', title: 'Tooltip System', desc: 'Legacy tooltip tutorial system.' },
];

export default function AdminToolsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8 px-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-yellow-700">Legacy Tools</p>
                <h1 className="text-2xl font-semibold text-gray-900">Admin Testing Tools</h1>
                <p className="text-sm text-gray-700 mt-2">
                  These are legacy UI tools migrated for testing. Use them during QA, then we can remove
                  the ones you don’t want to keep.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              {tools.map((tool) => (
                <Link key={tool.href} href={tool.href} className="block">
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <h2 className="text-lg font-semibold text-gray-900">{tool.title}</h2>
                      <p className="text-sm text-gray-600 mt-1">{tool.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
