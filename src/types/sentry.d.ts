declare module '@sentry/nextjs' {
  interface InitOptions {
    dsn?: string;
    environment?: string;
    tracesSampleRate?: number;
    replaysSessionSampleRate?: number;
    replaysOnErrorSampleRate?: number;
    integrations?: unknown[];
  }
  export function init(options: InitOptions): void;
  export function captureException(error: Error, options?: { extra?: Record<string, unknown> }): void;
  export function setUser(user: { id: string; email?: string; role?: string } | null): void;
  export class BrowserTracing {}
  export class Replay {}
}
