export type JobStatus = 'booked' | 'on_route' | 'working' | 'completed';

const ORDER: JobStatus[] = ['booked', 'on_route', 'working', 'completed'];

/** Map backend job/booking status to rail status for JobStatusRail. */
export function mapBackendJobStatusToRail(backendStatus: string): JobStatus {
  const s = (backendStatus || '').toLowerCase();
  if (['pending', 'accepted', 'requested', 'scheduled'].includes(s)) return 'booked';
  if (s === 'on_my_way') return 'on_route';
  if (['in_progress', 'awaiting_approval'].includes(s)) return 'working';
  if (s === 'completed') return 'completed';
  return 'booked';
}

export function getStatusIndex(status: JobStatus): number {
  return Math.max(0, ORDER.indexOf(status));
}

export function getStatusLabel(status: JobStatus): string {
  switch (status) {
    case 'booked':
      return 'Booked';
    case 'on_route':
      return 'On route';
    case 'working':
      return 'Working';
    case 'completed':
      return 'Completed';
  }
}

export function getStatusOrder(): JobStatus[] {
  return ORDER;
}
