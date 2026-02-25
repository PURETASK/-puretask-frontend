import { NextResponse } from 'next/server';

export type DisputeBody = { reason: string; details: string };

/**
 * POST /api/jobs/[jobId]/dispute
 * Stub: create timeline event "dispute_opened", create Dispute row, notify admin.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
  const body = (await request.json()) as DisputeBody;
  const { reason, details } = body ?? {};
  if (!reason) return NextResponse.json({ error: 'Missing reason' }, { status: 400 });
  // TODO: persist dispute, timeline event
  return NextResponse.json({ ok: true, jobId });
}
