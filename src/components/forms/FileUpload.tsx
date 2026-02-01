'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, File } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onUpload: (files: File[]) => Promise<void>;
  onRemove?: (file: File) => void;
  preview?: boolean;
  className?: string;
  label?: string;
}

export function FileUpload({
  accept = 'image/*',
  multiple = false,
  maxSize = 5,
  onUpload,
  onRemove,
  preview = true,
  className,
  label = 'Upload files',
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const validateFile = (file: File): string | null => {
    // Size validation
    if (file.size > maxSize * 1024 * 1024) {
      return `File ${file.name} exceeds maximum size of ${maxSize}MB`;
    }

    // Type validation
    if (accept && !accept.includes('*')) {
      const acceptedTypes = accept.split(',').map((t) => t.trim());
      const fileType = file.type;
      if (!acceptedTypes.some((type) => fileType.match(type.replace('*', '')))) {
        return `File ${file.name} is not an accepted type`;
      }
    }

    return null;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newErrors: string[] = [];
    const validFiles: File[] = [];

    selectedFiles.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    setErrors(newErrors);

    if (validFiles.length > 0) {
      const filesToAdd = multiple ? [...files, ...validFiles] : validFiles;
      setFiles(filesToAdd);

      // Auto-upload if onUpload is provided
      if (onUpload) {
        setUploading(true);
        setProgress(0);

        try {
          // Simulate progress
          const progressInterval = setInterval(() => {
            setProgress((prev) => {
              if (prev >= 90) {
                clearInterval(progressInterval);
                return 90;
              }
              return prev + 10;
            });
          }, 100);

          await onUpload(filesToAdd);
          setProgress(100);
          clearInterval(progressInterval);
        } catch (error) {
          setErrors([...newErrors, error instanceof Error ? error.message : 'Upload failed']);
        } finally {
          setUploading(false);
          setTimeout(() => setProgress(0), 1000);
        }
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const fileToRemove = files[index];
    setFiles(files.filter((_, i) => i !== index));
    if (onRemove) {
      onRemove(fileToRemove);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    // Create a synthetic event for handleFileSelect
    const syntheticEvent = {
      target: { files: droppedFiles as any },
    } as React.ChangeEvent<HTMLInputElement>;
    handleFileSelect(syntheticEvent);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className={cn('space-y-4', className)}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
          uploading ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="space-y-2">
            <Upload className="h-8 w-8 text-blue-600 mx-auto animate-bounce" />
            <p className="text-sm text-gray-600">Uploading...</p>
            <ProgressBar value={progress} className="max-w-xs mx-auto" />
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="h-8 w-8 text-gray-400 mx-auto" />
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Select Files
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Drag and drop files here, or click to select
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Max size: {maxSize}MB • {accept}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          {errors.map((error, i) => (
            <p key={i} className="text-sm text-red-600">{error}</p>
          ))}
        </div>
      )}

      {/* File Previews */}
      {files.length > 0 && preview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              {file.type.startsWith('image/') ? (
                <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemove(index)}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="relative aspect-square rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50">
                  <File className="h-8 w-8 text-gray-400" />
                  <button
                    onClick={() => handleRemove(index)}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-600 mt-1 truncate" title={file.name}>
                {file.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
