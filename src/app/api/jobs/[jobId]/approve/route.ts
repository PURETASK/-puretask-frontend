import { NextResponse } from 'next/server';

export type ApproveBody = { rating?: number; note?: string };

/**
 * POST /api/jobs/[jobId]/approve
 * Stub: create timeline event "client_approved", release funds, update job status to completed.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
  const body = (await request.json()).catch(() => ({})) as ApproveBody;
  // TODO: persist client_approved event, trigger payout/credits
  return NextResponse.json({ ok: true, jobId, rating: body?.rating });
}
