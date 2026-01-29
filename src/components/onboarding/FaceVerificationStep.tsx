// src/components/onboarding/FaceVerificationStep.tsx
// Step 4: Face Photo Upload

'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
// Using regular img tag for now (can switch to Next.js Image if needed)

interface FaceVerificationStepProps {
  onNext: (file: File) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export function FaceVerificationStep({ onNext, onBack, isLoading }: FaceVerificationStepProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onNext(selectedFile);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload your profile photo</h2>
          <p className="text-gray-600">
            Upload a clear face photo. This helps clients recognize and trust you.
          </p>
        </div>

        {/* File upload area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          {preview ? (
            <div className="space-y-4">
              <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-blue-200">
                <img
                  src={preview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-sm text-gray-600">
                {selectedFile?.name}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedFile(null);
                  setPreview(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                Choose Different Photo
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl">📷</div>
              <div>
                <label className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700 font-medium">
                    Click to upload
                  </span>
                  <span className="text-gray-600"> or drag and drop</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, or WebP up to 5MB. Face must be clearly visible.
              </p>
            </div>
          )}
        </div>

        {/* Requirements */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-900">
            <strong>Photo requirements:</strong>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Clear face shot (head and shoulders)</li>
              <li>Good lighting</li>
              <li>Professional appearance</li>
              <li>No filters or heavy editing</li>
            </ul>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          {onBack && (
            <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
              ← Back
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? 'Uploading...' : 'Continue →'}
          </Button>
        </div>
      </div>
    </form>
  );
}
