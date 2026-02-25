import { apiClient } from '@/lib/api';

export type UploadKind = 'before' | 'after' | 'client_dispute';

/**
 * Photo upload flow: POST /uploads/sign → PUT to putUrl → POST /jobs/:jobId/photos/commit.
 */

/** POST /uploads/sign — returns putUrl, key, optional publicUrl */
export async function signUpload(input: {
  jobId: string;
  kind: UploadKind;
  fileName: string;
  contentType: string;
  bytes: number;
}) {
  const data = await apiClient.post<{ putUrl: string; key: string; publicUrl?: string }>(
    '/uploads/sign',
    input
  );
  return data as { putUrl: string; key: string; publicUrl?: string };
}

/** PUT to the signed putUrl (direct to storage). */
export async function putToSignedUrl(putUrl: string, file: File) {
  const res = await fetch(putUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  if (!res.ok) throw new Error(`Upload failed (${res.status})`);
}

/** POST /jobs/:jobId/photos/commit — after PUT to putUrl */
export async function commitPhoto(input: {
  jobId: string;
  kind: UploadKind;
  key: string;
  contentType: string;
  bytes: number;
}) {
  return apiClient.post(`/jobs/${input.jobId}/photos/commit`, input);
}
