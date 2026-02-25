import { NextResponse } from 'next/server';

export type CommitPhotoBody = {
  kind: 'before' | 'after' | 'client_dispute';
  key: string;
  contentType: string;
  bytes: number;
};

/**
 * POST /api/jobs/[jobId]/photos/commit
 * Stub: record photo in JobPhotos and create timeline event (before_photos_uploaded / after_photos_uploaded).
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
  const body = (await request.json()) as CommitPhotoBody;
  const { kind, key, contentType, bytes } = body ?? {};
  if (!kind || !key) {
    return NextResponse.json({ error: 'Missing kind or key' }, { status: 400 });
  }
  // TODO: persist JobPhoto row, append timeline event
  return NextResponse.json({ ok: true, jobId, key });
}
