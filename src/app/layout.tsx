import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "@/contexts/QueryProvider";
import { ToastProvider } from "@/contexts/ToastContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { BottomNav } from "@/components/layout/BottomNav";
import { StructuredData } from "@/components/seo/StructuredData";
import { generateStructuredData } from "@/lib/seo/metadata";
import { AnalyticsInitializer } from "@/components/analytics/AnalyticsInitializer";
import { initErrorTracking } from "@/lib/errorTracking";
import { ClientAnalyticsProvider } from "@/components/analytics/ClientAnalyticsProvider";
import { SkipNav } from "@/components/layout/SkipNav";
import { initSentry } from "@/lib/monitoring/sentry";
import { initPerformanceMonitoring } from "@/lib/monitoring/performance";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PureTask - Professional Cleaning Services",
  description: "Book trusted cleaners in your area",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PureTask',
  },
  formatDetection: {
    telephone: false, // Disable auto-detection of phone numbers
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Organization structured data
  const organizationData = generateStructuredData('Organization', {
    name: 'PureTask',
    url: 'https://puretask.com',
    description: 'Professional cleaning services platform connecting clients with trusted cleaners',
  });

  return (
    <html lang="en">
      <head>
        <StructuredData data={organizationData} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SkipNav />
        <ErrorBoundary>
          <QueryProvider>
            <ToastProvider>
              <AuthProvider>
                <WebSocketProvider>
                  <NotificationProvider>
                    <ClientAnalyticsProvider>
                      <main id="main-content">
                        {children}
                      </main>
                      <ToastContainer />
                      <BottomNav />
                      <AnalyticsInitializer />
                    </ClientAnalyticsProvider>
                  </NotificationProvider>
                </WebSocketProvider>
              </AuthProvider>
            </ToastProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

// Initialize monitoring on client side (never block or crash the app)
if (typeof window !== 'undefined') {
  try {
    initErrorTracking();
    initSentry();
    initPerformanceMonitoring();
  } catch (_) {
    // ignore so app always loads
  }
}
