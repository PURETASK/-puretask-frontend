'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { setUserContext, clearUserContext } from '@/lib/errorTracking';

export function ClientAnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setUserContext(user.id, user.role, user.email);
    } else {
      clearUserContext();
    }
  }, [user]);

  return <>{children}</>;
}
