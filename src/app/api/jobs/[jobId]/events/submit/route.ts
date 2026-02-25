import { NextResponse } from 'next/server';

/**
 * POST /api/jobs/[jobId]/events/submit
 * Stub: require before_photos_uploaded + after_photos_uploaded, then create "job_submitted" and move to awaiting_approval.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
  // TODO: guardrail - if no before/after photos return 400 "Upload before and after photos first"
  // TODO: persist timeline event job_submitted, update job status
  return NextResponse.json({ ok: true, jobId });
}
