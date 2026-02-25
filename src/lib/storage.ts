/**
 * S3 / Cloudflare R2 signed URL helper.
 * Use for presigned PUT URLs so the client uploads directly to object storage.
 *
 * ENV (S3):
 *   S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY
 * ENV (R2): same + S3_ENDPOINT=<r2 endpoint>, S3_REGION=auto
 *
 * When S3_* env vars are set, uses @aws-sdk/client-s3 + s3-request-presigner for real presigned PUT.
 * When not set (e.g. local dev), returns a stub URL so the flow still runs (PUT will 404 until backend/S3 is configured).
 */

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export type SignedUploadInput = {
  key: string;
  contentType: string;
  bytes?: number;
  expiresInSeconds?: number;
};

export type SignedUploadResult = {
  putUrl: string;
  key: string;
  publicUrl?: string;
};

function getS3Client(): S3Client | null {
  const region = process.env.S3_REGION ?? 'us-east-1';
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const endpoint = process.env.S3_ENDPOINT;

  if (!accessKeyId || !secretAccessKey) return null;

  return new S3Client({
    region,
    ...(endpoint && { endpoint }),
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    ...(process.env.S3_FORCE_PATH_STYLE === 'true' && { forcePathStyle: true }),
  });
}

/**
 * Generate a presigned PUT URL for direct browser upload.
 * Uses AWS SDK v3 when S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY are set; otherwise returns a stub URL.
 */
export async function getSignedPutUrl(input: SignedUploadInput): Promise<SignedUploadResult> {
  const { key, contentType, expiresInSeconds = 3600 } = input;

  const bucket = process.env.S3_BUCKET ?? 'puretask-uploads';
  const region = process.env.S3_REGION ?? 'us-east-1';
  const endpoint = process.env.S3_ENDPOINT;

  const client = getS3Client();

  if (client) {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      ...(input.bytes != null && { ContentLength: input.bytes }),
    });
    const putUrl = await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
    return {
      putUrl,
      key,
      publicUrl: process.env.NEXT_PUBLIC_UPLOADS_BASE_URL
        ? `${process.env.NEXT_PUBLIC_UPLOADS_BASE_URL.replace(/\/$/, '')}/${key}`
        : undefined,
    };
  }

  // Stub for local dev without S3 credentials
  const baseUrl = endpoint
    ? `${endpoint}/${bucket}`
    : `https://${bucket}.s3.${region}.amazonaws.com`;
  const putUrl = `${baseUrl}/${key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=STUB&X-Amz-Date=${new Date().toISOString().slice(0, 10).replace(/-/g, '')}T000000Z&X-Amz-Expires=${expiresInSeconds}`;

  return {
    putUrl,
    key,
    publicUrl: process.env.NEXT_PUBLIC_UPLOADS_BASE_URL
      ? `${process.env.NEXT_PUBLIC_UPLOADS_BASE_URL.replace(/\/$/, '')}/${key}`
      : undefined,
  };
}

/**
 * Generate a unique storage key for a job photo.
 */
export function jobPhotoKey(jobId: string, kind: string, fileName: string): string {
  const ext = fileName.includes('.') ? fileName.slice(fileName.lastIndexOf('.')) : '.jpg';
  const slug = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  return `jobs/${jobId}/${kind}/${slug}${ext}`;
}
