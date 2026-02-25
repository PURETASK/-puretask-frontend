'use client';

import React from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { PhotoUploader } from '@/components/upload/PhotoUploader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function CleanerUploadPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const sp = useSearchParams();
  const r = useRouter();
  const kind = (sp.get('kind') as 'before' | 'after') ?? 'before';

  if (!jobId) return null;

  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Upload {kind} photos</CardTitle>
      </CardHeader>
      <CardContent>
        <PhotoUploader
          jobId={jobId}
          kind={kind}
          title={kind === 'before' ? 'Before photos' : 'After photos'}
          minRequired={1}
          onDone={() => r.push(`/cleaner/job/${jobId}/workflow`)}
        />
      </CardContent>
    </Card>
  );
}
