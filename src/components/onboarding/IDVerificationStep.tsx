// src/components/onboarding/IDVerificationStep.tsx
// Step 5: ID Verification

'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';

interface IDVerificationStepProps {
  onNext: (file: File, documentType: 'drivers_license' | 'passport' | 'state_id') => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export function IDVerificationStep({ onNext, onBack, isLoading }: IDVerificationStepProps) {
  const [documentType, setDocumentType] = useState<'drivers_license' | 'passport' | 'state_id' | ''>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert('Please select an image (JPG, PNG) or PDF file');
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);

      // Create preview for images only
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile && documentType) {
      onNext(selectedFile, documentType as 'drivers_license' | 'passport' | 'state_id');
    }
  };

  const canContinue = documentType !== '' && selectedFile !== null;

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your identity</h2>
          <p className="text-gray-600">
            Upload a government-issued ID for identity verification. This information is kept secure and private.
          </p>
        </div>

        {/* Document type selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Type <span className="text-red-500">*</span>
          </label>
          <div className="grid gap-3">
            <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="document_type"
                value="drivers_license"
                checked={documentType === 'drivers_license'}
                onChange={(e) => setDocumentType(e.target.value as any)}
                className="w-4 h-4 text-blue-600"
              />
              <div>
                <div className="font-medium text-gray-900">Driver's License</div>
                <div className="text-sm text-gray-600">US state-issued driver's license</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="document_type"
                value="state_id"
                checked={documentType === 'state_id'}
                onChange={(e) => setDocumentType(e.target.value as any)}
                className="w-4 h-4 text-blue-600"
              />
              <div>
                <div className="font-medium text-gray-900">State ID</div>
                <div className="text-sm text-gray-600">US state-issued identification card</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="document_type"
                value="passport"
                checked={documentType === 'passport'}
                onChange={(e) => setDocumentType(e.target.value as any)}
                className="w-4 h-4 text-blue-600"
              />
              <div>
                <div className="font-medium text-gray-900">Passport</div>
                <div className="text-sm text-gray-600">Valid passport (US or international)</div>
              </div>
            </label>
          </div>
        </div>

        {/* File upload */}
        {documentType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Document <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              {preview ? (
                <div className="space-y-4">
                  <div className="relative w-full max-w-md mx-auto aspect-video rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={preview}
                      alt="Document preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-sm text-gray-600">{selectedFile?.name}</div>
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
                    Choose Different File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-4xl">📄</div>
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
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    JPG, PNG, or PDF up to 10MB. Ensure all text is clearly visible.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Security notice */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm text-green-900">
            <strong>🔒 Secure & Private:</strong> Your ID documents are encrypted and stored securely.
            They are only used for identity verification and are never shared with clients.
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
            disabled={!canContinue || isLoading}
          >
            {isLoading ? 'Uploading...' : 'Continue →'}
          </Button>
        </div>
      </div>
    </form>
  );
}
