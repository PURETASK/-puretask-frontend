import { NextResponse } from 'next/server';
import { getSignedPutUrl, jobPhotoKey } from '@/lib/storage';

export type SignUploadBody = {
  jobId: string;
  kind: 'before' | 'after' | 'client_dispute';
  fileName: string;
  contentType: string;
  bytes: number;
};

/**
 * POST /api/uploads/sign
 * Returns presigned PUT URL for direct upload to S3/R2.
 * Client then PUTs the file to putUrl and calls POST /api/jobs/[jobId]/photos/commit with key.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignUploadBody;
    const { jobId, kind, fileName, contentType, bytes } = body;
    if (!jobId || !kind || !fileName || !contentType) {
      return NextResponse.json(
        { error: 'Missing jobId, kind, fileName, or contentType' },
        { status: 400 }
      );
    }
    const key = jobPhotoKey(jobId, kind, fileName);
    const result = await getSignedPutUrl({ key, contentType, bytes });
    return NextResponse.json(result);
  } catch (e) {
    console.error('uploads/sign', e);
    return NextResponse.json({ error: 'Failed to sign upload' }, { status: 500 });
  }
}
