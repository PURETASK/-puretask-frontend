declare module 'web-vitals' {
  interface Metric {
    name: string;
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    delta?: number;
    id: string;
  }
  type ReportCallback = (metric: Metric) => void;
  export function onCLS(fn: ReportCallback): void;
  export function onFID(fn: ReportCallback): void;
  export function onFCP(fn: ReportCallback): void;
  export function onLCP(fn: ReportCallback): void;
  export function onTTFB(fn: ReportCallback): void;
}
