import { NextResponse } from 'next/server';

export type CheckInBody = { lat: number; lng: number };

/**
 * POST /api/jobs/[jobId]/events/check-in
 * Stub: validate GPS near job address, create timeline event "gps_check_in".
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
  const body = (await request.json()) as CheckInBody;
  const { lat, lng } = body ?? {};
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return NextResponse.json({ error: 'Missing lat/lng' }, { status: 400 });
  }
  // TODO: check distance to job; if too far return 400 with message "Move closer to address to check in"
  // TODO: persist timeline event
  return NextResponse.json({ ok: true, jobId });
}
