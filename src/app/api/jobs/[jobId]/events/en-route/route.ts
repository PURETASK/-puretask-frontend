import { NextResponse } from 'next/server';

/**
 * POST /api/jobs/[jobId]/events/en-route
 * Stub: in production, create timeline event "en_route_sent" and notify client.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
  // TODO: persist timeline event, push notification
  return NextResponse.json({ ok: true, jobId });
}
