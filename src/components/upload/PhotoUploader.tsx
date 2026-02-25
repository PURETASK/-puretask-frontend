'use client';

import React, { useState } from 'react';
import { GradientButton } from '@/components/brand/GradientButton';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  signUpload,
  putToSignedUrl,
  commitPhoto,
  type UploadKind,
} from '@/services/uploads';

export function PhotoUploader({
  jobId,
  kind,
  title,
  minRequired = 1,
  onDone,
  onUploadedKeys,
}: {
  jobId: string;
  kind: UploadKind;
  title: string;
  minRequired?: number;
  onDone?: () => void;
  /** Called after upload with storage keys (for tracking check-in/check-out) */
  onUploadedKeys?: (keys: string[]) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const canSubmit = files.length >= minRequired && !busy;

  async function handleUpload() {
    setBusy(true);
    setError(null);
    setProgress({ current: 0, total: files.length });
    const keys: string[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress({ current: i + 1, total: files.length });
        const signed = await signUpload({
          jobId,
          kind,
          fileName: file.name,
          contentType: file.type,
          bytes: file.size,
        });
        await putToSignedUrl(signed.putUrl, file);
        await commitPhoto({
          jobId,
          kind,
          key: signed.key,
          contentType: file.type,
          bytes: file.size,
        });
        keys.push(signed.key);
      }
      setProgress(null);
      onUploadedKeys?.(keys);
      onDone?.();
    } catch (e) {
      setProgress(null);
      setError(e instanceof Error ? e.message : 'Upload failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs opacity-70">
            Upload {minRequired}+ image(s). Multiple allowed.
          </div>
        </div>
        <Badge
          className="rounded-full"
          style={{ background: 'rgba(40,199,111,0.14)', color: '#1D2533' }}
        >
          {files.length} selected
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-full border bg-slate-50 px-5 py-3 text-sm">
          Choose images
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
        </label>

        {files.length > 0 && (
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => setFiles([])}
          >
            Clear
          </Button>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {files.slice(0, 6).map((f) => (
            <div key={f.name} className="rounded-3xl bg-slate-50 p-4">
              <div className="text-xs font-semibold">{f.name}</div>
              <div className="text-[11px] opacity-70">
                {Math.round(f.size / 1024)} KB
              </div>
            </div>
          ))}
          {files.length > 6 && (
            <div className="text-xs opacity-70">+{files.length - 6} more…</div>
          )}
        </div>
      )}

      {progress && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Uploading…</span>
            <span>{progress.current} / {progress.total}</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center justify-between gap-2">
          <p className="text-sm text-red-800">{error}</p>
          <Button variant="outline" size="sm" onClick={() => { setError(null); handleUpload(); }}>
            Retry
          </Button>
        </div>
      )}

      <div className="mt-4">
        <GradientButton disabled={!canSubmit} onClick={handleUpload}>
          {busy ? 'Uploading...' : 'Upload & attach to job'}
        </GradientButton>
      </div>
    </div>
  );
}
