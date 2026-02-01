// src/lib/offline.ts
// Offline detection and handling for frontend

/**
 * Check if device is offline
 */
export function isOffline(): boolean {
  if (typeof navigator === "undefined") return false;
  return !navigator.onLine;
}

/**
 * Listen for online/offline events
 */
export function onOnlineStatusChange(
  callback: (isOnline: boolean) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}

/**
 * React hook for online status
 * Note: Import this from hooks/useOnlineStatus.ts
 */

/**
 * Queue requests when offline
 */
class OfflineQueue {
  private queue: Array<{
    id: string;
    request: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const id = `${Date.now()}-${Math.random()}`;
      this.queue.push({ id, request, resolve, reject });

      // Try to process if online
      if (!isOffline()) {
        this.process();
      }
    });
  }

  async process(): Promise<void> {
    if (isOffline() || this.queue.length === 0) return;

    const item = this.queue.shift();
    if (!item) return;

    try {
      const result = await item.request();
      item.resolve(result);
    } catch (error) {
      item.reject(error);
    }

    // Process next item
    if (this.queue.length > 0) {
      await this.process();
    }
  }

  getQueueLength(): number {
    return this.queue.length;
  }
}

export const offlineQueue = new OfflineQueue();

// Auto-process queue when coming back online
if (typeof window !== "undefined") {
  onOnlineStatusChange((isOnline) => {
    if (isOnline) {
      offlineQueue.process();
    }
  });
}
