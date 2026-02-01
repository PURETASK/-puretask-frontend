'use client';

import { useState, useEffect } from 'react';
import { isOffline, onOnlineStatusChange } from '@/lib/offline';

/**
 * React hook for online status
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(!isOffline());

  useEffect(() => {
    return onOnlineStatusChange(setIsOnline);
  }, []);

  return isOnline;
}
