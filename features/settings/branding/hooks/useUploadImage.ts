'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { uploadBrandingImage } from '../api';

export function useUploadImage() {
  return useMutation({
    mutationFn: ({ file, type }: { file: File; type: 'logo' | 'social' }) =>
      uploadBrandingImage(file, type),
    onError: (err: Error) => {
      toast.error('Upload failed', {
        description: err.message ?? 'Could not upload image. Please try again.',
      });
    },
  });
}
