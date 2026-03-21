'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiFetch } from '@/lib/api';
import { isImageUrl } from '../icon-picker-data';

interface ImageTabProps {
  value:    string;
  onSelect: (url: string) => void;
}

export function ImageTab({ value, onSelect }: ImageTabProps) {
  const inputRef                      = useRef<HTMLInputElement>(null);
  const [isDragging,  setIsDragging]  = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  const preview = isImageUrl(value) ? value : '';

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setError(null);
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const data = await apiFetch<{ url: string }>('/api/v1/upload/image?type=logo', {
        method: 'POST',
        body: form,
      });
      onSelect(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div className="space-y-3 p-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {preview ? (
        <>
          <div className="flex items-center justify-center rounded-lg border bg-muted/40 p-4">
            <Image
              src={preview}
              alt="Icon preview"
              width={48}
              height={48}
              className="rounded object-cover"
              unoptimized
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="flex-1 rounded-md border py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              {isUploading ? 'Uploading…' : 'Change image'}
            </button>
            <button
              type="button"
              onClick={() => onSelect('')}
              disabled={isUploading}
              className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
            >
              <X className="h-3 w-3" />
              Remove
            </button>
          </div>
        </>
      ) : (
        <div
          onClick={() => !isUploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors',
            isUploading && 'pointer-events-none opacity-60',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40',
          )}
        >
          <Upload className={cn('h-6 w-6 text-muted-foreground', isUploading && 'animate-bounce')} />
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              {isUploading ? 'Uploading…' : 'Click or drag image here'}
            </p>
            <p className="text-xs text-muted-foreground/60">PNG, JPG, WebP, SVG · max 5 MB</p>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
